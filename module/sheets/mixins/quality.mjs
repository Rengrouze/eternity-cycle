/**
 * Système de qualité maison (façon RPG), partagé entre la fiche Acteur
 * (onglet Inventaire) et les fiches d'Item (Arme/Armure/Objet/Munition).
 * "orange" désigne spécifiquement un Nemuranai (objet magique).
 */
export const QUALITY_OPTIONS = [
  { key: "white", labelKey: "L5R4EC.Quality.White" },
  { key: "green", labelKey: "L5R4EC.Quality.Green" },
  { key: "blue", labelKey: "L5R4EC.Quality.Blue" },
  { key: "purple", labelKey: "L5R4EC.Quality.Purple" },
  { key: "orange", labelKey: "L5R4EC.Quality.Orange" }
];

export const QUALITY_CLASSES = {
  white: "border-neutral-300 bg-neutral-50 text-neutral-600",
  green: "border-green-600 bg-green-50 text-green-700",
  blue: "border-blue-600 bg-blue-50 text-blue-700",
  purple: "border-purple-600 bg-purple-50 text-purple-700",
  orange: "border-orange-500 bg-orange-50 text-orange-700"
};

/**
 * Options de qualité avec `selected` précalculé pour un `<select>`, et badge
 * d'affichage (classe CSS + libellé) pour une ligne d'inventaire.
 * @param {Item} item
 */
export function qualityBadge(item) {
  return {
    key: item.system.quality,
    labelKey: QUALITY_OPTIONS.find((q) => q.key === item.system.quality)?.labelKey ?? "L5R4EC.Quality.White",
    class: QUALITY_CLASSES[item.system.quality] ?? QUALITY_CLASSES.white,
    isNemuranai: item.system.quality === "orange"
  };
}

/**
 * @param {string} current  Clé de qualité actuellement sélectionnée.
 */
export function qualityOptionsFor(current) {
  return QUALITY_OPTIONS.map((opt) => ({ ...opt, selected: opt.key === current }));
}
