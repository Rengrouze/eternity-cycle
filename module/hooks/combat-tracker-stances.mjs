import { STANCES } from "../rules/stances.mjs";

/**
 * Affiche une icône de posture actuelle (voir module/rules/stances.mjs) à
 * côté de chaque combattant dans le Combat Tracker - indication visuelle
 * pour tous les joueurs, sans avoir à ouvrir la fiche de chacun. Si la
 * posture enregistrée ne correspond pas au round de combat en cours
 * (system.combat.stanceRound !== game.combat.round), le personnage n'a pas
 * encore répondu à la Phase de Réaction de ce round - affiche un sablier
 * ambré à la place (voir module/hooks/reaction-phase.mjs, qui les relance
 * automatiquement en début de round).
 *
 * Icônes Font Awesome (déjà chargées globalement par Foundry) plutôt que des
 * classes Tailwind : le Combat Tracker est hors du scope `.l5r4ec` que
 * cible notre CSS compilé, pas la peine d'en dépendre pour un simple badge.
 *
 * Enregistré uniquement sur `renderCombatTracker` (le nom du hook n'a pas
 * changé avec l'AppV2, contrairement à `renderChatMessage` -> voir
 * module/chat/damage-chat-actions.mjs) mais le second argument peut être un
 * HTMLElement (AppV2) ou un objet jQuery selon la version - même garde que
 * pour le hook de chat, prudence non vérifiée en live.
 */

const STANCE_LOOKUP = Object.fromEntries(STANCES.map((s) => [s.key, s]));

export function registerCombatTrackerStanceBadges() {
  Hooks.on("renderCombatTracker", (app, html) => injectStanceBadges(html));
}

function injectStanceBadges(html) {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;

  const round = game.combat?.round ?? 0;

  root.querySelectorAll("[data-combatant-id]").forEach((row) => {
    row.querySelector(".l5r4ec-stance-badge")?.remove();

    const combatant = game.combat?.combatants.get(row.dataset.combatantId);
    const actor = combatant?.actor;
    if (!actor || actor.type !== "character") return;

    const badge = document.createElement("i");
    badge.className = "l5r4ec-stance-badge";
    badge.style.marginLeft = "4px";

    const pending = actor.system.combat.stanceRound !== round;
    if (pending) {
      badge.className += " fa-solid fa-hourglass-half";
      badge.style.color = "#d97706";
      badge.title = game.i18n.localize("L5R4EC.Stance.Pending");
    } else {
      const stance = STANCE_LOOKUP[actor.system.combat.stance];
      if (!stance) return;
      badge.className += ` ${stance.icon}`;
      badge.style.color = stance.color;
      badge.title = game.i18n.localize(stance.labelKey);
    }

    row.appendChild(badge);
  });
}
