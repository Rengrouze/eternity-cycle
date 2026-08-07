import { findSkillByName } from "../../rules/skills.mjs";
import { promptRollBonus, promptSpellCast, promptRangedAttack, buildConditionalBonuses, hasUsedExtraAttack, confirmStance } from "./roll-prompts.mjs";

/**
 * Handlers d'action de combat : jets (Trait/Anneau/Compétence/Sort/
 * Attaque/Initiative/Pleine Défense), tour par tour (dégainer/rengainer,
 * Garde, se relever), Empoignade, changement de posture.
 */

/**
 * Handler d'action pour le clic sur un bouton de jet de Trait.
 * @this {CharacterSheet}
 */
export async function onRollTrait(event, target) {
  const traitKey = target.dataset.trait;

  const bonus = await promptRollBonus(this.actor);
  if (bonus === null) return;

  await this.actor.rollTrait(traitKey, bonus);
}

/**
 * Handler d'action pour le clic sur un bouton de jet d'Anneau.
 * @this {CharacterSheet}
 */
export async function onRollRing(event, target) {
  const ringKey = target.dataset.ring;

  const bonus = await promptRollBonus(this.actor);
  if (bonus === null) return;

  await this.actor.rollRing(ringKey, bonus);
}

/**
 * Handler d'action pour le clic sur un bouton de jet de Compétence.
 * @this {CharacterSheet}
 */
export async function onRollSkill(event, target) {
  const item = this.actor.items.get(target.dataset.itemId);
  if (!item) return;

  const bonus = await promptRollBonus(this.actor, item);
  if (bonus === null) return;

  await this.actor.rollSkill(item.id, bonus);
}

/**
 * Handler d'action pour le clic sur un bouton de jet de Sort.
 * @this {CharacterSheet}
 */
export async function onRollSpell(event, target) {
  const item = this.actor.items.get(target.dataset.itemId);
  if (!item) return;

  const options = await promptSpellCast(item);
  if (options === null) return;

  await this.actor.rollSpell(item.id, options);
}

/**
 * Handler d'action pour le clic sur "Attaquer" d'une Arme équipée. Pour
 * une Arme à distance, passe par une modale dédiée qui inclut le choix de
 * la Munition (voir #promptRangedAttack) - obligatoire, sans quoi
 * SystemActor#rollAttack ne peut ni calculer le DR (Munition + Force de
 * l'Arc) ni décompter le stock. Pour une Arme de mêlée, résout la
 * Compétence associée par nom (même logique que SystemActor#rollAttack)
 * pour proposer ses éventuels bonus conditionnels de dégâts (voir
 * #buildConditionalBonuses - ex: Armes d'Hast rang 5).
 * @this {CharacterSheet}
 */
export async function onRollAttack(event, target) {
  const item = this.actor.items.get(target.dataset.itemId);
  if (!item) return;

  // Menu déroulant "Cible" partagé par tout le panneau Attaques (voir
  // tab-combat.hbs) - pas dans la même ligne que le bouton cliqué,
  // recherché dans toute la fiche plutôt que via target.parentElement.
  const targetActorId = this.element.querySelector('select[name="attackTarget"]')?.value || null;

  let options;
  if (item.system.isRanged) {
    options = await promptRangedAttack(this.actor, item);
  } else {
    const skillItem = findSkillByName(this.actor, item.system.associatedSkill);
    const conditionalBonuses = buildConditionalBonuses(skillItem, "damageRoll");
    const extraAttackUsed = hasUsedExtraAttack(this.actor);
    options = await promptRollBonus(this.actor, null, {
      conditionalBonuses,
      maneuversAvailable: true,
      extraAttackUsed,
    });
  }
  if (options === null) return;

  await this.actor.rollAttack(item.id, { ...options, targetActorId });
}

/**
 * Handler d'action pour le clic sur "Dégainer" à côté d'une Arme équipée
 * mais pas encore en main (voir SystemActor#drawWeapon) - lit la main
 * choisie dans le <select> voisin (voir tab-combat.hbs) - permet de
 * dégainer explicitement à l'avance (ex: pendant une Phase de Réaction,
 * ou lors d'un tour dédié) plutôt que de systématiquement laisser
 * #onRollAttack le faire au moment de l'attaque elle-même (ce qui reste
 * possible - #rollAttack appelle #drawWeapon lui aussi si besoin, avec la
 * main directrice par défaut faute de choix explicite).
 * @this {CharacterSheet}
 */
export async function onDrawWeapon(event, target) {
  const item = this.actor.items.get(target.dataset.itemId);
  if (!item) return;

  const hand = target.parentElement.querySelector('select[name="hand"]')?.value ?? null;
  await this.actor.drawWeapon(item.id, hand);
}

