const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { DialogV2 } = foundry.applications.api;

/**
 * Feuille de personnage de base pour L5R 4e - Eternity Cycle.
 * Structurée en onglets : Anneaux/Traits, Compétences, Combat, Historique.
 */
export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["l5r4ec", "sheet", "actor", "character"],
    position: {
      width: 680,
      height: 720
    },
    window: {
      resizable: true,
      title: "L5R4EC.Sheet.Character"
    },
    form: {
      submitOnChange: true
    },
    actions: {
      rollTrait: CharacterSheet.#onRollTrait,
      toggleTaintVisibility: CharacterSheet.#onToggleTaintVisibility
    }
  };

  /** @override */
  static PARTS = {
    header: {
      template: "systems/l5r4ec/templates/actor/parts/header.hbs"
    },
    tabs: {
      // Template générique fourni par Foundry pour la barre d'onglets.
      template: "templates/generic/tab-navigation.hbs"
    },
    rings: {
      template: "systems/l5r4ec/templates/actor/parts/tab-rings.hbs",
      scrollable: [""]
    },
    skills: {
      template: "systems/l5r4ec/templates/actor/parts/tab-skills.hbs",
      scrollable: [""]
    },
    combat: {
      template: "systems/l5r4ec/templates/actor/parts/tab-combat.hbs",
      scrollable: [""]
    },
    bio: {
      template: "systems/l5r4ec/templates/actor/parts/tab-bio.hbs",
      scrollable: [""]
    }
  };

  /** @override */
  static TABS = {
    sheet: {
      tabs: [
        { id: "rings", group: "sheet", label: "L5R4EC.Tabs.RingsAndTraits", icon: "fa-solid fa-circle-notch" },
        { id: "skills", group: "sheet", label: "L5R4EC.Tabs.Skills", icon: "fa-solid fa-book" },
        { id: "combat", group: "sheet", label: "L5R4EC.Tabs.Combat", icon: "fa-solid fa-khanda" },
        { id: "bio", group: "sheet", label: "L5R4EC.Tabs.Bio", icon: "fa-solid fa-scroll" }
      ],
      initial: "rings"
    }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.actor = this.actor;
    context.system = this.actor.system;

    // Honneur devient "Infamie" à l'affichage dès que les points passent
    // sous zéro (mécanique L5R 4e) - pas de champ séparé, juste un flag
    // d'affichage basé sur le signe.
    context.isInfamous = this.actor.system.honor.rank < 0;

    // Honneur, Gloire et Statut ne sont éditables (points) que par le MJ ;
    // le joueur ne voit que le rang, en lecture seule.
    context.isGM = game.user.isGM;

    // Contexte des onglets, calculé une fois et partagé par tous les PARTS
    // (chaque template d'onglet lit tabs.<id>.cssClass / .id / .group).
    context.tabs = this._prepareTabs("sheet");

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
   * Ouvre d'abord une modale pour un éventuel bonus, puis lance le jet.
   * @this {CharacterSheet}
   */
  static async #onRollTrait(event, target) {
    const traitKey = target.dataset.trait;

    const bonus = await CharacterSheet.#promptRollBonus();
    if (bonus === null) return; // modale annulée/fermée

    await this.actor.rollTrait(traitKey, bonus);
  }

  /**
   * Bascule la visibilité du rang de Souillure (masqué par défaut).
   * @this {CharacterSheet}
   */
  static async #onToggleTaintVisibility() {
    if (!game.user.isGM) return; // le bouton n'est déjà pas rendu côté joueur, ceci est une double sécurité
    await this.actor.update({ "system.taint.hidden": !this.actor.system.taint.hidden });
  }

  /**
   * Affiche une modale demandant un bonus de dés/de garde avant un jet.
   * @returns {Promise<{rollBonus: number, keepBonus: number}|null>} null si annulé.
   */
  static async #promptRollBonus() {
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/dialogs/roll-bonus.hbs",
      {}
    );

    const result = await DialogV2.wait({
      window: { title: game.i18n.localize("L5R4EC.Dialog.RollBonusTitle") },
      content,
      modal: true,
      rejectClose: false, // fermer la modale (croix/Echap) ne lève pas d'exception
      buttons: [
        {
          action: "roll",
          label: game.i18n.localize("L5R4EC.Dialog.Roll"),
          icon: "fa-solid fa-dice-d10",
          default: true,
          callback: (event, button) => ({
            rollBonus: Number(button.form.elements.rollBonus.value) || 0,
            keepBonus: Number(button.form.elements.keepBonus.value) || 0
          })
        },
        {
          action: "cancel",
          label: game.i18n.localize("L5R4EC.Dialog.Cancel")
        }
      ]
    });

    // DialogV2.wait renvoie soit la valeur du callback, soit l'action ("cancel"),
    // soit null si fermée sans bouton (croix/Echap, grâce à rejectClose: false).
    if (!result || result === "cancel") return null;
    return result;
  }
}
