/**
 * Types de flèches de base du Core Rulebook L5R 4e (p199), sur le modèle de
 * default-weapons.mjs. Utilisables avec n'importe quel arc (Yumi, Dai-Kyu,
 * Han-Kyu) - la Force de l'arc s'ajoute au premier chiffre du DR indiqué
 * (règle documentée sur l'Arme, pas encore automatisée).
 */
export const DEFAULT_AMMO = [
  {
    name: "Flèche Perce-Armure",
    damageRolled: 1,
    damageKept: 1,
    quantity: 20,
    price: "2 bu",
    description: "Utilisable avec n'importe quel arc. La Force de l'arc s'ajoute au premier chiffre du DR indiqué.",
    specialRules: "Ignore le bonus au TN d'Armure procuré par l'armure de la cible."
  },
  {
    name: "Flèche Coupe-Chair",
    damageRolled: 2,
    damageKept: 3,
    quantity: 20,
    price: "5 bu",
    description: "Utilisable avec n'importe quel arc. La Force de l'arc s'ajoute au premier chiffre du DR indiqué.",
    specialRules: "Double le bonus au TN d'Armure de la cible. Portée de l'arc divisée par deux avec ce type de flèche."
  },
  {
    name: "Flèche Bulbe Sifflant",
    damageRolled: 0,
    damageKept: 1,
    quantity: 20,
    price: "5 bu",
    description: "Utilisable avec n'importe quel arc. La Force de l'arc s'ajoute au premier chiffre du DR indiqué.",
    specialRules: "Émet un sifflement aigu caractéristique en vol - utile pour signaler ou effrayer plutôt que blesser."
  },
  {
    name: "Flèche Coupe-Corde",
    damageRolled: 1,
    damageKept: 1,
    quantity: 20,
    price: "3 bu",
    description: "Utilisable avec n'importe quel arc. La Force de l'arc s'ajoute au premier chiffre du DR indiqué.",
    specialRules: "Accorde 2 Relances Gratuites pour les Tirs Ciblés contre des objets inanimés. Portée de l'arc divisée par deux avec ce type de flèche."
  },
  {
    name: "Flèche Feuille de Saule",
    damageRolled: 2,
    damageKept: 2,
    quantity: 20,
    price: "1 bu",
    description: "Flèche standard, utilisable avec n'importe quel arc. La Force de l'arc s'ajoute au premier chiffre du DR indiqué.",
    specialRules: ""
  }
];
