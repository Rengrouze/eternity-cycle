const { StringField, NumberField, HTMLField } = foundry.data.fields;

/**
 * Sort L5R 4e (Shugenja). Le TN de base et le temps d'incantation se
 * déduisent de `masteryRank` (voir module/rules/spellcasting.mjs) - pas
 * stockés ici pour ne jamais désynchroniser des deux.
 */
export class SpellDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // Anneau du sort ("Ring/Mastery: Earth 1" -> ring: "earth", masteryRank: 1).
      ring: new StringField({
        required: true,
        choices: ["air", "earth", "fire", "water", "void"],
        initial: "fire"
      }),
      masteryRank: new NumberField({ required: true, integer: true, min: 1, initial: 1 }),

      keywords: new StringField({ required: true, blank: true }), // "Jade, Tonnerre"
      range: new StringField({ required: true, blank: true }), // texte libre : "30 m", "Personnelle", "Contact"...
      areaOfEffect: new StringField({ required: true, blank: true }),
      duration: new StringField({ required: true, blank: true }),
      raises: new HTMLField({ required: true, blank: true }), // "Dégâts (+1k0), Portée (+3 m), Cibles (+1, max 5)..."

      description: new HTMLField({ required: true, blank: true })
    };
  }
}
