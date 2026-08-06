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
 * @param {object|((roll: L5RRollKeep) => object)} [extra]  Contexte additionnel
 *        fusionné dans le template de carte de chat (voir roll-keep-card.hbs)
 *        - sort lancé, TN cible, réussite, bouton de dégâts... Peut être une
 *        fonction du Roll déjà évalué (pour comparer le résultat à un TN,
 *        par exemple) plutôt qu'un objet statique. Optionnel, ignoré par les
 *        jets Trait/Anneau/Compétence qui n'en ont pas besoin.
 * @param {boolean} [applyWoundPenalty=true]  À désactiver pour un jet de
 *        dégâts : le malus de blessure du lanceur ne doit affecter que SES
 *        propres jets, pas les dégâts qu'il inflige à quelqu'un d'autre.
 * @returns {Promise<L5RRollKeep>}
 */
export async function performRoll(actor, config, flavor, extra = {}, applyWoundPenalty = true) {
  // Malus automatique lié au rang de blessure actuel (0 si Indemne).
  const woundPenalty = applyWoundPenalty ? (actor.system.wounds?.penalty ?? 0) : 0;

  const roll = L5RRollKeep.build({ ...config, woundPenalty });
  await roll.evaluate();

  if (applyWoundPenalty && actor.system.wounds?.isDead) {
    ui.notifications.warn(
      game.i18n.format("L5R4EC.Notif.CharacterDead", { name: actor.name })
    );
  } else if (applyWoundPenalty && actor.system.wounds?.isOut) {
    ui.notifications.warn(
      game.i18n.format("L5R4EC.Notif.CharacterOut", { name: actor.name })
    );
  }

  const resolvedExtra = typeof extra === "function" ? extra(roll) : extra;

  const content = await foundry.applications.handlebars.renderTemplate(
    "systems/l5r4ec/templates/chat/roll-keep-card.hbs",
    {
      flavor,
      rolled: roll.rolledCount,
      kept: roll.keepCount,
      keptTotal: roll.keptTotal,
      flatBonus: roll.flatBonus,
      woundPenalty: roll.woundPenalty,
      keptDice: roll.keptDiceDisplay,
      discardedDice: roll.discardedDiceDisplay,
      ...resolvedExtra
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
