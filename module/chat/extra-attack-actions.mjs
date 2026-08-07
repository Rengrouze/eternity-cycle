/**
 * Câble le bouton "Attaque Supplémentaire : relancer" affiché sur une carte
 * de Jet d'Attaque réussi avec la Manœuvre Attaque Supplémentaire activée
 * (voir templates/chat/roll-keep-card.hbs, SystemActor#rollAttack) - même
 * pattern que module/chat/damage-chat-actions.mjs.
 *
 * Relance un jet d'Attaque simple avec la MÊME Arme, sans rouvrir de modale
 * (pas d'Augmentation/Manœuvre supplémentaire sur cette deuxième attaque -
 * déjà payée par les 5 Augmentations de la première) - change de cible en
 * changeant la cible Foundry sélectionnée (game.user.targets) avant de
 * cliquer, comme demandé ("pas forcément sur la même cible").
 */
export function registerExtraAttackActions() {
  Hooks.on("renderChatMessageHTML", (message, html) => bindExtraAttackButton(html));
}

function bindExtraAttackButton(html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const button = root?.querySelector?.('[data-action="rollAttackAgain"]');
  if (!button || button.dataset.bound === "true") return;

  button.dataset.bound = "true";
  button.addEventListener("click", () => onRollAttackAgain(button));
}

/** @param {HTMLElement} button */
async function onRollAttackAgain(button) {
  const { actorId, weaponId } = button.dataset;
  const actor = game.actors.get(actorId);
  if (!actor) return;

  button.disabled = true;
  await actor.rollAttack(weaponId, { skipActionCost: true });
}
