const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

/**
 * Feuille de personnage de base pour L5R 4e - Eternity Cycle.
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
    },
    // Les actions déclarées ici sont bindées automatiquement sur tout
    // élément du template portant le data-action correspondant.
    actions: {
      rollTrait: CharacterSheet.#onRollTrait
    }
  };

  /** @override */
  static PARTS = {
    main: {
      template: "systems/l5r4ec/templates/actor/character-sheet.hbs"
    }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.actor = this.actor;
    context.system = this.actor.system;

    context.traitKeys = ["sta", "wil", "str", "per", "ref", "awa", "agi", "int"];
    context.ringKeys = ["air", "earth", "fire", "water"];

    context.enrichedBiography = await foundry.applications.ux.TextEditor.enrichHTML(
      this.actor.system.details.biography,
      { secrets: this.actor.isOwner, relativeTo: this.actor }
    );

    return context;
  }

  /**
   * Handler d'action pour le clic sur un bouton de jet de Trait.
   * Les handlers d'action sont TOUJOURS statiques ; `this` pointe malgré
   * tout vers l'instance de la sheet grâce au binding fait par Foundry.
   * @this {CharacterSheet}
   * @param {PointerEvent} event
   * @param {HTMLElement} target  L'élément qui porte le data-action.
   */
  static async #onRollTrait(event, target) {
    const traitKey = target.dataset.trait;
    await this.actor.rollTrait(traitKey);
  }
}
