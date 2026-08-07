/**
 * Postures de combat L5R 4e (voir SystemActor#_computeArmorTN et
 * SystemActor#rollAttack pour l'intégration). Seuls les effets à portée
 * immédiate et sans dépendance à un suivi de tour/round sont automatisés
 * (bonus d'attaque et de TN d'Armure) ; le reste (mouvement bonus en Assaut,
 * bonus différé au tour suivant en Centre...) reste documenté en texte pour
 * application manuelle - même convention que les Capacités de Maîtrise non
 * automatisables (voir SystemActor#_applyMasteryBonuses).
 *
 * Noms officiels (le nom "Attaque Totale"/"Pleine Défense" de la première
 * version de la fiche n'était qu'un raccourci de travail) : Attaque, Assaut,
 * Défense, Esquive, Centre - chacune "liée spirituellement" à un Anneau
 * (couleur/icône choisies en écho, voir aussi RING_VISUALS dans
 * actor-sheet.mjs) : Attaque-Eau, Assaut-Feu, Défense-Air, Esquive-Terre,
 * Centre-Vide. Les clés internes (`STANCE_CHOICES`) restent en anglais
 * ("fullAttack"/"fullDefense") pour ne pas casser les fiches existantes -
 * seuls les libellés affichés (lang/fr.json) ont changé.
 */

export const STANCE_CHOICES = ["attack", "fullAttack", "defense", "fullDefense", "center"];

// icon/color réutilisés à la fois par le badge du Combat Tracker
// (module/hooks/combat-tracker-stances.mjs) et les boutons de la Phase de
// Réaction (module/hooks/reaction-phase.mjs) - une seule source pour les deux.
export const STANCES = [
  { key: "attack", labelKey: "L5R4EC.Stance.Attack", descriptionKey: "L5R4EC.Stance.AttackDesc", icon: "fa-solid fa-khanda", color: "#2563eb" },
  { key: "fullAttack", labelKey: "L5R4EC.Stance.FullAttack", descriptionKey: "L5R4EC.Stance.FullAttackDesc", icon: "fa-solid fa-fire", color: "#dc2626" },
  { key: "defense", labelKey: "L5R4EC.Stance.Defense", descriptionKey: "L5R4EC.Stance.DefenseDesc", icon: "fa-solid fa-shield-halved", color: "#0ea5e9" },
  { key: "fullDefense", labelKey: "L5R4EC.Stance.FullDefense", descriptionKey: "L5R4EC.Stance.FullDefenseDesc", icon: "fa-solid fa-mountain", color: "#a16207" },
  { key: "center", labelKey: "L5R4EC.Stance.Center", descriptionKey: "L5R4EC.Stance.CenterDesc", icon: "fa-solid fa-yin-yang", color: "#7c3aed" }
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
