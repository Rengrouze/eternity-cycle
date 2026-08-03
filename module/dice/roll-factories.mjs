import { normalizeRollKeep } from "./roll-keep-math.mjs";

/**
 * Jet de Trait ou d'Anneau : XgX (X = rang du Trait/Anneau), explose toujours.
 * Utilisable indifféremment pour un Trait ou un Anneau, la mécanique est identique.
 *
 * @param {object} params
 * @param {number} params.rank        Rang du Trait ou de l'Anneau utilisé.
 * @param {number} [params.rollBonus=0]  Bonus de dés lancés (ex: modale de bonus).
 * @param {number} [params.keepBonus=0]  Bonus de dés gardés.
 * @returns {{rolled: number, keep: number, flatBonus: number, explode: boolean, explodeOn: number, rerollOnes: boolean}}
 */
export function basicRoll({ rank, rollBonus = 0, keepBonus = 0 }) {
  const { rolled, keep, flatBonus } = normalizeRollKeep(rank + rollBonus, rank + keepBonus);
  return { rolled, keep, flatBonus, explode: true, explodeOn: 10, rerollOnes: false };
}

/**
 * Jet de Compétence : (Trait + Rang de compétence)g(Trait), plafonné à 10g10.
 * - N'explose que si la compétence est entraînée (rang >= 1).
 * - Relance simple des 1 si la compétence est spécialisée.
 *
 * @param {object} params
 * @param {number} params.traitRank    Rang du Trait associé à la compétence.
 * @param {number} params.skillRank    Rang de la compétence (0 = non entraînée).
 * @param {boolean} [params.specialized=false]  Spécialisation active (relance des 1).
 * @param {number} [params.rollBonus=0]
 * @param {number} [params.keepBonus=0]
 * @param {number} [params.explodeOn=10]  Personnalisable (certaines techniques font exploser les 9).
 */
export function skillRoll({
  traitRank,
  skillRank,
  specialized = false,
  rollBonus = 0,
  keepBonus = 0,
  explodeOn = 10
}) {
  const trained = skillRank >= 1;
  const { rolled, keep, flatBonus } = normalizeRollKeep(
    traitRank + skillRank + rollBonus,
    traitRank + keepBonus,
    { maxKeep: 10 } // un jet de compétence ne dépasse jamais 10g10
  );

  return {
    rolled,
    keep,
    flatBonus,
    explode: trained,
    explodeOn,
    rerollOnes: specialized
  };
}
