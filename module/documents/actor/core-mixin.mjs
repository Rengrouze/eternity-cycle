import {
  BLINDED_PENALTY,
  DAZED_PENALTY,
  PRONE_ATTACK_PENALTY
} from "../../rules/conditions.mjs";
import { isActionEconomyEnforced } from "../../settings.mjs";

/**
 * Socle partagé de SystemActor : libellés Trait/Anneau, Points de Vide,
 * garde-fou de jet, malus conditionnels, emplacements de sort, demande de
 * dérogation MJ, équipement d'Armure, et la protection `_preUpdate` des
 * champs GM-only. Utilisé par presque tous les autres mixins (rolls-mixin,
 * combat-mixin, grapple-mixin) via `this`, donc appliqué en dernier dans la
 * composition (voir module/documents/actor-document.mjs).
 * @param {typeof Actor} Base
 */
export const CoreMixin = (Base) =>
  class extends Base {
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

    /**
     * Dépense 1 Point de Vide (règle générale L5R 4e : +1k1 sur le jet
     * concerné - voir #_applyVoidPointSpend, appelé depuis les modales de jet
     * qui proposent la case "Dépenser un Point de Vide"). Ne fait rien et
     * renvoie false si le personnage n'en a aucun.
     * @returns {Promise<boolean>}
     */
    async spendVoidPoint() {
      const points = this.system.rings.void.points;
      if (points < 1) return false;
      await this.update({ "system.rings.void.points": points - 1 });
      return true;
    }

    /**
     * Traduit la case "Dépenser un Point de Vide" cochée dans une modale de
     * jet en bonus +1k1 - dépense réellement le point (échoue proprement avec
     * un avertissement si le personnage n'en a plus, sans bloquer le jet).
     * @param {boolean} spendVoid
     * @returns {Promise<{rollBonus: number, keepBonus: number}>}
     */
    async _applyVoidPointSpend(spendVoid) {
      if (!spendVoid) return { rollBonus: 0, keepBonus: 0 };

      const ok = await this.spendVoidPoint();
      if (!ok) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoVoidPoints", { name: this.name }));
        return { rollBonus: 0, keepBonus: 0 };
      }
      return { rollBonus: 1, keepBonus: 1 };
    }

    /**
     * Restaure des Points de Vide (voir le bouton "Récupérer des Points de
     * Vide" d'une carte de Méditation/Cérémonie du Thé réussie - module/chat/void-recovery-actions.mjs).
     * @param {number} amount
     */
    async recoverVoidPoints(amount) {
      const points = this.system.rings.void.points;
      await this.update({ "system.rings.void.points": points + amount });
    }

    /**
     * Garde-fou "tour par tour" (voir module/rules/actions.mjs et le réglage
     * `enforceActionEconomy`) : appelé au tout début de #rollTrait/#rollRing/
     * #rollSkill/#rollSpell/#rollAttack. Un jet est autorisé si :
     * - le réglage est désactivé (le MJ arbitre tout à la main), OU
     * - le personnage n'est engagé dans AUCUN combat en cours, OU
     * - c'est le tour de CE personnage (voir #isCurrentTurn), OU
     * - le lanceur est le MJ (peut toujours faire agir un PNJ hors de son tour), OU
     * - `isReaction` est vrai (case "Jet de Réaction" cochée dans la modale de
     *   jet - honor system, même logique que les cases "Dépenser un Point de
     *   Vide"/bonus conditionnels : le joueur déclare que la situation
     *   s'applique plutôt que le système ne la vérifie).
     * Sinon, bloque le jet ET poste une demande de validation au MJ (voir
     * #requestTurnOverride, module/chat/roll-request-actions.mjs) - une
     * validation accorde une fenêtre de 60 secondes (flag `l5r4ec.turnOverrideUntil`)
     * pendant laquelle le prochain essai du joueur passera.
     * @param {{isReaction?: boolean}} [options]
     * @returns {Promise<boolean>}
     */
    async _ensureCanRoll({ isReaction = false } = {}) {
      if (!isActionEconomyEnforced()) return true;
      if (!this.isInCombat || !game.combat?.started) return true;
      if (game.user.isGM) return true;
      if (this.isCurrentTurn) return true;
      if (isReaction) return true;

      const overrideUntil = this.getFlag("l5r4ec", "turnOverrideUntil");
      if (overrideUntil && Date.now() < overrideUntil) {
        await this.unsetFlag("l5r4ec", "turnOverrideUntil");
        return true;
      }

      ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotYourTurnRequested", { name: this.name }));
      await this.requestTurnOverride();
      return false;
    }

    /**
     * Applique en place les malus de dés liés aux Effets Conditionnels actifs
     * (voir module/rules/conditions.mjs, CONFIG.statusEffects) à un `config` de
     * jet déjà construit (rolled/keep déjà calculés) - appelé juste avant
     * #performRoll par #rollTrait et consorts. Sonné (-3k0) s'applique à TOUT
     * jet ; Aveuglé ne s'applique qu'aux jets d'Attaque (-3k3 à distance,
     * -1k1 en mêlée - voir les booléens `isRangedAttack`/`isMeleeAttack`).
     * Les autres Effets Conditionnels (Fatigue/Jeûne à suivi journalier non
     * modélisé, Entravé/Étourdi qui bloquent l'action AVANT même d'arriver
     * ici - voir #spendActionPoints) n'ont pas leur place dans cette méthode.
     * @param {{rolled: number, keep: number}} config  Modifié en place.
     * @param {{isRangedAttack?: boolean, isMeleeAttack?: boolean}} [options]
     */
    _applyConditionRollPenalty(config, { isRangedAttack = false, isMeleeAttack = false } = {}) {
      if (this.statuses?.has("dazed")) {
        config.rolled = Math.max(1, config.rolled - DAZED_PENALTY.roll);
        config.keep = Math.max(1, config.keep - DAZED_PENALTY.keep);
      }
      if (isRangedAttack && this.statuses?.has("blinded")) {
        config.rolled = Math.max(1, config.rolled - BLINDED_PENALTY.ranged.roll);
        config.keep = Math.max(1, config.keep - BLINDED_PENALTY.ranged.keep);
      }
      if (isMeleeAttack && this.statuses?.has("blinded")) {
        config.rolled = Math.max(1, config.rolled - BLINDED_PENALTY.melee.roll);
        config.keep = Math.max(1, config.keep - BLINDED_PENALTY.melee.keep);
      }
      if ((isMeleeAttack || isRangedAttack) && this.statuses?.has("prone")) {
        // "Ne peut pas attaquer avec une Arme grande" (bloqué en amont dans
        // #rollAttack, pas ici - un dé qu'on refuse de lancer, pas un malus
        // au jet) ; "-2k0 avec une Arme moyenne/petite" s'applique ici.
        config.rolled = Math.max(1, config.rolled - PRONE_ATTACK_PENALTY.roll);
        config.keep = Math.max(1, config.keep - PRONE_ATTACK_PENALTY.keep);
      }
    }

    /**
     * Poste une carte de chat "X veut faire quelque chose que l'Économie
     * d'Action interdit normalement" avec des boutons Valider/Refuser réservés
     * au MJ (voir module/chat/roll-request-actions.mjs, même pattern que
     * #requestSpendMoney). Une validation accorde une fenêtre de 60 secondes
     * (flag `turnOverrideUntil`) pour retenter l'action bloquée (voir
     * #_ensureCanRoll ET #spendActionPoints - même flag réutilisé pour les
     * deux motifs de blocage, "pas ton tour" et "victime d'Empoignade sans
     * contrôle") plutôt que de rejouer automatiquement l'action d'origine -
     * plus simple, et l'animation Dice So Nice doit de toute façon se
     * déclencher sur le client du joueur, pas sur celui du MJ qui valide.
     * @param {string} [bodyKey]  Clé de traduction du motif affiché sur la carte.
     */
    async requestTurnOverride(bodyKey = "L5R4EC.Chat.RollRequestBody") {
      const content = await foundry.applications.handlebars.renderTemplate(
        "systems/l5r4ec/templates/chat/roll-request-card.hbs",
        { actorName: this.name, bodyKey, pending: true }
      );

      await ChatMessage.create({
        content,
        speaker: ChatMessage.getSpeaker({ actor: this }),
        flags: { l5r4ec: { rollRequest: { actorId: this.id, bodyKey, resolved: false } } }
      });
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
        // La monnaie ne s'édite pas directement par le joueur (seul le MJ édite
        // à la main, ou valide une demande de dépense - #spendMoney, toujours
        // exécutée côté client MJ) - SAUF le cassage de pièces (#breakKoku/
        // #breakBu), qui ne change pas la valeur totale et reste autorisé au
        // joueur : ces deux méthodes passent le flag `l5r4ecMoneyAction` pour
        // s'identifier comme un changement légitime plutôt qu'une édition libre.
        if (!options.l5r4ecMoneyAction) delete changed.system.money;
      }
    }
  };
