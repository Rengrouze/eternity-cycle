/**
 * Câble les boutons Valider/Refuser d'une demande de dérogation (voir
 * templates/chat/roll-request-card.hbs, postée par SystemActor#requestTurnOverride
 * quand l'Économie d'Action bloque un jet ou une Action - voir #_ensureCanRoll
 * ET #spendActionPoints, ex: victime d'Empoignade qui tente quand même
 * quelque chose "avec l'accord du MJ") - même pattern que
 * module/chat/money-request-actions.mjs. `request.bodyKey` porte la clé de
 * traduction du motif précis (pas toujours "hors-tour"), fixée au moment de
 * la demande et réutilisée telle quelle à la résolution.
 *
 * Une validation n'essaie PAS de rejouer le jet original (le nom de méthode
 * et les options ne sont pas sérialisés dans la carte) : elle accorde
 * simplement une fenêtre de 60 secondes (flag `l5r4ec.turnOverrideUntil` sur
 * l'Actor) pendant laquelle le PROCHAIN essai du joueur passera - plus
 * simple, et laisse l'animation Dice So Nice se déclencher normalement sur
 * le client du joueur qui relance, pas sur celui du MJ qui valide.
 */
export function registerRollRequestActions() {
  Hooks.on("renderChatMessageHTML", (message, html) => bindRollRequestButtons(message, html));
  Hooks.on("updateChatMessage", (message, changed) => notifyRequester(message, changed));
}

function bindRollRequestButtons(message, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const buttons = root?.querySelectorAll?.('[data-action="approveRollRequest"], [data-action="rejectRollRequest"]');
  if (!buttons?.length) return;

  if (!game.user.isGM) {
    buttons.forEach((button) => button.remove());
    return;
  }

  buttons.forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => onRollRequestClick(message, button));
  });
}

/**
 * @param {ChatMessage} message
 * @param {HTMLElement} button
 */
async function onRollRequestClick(message, button) {
  const request = message.getFlag("l5r4ec", "rollRequest");
  if (!request) return;

  const actor = game.actors.get(request.actorId);
  if (!actor) return;

  const approved = button.dataset.action === "approveRollRequest";
  if (approved) {
    // 60 secondes pour retenter le jet - largement assez pour re-cliquer le
    // bouton, pas assez pour traîner en cas de désynchronisation d'horloge.
    await actor.setFlag("l5r4ec", "turnOverrideUntil", Date.now() + 60000);
  }

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/l5r4ec/templates/chat/roll-request-card.hbs",
    { actorName: actor.name, bodyKey: request.bodyKey, pending: false, approved }
  );

  await message.update({
    content,
    "flags.l5r4ec.rollRequest.resolved": true,
    "flags.l5r4ec.rollRequest.approved": approved
  });
}

/**
 * Prévient le joueur propriétaire du personnage concerné dès que le MJ
 * tranche sa demande - même logique que money-request-actions.mjs#notifyRequester.
 * @param {ChatMessage} message
 * @param {object} changed
 */
function notifyRequester(message, changed) {
  if (game.user.isGM) return;
  if (changed.flags?.l5r4ec?.rollRequest?.resolved !== true) return;

  const request = message.getFlag("l5r4ec", "rollRequest");
  const actor = game.actors.get(request?.actorId);
  if (!actor?.isOwner) return;

  const key = request.approved ? "L5R4EC.Notif.RollRequestApproved" : "L5R4EC.Notif.RollRequestRejected";
  ui.notifications.info(game.i18n.localize(key));
}
