import { ACTION_POINTS_PER_TURN } from "../rules/actions.mjs";

/**
 * Remet à neuf le budget d'Action (system.combat.actionPoints), le compteur
 * de déplacement du tour et le nombre de fois "Foncer" a déjà été dépensé
 * (system.combat.distanceMovedThisTurn/moveActionsSpent, voir
 * SystemActor#spendMoveAction, module/hooks/token-movement-tracking.mjs) et
 * la Manœuvre Garde (system.combat.guardTargetActorId/guardRound, voir
 * SystemActor#declareGuard - "jusqu'à votre prochain tour") du combattant
 * dont c'est maintenant le tour - voir SystemActor#spendActionPoints et le
 * panneau "Déplacement" de tab-combat.hbs.
 *
 * Écouté sur `updateCombat` plutôt que sur un hook sémantique dédié, même
 * raison que module/hooks/reaction-phase.mjs (fiabilité) - `changed.turn`
 * couvre un tour suivant DANS un round, `changed.round` couvre le retour au
 * premier combattant d'un nouveau round (qui remet `turn` à 0 sans forcément
 * apparaître dans `changed` selon le chemin interne emprunté par Foundry).
 *
 * `system.combat.actionTurn` (round*1000+turn) évite un double reset si
 * `updateCombat` se déclenche plusieurs fois pour le même tour - même
 * convention que `stanceRound` dans reaction-phase.mjs.
 *
 * Redétermine aussi le contrôle de l'Empoignade (voir SystemActor#_resolveGrappleControl)
 * si le combattant dont c'est le tour est engagé dans une lutte -
 * "A grappled character must try to control the grapple at the beginning of
 * his Turn."
 *
 * `updateCombat` se déclenche sur TOUS les clients connectés (le document
 * Combat est diffusé à tout le monde), pas seulement celui qui a fait
 * avancer le tour - sans garde, chaque client (y compris ceux d'un joueur
 * qui ne possède pas l'Acteur dont c'est le tour) tenterait le même
 * `actor.update()` et échouerait avec une erreur de permission (visible en
 * jeu : "lacks permission to update ActorDelta..."). Restreint donc
 * l'exécution réelle au client MJ (permissions toujours complètes), qui
 * reçoit bien ce hook même si c'est un joueur qui a fait avancer le tour.
 */
export function registerCombatTurnReset() {
  Hooks.on("updateCombat", (combat, changed) => {
    if (!game.user.isGM) return;
    if (changed.round === undefined && changed.turn === undefined) return;
    console.log("L5R4EC | updateCombat (MJ) - reset du combattant courant", { round: combat.round, turn: combat.turn, changed });
    resetCurrentCombatantBudget(combat);
  });
}

async function resetCurrentCombatantBudget(combat) {
  const actor = combat.combatant?.actor;
  if (!actor || actor.type !== "character") {
    console.log("L5R4EC | resetCurrentCombatantBudget : pas de combattant PJ courant, rien à faire", actor?.name);
    return;
  }

  const turnKey = combat.round * 1000 + (combat.turn ?? 0);
  if (actor.system.combat.actionTurn === turnKey) {
    console.log(`L5R4EC | resetCurrentCombatantBudget : ${actor.name} déjà réinitialisé pour ce tour (turnKey=${turnKey}), on ignore`);
    return;
  }
  console.log(`L5R4EC | resetCurrentCombatantBudget : reset de ${actor.name} pour turnKey=${turnKey}, grappleGroupId=${actor.system.combat.grappleGroupId || "(aucun)"}`);

  await actor.update({
    "system.combat.actionPoints": ACTION_POINTS_PER_TURN,
    "system.combat.distanceMovedThisTurn": 0,
    "system.combat.moveActionsSpent": 0,
    "system.combat.actionTurn": turnKey,
    "system.combat.guardTargetActorId": "",
    "system.combat.guardRound": -1
  });

  if (actor.system.combat.grappleGroupId) {
    try {
      await actor._resolveGrappleControl();
    } catch (err) {
      // Ne doit jamais empêcher silencieusement la suite (reset déjà fait
      // ci-dessus) - remonte l'erreur au lieu de la laisser en rejet de
      // promesse non géré, invisible pour la table. Voir aussi le bouton de
      // secours "Tenter de reprendre le contrôle" dans tab-combat.hbs, qui
      // permet de relancer ce jet à la main si l'automatique ne s'est pas
      // déclenché pour une raison quelconque.
      console.error("L5R4EC | Échec de la résolution du contrôle d'Empoignade", err);
    }
  }
}
