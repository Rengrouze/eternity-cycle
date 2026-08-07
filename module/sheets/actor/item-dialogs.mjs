import { createItemViaDialog } from "./item-dialog-helper.mjs";
import { QUALITY_OPTIONS } from "../mixins/quality.mjs";
import { RING_OPTIONS, TRAIT_OPTIONS, SKILL_CATEGORIES } from "./constants.mjs";

/**
 * Handlers d'action "Ajouter un Item" complets (modale à plusieurs champs) -
 * chacun ne fournit au helper partagé (voir item-dialog-helper.mjs) que ce
 * qui change réellement : template, titre, type d'Item, lecture du
 * formulaire. Voir module/sheets/actor/item-presets.mjs pour les ajouts en
 * un clic depuis une liste prédéfinie.
 */

/**
 * "Ajouter un sort" : modale complète (nom, Anneau, rang, mots-clés).
 * @this {CharacterSheet}
 */
export async function onAddSpell() {
  await createItemViaDialog(this.actor, {
    templatePath: "systems/l5r4ec/templates/dialogs/add-spell.hbs",
    templateData: { ringOptions: RING_OPTIONS },
    titleKey: "L5R4EC.Dialog.AddSpellTitle",
    itemType: "spell",
    parseForm: (elements) => {
      const result = {
        name: elements.name.value.trim(),
        ring: elements.ring.value,
        masteryRank: Number(elements.masteryRank.value) || 1,
        keywords: elements.keywords.value.trim(),
      };
      return { name: result.name, system: result };
    },
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
export async function onAddSkill() {
  await createItemViaDialog(this.actor, {
    templatePath: "systems/l5r4ec/templates/dialogs/add-skill.hbs",
    templateData: {
      traitOptions: TRAIT_OPTIONS,
      categories: SKILL_CATEGORIES.map((c) => ({ key: c, labelKey: `L5R4EC.SkillCategory.${c}` })),
    },
    titleKey: "L5R4EC.Dialog.AddSkillTitle",
    itemType: "skill",
    parseForm: (elements) => ({
      name: elements.name.value.trim(),
      system: {
        category: elements.category.value,
        trait: elements.trait.value,
        subtype: elements.subtype.value.trim(),
        rank: 0,
        isSchoolSkill: elements.isSchoolSkill.checked,
        specializations: "",
        masteryBonuses: [],
        description: "",
      },
    }),
  });
}

/**
 * "Ajouter une arme" : modale complète (nom, compétence, DR, mots-clés, qualité).
 * @this {CharacterSheet}
 */
export async function onAddWeapon() {
  await createItemViaDialog(this.actor, {
    templatePath: "systems/l5r4ec/templates/dialogs/add-weapon.hbs",
    templateData: { qualityOptions: QUALITY_OPTIONS },
    titleKey: "L5R4EC.Dialog.AddWeaponTitle",
    itemType: "weapon",
    parseForm: (elements) => {
      const result = {
        name: elements.name.value.trim(),
        associatedSkill: elements.associatedSkill.value.trim(),
        damageRolled: Number(elements.damageRolled.value) || 0,
        damageKept: Number(elements.damageKept.value) || 0,
        keywords: elements.keywords.value.trim(),
        size: elements.size.value,
        quality: elements.quality.value,
        isRanged: elements.isRanged.checked,
        range: Number(elements.range.value) || 0,
        strengthRating: Number(elements.strengthRating.value) || 0,
      };
      return { name: result.name, system: result };
    },
  });
}

/**
 * "Armure personnalisée" : modale complète pour une armure homebrew.
 * @this {CharacterSheet}
 */
export async function onAddArmorCustom() {
  await createItemViaDialog(this.actor, {
    templatePath: "systems/l5r4ec/templates/dialogs/add-armor.hbs",
    templateData: { qualityOptions: QUALITY_OPTIONS },
    titleKey: "L5R4EC.Dialog.AddArmorTitle",
    itemType: "armor",
    parseForm: (elements) => {
      const result = {
        name: elements.name.value.trim(),
        armorType: elements.armorType.value.trim(),
        tnBonus: Number(elements.tnBonus.value) || 0,
        reduction: Number(elements.reduction.value) || 0,
        quality: elements.quality.value,
      };
      return { name: result.name, system: result };
    },
  });
}

/**
 * "Ajouter un objet" : modale simple (nom, compétence optionnelle, qualité).
 * @this {CharacterSheet}
 */
export async function onAddMisc() {
  await createItemViaDialog(this.actor, {
    templatePath: "systems/l5r4ec/templates/dialogs/add-misc.hbs",
    templateData: { qualityOptions: QUALITY_OPTIONS },
    titleKey: "L5R4EC.Dialog.AddMiscTitle",
    itemType: "misc",
    parseForm: (elements) => {
      const result = {
        name: elements.name.value.trim(),
        associatedSkill: elements.associatedSkill.value.trim(),
        quality: elements.quality.value,
      };
      return { name: result.name, system: result };
    },
  });
}

/**
 * "Ajouter une munition" : modale complète (nom, DR, quantité/illimité, qualité).
 * @this {CharacterSheet}
 */
export async function onAddAmmo() {
  await createItemViaDialog(this.actor, {
    templatePath: "systems/l5r4ec/templates/dialogs/add-ammo.hbs",
    templateData: { qualityOptions: QUALITY_OPTIONS },
    titleKey: "L5R4EC.Dialog.AddAmmoTitle",
    itemType: "ammo",
    parseForm: (elements) => {
      const result = {
        name: elements.name.value.trim(),
        damageRolled: Number(elements.damageRolled.value) || 0,
        damageKept: Number(elements.damageKept.value) || 0,
        quantity: Number(elements.quantity.value) || 0,
        unlimited: elements.unlimited.checked,
        quality: elements.quality.value,
      };
      return { name: result.name, system: result };
    },
  });
}
