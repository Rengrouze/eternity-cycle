const { StringField, HTMLField } = foundry.data.fields;

/**
 * Fragment de schema partagé par Arme/Armure/Objet Divers : le système de
 * qualité "façon RPG" (blanc/vert/bleu/violet/orange), où "orange" désigne
 * spécifiquement un Nemuranai (objet magique - n'importe quel objet peut en
 * être un). C'est une mécanique maison, absente des règles L5R officielles.
 *
 * @returns {object} À fusionner dans le defineSchema() d'un Data Model d'Item.
 */
export function qualityFields() {
  return {
    quality: new StringField({
      required: true,
      choices: ["white", "green", "blue", "purple", "orange"],
      initial: "white"
    }),
    // Pertinent seulement si quality === "orange" (Nemuranai) - décrit le
    // pouvoir magique de l'objet. Laissé vide sinon.
    nemuranaiPower: new HTMLField({ required: true, blank: true })
  };
}
