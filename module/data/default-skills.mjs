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
 * category      : "noble" | "bugei" | "merchant" | "low"
 * trait         : clé de Trait ("awa","agi","int","per","ref","sta","str","wil")
 *                 ou "void" pour le Vide.
 * isWeaponSkill : marque les compétences de maniement d'arme (utilisées pour
 *                 associer une Arme à sa Compétence - voir WEAPON_SKILL_NAMES
 *                 ci-dessous et module/data/default-weapons.mjs).
 *
 * masteryBonuses : capacités de maîtrise débloquées à un rang donné (voir
 * SystemActor#_applyMasteryBonuses). Chaque entrée a toujours une
 * `description` (affichée dans le panneau "Capacités de Maîtrise actives" de
 * l'onglet Combat, que le bonus soit automatisable ou non). Si `path` est
 * renseigné, la valeur est aussi ajoutée automatiquement à system[path] -
 * réservé aux bonus qui correspondent à un stat permanent existant (ex :
 * Réputation). La plupart des capacités de maîtrise L5R 4e sont contextuelles
 * (bonus à un jet précis, Action Libre au lieu de Simple, dégâts d'arme...) :
 * tant que les jets de dégâts et le système d'Actions/Postures ne sont pas
 * implémentés (voir roadmap), ces bonus restent affichés comme rappel dans
 * le panneau mais ne sont PAS injectés automatiquement dans un jet.
 */
export const DEFAULT_SKILLS = [
  // ============ Compétences Nobles ============
  {
    name: "Comédie",
    category: "noble",
    trait: "awa",
    description: "L'art de se déguiser.",
    masteryBonuses: [
      { rankRequired: 3, description: "Le TN pour créer un déguisement est réduit de 5." },
      { rankRequired: 5, description: "Le TN pour créer un déguisement est réduit de 10 (total)." },
      { rankRequired: 7, description: "Le TN pour créer un déguisement est réduit de 15 (total)." }
    ]
  },
  { name: "Art", category: "noble", trait: "int", description: "Faire littéralement de l'art (peinture, musique, poésie...). Compétence à sous-types." },
  {
    name: "Calligraphie",
    category: "noble",
    trait: "int",
    description: "Le dessin, rédiger des messages secrets.",
    masteryBonuses: [
      { rankRequired: 5, description: "+10 pour tenter de casser un code ou un chiffre." }
    ]
  },
  {
    name: "Courtisan",
    category: "noble",
    trait: "awa",
    description: "Convaincre, manipuler ; compétence utilisée dans de nombreuses techniques de courtisan.",
    masteryBonuses: [
      { rankRequired: 3, path: "reputation.rank", value: 3, description: "+3 Réputation en plus du total normalement indiqué par les Anneaux et rangs de Compétence." },
      { rankRequired: 5, description: "+1k0 sur tous les jets Contestés utilisant Courtisan." },
      { rankRequired: 7, path: "reputation.rank", value: 7, description: "+7 Réputation supplémentaires (en plus du bonus de rang 3, soit +10 au total)." }
    ]
  },
  {
    name: "Divination",
    category: "noble",
    trait: "int",
    description: "L'art de voir l'avenir.",
    masteryBonuses: [
      { rankRequired: 5, description: "Un second jet de Divination peut être tenté sans dépenser de Point de Vide." }
    ]
  },
  {
    name: "Étiquette",
    category: "noble",
    trait: "awa",
    description: "L'art de bien se comporter en société ; compétence de \"défense\" contre la courtisanerie.",
    masteryBonuses: [
      { rankRequired: 3, path: "reputation.rank", value: 3, description: "+3 Réputation en plus du total normalement indiqué par les Anneaux et rangs de Compétence." },
      { rankRequired: 5, description: "+1k0 sur tous les jets Contestés utilisant Étiquette." },
      { rankRequired: 7, path: "reputation.rank", value: 7, description: "+7 Réputation supplémentaires (en plus du bonus de rang 3, soit +10 au total)." }
    ]
  },
  { name: "Jeu", category: "noble", trait: "awa", description: "Jouer à des jeux (ex : Mahjong). Compétence à sous-types." },
  {
    name: "Enquête",
    category: "noble",
    trait: "per",
    description: "L'enquête littéralement : observer, interroger, fouiller.",
    masteryBonuses: [
      { rankRequired: 3, description: "Un second essai avec l'emphase Recherche peut être tenté sans augmentation du TN initial." },
      { rankRequired: 5, description: "+5 sur tous les jets Contestés utilisant Enquête." },
      { rankRequired: 7, description: "Un troisième essai avec l'emphase Recherche peut être tenté même si le second échoue." }
    ]
  },
  { name: "Connaissance", category: "noble", trait: "int", description: "Capacité à se souvenir de quelque chose dans un domaine précis. Compétence à sous-types (ex : Dragons, Shugenja, Alchimie...)." },
  {
    name: "Médecine",
    category: "noble",
    trait: "int",
    description: "Soigner les blessures, trouver des antidotes.",
    masteryBonuses: [
      { rankRequired: 5, description: "Le nombre de Blessures soignées sur un jet de Médecine réussi est augmenté de +1k0." }
    ]
  },
  {
    name: "Méditation",
    category: "noble",
    trait: "void",
    description: "L'art de méditer, de communier avec le grand tout, ou de récupérer des Points de Vide.",
    masteryBonuses: [
      { rankRequired: 3, description: "Un jet de Méditation réussi restaure jusqu'à 2 Points de Vide au lieu d'1." },
      { rankRequired: 5, description: "Le TN de tous les jets de Méditation (emphase Jeûne) est réduit de 5." },
      { rankRequired: 7, description: "Un jet de Méditation réussi restaure jusqu'à 3 Points de Vide." }
    ]
  },
  { name: "Spectacle", category: "noble", trait: "agi", description: "Danse, chant, art du conteur... Compétence à sous-types." },
  {
    name: "Sincérité",
    category: "noble",
    trait: "awa",
    description: "Utilisée quand quelqu'un cherche à savoir si on ment.",
    masteryBonuses: [
      { rankRequired: 5, description: "+5 sur tous les jets Contestés utilisant Sincérité." }
    ]
  },
  {
    name: "Art de la Magie",
    category: "noble",
    trait: "int",
    description: "L'art de converser avec les Kami.",
    masteryBonuses: [
      { rankRequired: 5, description: "+1k0 sur les jets d'invocation (Spell Casting)." }
    ]
  },
  {
    name: "Cérémonie du Thé",
    category: "noble",
    trait: "void",
    description: "L'art de la cérémonie du thé.",
    masteryBonuses: [
      { rankRequired: 5, description: "Tous les participants à la cérémonie récupèrent 2 Points de Vide au lieu d'1." }
    ]
  },

  // ============ Compétences de Bugei ============
  {
    name: "Athlétisme",
    category: "bugei",
    trait: "agi",
    description: "L'art de bouger, se mouvoir, soulever des choses.",
    masteryBonuses: [
      { rankRequired: 3, description: "Le Terrain Modéré n'entrave plus le mouvement ; le Terrain Difficile ne réduit plus l'Anneau d'Eau que de 1 (au lieu de 2)." },
      { rankRequired: 5, description: "Le personnage ne subit plus aucun malus de mouvement, quel que soit le terrain." },
      { rankRequired: 7, description: "+1,5 m (5 pieds) sur une Action de Mouvement par Tour (n'augmente pas le déplacement maximal possible)." }
    ]
  },
  {
    name: "Art de la Guerre",
    category: "bugei",
    trait: "per",
    description: "Analyse stratégique, maîtrise d'un champ de bataille, transmission d'ordres pendant une bataille, conviction des soldats.",
    masteryBonuses: [
      { rankRequired: 5, description: "Ajoute son rang en Art de la Guerre à son score d'Initiative lors d'Escarmouches." }
    ]
  },
  {
    name: "Défense",
    category: "bugei",
    trait: "ref",
    description: "Littéralement la capacité de se défendre.",
    masteryBonuses: [
      { rankRequired: 3, description: "Peut conserver le résultat d'un jet de Défense précédent plutôt que d'en refaire un tant que la Posture de Pleine Défense est maintenue." },
      { rankRequired: 5, description: "Le TN d'Armure est considéré supérieur de 3 en Posture de Défense et de Pleine Défense." },
      { rankRequired: 7, description: "Une Action Simple peut être effectuée en Posture de Pleine Défense (aucune attaque)." }
    ]
  },
  {
    name: "Équitation",
    category: "bugei",
    trait: "agi",
    description: "Chevaucher.",
    masteryBonuses: [
      { rankRequired: 3, description: "La Posture d'Attaque Totale peut être utilisée à cheval." },
      { rankRequired: 5, description: "Monter à cheval devient une Action Simple (au lieu de Complexe) ; mettre pied à terre devient une Action Libre (au lieu de Simple)." },
      { rankRequired: 7, description: "Monter à cheval devient une Action Libre (au lieu de Simple)." }
    ]
  },
  {
    name: "Chasse",
    category: "bugei",
    trait: "per",
    description: "La traque d'animaux ou d'humains.",
    masteryBonuses: [
      { rankRequired: 5, description: "+1k0 sur tous les jets de Discrétion effectués en milieu sauvage." }
    ]
  },
  {
    name: "Iaijutsu",
    category: "bugei",
    trait: "void",
    description: "L'art du duel (cas particulier : Trait par défaut Vide).",
    masteryBonuses: [
      { rankRequired: 3, description: "Dégainer un katana devient une Action Libre (au lieu de Simple)." },
      { rankRequired: 5, description: "Lors d'un Duel d'Iaijutsu, obtient une Relance Gratuite sur son jet de Concentration (Focus) / Vide pendant la Phase de Concentration." },
      { rankRequired: 7, description: "Pendant la phase d'Évaluation d'un Duel d'Iaijutsu, +2k2 (au lieu du +1k1 habituel) au jet de Concentration si le jet d'Évaluation dépasse celui de l'adversaire de 10 ou plus." }
    ]
  },
  {
    name: "Jiujutsu",
    category: "bugei",
    trait: "agi",
    description: "Le subtil art de plier les vêtements avec les gens à l'intérieur.",
    masteryBonuses: [
      { rankRequired: 3, description: "Les dégâts de toutes les attaques à mains nues sont augmentés de +1k0." },
      { rankRequired: 5, description: "L'usage de Jiujutsu confère une Relance Gratuite pour initier un corps-à-corps (Grapple)." },
      { rankRequired: 7, description: "Les dégâts de toutes les attaques à mains nues sont augmentés de +0k1 supplémentaire (+1k1 au total)." }
    ]
  },
  {
    name: "Armes à Chaîne",
    category: "bugei",
    trait: "agi",
    description: "Maniement des armes à chaîne.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "Une arme à chaîne peut être utilisée pour initier un corps-à-corps (Grapple)." },
      { rankRequired: 5, description: "+1k0 sur les jets Contestés contre un adversaire entravé ou saisi (Grapple) par l'arme." },
      { rankRequired: 7, description: "L'usage d'une arme à chaîne confère une Relance Gratuite pour une manœuvre de Désarmement ou de Renversement." }
    ]
  },
  {
    name: "Armes Lourdes",
    category: "bugei",
    trait: "agi",
    description: "Maniement des armes lourdes.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "La Réduction de l'adversaire est réduite de 2 lors d'une attaque à l'arme lourde." },
      { rankRequired: 5, description: "L'usage d'une arme lourde confère une Relance Gratuite pour une manœuvre de Renversement." },
      { rankRequired: 7, description: "Les dés de dégâts explosent sur un résultat de 9 ou 10 en utilisant une arme lourde." }
    ]
  },
  {
    name: "Kenjutsu",
    category: "bugei",
    trait: "agi",
    description: "Les épées.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "Le total de tous les jets de dégâts effectués avec une épée est augmenté de +1k0." },
      { rankRequired: 5, description: "Une épée peut être dégainée en Action Libre (au lieu de Simple)." },
      { rankRequired: 7, description: "Les dés de dégâts explosent sur un résultat de 9 ou 10 en utilisant une épée." }
    ]
  },
  {
    name: "Couteaux",
    category: "bugei",
    trait: "agi",
    description: "Maniement des couteaux.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "Les malus de main faible ne s'appliquent pas en utilisant un couteau." },
      { rankRequired: 5, description: "L'usage d'un sai ou d'un jitte confère une Relance Gratuite pour une manœuvre de Désarmement." },
      { rankRequired: 7, description: "L'usage de n'importe quel couteau confère une Relance Gratuite pour une manœuvre d'Attaque Supplémentaire." }
    ]
  },
  {
    name: "Kyujutsu",
    category: "bugei",
    trait: "agi",
    description: "Les arcs, ou lancer des choses avec précision.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "Encorder un arc devient une Action Simple (au lieu de Complexe)." },
      { rankRequired: 5, description: "La portée maximale de tout arc est augmentée de 50%." },
      { rankRequired: 7, description: "En utilisant n'importe quel arc, la Force de l'arc est augmentée de 1." }
    ]
  },
  {
    name: "Ninjutsu",
    category: "bugei",
    trait: "agi",
    description: "Le matériel de ninja.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "Les dégâts de toutes les armes de ninjutsu sont augmentés de +1k0." },
      { rankRequired: 5, description: "Les dés de dégâts des armes de ninjutsu explosent normalement (elles n'explosent pas par défaut)." },
      { rankRequired: 7, description: "Les dégâts de toutes les armes de ninjutsu sont augmentés de +0k1 supplémentaire (+1k1 au total)." }
    ]
  },
  {
    name: "Armes d'Hast",
    category: "bugei",
    trait: "agi",
    description: "Maniement des armes d'hast.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "+5 au score d'Initiative lors du premier Tour d'une Escarmouche en maniant une arme d'hast (ce Tour uniquement)." },
      { rankRequired: 5, description: "+1k0 aux jets de dégâts effectués avec une arme d'hast contre un adversaire monté ou significativement plus grand." },
      { rankRequired: 7, description: "Une arme d'hast peut être dégainée en Action Libre." }
    ]
  },
  {
    name: "Lances",
    category: "bugei",
    trait: "agi",
    description: "Maniement des lances.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "Lors du premier Tour d'une Escarmouche, ignore 3 points de Réduction sur les attaques de mêlée effectuées à la lance." },
      { rankRequired: 5, description: "Les attaques à distance effectuées à la lance voient leur portée maximale augmentée de 1,5 m (5 pieds)." },
      { rankRequired: 7, description: "Une lance peut être dégainée en Action Libre." }
    ]
  },
  {
    name: "Bâton",
    category: "bugei",
    trait: "agi",
    description: "Maniement du bâton.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "Le bonus au TN d'Armure de l'adversaire n'est plus doublé contre les attaques au bâton." },
      { rankRequired: 5, description: "L'usage d'un bâton confère une Relance Gratuite pour une manœuvre de Renversement." },
      { rankRequired: 7, description: "Un bâton de type Grand peut être dégainé en Action Libre ; un bâton de type Petit gagne +1k0 aux jets de dégâts." }
    ]
  },
  {
    name: "Teppudo",
    category: "bugei",
    trait: "int",
    description: "Maniement des armes à feu.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 5, description: "Charger une arme à feu prend une Action Complexe de moins." }
    ]
  },
  {
    name: "Éventails de Guerre",
    category: "bugei",
    trait: "agi",
    description: "Maniement des éventails de guerre.",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 3, description: "Les malus de main faible ne s'appliquent pas en utilisant un éventail de guerre." },
      { rankRequired: 5, description: "En utilisant un éventail de guerre, le TN d'Armure du porteur est augmenté de 1." },
      { rankRequired: 7, description: "En utilisant un éventail de guerre, le TN d'Armure du porteur est augmenté de 3 (au lieu de 1)." }
    ]
  },
  {
    name: "Canon",
    category: "bugei",
    trait: "per",
    description: "Viser et opérer une pièce d'artillerie (canon de siège).",
    isWeaponSkill: true,
    masteryBonuses: [
      { rankRequired: 5, description: "Le canon peut être opéré avec un demi-équipage (2 hommes au lieu de 4)." }
    ]
  },

  // ============ Compétences de Marchand ============
  {
    name: "Élevage",
    category: "merchant",
    trait: "awa",
    description: "L'art de parler aux animaux.",
    masteryBonuses: [
      { rankRequired: 3, description: "Les animaux couramment domestiqués (chiens, chevaux, faucons) peuvent être dressés pour être utilisés par d'autres." },
      { rankRequired: 5, description: "Un animal dressé encore en possession de son dresseur peut être commandé pour attaquer une cible désignée (il fuit s'il est gravement blessé, quels que soient les ordres)." },
      { rankRequired: 7, description: "Les animaux dressés par le personnage peuvent recevoir des ordres de façon non-verbale." }
    ]
  },
  {
    name: "Commerce",
    category: "merchant",
    trait: "int",
    description: "L'art de négocier, mais aussi la connaissance des prix du marché.",
    masteryBonuses: [
      { rankRequired: 5, description: "Peut augmenter ou diminuer le prix d'un objet acheté ou vendu de 20% au maximum." }
    ]
  },
  { name: "Artisanat", category: "merchant", trait: "int", description: "L'art de fabriquer des objets. Compétence à sous-types (ex : Forge, Poterie...)." },
  {
    name: "Ingénierie",
    category: "merchant",
    trait: "int",
    description: "Fabrication de bâtiments, d'armes de siège ; connaissance du bâtiment en général (donc comment détruire facilement un château).",
    masteryBonuses: [
      { rankRequired: 5, description: "+5 sur tout jet d'Ingénierie effectué dans le cadre d'un jet Coopératif ou Cumulatif." }
    ]
  },
  {
    name: "Navigation",
    category: "merchant",
    trait: "agi",
    description: "Se repérer sur mer ou sur terre, connaissance du ciel.",
    masteryBonuses: [
      { rankRequired: 5, description: "+5 sur tout jet de Navigation effectué dans le cadre d'un jet Coopératif ou Cumulatif." }
    ]
  },

  // ============ Compétences Dégradantes ============
  {
    name: "Contrefaçon",
    category: "low",
    trait: "agi",
    description: "Falsifier des documents ou objets.",
    masteryBonuses: [
      { rankRequired: 3, description: "+1k0 au résultat du jet de Contrefaçon pour fixer le TN du jet d'Enquête servant à la détecter." },
      { rankRequired: 5, description: "+1k0 sur tout jet visant à détecter un faux fabriqué par quelqu'un d'autre." },
      { rankRequired: 7, description: "+0k1 supplémentaire (+1k1 au total) au résultat du jet de Contrefaçon pour fixer le TN de détection." }
    ]
  },
  {
    name: "Intimidation",
    category: "low",
    trait: "wil",
    description: "Menacer, faire du chantage.",
    masteryBonuses: [
      { rankRequired: 5, description: "+5 sur tous les jets Contestés utilisant Intimidation." }
    ]
  },
  {
    name: "Passe-Passe",
    category: "low",
    trait: "agi",
    description: "Vol à la tire, crochetage, bref tout ce qui demande des doigts de fée.",
    masteryBonuses: [
      { rankRequired: 5, description: "L'emphase Dissimulation permet de cacher des armes de petite taille sur soi." }
    ]
  },
  {
    name: "Discrétion",
    category: "low",
    trait: "agi",
    description: "Se déplacer et agir sans être vu ou entendu.",
    masteryBonuses: [
      { rankRequired: 3, description: "Les Actions de Mouvement Simples effectuées en Discrétion permettent de se déplacer d'une distance égale à Eau x5." },
      { rankRequired: 5, description: "Les Actions de Mouvement Simples effectuées en Discrétion permettent de se déplacer d'une distance égale à Eau x10." },
      { rankRequired: 7, description: "Peut effectuer des Actions de Mouvement Libres normalement tout en restant Discret." }
    ]
  },
  {
    name: "Tentation",
    category: "low",
    trait: "awa",
    description: "La drague, convaincre quelqu'un par ses désirs (pas forcément sexuels).",
    masteryBonuses: [
      { rankRequired: 5, description: "+5 sur tous les jets Contestés utilisant Tentation." }
    ]
  }
];

/**
 * Noms des compétences de maniement d'arme (celles marquées isWeaponSkill
 * ci-dessus), pour construire un <select> de Compétence liée lors de la
 * création d'une Arme plutôt que de ressaisir le nom en texte libre.
 */
export const WEAPON_SKILL_NAMES = DEFAULT_SKILLS.filter((s) => s.isWeaponSkill).map((s) => s.name);
