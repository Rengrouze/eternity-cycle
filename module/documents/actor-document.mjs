import { rollKeep } from "../helpers/dice.mjs";

/**
 * Actor custom pour le système.
 */
export class SystemActor extends Actor {
  /**
   * Lance un jet de Trait seul (sans Compétence pour l'instant).
   * @param {string} traitKey Clé du trait, ex: "awa", "ref", ...
   * @returns {Promise<Roll>}
   */
  async rollTrait(traitKey) {
    const traitRank = this.system.traits[traitKey];
    if (traitRank === undefined) {
      throw new Error(`Trait inconnu: ${traitKey}`);
    }

    const label = game.i18n.localize(`L5R4EC.Trait.${this._traitLabelKey(traitKey)}`);
    return rollKeep(this, traitRank, traitRank, `${game.i18n.localize("L5R4EC.Sheet.TraitRoll")} : ${label}`);
  }

  /** Convertit une clé courte ("awa") en clé de libellé ("Awareness"). */
  _traitLabelKey(traitKey) {
    const map = {
      sta: "Stamina", wil: "Willpower", str: "Strength", per: "Perception",
      ref: "Reflexes", awa: "Awareness", agi: "Agility", int: "Intelligence"
    };
    return map[traitKey] ?? traitKey;
  }
}
