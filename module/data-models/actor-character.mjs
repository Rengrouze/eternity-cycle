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
        void: new SchemaField({
          rank: new NumberField({ required: true, integer: true, min: 0, initial: 2 }),
          value: new NumberField({ required: true, integer: true, min: 0, initial: 2 })
        })
      }),

      wounds: new SchemaField({
        value: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        max: new NumberField({ required: true, integer: true, min: 0, initial: 10 })
      }),

      honor: new SchemaField({
        rank: new NumberField({ required: true, integer: true, min: 0, initial: 3 }),
        points: new NumberField({ required: true, integer: false, initial: 0 })
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
  }
}
