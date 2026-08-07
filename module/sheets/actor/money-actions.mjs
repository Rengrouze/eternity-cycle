import { promptSpendMoney } from "./roll-prompts.mjs";

/**
 * Handlers d'action pour l'argent : cassage de pièces et dépense/demande
 * de dépense (voir SystemActor#breakKoku/#breakBu/#spendMoney/#requestSpendMoney).
 */

/**
 * Casse 1 Koku en 5 Bu.
 * @this {CharacterSheet}
 */
export async function onBreakKoku() {
  await this.actor.breakKoku();
}

/**
 * Casse 1 Bu en 10 Zeni.
 * @this {CharacterSheet}
 */
export async function onBreakBu() {
  await this.actor.breakBu();
}

/**
 * "Dépenser" : le MJ déduit directement, un joueur ne peut que poster une
 * demande de dépense au chat, que le MJ doit valider (voir
 * SystemActor#spendMoney/#requestSpendMoney) - l'argent n'est éditable
 * directement par un joueur nulle part sur la fiche.
 * @this {CharacterSheet}
 */
export async function onSpendMoney() {
  const result = await promptSpendMoney();
  if (!result) return;

  if (game.user.isGM) {
    const ok = await this.actor.spendMoney(result);
    if (!ok) ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotEnoughMoney", { name: this.actor.name }));
  } else {
    await this.actor.requestSpendMoney(result);
  }
}
