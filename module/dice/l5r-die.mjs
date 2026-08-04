/**
 * Dé d10 "L5R" : contrairement au modificateur natif Foundry "x" (qui ajoute
 * un dé SÉPARÉ à la pool à chaque explosion), ce dé accumule la valeur dans
 * SON PROPRE résultat - exactement la règle L5R 4e ("le 10 est relancé et
 * ajouté au score, y compris les relances elles-mêmes").
 *
 * Gère aussi la règle de spécialisation : un premier résultat de 1 est
 * relancé une seule fois (pas de boucle, contrairement à l'explosion).
 */
export class L5RExplodingDie extends foundry.dice.terms.Die {
  /**
   * @param {object} termData
   * @param {number} [termData.explodeOn=10]     Valeur à partir de laquelle le dé explose.
   *                                              (ex: 9 pour certaines techniques avancées)
   * @param {boolean} [termData.explode=true]     Désactive l'explosion (ex: compétence non entraînée).
   * @param {boolean} [termData.rerollOnes=false] Compétence spécialisée : un 1 est relancé une fois.
   */
  constructor({ explodeOn = 10, explode = true, rerollOnes = false, ...termData } = {}) {
    super({ faces: 10, ...termData });
    this.explodeOn = explodeOn;
    this.explode = explode;
    this.rerollOnes = rerollOnes;
  }

  /**
   * @override
   * On ignore volontairement la résolution "physique" (dés réels/manuels)
   * de Foundry : ce dé n'a de sens que via son propre cumul logiciel.
   */
  async roll({ minimize = false, maximize = false } = {}) {
    const roll = { result: undefined, active: true };

    if (minimize) {
      roll.result = 1;
      roll.chain = [1];
      roll.discardedOne = null;
    } else if (maximize) {
      // Un plafond "théorique" n'a pas de sens avec une explosion infinie ;
      // on renvoie explodeOn comme simple repère d'affichage.
      roll.result = this.explodeOn;
      roll.chain = [this.explodeOn];
      roll.discardedOne = null;
    } else {
      let value = this.randomFace();
      let discardedOne = null;

      // Spécialisation : un 1 est relancé une seule fois, la nouvelle
      // valeur remplace le 1 (ce n'est PAS un cumul comme l'explosion).
      // On garde une trace du 1 remplacé pour l'affichage (grisé/barré).
      if (this.rerollOnes && value === 1) {
        discardedOne = 1;
        value = this.randomFace();
      }

      // Explosion : tant que la face obtenue déclenche l'explosion, on
      // relance et on additionne - y compris les relances elles-mêmes.
      const chain = [value];
      let total = value;
      while (this.explode && value >= this.explodeOn) {
        value = this.randomFace();
        chain.push(value);
        total += value;
      }

      roll.result = total;
      roll.chain = chain; // séquence des faces qui composent le total (>1 face = dé explosé)
      roll.discardedOne = discardedOne; // le 1 initial remplacé par la relance, ou null
    }

    this.results.push(roll);
    return roll;
  }

  /** @override - conserve explodeOn/explode/rerollOnes à la (dé)sérialisation. */
  static fromData(data) {
    const term = super.fromData(data);
    term.explodeOn = data.explodeOn ?? 10;
    term.explode = data.explode ?? true;
    term.rerollOnes = data.rerollOnes ?? false;
    return term;
  }

  /** @override */
  toJSON() {
    return { ...super.toJSON(), explodeOn: this.explodeOn, explode: this.explode, rerollOnes: this.rerollOnes };
  }
}
