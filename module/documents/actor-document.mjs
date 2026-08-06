import { basicRoll, skillRoll, performRoll } from "../dice/_module.mjs";
import { computeReputationRank } from "../rules/reputation.mjs";
import { affinityRollBonus, computeSpellTargetTN, computeSpellDamageDice } from "../rules/spellcasting.mjs";
import { canAttackInStance, attackStanceBonus, armorTnStanceFlatBonus } from "../rules/stances.mjs";
import { buildInitiativeRollConfig } from "../rules/initiative.mjs";
import { DEFAULT_SKILLS } from "../data/default-skills.mjs";

/**
 * Libellé lisible d'un `path` de bonus de maîtrise "passive" (voir
 * SystemActor#_summarizeMasteryBonus) - seul "reputation.rank" est utilisé
 * pour l'instant (Courtisan/Étiquette rang 3 et 7), mappé à la main plutôt
 * que dérivé du chemin brut.
 */
const MASTERY_BONUS_PATH_LABELS = {
  "reputation.points": "Réputation"
};

/** Clé de localisation du suffixe affiché après le résumé chiffré d'un bonus non-passif (voir #_summarizeMasteryBonus). */
const TRIGGER_SUFFIX_KEYS = {
  skillRoll: "L5R4EC.Sheet.BuffEffectThisRoll",
  damageRoll: "L5R4EC.Sheet.BuffEffectDamage",
  spellRoll: "L5R4EC.Sheet.BuffEffectSpellCasting",
  initiativeRoll: "L5R4EC.Sheet.BuffEffectInitiative",
  armorTnDefense: "L5R4EC.Sheet.BuffEffectArmorTn"
};

/**
 * Actor custom pour le système.
 */
export class SystemActor extends Actor {
  /**
   * Lance un jet de Trait seul (sans Compétence pour l'instant).
   * @param {string} traitKey Clé du trait, ex: "awa", "ref", ...
   * @param {{rollBonus?: number, keepBonus?: number}} [options]
   * @returns {Promise<Roll>}
   */
  async rollTrait(traitKey, { rollBonus = 0, keepBonus = 0 } = {}) {
    const traitRank = this.system.traits[traitKey];
    if (traitRank === undefined) {
      throw new Error(`Trait inconnu: ${traitKey}`);
    }

    const label = game.i18n.localize(`L5R4EC.Trait.${this._traitLabelKey(traitKey)}`);
    const config = basicRoll({ rank: traitRank, rollBonus, keepBonus });

    return performRoll(this, config, `${game.i18n.localize("L5R4EC.Sheet.TraitRoll")} : ${label}`);
  }

  /**
   * Lance un jet d'Anneau (Air/Terre/Feu/Eau/Vide) : même mécanique XgX
   * qu'un jet de Trait, juste une source de rang différente.
   * @param {string} ringKey Clé de l'Anneau : "air", "earth", "fire", "water", "void".
   * @param {{rollBonus?: number, keepBonus?: number}} [options]
   * @returns {Promise<Roll>}
   */
  async rollRing(ringKey, { rollBonus = 0, keepBonus = 0 } = {}) {
    const ring = this.system.rings[ringKey];
    if (ring === undefined) {
      throw new Error(`Anneau inconnu: ${ringKey}`);
    }

    const label = game.i18n.localize(`L5R4EC.Ring.${this._ringLabelKey(ringKey)}`);
    const config = basicRoll({ rank: ring.rank, rollBonus, keepBonus });

    return performRoll(this, config, `${game.i18n.localize("L5R4EC.Sheet.RingRoll")} : ${label}`);
  }

