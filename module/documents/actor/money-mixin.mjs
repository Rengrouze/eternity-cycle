/**
 * Argent de SystemActor : cassage de pièces (autorisé au joueur) et
 * dépense/demande de dépense (réservées au MJ). Voir
 * module/documents/actor-document.mjs pour la composition des mixins.
 * @param {typeof Actor} Base
 */
export const MoneyMixin = (Base) =>
  class extends Base {
    /**
     * Casse 1 Koku en 5 Bu. Conversion à sens unique (voir CharacterDataModel
     * pour la règle) - ne fait rien si le personnage n'a pas de Koku. Ne
     * change pas la valeur totale (juste la répartition en dénominations),
     * donc autorisé pour un joueur malgré le verrou MJ sur l'argent - voir
     * l'option `l5r4ecMoneyAction` dans #_preUpdate.
     */
    async breakKoku() {
      const money = this.system.money;
      if (money.koku < 1) return;
      await this.update(
        { "system.money.koku": money.koku - 1, "system.money.bu": money.bu + 5 },
        { l5r4ecMoneyAction: true }
      );
    }

    /**
     * Casse 1 Bu en 10 Zeni. Conversion à sens unique - ne fait rien si le
     * personnage n'a pas de Bu. Autorisé pour un joueur, même raison que
     * #breakKoku.
     */
    async breakBu() {
      const money = this.system.money;
      if (money.bu < 1) return;
      await this.update(
        { "system.money.bu": money.bu - 1, "system.money.zeni": money.zeni + 10 },
        { l5r4ecMoneyAction: true }
      );
    }

    /**
     * Déduit directement de l'argent dépensé (chaque dénomination séparément,
     * pas de conversion automatique) - réservé au MJ : appelé soit directement
     * depuis le bouton "Dépenser" du MJ, soit depuis le clic "Valider" d'une
     * demande de dépense d'un joueur (voir #requestSpendMoney et
     * module/chat/money-request-actions.mjs), toujours exécuté côté client MJ.
     * @param {{koku?: number, bu?: number, zeni?: number}} amount
     * @returns {Promise<boolean>} false si l'une des 3 dénominations est insuffisante (rien n'est déduit).
     */
    async spendMoney({ koku = 0, bu = 0, zeni = 0 } = {}) {
      const money = this.system.money;
      if (money.koku < koku || money.bu < bu || money.zeni < zeni) return false;

      await this.update({
        "system.money.koku": money.koku - koku,
        "system.money.bu": money.bu - bu,
        "system.money.zeni": money.zeni - zeni
      });
      return true;
    }

    /**
     * Poste une demande de dépense au chat (le joueur ne peut pas dépenser son
     * argent lui-même) : une carte avec le montant demandé et des boutons
     * Valider/Refuser visibles et cliquables uniquement par le MJ (voir
     * module/chat/money-request-actions.mjs) - Valider appelle #spendMoney, et
     * les deux préviennent le joueur propriétaire par une notification dès que
     * le MJ tranche (voir le flag `l5r4ec.moneyRequest`, qui porte toutes les
     * infos nécessaires - montant, raison - pour que le clic du MJ n'ait besoin
     * de rien redemander).
     * Ne poste rien si le joueur n'a déjà pas les fonds pour cette dépense
     * (pas la peine de faire trancher le MJ sur une demande impossible).
     * @param {{koku?: number, bu?: number, zeni?: number, reason?: string}} amount
     */
    async requestSpendMoney({ koku = 0, bu = 0, zeni = 0, reason = "" } = {}) {
      const money = this.system.money;
      if (money.koku < koku || money.bu < bu || money.zeni < zeni) {
        ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NotEnoughMoney", { name: this.name }));
        return;
      }

      const amountText = [
        koku ? `${koku} ${game.i18n.localize("L5R4EC.Sheet.Koku")}` : null,
        bu ? `${bu} ${game.i18n.localize("L5R4EC.Sheet.Bu")}` : null,
        zeni ? `${zeni} ${game.i18n.localize("L5R4EC.Sheet.Zeni")}` : null
      ].filter(Boolean).join(", ");

      const content = await foundry.applications.handlebars.renderTemplate(
        "systems/l5r4ec/templates/chat/money-request-card.hbs",
        { actorName: this.name, amountText, reason, pending: true }
      );

      await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: this }),
        content,
        flags: {
          l5r4ec: {
            moneyRequest: { actorId: this.id, koku, bu, zeni, reason, amountText, resolved: false }
          }
        }
      });
    }
  };
