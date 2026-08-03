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
  const roll = L5RRollKeep.build(config);
  await roll.evaluate();

  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor
  });

  return roll;
}
