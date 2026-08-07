/**
 * Câble le bouton "Appliquer les dégâts" affiché sur une carte de Jet de
 * Dégâts (voir templates/chat/roll-keep-card.hbs, SystemActor#rollDamage) -
 * et, une fois posée, les boutons Valider/Refuser d'une éventuelle demande
 * d'application (voir templates/chat/damage-request-card.hbs). Vit dans un
 * message de chat déjà posté, même raison de hook global que
 * module/chat/damage-chat-actions.mjs.
 *
 * Validation MJ obligatoire (voir SystemActor#applyDamage, qui déduit la
 * Réduction d'Armure avant d'ajouter à system.wounds.value) : si c'est le MJ
 * qui clique "Appliquer les dégâts", il applique directement (il EST déjà
 * l'autorité) - sinon (un joueur), ça poste une demande dont seul le MJ voit
 * les boutons Valider/Refuser, même convention que
 * module/chat/money-request-actions.mjs (flag `l5r4ec.damageRequest` plutôt
 * que des attributs `data-*`, pour survivre à la sérialisation et détecter
 * la résolution côté #notifyDamageRequester).
 *
 * Pas de garde persistante contre un second clic sur "Appliquer les
 * dégâts" (juste `button.disabled` côté client après le premier clic) - même
 * niveau de rigueur que "Lancer les dégâts" (damage-chat-actions.mjs), qui
 * n'a lui non plus aucune garde contre un second clic aujourd'hui.
 */
export function registerDamageApplicationActions() {
  Hooks.on("renderChatMessageHTML", (message, html) => bindApplyDamageButton(html));
  Hooks.on("renderChatMessageHTML", (message, html) => bindDamageRequestButtons(message, html));
  Hooks.on("updateChatMessage", (message, changed) => notifyDamageRequester(message, changed));
}

function bindApplyDamageButton(html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const button = root?.querySelector?.('[data-action="applyDamage"]');
  if (!button || button.dataset.bound === "true") return;

  button.dataset.bound = "true";
  button.addEventListener("click", () => onApplyDamage(button));
}

/** @param {HTMLElement} button */
async function onApplyDamage(button) {
  const { attackerActorId, targetActorId, amount } = button.dataset;
  const targetActor = game.actors.get(targetActorId);
  const attackerActor = game.actors.get(attackerActorId);
  if (!targetActor || !attackerActor) return;

  button.disabled = true;
  const parsedAmount = Number(amount) || 0;

  if (game.user.isGM) {
    const applied = await targetActor.applyDamage(parsedAmount);
    ui.notifications.info(game.i18n.format("L5R4EC.Notif.DamageApplied", { amount: applied, name: targetActor.name }));
    return;
  }

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/l5r4ec/templates/chat/damage-request-card.hbs",
    { attackerName: attackerActor.name, targetName: targetActor.name, amount: parsedAmount, pending: true }
  );

  await ChatMessage.create({
    content,
    speaker: ChatMessage.getSpeaker({ actor: attackerActor }),
    flags: {
      l5r4ec: {
        damageRequest: { attackerActorId, targetActorId, amount: parsedAmount, resolved: false }
      }
    }
  });
}

function bindDamageRequestButtons(message, html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const buttons = root?.querySelectorAll?.('[data-action="approveDamageApplication"], [data-action="rejectDamageApplication"]');
  if (!buttons?.length) return;

  if (!game.user.isGM) {
    buttons.forEach((button) => button.remove());
    return;
  }

  buttons.forEach((button) => {
    if (button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => onDamageRequestClick(message, button));
  });
}

/**
 * @param {ChatMessage} message
 * @param {HTMLElement} button
 */
async function onDamageRequestClick(message, button) {
  const request = message.getFlag("l5r4ec", "damageRequest");
  if (!request) return;

  const targetActor = game.actors.get(request.targetActorId);
  const attackerActor = game.actors.get(request.attackerActorId);
  if (!targetActor || !attackerActor) return;

  const approved = button.dataset.action === "approveDamageApplication";
  const appliedAmount = approved ? await targetActor.applyDamage(request.amount) : 0;

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/l5r4ec/templates/chat/damage-request-card.hbs",
    { attackerName: attackerActor.name, targetName: targetActor.name, amount: request.amount, pending: false, approved, appliedAmount }
  );

  await message.update({
    content,
    "flags.l5r4ec.damageRequest.resolved": true,
    "flags.l5r4ec.damageRequest.approved": approved
  });
}

/**
 * Prévient le joueur propriétaire de l'ATTAQUANT (celui qui a demandé
 * l'application, pas la cible) dès que le MJ tranche - même sémantique
 * "requester" que module/chat/money-request-actions.mjs#notifyRequester.
 * @param {ChatMessage} message
 * @param {object} changed
 */
function notifyDamageRequester(message, changed) {
  if (game.user.isGM) return;
  if (changed.flags?.l5r4ec?.damageRequest?.resolved !== true) return;

  const request = message.getFlag("l5r4ec", "damageRequest");
  const attackerActor = game.actors.get(request?.attackerActorId);
  if (!attackerActor?.isOwner) return;

  const targetActor = game.actors.get(request.targetActorId);
  const key = request.approved ? "L5R4EC.Notif.DamageRequestApproved" : "L5R4EC.Notif.DamageRequestRejected";
  ui.notifications.info(game.i18n.format(key, { name: targetActor?.name ?? "?" }));
}
