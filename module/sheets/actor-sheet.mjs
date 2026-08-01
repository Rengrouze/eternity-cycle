const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

/**
 * Feuille de personnage de base pour L5R 4e - Eternity Cycle.
 * Template minimal : Traits, Anneaux, Blessures, Honneur, Détails.
 * A étoffer (compétences, techniques, équipement, jets de dés, ...).
 */
export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["l5r4ec", "sheet", "actor", "character"],
    position: {
      width: 640,
      height: 680
    },
    window: {
      resizable: true,
      title: "L5R4EC.Sheet.Character"
    },
    form: {
      submitOnChange: true
    }
  };

  /** @override */
  static PARTS = {
    main: {
      template: "systems/l5r4ec/templates/actor/character-sheet.hbs"
    }
  };

  /**
   * Construit le contexte transmis au template Handlebars.
   * @override
   */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.actor = this.actor;
    context.system = this.actor.system;
    context.source = this.actor.toObject().system;

    // Libellés des Traits/Anneaux, pratiques à boucler côté template.
    context.traitKeys = ["sta", "wil", "str", "per", "ref", "awa", "agi", "int"];
    context.ringKeys = ["air", "earth", "fire", "water"];

    // Autorise l'édition du texte enrichi (biographie).
    context.enrichedBiography = await foundry.applications.ux.TextEditor.enrichHTML(
      this.actor.system.details.biography,
      { secrets: this.actor.isOwner, relativeTo: this.actor }
    );

    return context;
  }
}
