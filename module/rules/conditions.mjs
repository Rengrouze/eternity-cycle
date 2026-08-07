/**
 * Effets conditionnels L5R 4e (Conditional Effects du Core Rulebook,
 * traduits/adaptés) - déclarés comme statuts Foundry standards (togglables
 * depuis le token HUD comme n'importe quel statut natif), pour que le MJ
 * n'ait rien à suivre à la main au-delà de cocher/décocher l'icône.
 *
 * L'automatisation MÉCANIQUE de chaque effet (malus de jet, TN d'Armure
 * particulier, restriction d'Action...) vit dans SystemActor (voir
 * #_applyConditionEffects, #rollAttack, #_computeArmorTN) - ce fichier ne
 * fait que déclarer la LISTE des statuts et exposer les constantes
 * numériques qu'elle utilise, pour éviter les valeurs magiques dupliquées.
 *
 * Texte de règle d'origine conservé dans les commentaires de chaque
 * constante, pour retrouver facilement la source si un chiffre est
 * contesté plus tard.
 */

/**
 * Déclarations pour CONFIG.statusEffects (voir boot.mjs) - `id` est la clé
 * lue par `actor.statuses.has(id)` partout ailleurs dans le code.
 */
export const CONDITIONS = [
  { id: "blinded", labelKey: "L5R4EC.Condition.Blinded", icon: "icons/svg/blind.svg" },
  { id: "dazed", labelKey: "L5R4EC.Condition.Dazed", icon: "icons/svg/daze.svg" },
  { id: "entangled", labelKey: "L5R4EC.Condition.Entangled", icon: "icons/svg/net.svg" },
  { id: "fasting", labelKey: "L5R4EC.Condition.Fasting", icon: "icons/svg/hazard.svg" },
  { id: "fatigued", labelKey: "L5R4EC.Condition.Fatigued", icon: "icons/svg/sleep.svg" },
  { id: "grappled", labelKey: "L5R4EC.Condition.Grappled", icon: "icons/svg/net.svg" },
  { id: "mountedHigher", labelKey: "L5R4EC.Condition.MountedHigher", icon: "icons/svg/wing.svg" },
  { id: "prone", labelKey: "L5R4EC.Condition.Prone", icon: "icons/svg/falling.svg" },
  { id: "stunned", labelKey: "L5R4EC.Condition.Stunned", icon: "icons/svg/paralysis.svg" }
];

/** Blinded : "-3k3 aux jets d'attaque à distance, -1k1 aux jets d'attaque de mêlée". */
export const BLINDED_PENALTY = { ranged: { roll: 3, keep: 3 }, melee: { roll: 1, keep: 1 } };

/** Blinded : "TN d'Armure de base = Réflexes + 5" (remplace le calcul normal, l'armure s'ajoute normalement par-dessus). */
export const BLINDED_ARMOR_TN_MULTIPLIER = 5;

/** Dazed : "-3k0 à toutes les actions". */
export const DAZED_PENALTY = { roll: 3, keep: 0 };

/** Prone : "-10 au TN d'Armure contre les attaques de mêlée", "-2k0 aux attaques avec une arme moyenne/petite", ne peut pas attaquer avec une arme grande. */
export const PRONE_ARMOR_TN_MELEE_PENALTY = -10;
export const PRONE_ATTACK_PENALTY = { roll: 2, keep: 0 };

/** Grappled/Stunned : "TN d'Armure = 5 + bonus d'armure" (remplace le calcul normal). */
export const GRAPPLED_STUNNED_BASE_ARMOR_TN = 5;

/** Mounted/Higher : "+1k0 aux jets d'attaque contre une cible non montée/plus basse". */
export const MOUNTED_HIGHER_BONUS = { roll: 1, keep: 0 };

/**
 * Fasting/Fatigued : volontairement PAS d'automatisation numérique - les
 * deux règles d'origine imposent un malus de ND qui s'AGGRAVE de +5 par
 * jour supplémentaire sans nourriture/repos, ce qui suppose un suivi de
 * calendrier/jours écoulés qu'aucun système actuel (Foundry ou ce système)
 * ne modélise ici. Seul l'automatisable est couvert : la case à cocher du
 * statut existe (rappel visuel + restriction de Posture Assaut pour
 * Fatigué, voir SystemActor#setStance), le reste (le malus de ND lui-même,
 * son augmentation quotidienne, la perte de Blessures en cas de Jeûne
 * prolongé) reste à la discrétion du MJ, comme les Capacités de Maîtrise
 * non automatisées (voir le commentaire d'en-tête de default-skills.mjs).
 */
