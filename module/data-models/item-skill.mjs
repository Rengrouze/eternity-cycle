const { StringField, NumberField, HTMLField, ArrayField, SchemaField, BooleanField } = foundry.data.fields;

/**
 * Compétence L5R 4e. Toutes les compétences existent en tant qu'Items
 * (voir module/hooks/seed-default-skills.mjs pour le peuplement automatique
 * à la création d'un personnage), au rang 0 par défaut.
 */
export class SkillDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // Les 4 catégories classiques L5R 4e.
      category: new StringField({
        required: true,
        choices: ["noble", "bugei", "merchant", "low"],
        initial: "noble"
      }),

      // Marque une compétence comme "compétence d'école" (utile au moment
      // de la création du personnage, pour distinguer les compétences
      // offertes par l'École des compétences classiques).
      isSchoolSkill: new BooleanField({ initial: false }),

      // Trait associé - modifiable par compétence (le Vide compte comme un
      // Trait possible pour cet usage, d'où la clé spéciale "void").
      trait: new StringField({ required: true, blank: false, initial: "awa" }),

      // Sous-type libre : "Connaissance (Dragons)", "Spectacle (Danse)"...
      // Vide = pas de sous-type pour cette compétence.
      subtype: new StringField({ required: true, blank: true, initial: "" }),

      rank: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      // Stocké en texte brut séparé par des virgules plutôt qu'un ArrayField :
      // beaucoup plus simple à éditer via un simple <input> sur la fiche.
      // Découpé en tableau à la volée là où c'est nécessaire (jets, affichage).
      specializations: new StringField({ required: true, blank: true, initial: "" }),

      // Capacités de maîtrise : à `rank` donné, affiche `description` dans le
      // panneau "Capacités de Maîtrise actives" (onglet Combat). Si `path` est
      // renseigné, `value` est aussi ajouté automatiquement à ce chemin
      // (relatif à actor.system) - réservé aux bonus qui correspondent à un
      // stat permanent existant (ex: Réputation). Voir
      // SystemActor#_applyMasteryBonuses et le commentaire d'en-tête de
      // default-skills.mjs pour le détail de la convention.
      // Pas d'UI d'édition pour l'instant (rempli via les données par défaut
      // ou modifié manuellement) - c'est la base du "système de buff" demandé.
      masteryBonuses: new ArrayField(
        new SchemaField({
          rankRequired: new NumberField({ required: true, integer: true, min: 1 }),
          description: new StringField({ required: true, blank: true, initial: "" }),
          path: new StringField({ required: true, blank: true, initial: "" }),
          value: new NumberField({ required: true, integer: false, initial: 0 })
        }),
        { initial: [] }
      ),

      description: new HTMLField({ required: true, blank: true })
    };
  }
}
