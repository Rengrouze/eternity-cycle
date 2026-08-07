/**
 * Retrouve l'Item Compétence de cet Acteur par nom exact (insensible à la
 * casse/aux espaces) - convention utilisée partout où une Compétence est
 * référencée par texte libre plutôt que par id (Arme associée, Empoignade à
 * mains nues -> "jiujutsu", "Art de la Magie"...).
 * @param {Actor} actor
 * @param {string|null|undefined} name
 * @returns {Item|null}
 */
export function findSkillByName(actor, name) {
  const normalized = name?.trim().toLowerCase();
  if (!normalized) return null;
  return actor.items.find((i) => i.type === "skill" && i.name.trim().toLowerCase() === normalized) ?? null;
}

/**
 * Résout la Compétence associée à une Arme - ou `fallback` (par défaut
 * "jiujutsu") si `weapon` est nul, pour une Empoignade à mains nues. Voir
 * SystemActor#rollAttack, #initiateGrapple, #grappleAction,
 * #_grappleControlRoll, #drawWeapon.
 * @param {Actor} actor
 * @param {Item|null} weapon
 * @param {string} [fallback]
 * @returns {Item|null}
 */
export function resolveWeaponSkill(actor, weapon, fallback = "jiujutsu") {
  return findSkillByName(actor, weapon?.system.associatedSkill || fallback);
}
