/**
 * Augmentations L5R 4e (homebrew généralisée à TOUS les jets, demandée après
 * l'avoir déjà en partie pour les Sorts - voir module/rules/spellcasting.mjs
 * #computeSpellTargetTN, qui reste la version spécifique aux Sorts).
 *
 * Règle : une Augmentation se déclare AVANT le jet, augmente le ND (TN) de
 * la difficulté de 5, et peut être déclarée autant de fois que voulu - la
 * seule limite étant le rang de l'Anneau de Vide du personnage (voir
 * #maxAugmentations). En combat, les Augmentations alimentent les Manœuvres
 * (voir module/rules/maneuvers.mjs) ; hors combat, sauf indication contraire
 * d'une Manœuvre précise, elles restent utilisables normalement.
 *
 * Pour les jets SANS TN de cible suivi par ce système (Trait/Anneau/
 * Compétence hors Manœuvre) : le nombre d'Augmentations déclarées est
 * simplement affiché sur la carte de chat (voir SystemActor#rollTrait et
 * consorts) - c'est au MJ d'interpréter le ND concerné, comme pour un jet de
 * Sort avant l'ajout du calcul automatique. Un futur système de "défis"
 * préparés par le MJ (ND caché/visible) pourrait remplacer cette étape,
 * mais n'existe pas encore.
 */

/**
 * Nombre maximum d'Augmentations déclarables sur un jet, plafonné par le
 * rang de l'Anneau de Vide du personnage.
 * @param {number} voidRank
 * @returns {number}
 */
export function maxAugmentations(voidRank) {
  return Math.max(0, voidRank);
}

/**
 * Ramène un nombre d'Augmentations déclarées dans la limite autorisée (voir
 * #maxAugmentations) - jamais négatif.
 * @param {number} augmentations
 * @param {number} voidRank
 * @returns {number}
 */
export function clampAugmentations(augmentations, voidRank) {
  return Math.min(Math.max(0, Math.floor(augmentations) || 0), maxAugmentations(voidRank));
}

/**
 * ND (TN) effectif d'un jet une fois les Augmentations déclarées prises en
 * compte : +5 par Augmentation.
 * @param {number} baseTN
 * @param {number} augmentations
 * @returns {number}
 */
export function augmentedTN(baseTN, augmentations) {
  return baseTN + 5 * augmentations;
}
