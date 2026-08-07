import { basicRoll, performRoll } from "../../dice/_module.mjs";
import { ACTION_COST, drawActionCost, escalateActionCost, MELEE_RANGE_M } from "../../rules/actions.mjs";
import { isActionEconomyEnforced } from "../../settings.mjs";
import { findSkillByName } from "../../rules/skills.mjs";

/**
 * Tour par tour de SystemActor : posture, Garde, Empoignade (état
 * partagé, voir grapple-mixin.mjs pour les actions elles-mêmes),
 * dégainer/rengainer, budget d'Action. Voir
 * module/documents/actor-document.mjs pour la composition des mixins.
 * @param {typeof Actor} Base
 */
export const CombatMixin = (Base) =>
  class extends Base {
    /**
     * true si l'acteur est actuellement engagé dans le combat en cours
     * (a un Combatant dans game.combat) - conditionne la possibilité de
     * changer de posture (voir #setStance, #rollFullDefense) : les postures
     * n'ont de sens que pendant la Phase de Réaction d'un round de combat.
     * @type {boolean}
     */
    get isInCombat() {
      return Boolean(game.combat?.combatants.some((c) => c.actor?.id === this.id));
    }

    /**
     * true si c'est actuellement le tour de CET acteur dans le combat en
     * cours (voir #_ensureCanRoll, #spendActionPoints) - `game.combat.combatant`
     * est le Combattant actif selon `combat.turn`, fourni nativement par
     * Foundry (pas de logique à dupliquer ici).
     * @type {boolean}
     */
    get isCurrentTurn() {
      return Boolean(game.combat?.started && game.combat.combatant?.actor?.id === this.id);
    }

    /**
     * true si la posture actuelle a déjà été déclarée pour le round de combat
     * en cours (system.combat.stanceRound === game.combat.round) - une fois
     * déclarée, elle est verrouillée jusqu'à la prochaine Phase de Réaction
     * (round suivant), pas question d'en changer en cours de round. false hors
     * combat (aucune posture "de round" à verrouiller dans ce cas).
     * @type {boolean}
     */
    get isStanceLocked() {
      return this.isInCombat && this.system.combat.stanceRound === (game.combat?.round ?? 0);
    }

    /**
     * Change de posture. Quitter la Pleine Défense remet son bonus de TN
     * d'Armure temporaire à 0 (voir #rollFullDefense) - les autres postures
     * n'ont pas d'état à nettoyer. Bloqué hors combat (voir #isInCombat) et une
     * fois déjà déclarée pour ce round (voir #isStanceLocked) - la fiche
     * désactive déjà les boutons dans ces deux cas, ceci est la protection
     * "réelle" côté document, même logique que les champs GM-only (voir
     * #_preUpdate).
     *
     * Effets Conditionnels (voir module/rules/conditions.mjs) : Sonné ->
     * seules Défense/Esquive restent autorisées ; Monté/Position Haute ou
     * Fatigué -> Assaut interdit. Engagé dans une Empoignade (voir
     * #initiateGrapple) -> aucun changement de Posture possible du tout,
     * verrouillée sur Attaque tant que dure la lutte.
     * @param {string} stance  Une valeur de STANCE_CHOICES.
     */
    async setStance(stance) {
      if (!this.isInCombat) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotInCombat", { name: this.name }));
        return;
      }
      if (this.isStanceLocked) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.StanceAlreadyDeclared", { name: this.name }));
        return;
      }
      if (this.system.combat.grappleGroupId) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.CannotChangeStanceGrappled", { name: this.name }));
        return;
      }
      if (this.statuses?.has("dazed") && stance !== "defense" && stance !== "fullDefense") {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.DazedStanceRestricted", { name: this.name }));
        return;
      }
      if (stance === "fullAttack" && (this.statuses?.has("mountedHigher") || this.statuses?.has("fatigued"))) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.CannotUseFullAttack", { name: this.name }));
        return;
      }

      const updates = { "system.combat.stance": stance, "system.combat.stanceRound": game.combat?.round ?? 0 };
      if (this.system.combat.stance === "fullDefense" && stance !== "fullDefense") {
        updates["system.combat.fullDefenseBonus"] = 0;
      }
      await this.update(updates);
      ui.combat?.render();
    }

    /**
     * Manœuvre Garde (voir module/rules/maneuvers.mjs) : protège un allié
     * plutôt que d'attaquer - aucun jet, coûte une Action Simple (voir
     * #spendActionPoints), impossible en Posture Assaut, nécessite d'être à
     * 1,5 m ou moins de la cible protégée AU MOMENT de la déclaration (la
     * proximité n'est pas re-vérifiée en continu ensuite - simplification
     * assumée, pas de suivi automatique si l'un des deux se déplace après
     * coup). Effet jusqu'au prochain tour de CE personnage (voir
     * module/hooks/combat-turn-reset.mjs) : -5 au TN d'Armure de ce
     * personnage, +10 à celui de la cible protégée (voir #_computeArmorTN).
     * @param {string} targetActorId  L'Acteur protégé (PAS une cible à attaquer).
     * @returns {Promise<boolean>}
     */
    async declareGuard(targetActorId) {
      if (!this.isInCombat) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotInCombat", { name: this.name }));
        return false;
      }
      if (this.system.combat.stance === "fullAttack") {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.CannotGuardInAssault", { name: this.name }));
        return false;
      }

      const targetActor = this.constructor._resolveActor(targetActorId);
      if (!targetActor) return false;

      const distance = this._distanceToActor(targetActor);
      if (distance === null || distance > MELEE_RANGE_M) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.TooFarToGuard", { name: this.name }));
        return false;
      }

      const result = await this.spendActionPoints(ACTION_COST.SIMPLE);
      if (!result.ok) return false;

      await this.update({
        "system.combat.guardTargetActorId": targetActorId,
        "system.combat.guardRound": game.combat.round
      });
      return true;
    }

    /**
     * Distance en mètres entre les tokens de CET Acteur et d'un autre sur la
     * scène active (voir #declareGuard) - null si l'un des deux n'a pas de
     * token placé sur la scène courante, ou si la grille de la scène est
     * invalide. Même conversion pixels -> mètres que module/hooks/token-movement-tracking.mjs.
     * @param {Actor} otherActor
     * @returns {number|null}
     */
    _distanceToActor(otherActor) {
      const myToken = canvas.tokens?.placeables.find((t) => t.actor?.id === this.id);
      const otherToken = canvas.tokens?.placeables.find((t) => t.actor?.id === otherActor.id);
      if (!myToken || !otherToken) return null;

      const grid = canvas.scene?.grid;
      if (!grid?.size) return null;

      const pixelDistance = Math.hypot(otherToken.x - myToken.x, otherToken.y - myToken.y);
      return (pixelDistance / grid.size) * grid.distance;
    }

    /**
     * Se relève de la condition Au Sol (voir module/rules/conditions.mjs) -
     * "il faut une Action Simple pour se relever de la position au sol".
     * @returns {Promise<boolean>}
     */
    async standUp() {
      if (!this.statuses?.has("prone")) return true;

      const result = await this.spendActionPoints(ACTION_COST.SIMPLE);
      if (!result.ok) return false;

      await this.toggleStatusEffect("prone", { active: false });
      return true;
    }

    /**
     * Applique des dégâts au suivi de Blessures : soustrait la Réduction de
     * l'Armure équipée (voir #_computeArmorTN, system.armorTn.reduction) du
     * montant brut avant de l'ajouter à system.wounds.value (jamais en
     * dessous de 0 - un montant déjà inférieur à la Réduction n'inflige
     * rien). Toujours exécuté côté MJ (voir module/chat/damage-application-actions.mjs,
     * qui n'accorde ce clic qu'au MJ ou après validation explicite de sa
     * part) - un joueur ne peut que demander l'application, jamais
     * l'appliquer lui-même directement. Pas de plafond à `wounds.max` -
     * le rang de Blessure ("Mort" au-delà) est recalculé à chaque
     * `prepareDerivedData` (voir DerivedDataMixin, rules/wound-track.mjs).
     * @param {number} rawAmount  Dégâts bruts du jet, AVANT Réduction.
     * @returns {Promise<number>} le montant RÉELLEMENT appliqué (après Réduction).
     */
    async applyDamage(rawAmount) {
      const reduction = this.system.armorTn?.reduction ?? 0;
      const applied = Math.max(0, rawAmount - reduction);
      if (applied > 0) {
        await this.update({ "system.wounds.value": this.system.wounds.value + applied });
      }
      return applied;
    }

    /**
     * Tente de se libérer de la condition Entravé (voir module/rules/conditions.mjs) -
     * jet de Force contre un ND fixé par le MJ (`tn`, sa nature dépend de ce
     * qui entrave - pas modélisé ici), ou contesté si `opposingActor` est
     * fourni (quelqu'un maintient activement l'entrave). Retire le statut en
     * cas de réussite.
     * @param {number} tn  ND fixé par le MJ (ignoré si `opposingActor` fourni).
     * @param {Actor|null} [opposingActor]
     * @returns {Promise<boolean>} true si libéré.
     */
    async breakFree(tn, opposingActor = null) {
      const config = basicRoll({ rank: this.system.traits.str });
      const flavor = game.i18n.localize("L5R4EC.Condition.Entangled");
      const roll = await performRoll(this, config, flavor);

      let success;
      if (opposingActor) {
        const contest = await this._resolveContestedForce(opposingActor);
        success = contest.attackerWins;
      } else {
        success = roll.keptTotal >= tn;
      }

      if (success) await this.toggleStatusEffect("entangled", { active: false });
      return success;
    }

    /**
     * "Foncer" : dépense une Action Simple pour regagner un budget complet de
     * `moveBudget.simple` mètres de déplacement supplémentaires ce tour (voir
     * module/rules/actions.mjs#effectiveMoveBudget, module/hooks/
     * token-movement-tracking.mjs qui applique réellement le blocage).
     * Répétable tant qu'il reste des points d'Action à dépenser - "tant qu'on
     * a encore une Action Simple on peut l'utiliser pour gagner des mètres",
     * pas un interrupteur à usage unique (system.combat.moveActionsSpent
     * compte le nombre de fois, remis à 0 au tour suivant, voir
     * module/hooks/combat-turn-reset.mjs).
     * @returns {Promise<boolean>} true si la dépense a réussi.
     */
    async spendMoveAction() {
      const result = await this.spendActionPoints(ACTION_COST.SIMPLE);
      if (!result.ok) return false;
      await this.update({ "system.combat.moveActionsSpent": this.system.combat.moveActionsSpent + 1 });
      return true;
    }

    /**
     * Dégaine une Arme dans une main donnée : si déjà en main (`hand` !==
     * "none"), ne fait rien. Bloque si la main visée est déjà occupée par une
     * AUTRE Arme déjà en main, ou si une Arme à deux mains ("both") est déjà
     * en main (occupe les deux) - dégainer "both" exige à l'inverse les deux
     * mains entièrement libres. Sinon, détermine le coût (Gratuit si la
     * Compétence associée a une entrée de maîtrise "freeDraw" au rang atteint,
     * sinon selon `size` - voir module/rules/actions.mjs #drawActionCost),
     * tente de le dépenser via #spendActionPoints, et ne marque l'Arme en main
     * que si la dépense a réussi (ou n'était pas nécessaire - hors combat/
     * réglage désactivé).
     * @param {string} weaponId
     * @param {"left"|"right"|"both"} [hand]  Main choisie - par défaut la main
     *   directrice du personnage (voir system.combat.dominantHand), utilisé
     *   quand #rollAttack dégaine automatiquement sans choix explicite du joueur.
     * @returns {Promise<boolean>} true si l'Arme est (ou était déjà) en main.
     */
    async drawWeapon(weaponId, hand = null) {
      const weapon = this.items.get(weaponId);
      if (!weapon || weapon.type !== "weapon") return false;
      if (weapon.system.hand !== "none") return true;

      // Occupation des mains : une main déjà occupée (par une autre Arme, ou
      // par une Arme à deux mains qui occupe les deux) ne peut pas recevoir
      // une deuxième Arme - il faut d'abord la ranger (voir #sheatheWeapon).
      // "both" exige les DEUX mains entièrement libres.
      const targetHand = hand ?? this.system.combat.dominantHand;
      const otherDrawnWeapons = this.items.filter((i) => i.type === "weapon" && i.id !== weaponId && i.system.hand !== "none");
      const handBusy = targetHand === "both"
        ? otherDrawnWeapons.length > 0
        : otherDrawnWeapons.some((w) => w.system.hand === targetHand || w.system.hand === "both");
      if (handBusy) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.HandAlreadyOccupied", { name: this.name }));
        return false;
      }

      const skillItem = findSkillByName(this, weapon.system.associatedSkill);
      const hasFreeDraw = (skillItem?.system.masteryBonuses ?? []).some(
        (b) => b.trigger === "freeDraw" && skillItem.system.rank >= b.rankRequired
      );
      const baseCost = hasFreeDraw ? ACTION_COST.FREE : drawActionCost(weapon.system.size);

      const result = await this.spendActionPoints(baseCost);
      if (!result.ok) return false;

      await weapon.update({ "system.hand": targetHand });
      return true;
    }

    /**
     * Range une Arme (remet `hand` à "none") - pas de coût d'Action (rangement
     * jugé assez trivial pour ne pas être encadré, contrairement à dégainer).
     * @param {string} weaponId
     */
    async sheatheWeapon(weaponId) {
      const weapon = this.items.get(weaponId);
      if (!weapon || weapon.type !== "weapon") return;
      await weapon.update({ "system.hand": "none" });
    }

    /**
     * Dépense le budget d'Action nécessaire pour une Action de coût `baseCost`
     * (voir module/rules/actions.mjs - ACTION_COST) - utilisé directement par
     * #rollSkill/#rollSpell/#rollAttack (toujours ACTION_COST.COMPLEX, voir
     * l'Économie d'Action demandée) et par #drawWeapon (Libre ou Simple selon
     * l'Arme). Hors combat, ou réglage désactivé : toujours autorisé, budget
     * non touché - l'Économie d'Action n'a de sens qu'en combat actif.
     *
     * Applique l'escalade de coût liée aux rangs de Blessure (voir
     * module/rules/actions.mjs#escalateActionCost) : "Impotent" (crippled)
     * monte le coût d'un cran, "Épuisé" (down) restreint aux seules Actions
     * Libres ET exige de dépenser un Point de Vide même pour celles-ci (voir
     * #spendVoidPoint), "Hors de Combat"/"Mort" (isOut/isDead) bloque tout.
     * Entravé/Étourdi (voir module/rules/conditions.mjs) bloquent aussi tout -
     * "peut rien faire d'autre que tenter de se libérer"/"ne peut prendre
     * aucune Action" - même traitement que isOut/isDead, SANS dérogation
     * possible (contrairement à la victime d'Empoignade ci-dessous).
     *
     * Une VICTIME d'Empoignade (engagée mais sans le contrôle, voir
     * #_resolveGrappleControl) ne peut normalement rien faire tant qu'elle ne
     * l'a pas repris au début de son tour - MAIS le MJ peut accorder une
     * dérogation ponctuelle (ex: le joueur veut quand même tenter de lancer un
     * sort pour se libérer autrement) : même mécanisme que #_ensureCanRoll
     * (flag `turnOverrideUntil`, demande postée via #requestTurnOverride avec
     * un motif dédié) plutôt qu'un blocage définitif comme pour Entravé/Étourdi.
     * @param {number} baseCost  Une valeur de ACTION_COST (coût de base, avant escalade).
     * @returns {Promise<{ok: boolean, reason?: string}>}
     */
    async spendActionPoints(baseCost) {
      if (!isActionEconomyEnforced()) return { ok: true };
      if (!this.isInCombat || !this.isCurrentTurn) return { ok: true };

      if (this.system.wounds.isOut || this.system.wounds.isDead || this.statuses?.has("entangled") || this.statuses?.has("stunned")) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.CannotActWoundRank", { name: this.name }));
        return { ok: false, reason: "cannotAct" };
      }

      const isGrappleVictim = this.system.combat.grappleGroupId && !this.system.combat.grappleControl;
      if (isGrappleVictim) {
        const overrideUntil = this.getFlag("l5r4ec", "turnOverrideUntil");
        if (overrideUntil && Date.now() < overrideUntil) {
          await this.unsetFlag("l5r4ec", "turnOverrideUntil");
          // Dérogation consommée : on continue normalement ci-dessous, comme
          // si la victime avait le contrôle pour cette seule Action.
        } else {
          ui.notifications.warn(game.i18n.format("L5R4EC.Notif.GrappleVictimCannotAct", { name: this.name }));
          await this.requestTurnOverride("L5R4EC.Chat.GrappleRequestBody");
          return { ok: false, reason: "grappleVictim" };
        }
      }

      const rankKey = this.system.wounds.rankKey;
      const cost = escalateActionCost(baseCost, rankKey);

      if (rankKey === "down") {
        if (cost !== ACTION_COST.FREE) {
          ui.notifications.warn(game.i18n.format("L5R4EC.Notif.ExhaustedCannotAct", { name: this.name }));
          return { ok: false, reason: "exhausted" };
        }
        const spent = await this.spendVoidPoint();
        if (!spent) {
          ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoVoidPoints", { name: this.name }));
          return { ok: false, reason: "exhaustedNoVoid" };
        }
        return { ok: true };
      }

      if (cost === ACTION_COST.FREE) return { ok: true };

      if (this.system.combat.actionPoints < cost) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoActionPoints", { name: this.name }));
        return { ok: false, reason: "noActionPoints" };
      }

      await this.update({ "system.combat.actionPoints": this.system.combat.actionPoints - cost });
      return { ok: true };
    }
  };
