import { skillRoll, performRoll, L5RRollKeep } from "../../dice/_module.mjs";
import { ACTION_COST, MELEE_RANGE_M } from "../../rules/actions.mjs";
import { resolveWeaponSkill } from "../../rules/skills.mjs";

/**
 * Empoignade (Grapple) de SystemActor : initier, contrôler, agir
 * (Hit/Throw/Break/Pass), et les deux helpers statiques de résolution
 * d'Acteur conscients des Tokens non liés (voir #_resolveActor). Voir
 * module/documents/actor-document.mjs pour la composition des mixins.
 * @param {typeof Actor} Base
 */
export const GrappleMixin = (Base) =>
  class extends Base {
    /**
     * Initie une Empoignade (Grapple, voir la règle "Grappling" du LdB) : jet
     * d'Attaque Jiujutsu/Agilité (ou de la Compétence d'Arme associée si
     * `weaponId` désigne une arme à chaîne/d'hast adaptée - "Peut être
     * utilisée pour initier et maintenir une Empoignade", voir specialRules de
     * l'Arme dans default-weapons.mjs, pas vérifié automatiquement ici), qui
     * ignore le bonus au TN d'Armure de la cible (l'armure ne protège pas
     * contre une prise de lutte). Action Complexe, sauf Capacité de Maîtrise
     * qui la rendrait Simple/Gratuite (aucune classifiée pour l'instant). Si
     * le jet touche, les DEUX participants sont marqués "grappled" (voir
     * module/rules/conditions.mjs) et rejoignent le même groupe d'Empoignade
     * (system.combat.grappleGroupId = l'id de CET Acteur) - le lanceur
     * démarre avec le contrôle (voir #grappleAction, #_resolveGrappleControl).
     * @param {string} targetActorId
     * @param {{weaponId?: string|null}} [options]
     * @returns {Promise<Roll|null>}
     */
    async initiateGrapple(targetActorId, { weaponId = null } = {}) {
      const targetActor = this.constructor._resolveActor(targetActorId);
      if (!targetActor) return null;
      if (!(await this._ensureCanRoll())) return null;

      // Portée de corps-à-corps uniquement (voir module/rules/actions.mjs#MELEE_RANGE_M,
      // même limite que SystemActor#declareGuard/#rollAttack en mêlée).
      // `distance === null` (token manquant pour l'un des deux) ne bloque
      // PAS, même logique que #rollAttack.
      const distance = this._distanceToActor(targetActor);
      if (distance !== null && distance > MELEE_RANGE_M) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.TargetOutOfRange", { name: this.name, max: MELEE_RANGE_M }));
        return null;
      }

      if (!(await this.spendActionPoints(ACTION_COST.COMPLEX)).ok) return null;

      const weapon = weaponId ? this.items.get(weaponId) : null;
      const skillItem = resolveWeaponSkill(this, weapon);

      const config = skillRoll({ traitRank: this.system.traits.agi, skillRank: skillItem?.system.rank ?? 0 });
      this._applyConditionRollPenalty(config, { isMeleeAttack: true });
      const flavor = `${game.i18n.localize("L5R4EC.Maneuver.Grapple")} : ${this.name} → ${targetActor.name}`;

      // "Cette attaque ignore le bénéfice de l'armure sur le TN d'Armure" - le
      // bonus d'armure est retiré, le reste (base/Réflexes/posture/Garde) reste.
      const targetTnNoArmor = targetActor.system.armorTn.total - targetActor.system.armorTn.armorBonus;

      return performRoll(this, config, flavor, async (roll) => {
        const success = roll.keptTotal >= targetTnNoArmor;
        const extra = { targetTN: targetTnNoArmor, success, targetName: targetActor.name };

        if (success) {
          const groupId = this.id;
          // Les Postures normales (Défense/Assaut/Esquive/Centre) n'ont pas de
          // sens en pleine lutte - le TN d'Armure d'un participant est de toute
          // façon remplacé par celui du statut "grappled" (voir
          // module/rules/conditions.mjs, #_computeArmorTN). Verrouillée sur
          // Attaque tant que dure l'Empoignade (voir #setStance/#rollFullDefense,
          // qui refusent tout changement pendant ce temps) - la Phase de
          // Réaction ne redemande d'ailleurs plus de Posture pour un
          // participant (voir module/hooks/reaction-phase.mjs).
          // `stanceRound` mis à jour aussi (pas seulement `stance`) - sinon le
          // badge du Combat Tracker affiche le sablier "Phase de Réaction pas
          // encore répondue" au lieu de l'icône d'Attaque (voir
          // module/hooks/combat-tracker-stances.mjs, qui compare stanceRound
          // au round en cours pour savoir laquelle des deux afficher).
          const stanceRound = game.combat?.round ?? 0;
          await this.update({
            "system.combat.grappleGroupId": groupId,
            "system.combat.grappleControl": true,
            "system.combat.grappleWeaponId": weaponId ?? "",
            "system.combat.stance": "attack",
            "system.combat.stanceRound": stanceRound
          });
          await targetActor.update({
            "system.combat.grappleGroupId": groupId,
            "system.combat.grappleControl": false,
            "system.combat.grappleWeaponId": weaponId ?? "",
            "system.combat.stance": "attack",
            "system.combat.stanceRound": stanceRound
          });
          await this.toggleStatusEffect("grappled", { active: true });
          await targetActor.toggleStatusEffect("grappled", { active: true });
        }

        return extra;
      });
    }

    /**
     * Résout un Acteur par id en préférant l'instance SYNTHÉTIQUE liée à un
     * Combattant du combat en cours (voir Combatant#actor) plutôt que
     * l'Acteur "monde" brut de `game.actors.get`. Pour un Token NON lié
     * (cas courant d'un PNJ comme "The Thorn", qui peut apparaître
     * indépendamment plusieurs fois sur la table), `actor.update()` appelé
     * sur l'instance liée au Token écrit dans la delta du Token
     * (TokenDocument#delta), PAS dans l'Acteur monde - `game.actors.get(id)`
     * continuerait alors indéfiniment à renvoyer les données de base jamais
     * mises à jour (grappleGroupId vide, etc.). Repli sur `game.actors.get`
     * si l'id ne correspond à aucun combattant actif (hors combat, ou Acteur
     * lié classique).
     * @param {string} id
     * @returns {Actor|undefined}
     */
    static _resolveActor(id) {
      const fromCombat = game.combat?.combatants.find((c) => c.actor?.id === id)?.actor;
      return fromCombat ?? game.actors.get(id);
    }

    /**
     * Tous les Acteurs connus, en préférant - pour chaque id - l'instance
     * SYNTHÉTIQUE d'un Combattant du combat en cours à l'Acteur monde brut
     * (voir #_resolveActor pour le pourquoi). Utilisé partout où il faut
     * balayer TOUS les Acteurs à la recherche de participants à une
     * Empoignade (voir #_grappleParticipants, #_cleanupSoloGrapple).
     * @returns {Actor[]}
     */
    static _allKnownActors() {
      const byId = new Map(game.actors.map((a) => [a.id, a]));
      for (const c of game.combat?.combatants ?? []) {
        if (c.actor) byId.set(c.actor.id, c.actor);
      }
      return [...byId.values()];
    }

    /**
     * Tous les Acteurs actuellement engagés dans LA MÊME Empoignade que
     * celui-ci (même system.combat.grappleGroupId, non vide) - voir
     * #_resolveGrappleControl, #grappleAction.
     * @returns {Actor[]}
     */
    _grappleParticipants() {
      if (!this.system.combat.grappleGroupId) return [];
      return this.constructor._allKnownActors().filter((a) => a.system.combat?.grappleGroupId === this.system.combat.grappleGroupId);
    }

    /**
     * Jet de contrôle d'Empoignade (Jiujutsu/Force, ou Compétence d'Arme si
     * `grappleWeaponId` renseigné) - silencieux, aucune carte de chat
     * individuelle (voir #_resolveGrappleControl, qui poste un seul résumé
     * pour les deux jets).
     * @returns {Promise<number>} keptTotal du jet.
     */
    async _grappleControlRoll() {
      const weapon = this.system.combat.grappleWeaponId ? this.items.get(this.system.combat.grappleWeaponId) : null;
      const skillItem = resolveWeaponSkill(this, weapon);
      const config = L5RRollKeep.build(skillRoll({ traitRank: this.system.traits.str, skillRank: skillItem?.system.rank ?? 0 }));
      await config.evaluate();
      return config.keptTotal;
    }

    /**
     * Redétermine le contrôle de l'Empoignade au début du tour de CE
     * participant (voir module/hooks/combat-turn-reset.mjs, "A grappled
     * character must try to control the grapple at the beginning of his
     * Turn") :
     * - S'il a DÉJÀ le contrôle, rien à faire - pas besoin de relancer, il
     *   peut simplement agir (voir #grappleAction).
     * - Sinon (victime), il tente de le reprendre : jet de contrôle (voir
     *   #_grappleControlRoll) opposé à CELUI QUI CONTRÔLE actuellement
     *   uniquement (pas à tous les participants à la fois - simplification
     *   assumée du texte RAW, pensé pour un groupe, au cas 1 contre 1 le plus
     *   courant). Victoire -> le contrôle change de main. Défaite -> reste
     *   bloqué ce tour (voir #spendActionPoints, qui bloque toute Action pour
     *   une victime sans contrôle). Un résumé est posté au chat.
     */
    async _resolveGrappleControl() {
      console.log(`L5R4EC | _resolveGrappleControl appelé pour ${this.name} (client: ${game.user.name}, GM: ${game.user.isGM})`);

      if (!this.system.combat.grappleGroupId || this.system.combat.grappleControl) {
        console.log(`L5R4EC | ${this.name} : rien à faire (grappleGroupId=${this.system.combat.grappleGroupId}, grappleControl=${this.system.combat.grappleControl})`);
        return;
      }

      const controller = this._grappleParticipants().find((a) => a.system.combat.grappleControl);
      if (!controller || controller.id === this.id) {
        console.warn(`L5R4EC | ${this.name} : aucun contrôleur trouvé parmi les participants (${this._grappleParticipants().map((a) => a.name).join(", ") || "aucun"}) - vérifie que le client courant peut lire les Acteurs des deux participants (game.actors).`);
        return;
      }

      // Écrire sur l'Acteur du contrôleur (controller.update) exige la
      // permission Propriétaire dessus - un joueur qui ne possède QUE sa
      // propre victime (ex: le contrôleur est un PJ/PNJ du MJ) ne peut pas
      // résoudre ce jet depuis son propre client. Le MJ (permissions
      // toujours complètes) doit s'en charger - voir le bouton de secours
      // dans tab-combat.hbs, à cliquer depuis le client MJ dans ce cas.
      if (!game.user.isGM && !controller.isOwner) {
        console.warn(`L5R4EC | ${this.name} : permission insuffisante sur ${controller.name} depuis le client de ${game.user.name} - le MJ doit résoudre ce jet.`);
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.GrappleControlNeedsGM", { name: this.name, controller: controller.name }));
        return;
      }

      const challengerTotal = await this._grappleControlRoll();
      const defenderTotal = await controller._grappleControlRoll();
      const challengerWins = challengerTotal > defenderTotal;
      console.log(`L5R4EC | Contrôle d'Empoignade : ${this.name} ${challengerTotal} vs ${controller.name} ${defenderTotal} -> ${challengerWins ? this.name : controller.name}`);

      if (challengerWins) {
        await controller.update({ "system.combat.grappleControl": false });
        await this.update({ "system.combat.grappleControl": true });
      }

      const resultKey = challengerWins ? "L5R4EC.Chat.GrappleControlSeized" : "L5R4EC.Chat.GrappleControlKept";
      const resultText = game.i18n.format(resultKey, { challenger: this.name, controller: controller.name });
      const content = await foundry.applications.handlebars.renderTemplate(
        "systems/l5r4ec/templates/chat/grapple-control-card.hbs",
        { challengerName: this.name, challengerTotal, controllerName: controller.name, controllerTotal: defenderTotal, resultText }
      );
      await ChatMessage.create({ content, speaker: ChatMessage.getSpeaker({ actor: this }) });
    }

    /**
     * Action d'Empoignade pour le personnage qui a actuellement le contrôle
     * (voir #_resolveGrappleControl) - "Hit"/"Throw"/"Break"/"Pass" sont
     * TOUTES réservées au contrôleur ("A character who has control of a
     * grapple may do one of the following things on his Turn") : une victime
     * sans contrôle ne peut littéralement rien faire tant qu'elle n'a pas
     * repris le contrôle (voir #_resolveGrappleControl, #spendActionPoints).
     * Si un participant quitte et qu'il n'en reste qu'un seul, l'Empoignade se
     * termine entièrement pour lui aussi (une lutte seule n'a pas de sens).
     * @param {"hit"|"throw"|"break"|"pass"} action
     * @param {{targetActorId?: string|null}} [options]
     * @returns {Promise<boolean>}
     */
    async grappleAction(action, { targetActorId = null } = {}) {
      if (!this.system.combat.grappleGroupId) return false;

      if (!this.system.combat.grappleControl) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoGrappleControl", { name: this.name }));
        return false;
      }

      if (action === "pass") return true;

      if (action === "break") {
        const result = await this.spendActionPoints(ACTION_COST.SIMPLE);
        if (!result.ok) return false;
        const groupId = this.system.combat.grappleGroupId;
        await this._leaveGrapple();
        await this.constructor._cleanupSoloGrapple(groupId);
        return true;
      }

      const targetActor = this.constructor._resolveActor(targetActorId);
      if (!targetActor || targetActor.system.combat.grappleGroupId !== this.system.combat.grappleGroupId) return false;

      const result = await this.spendActionPoints(ACTION_COST.COMPLEX);
      if (!result.ok) return false;

      if (action === "hit") {
        const weapon = this.system.combat.grappleWeaponId ? this.items.get(this.system.combat.grappleWeaponId) : null;
        const skillItem = resolveWeaponSkill(this, weapon);
        const damageBonus = this._sumMasteryBonus(skillItem, "damageRoll");

        // DR de base : celui de l'Arme si lutte à l'arme, sinon 1k1 à mains
        // nues (valeur de base non précisée par le LdB pour ce système -
        // hypothèse assumée, à corriger si besoin) + Force, comme un jet de
        // dégâts de mêlée classique.
        const baseRolled = weapon ? weapon.system.damageRolled : 1;
        const baseKept = weapon ? weapon.system.damageKept : 1;

        await this.rollDamage(game.i18n.localize("L5R4EC.Maneuver.Grapple"), {
          rolled: baseRolled + this.system.traits.str + damageBonus.rollBonus,
          kept: baseKept + damageBonus.keepBonus,
          explodeOn: damageBonus.explodeOn,
          targetActorId: targetActor.id
        });
        return true;
      }

      if (action === "throw") {
        const groupId = this.system.combat.grappleGroupId;
        await targetActor.toggleStatusEffect("prone", { active: true });
        await targetActor._leaveGrapple();
        await this.constructor._cleanupSoloGrapple(groupId);
        return true;
      }

      return false;
    }

    /** Retire CET Acteur de son Empoignade actuelle (voir #grappleAction). */
    async _leaveGrapple() {
      await this.update({
        "system.combat.grappleGroupId": "",
        "system.combat.grappleControl": false,
        "system.combat.grappleWeaponId": ""
      });
      await this.toggleStatusEffect("grappled", { active: false });
    }

    /**
     * S'il ne reste qu'UN SEUL participant dans le groupe d'Empoignade
     * `groupId` (l'autre vient de Rompre ou d'être Jeté), termine l'Empoignade
     * pour ce dernier aussi - une lutte à un seul participant n'a pas de sens.
     * @param {string} groupId
     */
    static async _cleanupSoloGrapple(groupId) {
      if (!groupId) return;
      const remaining = this._allKnownActors().filter((a) => a.system.combat?.grappleGroupId === groupId);
      if (remaining.length === 1) await remaining[0]._leaveGrapple();
    }
  };
