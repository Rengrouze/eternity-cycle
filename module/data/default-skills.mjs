/**
 * Compétences peuplées automatiquement sur tout nouveau personnage
 * (voir module/hooks/seed-default-skills.mjs). Liste de base fournie par
 * l'utilisateur - trait par défaut indiqué mais modifiable par compétence.
 *
 * Volontairement UNE seule entrée par compétence, même pour celles qui
 * peuvent avoir des sous-types (Connaissance, Spectacle, Art, Artisanat,
 * Jeu) : le sous-type reste vide par défaut. Pour une compétence à sous-type
 * précis, utiliser le bouton "Ajouter une compétence" sur la fiche (ça crée
 * une nouvelle entrée avec le même nom, qui se regroupe automatiquement).
 *
 * category   : "noble" | "bugei" | "merchant" | "low"
 * trait      : clé de Trait ("awa","agi","int","per","ref","sta","str","wil")
 *              ou "void" pour le Vide.
 */
export const DEFAULT_SKILLS = [
  // ============ Compétences Nobles ============
  { name: "Comédie", category: "noble", trait: "awa", description: "L'art de se déguiser." },
  { name: "Art", category: "noble", trait: "int", description: "Faire littéralement de l'art (peinture, musique, poésie...). Compétence à sous-types." },
  { name: "Calligraphie", category: "noble", trait: "int", description: "Le dessin, rédiger des messages secrets." },
  {
    name: "Courtisan",
    category: "noble",
    trait: "awa",
    description: "Convaincre, manipuler ; compétence utilisée dans de nombreuses techniques de courtisan.",
    masteryBonuses: [{ rankRequired: 3, path: "reputation.rank", value: 3 }]
  },
  { name: "Divination", category: "noble", trait: "int", description: "L'art de voir l'avenir." },
  { name: "Étiquette", category: "noble", trait: "awa", description: "L'art de bien se comporter en société ; compétence de \"défense\" contre la courtisanerie." },
  { name: "Jeu", category: "noble", trait: "awa", description: "Jouer à des jeux (ex : Mahjong). Compétence à sous-types." },
  { name: "Enquête", category: "noble", trait: "per", description: "L'enquête littéralement : observer, interroger, fouiller." },
  { name: "Connaissance", category: "noble", trait: "int", description: "Capacité à se souvenir de quelque chose dans un domaine précis. Compétence à sous-types (ex : Dragons, Shugenja, Alchimie...)." },
  { name: "Médecine", category: "noble", trait: "int", description: "Soigner les blessures, trouver des antidotes." },
  { name: "Méditation", category: "noble", trait: "void", description: "L'art de méditer, de communier avec le grand tout, ou de récupérer des Points de Vide." },
  { name: "Spectacle", category: "noble", trait: "agi", description: "Danse, chant, art du conteur... Compétence à sous-types." },
  { name: "Sincérité", category: "noble", trait: "awa", description: "Utilisée quand quelqu'un cherche à savoir si on ment." },
  { name: "Art de la Magie", category: "noble", trait: "int", description: "L'art de converser avec les Kami." },
  { name: "Cérémonie du Thé", category: "noble", trait: "void", description: "L'art de la cérémonie du thé." },

  // ============ Compétences de Bugei ============
  { name: "Athlétisme", category: "bugei", trait: "agi", description: "L'art de bouger, se mouvoir, soulever des choses." },
  { name: "Art de la Guerre", category: "bugei", trait: "per", description: "Analyse stratégique, maîtrise d'un champ de bataille, transmission d'ordres pendant une bataille, conviction des soldats." },
  { name: "Défense", category: "bugei", trait: "ref", description: "Littéralement la capacité de se défendre." },
  { name: "Équitation", category: "bugei", trait: "agi", description: "Chevaucher." },
  { name: "Chasse", category: "bugei", trait: "per", description: "La traque d'animaux ou d'humains." },
  { name: "Iaijutsu", category: "bugei", trait: "void", description: "L'art du duel (cas particulier : Trait par défaut Vide)." },
  { name: "Jiujutsu", category: "bugei", trait: "agi", description: "Le subtil art de plier les vêtements avec les gens à l'intérieur." },
  { name: "Armes à Chaîne", category: "bugei", trait: "agi", description: "Maniement des armes à chaîne." },
  { name: "Armes Lourdes", category: "bugei", trait: "agi", description: "Maniement des armes lourdes." },
  { name: "Kenjutsu", category: "bugei", trait: "agi", description: "Les épées." },
  { name: "Couteaux", category: "bugei", trait: "agi", description: "Maniement des couteaux." },
  { name: "Kyujutsu", category: "bugei", trait: "agi", description: "Les arcs, ou lancer des choses avec précision." },
  { name: "Ninjutsu", category: "bugei", trait: "agi", description: "Le matériel de ninja." },
  { name: "Armes d'Hast", category: "bugei", trait: "agi", description: "Maniement des armes d'hast." },
  { name: "Lances", category: "bugei", trait: "agi", description: "Maniement des lances." },
  { name: "Bâton", category: "bugei", trait: "agi", description: "Maniement du bâton." },
  { name: "Teppudo", category: "bugei", trait: "int", description: "Maniement des armes à feu." },
  { name: "Éventails de Guerre", category: "bugei", trait: "agi", description: "Maniement des éventails de guerre." },

  // ============ Compétences de Marchand ============
  { name: "Élevage", category: "merchant", trait: "awa", description: "L'art de parler aux animaux." },
  { name: "Commerce", category: "merchant", trait: "int", description: "L'art de négocier, mais aussi la connaissance des prix du marché." },
  { name: "Artisanat", category: "merchant", trait: "int", description: "L'art de fabriquer des objets. Compétence à sous-types (ex : Forge, Poterie...)." },
  { name: "Ingénierie", category: "merchant", trait: "int", description: "Fabrication de bâtiments, d'armes de siège ; connaissance du bâtiment en général (donc comment détruire facilement un château)." },
  { name: "Navigation", category: "merchant", trait: "agi", description: "Se repérer sur mer ou sur terre, connaissance du ciel." },

  // ============ Compétences Dégradantes ============
  { name: "Contrefaçon", category: "low", trait: "agi", description: "Falsifier des documents ou objets." },
  { name: "Intimidation", category: "low", trait: "wil", description: "Menacer, faire du chantage." },
  { name: "Passe-Passe", category: "low", trait: "agi", description: "Vol à la tire, crochetage, bref tout ce qui demande des doigts de fée." },
  { name: "Discrétion", category: "low", trait: "agi", description: "Se déplacer et agir sans être vu ou entendu." },
  { name: "Tentation", category: "low", trait: "awa", description: "La drague, convaincre quelqu'un par ses désirs (pas forcément sexuels)." }
];
