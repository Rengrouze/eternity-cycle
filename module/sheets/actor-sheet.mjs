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

    // Regroupement Anneau -> Traits, pour boucler dans le template au lieu
    // de dupliquer le même bloc HTML 4 fois (un par Anneau).
    const s = this.actor.system;
    context.ringGroups = [
      { key: "air", labelKey: "L5R4EC.Ring.Air", rank: s.rings.air.rank, traits: [
        { key: "awa", labelKey: "L5R4EC.Trait.Awareness", value: s.traits.awa },
        { key: "ref", labelKey: "L5R4EC.Trait.Reflexes", value: s.traits.ref }
      ] },
      { key: "earth", labelKey: "L5R4EC.Ring.Earth", rank: s.rings.earth.rank, traits: [
        { key: "sta", labelKey: "L5R4EC.Trait.Stamina", value: s.traits.sta },
        { key: "wil", labelKey: "L5R4EC.Trait.Willpower", value: s.traits.wil }
      ] },
      { key: "fire", labelKey: "L5R4EC.Ring.Fire", rank: s.rings.fire.rank, traits: [
        { key: "agi", labelKey: "L5R4EC.Trait.Agility", value: s.traits.agi },
        { key: "int", labelKey: "L5R4EC.Trait.Intelligence", value: s.traits.int }
      ] },
      { key: "water", labelKey: "L5R4EC.Ring.Water", rank: s.rings.water.rank, traits: [
        { key: "per", labelKey: "L5R4EC.Trait.Perception", value: s.traits.per },
        { key: "str", labelKey: "L5R4EC.Trait.Strength", value: s.traits.str }
      ] }
    ];

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
