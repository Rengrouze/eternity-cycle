import { RollsMixin } from "./actor/rolls-mixin.mjs";
import { CombatMixin } from "./actor/combat-mixin.mjs";
import { GrappleMixin } from "./actor/grapple-mixin.mjs";
import { MoneyMixin } from "./actor/money-mixin.mjs";
import { DerivedDataMixin } from "./actor/derived-data-mixin.mjs";
import { CoreMixin } from "./actor/core-mixin.mjs";

/**
 * Actor custom pour le système. Composé de plusieurs mixins par domaine
 * (voir module/documents/actor/*.mjs) plutôt qu'une seule classe monolithique
 * - toutes les méthodes finissent sur le même prototype final, donc
 * `this.xxx()` fonctionne peu importe quel mixin l'a définie, mêmes appels
 * croisés qu'avant le découpage :
 * - rolls-mixin.mjs : jets de dés (Trait/Anneau/Compétence/Sort/Dégâts/
 *   Attaque/Initiative/Pleine Défense).
 * - combat-mixin.mjs : tour par tour (posture, Garde, dégainer/rengainer,
 *   budget d'Action).
 * - grapple-mixin.mjs : Empoignade (initier, contrôler, agir).
 * - money-mixin.mjs : argent (cassage de pièces, dépense/demande).
 * - derived-data-mixin.mjs : TN d'Armure, Réputation, bonus de maîtrise.
 * - core-mixin.mjs : socle partagé (Points de Vide, garde-fou de jet, malus
 *   conditionnels, `_preUpdate`) - utilisé par presque tous les autres
 *   mixins, appliqué en dernier dans la composition.
 */
export class SystemActor extends CoreMixin(DerivedDataMixin(MoneyMixin(GrappleMixin(CombatMixin(RollsMixin(Actor)))))) {}
