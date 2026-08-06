/**
 * Postures de combat L5R 4e (voir SystemActor#_computeArmorTN et
 * SystemActor#rollAttack pour l'intégration). Seuls les effets à portée
 * immédiate et sans dépendance à un suivi de tour/round sont automatisés
 * (bonus d'attaque et de TN d'Armure) ; le reste (mouvement bonus en Attaque
 * Totale, bonus différé au tour suivant en Centre...) reste documenté en
 * texte pour application manuelle - même convention que les Capacités de
 * Maîtrise non automatisables (voir SystemActor#_applyMasteryBonuses).
 */

export const STANCE_CHOICES = ["attack", "fullAttack", "defense", "fullDefense", "center"];

// icon/color réutilisés à la fois par le badge du Combat Tracker
// (module/hooks/combat-tracker-stances.mjs) et les boutons de la Phase de
// Réaction (module/hooks/reaction-phase.mjs) - une seule source pour les deux.
export const STANCES = [
  { key: "attack", labelKey: "L5R4EC.Stance.Attack", descriptionKey: "L5R4EC.Stance.AttackDesc", icon: "fa-solid fa-khanda", color: "#9ca3af" },
  { key: "fullAttack", labelKey: "L5R4EC.Stance.FullAttack", descriptionKey: "L5R4EC.Stance.FullAttackDesc", icon: "fa-solid fa-fire", color: "#dc2626" },
  { key: "defense", labelKey: "L5R4EC.Stance.Defense", descriptionKey: "L5R4EC.Stance.DefenseDesc", icon: "fa-solid fa-shield-halved", color: "#2563eb" },
  { key: "fullDefense", labelKey: "L5R4EC.Stance.FullDefense", descriptionKey: "L5R4EC.Stance.FullDefenseDesc", icon: "fa-solid fa-shield", color: "#1d4ed8" },
  { key: "center", labelKey: "L5R4EC.Stance.Center", descriptionKey: "L5R4EC.Stance.CenterDesc", icon: "fa-solid fa-circle-dot", color: "#7c3aed" }
];

/** Défense, Pleine Défense et Centre interdisent d'attaquer ce tour. */
export function canAttackInStance(stance) {
  return stance === "attack" || stance === "fullAttack";
}

/** Attaque Totale : +2k1 à tous les jets d'attaque du tour. */
export function attackStanceBonus(stance) {
  return stance === "fullAttack" ? { rollBonus: 2, keepBonus: 1 } : { rollBonus: 0, keepBonus: 0 };
}

/** Attaque Totale : TN d'Armure -10 (tout ou rien). */
export function armorTnStanceFlatBonus(stance) {
  return stance === "fullAttack" ? -10 : 0;
}
