/**
 * Les 9 états de la table de blessures L5R 4e (homebrew de ce système). Les 7
 * premiers ont une "taille" en points de blessure et un malus fixe. Le 8ème
 * (Hors de Combat) n'a plus de malus numérique - c'est un statut
 * d'incapacité - MAIS a lui aussi sa propre réserve de points (même taille
 * que Indemne, Terre×5) avant la mort : c'est ce qui permet le non-létal (un
 * personnage Hors de Combat n'est pas mort, juste incapable d'agir, tant
 * qu'il reste dans cette réserve). Le 9ème (Mort) est l'état terminal une
 * fois cette réserve dépassée.
 */
export const WOUND_RANKS = [
  { key: "healthy", labelKey: "L5R4EC.WoundRank.Healthy", malus: 0 },
  { key: "nicked", labelKey: "L5R4EC.WoundRank.Nicked", malus: -3 },
  { key: "grazed", labelKey: "L5R4EC.WoundRank.Grazed", malus: -5 },
  { key: "hurt", labelKey: "L5R4EC.WoundRank.Hurt", malus: -10 },
  { key: "injured", labelKey: "L5R4EC.WoundRank.Injured", malus: -15 },
  { key: "crippled", labelKey: "L5R4EC.WoundRank.Crippled", malus: -20 },
  { key: "down", labelKey: "L5R4EC.WoundRank.Down", malus: -40 },
  { key: "out", labelKey: "L5R4EC.WoundRank.Out", malus: 0, isOut: true },
  { key: "dead", labelKey: "L5R4EC.WoundRank.Dead", malus: 0, isDead: true }
];

/**
 * Calcule le rang de blessure actuel et son malus, à partir des points de
 * blessure encaissés, du rang de l'Anneau de Terre, et de la Létalité
 * choisie par le MJ (2 à 5).
 *
 * Règle : le rang "Indemne" contient Terre×5 points de blessure. Chacun des
 * 6 rangs suivants (Égratigné -> Épuisé) contient Terre×Létalité points.
 * "Hors de Combat" contient à nouveau Terre×5 points (même taille que
 * Indemne - la réserve avant la mort). Au-delà, le personnage est Mort.
 *
 * @param {number} woundsValue  Points de blessure actuellement encaissés.
 * @param {number} earthRank    Rang de l'Anneau de Terre.
 * @param {number} lethality    Létalité choisie par le MJ (2 à 5).
 * @returns {{rankIndex: number, rankKey: string, rankLabelKey: string, penalty: number, isOut: boolean, isDead: boolean, max: number}}
 */
export function computeWoundTrack(woundsValue, earthRank, lethality) {
  const healthyBand = earthRank * 5;
  const injuryBand = earthRank * lethality;

  // Bornes cumulées de fin de chacun des 8 premiers rangs (indices 0 à 7) :
  // Indemne, 6 rangs de blessure, puis Hors de Combat.
  const bandEnds = [healthyBand];
  for (let i = 1; i < 7; i++) {
    bandEnds.push(bandEnds[i - 1] + injuryBand);
  }
  bandEnds.push(bandEnds[bandEnds.length - 1] + healthyBand); // fin de Hors de Combat

  let rankIndex = WOUND_RANKS.length - 1; // par défaut : Mort
  for (let i = 0; i < bandEnds.length; i++) {
    if (woundsValue < bandEnds[i]) {
      rankIndex = i;
      break;
    }
  }

  const rank = WOUND_RANKS[rankIndex];
  return {
    rankIndex,
    rankKey: rank.key,
    rankLabelKey: rank.labelKey,
    penalty: rank.malus,
    isOut: Boolean(rank.isOut),
    isDead: Boolean(rank.isDead),
    max: bandEnds[bandEnds.length - 1] // total de points de blessure avant la Mort
  };
}
