const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

import { qualityOptionsFor } from "./mixins/quality.mjs";

/**
 * Fiche d'Item Arme (ItemSheetV2) - édition complète, indépendante de la
 * fiche Acteur : permet de pré-créer/éditer une arme dans le monde ou un
 * compendium avant de la glisser sur un personnage.
 */
export class WeaponSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["l5r4ec", "sheet", "item", "weapon"],
    position: { width: 480, height: 620 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      editImage: WeaponSheet.#onEditImage
    }
  };

  /** @override */
  static PARTS = {
    body: { template: "systems/l5r4ec/templates/item/weapon-sheet.hbs" }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.item = this.item;
    context.system = this.item.system;
    context.qualityOptions = qualityOptionsFor(this.item.system.quality);
    context.isNemuranai = this.item.system.quality === "orange";
    // Seul le MJ édite la définition d'un Item déjà embarqué (voir SystemItem) -
    // les Items du monde/compendium (pas encore sur un Actor) restent éditables
    // par quiconque a la permission Foundry standard dessus.
    context.readOnly = this.item.isEmbedded && !game.user.isGM;
    return context;
  }

  /**
   * Ouvre le sélecteur de fichier Foundry pour changer l'image de l'Item.
   * @this {WeaponSheet}
   */
  static async #onEditImage(event, target) {
    if (this.item.isEmbedded && !game.user.isGM) return;
    const attr = target.dataset.edit ?? "img";
    const current = foundry.utils.getProperty(this.item, attr);
    new FilePicker({
      type: "image",
      current,
      callback: (path) => this.item.update({ [attr]: path })
    }).render(true);
  }
}
