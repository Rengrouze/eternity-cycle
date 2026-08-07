import { computeReputationRank } from "../../rules/reputation.mjs";
import { armorTnStanceFlatBonus } from "../../rules/stances.mjs";
import { GRAPPLED_STUNNED_BASE_ARMOR_TN, BLINDED_ARMOR_TN_MULTIPLIER } from "../../rules/conditions.mjs";
import { findSkillByName } from "../../rules/skills.mjs";
import { DEFAULT_SKILLS } from "../../data/default-skills.mjs";

/**
 * Libellé lisible d'un `path` de bonus de maîtrise "passive" (voir
 * DerivedDataMixin#_summarizeMasteryBonus) - seul "reputation.rank" est
 * utilisé pour l'instant (Courtisan/Étiquette rang 3 et 7), mappé à la main
 * plutôt que dérivé du chemin brut.
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
  armorTnDefense: "L5R4EC.Sheet.BuffEffectArmorTn",
  weaponStrength: "L5R4EC.Sheet.BuffEffectWeaponStrength"
};

/**
 * Icône Font Awesome par trigger, pour le panneau "Capacités de Maîtrise
 * actives" (voir tab-combat.hbs) - un bonus non-automatisé (isAutomatic
 * false) affiche toujours une icône neutre (info), quel que soit son
 * trigger "passive" par défaut.
 */
const TRIGGER_ICONS = {
  passive: "fa-solid fa-arrow-trend-up",
  skillRoll: "fa-solid fa-dice-d10",
  damageRoll: "fa-solid fa-khanda",
  spellRoll: "fa-solid fa-hand-sparkles",
  initiativeRoll: "fa-solid fa-bolt",
  armorTnDefense: "fa-solid fa-shield-halved",
  weaponStrength: "fa-solid fa-crosshairs",
  voidRecovery: "fa-solid fa-yin-yang",
  freeDraw: "fa-solid fa-hand"
};

/**
 * Données dérivées de SystemActor : TN d'Armure, Réputation, bonus de
 * maîtrise ("buffs") - calculés à chaque `prepareDerivedData`, jamais
 * édités à la main. Voir module/documents/actor-document.mjs pour la
 * composition des mixins.
 * @param {typeof Actor} Base
 */
