/**
 * Manœuvres de combat L5R 4e (homebrew demandée), financées par les
 * Augmentations déclarées sur un jet d'Attaque (voir module/rules/augmentations.mjs
 * et SystemActor#rollAttack) - utilisables hors combat aussi sauf mention
 * contraire (aucune des manœuvres ci-dessous n'a de restriction "combat
 * uniquement", à l'exception de Garde qui a ses propres règles séparées, non
 * liée à un jet d'Attaque - voir SystemActor#declareGuard).
 *
 * Chaque manœuvre "consomme" un nombre d'Augmentations parmi celles
 * déclarées sur le jet - le total consommé EST le nombre d'Augmentations
 * réellement déclaré pour ce jet (voir #computeManeuverCost), qui détermine
 * à la fois le ND effectif de la cible (+5 chacune) et si le budget de
 * Vide du personnage suffit (voir SystemActor#rollAttack).
 */

/** Coûts fixes en Augmentations des manœuvres à coût unique. */
export const MANEUVER_COST = {
  extraAttack: 5,
  disarm: 3,
  feint: 2
};

/**
 * Coûts du Coup Précis selon la zone visée (torse = ciblage par défaut,
 * gratuit - pas une vraie "manœuvre" mais gardé ici pour cohérence).
 */
export const PRECISE_TARGET_COST = {
  torso: 0,
  limb: 1,
  extremity: 2,
  head: 3,
  detail: 5
};

/** Nombre de jambes par défaut d'une cible humanoïde standard, pour le coût du Renversement (voir #reversalCost). */
export const DEFAULT_REVERSAL_LEGS = 2;

/** Coût du Renversement = nombre de jambes de la cible (2 humanoïde standard, 4 animal, davantage pour une créature exotique - à la discrétion du MJ). */
export function reversalCost(legCount) {
  return Math.max(0, Math.floor(legCount) || 0);
}

/**
 * Additionne le coût total en Augmentations de toutes les manœuvres
 * sélectionnées sur un jet d'Attaque - c'est ce total qui doit être déclaré
 * comme `augmentations` sur le jet (voir SystemActor#rollAttack).
 * @param {object} maneuvers
 * @param {boolean} [maneuvers.extraAttack]
 * @param {string} [maneuvers.preciseTarget]  Une clé de PRECISE_TARGET_COST.
 * @param {boolean} [maneuvers.disarm]
 * @param {number} [maneuvers.damageAugments]  Augmentations dédiées aux Dommages Augmentés (+1g0 chacune).
 * @param {boolean} [maneuvers.feint]
 * @param {number} [maneuvers.reversalLegs]  0 = Renversement non tenté.
 * @returns {number}
 */
export function computeManeuverCost(maneuvers = {}) {
  let cost = 0;
  if (maneuvers.extraAttack) cost += MANEUVER_COST.extraAttack;
  if (maneuvers.preciseTarget) cost += PRECISE_TARGET_COST[maneuvers.preciseTarget] ?? 0;
  if (maneuvers.disarm) cost += MANEUVER_COST.disarm;
  if (maneuvers.damageAugments) cost += Math.max(0, Math.floor(maneuvers.damageAugments) || 0);
  if (maneuvers.feint) cost += MANEUVER_COST.feint;
  if (maneuvers.reversalLegs) cost += reversalCost(maneuvers.reversalLegs);
  return cost;
}

/**
 * Bonus flat de la Feinte : différence entre le résultat du jet d'attaque et
 * le ND effectif de la cible (Augmentations comprises), divisée par deux et
 * arrondie vers le bas, plafonnée à Rang×5 du personnage qui attaque (voir
 * SystemActor#rollAttack - "Rang" interprété comme le Rang de Réputation du
 * personnage, seule notion de "Rang" globale déjà calculée par ce système -
 * à corriger si une autre notion était prévue).
 * @param {number} rollTotal  keptTotal du jet d'attaque.
 * @param {number} effectiveTargetTN  ND de la cible, Augmentations comprises.
 * @param {number} attackerRank  Rang du personnage qui attaque (voir system.reputation.rank).
 * @returns {number}
 */
export function computeFeintBonus(rollTotal, effectiveTargetTN, attackerRank) {
  const raw = Math.floor((rollTotal - effectiveTargetTN) / 2);
  const cap = attackerRank * 5;
  return Math.max(0, Math.min(raw, cap));
}
