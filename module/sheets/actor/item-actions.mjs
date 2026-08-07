const { DialogV2 } = foundry.applications.api;

import { promptSubtype } from "./roll-prompts.mjs";

/**
 * Handlers d'action sur des Items d'inventaire/Compétences déjà présents
 * (info, équiper, supprimer, sous-type, resynchronisation) et le champ de
 * changement direct des lignes de Compétence.
 */

/**
 * Branche les champs des lignes de Compétence (rang, Trait...) : ils ne
 * peuvent pas passer par le submitOnChange standard de la sheet (qui ne
 * met à jour que l'Actor), donc CharacterSheet#_onRender écoute leurs
 * changements et met à jour l'Item embarqué correspondant directement.
 * @this {CharacterSheet}
 */
export async function onChangeItemField(event) {
  const el = event.currentTarget;
  const item = this.actor.items.get(el.dataset.itemId);
  if (!item) return;

  const value = el.type === "checkbox" ? el.checked : el.type === "number" ? Number(el.value) : el.value;
  await item.update({ [el.dataset.itemField]: value });
}

/**
 * Clic sur le nom d'un Item d'inventaire (Arme/Armure/Objet/Munition) :
 * ouvre sa vraie fiche Foundry (ItemSheetV2) pour édition complète, plutôt
 * que le résumé en lecture seule de #onShowItemInfo.
 * @this {CharacterSheet}
 */
export async function onOpenItem(event, target) {
  const item = this.actor.items.get(target.dataset.itemId);
  if (!item) return;
  item.sheet.render(true);
}

/**
 * Handler d'action pour l'icône "i" : résumé de l'Item (Compétence, Arme,
 * Armure ou Objet Divers - tous ont un champ description).
 * @this {CharacterSheet}
 */
export async function onShowItemInfo(event, target) {
  const item = this.actor.items.get(target.dataset.itemId);
  if (!item) return;

  const title = item.system.subtype ? `${item.name} (${item.system.subtype})` : item.name;
  const description = await foundry.applications.ux.TextEditor.enrichHTML(
    item.system.description || `<em>${game.i18n.localize("L5R4EC.Sheet.NoDescription")}</em>`,
    { secrets: false, relativeTo: item },
  );

  let extra = "";
  if (item.system.specialRules) {
    const rules = await foundry.applications.ux.TextEditor.enrichHTML(item.system.specialRules, { secrets: false, relativeTo: item });
    extra += `<p class="mt-2 text-sm"><strong>${game.i18n.localize("L5R4EC.Sheet.SpecialRules")}</strong> : ${rules}</p>`;
  }
  if (item.system.quality === "orange" && item.system.nemuranaiPower) {
    const power = await foundry.applications.ux.TextEditor.enrichHTML(item.system.nemuranaiPower, {
      secrets: false,
      relativeTo: item,
    });
    extra += `<p class="mt-2 text-sm text-orange-600"><strong>${game.i18n.localize("L5R4EC.Sheet.NemuranaiPower")}</strong> : ${power}</p>`;
  }

  await DialogV2.wait({
    window: { title },
    content: `<div class="l5r4ec p-2">${description}${extra}</div>`,
    modal: true,
    rejectClose: false,
    buttons: [{ action: "close", label: game.i18n.localize("L5R4EC.Dialog.Close"), default: true }],
  });
}

/**
 * Handler d'action pour le "+" sur une ligne/un groupe de compétence :
 * ajoute directement un nouveau sous-type à CETTE compétence (même nom,
 * même catégorie, même Trait par défaut - juste un sous-type différent),
 * sans repasser par le formulaire complet "Ajouter une compétence".
 * @this {CharacterSheet}
 */
export async function onAddSubtype(event, target) {
  event.preventDefault();
  event.stopPropagation();

  const item = this.actor.items.get(target.dataset.itemId);
  if (!item) return;

  const subtype = await promptSubtype(item.name);
  if (!subtype) return;

  await this.actor.createEmbeddedDocuments("Item", [
    {
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
        description: item.system.description,
      },
    },
  ]);
}

/**
 * Bascule l'équipement d'une Armure (exclusivité mutuelle gérée côté Actor).
 * @this {CharacterSheet}
 */
export async function onToggleArmorEquip(event, target) {
  await this.actor.toggleArmorEquip(target.dataset.itemId);
}

/**
 * "Resynchroniser les Compétences" (MJ uniquement) : met à jour les
 * `masteryBonuses` des Compétences déjà présentes sur ce personnage avec
 * la version actuelle de default-skills.mjs (voir
 * SystemActor#resyncSkillMasteryBonuses) - nécessaire pour un personnage
 * créé avant une mise à jour des données de Compétences par défaut, sinon
 * il garde une copie figée au moment de sa création.
 * @this {CharacterSheet}
 */
export async function onResyncSkills() {
  const confirmed = await DialogV2.confirm({
    window: { title: game.i18n.localize("L5R4EC.Dialog.ResyncSkillsTitle") },
    content: `<p>${game.i18n.localize("L5R4EC.Dialog.ResyncSkillsBody")}</p>`,
    modal: true,
    rejectClose: false,
  });
  if (!confirmed) return;

  const count = await this.actor.resyncSkillMasteryBonuses();
  ui.notifications.info(game.i18n.format("L5R4EC.Notif.SkillsResynced", { count }));
}

/**
 * Supprime un Item (Compétence, Arme, Armure, Objet), avec confirmation.
 * @this {CharacterSheet}
 */
export async function onDeleteItem(event, target) {
  const item = this.actor.items.get(target.dataset.itemId);
  if (!item) return;

  const confirmed = await DialogV2.wait({
    window: { title: game.i18n.localize("L5R4EC.Dialog.DeleteItemTitle") },
    content: `<p>${game.i18n.format("L5R4EC.Dialog.DeleteItemConfirm", { name: item.name })}</p>`,
    modal: true,
    rejectClose: false,
    buttons: [
      { action: "delete", label: game.i18n.localize("L5R4EC.Dialog.Delete"), icon: "fa-solid fa-trash" },
      { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel"), default: true },
    ],
  });

  if (confirmed === "delete") await item.delete();
}

/**
 * Bascule la visibilité du rang de Souillure (masqué par défaut).
 * @this {CharacterSheet}
 */
export async function onToggleTaintVisibility() {
  if (!game.user.isGM) return; // le bouton n'est déjà pas rendu côté joueur, ceci est une double sécurité
  await this.actor.update({ "system.taint.hidden": !this.actor.system.taint.hidden });
}
