import { L5RRollKeep } from "../dice/l5r-roll.mjs";
import { buildInitiativeRollConfig } from "../rules/initiative.mjs";

/**
 * Combatant custom : raccroche l'Initiative native du Combat Tracker de
 * Foundry (bouton "Lancer l'Initiative", icône dé par combattant, tri
 * automatique du tracker) au moteur de dés Retiens & Garde du système plutôt
 * qu'à une formule Foundry standard (`1d20` etc), incompatible avec la
 * mécanique L5R.
 *
 * `getInitiativeRoll` doit renvoyer un Roll NON évalué (Foundry l'évalue et
 * lit `.total` lui-même pour trier/stocker l'Initiative) - voir
 * L5RRollKeep#total pour pourquoi ce total reflète bien keptTotal et non la
 * somme brute de tous les dés.
 */
export class SystemCombatant extends Combatant {
  /** @override */
  getInitiativeRoll(formula) {
    const actor = this.actor;
    if (!actor || actor.type !== "character") return super.getInitiativeRoll(formula);

    return L5RRollKeep.build(buildInitiativeRollConfig(actor));
  }
}
