/**
 * Normalise un couple (dés lancés, dés gardés) selon la règle L5R 4e de
 * dépassement de 10g10 :
 *
 * - Au-delà de 10 dés LANCÉS, on plafonne à 10 lancés. Chaque paire de dés
 *   en trop ajoute +1 dé GARDÉ, jusqu'à ce que la garde atteigne son max
 *   (10 par défaut, pour un jet de compétence).
 * - Une fois la garde au maximum, chaque dé en trop restant (non converti
 *   en garde) ajoute un bonus fixe de +2 au score final.
 *
 * Exemples validés (voir module/dice/__tests__ ou la conversation de conception) :
 *   normalizeRollKeep(12, 3)  -> { rolled: 10, keep: 4,  flatBonus: 0 }   // 12g3  -> 10g4
 *   normalizeRollKeep(16, 10) -> { rolled: 10, keep: 10, flatBonus: 12 } // 16g10 -> 10g10+12
 *
 * @param {number} rolledInput  Nombre de dés à lancer avant normalisation.
 * @param {number} keepInput    Nombre de dés à garder avant normalisation.
 * @param {object} [options]
 * @param {number} [options.maxKeep=10]  Garde maximale autorisée.
 * @returns {{rolled: number, keep: number, flatBonus: number}}
 */
export function normalizeRollKeep(rolledInput, keepInput, { maxKeep = 10 } = {}) {
  let rolled = rolledInput;
  let keep = Math.min(keepInput, rolled);
  let flatBonus = 0;

  if (rolled > 10) {
    let extra = rolled - 10;
    rolled = 10;

    // Deux dés en trop = +1 dé gardé, tant qu'on n'a pas atteint la garde max.
    while (extra >= 2 && keep < maxKeep) {
      keep += 1;
      extra -= 2;
    }

    // Ce qui reste (garde déjà au max, ou reliquat impair) devient du flat.
    flatBonus = extra * 2;
  }

  keep = Math.min(keep, maxKeep);
  return { rolled, keep, flatBonus };
}
