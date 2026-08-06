/**
 * Câble les boutons Valider/Refuser d'une demande de dépense d'argent (voir
 * templates/chat/money-request-card.hbs, postée par
 * SystemActor#requestSpendMoney) - même raisonnement de hook global que
 * module/chat/damage-chat-actions.mjs (le contenu vit dans un message de
 * chat déjà posté, pas d'Application ici).
 *
 * Toutes les infos de la demande (acteur, montant par dénomination, raison)
 * vivent dans le flag `l5r4ec.moneyRequest` du message plutôt que dans des
 * attributs `data-*` sur les boutons - un flag survit à la sérialisation du
 * message (contrairement à des propriétés custom sur un Roll, voir
 * L5RRollKeep#toJSON) et sert aussi à détecter la résolution de la demande
 * pour prévenir le joueur (voir notifyRequester).
 *
 * Le joueur ne doit pas pouvoir valider sa propre demande : les boutons sont
 * retirés du DOM pour tout client non-MJ (pas seulement désactivés au clic),
 * pour ne pas laisser un bouton cliquable qui ne ferait rien.
 */
export function registerMoneyRequestActions() {
  Hooks.on("renderChatMessageHTML", (message, html) => bindMoneyRequestButtons(message, html));
  Hooks.on("renderChatMessage", (message, html) => bindMoneyRequestButtons(message, html));
  Hooks.on("updateChatMessage", (message, changed) => notifyRequester(message, changed));
}

function bindMoneyRequestButtons(message, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const buttons = root?.querySelectorAll?.('[data-action="approveMoneySpend"], [data-action="rejectMoneySpend"]');
  if (!buttons?.length) return;

  if (!game.user.isGM) {
    buttons.forEach((button) => button.remove());
    return;
  }

  buttons.forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => onMoneyRequestClick(message, button));
  });
}

/**
 * @param {ChatMessage} message
 * @param {HTMLElement} button
 */
async function onMoneyRequestClick(message, button) {
  const request = message.getFlag("l5r4ec", "moneyRequest");
  if (!request) return;

  const actor = game.actors.get(request.actorId);
  if (!actor) return;

  const approved = button.dataset.action === "approveMoneySpend";
  if (approved) {
    const ok = await actor.spendMoney({ koku: request.koku, bu: request.bu, zeni: request.zeni });
    if (!ok) {
      ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotEnoughMoney", { name: actor.name }));
      return;
    }
  }

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/l5r4ec/templates/chat/money-request-card.hbs",
    { actorName: actor.name, amountText: request.amountText, reason: request.reason, pending: false, approved }
  );

  await message.update({
    content,
    "flags.l5r4ec.moneyRequest.resolved": true,
    "flags.l5r4ec.moneyRequest.approved": approved
  });
}

/**
 * Prévient le joueur propriétaire du personnage concerné, sur son propre
 * client, dès que le MJ tranche sa demande - se déclenche pour tout le monde
 * (updateChatMessage est un hook standard de mise à jour de document), mais
 * ne notifie que le client qui possède l'Actor concerné (et pas le MJ
 * lui-même, qui vient de faire l'action).
 * @param {ChatMessage} message
 * @param {object} changed
 */
function notifyRequester(message, changed) {
  if (game.user.isGM) return;
  if (changed.flags?.l5r4ec?.moneyRequest?.resolved !== true) return;

  const request = message.getFlag("l5r4ec", "moneyRequest");
  const actor = game.actors.get(request?.actorId);
  if (!actor?.isOwner) return;

  const key = request.approved ? "L5R4EC.Notif.MoneyRequestApproved" : "L5R4EC.Notif.MoneyRequestRejected";
  ui.notifications.info(game.i18n.format(key, { amount: request.amountText }));
}
