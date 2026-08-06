/**
 * Logique de magie Shugenja L5R 4e, pure (aucune dépendance Foundry) :
 * TN/durée d'incantation selon le rang du sort, effet des affinités/
 * déficiences élémentaires. Voir SystemActor#rollSpell pour l'intégration
 * (jet = (rang d'école + Anneau)g(Anneau), même forme que skillRoll()).
 */

export const AFFINITY_CHOICES = ["none", "affinity", "doubleAffinity", "deficiency"];

// Bonus/malus de dés lancés au jet de lancer de sort (Ng0).
const AFFINITY_ROLL_BONUS = { none: 0, affinity: 1, doubleAffinity: 2, deficiency: -1 };

// Une affinité augmente aussi le rang max de sort apprenable dans l'Anneau concerné.
const AFFINITY_MAX_RANK_BONUS = { none: 0, affinity: 1, doubleAffinity: 2, deficiency: 0 };

/** @param {string} affinity Une valeur de AFFINITY_CHOICES. */
export function affinityRollBonus(affinity) {
  return AFFINITY_ROLL_BONUS[affinity] ?? 0;
}

/** @param {string} affinity Une valeur de AFFINITY_CHOICES. */
export function affinityMaxRankBonus(affinity) {
  return AFFINITY_MAX_RANK_BONUS[affinity] ?? 0;
}

/**
 * TN de base pour incanter un sort : 10 au rang 1, +5 par rang supplémentaire.
 * Une Augmentation déclarée (n'importe laquelle, pas seulement pour réduire
 * le temps d'incantation) ajoute +5 par Augmentation - non calculé ici, c'est
 * une déclaration du joueur au moment du jet.
 * @param {number} masteryRank Rang du sort (Ring/Mastery, ex: "Earth 1" -> 1).
 */
export function computeSpellTN(masteryRank) {
  return 5 + masteryRank * 5;
}

/**
 * Durée d'incantation en tours : 1 tour au rang 1, +1 tour par rang
 * supplémentaire. Une Augmentation peut réduire ce temps (ex: incanter en 1
 * tour un sort qui en prendrait normalement plus) contre un TN plus élevé -
 * décision du joueur au moment du jet, pas calculée ici.
 * @param {number} masteryRank
 */
export function computeCastingRounds(masteryRank) {
  return masteryRank;
}

/**
 * Rang de sort maximum qu'un Shugenja peut apprendre dans un Anneau donné :
 * le rang d'école de base, plus le bonus d'affinité éventuel.
 * @param {number} schoolRank Rang d'école de Shugenja (0-6).
 * @param {string} affinity   Une valeur de AFFINITY_CHOICES pour cet Anneau.
 */
export function computeMaxLearnableRank(schoolRank, affinity) {
  return schoolRank + affinityMaxRankBonus(affinity);
}

/**
 * TN cible réel d'un jet de Lancer de Sort donné, Augmentations déclarées
 * comprises (+5 par Augmentation, quel qu'en soit l'usage prévu - voir
 * computeSpellTN).
 * @param {number} masteryRank
 * @param {number} [augmentations=0]
 */
export function computeSpellTargetTN(masteryRank, augmentations = 0) {
  return computeSpellTN(masteryRank) + 5 * augmentations;
}

/**
 * Calcule les dés de dégâts (lancés/gardés) d'un sort à partir de sa config
 * `system.damage` (voir SpellDataModel) et des rangs d'Anneaux du lanceur.
 * Renvoie null si le sort n'inflige pas de dégâts bruts (mode "none").
 * @param {{mode: string, ring: string, rolled: number, kept: number}} damage
 * @param {Record<string, number>} ringRanks  ex: {air, earth, fire, water, void}
 * @returns {{rolled: number, kept: number}|null}
 */
export function computeSpellDamageDice(damage, ringRanks) {
  if (!damage || damage.mode === "none") return null;
  if (damage.mode === "fixed") return { rolled: damage.rolled, kept: damage.kept };
  if (damage.mode === "ring") {
    const base = ringRanks?.[damage.ring] ?? 0;
    return { rolled: base + damage.rolled, kept: base + damage.kept };
  }
  return null;
}
