import { qualityFields } from "./shared-fields.mjs";

const { StringField, NumberField, BooleanField, HTMLField } = foundry.data.fields;

/**
 * Arme L5R 4e. Le DR (Damage Rating, ex "3k2") est stocké comme un couple
 * dés lancés/gardés distinct - même logique de dés que les jets de
 * Trait/Compétence, réutilisable telle quelle quand les jets de dégâts
 * seront implémentés.
 */
export class WeaponDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...qualityFields(),

      // Compétence utilisée pour manier l'arme (texte libre, cohérent avec
      // le système de Compétences en texte libre - ex: "Kenjutsu").
      associatedSkill: new StringField({ required: true, blank: true }),

      // DR (Damage Rating) : dés lancés / dés gardés, ex "3k2" -> rolled:3, kept:2.
      damageRolled: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      damageKept: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      keywords: new StringField({ required: true, blank: true }), // "Medium, Samurai"
      specialRules: new HTMLField({ required: true, blank: true }),
      price: new StringField({ required: true, blank: true }), // texte libre ("non disponible à la vente", "5 koku"...)

      // Arme à distance (arc, arme à feu...) : portée en mètres. La Force de
      // l'arc s'ajoute au premier chiffre du DR de la flèche tirée (règle pas
      // encore automatisée, voir specialRules pour le détail par arme).
      isRanged: new BooleanField({ initial: false }),
      range: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      strengthRating: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      equipped: new BooleanField({ initial: false }),
      description: new HTMLField({ required: true, blank: true })
    };
  }
}
