import { qualityFields } from "./shared-fields.mjs";

const { StringField, NumberField, BooleanField, HTMLField } = foundry.data.fields;

/**
 * Arme L5R 4e. Le DR (Damage Rating, ex "3k2") est stocké comme un couple
 * dés lancés/gardés distinct - même logique de dés que les jets de
 * Trait/Compétence, réutilisable telle quelle quand les jets de dégâts
 * seront implémentés.
 */
export class WeaponDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...qualityFields(),

      // Compétence utilisée pour manier l'arme (texte libre, cohérent avec
      // le système de Compétences en texte libre - ex: "Kenjutsu").
      associatedSkill: new StringField({ required: true, blank: true }),

      // DR (Damage Rating) : dés lancés / dés gardés, ex "3k2" -> rolled:3, kept:2.
      damageRolled: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      damageKept: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      keywords: new StringField({ required: true, blank: true }), // "Medium, Samurai"
      specialRules: new HTMLField({ required: true, blank: true }),
      price: new StringField({ required: true, blank: true }), // texte libre ("non disponible à la vente", "5 koku"...)

      // Taille structurée (distincte de `keywords`, en texte libre) - pilote
      // le coût pour dégainer cette Arme (voir module/rules/actions.mjs
      // #drawActionCost et SystemActor#drawWeapon) : Petite -> Action Gratuite,
      // Moyenne/Grande -> Action Simple (sauf Capacité de Maîtrise "freeDraw"
      // applicable, voir item-skill.mjs).
      size: new StringField({ required: true, choices: ["small", "medium", "large"], initial: "medium" }),

      // Arme à distance (arc, arme à feu...) : portée en mètres. La Force de
      // l'arc (strengthRating) s'ajoute automatiquement aux dés LANCÉS de la
      // Munition tirée - voir SystemActor#rollAttack.
      isRanged: new BooleanField({ initial: false }),
      range: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      strengthRating: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      // Arc enchanté/Nemuranai qui invoque directement sa propre flèche
      // magique (ex: pas besoin de porter de vraies flèches) : si activé,
      // le choix "Munition" au tir propose cette flèche en plus du stock
      // réel, sans jamais consommer ni nécessiter d'Item Munition (voir
      // SystemActor#rollAttack / CharacterSheet#promptRangedAttack). Le DR
      // ci-dessous est celui de la flèche invoquée SEULE (avant Force de
      // l'Arc, ajoutée automatiquement comme pour une Munition normale).
      conjuresAmmo: new BooleanField({ initial: false }),
      conjuredAmmoName: new StringField({ required: true, blank: true, initial: "" }),
      conjuredAmmoRolled: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      conjuredAmmoKept: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      // `equipped` = portée sur le personnage (accessible dans l'onglet
      // Combat/Inventaire), `hand` = main dans laquelle elle est
      // effectivement EN MAIN, prête à attaquer ("none" = pas dégainée) -
      // une Arme équipée n'est pas forcément dégainée (voir
      // SystemActor#drawWeapon/#rollAttack, qui applique le malus de main
      // non directrice si `hand` ne correspond ni à system.combat.dominantHand
      // ni à "both", sauf system.combat.ambidextrous).
      equipped: new BooleanField({ initial: false }),
      hand: new StringField({ required: true, choices: ["none", "left", "right", "both"], initial: "none" }),
      description: new HTMLField({ required: true, blank: true })
    };
  }
}