export const DerivedDataMixin = (Base) =>
  class extends Base {
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

      // Effets Conditionnels qui remplacent le calcul de base (voir
      // module/rules/conditions.mjs) : Étourdi/Saisi (Empoignade) ->
      // 5 + bonus d'armure seulement (ignore Réflexes) ; Aveuglé -> Réflexes +
      // 5 (au lieu de Réflexes×5 + 5) - les deux gardent le bonus d'armure et
      // les autres bonus normalement ("l'armure ajoute des bonus comme
      // d'habitude"). Stunned/Grappled prioritaires si les deux s'appliquaient
      // en même temps qu'Aveuglé (cas rare, TN le plus bas retenu de toute façon).
      if (this.statuses?.has("stunned") || this.statuses?.has("grappled")) {
        s.armorTn.base = GRAPPLED_STUNNED_BASE_ARMOR_TN;
        s.armorTn.reflexesBonus = 0;
      } else if (this.statuses?.has("blinded")) {
        s.armorTn.base = s.traits.ref + BLINDED_ARMOR_TN_MULTIPLIER;
        s.armorTn.reflexesBonus = 0;
      } else {
        s.armorTn.base = 5;
        s.armorTn.reflexesBonus = s.traits.ref * 5;
      }
      s.armorTn.armorBonus = equippedArmor?.system.tnBonus ?? 0;
      s.armorTn.reduction = equippedArmor?.system.reduction ?? 0;

      let stanceBonus = armorTnStanceFlatBonus(stance);
      if (stance === "defense" || stance === "fullDefense") {
        const defenseSkill = findSkillByName(this, "défense");
        if (stance === "defense") stanceBonus += s.rings.air.rank + (defenseSkill?.system.rank ?? 0);
        else stanceBonus += s.combat.fullDefenseBonus;
        stanceBonus += this._sumMasteryBonus(defenseSkill, "armorTnDefense").flatBonus;
      }
      s.armorTn.stanceBonus = stanceBonus;

      // Manœuvre Garde (voir #declareGuard, module/rules/maneuvers.mjs) :
      // -5 pour CE personnage tant qu'il garde quelqu'un ce round, +10 pour
      // l'Acteur qu'un AUTRE personnage garde actuellement (recherche inverse
      // sur game.actors, aucune référence directe possible dans l'autre sens).
      let guardBonus = 0;
      if (s.combat.guardRound === (game.combat?.round ?? -1) && s.combat.guardTargetActorId) {
        guardBonus -= 5;
      }
      if (game.actors?.some((a) => a.system.combat?.guardTargetActorId === this.id && a.system.combat?.guardRound === (game.combat?.round ?? -1))) {
        guardBonus += 10;
      }
      s.armorTn.guardBonus = guardBonus;

      s.armorTn.total = s.armorTn.base + s.armorTn.reflexesBonus + s.armorTn.armorBonus + s.armorTn.otherBonus + s.armorTn.stanceBonus + s.armorTn.guardBonus;
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

          const isAutomatic = bonus.trigger !== "passive" || Boolean(bonus.path);
          buffs.push({
            skillName: item.name,
            rankRequired: bonus.rankRequired,
            description: bonus.description,
            isAutomatic,
            effectSummary: this._summarizeMasteryBonus(bonus),
            icon: isAutomatic ? (TRIGGER_ICONS[bonus.trigger] ?? "fa-solid fa-star") : "fa-solid fa-circle-info"
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

      if (bonus.trigger === "voidRecovery") {
        return game.i18n.format("L5R4EC.Sheet.BuffEffectVoidRecovery", { amount: bonus.value });
      }

      if (bonus.trigger === "freeDraw") {
        return game.i18n.localize("L5R4EC.Sheet.BuffEffectFreeDraw");
      }

      if (bonus.explodeOn && !bonus.rollBonus && !bonus.keepBonus && !bonus.flatBonus) {
        return game.i18n.format("L5R4EC.Sheet.BuffEffectExplodeOn", { value: bonus.explodeOn });
      }

      const parts = [];
      if (bonus.rollBonus || bonus.keepBonus) parts.push(`+${bonus.rollBonus}k${bonus.keepBonus}`);
      if (bonus.flatBonus) parts.push(`+${bonus.flatBonus}`);
      if (bonus.dynamicRankBonus) parts.push(`+${game.i18n.localize("L5R4EC.Sheet.BuffOwnRank")}`);
      if (!parts.length) return null;

      const suffixKey = TRIGGER_SUFFIX_KEYS[bonus.trigger] ?? "L5R4EC.Sheet.BuffEffectThisRoll";
      let summary = `${parts.join(" ")} ${game.i18n.localize(suffixKey)}`;
      if (bonus.conditionLabel) summary += ` (${game.i18n.localize("L5R4EC.Sheet.BuffConditional")})`;
      return summary;
    }

    /**
     * Additionne les bonus de maîtrise d'une Compétence donnée pour un
     * `trigger` précis (voir item-skill.mjs pour la liste), en ne comptant que
     * ceux dont le rang requis est atteint. `dynamicRankBonus` ajoute en plus
     * le rang actuel de la Compétence en flatBonus (voir item-skill.mjs).
     * Premier brouillon du "système de buff" conditionnel demandé - la
     * majorité des capacités de maîtrise du LdB restent informatives (voir
     * #_applyMasteryBonuses et le commentaire d'en-tête de default-skills.mjs).
     * Ignore les entrées avec un `conditionLabel` renseigné (bonus
     * conditionnel à une situation déclarée par le joueur, pas automatique -
     * voir #_buildConditionalBonuses côté fiche).
     * @param {Item|null} skillItem
     * @param {"skillRoll"|"damageRoll"|"spellRoll"|"initiativeRoll"|"armorTnDefense"|"weaponStrength"} trigger
     * @returns {{rollBonus: number, keepBonus: number, flatBonus: number, explodeOn: number}}
     */
    _sumMasteryBonus(skillItem, trigger) {
      const total = { rollBonus: 0, keepBonus: 0, flatBonus: 0, explodeOn: 10 };
      if (!skillItem) return total;

      for (const bonus of skillItem.system.masteryBonuses ?? []) {
        if (bonus.trigger !== trigger) continue;
        if (skillItem.system.rank < bonus.rankRequired) continue;
        if (bonus.conditionLabel) continue;

        total.rollBonus += bonus.rollBonus ?? 0;
        total.keepBonus += bonus.keepBonus ?? 0;
        total.flatBonus += bonus.flatBonus ?? 0;
        if (bonus.dynamicRankBonus) total.flatBonus += skillItem.system.rank;
        if (bonus.explodeOn) total.explodeOn = Math.min(total.explodeOn, bonus.explodeOn);
      }

      return total;
    }

    /**
     * Nombre de Points de Vide restaurés par un jet réussi de cette
     * Compétence (voir trigger "voidRecovery", item-skill.mjs) - 1 par défaut
     * (règle de base), remplacé par la plus haute valeur `value` parmi les
     * entrées "voidRecovery" dont le rang requis est atteint (ex: Méditation
     * rang 3 -> 2, rang 7 -> 3 - pas cumulatif, c'est un palier).
     * @param {Item} skillItem
     * @returns {number}
     */
    _voidRecoveryAmount(skillItem) {
      let amount = 1;
      for (const bonus of skillItem.system.masteryBonuses ?? []) {
        if (bonus.trigger !== "voidRecovery") continue;
        if (skillItem.system.rank < bonus.rankRequired) continue;
        amount = Math.max(amount, bonus.value);
      }
      return amount;
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
  };