  /**
   * Lance un jet de Compétence : (Trait + rang de compétence)g(Trait),
   * plafonné à 10g10, n'explose que si entraînée (rang >= 1), relance les 1
   * si une spécialisation est appliquée à ce jet précis. Ajoute aussi les
   * bonus de maîtrise "skillRoll" de CETTE Compétence (voir #_sumMasteryBonus
   * - ex: Courtisan rang 5 -> +1k0 automatique ici) et l'Augmentation
   * gratuite au rang 10 (voir #_freeAugmentBonus).
   * @param {string} itemId  Id de l'Item Compétence.
   * @param {{rollBonus?: number, keepBonus?: number, specialization?: string}} [options]
   * @returns {Promise<Roll>}
   */
  async rollSkill(itemId, { rollBonus = 0, keepBonus = 0, specialization = "" } = {}) {
    const item = this.items.get(itemId);
    if (!item || item.type !== "skill") {
      throw new Error(`Compétence introuvable: ${itemId}`);
    }

    const masteryBonus = this._sumMasteryBonus(item, "skillRoll");
    const traitRank = this._resolveTraitOrVoidRank(item.system.trait);
    const config = skillRoll({
      traitRank,
      skillRank: item.system.rank,
      specialized: Boolean(specialization),
      rollBonus: rollBonus + masteryBonus.rollBonus,
      keepBonus: keepBonus + masteryBonus.keepBonus
    });
    config.flatBonus += masteryBonus.flatBonus + this._freeAugmentBonus(item);

    const traitLabel = this._traitOrVoidLabel(item.system.trait);
    let flavor = `${item.name} (${traitLabel})`;
    if (specialization) flavor += ` \u2013 ${specialization}`;

    return performRoll(this, config, flavor);
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
   * personnage l'a (voir #_sumMasteryBonus - ex: rang 5 -> +1k0 automatique).
   * @param {string} itemId  Id de l'Item Sort.
   * @param {{rollBonus?: number, keepBonus?: number, augmentations?: number, targets?: number}} [options]
   * @returns {Promise<Roll>}
   */
  async rollSpell(itemId, { rollBonus = 0, keepBonus = 0, augmentations = 0, targets = 1 } = {}) {
    const item = this.items.get(itemId);
    if (!item || item.type !== "spell") {
      throw new Error(`Sort introuvable: ${itemId}`);
    }

    const ring = item.system.ring;
    const ringRank = this.system.rings[ring].rank;
    const schoolRank = this.system.shugenja.schoolRank;
    const affinity = this.system.shugenja.affinities[ring];

    const artOfMagicSkill = this.items.find((i) => i.type === "skill" && i.name.trim().toLowerCase() === "art de la magie");
    const spellMasteryBonus = this._sumMasteryBonus(artOfMagicSkill, "spellRoll");

    const config = skillRoll({
      traitRank: ringRank,
      skillRank: schoolRank,
      rollBonus: rollBonus + affinityRollBonus(affinity) + spellMasteryBonus.rollBonus,
      keepBonus: keepBonus + spellMasteryBonus.keepBonus
    });
    config.flatBonus += spellMasteryBonus.flatBonus;

    const consumed = await this._consumeSpellSlot(ring);
    if (!consumed) {
      ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoSpellSlot", { name: item.name }));
    }

    const ringLabel = game.i18n.localize(`L5R4EC.Ring.${this._ringLabelKey(ring)}`);
    const flavor = `${game.i18n.localize("L5R4EC.Sheet.SpellRoll")} : ${item.name} (${ringLabel} ${item.system.masteryRank})`;
    const targetTN = computeSpellTargetTN(item.system.masteryRank, augmentations);

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
        augmentations,
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
            note: item.system.damage.note
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
   * @param {string} itemName  Nom du sort/de l'arme, pour le texte de la carte.
   * @param {{rolled: number, kept: number}} dice
   * @returns {Promise<Roll>}
   */
  async rollDamage(itemName, { rolled, kept } = {}) {
    const config = { rolled, keep: kept, explode: true, explodeOn: 10 };
    const flavor = `${game.i18n.localize("L5R4EC.Sheet.DamageRoll")} : ${itemName}`;
    return performRoll(this, config, flavor, {}, false);
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
   * @param {string} weaponId
   * @param {{rollBonus?: number, keepBonus?: number}} [options]
   * @returns {Promise<Roll>}
   */
  async rollAttack(weaponId, { rollBonus = 0, keepBonus = 0 } = {}) {
    const weapon = this.items.get(weaponId);
    if (!weapon || weapon.type !== "weapon") {
      throw new Error(`Arme introuvable: ${weaponId}`);
    }

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

    const skillName = weapon.system.associatedSkill.trim().toLowerCase();
    const skillItem = skillName
      ? this.items.find((i) => i.type === "skill" && i.name.trim().toLowerCase() === skillName)
      : null;

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
    const config = skillRoll({
      traitRank,
      skillRank,
      rollBonus: rollBonus + stanceBonus.rollBonus,
      keepBonus: keepBonus + stanceBonus.keepBonus
    });
    config.flatBonus += this._freeAugmentBonus(skillItem);

    const flavor = `${game.i18n.localize("L5R4EC.Sheet.AttackRoll")} : ${weapon.name}`;
    const target = [...game.user.targets][0] ?? null;
    const targetActor = target?.actor ?? null;
    const targetTN = targetActor?.system?.armorTn?.total ?? null;

    return performRoll(this, config, flavor, (roll) => {
      const extra = {
        weaponInfo: {
          name: weapon.name,
          associatedSkill: skillItem ? weapon.system.associatedSkill : game.i18n.localize("L5R4EC.Trait.Agility"),
          dr: `${weapon.system.damageRolled}k${weapon.system.damageKept}`
        }
      };

      // Bonus de maîtrise "damageRoll" de la Compétence associée à l'arme
      // (ex: Kenjutsu rang 3 -> +1k0 automatique sur toute attaque à l'épée).
      const damageBonus = this._sumMasteryBonus(skillItem, "damageRoll");
      const buildDamageButton = () => ({
        actorId: this.id,
        itemName: weapon.name,
        rolled: weapon.system.damageRolled + damageBonus.rollBonus,
        kept: weapon.system.damageKept + damageBonus.keepBonus,
        note: ""
      });

      if (targetTN !== null) {
        const success = roll.keptTotal >= targetTN;
        extra.targetTN = targetTN;
        extra.success = success;
        extra.targetName = targetActor.name;
        if (success) extra.damageButton = buildDamageButton();
      } else {
        extra.damageButton = buildDamageButton();
      }

      return extra;
    });
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
   * true si l'acteur est actuellement engagé dans le combat en cours
   * (a un Combatant dans game.combat) - conditionne la possibilité de
   * changer de posture (voir #setStance, #rollFullDefense) : les postures
   * n'ont de sens que pendant la Phase de Réaction d'un round de combat.
   * @type {boolean}
   */
  get isInCombat() {
    return Boolean(game.combat?.combatants.some((c) => c.actor?.id === this.id));
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

    const defenseSkill = this.items.find((i) => i.type === "skill" && i.name.trim().toLowerCase() === "défense");
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

  /**
   * true si la posture actuelle a déjà été déclarée pour le round de combat
   * en cours (system.combat.stanceRound === game.combat.round) - une fois
   * déclarée, elle est verrouillée jusqu'à la prochaine Phase de Réaction
   * (round suivant), pas question d'en changer en cours de round. false hors
   * combat (aucune posture "de round" à verrouiller dans ce cas).
   * @type {boolean}
   */
  get isStanceLocked() {
    return this.isInCombat && this.system.combat.stanceRound === (game.combat?.round ?? 0);
  }

  /**
   * Change de posture. Quitter la Pleine Défense remet son bonus de TN
   * d'Armure temporaire à 0 (voir #rollFullDefense) - les autres postures
   * n'ont pas d'état à nettoyer. Bloqué hors combat (voir #isInCombat) et une
   * fois déjà déclarée pour ce round (voir #isStanceLocked) - la fiche
   * désactive déjà les boutons dans ces deux cas, ceci est la protection
   * "réelle" côté document, même logique que les champs GM-only (voir
   * #_preUpdate).
   * @param {string} stance  Une valeur de STANCE_CHOICES.
   */
  async setStance(stance) {
    if (!this.isInCombat) {
      ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotInCombat", { name: this.name }));
      return;
    }
    if (this.isStanceLocked) {
      ui.notifications.warn(game.i18n.format("L5R4EC.Notif.StanceAlreadyDeclared", { name: this.name }));
      return;
    }

    const updates = { "system.combat.stance": stance, "system.combat.stanceRound": game.combat?.round ?? 0 };
    if (this.system.combat.stance === "fullDefense" && stance !== "fullDefense") {
      updates["system.combat.fullDefenseBonus"] = 0;
    }
    await this.update(updates);
    ui.combat?.render();
  }

  /**
   * Décrémente un emplacement de sort disponible dans le pool de l'Anneau
   * donné ; si aucun n'est disponible, tente le pool de Vide (qui sert de
   * bonus pour n'importe quel Anneau). Ne fait rien et renvoie false si
   * aucun emplacement n'est disponible dans les deux pools.
   * @param {string} ring
   * @returns {Promise<boolean>} true si un emplacement a été consommé.
   */
  async _consumeSpellSlot(ring) {
    const slots = this.system.spellSlots;

    if (slots[ring].available > 0) {
      await this.update({ [`system.spellSlots.${ring}.spent`]: slots[ring].spent + 1 });
      return true;
    }
    if (ring !== "void" && slots.void.available > 0) {
      await this.update({ "system.spellSlots.void.spent": slots.void.spent + 1 });
      return true;
    }
    return false;
  }

  /**
   * Casse 1 Koku en 5 Bu. Conversion à sens unique (voir CharacterDataModel
   * pour la règle) - ne fait rien si le personnage n'a pas de Koku. Ne
   * change pas la valeur totale (juste la répartition en dénominations),
   * donc autorisé pour un joueur malgré le verrou MJ sur l'argent - voir
   * l'option `l5r4ecMoneyAction` dans #_preUpdate.
   */
  async breakKoku() {
    const money = this.system.money;
    if (money.koku < 1) return;
    await this.update(
      { "system.money.koku": money.koku - 1, "system.money.bu": money.bu + 5 },
      { l5r4ecMoneyAction: true }
    );
  }

  /**
   * Casse 1 Bu en 10 Zeni. Conversion à sens unique - ne fait rien si le
   * personnage n'a pas de Bu. Autorisé pour un joueur, même raison que
   * #breakKoku.
   */
  async breakBu() {
    const money = this.system.money;
    if (money.bu < 1) return;
    await this.update(
      { "system.money.bu": money.bu - 1, "system.money.zeni": money.zeni + 10 },
      { l5r4ecMoneyAction: true }
    );
  }

  /**
   * Déduit directement de l'argent dépensé (chaque dénomination séparément,
   * pas de conversion automatique) - réservé au MJ : appelé soit directement
   * depuis le bouton "Dépenser" du MJ, soit depuis le clic "Valider" d'une
   * demande de dépense d'un joueur (voir #requestSpendMoney et
   * module/chat/money-request-actions.mjs), toujours exécuté côté client MJ.
   * @param {{koku?: number, bu?: number, zeni?: number}} amount
   * @returns {Promise<boolean>} false si l'une des 3 dénominations est insuffisante (rien n'est déduit).
   */
  async spendMoney({ koku = 0, bu = 0, zeni = 0 } = {}) {
    const money = this.system.money;
    if (money.koku < koku || money.bu < bu || money.zeni < zeni) return false;

    await this.update({
      "system.money.koku": money.koku - koku,
      "system.money.bu": money.bu - bu,
      "system.money.zeni": money.zeni - zeni
    });
    return true;
  }

  /**
   * Poste une demande de dépense au chat (le joueur ne peut pas dépenser son
   * argent lui-même) : une carte avec le montant demandé et des boutons
   * Valider/Refuser visibles et cliquables uniquement par le MJ (voir
   * module/chat/money-request-actions.mjs) - Valider appelle #spendMoney, et
   * les deux préviennent le joueur propriétaire par une notification dès que
   * le MJ tranche (voir le flag `l5r4ec.moneyRequest`, qui porte toutes les
   * infos nécessaires - montant, raison - pour que le clic du MJ n'ait besoin
   * de rien redemander).
   * Ne poste rien si le joueur n'a déjà pas les fonds pour cette dépense
   * (pas la peine de faire trancher le MJ sur une demande impossible).
   * @param {{koku?: number, bu?: number, zeni?: number, reason?: string}} amount
   */
  async requestSpendMoney({ koku = 0, bu = 0, zeni = 0, reason = "" } = {}) {
    const money = this.system.money;
    if (money.koku < koku || money.bu < bu || money.zeni < zeni) {
      ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotEnoughMoney", { name: this.name }));
      return;
    }

    const amountText = [
      koku ? `${koku} ${game.i18n.localize("L5R4EC.Sheet.Koku")}` : null,
      bu ? `${bu} ${game.i18n.localize("L5R4EC.Sheet.Bu")}` : null,
      zeni ? `${zeni} ${game.i18n.localize("L5R4EC.Sheet.Zeni")}` : null
    ].filter(Boolean).join(", ");

    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/chat/money-request-card.hbs",
      { actorName: this.name, amountText, reason, pending: true }
    );

    await ChatMessage.create({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      content,
      flags: {
        l5r4ec: {
          moneyRequest: { actorId: this.id, koku, bu, zeni, reason, amountText, resolved: false }
        }
      }
    });
  }

  /** Convertit une clé courte ("awa") en clé de libellé ("Awareness"). */
  _traitLabelKey(traitKey) {
    const map = {
      sta: "Stamina", wil: "Willpower", str: "Strength", per: "Perception",
      ref: "Reflexes", awa: "Awareness", agi: "Agility", int: "Intelligence"
    };
    return map[traitKey] ?? traitKey;
  }

  /** Convertit une clé courte ("air") en clé de libellé ("Air"). */
  _ringLabelKey(ringKey) {
    const map = { air: "Air", earth: "Earth", fire: "Fire", water: "Water", void: "Void" };
    return map[ringKey] ?? ringKey;
  }

  /**
   * Une Compétence peut être associée à un Trait classique OU au Vide
   * (qui vit dans system.rings.void, pas dans system.traits).
   */
  _resolveTraitOrVoidRank(traitKey) {
    if (traitKey === "void") return this.system.rings.void.rank;
    return this.system.traits[traitKey];
  }

  /** Libellé localisé pour un Trait classique ou le Vide. */
  _traitOrVoidLabel(traitKey) {
    if (traitKey === "void") return game.i18n.localize("L5R4EC.Ring.Void");
    return game.i18n.localize(`L5R4EC.Trait.${this._traitLabelKey(traitKey)}`);
  }

  /**
   * Bascule l'équipement d'une Armure. Une seule armure peut être équipée à
   * la fois : équiper celle-ci déséquipe automatiquement toutes les autres.
   * @param {string} itemId
   */
  async toggleArmorEquip(itemId) {
    const target = this.items.get(itemId);
    if (!target || target.type !== "armor") return;

    const wasEquipped = target.system.equipped;
    const updates = this.items
      .filter((i) => i.type === "armor")
      .map((i) => ({ _id: i.id, "system.equipped": i.id === itemId ? !wasEquipped : false }));

    await this.updateEmbeddedDocuments("Item", updates);
  }

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type !== "character") return;
    this._computeReputation();
    this._applyMasteryBonuses();
    this._computeArmorTN();
  }

  /**
   * TN d'Armure = 5 + (Réflexes x 5) + bonus de l'armure équipée + bonus
   * "autre" édité à la main + bonus/malus de posture actuelle (voir
   * module/rules/stances.mjs - Attaque Totale : -10 ; Défense : +Anneau
   * d'Air + rang de la Compétence "Défense" si présente sur la fiche ;
   * Pleine Défense : +system.combat.fullDefenseBonus, voir #rollFullDefense).
   * En Défense ou Pleine Défense, ajoute aussi le bonus de maîtrise
   * "armorTnDefense" de la Compétence "Défense" le cas échéant (ex: rang 5 ->
   * +3, voir #_sumMasteryBonus). Nécessite l'Item Armure équipé (et, pour la
   * Défense, l'Item Compétence), donc vit ici plutôt que dans
   * CharacterDataModel (même raison que _computeReputation). Résultat stocké
   * dans system.armorTn.{base,reflexesBonus,armorBonus,stanceBonus,reduction,total}
   * (propriétés dérivées, pas dans le schema - même convention que
   * system.wounds.rankIndex etc.).
   */
  _computeArmorTN() {
    const s = this.system;
    const equippedArmor = this.items.find((i) => i.type === "armor" && i.system.equipped);
    const stance = s.combat.stance;

    s.armorTn.base = 5;
    s.armorTn.reflexesBonus = s.traits.ref * 5;
    s.armorTn.armorBonus = equippedArmor?.system.tnBonus ?? 0;
    s.armorTn.reduction = equippedArmor?.system.reduction ?? 0;

    let stanceBonus = armorTnStanceFlatBonus(stance);
    if (stance === "defense" || stance === "fullDefense") {
      const defenseSkill = this.items.find((i) => i.type === "skill" && i.name.trim().toLowerCase() === "défense");
      if (stance === "defense") stanceBonus += s.rings.air.rank + (defenseSkill?.system.rank ?? 0);
      else stanceBonus += s.combat.fullDefenseBonus;
      stanceBonus += this._sumMasteryBonus(defenseSkill, "armorTnDefense").flatBonus;
    }
    s.armorTn.stanceBonus = stanceBonus;

    s.armorTn.total = s.armorTn.base + s.armorTn.reflexesBonus + s.armorTn.armorBonus + s.armorTn.otherBonus + s.armorTn.stanceBonus;
  }

  /**
   * Réputation = (somme des rangs des 5 Anneaux) * 10 + somme des rangs de
   * toutes les Compétences. Le rang de maîtrise en découle (voir
   * rules/reputation.mjs). Entièrement calculé, jamais édité à la main -
   * nécessite l'accès aux Items, donc vit ici plutôt que dans le Data Model
   * (voir TUTORIEL-fiche-personnage.md sur la répartition Data Model / Actor).
   */
  _computeReputation() {
    const s = this.system;
    const ringSum = s.rings.air.rank + s.rings.earth.rank + s.rings.fire.rank + s.rings.water.rank + s.rings.void.rank;
    const skillSum = this.items
      .filter((i) => i.type === "skill")
      .reduce((sum, i) => sum + i.system.rank, 0);

    s.reputation.points = ringSum * 10 + skillSum;
    s.reputation.rank = computeReputationRank(s.reputation.points);
  }

  /**
   * Applique automatiquement les bonus de maîtrise "passive" des Compétences
   * dont le rang atteint le seuil requis (ex: Courtisan rang 3 -> +3
   * Réputation) et construit la liste des capacités de maîtrise actuellement
   * actives (system.activeBuffs, propriété dérivée consommée par la fiche
   * pour le panneau "Capacités de Maîtrise actives" - voir tab-combat.hbs).
   * Chaque Compétence déclare ses propres bonus dans system.masteryBonuses
   * (voir default-skills.mjs, et item-skill.mjs pour le détail du champ
   * `trigger`) : seuls les "passive" avec un `path` renseigné modifient
   * réellement un stat ICI - les "skillRoll"/"damageRoll" s'appliquent au
   * moment du jet concerné (voir #_sumMasteryBonus, #rollSkill, #rollAttack),
   * pas ici, mais comptent quand même comme automatiques dans le panneau.
   * Le reste (bonus contextuels sans mécanique encore implémentée - Action
   * Libre au lieu de Simple, relance gratuite, effet conditionné à
   * l'adversaire/au terrain...) reste purement informatif.
   *
   * IMPORTANT : un `path` "passive" doit toujours cibler un score BRUT
   * (ex: reputation.points), jamais un rang déjà dérivé de ce score
   * (reputation.rank) - un bug corrigé ici avait justement ce défaut :
   * "+3 Réputation" ajoutait +3 directement au RANG (un saut de plusieurs
   * paliers d'un coup, ex rang 1 -> 4) au lieu de +3 aux POINTS qui
   * déterminent ce rang (un saut quasi imperceptible, comme prévu par la
   * règle). Le rang de Réputation est donc recalculé ICI, après application
   * de tous les bonus "passive", pour rester cohérent avec les points finaux.
   */
  _applyMasteryBonuses() {
    const buffs = [];

    for (const item of this.items) {
      if (item.type !== "skill") continue;

      for (const bonus of item.system.masteryBonuses ?? []) {
        if (item.system.rank < bonus.rankRequired) continue;

        if (bonus.trigger === "passive" && bonus.path) {
          const current = foundry.utils.getProperty(this.system, bonus.path) ?? 0;
          foundry.utils.setProperty(this.system, bonus.path, current + bonus.value);
        }

        buffs.push({
          skillName: item.name,
          rankRequired: bonus.rankRequired,
          description: bonus.description,
          isAutomatic: bonus.trigger !== "passive" || Boolean(bonus.path),
          effectSummary: this._summarizeMasteryBonus(bonus)
        });
      }
    }

    this.system.activeBuffs = buffs;
    this.system.reputation.rank = computeReputationRank(this.system.reputation.points);
  }

  /**
   * Résumé court et lisible de l'effet mécanique d'un bonus de maîtrise
   * automatisé (ex: "+3 Réputation", "+1k0 sur ce jet", "+0k1 aux dégâts") -
   * affiché en évidence dans le panneau "Capacités de Maîtrise actives" à
   * côté de la description complète, pour qu'un bonus déjà appliqué
   * automatiquement se voie clairement comme tel (voir #_applyMasteryBonuses).
   * Renvoie null pour un bonus purement informatif (rien à résumer).
   * @param {object} bonus  Une entrée de system.masteryBonuses.
   * @returns {string|null}
   */
  _summarizeMasteryBonus(bonus) {
    if (bonus.trigger === "passive") {
      if (!bonus.path) return null;
      const label = MASTERY_BONUS_PATH_LABELS[bonus.path] ?? bonus.path;
      return `+${bonus.value} ${label}`;
    }

    const parts = [];
    if (bonus.rollBonus || bonus.keepBonus) parts.push(`+${bonus.rollBonus}k${bonus.keepBonus}`);
    if (bonus.flatBonus) parts.push(`+${bonus.flatBonus}`);
    if (bonus.dynamicRankBonus) parts.push(`+${game.i18n.localize("L5R4EC.Sheet.BuffOwnRank")}`);
    if (!parts.length) return null;

    const suffixKey = TRIGGER_SUFFIX_KEYS[bonus.trigger] ?? "L5R4EC.Sheet.BuffEffectThisRoll";
    return `${parts.join(" ")} ${game.i18n.localize(suffixKey)}`;
  }

  /**
   * Additionne les bonus de maîtrise d'une Compétence donnée pour un
   * `trigger` précis (voir item-skill.mjs pour la liste), en ne comptant que
   * ceux dont le rang requis est atteint. `dynamicRankBonus` ajoute en plus
   * le rang actuel de la Compétence en flatBonus (voir item-skill.mjs).
   * Premier brouillon du "système de buff" conditionnel demandé - la
   * majorité des capacités de maîtrise du LdB restent informatives (voir
   * #_applyMasteryBonuses et le commentaire d'en-tête de default-skills.mjs).
   * @param {Item|null} skillItem
   * @param {"skillRoll"|"damageRoll"|"spellRoll"|"initiativeRoll"|"armorTnDefense"} trigger
   * @returns {{rollBonus: number, keepBonus: number, flatBonus: number}}
   */
  _sumMasteryBonus(skillItem, trigger) {
    const total = { rollBonus: 0, keepBonus: 0, flatBonus: 0 };
    if (!skillItem) return total;

    for (const bonus of skillItem.system.masteryBonuses ?? []) {
      if (bonus.trigger !== trigger) continue;
      if (skillItem.system.rank < bonus.rankRequired) continue;

      total.rollBonus += bonus.rollBonus ?? 0;
      total.keepBonus += bonus.keepBonus ?? 0;
      total.flatBonus += bonus.flatBonus ?? 0;
      if (bonus.dynamicRankBonus) total.flatBonus += skillItem.system.rank;
    }

    return total;
  }

  /**
   * Règle maison demandée par l'utilisateur : une Compétence au rang 10
   * confère une Augmentation gratuite sur chaque jet qui l'utilise. Comme il
   * n'existe pas de notion générique d'Augmentation pour un jet de
   * Compétence/Attaque (contrairement aux Sorts, qui ont leur propre
   * mécanique dédiée - voir module/rules/spellcasting.mjs), elle se traduit
   * simplement par un bonus fixe de +5 au jet plutôt que par un effet
   * variable à choisir. S'applique à #rollSkill et #rollAttack (celui-ci via
   * la Compétence associée à l'Arme utilisée).
   * @param {Item|null} skillItem
   * @returns {number} 5 si le rang de la Compétence est >= 10, sinon 0.
   */
  _freeAugmentBonus(skillItem) {
    return skillItem && skillItem.system.rank >= 10 ? 5 : 0;
  }

  /**
   * Resynchronise les `masteryBonuses` des Compétences déjà présentes sur ce
   * personnage avec la version actuelle de default-skills.mjs, par nom.
   *
   * Nécessaire parce que le peuplement automatique (voir
   * module/hooks/seed-default-skills.mjs) COPIE les données par défaut dans
   * l'Item embarqué au moment de la création du personnage - un personnage
   * créé avant une mise à jour de default-skills.mjs (ex: le nouveau système
   * de `trigger`, ou la correction du bug Réputation) garde sa copie figée,
   * pas la nouvelle donnée. Cette action MJ met à jour SEULEMENT
   * `masteryBonuses` (jamais `rank`/`subtype`/`specializations`/
   * `isSchoolSkill`/`category`/`trait`, qui sont des choix du joueur/MJ
   * propres à ce personnage, pas du contenu générique) sur toute Compétence
   * dont le nom correspond exactement à une entrée de DEFAULT_SKILLS.
   * @returns {Promise<number>} Nombre de Compétences mises à jour.
   */
  async resyncSkillMasteryBonuses() {
    const updates = [];
    for (const item of this.items) {
      if (item.type !== "skill") continue;
      const defaults = DEFAULT_SKILLS.find((s) => s.name === item.name);
      if (!defaults) continue;

      updates.push({ _id: item.id, "system.masteryBonuses": defaults.masteryBonuses ?? [] });
    }

    if (updates.length) await this.updateEmbeddedDocuments("Item", updates);
    return updates.length;
  }

  /**
   * Empêche un non-MJ de modifier Honneur/Gloire/Statut/Souillure, même en
   * forçant un appel à update() (ex: via la console) - la fiche les cache
   * ou les passe en lecture seule côté template, ceci est la protection
   * "réelle" côté serveur/document.
   * @override
   */
  async _preUpdate(changed, options, user) {
    const allowed = await super._preUpdate(changed, options, user);
    if (allowed === false) return false;

    if (!user.isGM && changed.system) {
      for (const key of ["honor", "glory", "status"]) {
        if (changed.system[key]?.rank !== undefined) {
          delete changed.system[key].rank;
        }
      }
      if (changed.system.taint) {
        delete changed.system.taint.rank;
        delete changed.system.taint.hidden; // seul le MJ décide qui peut voir la Souillure
      }
      // La monnaie ne s'édite pas directement par le joueur (seul le MJ édite
      // à la main, ou valide une demande de dépense - #spendMoney, toujours
      // exécutée côté client MJ) - SAUF le cassage de pièces (#breakKoku/
      // #breakBu), qui ne change pas la valeur totale et reste autorisé au
      // joueur : ces deux méthodes passent le flag `l5r4ecMoneyAction` pour
      // s'identifier comme un changement légitime plutôt qu'une édition libre.
      if (!options.l5r4ecMoneyAction) delete changed.system.money;
    }
  }
}
