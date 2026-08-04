const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { DialogV2 } = foundry.applications.api;

/**
 * Options de Trait associable à une Compétence (Vide inclus). Factorisé au
 * niveau module car utilisé à la fois pour l'affichage des lignes de
 * compétence et pour le formulaire "Ajouter une compétence".
 */
const TRAIT_OPTIONS = [
  { key: "sta", labelKey: "L5R4EC.Trait.Stamina" },
  { key: "wil", labelKey: "L5R4EC.Trait.Willpower" },
  { key: "str", labelKey: "L5R4EC.Trait.Strength" },
  { key: "per", labelKey: "L5R4EC.Trait.Perception" },
  { key: "ref", labelKey: "L5R4EC.Trait.Reflexes" },
  { key: "awa", labelKey: "L5R4EC.Trait.Awareness" },
  { key: "agi", labelKey: "L5R4EC.Trait.Agility" },
  { key: "int", labelKey: "L5R4EC.Trait.Intelligence" },
  { key: "void", labelKey: "L5R4EC.Ring.Void" }
];

const SKILL_CATEGORIES = ["noble", "bugei", "merchant", "low"];

/**
 * Feuille de personnage de base pour L5R 4e - Eternity Cycle.
 * Structurée en onglets : Anneaux/Traits, Compétences, Combat, Historique.
 */
