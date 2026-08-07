const { StringField, NumberField, HTMLField, ArrayField, SchemaField, BooleanField } = foundry.data.fields;

/**
 * Compétence L5R 4e. Toutes les compétences existent en tant qu'Items
 * (voir module/hooks/seed-default-skills.mjs pour le peuplement automatique
 * à la création d'un personnage), au rang 0 par défaut.
 */
export class SkillDataModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      // Les 4 catégories classiques L5R 4e.
      category: new StringField({
        required: true,
        choices: ["noble", "bugei", "merchant", "low"],
        initial: "noble"
      }),

      // Marque une compétence comme "compétence d'école" (utile au moment
      // de la création du personnage, pour distinguer les compétences
      // offertes par l'École des compétences classiques).
      isSchoolSkill: new BooleanField({ initial: false }),

      // Trait associé - modifiable par compétence (le Vide compte comme un
      // Trait possible pour cet usage, d'où la clé spéciale "void").
      trait: new StringField({ required: true, blank: false, initial: "awa" }),

      // Sous-type libre : "Connaissance (Dragons)", "Spectacle (Danse)"...
      // Vide = pas de sous-type pour cette compétence.
      subtype: new StringField({ required: true, blank: true, initial: "" }),

      rank: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),

      // Stocké en texte brut séparé par des virgules plutôt qu'un ArrayField :
      // beaucoup plus simple à éditer via un simple <input> sur la fiche.
      // Découpé en tableau à la volée là où c'est nécessaire (jets, affichage).
      specializations: new StringField({ required: true, blank: true, initial: "" }),

      // Capacités de maîtrise : à `rank` donné, affiche `description` dans le
      // panneau "Capacités de Maîtrise actives" (onglet Combat). `trigger`
      // détermine SI et OÙ le bonus s'applique automatiquement (voir
      // SystemActor#_applyMasteryBonuses/#_sumMasteryBonus pour le détail) :
      // - "passive"        : `value` ajouté en permanence à system[path] (ex:
      //                      Réputation) - le comportement historique, par défaut.
      // - "skillRoll"      : rollBonus/keepBonus/flatBonus ajoutés au jet de
      //                      CETTE Compétence (voir SystemActor#rollSkill).
      // - "damageRoll"     : rollBonus/keepBonus ajoutés au jet de dégâts
      //                      d'une Arme dont la Compétence associée porte le
      //                      nom de cette Compétence (SystemActor#rollAttack).
      // - "spellRoll"      : rollBonus/keepBonus/flatBonus ajoutés à TOUT jet
      //                      de Lancer de Sort si cette Compétence (ex: Art
      //                      de la Magie) atteint le rang requis - voir
      //                      SystemActor#rollSpell.
      // - "initiativeRoll" : rollBonus/keepBonus/flatBonus ajoutés au jet
      //                      d'Initiative - voir module/rules/initiative.mjs
      //                      (scanne TOUTES les Compétences, pas seulement
      //                      une associée à un jet précis).
      // - "armorTnDefense" : flatBonus ajouté au TN d'Armure, mais seulement
      //                      en posture Défense ou Pleine Défense - voir
      //                      SystemActor#_computeArmorTN (cas spécifique de
      //                      la Compétence "Défense").
      // - "weaponStrength" : flatBonus ajouté à la Force de l'Arc effective
      //                      d'une Arme à distance dont la Compétence
      //                      associée porte le nom de cette Compétence (ex:
      //                      Kyujutsu rang 7 -> Force de l'Arc +1) - voir
      //                      SystemActor#rollAttack.
      // - "voidRecovery"   : `value` = nombre de Points de Vide restaurés
      //                      (au lieu d'1 par défaut) si le jet de CETTE
      //                      Compétence est jugé réussi - affiche un bouton
      //                      "Récupérer X Points de Vide" sur la carte de
      //                      chat (voir SystemActor#rollSkill,
      //                      #_voidRecoveryAmount, module/chat/void-recovery-actions.mjs).
      //                      Présence d'AU MOINS une entrée à ce trigger sur
      //                      une Compétence (à n'importe quel rang) suffit à
      //                      faire apparaître le bouton pour CETTE
      //                      Compétence (récupère 1 par défaut si le rang
      //                      requis d'une entrée à valeur plus élevée n'est
      //                      pas atteint).
      // - "freeDraw"       : pas de valeur numérique - simple présence (rang
      //                      atteint) : dégainer une Arme dont l'associatedSkill
      //                      porte le nom de cette Compétence devient une
      //                      Action Gratuite, quelle que soit sa taille (ex:
      //                      Kenjutsu rang 5) - voir SystemActor#drawWeapon,
      //                      module/rules/actions.mjs#drawActionCost.
      // `dynamicRankBonus` : si vrai, ajoute EN PLUS le rang actuel de CETTE
      //                      Compétence en flatBonus (ex: Art de la Guerre
      //                      rang 5 -> "+rang à l'Initiative", une valeur qui
      //                      grandit avec le rang plutôt qu'un nombre fixe -
      //                      `value`/`flatBonus` resteraient à 0 dans ce cas).
      // `explodeOn`        : si renseigné (9 par ex.), remplace le seuil
      //                      d'explosion par défaut (10) du jet de dégâts
      //                      concerné (trigger "damageRoll" uniquement) - ex:
      //                      Kenjutsu rang 7 -> dés explosent sur 9 ou 10.
      // `conditionLabel`   : si renseigné, ce bonus n'est PAS appliqué
      //                      automatiquement (contrairement au comportement
      //                      par défaut pour son trigger) - il apparaît comme
      //                      une case à cocher dans la modale de jet
      //                      correspondante (le joueur déclare que la
      //                      situation s'applique), avec ce texte comme
      //                      libellé - ex: Armes d'Hast rang 5, "Cible
      //                      montée ou de grande taille". Voir
      //                      SystemActor#_sumMasteryBonus (les exclut du
      //                      calcul automatique) et
      //                      CharacterSheet#_buildConditionalBonuses.
      // Un bonus non automatisable pour l'instant (Action Gratuite au lieu de
      // Simple, relance gratuite, effet conditionné à un état non modélisé
      // comme le terrain/la monture/la taille de cible sans case à cocher
      // dédiée, mécanique de Duel non implémentée...) reste en "passive"
      // sans `path` : juste informatif dans le panneau, comme avant - voir
      // le commentaire d'en-tête de default-skills.mjs pour le détail
      // complet de la classification (ce qui est couvert, et pourquoi le
      // reste ne l'est pas encore).
      // Pas d'UI d'édition pour l'instant (rempli via les données par défaut
      // ou modifié manuellement) - "système de buff" demandé, toujours en
      // construction (voir aussi la règle maison de la Compétence rang 10 -
      // SystemActor#_freeAugmentBonus - un mécanisme séparé, indépendant de
      // ce tableau).
      masteryBonuses: new ArrayField(
        new SchemaField({
          rankRequired: new NumberField({ required: true, integer: true, min: 1 }),
          description: new StringField({ required: true, blank: true, initial: "" }),
          trigger: new StringField({
            required: true,
            choices: ["passive", "skillRoll", "damageRoll", "spellRoll", "initiativeRoll", "armorTnDefense", "weaponStrength", "voidRecovery", "freeDraw"],
            initial: "passive"
          }),
          path: new StringField({ required: true, blank: true, initial: "" }),
          value: new NumberField({ required: true, integer: false, initial: 0 }),
          rollBonus: new NumberField({ required: true, integer: true, initial: 0 }),
          keepBonus: new NumberField({ required: true, integer: true, initial: 0 }),
          flatBonus: new NumberField({ required: true, integer: true, initial: 0 }),
          dynamicRankBonus: new BooleanField({ initial: false }),
          explodeOn: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
          conditionLabel: new StringField({ required: true, blank: true, initial: "" })
        }),
        { initial: [] }
      ),

      description: new HTMLField({ required: true, blank: true })
    };
  }
}
