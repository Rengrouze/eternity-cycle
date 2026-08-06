/**
 * Les 4 armures de base (Core Rulebook p196), pour un ajout en un clic
 * depuis l'onglet Inventaire plutôt que de tout ressaisir à la main.
 */
export const DEFAULT_ARMORS = [
  {
    name: "Armure Ashigaru",
    armorType: "Ashigaru",
    tnBonus: 3,
    reduction: 1,
    price: "5 koku",
    description: "Bien moins coûteuse à produire que l'armure légère ou lourde, l'armure ashigaru est aussi plus légère, moins contraignante et moins protectrice. Elle protège la tête, le torse et le haut des jambes."
  },
  {
    name: "Armure Légère",
    armorType: "Légère",
    tnBonus: 5,
    reduction: 3,
    specialRules: "Porter une armure légère augmente de 5 le TN de tous les jets d'Athlétisme et de Discrétion.",
    price: "25 koku",
    description: "De loin l'armure la plus courante portée par les samouraïs des Grands Clans. Les plaques superposées protègent principalement le torse, la tête, le haut des bras et le haut des jambes."
  },
  {
    name: "Armure Lourde",
    armorType: "Lourde",
    tnBonus: 10,
    reduction: 5,
    specialRules: "Porter une armure lourde augmente de 5 le TN de tous les jets de Compétence utilisant Agilité ou Réflexes.",
    price: "40 koku",
    description: "Préférée par les troupes de première ligne, l'armure lourde protège tout le corps, y compris les bras, jambes, mains, pieds et le visage (kabuto)."
  },
  {
    name: "Armure de Monture",
    armorType: "Monture",
    tnBonus: 4,
    reduction: 4,
    specialRules: "Considérée comme une armure lourde pour tout effet mécanique spécifiant un type d'armure. +12 au TN au lieu de +4 tant que le porteur est à cheval. Porter cette armure augmente de 5 le TN des jets d'Agilité et de Réflexes, sauf à cheval.",
    price: "55 koku",
    description: "Version modifiée de l'armure légère, conçue pour les cavaliers : les plaques sont réorientées pour dévier les coups des troupes à pied."
  }
];
