const { StringField, NumberField, HTMLField, SchemaField } = foundry.data.fields;

/**
 * Sort L5R 4e (Shugenja). Le TN de base et le temps d'incantation se
 * déduisent de `masteryRank` (voir module/rules/spellcasting.mjs) - pas
 * stockés ici pour ne jamais désynchroniser des deux.
 */
export class SpellDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // Identifiant stable ("earth-1-armure-de-terre"), généré au build du
      // compendium (voir scripts/build-packs.mjs#slugify) à partir de
      // anneau+rang+nom - prévu pour accrocher un futur système d'effets
      // automatiques sur un sort précis sans dépendre de l'_id Foundry (qui
      // est un hash opaque) ni du nom affiché (modifiable sans casser le
      // lien). Vide pour un sort homebrew créé à la main sur la fiche - ces
      // sorts n'ont pas vocation à avoir un effet automatisé pour l'instant.
      key: new StringField({ required: true, blank: true, initial: "" }),

      // Anneau du sort ("Ring/Mastery: Earth 1" -> ring: "earth", masteryRank: 1).
      ring: new StringField({
        required: true,
        choices: ["air", "earth", "fire", "water", "void"],
        initial: "fire"
      }),
      masteryRank: new NumberField({ required: true, integer: true, min: 1, initial: 1 }),

      keywords: new StringField({ required: true, blank: true }), // "Jade, Tonnerre"
      range: new StringField({ required: true, blank: true }), // texte libre : "30 m", "Personnelle", "Contact"...
      areaOfEffect: new StringField({ required: true, blank: true }),
      duration: new StringField({ required: true, blank: true }),
      raises: new HTMLField({ required: true, blank: true }), // "Dégâts (+1k0), Portée (+3 m), Cibles (+1, max 5)..."

      description: new HTMLField({ required: true, blank: true }),

      // DR de base du sort, pour le bouton "Lancer les dégâts" côté carte de
      // chat (voir SystemActor#rollDamage). Un sort sur les cinq n'a pas
      // de dégâts bruts propres (utilitaire, buff, invocation...) - mode
      // "none" dans ce cas, aucun bouton affiché. Deux formes couvrent
      // l'essentiel du Grimoire :
      // - "fixed" : DR constant (ex: Frappe de Jade -> 3k3) -> rolled/kept
      //   utilisés tels quels.
      // - "ring"  : DR basé sur un Anneau du lanceur (ex: La Terre Devient le
      //   Ciel -> Anneau de Terre) -> rolled/kept = rang de l'Anneau `ring` +
      //   rolled/kept (bonus fixe éventuel, ex: Lames du Tueur = Air +2k0).
      // `note` documente les nuances non automatisables (conditions type
      // Souillure, dégâts additionnels par tour, calculs composites...) -
      // affichée sur la carte, à appliquer manuellement par le joueur/MJ.
      damage: new SchemaField({
        mode: new StringField({ required: true, choices: ["none", "fixed", "ring"], initial: "none" }),
        ring: new StringField({ required: true, blank: true, choices: ["", "air", "earth", "fire", "water", "void"], initial: "" }),
        rolled: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        kept: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        note: new StringField({ required: true, blank: true, initial: "" })
      })
    };
  }
}
