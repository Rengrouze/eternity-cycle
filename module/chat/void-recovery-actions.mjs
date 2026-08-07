/**
 * Câble le bouton "Récupérer des Points de Vide" affiché sur une carte de
 * Jet de Compétence (Méditation, Cérémonie du Thé...) qui restaure des
 * Points de Vide - voir templates/chat/roll-keep-card.hbs et
 * SystemActor#rollSkill pour la construction du bouton. Même pattern que
 * module/chat/damage-chat-actions.mjs : bouton posté dans un message de
 * chat déjà rendu, donc hook de rendu global plutôt qu'action d'ApplicationV2.
 */
export function registerVoidRecoveryActions() {
  Hooks.on("renderChatMessageHTML", (message, html) => bindVoidRecoveryButton(html));
}

function bindVoidRecoveryButton(html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const button = root?.querySelector?.('[data-action="recoverVoid"]');
  if (!button || button.dataset.bound === "true") return;

  button.dataset.bound = "true";
  button.addEventListener("click", () => onRecoverVoid(button));
}

/** @param {HTMLElement} button */
async function onRecoverVoid(button) {
  const { actorId, amount } = button.dataset;
  const actor = game.actors.get(actorId);
  if (!actor) return;

  await actor.recoverVoidPoints(Number(amount) || 1);
  button.disabled = true;
}
