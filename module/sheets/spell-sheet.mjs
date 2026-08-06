const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ItemSheetV2 } = foundry.applications.sheets;

import { computeSpellTN, computeCastingRounds } from "../rules/spellcasting.mjs";

const RING_OPTIONS = [
  { key: "air", labelKey: "L5R4EC.Ring.Air" },
  { key: "earth", labelKey: "L5R4EC.Ring.Earth" },
  { key: "fire", labelKey: "L5R4EC.Ring.Fire" },
  { key: "water", labelKey: "L5R4EC.Ring.Water" },
  { key: "void", labelKey: "L5R4EC.Ring.Void" }
];

/**
 * Fiche d'Item Sort (ItemSheetV2) - édition complète, indépendante de la
 * fiche Acteur (voir weapon-sheet.mjs pour le raisonnement général).
 */
export class SpellSheet extends HandlebarsApplicationMixin(ItemSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["l5r4ec", "sheet", "item", "spell"],
    position: { width: 480, height: 620 },
    window: { resizable: true },
    form: { submitOnChange: true },
    actions: {
      editImage: SpellSheet.#onEditImage
    }
  };

  /** @override */
  static PARTS = {
    body: { template: "systems/l5r4ec/templates/item/spell-sheet.hbs" }
  };

  /** @override */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.item = this.item;
    context.system = this.item.system;
    context.ringOptions = RING_OPTIONS.map((opt) => ({ ...opt, selected: opt.key === this.item.system.ring }));
    context.castingTn = computeSpellTN(this.item.system.masteryRank);
    context.castingRounds = computeCastingRounds(this.item.system.masteryRank);
    return context;
  }

  /** @this {SpellSheet} */
  static async #onEditImage(event, target) {
    const attr = target.dataset.edit ?? "img";
    const current = foundry.utils.getProperty(this.item, attr);
    new FilePicker({
      type: "image",
      current,
      callback: (path) => this.item.update({ [attr]: path })
    }).render(true);
  }
}
