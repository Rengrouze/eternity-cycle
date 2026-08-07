import { isActionEconomyEnforced } from "../settings.mjs";
import { effectiveMoveBudget } from "../rules/actions.mjs";

/**
 * Incrémente automatiquement system.combat.distanceMovedThisTurn (voir
 * module/rules/actions.mjs#computeMoveBudget, panneau "Déplacement" de
 * tab-combat.hbs) quand un token bouge sur la carte PENDANT le tour de
 * combat de SON PROPRE Acteur - demandé pour lier le suivi de déplacement
 * au mouvement réel plutôt qu'à un compteur saisi entièrement à la main
 * (qui reste éditable en secours, ex: téléportation, correction manuelle).
 *
 * Bloque aussi entièrement le déplacement d'un personnage engagé dans une
 * Empoignade (voir SystemActor#initiateGrapple, system.combat.grappleGroupId) -
 * "pendant une Empoignade les tokens ne peuvent pas bouger", quel que soit
 * le tour en cours (les deux participants sont physiquement immobilisés
 * l'un contre l'autre). Le MJ garde la main pour une mise en scène
 * narrative (ex: repositionner la paire après un Jeter, qui retire déjà la
 * cible de l'Empoignade avant que cette vérification n'intervienne).
 *
 * Écouté sur `preUpdateToken` plutôt que `updateToken` : c'est le seul
 * moment où l'ancienne position (tokenDoc.x/y) est encore disponible pour
 * calculer la distance parcourue (et où `changed.x`/`changed.y` peuvent
 * encore être retirés pour annuler le déplacement) - `updateToken` reçoit
 * le document déjà à jour, l'ancienne position serait perdue.
 *
 * `actor.isOwner` protège contre une tentative d'écriture sur un client qui
 * n'a pas la permission (ex: ce hook se déclenchant côté MJ pour le token
 * d'un joueur, ou l'inverse) - échouerait sinon avec une erreur de
 * permission visible en jeu, voir module/hooks/combat-turn-reset.mjs pour
 * le même souci côté `updateCombat`.
 *
 * Bloque aussi ENTIÈREMENT le déplacement d'un personnage engagé dans le
 * combat en cours (voir #isInCombat) tant que ce n'est PAS son tour - le
 * mouvement n'est permis QUE pendant son propre tour, ce n'est pas une
 * simple absence de suivi comme hors combat. AUCUNE exemption MJ.
 *
 * Bloque aussi RÉELLEMENT le déplacement une fois le budget du tour épuisé
 * (voir module/rules/actions.mjs#effectiveMoveBudget) - refuse le
 * déplacement (même mécanisme que le veto Empoignade ci-dessus) tant que le
 * déplacement déjà parcouru + celui-ci dépasserait le cap actuel
 * (`moveBudget.free`, +1× `moveBudget.simple` par Action Simple "Foncer"
 * dépensée ce tour - voir SystemActor#spendMoveAction). Contrairement au
 * veto Empoignade, AUCUNE exemption MJ ici : "peu importe qui joue le token,
 * les règles de déplacement s'appliquent" - demande explicite après un test
 * où le MJ déplaçait lui-même un token de PJ sans jamais être bloqué.
 */
export function registerTokenMovementTracking() {
  Hooks.on("preUpdateToken", (tokenDoc, changed) => trackMovement(tokenDoc, changed));
}

function trackMovement(tokenDoc, changed) {
  if (changed.x === undefined && changed.y === undefined) return;
  if (!isActionEconomyEnforced()) return;

  const actor = tokenDoc.actor;
  if (!actor || actor.type !== "character") return;
  if (!actor.isOwner) return;

  if (actor.system.combat.grappleGroupId && !game.user.isGM) {
    delete changed.x;
    delete changed.y;
    ui.notifications.warn(game.i18n.format("L5R4EC.Notif.CannotMoveGrappled", { name: actor.name }));
    return;
  }

  // Combat actif, personnage engagé dedans, mais PAS son tour : le token ne
  // bouge pas du tout - "le déplacement doit être UNIQUEMENT possible
  // pendant son propre tour" (demande explicite, pas juste une absence de
  // suivi/plafond comme avant). AUCUNE exemption MJ, même raison que le
  // blocage de budget plus bas.
  if (game.combat?.started && actor.isInCombat && !actor.isCurrentTurn) {
    delete changed.x;
    delete changed.y;
    ui.notifications.warn(game.i18n.format("L5R4EC.Notif.CannotMoveNotYourTurn", { name: actor.name }));
    return;
  }

  // Hors combat, ou personnage non engagé dans le combat en cours : aucune
  // restriction (voir #isInCombat) - le blocage ci-dessus a déjà couvert le
  // seul autre cas possible (engagé mais pas son tour).
  if (!game.combat?.started || !actor.isCurrentTurn) return;

  const grid = tokenDoc.parent?.grid;
  if (!grid?.size) return;

  const fromX = tokenDoc.x;
  const fromY = tokenDoc.y;
  const toX = changed.x ?? fromX;
  const toY = changed.y ?? fromY;

  const pixelDistance = Math.hypot(toX - fromX, toY - fromY);
  const distance = (pixelDistance / grid.size) * grid.distance;
  if (distance <= 0) return;

  const current = actor.system.combat.distanceMovedThisTurn;

  // Blocage réel une fois le budget du tour épuisé (voir module/rules/actions.mjs
  // #effectiveMoveBudget) - `moveBudget.free` par défaut, +1× `moveBudget.simple`
  // par Action Simple "Foncer" dépensée ce tour (voir SystemActor#spendMoveAction,
  // system.combat.moveActionsSpent - répétable, pas un interrupteur à usage
  // unique). AUCUNE exemption MJ ici - "peu importe qui joue le token, même
  // le MJ doit respecter le budget" (contrairement au veto Empoignade
  // ci-dessus, qui reste une mise en scène volontaire du MJ).
  const budget = effectiveMoveBudget(actor);
  const movesSpent = actor.system.combat.moveActionsSpent;
  const cap = movesSpent === 0 ? budget.free : movesSpent * budget.simple;
  if (current + distance > cap) {
    delete changed.x;
    delete changed.y;
    ui.notifications.warn(game.i18n.format("L5R4EC.Notif.MoveOverBudget", { name: actor.name, cap }));
    return;
  }

  actor.update({ "system.combat.distanceMovedThisTurn": current + distance });
}
