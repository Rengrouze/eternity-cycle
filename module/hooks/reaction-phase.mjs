import { STANCES } from "../rules/stances.mjs";

/**
 * Phase de Réaction L5R 4e : au début de chaque round de combat, chaque
 * joueur doit déclarer sa posture pour le round à venir. Foundry n'a pas de
 * notion native de "sous-phase" dans un round, donc on simule ça avec une
 * modale automatique déclenchée côté client pour chaque joueur possédant un
 * personnage engagé dans le combat.
 *
 * Le MJ n'est sollicité QUE pour les personnages qu'aucun joueur non-MJ
 * connecté ne possède également - sinon il serait doublement sollicité (une
 * fois en tant que MJ, une fois via le joueur concerné) à chaque round pour
 * chaque PJ. Ce filtre laisse aussi fonctionner le test en solo (le MJ qui
 * joue son propre personnage de test, sans joueur connecté) : dans ce cas il
 * n'y a justement personne d'autre pour répondre à sa place.
 *
 * Écouté sur `updateCombat` plutôt que sur `combatStart`/`combatRound` :
 * ces deux hooks sémantiques se sont avérés peu fiables en pratique (la
 * prochaine Phase de Réaction ne se déclenchait pas en repassant par la
 * flèche "tour suivant" du Combat Tracker jusqu'à boucler sur un nouveau
 * round - symptôme d'un round "sauté"). `updateCombat` fire pour absolument
 * toute mise à jour du document Combat, quel que soit le chemin interne
 * emprunté par Foundry pour y arriver ; filtrer sur la présence de
 * `changed.round` couvre à la fois le démarrage du combat (round 0 -> 1) et
 * chaque round suivant, de façon robuste.
 */
export function registerReactionPhasePrompts() {
  Hooks.on("updateCombat", (combat, changed) => {
    if (changed.round === undefined) return;
    promptReactionPhase(combat);
  });
}

async function promptReactionPhase(combat) {
  const owned = combat.combatants.filter((c) => c.actor?.type === "character" && c.actor.isOwner);

  for (const combatant of owned) {
    const actor = combatant.actor;
    if (game.user.isGM && hasOtherOnlineOwner(actor)) continue;
    await promptStanceFor(actor, combat.round);
  }
}

/** Un autre utilisateur non-MJ, connecté, possède aussi cet acteur -> c'est à lui de répondre, pas au MJ. */
function hasOtherOnlineOwner(actor) {
  return game.users.some((u) => u.active && u.id !== game.user.id && !u.isGM && actor.testUserPermission(u, "OWNER"));
}

/**
 * @param {Actor} actor
 * @param {number} round
 */
async function promptStanceFor(actor, round) {
  // Déjà répondu ce round (ex: posture changée à la main juste avant que ce
  // hook ne se déclenche) - pas la peine de re-demander.
  if (actor.system.combat.stanceRound === round) return;

  const content = `<p class="text-sm">${game.i18n.format("L5R4EC.Dialog.ReactionPhaseBody", { round })}</p>`;

  const stance = await foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.format("L5R4EC.Dialog.ReactionPhaseTitle", { name: actor.name }) },
    content,
    modal: true,
    rejectClose: false,
    buttons: STANCES.map((s) => ({
      action: s.key,
      label: game.i18n.localize(s.labelKey),
      icon: s.icon
    }))
  });

  if (!stance) return;

  if (stance === "fullDefense") await actor.rollFullDefense();
  else await actor.setStance(stance);
}
