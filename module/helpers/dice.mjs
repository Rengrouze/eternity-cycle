/**
 * Construit une formule de jet "Roll & Keep" façon L5R 4e.
 * @param {number} rollDice  Nombre de dés à lancer (généralement Trait + Compétence).
 * @param {number} keepDice  Nombre de dés à garder (généralement le Trait seul).
 * @returns {string} Une formule Foundry valide, ex: "5d10x10kh3".
 */
export function buildRollKeepFormula(rollDice, keepDice) {
  const roll = Math.max(1, rollDice);
  const keep = Math.max(1, Math.min(keepDice, roll));
  return `${roll}d10x10kh${keep}`;
}

/**
 * Lance un jet Roll & Keep et le poste dans le chat.
 * Dice So Nice s'anime automatiquement dès qu'un ChatMessage contient un Roll,
 * aucune intégration spécifique n'est nécessaire ici.
 * @param {Actor} actor    L'acteur qui lance le jet.
 * @param {number} rollDice
 * @param {number} keepDice
 * @param {string} flavor  Texte affiché au-dessus du résultat dans le chat.
 * @returns {Promise<Roll>}
 */
export async function rollKeep(actor, rollDice, keepDice, flavor) {
  const formula = buildRollKeepFormula(rollDice, keepDice);
  const roll = new Roll(formula);
  await roll.evaluate();

  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor
  });

  return roll;
}
