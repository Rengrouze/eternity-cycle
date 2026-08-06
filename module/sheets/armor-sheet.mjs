const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

import { qualityOptionsFor } from "./mixins/quality.mjs";

/**
 * Fiche d'Item Armure (ItemSheetV2) - édition complète, indépendante de la
 * fiche Acteur (voir weapon-sheet.mjs pour le raisonnement).
 */
export class ArmorSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["l5r4ec", "sheet", "item", "armor"],
    position: { width: 480, height: 560 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      editImage: ArmorSheet.#onEditImage
    }
  };

  /** @override */
  static PARTS = {
    body: { template: "systems/l5r4ec/templates/item/armor-sheet.hbs" }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.item = this.item;
    context.system = this.item.system;
    context.qualityOptions = qualityOptionsFor(this.item.system.quality);
    context.isNemuranai = this.item.system.quality === "orange";
    context.readOnly = this.item.isEmbedded && !game.user.isGM;
    return context;
  }

  /** @this {ArmorSheet} */
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
