/**
 * Économie d'Action L5R 4e (homebrew de ce système, demandée pour encadrer
 * le combat - voir SystemActor#spendActionPoints/#drawWeapon et
 * module/hooks/combat-turn-reset.mjs pour l'intégration).
 *
 * Modèle retenu : chaque combattant dispose d'un budget de 2 "points
 * d'Action Simple" par tour (system.combat.actionPoints, remis à
 * ACTION_POINTS_PER_TURN au début de SON tour). Une Action Simple coûte 1
 * point, une Action Complexe coûte les 2 - ce qui reproduit exactement la
 * règle "soit 1 Action Complexe, soit 2 Actions Simples" sans avoir besoin
 * d'un champ séparé pour chaque type. Les Actions Gratuites ne consomment
 * jamais ce budget (comportement RAW - seule leur liste est encadrée, pas
 * leur nombre, sauf indication contraire du MJ).
 *
 * Ont une mécanique concrète dans ce système (attaquer, lancer un sort,
 * utiliser une Compétence, dégainer une arme, se déplacer, Garde, Empoignade,
 * se relever) - le reste (Katas, monter/descendre de cheval, bander un arc)
 * n'a pas encore de mécanique dédiée automatisée : elles restent listées ici
 * à titre de référence/rappel (voir ACTION_REFERENCE plus bas), point de
 * départ d'une passe future - même convention que les Capacités de Maîtrise
 * non automatisables (voir SystemActor#_applyMasteryBonuses).
 */

/** Coût en points d'Action Simple - une Action Complexe consomme le budget entier d'un coup. */
export const ACTION_COST = { FREE: 0, SIMPLE: 1, COMPLEX: 2 };

/** Budget de points d'Action Simple par tour (remis à cette valeur au début du tour du combattant). */
export const ACTION_POINTS_PER_TURN = 2;

/** Tailles d'Arme possibles (voir WeaponDataModel#size) - conditionne le coût pour la dégainer (voir #drawActionCost). */
export const WEAPON_SIZES = ["small", "medium", "large"];

/**
 * Coût de base (avant escalade liée aux Blessures, voir #escalateActionCost)
 * pour dégainer une Arme selon sa taille : Petite -> Action Gratuite, Moyenne/
 * Grande -> Action Simple (voir SystemActor#drawWeapon, qui vérifie AVANT
 * cet appel si une Capacité de Maîtrise (trigger "freeDraw") rend le
 * dégainage systématiquement gratuit, indépendamment de la taille).
 * @param {string} size  Une valeur de WEAPON_SIZES.
 * @returns {number}  Une valeur de ACTION_COST.
 */
export function drawActionCost(size) {
  return size === "small" ? ACTION_COST.FREE : ACTION_COST.SIMPLE;
}

/**
 * Escalade le coût d'une Action d'un cran par rang de Blessure "Impotent"
 * (crippled) : Libre -> Simple, Simple -> Complexe. Une Action déjà
 * Complexe ne monte pas plus haut (pas de palier au-delà dans la règle
 * demandée). Les rangs "Épuisé" (down, ne peut faire QUE des Actions
 * Libres, contre un Point de Vide) et "Hors de Combat"/"Mort" (isOut/isDead,
 * ne peut rien faire) sont gérés à part par SystemActor#spendActionPoints -
 * ce ne sont pas de simples décalages de coût mais des restrictions
 * complètes, donc hors du périmètre de cette fonction pure.
 * @param {number} cost  Une valeur de ACTION_COST (coût de base).
 * @param {string} woundRankKey  Une `key` de WOUND_RANKS (voir wound-track.mjs).
 * @returns {number}  Une valeur de ACTION_COST (coût après escalade).
 */
export function escalateActionCost(cost, woundRankKey) {
  if (woundRankKey !== "crippled") return cost;
  if (cost === ACTION_COST.FREE) return ACTION_COST.SIMPLE;
  if (cost === ACTION_COST.SIMPLE) return ACTION_COST.COMPLEX;
  return cost;
}

/**
 * Distance maximale (en mètres) qu'un personnage peut parcourir gratuitement
 * (Action Gratuite) ou via une Action de Mouvement Simple, en fonction de son
 * rang d'Anneau d'Eau - voir system.combat.distanceMovedThisTurn et le
 * panneau "Déplacement" de tab-combat.hbs. Dépasser `simple` nécessite de
 * "foncer" (dépenser une Action Simple ou Complexe supplémentaire pour
 * regagner ce même budget - équivalent maison du "Dash", non chiffré
 * précisément par le LdB, laissé à l'appréciation du MJ au-delà de ce point).
 * @param {number} waterRank
 * @returns {{free: number, simple: number}}
 */
