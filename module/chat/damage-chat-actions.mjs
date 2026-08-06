/**
 * Câble le bouton "Lancer les dégâts" affiché sur une carte de Jet de Sort ou
 * de Jet d'Attaque réussi (voir templates/chat/roll-keep-card.hbs). Ce
 * bouton vit dans un message de chat déjà posté - il ne peut donc pas passer
 * par le système d'actions d'une ApplicationV2 (pas d'Application ici), d'où
 * un hook de rendu de message global plutôt qu'un handler câblé à la création.
 *
 * Enregistré sur les deux noms de hook possibles selon la version de Foundry
 * (`renderChatMessageHTML` - AppV2, HTMLElement natif - et l'ancien
 * `renderChatMessage` - jQuery) par prudence ; le flag `data-bound` évite un
 * double câblage si jamais les deux se déclenchaient.
 */
export function registerDamageChatActions() {
  Hooks.on("renderChatMessageHTML", (message, html) => bindDamageButton(html));
  Hooks.on("renderChatMessage", (message, html) => bindDamageButton(html));
}

function bindDamageButton(html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  const button = root?.querySelector?.('[data-action="rollDamage"]');
  if (!button || button.dataset.bound === "true") return;

  button.dataset.bound = "true";
  button.addEventListener("click", () => onRollDamage(button));
}

/** @param {HTMLElement} button */
async function onRollDamage(button) {
  const { actorId, itemName, rolled, kept, note } = button.dataset;
  const actor = game.actors.get(actorId);
  if (!actor) return;

  const content = `
    <div class="l5r4ec flex flex-col gap-2 p-1 w-64">
      <label class="flex justify-between items-center gap-2">
        ${game.i18n.localize("L5R4EC.Sheet.DamageRolled")}
        <input type="number" name="rolled" value="${rolled}" min="0" class="w-16 border rounded text-center">
      </label>
      <label class="flex justify-between items-center gap-2">
        ${game.i18n.localize("L5R4EC.Sheet.DamageKept")}
        <input type="number" name="kept" value="${kept}" min="0" class="w-16 border rounded text-center">
      </label>
      ${note ? `<div class="text-xs text-neutral-500 italic">${note}</div>` : ""}
    </div>`;

  const result = await foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.format("L5R4EC.Dialog.DamageRollTitle", { name: itemName }) },
    content,
    modal: true,
    rejectClose: false,
    buttons: [
      {
        action: "roll",
        label: game.i18n.localize("L5R4EC.Dialog.Roll"),
        icon: "fa-solid fa-dice-d10",
        default: true,
        callback: (event, btn) => ({
          rolled: Number(btn.form.elements.rolled.value) || 0,
          kept: Number(btn.form.elements.kept.value) || 0
        })
      },
      { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
    ]
  });

  if (!result || result === "cancel") return;
  await actor.rollDamage(itemName, result);
}
