const { DialogV2 } = foundry.applications.api;

import { computeSpellTN } from "../../rules/spellcasting.mjs";
import { CONJURED_AMMO_ID } from "../../rules/ammo.mjs";
import { isActionEconomyEnforced } from "../../settings.mjs";
import { findSkillByName } from "../../rules/skills.mjs";
import { listOtherCombatants } from "./combat-targets.mjs";

/**
 * Modales et petits calculs partagés par les handlers d'action de
 * CharacterSheet (voir module/sheets/actor/combat-actions.mjs et
 * money-actions.mjs) - aucune de ces fonctions ne dépend d'une instance de
 * fiche (`this`), toutes prennent leurs données en paramètre explicite, donc
 * vivent ici comme des fonctions de module plutôt que des méthodes statiques
 * privées de la classe.
 */

/**
 * true si la case "Jet de Réaction" a un sens à proposer dans une modale
 * de jet pour cet Acteur - seulement quand l'Économie d'Action est active,
 * qu'un combat est en cours, ET que ce n'est PAS le tour de cet Acteur
 * (sinon le jet est de toute façon autorisé sans qu'aucune case ne soit
 * nécessaire, voir SystemActor#_ensureCanRoll).
 * @param {Actor} actor
 * @returns {boolean}
 */
export function showReactionOption(actor) {
  return isActionEconomyEnforced() && Boolean(game.combat?.started) && actor.isInCombat && !actor.isCurrentTurn;
}

/**
 * true si la Manœuvre Attaque Supplémentaire a déjà été déclarée ce tour
 * par cet Acteur (voir system.combat.extraAttackTurn, SystemActor#rollAttack) -
 * même formule round*1000+turn que côté document, pour désactiver la case
 * correspondante dans la modale plutôt que de laisser le jet échouer après coup.
 * @param {Actor} actor
 * @returns {boolean}
 */
export function hasUsedExtraAttack(actor) {
  const turnKey = (game.combat?.round ?? 0) * 1000 + (game.combat?.turn ?? 0);
  return actor.system.combat.extraAttackTurn === turnKey;
}

/**
 * Bonus conditionnels (`conditionLabel` renseigné, voir item-skill.mjs)
 * d'une Compétence pour un `trigger` donné, dont le rang requis est
 * atteint - affichés en cases à cocher dans #promptRollBonus plutôt
 * qu'appliqués automatiquement (voir SystemActor#_sumMasteryBonus, qui les
 * exclut du calcul automatique).
 * @param {Item|null} skillItem
 * @param {string} trigger
 * @returns {Array<{label: string, rollBonus: number, keepBonus: number, flatBonus: number}>}
 */
export function buildConditionalBonuses(skillItem, trigger) {
  if (!skillItem) return [];
  return (skillItem.system.masteryBonuses ?? [])
    .filter((b) => b.trigger === trigger && b.conditionLabel && skillItem.system.rank >= b.rankRequired)
    .map((b) => ({
      label: b.conditionLabel,
      rollBonus: b.rollBonus ?? 0,
      keepBonus: b.keepBonus ?? 0,
      flatBonus: b.flatBonus ?? 0,
    }));
}

/**
 * Confirmation avant tout changement de posture - une déclaration de
 * posture engage le personnage pour tout le round, mieux vaut éviter un
 * clic accidentel (voir demande utilisateur : confirmation systématique).
 * @param {string} stance  Une valeur de STANCE_CHOICES.
 * @returns {Promise<boolean>}
 */
export async function confirmStance(stance) {
  const label = game.i18n.localize(`L5R4EC.Stance.${stance.charAt(0).toUpperCase()}${stance.slice(1)}`);
  return DialogV2.confirm({
    window: { title: game.i18n.localize("L5R4EC.Dialog.ConfirmStanceTitle") },
    content: `<p>${game.i18n.format("L5R4EC.Dialog.ConfirmStanceBody", { stance: label })}</p>`,
    modal: true,
    rejectClose: false,
  });
}

