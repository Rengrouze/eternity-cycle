import { basicRoll, skillRoll, performRoll, L5RRollKeep } from "../../dice/_module.mjs";
import { affinityRollBonus, computeSpellTargetTN, computeSpellDamageDice } from "../../rules/spellcasting.mjs";
import { canAttackInStance, attackStanceBonus } from "../../rules/stances.mjs";
import { buildInitiativeRollConfig } from "../../rules/initiative.mjs";
import { CONJURED_AMMO_ID } from "../../rules/ammo.mjs";
import { ACTION_COST, OFF_HAND_PENALTY, MELEE_RANGE_M } from "../../rules/actions.mjs";
import { clampAugmentations, augmentedTN } from "../../rules/augmentations.mjs";
import { computeManeuverCost, computeFeintBonus } from "../../rules/maneuvers.mjs";
import { PRONE_ARMOR_TN_MELEE_PENALTY, MOUNTED_HIGHER_BONUS } from "../../rules/conditions.mjs";
import { findSkillByName } from "../../rules/skills.mjs";

/**
 * Jets de dés de SystemActor : Trait/Anneau/Compétence/Sort/Dégâts/Attaque/
 * Initiative/Pleine Défense, et le jet de Force opposé partagé par les
 * Manœuvres Désarmement/Renversement. Voir module/documents/actor-document.mjs
 * pour la composition des mixins.
 * @param {typeof Actor} Base
 */
