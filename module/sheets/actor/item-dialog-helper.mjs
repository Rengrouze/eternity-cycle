const { DialogV2 } = foundry.applications.api;

/**
 * Encapsule le trio répété par tous les handlers "Ajouter un Item" complets
 * (Sort/Compétence/Arme/Armure personnalisée/Objet/Munition, voir
 * module/sheets/actor/item-dialogs.mjs) : rendre un template de formulaire,
 * ouvrir une DialogV2 Créer/Annuler, puis créer l'Item embarqué avec le
 * résultat. `parseForm` lit les champs du formulaire et renvoie
 * `{name, system}` - laissé entièrement à l'appelant plutôt qu'un simple
 * spread générique, car la Compétence a besoin d'un `system` qui n'est PAS
 * un reflet direct du formulaire (valeurs par défaut fixes en plus des
 * champs saisis - voir #onAddSkill).
 * @param {Actor} actor
 * @param {{templatePath: string, templateData?: object, titleKey: string, itemType: string, parseForm: (elements: HTMLFormControlsCollection) => {name: string, system: object}}} config
 * @returns {Promise<void>}
 */
export async function createItemViaDialog(actor, { templatePath, templateData = {}, titleKey, itemType, parseForm }) {
  const content = await foundry.applications.handlebars.renderTemplate(templatePath, templateData);

  const result = await DialogV2.wait({
    window: { title: game.i18n.localize(titleKey) },
    content,
    modal: true,
    rejectClose: false,
    buttons: [
      {
        action: "create",
        label: game.i18n.localize("L5R4EC.Dialog.Create"),
        icon: "fa-solid fa-plus",
        default: true,
        callback: (event, button) => parseForm(button.form.elements),
      },
      { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") },
    ],
  });

  if (!result || result === "cancel" || !result.name) return;

  await actor.createEmbeddedDocuments("Item", [{ name: result.name, type: itemType, system: result.system }]);
}