/**
 * Mini-modale à un seul champ : juste le nom du sous-type à ajouter.
 * @param {string} skillName
 * @returns {Promise<string|null>} le sous-type saisi, ou null si annulé/vide.
 */
export async function promptSubtype(skillName) {
  const content = `
  <div class="flex flex-col gap-2 p-1 w-64">
    <label class="flex flex-col gap-0.5 text-sm">
      ${game.i18n.format("L5R4EC.Dialog.AddSubtypeLabel", { name: skillName })}
      <input type="text" name="subtype" required autofocus class="border rounded px-1 py-0.5">
    </label>
  </div>`;

  const result = await DialogV2.wait({
    window: { title: game.i18n.format("L5R4EC.Dialog.AddSubtypeTitle", { name: skillName }) },
    content,
    modal: true,
    rejectClose: false,
    buttons: [
      {
        action: "create",
        label: game.i18n.localize("L5R4EC.Dialog.Create"),
        icon: "fa-solid fa-plus",
        default: true,
        callback: (event, button) => button.form.elements.subtype.value.trim(),
      },
      { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") },
    ],
  });

  if (!result || result === "cancel") return null;
  return result || null;
}

/**
 * Modale de dépense : montant par dénomination + raison optionnelle.
 * @returns {Promise<{koku:number, bu:number, zeni:number, reason:string}|null>}
 */
export async function promptSpendMoney() {
  const content = `
  <div class="flex flex-col gap-2 p-1 w-64">
    <label class="flex justify-between items-center gap-2">
      ${game.i18n.localize("L5R4EC.Sheet.Koku")}
      <input type="number" name="koku" value="0" min="0" class="w-16 border rounded text-center">
    </label>
    <label class="flex justify-between items-center gap-2">
      ${game.i18n.localize("L5R4EC.Sheet.Bu")}
      <input type="number" name="bu" value="0" min="0" class="w-16 border rounded text-center">
    </label>
    <label class="flex justify-between items-center gap-2">
      ${game.i18n.localize("L5R4EC.Sheet.Zeni")}
      <input type="number" name="zeni" value="0" min="0" class="w-16 border rounded text-center">
    </label>
    <label class="flex flex-col gap-0.5">
      ${game.i18n.localize("L5R4EC.Dialog.SpendReason")}
      <input type="text" name="reason" class="border rounded px-1 py-0.5" placeholder="${game.i18n.localize("L5R4EC.Dialog.OptionalHint")}">
    </label>
  </div>`;

  const result = await DialogV2.wait({
    window: { title: game.i18n.localize("L5R4EC.Dialog.SpendMoneyTitle") },
    content,
    modal: true,
    rejectClose: false,
    buttons: [
      {
        action: "spend",
        label: game.i18n.localize("L5R4EC.Dialog.SpendMoneyConfirm"),
        icon: "fa-solid fa-coins",
        default: true,
        callback: (event, button) => ({
          koku: Number(button.form.elements.koku.value) || 0,
          bu: Number(button.form.elements.bu.value) || 0,
          zeni: Number(button.form.elements.zeni.value) || 0,
          reason: button.form.elements.reason.value.trim(),
        }),
      },
      { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") },
    ],
  });

  if (!result || result === "cancel") return null;
  if (!result.koku && !result.bu && !result.zeni) return null;
  return result;
}

/**
 * Modale de lancer de sort : Augmentations déclarées (+5 au TN chacune) et
 * nombre de cibles visées (informatifs - reportés sur la carte de chat
 * pour interprétation manuelle du texte "Augmentations" du sort, voir
 * pièges du projet sur les bonus non automatisables), plus les bonus de
 * dés lancés/gardés classiques.
 * @param {Item} item  L'Item Sort concerné, pour afficher son TN de base.
 * @returns {Promise<{augmentations:number, targets:number, rollBonus:number, keepBonus:number}|null>}
 */
export async function promptSpellCast(item) {
  const baseTn = computeSpellTN(item.system.masteryRank);
  const voidPoints = item.actor.system.rings.void.points;
  const voidRank = item.actor.system.rings.void.rank;
  const showReaction = showReactionOption(item.actor);
  // Menu déroulant "Cible" (voir module/sheets/actor/combat-targets.mjs,
  // même source que tab-combat.hbs pour l'Attaque) - la Portée d'un sort est
  // un texte libre (voir item-spell.mjs), pas vérifiable automatiquement, donc
  // la case "à portée" ci-dessous reste en honor system (voir SystemActor#rollSpell,
  // qui bloque le jet si une cible est choisie mais la case pas cochée).
  const targetOptions = listOtherCombatants(item.actor);
  const content = await foundry.applications.handlebars.renderTemplate("systems/l5r4ec/templates/dialogs/spell-cast.hbs", {
    baseTn,
    voidPoints,
    voidRank,
    showReactionOption: showReaction,
    targetOptions,
  });

  const result = await DialogV2.wait({
    window: { title: game.i18n.format("L5R4EC.Dialog.SpellCastTitle", { name: item.name }) },
    content,
    modal: true,
    rejectClose: false,
    buttons: [
      {
        action: "roll",
        label: game.i18n.localize("L5R4EC.Dialog.Roll"),
        icon: "fa-solid fa-dice-d10",
        default: true,
        callback: (event, button) => ({
          augmentations: Number(button.form.elements.augmentations.value) || 0,
          targets: Number(button.form.elements.targets.value) || 1,
          rollBonus: Number(button.form.elements.rollBonus.value) || 0,
          keepBonus: Number(button.form.elements.keepBonus.value) || 0,
          spendVoid: button.form.elements.spendVoid?.checked ?? false,
          isReaction: button.form.elements.isReaction?.checked ?? false,
          targetActorId: button.form.elements.targetActorId?.value || null,
          inRange: button.form.elements.inRange?.checked ?? false,
        }),
      },
      { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") },
    ],
  });

  if (!result || result === "cancel") return null;
  return result;
}

/**
 * Modale de tir à l'arc : choix de la Munition (obligatoire) + bonus de
 * dés lancés/gardés classiques. La liste propose le stock réel (Munitions
 * en quantité > 0 ou illimitées) et, si l'Arme invoque sa propre flèche
 * magique (system.conjuresAmmo - voir item-weapon.mjs), une option
 * supplémentaire toujours disponible pour celle-ci, en plus du stock réel
 * s'il y en a. Avertit et annule directement (pas de modale) seulement si
 * AUCUNE des deux sources n'est disponible.
 * Propose aussi les bonus conditionnels de dégâts de la Compétence
 * associée (voir #buildConditionalBonuses) et, si l'acteur en a, une case
 * "Dépenser un Point de Vide" pour le jet d'Attaque (voir SystemActor#rollAttack).
 * @param {Actor} actor
 * @param {Item} weapon
 * @returns {Promise<{ammoId: string, rollBonus: number, keepBonus: number, spendVoid: boolean, conditionalDamageBonus: {rollBonus: number, keepBonus: number, flatBonus: number}}|null>}
 */
export async function promptRangedAttack(actor, weapon) {
  const ammoItems = actor.items.filter((i) => i.type === "ammo" && (i.system.unlimited || i.system.quantity > 0));
  if (!ammoItems.length && !weapon.system.conjuresAmmo) {
    ui.notifications.warn(game.i18n.format("L5R4EC.Notif.NoAmmo", { name: actor.name }));
    return null;
  }

  let options = ammoItems
    .map((i) => {
      const stock = i.system.unlimited ? game.i18n.localize("L5R4EC.Sheet.Unlimited") : `x${i.system.quantity}`;
      return `<option value="${i.id}">${i.name} (${i.system.damageRolled}k${i.system.damageKept} - ${stock})</option>`;
    })
    .join("");

  if (weapon.system.conjuresAmmo) {
    const name = weapon.system.conjuredAmmoName || game.i18n.localize("L5R4EC.Sheet.ConjuredAmmo");
    options += `<option value="${CONJURED_AMMO_ID}">${name} (${weapon.system.conjuredAmmoRolled}k${weapon.system.conjuredAmmoKept} - ${game.i18n.localize("L5R4EC.Sheet.Unlimited")})</option>`;
  }

  const skillItem = findSkillByName(actor, weapon.system.associatedSkill);
  const conditionalBonuses = buildConditionalBonuses(skillItem, "damageRoll");
  const conditionalHtml = conditionalBonuses
    .map(
      (bonus, index) => `
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" name="conditional-${index}">
      ${bonus.label}
    </label>`,
    )
    .join("");

  const voidPoints = actor.system.rings.void.points;
  const voidRank = actor.system.rings.void.rank;
  const showReaction = showReactionOption(actor);
  const extraAttackUsed = hasUsedExtraAttack(actor);

  const maneuversHtml = `
  <div class="flex flex-col gap-1 border-t pt-1 mt-1 text-sm">
    <div class="text-xs text-neutral-500">${game.i18n.localize("L5R4EC.Dialog.ManeuversHint")} (${game.i18n.localize("L5R4EC.Dialog.AugmentationsMaxHint")} ${voidRank})</div>
    <label class="flex items-center gap-2">
      <input type="checkbox" name="maneuverExtraAttack" ${extraAttackUsed ? "disabled" : ""}>
      ${game.i18n.localize("L5R4EC.Maneuver.ExtraAttack")} (5) ${extraAttackUsed ? `- ${game.i18n.localize("L5R4EC.Dialog.AlreadyUsedThisTurn")}` : ""}
    </label>
    <label class="flex justify-between items-center gap-2">
      ${game.i18n.localize("L5R4EC.Maneuver.PreciseCut")}
      <select name="maneuverPreciseTarget" class="border rounded px-1 py-0.5">
        <option value="torso">${game.i18n.localize("L5R4EC.Maneuver.PreciseTarget.torso")}</option>
        <option value="limb">${game.i18n.localize("L5R4EC.Maneuver.PreciseTarget.limb")}</option>
        <option value="extremity">${game.i18n.localize("L5R4EC.Maneuver.PreciseTarget.extremity")}</option>
        <option value="head">${game.i18n.localize("L5R4EC.Maneuver.PreciseTarget.head")}</option>
        <option value="detail">${game.i18n.localize("L5R4EC.Maneuver.PreciseTarget.detail")}</option>
      </select>
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" name="maneuverDisarm">
      ${game.i18n.localize("L5R4EC.Maneuver.Disarm")} (3)
    </label>
    <label class="flex justify-between items-center gap-2">
      ${game.i18n.localize("L5R4EC.Maneuver.DamageAugments")}
      <input type="number" name="maneuverDamageAugments" value="0" min="0" class="w-16 border rounded text-center">
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" name="maneuverFeint">
      ${game.i18n.localize("L5R4EC.Maneuver.Feint")} (2)
    </label>
    <label class="flex justify-between items-center gap-2">
      ${game.i18n.localize("L5R4EC.Maneuver.Reversal")} (${game.i18n.localize("L5R4EC.Dialog.ReversalLegsHint")})
      <input type="number" name="maneuverReversalLegs" value="0" min="0" class="w-16 border rounded text-center">
    </label>
  </div>`;

  const content = `
  <div class="flex flex-col gap-2 p-1 w-72">
    <label class="flex flex-col gap-0.5 text-sm">
      ${game.i18n.localize("L5R4EC.Sheet.Ammo")}
      <select name="ammoId" class="border rounded px-1 py-0.5">${options}</select>
    </label>
    <label class="flex justify-between items-center gap-2">
      ${game.i18n.localize("L5R4EC.Dialog.RollBonus")}
      <input type="number" name="rollBonus" value="0" min="0" class="w-16 border rounded text-center">
    </label>
    <label class="flex justify-between items-center gap-2">
      ${game.i18n.localize("L5R4EC.Dialog.KeepBonus")}
      <input type="number" name="keepBonus" value="0" min="0" class="w-16 border rounded text-center">
    </label>
    ${maneuversHtml}
    ${conditionalHtml ? `<div class="flex flex-col gap-1 border-t pt-1 mt-1">${conditionalHtml}</div>` : ""}
    ${
      voidPoints
        ? `
    <label class="flex items-center gap-2 text-sm border-t pt-1 mt-1">
      <input type="checkbox" name="spendVoid">
      ${game.i18n.localize("L5R4EC.Dialog.SpendVoidPoint")} (${voidPoints})
    </label>`
        : ""
    }
    ${
      showReaction
        ? `
    <label class="flex items-center gap-2 text-sm border-t pt-1 mt-1">
      <input type="checkbox" name="isReaction">
      ${game.i18n.localize("L5R4EC.Dialog.IsReaction")}
    </label>`
        : ""
    }
  </div>`;

  const result = await DialogV2.wait({
    window: { title: game.i18n.format("L5R4EC.Dialog.RangedAttackTitle", { name: weapon.name }) },
    content,
    modal: true,
    rejectClose: false,
    buttons: [
      {
        action: "roll",
        label: game.i18n.localize("L5R4EC.Dialog.Roll"),
        icon: "fa-solid fa-dice-d10",
        default: true,
        callback: (event, button) => {
          const conditionalDamageBonus = { rollBonus: 0, keepBonus: 0, flatBonus: 0 };
          conditionalBonuses.forEach((bonus, index) => {
            if (!button.form.elements[`conditional-${index}`]?.checked) return;
            conditionalDamageBonus.rollBonus += bonus.rollBonus ?? 0;
            conditionalDamageBonus.keepBonus += bonus.keepBonus ?? 0;
            conditionalDamageBonus.flatBonus += bonus.flatBonus ?? 0;
          });
          const maneuvers = {
            extraAttack: button.form.elements.maneuverExtraAttack?.checked ?? false,
            preciseTarget: button.form.elements.maneuverPreciseTarget?.value ?? "torso",
            disarm: button.form.elements.maneuverDisarm?.checked ?? false,
            damageAugments: Number(button.form.elements.maneuverDamageAugments?.value) || 0,
            feint: button.form.elements.maneuverFeint?.checked ?? false,
            reversalLegs: Number(button.form.elements.maneuverReversalLegs?.value) || 0,
          };
          return {
            ammoId: button.form.elements.ammoId.value,
            rollBonus: Number(button.form.elements.rollBonus.value) || 0,
            keepBonus: Number(button.form.elements.keepBonus.value) || 0,
            spendVoid: button.form.elements.spendVoid?.checked ?? false,
            isReaction: button.form.elements.isReaction?.checked ?? false,
            maneuvers,
            conditionalDamageBonus,
          };
        },
      },
      { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") },
    ],
  });

  if (!result || result === "cancel") return null;
  return result;
}

/**
 * Affiche une modale demandant un bonus de dés/de garde avant un jet, et
 * (si un Item Compétence avec spécialisations est fourni) laquelle
 * appliquer à ce jet précis. Ajoute aussi, si applicable :
 * - une case "Dépenser un Point de Vide" (voir SystemActor#rollTrait et
 *   consorts, `spendVoid`), affichée seulement si l'acteur en a au moins 1.
 * - une case par bonus conditionnel fourni (voir #buildConditionalBonuses,
 *   champ `conditionLabel` de item-skill.mjs) - leur somme est renvoyée
 *   dans `conditionalDamageBonus`, à appliquer manuellement par l'appelant
 *   (ce ne sont pas forcément des bonus au jet PRINCIPAL, ex: dégâts d'Arme
 *   plutôt que jet d'Attaque - voir SystemActor#rollAttack).
 * Pour un jet d'Attaque de mêlée (`maneuversAvailable: true`), remplace la
 * case Augmentations générique par les cases de Manœuvres (voir
 * module/rules/maneuvers.mjs) - leur coût total devient les Augmentations
 * déclarées sur ce jet, renvoyé dans `maneuvers` (pas `augmentations`,
 * calculé côté SystemActor#rollAttack via #computeManeuverCost).
 * @param {Actor} actor  L'Acteur qui lance le jet (pour son solde de Points de Vide).
 * @param {Item} [item]  L'Item Compétence concerné, le cas échéant.
 * @param {{conditionalBonuses?: Array<{label: string, rollBonus?: number, keepBonus?: number, flatBonus?: number}>, maneuversAvailable?: boolean, extraAttackUsed?: boolean}} [options]
 * @returns {Promise<{rollBonus: number, keepBonus: number, specialization?: string, spendVoid: boolean, augmentations?: number, maneuvers?: object, conditionalDamageBonus: {rollBonus: number, keepBonus: number, flatBonus: number}}|null>} null si annulé.
 */
export async function promptRollBonus(
  actor,
  item = null,
  { conditionalBonuses = [], maneuversAvailable = false, extraAttackUsed = false } = {},
) {
  const specializations = (item?.system.specializations ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const voidPoints = actor.system.rings.void.points;
  const voidRank = actor.system.rings.void.rank;
  const showReaction = showReactionOption(actor);

  const content = await foundry.applications.handlebars.renderTemplate("systems/l5r4ec/templates/dialogs/roll-bonus.hbs", {
    specializations,
    conditionalBonuses,
    voidPoints,
    voidRank,
    showReactionOption: showReaction,
    maneuversAvailable,
    extraAttackUsed,
  });

  const result = await DialogV2.wait({
    window: { title: game.i18n.localize("L5R4EC.Dialog.RollBonusTitle") },
    content,
    modal: true,
    rejectClose: false,
    buttons: [
      {
        action: "roll",
        label: game.i18n.localize("L5R4EC.Dialog.Roll"),
        icon: "fa-solid fa-dice-d10",
        default: true,
        callback: (event, button) => {
          const conditionalDamageBonus = { rollBonus: 0, keepBonus: 0, flatBonus: 0 };
          conditionalBonuses.forEach((bonus, index) => {
            if (!button.form.elements[`conditional-${index}`]?.checked) return;
            conditionalDamageBonus.rollBonus += bonus.rollBonus ?? 0;
            conditionalDamageBonus.keepBonus += bonus.keepBonus ?? 0;
            conditionalDamageBonus.flatBonus += bonus.flatBonus ?? 0;
          });
          const maneuvers = maneuversAvailable
            ? {
                extraAttack: button.form.elements.maneuverExtraAttack?.checked ?? false,
                preciseTarget: button.form.elements.maneuverPreciseTarget?.value ?? "torso",
                disarm: button.form.elements.maneuverDisarm?.checked ?? false,
                damageAugments: Number(button.form.elements.maneuverDamageAugments?.value) || 0,
                feint: button.form.elements.maneuverFeint?.checked ?? false,
                reversalLegs: Number(button.form.elements.maneuverReversalLegs?.value) || 0,
              }
            : undefined;
          return {
            rollBonus: Number(button.form.elements.rollBonus.value) || 0,
            keepBonus: Number(button.form.elements.keepBonus.value) || 0,
            specialization: button.form.elements.specialization?.value ?? "",
            spendVoid: button.form.elements.spendVoid?.checked ?? false,
            isReaction: button.form.elements.isReaction?.checked ?? false,
            augmentations: Number(button.form.elements.augmentations?.value) || 0,
            maneuvers,
            conditionalDamageBonus,
          };
        },
      },
      { action: "cancel", label: game.i18n.localize("L5R4EC.Dialog.Cancel") },
    ],
  });

  if (!result || result === "cancel") return null;
  return result;
}