export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["l5r4ec", "sheet", "actor", "character"],
    position: {
      width: 720,
      height: 780
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
      rollRing: CharacterSheet.#onRollRing,
      rollSkill: CharacterSheet.#onRollSkill,
      showSkillInfo: CharacterSheet.#onShowSkillInfo,
      addSkill: CharacterSheet.#onAddSkill,
      addSubtype: CharacterSheet.#onAddSubtype,
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

    // Honneur devient "Infamie" à l'affichage dès que le rang passe sous
    // zéro (mécanique L5R 4e).
    context.isInfamous = this.actor.system.honor.rank < 0;

    // Honneur, Gloire, Statut et Souillure : le MJ édite, le joueur lit
    // seulement (voir header.hbs et SystemActor#_preUpdate).
    context.isGM = game.user.isGM;

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

    context.skillsByCategory = this._buildSkillsByCategory();

    return context;
  }

  /**
   * Groupe les compétences par catégorie, puis par nom au sein d'une
   * catégorie : plusieurs compétences partageant le même nom (ex :
   * "Connaissance" avec plusieurs sous-types créés via "Ajouter une
   * compétence") deviennent un groupe dépliable ; une compétence seule
   * reste une simple ligne.
   */
  _buildSkillsByCategory() {
    const buildRow = (item) => ({
      id: item.id,
      subtype: item.system.subtype,
      rank: item.system.rank,
      specializations: item.system.specializations,
      isSchoolSkill: item.system.isSchoolSkill,
      traitOptions: TRAIT_OPTIONS.map((opt) => ({ ...opt, selected: opt.key === item.system.trait }))
    });

    const skills = this.actor.items.filter((i) => i.type === "skill");

    return SKILL_CATEGORIES.map((category) => {
      const categorySkills = skills
        .filter((i) => i.system.category === category)
        .sort((a, b) => a.name.localeCompare(b.name) || a.system.subtype.localeCompare(b.system.subtype));

      const byName = new Map();
      for (const item of categorySkills) {
        if (!byName.has(item.name)) byName.set(item.name, []);
        byName.get(item.name).push(item);
      }

      const rows = [...byName.entries()].map(([name, items]) => {
        if (items.length === 1) return { isGroup: false, name, ...buildRow(items[0]) };
        return { isGroup: true, name, entries: items.map(buildRow) };
      });

      return { key: category, labelKey: `L5R4EC.SkillCategory.${category}`, skills: rows };
    });
  }

  /**
   * Branche les champs des lignes de Compétence (rang, Trait...) : ils ne
   * peuvent pas passer par le submitOnChange standard de la sheet (qui ne
   * met à jour que l'Actor), donc on écoute leurs changements nous-mêmes et
   * on met à jour l'Item embarqué correspondant directement.
   * @override
   */
  _onRender(context, options) {
    super._onRender(context, options);

    this.element.querySelectorAll("[data-item-id][data-item-field]").forEach((el) => {
      el.addEventListener("change", CharacterSheet.#onChangeItemField.bind(this));
    });
  }

  /** @this {CharacterSheet} */
  static async #onChangeItemField(event) {
    const el = event.currentTarget;
    const item = this.actor.items.get(el.dataset.itemId);
    if (!item) return;

    const value = el.type === "checkbox" ? el.checked : el.type === "number" ? Number(el.value) : el.value;
    await item.update({ [el.dataset.itemField]: value });
  }

  /**
   * Handler d'action pour le clic sur un bouton de jet de Trait.
   * @this {CharacterSheet}
   */
  static async #onRollTrait(event, target) {
    const traitKey = target.dataset.trait;

    const bonus = await CharacterSheet.#promptRollBonus();
    if (bonus === null) return;

    await this.actor.rollTrait(traitKey, bonus);
  }

  /**
   * Handler d'action pour le clic sur un bouton de jet d'Anneau.
   * @this {CharacterSheet}
   */
  static async #onRollRing(event, target) {
    const ringKey = target.dataset.ring;

    const bonus = await CharacterSheet.#promptRollBonus();
    if (bonus === null) return;

    await this.actor.rollRing(ringKey, bonus);
  }

  /**
   * Handler d'action pour le clic sur un bouton de jet de Compétence.
   * @this {CharacterSheet}
   */
  static async #onRollSkill(event, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    if (!item) return;

    const bonus = await CharacterSheet.#promptRollBonus(item);
    if (bonus === null) return;

    await this.actor.rollSkill(item.id, bonus);
  }

  /**
   * Handler d'action pour l'icône "i" : résumé de la Compétence.
   * @this {CharacterSheet}
   */
  static async #onShowSkillInfo(event, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    if (!item) return;

    const title = item.system.subtype ? `${item.name} (${item.system.subtype})` : item.name;
    const description = await foundry.applications.ux.TextEditor.enrichHTML(
      item.system.description || `<em>${game.i18n.localize("L5R4EC.Sheet.NoDescription")}</em>`,
      { secrets: false, relativeTo: item }
    );

    await DialogV2.wait({
      window: { title },
      content: `<div class="l5r4ec p-2">${description}</div>`,
      modal: true,
      rejectClose: false,
      buttons: [{ action: "close", label: game.i18n.localize("L5R4EC.Dialog.Close"), default: true }]
    });
  }

  /**
   * Handler d'action pour "+ Ajouter une compétence" : ouvre une modale de
   * création, puis crée l'Item Compétence correspondant. Sert aussi bien au
   * homebrew (compétence inédite) qu'à ajouter un sous-type supplémentaire
   * à une compétence existante (Connaissance, Spectacle, Artisanat...) - il
   * suffit de reprendre le même nom, la fiche regroupe automatiquement.
   * @this {CharacterSheet}
   */
  static async #onAddSkill() {
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/dialogs/add-skill.hbs",
      {
        traitOptions: TRAIT_OPTIONS,
        categories: SKILL_CATEGORIES.map((c) => ({ key: c, labelKey: `L5R4EC.SkillCategory.${c}` }))
      }
    );

    const result = await DialogV2.wait({
      window: { title: game.i18n.localize("L5R4EC.Dialog.AddSkillTitle") },
      content,
      modal: true,
      rejectClose: false,
      buttons: [
        {
          action: "create",
          label: game.i18n.localize("L5R4EC.Dialog.Create"),
          icon: "fa-solid fa-plus",
          default: true,
          callback: (event, button) => ({
            name: button.form.elements.name.value.trim(),
            category: button.form.elements.category.value,
            trait: button.form.elements.trait.value,
            subtype: button.form.elements.subtype.value.trim(),
            isSchoolSkill: button.form.elements.isSchoolSkill.checked
          })
        },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
      ]
    });

    if (!result || result === "cancel" || !result.name) return;

    await this.actor.createEmbeddedDocuments("Item", [{
      name: result.name,
      type: "skill",
      system: {
        category: result.category,
        trait: result.trait,
        subtype: result.subtype,
        rank: 0,
        isSchoolSkill: result.isSchoolSkill,
        specializations: "",
        masteryBonuses: [],
        description: ""
      }
    }]);
  }

  /**
   * Handler d'action pour le "+" sur une ligne/un groupe de compétence :
   * ajoute directement un nouveau sous-type à CETTE compétence (même nom,
   * même catégorie, même Trait par défaut - juste un sous-type différent),
   * sans repasser par le formulaire complet "Ajouter une compétence".
   * @this {CharacterSheet}
   */
  static async #onAddSubtype(event, target) {
    event.preventDefault();
    event.stopPropagation();

    const item = this.actor.items.get(target.dataset.itemId);
    if (!item) return;

    const subtype = await CharacterSheet.#promptSubtype(item.name);
    if (!subtype) return;

    await this.actor.createEmbeddedDocuments("Item", [{
      name: item.name,
      type: "skill",
      system: {
        category: item.system.category,
        trait: item.system.trait,
        subtype,
        rank: 0,
        isSchoolSkill: false,
        specializations: "",
        masteryBonuses: [],
        description: item.system.description
      }
    }]);
  }

  /**
   * Mini-modale à un seul champ : juste le nom du sous-type à ajouter.
   * @param {string} skillName
   * @returns {Promise<string|null>} le sous-type saisi, ou null si annulé/vide.
   */
  static async #promptSubtype(skillName) {
    const content = `
      <div class="flex flex-col gap-2 p-1 w-64">
        <label class="flex flex-col gap-0.5 text-sm">
          ${game.i18n.format("L5R4EC.Dialog.AddSubtypeLabel", { name: skillName })}
          <input type="text" name="subtype" required autofocus class="border rounded px-1 py-0.5">
        </label>
      </div>`;

    const result = await DialogV2.wait({
      window: { title: game.i18n.format("L5R4EC.Dialog.AddSubtypeTitle", { name: skillName }) },
      content,
      modal: true,
      rejectClose: false,
      buttons: [
        {
          action: "create",
          label: game.i18n.localize("L5R4EC.Dialog.Create"),
          icon: "fa-solid fa-plus",
          default: true,
          callback: (event, button) => button.form.elements.subtype.value.trim()
        },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
      ]
    });

    if (!result || result === "cancel") return null;
    return result || null;
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
   * Affiche une modale demandant un bonus de dés/de garde avant un jet, et
   * (si un Item Compétence avec spécialisations est fourni) laquelle
   * appliquer à ce jet précis.
   * @param {Item} [item]  L'Item Compétence concerné, le cas échéant.
   * @returns {Promise<{rollBonus: number, keepBonus: number, specialization?: string}|null>} null si annulé.
   */
  static async #promptRollBonus(item = null) {
    const specializations = (item?.system.specializations ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/dialogs/roll-bonus.hbs",
      { specializations }
    );

    const result = await DialogV2.wait({
      window: { title: game.i18n.localize("L5R4EC.Dialog.RollBonusTitle") },
      content,
      modal: true,
      rejectClose: false,
      buttons: [
        {
          action: "roll",
          label: game.i18n.localize("L5R4EC.Dialog.Roll"),
          icon: "fa-solid fa-dice-d10",
          default: true,
          callback: (event, button) => ({
            rollBonus: Number(button.form.elements.rollBonus.value) || 0,
            keepBonus: Number(button.form.elements.keepBonus.value) || 0,
            specialization: button.form.elements.specialization?.value ?? ""
          })
        },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
      ]
    });

    if (!result || result === "cancel") return null;
    return result;
  }
}
