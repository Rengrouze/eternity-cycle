import { qualityFields } from "./shared-fields.mjs";

const { StringField, NumberField, BooleanField, HTMLField } = foundry.data.fields;

/**
 * Armure L5R 4e. Une seule peut être équipée à la fois (voir
 * SystemActor#toggleArmorEquip pour l'exclusivité mutuelle).
 */
export class ArmorDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...qualityFields(),

      // Type libre (Ashigaru/Légère/Lourde/Monture/homebrew...).
      armorType: new StringField({ required: true, blank: true }),

      tnBonus: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      reduction: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      specialRules: new HTMLField({ required: true, blank: true }),
      price: new StringField({ required: true, blank: true }),

      equipped: new BooleanField({ initial: false }),
      description: new HTMLField({ required: true, blank: true })
    };
  }
}
