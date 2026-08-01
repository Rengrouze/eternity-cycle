const { HTMLField } = foundry.data.fields;

/**
 * Data model générique pour un Item "basique" (placeholder).
 * Les futurs sous-types (skill, technique, weapon...) auront chacun
 * leur propre fichier dans ce dossier, sur ce modèle.
 */
export class ItemDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField({ required: true, blank: true })
    };
  }
}