/**
 * Handler d'action pour le clic sur "Ranger" à côté d'une Arme en main
 * (voir SystemActor#sheatheWeapon) - pas de coût d'Action.
 * @this {CharacterSheet}
 */
export async function onSheatheWeapon(event, target) {
  const item = this.actor.items.get(target.dataset.itemId);
  if (!item) return;

  await this.actor.sheatheWeapon(item.id);
}

/**
 * Handler d'action pour le clic sur "Garde" - lit l'Acteur choisi dans le
 * <select> voisin (voir tab-combat.hbs) et déclare la Manœuvre (voir
 * SystemActor#declareGuard).
 * @this {CharacterSheet}
 */
export async function onDeclareGuard(event, target) {
  const targetActorId = target.parentElement.querySelector('select[name="guardTarget"]')?.value;
  if (!targetActorId) return;

  await this.actor.declareGuard(targetActorId);
}

/**
 * Handler d'action pour le clic sur "Se relever" (condition Au Sol, voir
 * SystemActor#standUp).
 * @this {CharacterSheet}
 */
export async function onStandUp() {
  await this.actor.standUp();
}

/**
 * Handler d'action pour le clic sur "Foncer" (voir SystemActor#spendMoveAction) -
 * dépense une Action Simple pour porter le budget de déplacement du tour de
 * `moveBudget.free` à `moveBudget.simple` (voir module/rules/actions.mjs
 * #effectiveMoveBudget, module/hooks/token-movement-tracking.mjs qui
 * applique le blocage réel).
 * @this {CharacterSheet}
 */
export async function onSpendMoveAction() {
  await this.actor.spendMoveAction();
}

/**
 * Handler d'action pour le clic sur "Empoignade" (initier une lutte, voir
 * SystemActor#initiateGrapple) - lit la cible choisie dans le <select>
 * voisin (voir tab-combat.hbs).
 * @this {CharacterSheet}
 */
export async function onInitiateGrapple(event, target) {
  const targetActorId = target.parentElement.querySelector('select[name="grappleInitiateTarget"]')?.value;
  if (!targetActorId) return;

  await this.actor.initiateGrapple(targetActorId);
}

/**
 * Handlers d'action pour les boutons Frapper/Jeter/Rompre/Passer d'une
 * Empoignade en cours (voir SystemActor#grappleAction) - Frapper/Jeter
 * lisent la cible choisie dans le <select> voisin.
 * @this {CharacterSheet}
 */
export async function onGrappleHit(event, target) {
  const targetActorId = target.parentElement.querySelector('select[name="grappleTarget"]')?.value;
  if (!targetActorId) return;
  await this.actor.grappleAction("hit", { targetActorId });
}

/** @this {CharacterSheet} */
export async function onGrappleThrow(event, target) {
  const targetActorId = target.parentElement.querySelector('select[name="grappleTarget"]')?.value;
  if (!targetActorId) return;
  await this.actor.grappleAction("throw", { targetActorId });
}

/** @this {CharacterSheet} */
export async function onGrappleBreak() {
  await this.actor.grappleAction("break");
}

/** @this {CharacterSheet} */
export async function onGrapplePass() {
  await this.actor.grappleAction("pass");
}

/**
 * Handler d'action pour le bouton de secours "Tenter de reprendre le
 * contrôle" (voir SystemActor#_resolveGrappleControl) - normalement
 * automatique au début du tour (voir module/hooks/combat-turn-reset.mjs),
 * ce bouton permet de le redéclencher à la main si besoin (fiabilité des
 * hooks multi-client, ou pour rejouer volontairement après une correction
 * MJ). Sans effet si CET Acteur a déjà le contrôle (voir la méthode, qui
 * se contente de ne rien faire dans ce cas).
 * @this {CharacterSheet}
 */
export async function onAttemptGrappleControl() {
  await this.actor._resolveGrappleControl();
}

/**
 * Handler d'action pour le clic sur "Lancer l'Initiative".
 * @this {CharacterSheet}
 */
export async function onRollInitiative() {
  await this.actor.rollInitiative();
}

/**
 * Handler d'action pour le clic sur "Déclarer Pleine Défense" (jet inclus,
 * voir SystemActor#rollFullDefense).
 * @this {CharacterSheet}
 */
export async function onRollFullDefense() {
  const confirmed = await confirmStance("fullDefense");
  if (!confirmed) return;

  await this.actor.rollFullDefense();
}

/**
 * Handler d'action pour le clic sur une posture autre que Pleine Défense
 * (qui passe par #onRollFullDefense, car sa déclaration implique un jet).
 * @this {CharacterSheet}
 */
export async function onSetStance(event, target) {
  const stance = target.dataset.stance;
  const confirmed = await confirmStance(stance);
  if (!confirmed) return;

  await this.actor.setStance(stance);
}
