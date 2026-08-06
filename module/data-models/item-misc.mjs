import { qualityFields } from "./shared-fields.mjs";

const { StringField, BooleanField, HTMLField } = foundry.data.fields;

/**
 * Objet divers L5R 4e : la plupart n'ont ni compétence liée ni effet
 * particulier, sauf s'il s'agit d'un Nemuranai (voir shared-fields.mjs).
 */
export class MiscItemDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...qualityFields(),

      associatedSkill: new StringField({ required: true, blank: true }),
      specialRules: new HTMLField({ required: true, blank: true }),
      price: new StringField({ required: true, blank: true }),

      equipped: new BooleanField({ initial: false }),
      description: new HTMLField({ required: true, blank: true })
    };
  }
}
