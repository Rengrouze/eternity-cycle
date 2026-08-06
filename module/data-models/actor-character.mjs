import { computeWoundTrack } from "../rules/wound-track.mjs";
import { getLethality } from "../settings.mjs";
import { AFFINITY_CHOICES } from "../rules/spellcasting.mjs";

const { HTMLField, NumberField, SchemaField, StringField } = foundry.data.fields;

/**
 * Data model de base pour les personnages (PJ/PNJ).
 * Contient les 8 Traits et les 5 Anneaux de L5R 4e.
 * Les rangs d'Anneaux (Air/Terre/Feu/Eau) sont dérivés automatiquement
 * du plus faible des deux Traits qui leur sont associés.
 */
export class CharacterDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      traits: new SchemaField({
        sta: new NumberField({ required: true, integer: true, min: 1, initial: 2, label: "L5R4EC.Trait.Stamina" }),
        wil: new NumberField({ required: true, integer: true, min: 1, initial: 2, label: "L5R4EC.Trait.Willpower" }),
        str: new NumberField({ required: true, integer: true, min: 1, initial: 2, label: "L5R4EC.Trait.Strength" }),
        per: new NumberField({ required: true, integer: true, min: 1, initial: 2, label: "L5R4EC.Trait.Perception" }),
        ref: new NumberField({ required: true, integer: true, min: 1, initial: 2, label: "L5R4EC.Trait.Reflexes" }),
        awa: new NumberField({ required: true, integer: true, min: 1, initial: 2, label: "L5R4EC.Trait.Awareness" }),
        agi: new NumberField({ required: true, integer: true, min: 1, initial: 2, label: "L5R4EC.Trait.Agility" }),
        int: new NumberField({ required: true, integer: true, min: 1, initial: 2, label: "L5R4EC.Trait.Intelligence" })
      }),

      rings: new SchemaField({
        air: new SchemaField({ rank: new NumberField({ required: true, integer: true, min: 1, initial: 2 }) }),
        earth: new SchemaField({ rank: new NumberField({ required: true, integer: true, min: 1, initial: 2 }) }),
        fire: new SchemaField({ rank: new NumberField({ required: true, integer: true, min: 1, initial: 2 }) }),
        water: new SchemaField({ rank: new NumberField({ required: true, integer: true, min: 1, initial: 2 }) }),
        // Le Vide a un Rang (comme les autres Anneaux, utilisé pour les jets
        // XgX) ET des Points de Vide : une réserve dépensable, distincte du
        // rang, qui se recharge en jeu (mécanique différente, pas un simple
        // "score").
        void: new SchemaField({
          rank: new NumberField({ required: true, integer: true, min: 0, initial: 2 }),
          points: new NumberField({ required: true, integer: true, min: 0, initial: 2 })
        })
      }),

      wounds: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),

      // TN d'Armure = 5 + (Réflexes x 5) + bonus de l'armure équipée + ce
      // bonus "autre" édité à la main (postures, capacités de maîtrise non
      // automatisées type Défense rang 5, Éventail de Guerre...). Le détail
      // (base/reflexesBonus/armorBonus/total) est calculé dans
      // SystemActor#_computeArmorTN, car il nécessite l'Item Armure équipé -
      // seul `otherBonus` est un vrai champ de schema, éditable par le joueur.
      armorTn: new SchemaField({
        otherBonus: new NumberField({ required: true, integer: true, initial: 0 })
      }),

      // Magie (Shugenja) : le rang d'école définit le rang de sort max
      // apprenable (avant bonus d'affinité), et sert de "rang de compétence"
      // dans le jet de lancer de sort (voir SystemActor#rollSpell). Une
      // affinité/déficience par Anneau (y compris Vide, au cas où) ajuste ce
      // jet et le rang max apprenable - voir module/rules/spellcasting.mjs.
      shugenja: new SchemaField({
        schoolRank: new NumberField({ required: true, integer: true, min: 0, max: 6, initial: 0 }),
        affinities: new SchemaField({
          air: new StringField({ required: true, choices: AFFINITY_CHOICES, initial: "none" }),
          earth: new StringField({ required: true, choices: AFFINITY_CHOICES, initial: "none" }),
          fire: new StringField({ required: true, choices: AFFINITY_CHOICES, initial: "none" }),
          water: new StringField({ required: true, choices: AFFINITY_CHOICES, initial: "none" }),
          void: new StringField({ required: true, choices: AFFINITY_CHOICES, initial: "none" })
        })
      }),

      // Emplacements de sorts : un pool par Anneau, calé sur le rang de
      // l'Anneau (voir prepareDerivedData pour max/available - dérivés, pas
      // dans le schema). Seul `spent` est un vrai champ, décrémenté/remis à
      // zéro manuellement (repos long) pour l'instant - pas d'automatisation
      // du repos. Le pool de Vide sert pour les sorts de Vide ET en bonus
      // pour n'importe quel autre Anneau (voir SystemActor#_consumeSpellSlot).
      spellSlots: new SchemaField({
        air: new SchemaField({ spent: new NumberField({ required: true, integer: true, min: 0, initial: 0 }) }),
        earth: new SchemaField({ spent: new NumberField({ required: true, integer: true, min: 0, initial: 0 }) }),
        fire: new SchemaField({ spent: new NumberField({ required: true, integer: true, min: 0, initial: 0 }) }),
        water: new SchemaField({ spent: new NumberField({ required: true, integer: true, min: 0, initial: 0 }) }),
        void: new SchemaField({ spent: new NumberField({ required: true, integer: true, min: 0, initial: 0 }) })
      }),

      // Rang d'Initié/École (Insight Rank au sens large, affiché dans le header).
      rank: new NumberField({ required: true, integer: true, min: 1, initial: 1 }),

      // XP : on stocke le total acquis et le total dépensé, la valeur
      // disponible est dérivée (voir prepareDerivedData) pour ne jamais
      // désynchroniser les deux.
      xp: new SchemaField({
        total: new NumberField({ required: true, integer: true, min: 0, initial: 40 }),
        spent: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        available: new NumberField({ required: true, integer: true, initial: 40 }) // dérivé, non éditable
      }),

      // Honneur/Gloire/Statut : un simple rang, édité uniquement par le MJ
      // (voir SystemActor#_preUpdate pour la protection, et le template
      // pour l'affichage lecture-seule côté joueur).
      // Honneur peut devenir négatif -> la fiche affiche "Infamie" à la place.
      honor: new SchemaField({
        rank: new NumberField({ required: true, integer: true, initial: 3 })
      }),

      glory: new SchemaField({
        rank: new NumberField({ required: true, integer: true, min: 0, initial: 1 })
      }),

      status: new SchemaField({
        rank: new NumberField({ required: true, integer: true, min: 0, initial: 1 })
      }),

      // Réputation : entièrement calculée (voir SystemActor#_computeReputation),
      // jamais éditée à la main.
      reputation: new SchemaField({
        rank: new NumberField({ required: true, integer: true, min: 0, initial: 1 }),
        points: new NumberField({ required: true, integer: true, min: 0, initial: 0 })
      }),

      // Souillure des Terres de l'Ombre : rang masqué par défaut (le joueur
      // ne le voit pas tant que le MJ ne clique pas sur l'icône oeil du header).
      taint: new SchemaField({
        rank: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        hidden: new foundry.data.fields.BooleanField({ initial: true })
      }),

      details: new SchemaField({
        clan: new StringField({ required: true, blank: true, label: "L5R4EC.Details.Clan" }),
        family: new StringField({ required: true, blank: true, label: "L5R4EC.Details.Family" }),
        school: new StringField({ required: true, blank: true, label: "L5R4EC.Details.School" }),
        biography: new HTMLField({ required: true, blank: true, label: "L5R4EC.Details.Biography" })
      })
    };
  }

  /** @override */
  prepareDerivedData() {
    const t = this.traits;
    const r = this.rings;
    r.air.rank = Math.min(t.awa, t.ref);
    r.earth.rank = Math.min(t.sta, t.wil);
    r.fire.rank = Math.min(t.agi, t.int);
    r.water.rank = Math.min(t.per, t.str);

    this.xp.available = this.xp.total - this.xp.spent;

    // Rang de blessure, malus associé et total max dérivés de l'Anneau de
    // Terre et de la Létalité choisie par le MJ (réglage système).
    const lethality = getLethality();
    const track = computeWoundTrack(this.wounds.value, r.earth.rank, lethality);
    this.wounds.max = track.max;
    this.wounds.rankIndex = track.rankIndex;
    this.wounds.rankKey = track.rankKey;
    this.wounds.rankLabelKey = track.rankLabelKey;
    this.wounds.penalty = track.penalty;
    this.wounds.isOut = track.isOut;

    // Emplacements de sorts max = rang de l'Anneau correspondant (voir
    // l'en-tête du champ spellSlots). r.void.rank existe déjà (Anneau de Vide).
    for (const ring of ["air", "earth", "fire", "water", "void"]) {
      const pool = this.spellSlots[ring];
      pool.max = r[ring].rank;
      pool.available = Math.max(0, pool.max - pool.spent);
    }
  }
}