export const RollsMixin = (Base) =>
  class extends Base {
    /**
     * Lance un jet de Trait seul (sans Compétence pour l'instant). Si
     * `spendVoid` est coché dans la modale de jet, dépense réellement 1 Point
     * de Vide et ajoute +1k1 (voir #_applyVoidPointSpend). `augmentations`
     * (plafonnées par l'Anneau de Vide, voir module/rules/augmentations.mjs)
     * n'ont pas de ND de cible suivi pour un jet de Trait seul - simplement
     * affichées sur la carte de chat, au MJ d'en fixer les conséquences.
     * @param {string} traitKey Clé du trait, ex: "awa", "ref", ...
     * @param {{rollBonus?: number, keepBonus?: number, spendVoid?: boolean, isReaction?: boolean, augmentations?: number}} [options]
     * @returns {Promise<Roll|null>}
     */
    async rollTrait(traitKey, { rollBonus = 0, keepBonus = 0, spendVoid = false, isReaction = false, augmentations = 0 } = {}) {
      const traitRank = this.system.traits[traitKey];
      if (traitRank === undefined) {
        throw new Error(`Trait inconnu: ${traitKey}`);
      }
      if (!(await this._ensureCanRoll({ isReaction }))) return null;

      const voidBonus = await this._applyVoidPointSpend(spendVoid);
      const clampedAugmentations = clampAugmentations(augmentations, this.system.rings.void.rank);
      const label = game.i18n.localize(`L5R4EC.Trait.${this._traitLabelKey(traitKey)}`);
      const config = basicRoll({ rank: traitRank, rollBonus: rollBonus + voidBonus.rollBonus, keepBonus: keepBonus + voidBonus.keepBonus });
      this._applyConditionRollPenalty(config);

      const extra = clampedAugmentations ? { augmentations: clampedAugmentations } : {};
      return performRoll(this, config, `${game.i18n.localize("L5R4EC.Sheet.TraitRoll")} : ${label}`, extra);
    }

    /**
     * Lance un jet d'Anneau (Air/Terre/Feu/Eau/Vide) : même mécanique XgX
     * qu'un jet de Trait, juste une source de rang différente. Même gestion de
     * `spendVoid` que #rollTrait. Mêmes `augmentations` déclaratives, voir #rollTrait.
     * @param {string} ringKey Clé de l'Anneau : "air", "earth", "fire", "water", "void".
     * @param {{rollBonus?: number, keepBonus?: number, spendVoid?: boolean, isReaction?: boolean, augmentations?: number}} [options]
     * @returns {Promise<Roll|null>}
     */
    async rollRing(ringKey, { rollBonus = 0, keepBonus = 0, spendVoid = false, isReaction = false, augmentations = 0 } = {}) {
      const ring = this.system.rings[ringKey];
      if (ring === undefined) {
        throw new Error(`Anneau inconnu: ${ringKey}`);
      }
      if (!(await this._ensureCanRoll({ isReaction }))) return null;

      const voidBonus = await this._applyVoidPointSpend(spendVoid);
      const clampedAugmentations = clampAugmentations(augmentations, this.system.rings.void.rank);
      const label = game.i18n.localize(`L5R4EC.Ring.${this._ringLabelKey(ringKey)}`);
      const config = basicRoll({ rank: ring.rank, rollBonus: rollBonus + voidBonus.rollBonus, keepBonus: keepBonus + voidBonus.keepBonus });
      this._applyConditionRollPenalty(config);

      const extra = clampedAugmentations ? { augmentations: clampedAugmentations } : {};
      return performRoll(this, config, `${game.i18n.localize("L5R4EC.Sheet.RingRoll")} : ${label}`, extra);
    }

    /**
     * Lance un jet de Compétence : (Trait + rang de compétence)g(Trait),
     * plafonné à 10g10, n'explose que si entraînée (rang >= 1), relance les 1
     * si une spécialisation est appliquée à ce jet précis. Ajoute aussi les
     * bonus de maîtrise "skillRoll" de CETTE Compétence (voir #_sumMasteryBonus
     * - ex: Courtisan rang 5 -> +1k0 automatique ici) et l'Augmentation
     * gratuite au rang 10 (voir #_freeAugmentBonus), et la dépense de Point de
     * Vide (voir #_applyVoidPointSpend).
     *
     * Si cette Compétence a au moins une entrée "voidRecovery" (ex: Méditation,
     * Cérémonie du Thé - voir item-skill.mjs), la carte affiche un bouton
     * "Récupérer des Points de Vide" - le système ne modélise pas de TN pour un
     * jet de Compétence libre, donc le bouton est toujours affiché plutôt que
     * conditionné à une réussite non calculable ; c'est au joueur/MJ de
     * l'utiliser seulement si le jet est jugé réussi (même logique que le
     * bouton "Lancer les dégâts" sans cible, voir #rollAttack).
     * En combat, sur son propre tour, consomme une Action Complexe (voir
     * #spendActionPoints, module/rules/actions.mjs) - "Utiliser une Compétence"
     * fait partie des 3 Actions Complexes automatisées demandées ; bloque le
     * jet si le budget est insuffisant.
     * Mêmes `augmentations` déclaratives que #rollTrait (pas de ND de cible
     * suivi pour un jet de Compétence libre).
     * @param {string} itemId  Id de l'Item Compétence.
     * @param {{rollBonus?: number, keepBonus?: number, specialization?: string, spendVoid?: boolean, isReaction?: boolean, augmentations?: number}} [options]
     * @returns {Promise<Roll|null>}
     */
    async rollSkill(itemId, { rollBonus = 0, keepBonus = 0, specialization = "", spendVoid = false, isReaction = false, augmentations = 0 } = {}) {
      const item = this.items.get(itemId);
      if (!item || item.type !== "skill") {
        throw new Error(`Compétence introuvable: ${itemId}`);
      }
      if (!(await this._ensureCanRoll({ isReaction }))) return null;
      if (!(await this.spendActionPoints(ACTION_COST.COMPLEX)).ok) return null;

      const clampedAugmentations = clampAugmentations(augmentations, this.system.rings.void.rank);
      const masteryBonus = this._sumMasteryBonus(item, "skillRoll");
      const voidBonus = await this._applyVoidPointSpend(spendVoid);
      const traitRank = this._resolveTraitOrVoidRank(item.system.trait);
      const config = skillRoll({
        traitRank,
        skillRank: item.system.rank,
        specialized: Boolean(specialization),
        rollBonus: rollBonus + masteryBonus.rollBonus + voidBonus.rollBonus,
        keepBonus: keepBonus + masteryBonus.keepBonus + voidBonus.keepBonus
      });
      config.flatBonus += masteryBonus.flatBonus + this._freeAugmentBonus(item);
      this._applyConditionRollPenalty(config);

      const traitLabel = this._traitOrVoidLabel(item.system.trait);
      let flavor = `${item.name} (${traitLabel})`;
      if (specialization) flavor += ` – ${specialization}`;

      const hasVoidRecovery = (item.system.masteryBonuses ?? []).some((b) => b.trigger === "voidRecovery" && item.system.rank >= b.rankRequired);
      const extra = {
        ...(hasVoidRecovery ? { voidRecoveryButton: { actorId: this.id, amount: this._voidRecoveryAmount(item) } } : {}),
        ...(clampedAugmentations ? { augmentations: clampedAugmentations } : {})
      };

      return performRoll(this, config, flavor, extra);
    }

    /**
     * Lance un jet de Lancer de Sort : (rang d'École de Shugenja + rang de
     * l'Anneau du sort)g(rang de l'Anneau), même forme que rollSkill (École =
     * "compétence", Anneau = "trait"), avec le bonus/malus d'affinité de
     * l'Anneau ajouté aux dés lancés. Consomme un emplacement de sort dans le
     * pool de l'Anneau (ou le pool de Vide en secours) s'il en reste un ; sinon
     * avertit sans bloquer le jet (dépassement à la discrétion du MJ).
     *
     * Compare le résultat au TN du sort (+5 par Augmentation déclarée) pour
     * afficher une réussite/échec sur la carte de chat, et - en cas de
     * réussite d'un sort à dégâts bruts (system.damage.mode !== "none") -
     * ajoute un bouton "Lancer les dégâts" sur la carte (voir
     * module/chat/damage-chat-actions.mjs pour le clic). Ajoute aussi les
     * bonus de maîtrise "spellRoll" de la Compétence "Art de la Magie" si le
     * personnage l'a (voir #_sumMasteryBonus - ex: rang 5 -> +1k0 automatique),
     * et la dépense de Point de Vide (voir #_applyVoidPointSpend). Consomme une
     * Action Complexe en combat sur son propre tour (voir #spendActionPoints) -
     * "Lancer un sort" fait partie des 3 Actions Complexes automatisées.
     * @param {string} itemId  Id de l'Item Sort.
     * @param {{rollBonus?: number, keepBonus?: number, augmentations?: number, targets?: number, spendVoid?: boolean, isReaction?: boolean, targetActorId?: string|null, inRange?: boolean}} [options]
     * @returns {Promise<Roll|null>}
     */
    async rollSpell(itemId, { rollBonus = 0, keepBonus = 0, augmentations = 0, targets = 1, spendVoid = false, isReaction = false, targetActorId = null, inRange = false } = {}) {
      const item = this.items.get(itemId);
      if (!item || item.type !== "spell") {
        throw new Error(`Sort introuvable: ${itemId}`);
      }
      if (!(await this._ensureCanRoll({ isReaction }))) return null;

      // Portée de sort = texte libre (voir item-spell.mjs), pas de
      // vérification automatique de distance possible - honor system : si une
      // cible est choisie (menu déroulant de spell-cast.hbs, sinon repli sur
      // le ciblage natif de Foundry), la case "à portée" doit être cochée.
      // Aucun blocage si aucune cible n'est sélectionnée (sort personnel/AdE
      // sans cible principale).
      const targetActor = targetActorId
        ? this.constructor._resolveActor(targetActorId)
        : ([...game.user.targets][0]?.actor ?? null);
      if (targetActor && !inRange) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.SpellTargetNotConfirmedInRange", { name: this.name }));
        return null;
      }

      if (!(await this.spendActionPoints(ACTION_COST.COMPLEX)).ok) return null;

      const clampedAugmentations = clampAugmentations(augmentations, this.system.rings.void.rank);

      const ring = item.system.ring;
      const ringRank = this.system.rings[ring].rank;
      const schoolRank = this.system.shugenja.schoolRank;
      const affinity = this.system.shugenja.affinities[ring];

      const artOfMagicSkill = findSkillByName(this, "art de la magie");
      const spellMasteryBonus = this._sumMasteryBonus(artOfMagicSkill, "spellRoll");
      const voidBonus = await this._applyVoidPointSpend(spendVoid);

      const config = skillRoll({
        traitRank: ringRank,
        skillRank: schoolRank,
        rollBonus: rollBonus + affinityRollBonus(affinity) + spellMasteryBonus.rollBonus + voidBonus.rollBonus,
        keepBonus: keepBonus + spellMasteryBonus.keepBonus + voidBonus.keepBonus
      });
      config.flatBonus += spellMasteryBonus.flatBonus;
      this._applyConditionRollPenalty(config);

      const consumed = await this._consumeSpellSlot(ring);
      if (!consumed) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoSpellSlot", { name: item.name }));
      }

      const ringLabel = game.i18n.localize(`L5R4EC.Ring.${this._ringLabelKey(ring)}`);
      const flavor = `${game.i18n.localize("L5R4EC.Sheet.SpellRoll")} : ${item.name} (${ringLabel} ${item.system.masteryRank})`;
      const targetTN = computeSpellTargetTN(item.system.masteryRank, clampedAugmentations);

      return performRoll(this, config, flavor, (roll) => {
        const success = roll.keptTotal >= targetTN;
        const extra = {
          spellInfo: {
            name: item.name,
            ring: ringLabel,
            masteryRank: item.system.masteryRank,
            keywords: item.system.keywords,
            range: item.system.range,
            areaOfEffect: item.system.areaOfEffect,
            duration: item.system.duration,
            raises: item.system.raises
          },
          targetTN,
          success,
          augmentations: clampedAugmentations,
          targets
        };

        if (success) {
          const damageDice = computeSpellDamageDice(item.system.damage, {
            air: this.system.rings.air.rank,
            earth: this.system.rings.earth.rank,
            fire: this.system.rings.fire.rank,
            water: this.system.rings.water.rank,
            void: this.system.rings.void.rank
          });
          if (damageDice) {
            extra.damageButton = {
              actorId: this.id,
              itemName: item.name,
              rolled: damageDice.rolled,
              kept: damageDice.kept,
              note: item.system.damage.note,
              targetActorId: targetActor?.id ?? null
            };
          }
        }

        return extra;
      });
    }

    /**
     * Lance un jet de dégâts isolé (déclenché depuis le bouton "Lancer les
     * dégâts" d'une carte de Jet de Sort ou de Jet d'Attaque réussi - voir
     * module/chat/damage-chat-actions.mjs). Ne subit PAS le malus de blessure
     * du lanceur : c'est un jet de dégâts infligés à quelqu'un d'autre, pas une
     * action du lanceur lui-même.
     *
     * Si `targetActorId` est fourni (transmis depuis le bouton "Lancer les
     * dégâts" d'origine, lui-même hérité du ciblage de #rollAttack/#rollSpell -
     * voir tab-combat.hbs/spell-cast.hbs), la carte de CE jet de dégâts
     * affiche à son tour un bouton "Appliquer les dégâts" (voir
     * module/chat/damage-application-actions.mjs, SystemActor#applyDamage) -
     * déduit la Réduction d'Armure de la cible avant de l'ajouter à son
     * suivi de Blessures, toujours sous validation MJ obligatoire.
     * @param {string} itemName  Nom du sort/de l'arme, pour le texte de la carte.
     * @param {{rolled: number, kept: number, explodeOn?: number, flatBonus?: number, targetActorId?: string|null}} dice
     * @returns {Promise<Roll>}
     */
    async rollDamage(itemName, { rolled, kept, explodeOn = 10, flatBonus = 0, targetActorId = null } = {}) {
      const config = { rolled, keep: kept, explode: true, explodeOn, flatBonus };
      const flavor = `${game.i18n.localize("L5R4EC.Sheet.DamageRoll")} : ${itemName}`;
      const targetActor = targetActorId ? this.constructor._resolveActor(targetActorId) : null;

      return performRoll(this, config, flavor, (roll) => {
        if (!targetActor) return {};
        return {
          applyDamageButton: {
            attackerActorId: this.id,
            targetActorId: targetActor.id,
            targetName: targetActor.name,
            amount: roll.keptTotal
          }
        };
      }, false);
    }

    /**
     * Lance un jet d'Attaque avec une Arme équipée : (Trait associé + rang de
     * la Compétence liée)g(Trait), même forme qu'un jet de Compétence - la
     * Compétence est retrouvée par nom sur la fiche (system.associatedSkill,
     * texte libre, ex: "Kenjutsu") ; si introuvable, repli sur Agilité seule
     * (rang 0) avec un avertissement, plutôt que de bloquer le jet.
     *
     * Bloque si la posture actuelle interdit d'attaquer (Défense/Pleine
     * Défense/Centre). En Attaque Totale, ajoute +2k1 (voir
     * module/rules/stances.mjs).
     *
     * Si l'utilisateur a une cible Foundry sélectionnée (game.user.targets) et
     * que celle-ci a un TN d'Armure calculé, compare le résultat et n'affiche
     * le bouton "Lancer les dégâts" qu'en cas de réussite - sinon (pas de
     * cible), l'affiche toujours (l'arme touche par défaut, à l'appréciation
     * du meneur de jeu), même logique que rollSpell.
     *
     * Le DR proposé par le bouton "Lancer les dégâts" (et affiché dans la
     * carte) est le DR effectif, pas le DR brut de l'Arme :
     * - Arme de mêlée : Force du personnage ajoutée aux dés LANCÉS de l'Arme
     *   (ex: Katana 3g2 + Force 3 -> 6g2 - les dés GARDÉS restent ceux de
     *   l'Arme).
     * - Arme à distance : DR de la MUNITION (`ammoId`, obligatoire - voir
     *   CharacterSheet#promptRangedAttack) + Force de l'Arc (`strengthRating`
     *   de l'Arme) ajoutée aux dés LANCÉS de la munition (ex: Flèche Feuille
     *   de Saule 2g2 + Yumi Force 3 -> 5g2) - la munition est décomptée du
     *   stock à ce moment-là (sauf si `unlimited`), que le jet touche ou non
     *   (la flèche est tirée dans tous les cas). Si `ammoId` désigne la
     *   flèche invoquée d'un arc enchanté (CONJURED_AMMO_ID, voir
     *   WeaponDataModel.conjuresAmmo), utilise son propre DR
     *   (conjuredAmmoRolled/Kept) à la place, sans jamais rien décompter.
     *   Bloque si aucune Munition ni flèche invoquée disponible.
     * Le bonus de maîtrise "damageRoll" de la Compétence associée s'ajoute
     * dans les deux cas (ex: Kenjutsu rang 3 -> +1k0), de même que son
     * `explodeOn` éventuel (ex: Kenjutsu rang 7 -> dés de dégâts explosent
     * sur 9+ au lieu de 10 - voir #_sumMasteryBonus), transmis au bouton
     * "Lancer les dégâts" puis à #rollDamage.
     *
     * `conditionalDamageBonus` (voir CharacterSheet#_buildConditionalBonuses)
     * porte le total des cases "bonus conditionnel" cochées dans la modale de
     * jet (ex: Armes d'Hast rang 5, "Cible montée ou de grande taille") - le
     * joueur déclare la situation, le bonus s'ajoute au jet de dégâts comme
     * s'il était automatique (voir item-skill.mjs, champ `conditionLabel`).
     * `spendVoid` s'applique au jet d'ATTAQUE (+1k1), voir #_applyVoidPointSpend.
     *
     * Dégaine l'Arme automatiquement si besoin (voir #drawWeapon) avant de
     * consommer l'Action Complexe de l'attaque elle-même (voir
     * #spendActionPoints) - si l'Arme n'était pas encore `drawn` et que la
     * dégainer coûte une Action Simple, il ne restera plus assez de budget
     * pour l'Action Complexe de l'attaque ce même tour (2 points au total par
     * tour) : conforme à la règle - dégainer une Arme non petite ET attaquer
     * dans le même tour n'est normalement pas possible, sauf Capacité de
     * Maîtrise "freeDraw" ou Arme "petite".
     *
     * `maneuvers` (voir module/rules/maneuvers.mjs) finance les Manœuvres de
     * combat homebrew via les Augmentations : leur coût total EST le nombre
     * d'Augmentations déclaré sur ce jet (+5 au ND effectif de la cible par
     * Augmentation, voir module/rules/augmentations.mjs), plafonné par
     * l'Anneau de Vide - bloque le jet plutôt que de deviner lesquelles
     * abandonner si le budget de Vide est dépassé. Attaque Supplémentaire ne
     * peut être déclarée qu'une fois par tour (voir system.combat.extraAttackTurn) ;
     * la seconde attaque qu'elle déclenche (voir module/chat/extra-attack-actions.mjs)
     * passe `skipActionCost: true` - déjà payée par les 5 Augmentations de la
     * première, pas de second coût d'Action Complexe.
     * `targetActorId` (voir tab-combat.hbs, menu déroulant "Cible" du panneau
     * Attaques) prend le pas sur le ciblage natif de Foundry (game.user.targets)
     * s'il est fourni - ce dernier reste un repli pratique (ex: le MJ cible
     * déjà via le réticule pour d'autres raisons) plutôt que la seule source,
     * qui n'est ni visible ni découvrable nulle part dans la fiche.
     * @param {string} weaponId
     * @param {{rollBonus?: number, keepBonus?: number, ammoId?: string|null, spendVoid?: boolean, isReaction?: boolean, conditionalDamageBonus?: {rollBonus?: number, keepBonus?: number}, maneuvers?: {extraAttack?: boolean, preciseTarget?: string, disarm?: boolean, damageAugments?: number, feint?: boolean, reversalLegs?: number}, skipActionCost?: boolean, targetActorId?: string|null}} [options]
     * @returns {Promise<Roll|null>}
     */
    async rollAttack(weaponId, { rollBonus = 0, keepBonus = 0, ammoId = null, spendVoid = false, isReaction = false, conditionalDamageBonus = null, maneuvers = {}, skipActionCost = false, targetActorId = null } = {}) {
      const weapon = this.items.get(weaponId);
      if (!weapon || weapon.type !== "weapon") {
        throw new Error(`Arme introuvable: ${weaponId}`);
      }
      if (!(await this._ensureCanRoll({ isReaction }))) return null;

      const stance = this.system.combat.stance;
      if (!canAttackInStance(stance)) {
        ui.notifications.warn(
          game.i18n.format("L5R4EC.Notif.CannotAttackInStance", {
            name: this.name,
            stance: game.i18n.localize(`L5R4EC.Stance.${stance.charAt(0).toUpperCase()}${stance.slice(1)}`)
          })
        );
        return null;
      }

      const maneuverCost = computeManeuverCost(maneuvers);
      const clampedAugmentations = clampAugmentations(maneuverCost, this.system.rings.void.rank);
      if (maneuverCost > clampedAugmentations) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotEnoughVoidForManeuvers", { name: this.name, max: clampedAugmentations }));
        return null;
      }

      const turnKey = (game.combat?.round ?? 0) * 1000 + (game.combat?.turn ?? 0);
      if (maneuvers.extraAttack && this.system.combat.extraAttackTurn === turnKey) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.ExtraAttackAlreadyUsed", { name: this.name }));
        return null;
      }

      // Au Sol (voir module/rules/conditions.mjs) : ne peut pas attaquer avec
      // une Arme grande - bloqué avant même le jet, pas un malus.
      if (this.statuses?.has("prone") && weapon.system.size === "large") {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.CannotUseLargeWeaponProne", { name: this.name }));
        return null;
      }

      // Cible (menu déroulant "Cible" de tab-combat.hbs, sinon repli sur le
      // ciblage natif de Foundry via game.user.targets) - résolue tôt (avant
      // toute dépense) pour pouvoir bloquer sur la portée ci-dessous. Réutilisée
      // plus bas (TN d'Armure, bonus Monté/Position Haute, etc.) - inutile de
      // la re-résoudre une seconde fois.
      const targetActor = targetActorId
        ? this.constructor._resolveActor(targetActorId)
        : ([...game.user.targets][0]?.actor ?? null);

      // Portée : Arme à distance -> sa portée en mètres (system.range) ; Arme
      // de mêlée -> corps-à-corps (voir module/rules/actions.mjs#MELEE_RANGE_M,
      // même limite que la Manœuvre Garde/l'Empoignade). `distance === null`
      // (token manquant pour l'un des deux) ne bloque PAS - contrairement à
      // #declareGuard, la cible d'une Attaque reste optionnelle.
      if (targetActor) {
        const limit = weapon.system.isRanged ? weapon.system.range : MELEE_RANGE_M;
        const distance = this._distanceToActor(targetActor);
        if (distance !== null && distance > limit) {
          ui.notifications.warn(game.i18n.format("L5R4EC.Notif.TargetOutOfRange", { name: this.name, max: limit }));
          return null;
        }
      }

      if (!(await this.drawWeapon(weaponId))) return null;
      if (!skipActionCost && !(await this.spendActionPoints(ACTION_COST.COMPLEX)).ok) return null;

      let ammo = null;
      const conjured = weapon.system.isRanged && ammoId === CONJURED_AMMO_ID && weapon.system.conjuresAmmo;
      if (weapon.system.isRanged && !conjured) {
        ammo = this.items.get(ammoId);
        if (!ammo || ammo.type !== "ammo" || (!ammo.system.unlimited && ammo.system.quantity <= 0)) {
          ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoAmmo", { name: this.name }));
          return null;
        }
      }

      const skillItem = findSkillByName(this, weapon.system.associatedSkill);

      let traitRank, skillRank;
      if (skillItem) {
        traitRank = this._resolveTraitOrVoidRank(skillItem.system.trait);
        skillRank = skillItem.system.rank;
      } else {
        traitRank = this.system.traits.agi;
        skillRank = 0;
        if (weapon.system.associatedSkill) {
          ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoWeaponSkill", { skill: weapon.system.associatedSkill }));
        }
      }

      const stanceBonus = attackStanceBonus(stance);
      const voidBonus = await this._applyVoidPointSpend(spendVoid);
      const config = skillRoll({
        traitRank,
        skillRank,
        rollBonus: rollBonus + stanceBonus.rollBonus + voidBonus.rollBonus,
        keepBonus: keepBonus + stanceBonus.keepBonus + voidBonus.keepBonus
      });
      config.flatBonus += this._freeAugmentBonus(skillItem);

      // Malus de main non directrice (voir module/rules/actions.mjs#OFF_HAND_PENALTY) -
      // "both" (deux mains) et la main réellement directrice n'écopent jamais
      // de ce malus, de même qu'un personnage ambidextre.
      const offHand = weapon.system.hand !== "both" && weapon.system.hand !== this.system.combat.dominantHand;
      if (offHand && !this.system.combat.ambidextrous) {
        config.rolled = Math.max(1, config.rolled - OFF_HAND_PENALTY.rollPenalty);
        config.keep = Math.max(1, config.keep - OFF_HAND_PENALTY.keepPenalty);
      }

      const flavor = `${game.i18n.localize("L5R4EC.Sheet.AttackRoll")} : ${weapon.name}`;
      const targetTN = targetActor?.system?.armorTn?.total ?? null;

      // Monté/Position Haute (voir module/rules/conditions.mjs) : +1k0 si CE
      // personnage a le statut et que la cible ne l'a pas.
      if (this.statuses?.has("mountedHigher") && targetActor && !targetActor.statuses?.has("mountedHigher")) {
        config.rolled += MOUNTED_HIGHER_BONUS.roll;
        config.keep += MOUNTED_HIGHER_BONUS.keep;
      }

      this._applyConditionRollPenalty(config, { isRangedAttack: weapon.system.isRanged, isMeleeAttack: !weapon.system.isRanged });

      // Au Sol (voir module/rules/conditions.mjs) : -10 au TN d'Armure de la
      // cible contre une attaque de MÊLÉE uniquement - n'affecte pas le TN de
      // base stocké (system.armorTn.total, partagé avec les jets à distance),
      // appliqué ici au moment de la comparaison.
      const proneMeleePenalty = targetActor?.statuses?.has("prone") && !weapon.system.isRanged ? PRONE_ARMOR_TN_MELEE_PENALTY : 0;
      const effectiveTargetTN = targetTN !== null ? augmentedTN(targetTN, clampedAugmentations) + proneMeleePenalty : null;

      // La flèche part dès le tir, indépendamment du résultat du jet.
      if (ammo && !ammo.system.unlimited) {
        await ammo.update({ "system.quantity": ammo.system.quantity - 1 });
      }

      return performRoll(this, config, flavor, async (roll) => {
        const damageBonus = this._sumMasteryBonus(skillItem, "damageRoll");
        if (conditionalDamageBonus) {
          damageBonus.rollBonus += conditionalDamageBonus.rollBonus ?? 0;
          damageBonus.keepBonus += conditionalDamageBonus.keepBonus ?? 0;
        }
        // Force de l'Arc effective = celle de l'Arme + bonus de maîtrise
        // "weaponStrength" (ex: Kyujutsu rang 7 -> +1) - inutile hors tir à
        // l'arc, mais sans effet dans ce cas puisque strengthRating/ammo n'y
        // interviennent pas.
        const effectiveStrengthRating = (weapon.system.strengthRating ?? 0) + this._sumMasteryBonus(skillItem, "weaponStrength").flatBonus;

        let effectiveRolled, effectiveKept, drLabel, damageFlatBonus = 0;
        if (maneuvers.disarm) {
          // Désarmement : "n'inflige que 2g1 de dégât, peu importe l'arme et
          // la Force du joueur" - remplace entièrement le calcul normal.
          effectiveRolled = 2;
          effectiveKept = 1;
          drLabel = `2k1 (${game.i18n.localize("L5R4EC.Maneuver.Disarm")})`;
        } else if (ammo) {
          effectiveRolled = ammo.system.damageRolled + effectiveStrengthRating + damageBonus.rollBonus;
          effectiveKept = ammo.system.damageKept + damageBonus.keepBonus;
          drLabel = `${effectiveRolled}k${effectiveKept} (${ammo.name})`;
        } else if (conjured) {
          const conjuredName = weapon.system.conjuredAmmoName || game.i18n.localize("L5R4EC.Sheet.ConjuredAmmo");
          effectiveRolled = weapon.system.conjuredAmmoRolled + effectiveStrengthRating + damageBonus.rollBonus;
          effectiveKept = weapon.system.conjuredAmmoKept + damageBonus.keepBonus;
          drLabel = `${effectiveRolled}k${effectiveKept} (${conjuredName})`;
        } else {
          const strengthBonus = weapon.system.isRanged ? 0 : this.system.traits.str;
          effectiveRolled = weapon.system.damageRolled + damageBonus.rollBonus + strengthBonus;
          effectiveKept = weapon.system.damageKept + damageBonus.keepBonus;
          drLabel = `${effectiveRolled}k${effectiveKept}`;
        }

        // Dommages Augmentés : +1g0 par Augmentation dédiée (voir module/rules/maneuvers.mjs).
        if (maneuvers.damageAugments) {
          effectiveRolled += maneuvers.damageAugments;
        }

        const extra = {
          weaponInfo: {
            name: weapon.name,
            associatedSkill: skillItem ? weapon.system.associatedSkill : game.i18n.localize("L5R4EC.Trait.Agility"),
            dr: drLabel
          }
        };

        if (maneuvers.preciseTarget && maneuvers.preciseTarget !== "torso") {
          extra.preciseTarget = game.i18n.localize(`L5R4EC.Maneuver.PreciseTarget.${maneuvers.preciseTarget}`);
        }

        const success = effectiveTargetTN === null || roll.keptTotal >= effectiveTargetTN;

        if (success) {
          // Feinte : (résultat du jet - ND effectif de la cible) / 2, plafonné
          // à Rang×5 de l'attaquant - sans cible suivie, pas de ND pour la calculer.
          if (maneuvers.feint && effectiveTargetTN !== null) {
            damageFlatBonus += computeFeintBonus(roll.keptTotal, effectiveTargetTN, this.system.reputation.rank);
          }

          // Attaque Supplémentaire : verrouillée pour le reste du tour, un
          // bouton permet de relancer immédiatement (même Arme, nouvelle cible
          // possible en changeant de cible Foundry avant de cliquer).
          if (maneuvers.extraAttack) {
            await this.update({ "system.combat.extraAttackTurn": turnKey });
            extra.extraAttackButton = { actorId: this.id, weaponId: weapon.id };
          }

          // Désarmement / Renversement : jet de Force opposé résolu tout de
          // suite (voir #_resolveContestedForce) plutôt qu'un aller-retour de
          // boutons de chat entre deux clients - simplification assumée.
          if (targetActor && (maneuvers.disarm || maneuvers.reversalLegs)) {
            const contest = await this._resolveContestedForce(targetActor);
            if (maneuvers.disarm) {
              extra.disarmResult = { ...contest, targetName: targetActor.name };
              if (contest.attackerWins) {
                const drawnWeapons = targetActor.items.filter((i) => i.type === "weapon" && i.system.hand !== "none");
                for (const w of drawnWeapons) await targetActor.sheatheWeapon(w.id);
              }
            }
            if (maneuvers.reversalLegs) {
              extra.reversalResult = { ...contest, targetName: targetActor.name };
              if (contest.attackerWins) {
                await targetActor.toggleStatusEffect("prone", { active: true });
              }
            }
          }
        }

        if (damageFlatBonus) damageFlatBonus = Math.min(damageFlatBonus, this.system.reputation.rank * 5);

        const buildDamageButton = () => ({
          actorId: this.id,
          itemName: weapon.name,
          rolled: effectiveRolled,
          kept: effectiveKept,
          explodeOn: damageBonus.explodeOn,
          flatBonus: damageFlatBonus,
          note: "",
          targetActorId: targetActor?.id ?? null
        });

        if (effectiveTargetTN !== null) {
          extra.targetTN = effectiveTargetTN;
          extra.success = success;
          extra.targetName = targetActor.name;
          extra.augmentations = clampedAugmentations;
          if (success) extra.damageButton = buildDamageButton();
        } else {
          extra.augmentations = clampedAugmentations;
          extra.damageButton = buildDamageButton();
        }

        return extra;
      });
    }

    /**
     * Jet de Force opposé (Désarmement, Renversement - voir module/rules/maneuvers.mjs
     * et #rollAttack) : les deux jets sont résolus immédiatement côté client de
     * l'attaquant plutôt que via un échange de boutons de chat entre deux
     * clients différents - plus simple et robuste, au prix de l'animation Dice
     * So Nice du jet de la cible (pas de ChatMessage séparé pour ces deux jets,
     * juste un résumé texte sur la carte d'Attaque - voir roll-keep-card.hbs).
     * @param {Actor} targetActor
     * @returns {Promise<{attackerTotal: number, targetTotal: number, attackerWins: boolean}>}
     */
    async _resolveContestedForce(targetActor) {
      const attackerRoll = L5RRollKeep.build(basicRoll({ rank: this.system.traits.str }));
      await attackerRoll.evaluate();
      const targetRoll = L5RRollKeep.build(basicRoll({ rank: targetActor.system.traits.str }));
      await targetRoll.evaluate();

      return {
        attackerTotal: attackerRoll.keptTotal,
        targetTotal: targetRoll.keptTotal,
        attackerWins: attackerRoll.keptTotal > targetRoll.keptTotal
      };
    }

    /**
     * Lance l'Initiative : (Rang + Réflexes)g(Réflexes), un bonus fixe édité à
     * la main (system.combat.initiativeBonus) s'ajoute après coup (voir
     * module/rules/initiative.mjs). Jet manuel posté au chat comme n'importe
     * quel autre jet - le bouton "Lancer l'Initiative" du Combat Tracker natif
     * de Foundry passe par SystemCombatant#getInitiativeRoll (même formule,
     * factorisée) plutôt que par cette méthode.
     * @param {{rollBonus?: number, keepBonus?: number}} [options]
     * @returns {Promise<Roll>}
     */
    async rollInitiative({ rollBonus = 0, keepBonus = 0 } = {}) {
      const config = buildInitiativeRollConfig(this);
      config.rolled += rollBonus;
      config.keep += keepBonus;

      const flavor = game.i18n.localize("L5R4EC.Sheet.InitiativeRoll");
      return performRoll(this, config, flavor);
    }

    /**
     * Déclare la posture de Pleine Défense : jet de Défense/Réflexes (voir
     * SystemActor#rollAttack pour la même logique de résolution de Compétence
     * par nom), la moitié du résultat gardé (arrondi au supérieur) est
     * enregistrée comme bonus temporaire de TN d'Armure jusqu'au changement de
     * posture (voir SystemActor#_computeArmorTN et #setStance). Rafraîchit le
     * Combat Tracker après coup pour que son icône de posture (voir
     * module/hooks/combat-tracker-stances.mjs) reste à jour immédiatement.
     * @returns {Promise<Roll|null>}
     */
    async rollFullDefense() {
      if (!this.isInCombat) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotInCombat", { name: this.name }));
        return null;
      }
      if (this.isStanceLocked) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.StanceAlreadyDeclared", { name: this.name }));
        return null;
      }
      if (this.system.combat.grappleGroupId) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.CannotChangeStanceGrappled", { name: this.name }));
        return null;
      }

      const defenseSkill = findSkillByName(this, "défense");
      const config = skillRoll({ traitRank: this.system.traits.ref, skillRank: defenseSkill?.system.rank ?? 0 });
      const flavor = game.i18n.localize("L5R4EC.Sheet.FullDefenseRoll");

      const roll = await performRoll(this, config, flavor);
      const bonus = Math.ceil(roll.keptTotal / 2);
      await this.update({
        "system.combat.stance": "fullDefense",
        "system.combat.stanceRound": game.combat?.round ?? 0,
        "system.combat.fullDefenseBonus": bonus
      });
      ui.combat?.render();
      return roll;
    }
  };
