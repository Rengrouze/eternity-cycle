/**
 * Enregistre les réglages du système, configurables par le MJ via
 * Configurer les paramètres > Paramètres système (scope "world" = un seul
 * réglage pour toute la partie, pas par joueur).
 */
export function registerSystemSettings() {
  game.settings.register("l5r4ec", "lethality", {
    name: "L5R4EC.Settings.LethalityName",
    hint: "L5R4EC.Settings.LethalityHint",
    scope: "world",
    config: true,
    type: Number,
    choices: {
      2: "L5R4EC.Settings.LethalityEarth2",
      3: "L5R4EC.Settings.LethalityEarth3",
      4: "L5R4EC.Settings.LethalityEarth4",
      5: "L5R4EC.Settings.LethalityEarth5"
    },
    default: 3,
    // Impacte le calcul dérivé des rangs de blessure de tous les acteurs :
    // on force un rechargement pour éviter des fiches déjà ouvertes avec un
    // calcul basé sur l'ancienne valeur.
    requiresReload: true
  });
}

/** Raccourci pratique pour lire la létalité actuelle ailleurs dans le code. */
export function getLethality() {
  return game.settings.get("l5r4ec", "lethality");
}
