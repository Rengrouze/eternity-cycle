import { basicRoll, performRoll } from "../dice/_module.mjs";

/**
 * Actor custom pour le système.
 */
export class SystemActor extends Actor {
  /**
   * Lance un jet de Trait seul (sans Compétence pour l'instant).
   * @param {string} traitKey Clé du trait, ex: "awa", "ref", ...
   * @param {{rollBonus?: number, keepBonus?: number}} [options]
   * @returns {Promise<Roll>}
   */
  async rollTrait(traitKey, { rollBonus = 0, keepBonus = 0 } = {}) {
    const traitRank = this.system.traits[traitKey];
    if (traitRank === undefined) {
      throw new Error(`Trait inconnu: ${traitKey}`);
    }

    const label = game.i18n.localize(`L5R4EC.Trait.${this._traitLabelKey(traitKey)}`);
    const config = basicRoll({ rank: traitRank, rollBonus, keepBonus });

    return performRoll(this, config, `${game.i18n.localize("L5R4EC.Sheet.TraitRoll")} : ${label}`);
  }

  /** Convertit une clé courte ("awa") en clé de libellé ("Awareness"). */
  _traitLabelKey(traitKey) {
    const map = {
      sta: "Stamina", wil: "Willpower", str: "Strength", per: "Perception",
      ref: "Reflexes", awa: "Awareness", agi: "Agility", int: "Intelligence"
    };
    return map[traitKey] ?? traitKey;
  }

  /**
   * Empêche un non-MJ de modifier Honneur/Gloire/Statut/Souillure, même en
   * forçant un appel à update() (ex: via la console) - la fiche les cache
   * ou les passe en lecture seule côté template, ceci est la protection
   * "réelle" côté serveur/document.
   * @override
   */
  async _preUpdate(changed, options, user) {
    const allowed = await super._preUpdate(changed, options, user);
    if (allowed === false) return false;

    if (!user.isGM && changed.system) {
      for (const key of ["honor", "glory", "status"]) {
        if (changed.system[key]?.rank !== undefined) {
          delete changed.system[key].rank;
        }
      }
      if (changed.system.taint) {
        delete changed.system.taint.rank;
        delete changed.system.taint.hidden; // seul le MJ décide qui peut voir la Souillure
      }
    }
  }
}
