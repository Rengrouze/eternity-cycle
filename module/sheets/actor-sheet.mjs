const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;
const { DialogV2 } = foundry.applications.api;

import { DEFAULT_ARMORS } from "../data/default-armors.mjs";
import { DEFAULT_WEAPONS } from "../data/default-weapons.mjs";
import { DEFAULT_AMMO } from "../data/default-ammo.mjs";
import { QUALITY_OPTIONS, qualityBadge } from "./mixins/quality.mjs";
import { AFFINITY_CHOICES, computeMaxLearnableRank, computeSpellTN } from "../rules/spellcasting.mjs";
import { STANCES, canAttackInStance } from "../rules/stances.mjs";

/**
 * Les 5 Anneaux, utilisés à la fois pour le sélecteur d'Anneau d'un sort et
 * pour construire les blocs Affinité/Emplacements de l'onglet Magie.
 */
const RING_OPTIONS = [
  { key: "air", labelKey: "L5R4EC.Ring.Air" },
  { key: "earth", labelKey: "L5R4EC.Ring.Earth" },
  { key: "fire", labelKey: "L5R4EC.Ring.Fire" },
  { key: "water", labelKey: "L5R4EC.Ring.Water" },
  { key: "void", labelKey: "L5R4EC.Ring.Void" }
];

