import { L5RRollKeep } from "../dice/l5r-roll.mjs";

/**
 * Harmonise l'apparence du message de chat posté par le Combat Tracker natif
 * de Foundry (bouton "Lancer l'Initiative", icône dé par combattant) avec
 * notre carte de jet custom (templates/chat/roll-keep-card.hbs) - sans cela,
 * `Combat#rollInitiative` poste le message via `roll.toMessage()`, qui rend
 * le Roll avec le template générique de Foundry (liste de "1d10 + 1d10..."),
 * visuellement très différent du jet manuel posté par SystemActor#rollInitiative
 * (qui passe par performRoll() et notre carte).
 *
 * Foundry ne laisse pas facilement injecter un contenu custom AVANT la
 * création du message depuis ce flux natif (pas de hook garanti utilisable
 * en amont pour ce cas précis) - on laisse le message se créer normalement
 * puis on réécrit son contenu juste après coup (`createChatMessage`), repéré
 * via le flag `core.initiativeRoll` que Foundry pose lui-même sur ces
 * messages. Seul le MJ effectue la réécriture (toujours autorisé à modifier
 * n'importe quel message, contrairement à un joueur sur le message de
 * quelqu'un d'autre) - évite aussi une double réécriture si plusieurs
 * clients recevaient ce hook.
 */
export function registerInitiativeChatCard() {
  Hooks.on("createChatMessage", (message) => harmonizeInitiativeCard(message));
}

async function harmonizeInitiativeCard(message) {
  if (!game.user.isGM) return;
  if (!message.getFlag("core", "initiativeRoll")) return;

  const roll = message.rolls?.[0];
  if (!(roll instanceof L5RRollKeep)) return;

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/l5r4ec/templates/chat/roll-keep-card.hbs",
    {
      flavor: game.i18n.localize("L5R4EC.Sheet.InitiativeRoll"),
      rolled: roll.rolledCount,
      kept: roll.keepCount,
      keptTotal: roll.keptTotal,
      flatBonus: roll.flatBonus,
      woundPenalty: roll.woundPenalty,
      keptDice: roll.keptDiceDisplay,
      discardedDice: roll.discardedDiceDisplay
    }
  );

  await message.update({ content });
}
