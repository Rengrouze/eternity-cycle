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

      reputation: new SchemaField({
        rank: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
        points: new NumberField({ required: true, integer: false, initial: 0 })
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
  }
}
