import { basicRoll, skillRoll, performRoll } from "../dice/_module.mjs";
import { computeReputationRank } from "../rules/reputation.mjs";
import { affinityRollBonus } from "../rules/spellcasting.mjs";

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

  /**
   * Lance un jet d'Anneau (Air/Terre/Feu/Eau/Vide) : même mécanique XgX
   * qu'un jet de Trait, juste une source de rang différente.
   * @param {string} ringKey Clé de l'Anneau : "air", "earth", "fire", "water", "void".
   * @param {{rollBonus?: number, keepBonus?: number}} [options]
   * @returns {Promise<Roll>}
   */
  async rollRing(ringKey, { rollBonus = 0, keepBonus = 0 } = {}) {
    const ring = this.system.rings[ringKey];
    if (ring === undefined) {
      throw new Error(`Anneau inconnu: ${ringKey}`);
    }

    const label = game.i18n.localize(`L5R4EC.Ring.${this._ringLabelKey(ringKey)}`);
    const config = basicRoll({ rank: ring.rank, rollBonus, keepBonus });

    return performRoll(this, config, `${game.i18n.localize("L5R4EC.Sheet.RingRoll")} : ${label}`);
  }

  /**
   * Lance un jet de Compétence : (Trait + rang de compétence)g(Trait),
   * plafonné à 10g10, n'explose que si entraînée (rang >= 1), relance les 1
   * si une spécialisation est appliquée à ce jet précis.
   * @param {string} itemId  Id de l'Item Compétence.
   * @param {{rollBonus?: number, keepBonus?: number, specialization?: string}} [options]
   * @returns {Promise<Roll>}
   */
  async rollSkill(itemId, { rollBonus = 0, keepBonus = 0, specialization = "" } = {}) {
    const item = this.items.get(itemId);
    if (!item || item.type !== "skill") {
      throw new Error(`Compétence introuvable: ${itemId}`);
    }

    const traitRank = this._resolveTraitOrVoidRank(item.system.trait);
    const config = skillRoll({
      traitRank,
      skillRank: item.system.rank,
      specialized: Boolean(specialization),
      rollBonus,
      keepBonus
    });

    const traitLabel = this._traitOrVoidLabel(item.system.trait);
    let flavor = `${item.name} (${traitLabel})`;
    if (specialization) flavor += ` \u2013 ${specialization}`;

    return performRoll(this, config, flavor);
  }

  /**
   * Lance un jet de Lancer de Sort : (rang d'École de Shugenja + rang de
   * l'Anneau du sort)g(rang de l'Anneau), même forme que rollSkill (École =
   * "compétence", Anneau = "trait"), avec le bonus/malus d'affinité de
   * l'Anneau ajouté aux dés lancés. Consomme un emplacement de sort dans le
   * pool de l'Anneau (ou le pool de Vide en secours) s'il en reste un ; sinon
   * avertit sans bloquer le jet (dépassement à la discrétion du MJ).
   * @param {string} itemId  Id de l'Item Sort.
   * @param {{rollBonus?: number, keepBonus?: number}} [options]
   * @returns {Promise<Roll>}
   */
  async rollSpell(itemId, { rollBonus = 0, keepBonus = 0 } = {}) {
    const item = this.items.get(itemId);
    if (!item || item.type !== "spell") {
      throw new Error(`Sort introuvable: ${itemId}`);
    }

    const ring = item.system.ring;
    const ringRank = this.system.rings[ring].rank;
    const schoolRank = this.system.shugenja.schoolRank;
    const affinity = this.system.shugenja.affinities[ring];

    const config = skillRoll({
      traitRank: ringRank,
      skillRank: schoolRank,
      rollBonus: rollBonus + affinityRollBonus(affinity),
      keepBonus
    });

    const consumed = await this._consumeSpellSlot(ring);
    if (!consumed) {
      ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoSpellSlot", { name: item.name }));
    }

    const ringLabel = game.i18n.localize(`L5R4EC.Ring.${this._ringLabelKey(ring)}`);
    const flavor = `${game.i18n.localize("L5R4EC.Sheet.SpellRoll")} : ${item.name} (${ringLabel} ${item.system.masteryRank})`;

    return performRoll(this, config, flavor);
  }

  /**
   * Décrémente un emplacement de sort disponible dans le pool de l'Anneau
   * donné ; si aucun n'est disponible, tente le pool de Vide (qui sert de
   * bonus pour n'importe quel Anneau). Ne fait rien et renvoie false si
   * aucun emplacement n'est disponible dans les deux pools.
   * @param {string} ring
   * @returns {Promise<boolean>} true si un emplacement a été consommé.
   */
  async _consumeSpellSlot(ring) {
    const slots = this.system.spellSlots;

    if (slots[ring].available > 0) {
      await this.update({ [`system.spellSlots.${ring}.spent`]: slots[ring].spent + 1 });
      return true;
    }
    if (ring !== "void" && slots.void.available > 0) {
      await this.update({ "system.spellSlots.void.spent": slots.void.spent + 1 });
      return true;
    }
    return false;
  }

  /** Convertit une clé courte ("awa") en clé de libellé ("Awareness"). */
  _traitLabelKey(traitKey) {
    const map = {
      sta: "Stamina", wil: "Willpower", str: "Strength", per: "Perception",
      ref: "Reflexes", awa: "Awareness", agi: "Agility", int: "Intelligence"
    };
    return map[traitKey] ?? traitKey;
  }

  /** Convertit une clé courte ("air") en clé de libellé ("Air"). */
  _ringLabelKey(ringKey) {
    const map = { air: "Air", earth: "Earth", fire: "Fire", water: "Water", void: "Void" };
    return map[ringKey] ?? ringKey;
  }

  /**
   * Une Compétence peut être associée à un Trait classique OU au Vide
   * (qui vit dans system.rings.void, pas dans system.traits).
   */
  _resolveTraitOrVoidRank(traitKey) {
    if (traitKey === "void") return this.system.rings.void.rank;
    return this.system.traits[traitKey];
  }

  /** Libellé localisé pour un Trait classique ou le Vide. */
  _traitOrVoidLabel(traitKey) {
    if (traitKey === "void") return game.i18n.localize("L5R4EC.Ring.Void");
    return game.i18n.localize(`L5R4EC.Trait.${this._traitLabelKey(traitKey)}`);
  }

  /**
   * Bascule l'équipement d'une Armure. Une seule armure peut être équipée à
   * la fois : équiper celle-ci déséquipe automatiquement toutes les autres.
   * @param {string} itemId
   */
  async toggleArmorEquip(itemId) {
    const target = this.items.get(itemId);
    if (!target || target.type !== "armor") return;

    const wasEquipped = target.system.equipped;
    const updates = this.items
      .filter((i) => i.type === "armor")
      .map((i) => ({ _id: i.id, "system.equipped": i.id === itemId ? !wasEquipped : false }));

    await this.updateEmbeddedDocuments("Item", updates);
  }

  /** @override */
  prepareDerivedData() {
    super.prepareDerivedData();
    if (this.type !== "character") return;
    this._computeReputation();
    this._applyMasteryBonuses();
    this._computeArmorTN();
  }

  /**
   * TN d'Armure = 5 + (Réflexes x 5) + bonus de l'armure équipée + bonus
   * "autre" édité à la main. Nécessite l'Item Armure équipé, donc vit ici
   * plutôt que dans CharacterDataModel (même raison que _computeReputation).
   * Résultat stocké dans system.armorTn.{base,reflexesBonus,armorBonus,total}
   * (propriétés dérivées, pas dans le schema - même convention que
   * system.wounds.rankIndex etc.).
   */
  _computeArmorTN() {
    const s = this.system;
    const equippedArmor = this.items.find((i) => i.type === "armor" && i.system.equipped);

    s.armorTn.base = 5;
    s.armorTn.reflexesBonus = s.traits.ref * 5;
    s.armorTn.armorBonus = equippedArmor?.system.tnBonus ?? 0;
    s.armorTn.total = s.armorTn.base + s.armorTn.reflexesBonus + s.armorTn.armorBonus + s.armorTn.otherBonus;
  }

  /**
   * Réputation = (somme des rangs des 5 Anneaux) * 10 + somme des rangs de
   * toutes les Compétences. Le rang de maîtrise en découle (voir
   * rules/reputation.mjs). Entièrement calculé, jamais édité à la main -
   * nécessite l'accès aux Items, donc vit ici plutôt que dans le Data Model
   * (voir TUTORIEL-fiche-personnage.md sur la répartition Data Model / Actor).
   */
  _computeReputation() {
    const s = this.system;
    const ringSum = s.rings.air.rank + s.rings.earth.rank + s.rings.fire.rank + s.rings.water.rank + s.rings.void.rank;
    const skillSum = this.items
      .filter((i) => i.type === "skill")
      .reduce((sum, i) => sum + i.system.rank, 0);

    s.reputation.points = ringSum * 10 + skillSum;
    s.reputation.rank = computeReputationRank(s.reputation.points);
  }

  /**
   * Applique automatiquement les bonus de maîtrise des Compétences dont le
   * rang atteint le seuil requis (ex: Courtisan rang 3 -> +3 Réputation) et
   * construit la liste des capacités de maîtrise actuellement actives
   * (system.activeBuffs, propriété dérivée consommée par la fiche pour le
   * panneau "Capacités de Maîtrise actives" - voir tab-combat.hbs).
   * Chaque Compétence déclare ses propres bonus dans system.masteryBonuses
   * (voir default-skills.mjs) ; seuls ceux avec un `path` renseigné modifient
   * réellement un stat, les autres restent purement informatifs pour l'instant
   * (bonus contextuels à un jet/une Action qui n'a pas encore d'implémentation
   * mécanique - dégâts d'arme, postures, etc.).
   */
  _applyMasteryBonuses() {
    const buffs = [];

    for (const item of this.items) {
      if (item.type !== "skill") continue;

      for (const bonus of item.system.masteryBonuses ?? []) {
        if (item.system.rank < bonus.rankRequired) continue;

        if (bonus.path) {
          const current = foundry.utils.getProperty(this.system, bonus.path) ?? 0;
          foundry.utils.setProperty(this.system, bonus.path, current + bonus.value);
        }

        buffs.push({
          skillName: item.name,
          rankRequired: bonus.rankRequired,
          description: bonus.description,
          isAutomatic: Boolean(bonus.path)
        });
      }
    }

    this.system.activeBuffs = buffs;
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
