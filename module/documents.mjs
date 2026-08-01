/**
 * Actor custom pour le système. Étend l'Actor de base pour ajouter
 * le comportement spécifique à L5R 4e au fur et à mesure des besoins.
 */
export class SystemActor extends Actor {
  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    // La logique de dérivation des Anneaux vit dans le Data Model
    // (module/data-models.mjs -> CharacterDataModel#prepareDerivedData).
    // Toute logique transverse à tous les types d'Actor (ex: clamp des
    // blessures) peut être ajoutée ici plus tard.
  }
}

/**
 * Item custom pour le système. Placeholder pour l'instant.
 */
export class SystemItem extends Item {}