const AFFINITY_OPTIONS = AFFINITY_CHOICES.map((key) => ({
  key,
  labelKey: `L5R4EC.Affinity.${key.charAt(0).toUpperCase()}${key.slice(1)}`
}));

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
    // Permet de glisser une Arme/Armure/Objet/Munition depuis un compendium
    // (ou la barre latérale) directement sur la fiche pour l'ajouter à
    // l'inventaire - comportement standard Foundry, hérité d'ActorSheetV2
    // (_onDropItem crée une copie embarquée sans code supplémentaire ici).
    // Permet aussi de glisser une ligne d'inventaire pour la réordonner/sortir.
    dragDrop: [{ dragSelector: "[data-item-id]", dropSelector: null }],
    actions: {
      rollTrait: CharacterSheet.#onRollTrait,
      rollRing: CharacterSheet.#onRollRing,
      rollSkill: CharacterSheet.#onRollSkill,
      rollSpell: CharacterSheet.#onRollSpell,
      addSpell: CharacterSheet.#onAddSpell,
      rollAttack: CharacterSheet.#onRollAttack,
      rollInitiative: CharacterSheet.#onRollInitiative,
      rollFullDefense: CharacterSheet.#onRollFullDefense,
      setStance: CharacterSheet.#onSetStance,
      showSkillInfo: CharacterSheet.#onShowItemInfo,
      showItemInfo: CharacterSheet.#onShowItemInfo,
      openItem: CharacterSheet.#onOpenItem,
      addSkill: CharacterSheet.#onAddSkill,
      addSubtype: CharacterSheet.#onAddSubtype,
      addWeapon: CharacterSheet.#onAddWeapon,
      addWeaponPreset: CharacterSheet.#onAddWeaponPreset,
      addArmorCustom: CharacterSheet.#onAddArmorCustom,
      addArmorPreset: CharacterSheet.#onAddArmorPreset,
      addMisc: CharacterSheet.#onAddMisc,
      addAmmo: CharacterSheet.#onAddAmmo,
      addAmmoPreset: CharacterSheet.#onAddAmmoPreset,
      toggleArmorEquip: CharacterSheet.#onToggleArmorEquip,
      deleteItem: CharacterSheet.#onDeleteItem,
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
    magic: {
      template: "systems/l5r4ec/templates/actor/parts/tab-magic.hbs",
      scrollable: [""]
    },
    inventory: {
      template: "systems/l5r4ec/templates/actor/parts/tab-inventory.hbs",
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
        { id: "magic", group: "sheet", label: "L5R4EC.Tabs.Magic", icon: "fa-solid fa-hand-sparkles" },
        { id: "inventory", group: "sheet", label: "L5R4EC.Tabs.Inventory", icon: "fa-solid fa-shield-halved" },
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
    context.inventory = this._buildInventory();
    context.activeBuffs = this.actor.system.activeBuffs ?? [];
    context.magic = this._buildMagic();
    context.combat = this._buildCombat();

    return context;
  }

  /**
   * Construit le contexte de l'onglet Combat : postures disponibles (avec
   * leur description non-automatisée, voir module/rules/stances.mjs) et la
   * liste des Armes équipées prêtes à attaquer, avec la Compétence associée
   * résolue par nom sur la fiche (même logique que SystemActor#rollAttack -
   * dupliquée ici uniquement pour l'affichage, "trouvée ou non").
   */
  _buildCombat() {
    const s = this.actor.system;
    const stance = s.combat.stance;

    const attacks = this.actor.items
      .filter((i) => i.type === "weapon" && i.system.equipped)
      .map((item) => {
        const skillName = item.system.associatedSkill.trim().toLowerCase();
        const skillItem = skillName
          ? this.actor.items.find((i) => i.type === "skill" && i.name.trim().toLowerCase() === skillName)
          : null;
        return {
          id: item.id,
          name: item.name,
          associatedSkill: item.system.associatedSkill,
          dr: `${item.system.damageRolled}k${item.system.damageKept}`,
          isRanged: item.system.isRanged,
          range: item.system.range,
          skillFound: Boolean(skillItem),
          skillRank: skillItem?.system.rank ?? 0
        };
      });

    // Barre de vie : pourcentage + couleur dérivés du rang de blessure actuel
    // (system.wounds.rankIndex, calculé par CharacterDataModel) - précalculés
    // ici plutôt qu'en Handlebars, qui n'a pas d'opérateur arithmétique/ternaire
    // garanti (voir pièges du projet).
    const woundsColors = ["bg-green-500", "bg-green-500", "bg-yellow-500", "bg-yellow-500", "bg-orange-500", "bg-orange-500", "bg-red-600", "bg-red-800"];

    return {
      stance,
      stances: STANCES.map((st) => ({ ...st, active: st.key === stance, isFullDefense: st.key === "fullDefense" })),
      canAttack: canAttackInStance(stance),
      inCombat: this.actor.isInCombat,
      attacks,
      initiativeBonus: s.combat.initiativeBonus,
      fullDefenseBonus: s.combat.fullDefenseBonus,
      woundsPercent: s.wounds.max > 0 ? Math.min(100, Math.round((s.wounds.value / s.wounds.max) * 100)) : 0,
      woundsColorClass: woundsColors[s.wounds.rankIndex] ?? "bg-red-800"
    };
  }

  /**
   * Construit les listes Armes/Armures/Objets Divers + l'équipement actuel
   * (armure équipée, armes équipées) pour l'onglet Inventaire.
   */
  _buildInventory() {
    const badge = qualityBadge;

    const weapons = this.actor.items
      .filter((i) => i.type === "weapon")
      .map((item) => ({
        id: item.id,
        name: item.name,
        associatedSkill: item.system.associatedSkill,
        dr: `${item.system.damageRolled}k${item.system.damageKept}`,
        equipped: item.system.equipped,
        quality: badge(item)
      }));

    const armors = this.actor.items
      .filter((i) => i.type === "armor")
      .map((item) => ({
        id: item.id,
        name: item.name,
        armorType: item.system.armorType,
        tnBonus: item.system.tnBonus,
        reduction: item.system.reduction,
        equipped: item.system.equipped,
        quality: badge(item)
      }));

    const miscItems = this.actor.items
      .filter((i) => i.type === "misc")
      .map((item) => ({
        id: item.id,
        name: item.name,
        associatedSkill: item.system.associatedSkill,
        quality: badge(item)
      }));

    const ammo = this.actor.items
      .filter((i) => i.type === "ammo")
      .map((item) => ({
        id: item.id,
        name: item.name,
        dr: `${item.system.damageRolled}k${item.system.damageKept}`,
        quantity: item.system.quantity,
        unlimited: item.system.unlimited,
        quality: badge(item)
      }));

    return {
      weapons,
      armors,
      miscItems,
      ammo,
      equippedArmor: armors.find((a) => a.equipped) ?? null,
      equippedWeapons: weapons.filter((w) => w.equipped),
      armorPresets: DEFAULT_ARMORS.map((a) => ({ key: a.name, name: a.name })),
      weaponPresets: DEFAULT_WEAPONS.map((w) => ({ key: w.name, name: w.name })),
      ammoPresets: DEFAULT_AMMO.map((a) => ({ key: a.name, name: a.name }))
    };
  }

  /**
   * Construit le contexte de l'onglet Magie : config Shugenja (rang
   * d'école, affinités par Anneau avec rang max apprenable dérivé),
   * emplacements de sorts (max/dépensés/disponibles par Anneau), et la
   * liste des sorts connus groupée par Anneau puis triée par rang.
   */
  _buildMagic() {
    const s = this.actor.system;

    const rings = RING_OPTIONS.map((ring) => ({
      ...ring,
      affinity: s.shugenja.affinities[ring.key],
      affinityOptions: AFFINITY_OPTIONS.map((opt) => ({ ...opt, selected: opt.key === s.shugenja.affinities[ring.key] })),
      maxLearnableRank: computeMaxLearnableRank(s.shugenja.schoolRank, s.shugenja.affinities[ring.key]),
      slots: s.spellSlots[ring.key]
    }));

    const spells = this.actor.items
      .filter((i) => i.type === "spell")
      .sort((a, b) => a.system.masteryRank - b.system.masteryRank || a.name.localeCompare(b.name));

    const spellsByRing = RING_OPTIONS.map((ring) => ({
      ...ring,
      spells: spells
        .filter((i) => i.system.ring === ring.key)
        .map((item) => ({
          id: item.id,
          name: item.name,
          masteryRank: item.system.masteryRank,
          keywords: item.system.keywords
        }))
    }));

    return { schoolRank: s.shugenja.schoolRank, rings, spellsByRing };
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
   * Clic sur le nom d'un Item d'inventaire (Arme/Armure/Objet/Munition) :
   * ouvre sa vraie fiche Foundry (ItemSheetV2) pour édition complète, plutôt
   * que le résumé en lecture seule de showItemInfo.
   * @this {CharacterSheet}
   */
  static async #onOpenItem(event, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    if (!item) return;
    item.sheet.render(true);
  }

  /**
   * Handler d'action pour le clic sur un bouton de jet de Sort.
   * @this {CharacterSheet}
   */
  static async #onRollSpell(event, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    if (!item) return;

    const options = await CharacterSheet.#promptSpellCast(item);
    if (options === null) return;

    await this.actor.rollSpell(item.id, options);
  }

  /**
   * Modale de lancer de sort : Augmentations déclarées (+5 au TN chacune) et
   * nombre de cibles visées (informatifs - reportés sur la carte de chat
   * pour interprétation manuelle du texte "Augmentations" du sort, voir
   * pièges du projet sur les bonus non automatisables), plus les bonus de
   * dés lancés/gardés classiques.
   * @param {Item} item  L'Item Sort concerné, pour afficher son TN de base.
   * @returns {Promise<{augmentations:number, targets:number, rollBonus:number, keepBonus:number}|null>}
   */
  static async #promptSpellCast(item) {
    const baseTn = computeSpellTN(item.system.masteryRank);
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/dialogs/spell-cast.hbs",
      { baseTn }
    );

    const result = await DialogV2.wait({
      window: { title: game.i18n.format("L5R4EC.Dialog.SpellCastTitle", { name: item.name }) },
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
            augmentations: Number(button.form.elements.augmentations.value) || 0,
            targets: Number(button.form.elements.targets.value) || 1,
            rollBonus: Number(button.form.elements.rollBonus.value) || 0,
            keepBonus: Number(button.form.elements.keepBonus.value) || 0
          })
        },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
      ]
    });

    if (!result || result === "cancel") return null;
    return result;
  }

  /**
   * Handler d'action pour le clic sur "Attaquer" d'une Arme équipée.
   * @this {CharacterSheet}
   */
  static async #onRollAttack(event, target) {
    const bonus = await CharacterSheet.#promptRollBonus();
    if (bonus === null) return;

    await this.actor.rollAttack(target.dataset.itemId, bonus);
  }

  /**
   * Handler d'action pour le clic sur "Lancer l'Initiative".
   * @this {CharacterSheet}
   */
  static async #onRollInitiative() {
    await this.actor.rollInitiative();
  }

  /**
   * Handler d'action pour le clic sur "Déclarer Pleine Défense" (jet inclus,
   * voir SystemActor#rollFullDefense).
   * @this {CharacterSheet}
   */
  static async #onRollFullDefense() {
    const confirmed = await CharacterSheet.#confirmStance("fullDefense");
    if (!confirmed) return;

    await this.actor.rollFullDefense();
  }

  /**
   * Handler d'action pour le clic sur une posture autre que Pleine Défense
   * (qui passe par #onRollFullDefense, car sa déclaration implique un jet).
   * @this {CharacterSheet}
   */
  static async #onSetStance(event, target) {
    const stance = target.dataset.stance;
    const confirmed = await CharacterSheet.#confirmStance(stance);
    if (!confirmed) return;

    await this.actor.setStance(stance);
  }

  /**
   * Confirmation avant tout changement de posture - une déclaration de
   * posture engage le personnage pour tout le round, mieux vaut éviter un
   * clic accidentel (voir demande utilisateur : confirmation systématique).
   * @param {string} stance  Une valeur de STANCE_CHOICES.
   * @returns {Promise<boolean>}
   */
  static async #confirmStance(stance) {
    const label = game.i18n.localize(`L5R4EC.Stance.${stance.charAt(0).toUpperCase()}${stance.slice(1)}`);
    return DialogV2.confirm({
      window: { title: game.i18n.localize("L5R4EC.Dialog.ConfirmStanceTitle") },
      content: `<p>${game.i18n.format("L5R4EC.Dialog.ConfirmStanceBody", { stance: label })}</p>`,
      modal: true,
      rejectClose: false
    });
  }

  /**
   * "Ajouter un sort" : modale complète (nom, Anneau, rang, mots-clés).
   * @this {CharacterSheet}
   */
  static async #onAddSpell() {
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/dialogs/add-spell.hbs",
      { ringOptions: RING_OPTIONS }
    );

    const result = await DialogV2.wait({
      window: { title: game.i18n.localize("L5R4EC.Dialog.AddSpellTitle") },
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
            ring: button.form.elements.ring.value,
            masteryRank: Number(button.form.elements.masteryRank.value) || 1,
            keywords: button.form.elements.keywords.value.trim()
          })
        },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
      ]
    });

    if (!result || result === "cancel" || !result.name) return;

    await this.actor.createEmbeddedDocuments("Item", [{
      name: result.name,
      type: "spell",
      system: { ...result }
    }]);
  }

  /**
   * Handler d'action pour l'icône "i" : résumé de l'Item (Compétence, Arme,
   * Armure ou Objet Divers - tous ont un champ description).
   * @this {CharacterSheet}
   */
  static async #onShowItemInfo(event, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    if (!item) return;

    const title = item.system.subtype ? `${item.name} (${item.system.subtype})` : item.name;
    const description = await foundry.applications.ux.TextEditor.enrichHTML(
      item.system.description || `<em>${game.i18n.localize("L5R4EC.Sheet.NoDescription")}</em>`,
      { secrets: false, relativeTo: item }
    );

    let extra = "";
    if (item.system.specialRules) {
      const rules = await foundry.applications.ux.TextEditor.enrichHTML(item.system.specialRules, { secrets: false, relativeTo: item });
      extra += `<p class="mt-2 text-sm"><strong>${game.i18n.localize("L5R4EC.Sheet.SpecialRules")}</strong> : ${rules}</p>`;
    }
    if (item.system.quality === "orange" && item.system.nemuranaiPower) {
      const power = await foundry.applications.ux.TextEditor.enrichHTML(item.system.nemuranaiPower, { secrets: false, relativeTo: item });
      extra += `<p class="mt-2 text-sm text-orange-600"><strong>${game.i18n.localize("L5R4EC.Sheet.NemuranaiPower")}</strong> : ${power}</p>`;
    }

    await DialogV2.wait({
      window: { title },
      content: `<div class="l5r4ec p-2">${description}${extra}</div>`,
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
   * "Ajouter une arme" : modale complète (nom, compétence, DR, mots-clés, qualité).
   * @this {CharacterSheet}
   */
  static async #onAddWeapon() {
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/dialogs/add-weapon.hbs",
      { qualityOptions: QUALITY_OPTIONS }
    );

    const result = await DialogV2.wait({
      window: { title: game.i18n.localize("L5R4EC.Dialog.AddWeaponTitle") },
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
            associatedSkill: button.form.elements.associatedSkill.value.trim(),
            damageRolled: Number(button.form.elements.damageRolled.value) || 0,
            damageKept: Number(button.form.elements.damageKept.value) || 0,
            keywords: button.form.elements.keywords.value.trim(),
            quality: button.form.elements.quality.value,
            isRanged: button.form.elements.isRanged.checked,
            range: Number(button.form.elements.range.value) || 0,
            strengthRating: Number(button.form.elements.strengthRating.value) || 0
          })
        },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
      ]
    });

    if (!result || result === "cancel" || !result.name) return;

    await this.actor.createEmbeddedDocuments("Item", [{
      name: result.name,
      type: "weapon",
      system: { ...result }
    }]);
  }

  /**
   * "Arme de base" : ajoute une arme depuis DEFAULT_WEAPONS (liste
   * déroulante à côté du bouton), sans repasser par la modale complète.
   * @this {CharacterSheet}
   */
  static async #onAddWeaponPreset(event, target) {
    const select = target.parentElement.querySelector('select[name="weaponPreset"]');
    const preset = DEFAULT_WEAPONS.find((w) => w.name === select?.value);
    if (!preset) return;

    const { name, ...system } = preset;
    await this.actor.createEmbeddedDocuments("Item", [{ name, type: "weapon", system }]);
  }

  /**
   * "Munition de base" : ajoute une munition depuis DEFAULT_AMMO (liste
   * déroulante à côté du bouton), sans repasser par la modale complète.
   * @this {CharacterSheet}
   */
  static async #onAddAmmoPreset(event, target) {
    const select = target.parentElement.querySelector('select[name="ammoPreset"]');
    const preset = DEFAULT_AMMO.find((a) => a.name === select?.value);
    if (!preset) return;

    const { name, ...system } = preset;
    await this.actor.createEmbeddedDocuments("Item", [{ name, type: "ammo", system }]);
  }

  /**
   * "+ Ashigaru/Légère/Lourde/Monture" : ajoute une des 4 armures de base
   * en un clic, sans modale.
   * @this {CharacterSheet}
   */
  static async #onAddArmorPreset(event, target) {
    const preset = DEFAULT_ARMORS.find((a) => a.name === target.dataset.preset);
    if (!preset) return;

    await this.actor.createEmbeddedDocuments("Item", [{
      name: preset.name,
      type: "armor",
      system: {
        armorType: preset.armorType,
        tnBonus: preset.tnBonus,
        reduction: preset.reduction,
        specialRules: preset.specialRules ?? "",
        price: preset.price ?? "",
        description: preset.description ?? ""
      }
    }]);
  }

  /**
   * "Armure personnalisée" : modale complète pour une armure homebrew.
   * @this {CharacterSheet}
   */
  static async #onAddArmorCustom() {
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/dialogs/add-armor.hbs",
      { qualityOptions: QUALITY_OPTIONS }
    );

    const result = await DialogV2.wait({
      window: { title: game.i18n.localize("L5R4EC.Dialog.AddArmorTitle") },
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
            armorType: button.form.elements.armorType.value.trim(),
            tnBonus: Number(button.form.elements.tnBonus.value) || 0,
            reduction: Number(button.form.elements.reduction.value) || 0,
            quality: button.form.elements.quality.value
          })
        },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
      ]
    });

    if (!result || result === "cancel" || !result.name) return;

    await this.actor.createEmbeddedDocuments("Item", [{
      name: result.name,
      type: "armor",
      system: { ...result }
    }]);
  }

  /**
   * "Ajouter un objet" : modale simple (nom, compétence optionnelle, qualité).
   * @this {CharacterSheet}
   */
  static async #onAddMisc() {
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/dialogs/add-misc.hbs",
      { qualityOptions: QUALITY_OPTIONS }
    );

    const result = await DialogV2.wait({
      window: { title: game.i18n.localize("L5R4EC.Dialog.AddMiscTitle") },
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
            associatedSkill: button.form.elements.associatedSkill.value.trim(),
            quality: button.form.elements.quality.value
          })
        },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
      ]
    });

    if (!result || result === "cancel" || !result.name) return;

    await this.actor.createEmbeddedDocuments("Item", [{
      name: result.name,
      type: "misc",
      system: { ...result }
    }]);
  }

  /**
   * "Ajouter une munition" : modale complète (nom, DR, quantité/illimité, qualité).
   * @this {CharacterSheet}
   */
  static async #onAddAmmo() {
    const content = await foundry.applications.handlebars.renderTemplate(
      "systems/l5r4ec/templates/dialogs/add-ammo.hbs",
      { qualityOptions: QUALITY_OPTIONS }
    );

    const result = await DialogV2.wait({
      window: { title: game.i18n.localize("L5R4EC.Dialog.AddAmmoTitle") },
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
            damageRolled: Number(button.form.elements.damageRolled.value) || 0,
            damageKept: Number(button.form.elements.damageKept.value) || 0,
            quantity: Number(button.form.elements.quantity.value) || 0,
            unlimited: button.form.elements.unlimited.checked,
            quality: button.form.elements.quality.value
          })
        },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") }
      ]
    });

    if (!result || result === "cancel" || !result.name) return;

    await this.actor.createEmbeddedDocuments("Item", [{
      name: result.name,
      type: "ammo",
      system: { ...result }
    }]);
  }

  /**
   * Bascule l'équipement d'une Armure (exclusivité mutuelle gérée côté Actor).
   * @this {CharacterSheet}
   */
  static async #onToggleArmorEquip(event, target) {
    await this.actor.toggleArmorEquip(target.dataset.itemId);
  }

  /**
   * Supprime un Item (Compétence, Arme, Armure, Objet), avec confirmation.
   * @this {CharacterSheet}
   */
  static async #onDeleteItem(event, target) {
    const item = this.actor.items.get(target.dataset.itemId);
    if (!item) return;

    const confirmed = await DialogV2.wait({
      window: { title: game.i18n.localize("L5R4EC.Dialog.DeleteItemTitle") },
      content: `<p>${game.i18n.format("L5R4EC.Dialog.DeleteItemConfirm", { name: item.name })}</p>`,
      modal: true,
      rejectClose: false,
      buttons: [
        { action: "delete", label: game.i18n.localize("L5R4EC.Dialog.Delete"), icon: "fa-solid fa-trash" },
        { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel"), default: true }
      ]
    });

    if (confirmed === "delete") await item.delete();
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
