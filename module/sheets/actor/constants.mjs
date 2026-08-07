import { AFFINITY_CHOICES } from "../../rules/spellcasting.mjs";

/**
 * Les 5 Anneaux, utilisés à la fois pour le sélecteur d'Anneau d'un sort et
 * pour construire les blocs Affinité/Emplacements de l'onglet Magie.
 */
export const RING_OPTIONS = [
  { key: "air", labelKey: "L5R4EC.Ring.Air" },
  { key: "earth", labelKey: "L5R4EC.Ring.Earth" },
  { key: "fire", labelKey: "L5R4EC.Ring.Fire" },
  { key: "water", labelKey: "L5R4EC.Ring.Water" },
  { key: "void", labelKey: "L5R4EC.Ring.Void" },
];

/**
 * Icône + couleur d'accent par Anneau, pour l'onglet Anneaux et Traits
 * (voir tab-rings.hbs) - couleurs choisies en écho à celles déjà utilisées
 * pour les postures de combat (le Vide reprend le violet de la posture
 * Centre, voir module/rules/stances.mjs).
 */
export const RING_VISUALS = {
  air: { icon: "fa-solid fa-wind", color: "#0ea5e9" },
  earth: { icon: "fa-solid fa-mountain", color: "#a16207" },
  fire: { icon: "fa-solid fa-fire", color: "#dc2626" },
  water: { icon: "fa-solid fa-droplet", color: "#2563eb" },
  void: { icon: "fa-solid fa-yin-yang", color: "#7c3aed" },
};

export const AFFINITY_OPTIONS = AFFINITY_CHOICES.map((key) => ({
  key,
  labelKey: `L5R4EC.Affinity.${key.charAt(0).toUpperCase()}${key.slice(1)}`,
}));

/**
 * Options de Trait associable à une Compétence (Vide inclus). Factorisé au
 * niveau module car utilisé à la fois pour l'affichage des lignes de
 * compétence et pour le formulaire "Ajouter une compétence".
 */
export const TRAIT_OPTIONS = [
  { key: "sta", labelKey: "L5R4EC.Trait.Stamina" },
  { key: "wil", labelKey: "L5R4EC.Trait.Willpower" },
  { key: "str", labelKey: "L5R4EC.Trait.Strength" },
  { key: "per", labelKey: "L5R4EC.Trait.Perception" },
  { key: "ref", labelKey: "L5R4EC.Trait.Reflexes" },
  { key: "awa", labelKey: "L5R4EC.Trait.Awareness" },
  { key: "agi", labelKey: "L5R4EC.Trait.Agility" },
  { key: "int", labelKey: "L5R4EC.Trait.Intelligence" },
  { key: "void", labelKey: "L5R4EC.Ring.Void" },
];

export const SKILL_CATEGORIES = ["noble", "bugei", "merchant", "low"];
