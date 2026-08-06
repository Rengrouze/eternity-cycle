import { normalizeRollKeep } from "../dice/roll-keep-math.mjs";

/**
 * Formule d'Initiative L5R 4e : (Rang + Réflexes) dés lancés, on ne garde
 * que les Réflexes parmi eux, un éventuel bonus fixe s'ajoute après coup. Le
 * "Rang" utilisé ici est system.reputation.rank - calculé automatiquement
 * (voir SystemActor#_computeReputation), équivalent maison de l'Insight Rank
 * du LdB - il n'y a pas de champ de rang distinct/manuel sur la fiche.
 *
 * Comme n'importe quel jet L5R, ce couple lancé/gardé peut dépasser 10 dés
 * lancés (ex: Rang 8 + Réflexes 6 = 14g6) - on applique alors la même règle
 * de conversion que les jets de Compétence (voir normalizeRollKeep : chaque
 * paire de dés en trop au-delà de 10 lancés devient +1 dé gardé, ex.
 * 14g6 -> 10g8), plutôt que de laisser passer un 14g6 invalide.
 *
 * Factorisée ici pour être utilisée à la fois par SystemActor#rollInitiative
 * (bouton manuel sur la fiche, hors combat ou pour un jet libre) et
 * SystemCombatant#getInitiativeRoll (intégration native au Combat Tracker de
 * Foundry) - une seule source de vérité pour la formule.
 * @param {Actor} actor
 * @returns {{rolled: number, keep: number, flatBonus: number, explode: boolean, explodeOn: number, rerollOnes: boolean}}
 */
export function buildInitiativeRollConfig(actor) {
  const rank = actor.system.reputation.rank;
  const ref = actor.system.traits.ref;
  const { rolled, keep, flatBonus } = normalizeRollKeep(rank + ref, ref);

  return {
    rolled,
    keep,
    flatBonus: flatBonus + (actor.system.combat?.initiativeBonus ?? 0),
    explode: true,
    explodeOn: 10,
    rerollOnes: false
  };
}
