import { qualityFields } from "./shared-fields.mjs";

const { StringField, NumberField, BooleanField, HTMLField } = foundry.data.fields;

/**
 * Munition L5R 4e (flèches, etc.) : contrairement aux Armes, une Munition
 * n'est pas "équipée" mais possédée en quantité (un stock qui décroît à
 * l'usage - le décompte automatique au tir viendra avec les jets de dégâts).
 */
export class AmmoDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...qualityFields(),

      // DR (Damage Rating) : dés lancés / dés gardés, même logique que WeaponDataModel.
      damageRolled: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      damageKept: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      quantity: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      // Stock illimité (ex : flèche magique) - la quantité ci-dessus est alors ignorée.
      unlimited: new BooleanField({ initial: false }),

      specialRules: new HTMLField({ required: true, blank: true }),
      price: new StringField({ required: true, blank: true }),

      description: new HTMLField({ required: true, blank: true })
    };
  }
}
