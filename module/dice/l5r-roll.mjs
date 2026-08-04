import { L5RExplodingDie } from "./l5r-die.mjs";

/**
 * Roll "Roll & Keep" façon L5R 4e : lance `rolled` dés (L5RExplodingDie),
 * garde les `keep` plus hauts résultats, ajoute un bonus fixe éventuel.
 *
 * Construite via la factory statique `build()` plutôt que depuis une chaîne
 * de formule : on n'a pas besoin de faire transiter ça par le parser de
 * formule de Foundry (pas de syntaxe utilisateur à supporter), donc on
 * construit directement l'arbre de termes.
 */
export class L5RRollKeep extends Roll {
  /**
   * @param {object} config
   * @param {number} config.rolled      Nombre de dés à lancer (déjà normalisé, voir roll-keep-math.mjs).
   * @param {number} config.keep        Nombre de dés à garder (déjà normalisé).
   * @param {number} [config.flatBonus=0]     Bonus fixe ajouté au total (débordement au-delà de 10g10).
   * @param {number} [config.woundPenalty=0]  Malus automatique lié au rang de blessure actuel (négatif ou 0).
   * @param {boolean} [config.explode=true]   Les dés explosent-ils sur `explodeOn` ?
   * @param {number} [config.explodeOn=10]    Valeur d'explosion (9 pour certaines techniques).
   * @param {boolean} [config.rerollOnes=false] Compétence spécialisée : relance simple des 1.
   * @returns {L5RRollKeep}
   */
  static build({ rolled, keep, flatBonus = 0, woundPenalty = 0, explode = true, explodeOn = 10, rerollOnes = false }) {
    const terms = [];
    for (let i = 0; i < rolled; i++) {
      if (i > 0) terms.push(new foundry.dice.terms.OperatorTerm({ operator: "+" }));
      terms.push(new L5RExplodingDie({ number: 1, explode, explodeOn, rerollOnes }));
    }

    const roll = this.fromTerms(terms);
    roll.keepCount = keep;
    roll.flatBonus = flatBonus;
    roll.woundPenalty = woundPenalty;
    return roll;
  }

  /** @override */
  async evaluate(options) {
    await super.evaluate(options);
    this._computeKeep();
    return this;
  }

  /**
   * Trie les dés par résultat décroissant, sépare gardés/écartés, et calcule
   * le total final (somme des gardés + bonus fixe). Calcule aussi une liste
   * d'objets d'affichage (couleurs) prête à consommer par le template de chat.
   */
  _computeKeep() {
    const dice = this.terms.filter((t) => t instanceof L5RExplodingDie);
    const sorted = [...dice].sort((a, b) => b.total - a.total);

    this.keptDice = sorted.slice(0, this.keepCount ?? dice.length);
    this.discardedDice = sorted.slice(this.keepCount ?? dice.length);

    for (const die of this.keptDice) die.options.kept = true;
    for (const die of this.discardedDice) die.options.kept = false;

    this.keptTotal = this.keptDice.reduce((sum, die) => sum + die.total, 0) + (this.flatBonus ?? 0) + (this.woundPenalty ?? 0);

    this.keptDiceDisplay = this.keptDice.map((die) => this._dieDisplay(die));
    this.discardedDiceDisplay = this.discardedDice.map((die) => this._dieDisplay(die));
  }

  /**
   * Construit les infos d'affichage d'un dé pour le template de chat :
   * - exploded: le dé a explosé au moins une fois (chaîne > 1 face) -> vert.
   * - isFinalOne: la dernière face de la chaîne vaut 1, donc reste "un 1
   *   final non relancé" -> rouge (que ce soit son unique face, ou la face
   *   obtenue après une relance de spécialisation qui retombe sur 1).
   * - discardedOne: le 1 initial remplacé par la relance de spécialisation,
   *   affiché grisé/barré à côté du résultat final.
   * @param {L5RExplodingDie} die
   */
  _dieDisplay(die) {
    const r = die.results[0] ?? {};
    const chain = r.chain ?? [r.result];
    const finalFace = chain[chain.length - 1];

    return {
      total: die.total,
      exploded: chain.length > 1,
      isFinalOne: finalFace === 1,
      discardedOne: r.discardedOne ?? null
    };
  }
}
