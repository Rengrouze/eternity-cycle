/**
 * Calcule le rang de maîtrise de Réputation à partir des points de
 * Réputation (voir SystemActor#_computeReputation pour le calcul des
 * points eux-mêmes, qui nécessite l'accès aux Items donc vit côté Actor).
 *
 * Règle : de 1 à 149 points -> rang 1, puis +1 rang tous les 25 points
 * (150 -> rang 2, 175 -> rang 3, 200 -> rang 4, etc.).
 *
 * @param {number} points
 * @returns {number}
 */
export function computeReputationRank(points) {
  if (points < 150) return 1;
  return 1 + Math.floor((points - 125) / 25);
}
