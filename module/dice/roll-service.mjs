import { L5RRollKeep } from "./l5r-roll.mjs";

/**
 * Construit, évalue et poste un jet Roll & Keep au chat.
 * Dice So Nice s'anime automatiquement dès qu'un ChatMessage contient un
 * Roll (voir TUTORIEL-chat-messages.md) - mais voir la note ci-dessous.
 *
 * @param {Actor} actor
 * @param {{rolled: number, keep: number, flatBonus?: number, explode?: boolean, explodeOn?: number, rerollOnes?: boolean}} config
 *        Généralement produit par roll-factories.mjs (basicRoll / skillRoll).
 * @param {string} flavor
 * @returns {Promise<L5RRollKeep>}
 */
export async function performRoll(actor, config, flavor) {
  // Malus automatique lié au rang de blessure actuel (0 si Indemne).
  const woundPenalty = actor.system.wounds?.penalty ?? 0;

  const roll = L5RRollKeep.build({ ...config, woundPenalty });
  await roll.evaluate();

  if (actor.system.wounds?.isOut) {
    ui.notifications.warn(
      game.i18n.format("L5R4EC.Notif.CharacterOut", { name: actor.name })
    );
  }

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/l5r4ec/templates/chat/roll-keep-card.hbs",
    {
      flavor,
      keptTotal: roll.keptTotal,
      flatBonus: roll.flatBonus,
      woundPenalty: roll.woundPenalty,
      keptDice: roll.keptDiceDisplay,
      discardedDice: roll.discardedDiceDisplay
    }
  );

  await ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    rolls: [roll], // garde le Roll attaché : c'est ce que regarde Dice So Nice pour animer
    content,
    sound: CONFIG.sounds.dice
  });

  return roll;
}
