/**
 * Les 8 états de la table de blessures L5R 4e. Les 7 premiers ont une
 * "taille" en points de blessure et un malus fixe ; le 8ème (Hors de
 * Combat) est l'état terminal une fois la table dépassée - pas de malus
 * numérique, c'est un statut d'incapacité.
 */
export const WOUND_RANKS = [
  { key: "healthy", labelKey: "L5R4EC.WoundRank.Healthy", malus: 0 },
  { key: "nicked", labelKey: "L5R4EC.WoundRank.Nicked", malus: -3 },
  { key: "grazed", labelKey: "L5R4EC.WoundRank.Grazed", malus: -5 },
  { key: "hurt", labelKey: "L5R4EC.WoundRank.Hurt", malus: -10 },
  { key: "injured", labelKey: "L5R4EC.WoundRank.Injured", malus: -15 },
  { key: "crippled", labelKey: "L5R4EC.WoundRank.Crippled", malus: -20 },
  { key: "down", labelKey: "L5R4EC.WoundRank.Down", malus: -40 },
  { key: "out", labelKey: "L5R4EC.WoundRank.Out", malus: 0, isOut: true }
];

/**
 * Calcule le rang de blessure actuel et son malus, à partir des points de
 * blessure encaissés, du rang de l'Anneau de Terre, et de la Létalité
 * choisie par le MJ (2 à 5).
 *
 * Règle : le rang "Indemne" contient Terre*5 points de blessure. Chacun des
 * 6 rangs suivants (Égratigné -> Épuisé) contient Terre*Létalité points.
 * Au-delà, le personnage est Hors de Combat.
 *
 * @param {number} woundsValue  Points de blessure actuellement encaissés.
 * @param {number} earthRank    Rang de l'Anneau de Terre.
 * @param {number} lethality    Létalité choisie par le MJ (2 à 5).
 * @returns {{rankIndex: number, rankKey: string, rankLabelKey: string, penalty: number, isOut: boolean, max: number}}
 */
export function computeWoundTrack(woundsValue, earthRank, lethality) {
  const bandSize = earthRank * lethality;

  // Bornes cumulées de fin de chacun des 7 premiers rangs (indices 0 à 6).
  const bandEnds = [earthRank * 5];
  for (let i = 1; i < 7; i++) {
    bandEnds.push(bandEnds[i - 1] + bandSize);
  }

  let rankIndex = WOUND_RANKS.length - 1; // par défaut : Hors de Combat (index 7)
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
    max: bandEnds[bandEnds.length - 1] // total de points de blessure avant Hors de Combat
  };
}
