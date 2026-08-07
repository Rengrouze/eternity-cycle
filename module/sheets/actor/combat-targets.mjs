/**
 * Liste des autres Combattants du combat en cours - source commune des menus
 * déroulants de cible de la fiche (Garde, Empoignade, Attaque, Sort). Un
 * menu déroulant plutôt que le ciblage natif de Foundry (réticule sur le
 * token) : ce dernier n'est visible/découvrable nulle part dans la fiche,
 * contrairement à ce menu, déjà utilisé avec succès pour Garde/Empoignade.
 * @param {Actor} actor
 * @returns {Array<{id: string, name: string}>}
 */
export function listOtherCombatants(actor) {
  return (game.combat?.combatants ?? [])
    .filter((c) => c.actor && c.actor.id !== actor.id)
    .map((c) => ({ id: c.actor.id, name: c.actor.name }));
}