export function computeMoveBudget(waterRank) {
  return { free: waterRank * 1.5, simple: waterRank * 3 };
}

/**
 * Budget de déplacement (voir #computeMoveBudget) ajusté pour l'Anneau d'Eau
 * EFFECTIF de cet Acteur - Aveuglé (voir module/rules/conditions.mjs)
 * considère l'Anneau d'Eau inférieur de 2 rangs pour le déplacement, jamais
 * négatif. Factorisé ici (au lieu de rester inline côté fiche) car utilisé à
 * la fois par CharacterSheet#_buildCombat (affichage) et
 * module/hooks/token-movement-tracking.mjs (blocage réel) - même convention
 * qu'un Acteur complet en paramètre que #buildInitiativeRollConfig
 * (module/rules/initiative.mjs).
 * @param {Actor} actor
 * @returns {{free: number, simple: number}}
 */
export function effectiveMoveBudget(actor) {
  const waterRank = actor.statuses?.has("blinded")
    ? Math.max(0, actor.system.rings.water.rank - 2)
    : actor.system.rings.water.rank;
  return computeMoveBudget(waterRank);
}

/**
 * Distance de corps-à-corps (mètres) - portée effective d'une Arme de mêlée
 * ou d'une Empoignade (voir SystemActor#declareGuard/#rollAttack,
 * grapple-mixin.mjs#initiateGrapple). Valeur RAW non chiffrée précisément par
 * le LdB pour ce système - une case de grille standard, comme la proximité
 * déjà exigée par la Manœuvre Garde.
 */
export const MELEE_RANGE_M = 1.5;

/**
 * Malus de maniement d'une Arme dans la main NON directrice (voir
 * SystemActor#rollAttack, system.combat.dominantHand/ambidextrous) - valeur
 * RAW du LdB (Core Rulebook, "Off-Hand Attacks"), pas une valeur inventée
 * pour ce système. Annulé par l'Avantage "Ambidextre" (voir
 * system.combat.ambidextrous - pas encore un vrai Item d'Avantage, juste un
 * indicateur en attendant un système d'Avantages/Désavantages complet).
 */
export const OFF_HAND_PENALTY = { rollPenalty: 3, keepPenalty: 3 };

/**
 * Référence complète des 3 catégories d'Action (LdB + demande utilisateur),
 * pour un futur panneau "aide-mémoire" sur la fiche - PAS encore affichée
 * nulle part, gardée ici comme unique source de vérité en attendant. `key`
 * vaut "automated" si une mécanique existe déjà dans ce système (attaquer,
 * lancer un sort, utiliser une Compétence, dégainer, se déplacer), sinon
 * "manual" (rappel textuel seulement, comme les Capacités de Maîtrise non
 * automatisées).
 */
export const ACTION_REFERENCE = {
  free: [
    { labelKey: "L5R4EC.Action.DrawSmallWeapon", status: "automated" },
    { labelKey: "L5R4EC.Action.Speak5Words", status: "manual" },
    { labelKey: "L5R4EC.Action.MoveFree", status: "automated" },
    { labelKey: "L5R4EC.Action.DrawSpellScroll", status: "manual" },
    { labelKey: "L5R4EC.Action.DropItem", status: "manual" }
  ],
  simple: [
    { labelKey: "L5R4EC.Action.ActivateKata", status: "manual" },
    { labelKey: "L5R4EC.Action.DrawWeapon", status: "automated" },
    { labelKey: "L5R4EC.Action.MoveSimple", status: "automated" },
    { labelKey: "L5R4EC.Action.Dismount", status: "manual" },
    { labelKey: "L5R4EC.Action.Grapple", status: "automated" },
    { labelKey: "L5R4EC.Action.PickUpItem", status: "manual" },
    { labelKey: "L5R4EC.Action.StoreSpellScroll", status: "manual" },
    { labelKey: "L5R4EC.Action.SpeakLong", status: "manual" },
    { labelKey: "L5R4EC.Action.StandUp", status: "automated" }
  ],
  complex: [
    { labelKey: "L5R4EC.Action.Attack", status: "automated" },
    { labelKey: "L5R4EC.Action.CastSpell", status: "automated" },
    { labelKey: "L5R4EC.Action.UseSkill", status: "automated" },
    { labelKey: "L5R4EC.Action.DrawBow", status: "manual" },
    { labelKey: "L5R4EC.Action.Mount", status: "manual" }
  ]
};
