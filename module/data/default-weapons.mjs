/**
 * Armes de base du Core Rulebook L5R 4e (+ Imperial Histories pour les
 * armes à feu, explosifs et le canon), pour peuplement rapide depuis
 * l'onglet Inventaire ou (à terme) un compendium - voir la tâche
 * "Compendium pack" du plan de reprise.
 *
 * Distances converties de pieds en mètres (1 pied ≈ 0,3048 m), arrondies à
 * une valeur ronde. DR = dés lancés/gardés, comme sur WeaponDataModel.
 * `isRanged`/`range`/`strengthRating` ne sont renseignés que pour les armes
 * réellement à distance (arcs, armes à feu, canon) ; les armes de mêlée
 * pouvant aussi être lancées (yari, wakizashi...) documentent cette option
 * en texte dans `specialRules` plutôt que via des champs dédiés.
 *
 * Certaines mécaniques (Force de l'arc ajoutée au DR de la flèche, dégâts de
 * zone des explosifs/du canon, artisanat d'explosifs) ne sont pas encore
 * automatisées : elles sont documentées en texte, à l'image de la règle des
 * arcs déjà actée dans WeaponDataModel.
 */
const RAW_WEAPONS = [
  // ============ Arcs et Flèches ============
  {
    name: "Dai-Kyu",
    associatedSkill: "Kyujutsu",
    damageRolled: 0,
    damageKept: 0,
    keywords: "Grand",
    isRanged: true,
    range: 150,
    strengthRating: 4,
    price: "25 koku",
    description: "Conçu pour être tiré à cheval, le dai-kyu est composé de plusieurs pièces de bois, de corne ou de tendon liées par de la colle. C'est l'un des arcs les plus puissants utilisés par les forces armées de Rokugan, presque aussi précieux pour un archer que son katana.",
    specialRules: "Force 4 (Force minimum 3 requise pour l'utiliser). Augmente de +10 le TN de tous les jets d'attaque s'il est utilisé à pied. La Force de l'arc s'ajoute au premier chiffre du DR de la flèche tirée. Une flèche tirée au-delà de la portée indiquée (jusqu'à deux fois cette portée) inflige un malus de -1k0 au jet d'attaque par tranche de 15 m supplémentaires ; tirer sur un adversaire au contact inflige un malus de -10 au TN du jet d'attaque."
  },
  {
    name: "Han-Kyu",
    associatedSkill: "Kyujutsu",
    damageRolled: 0,
    damageKept: 0,
    keywords: "Petit",
    isRanged: true,
    range: 30,
    strengthRating: 1,
    price: "6 koku",
    description: "Plus petit que le yumi et généralement plus facile à utiliser et à transporter, le han-kyu est un arc apprécié des magistrats itinérants ou des éclaireurs qui misent sur la rapidité et la discrétion. Il est typiquement taillé dans une seule pièce de bois ou de corne.",
    specialRules: "Force 1. Augmente de +10 le TN de tous les jets d'attaque s'il est utilisé à cheval. La Force de l'arc s'ajoute au premier chiffre du DR de la flèche tirée. Une flèche tirée au-delà de la portée indiquée (jusqu'à deux fois cette portée) inflige un malus de -1k0 au jet d'attaque par tranche de 15 m supplémentaires ; tirer sur un adversaire au contact inflige un malus de -10 au TN du jet d'attaque."
  },
  {
    name: "Yumi",
    associatedSkill: "Kyujutsu",
    damageRolled: 0,
    damageKept: 0,
    keywords: "Grand",
    isRanged: true,
    range: 75,
    strengthRating: 3,
    price: "20 koku",
    description: "L'arc de base porté par les archers d'infanterie et par les samouraïs voyageant indépendamment des armées ou d'autres groupes importants. Puissant, quoique un peu moins que le dai-kyu, sa courbure le rend peu pratique à cheval.",
    specialRules: "Force 3. Augmente de +10 le TN de tous les jets d'attaque s'il est utilisé à cheval. La Force de l'arc s'ajoute au premier chiffre du DR de la flèche tirée. Une flèche tirée au-delà de la portée indiquée (jusqu'à deux fois cette portée) inflige un malus de -1k0 au jet d'attaque par tranche de 15 m supplémentaires ; tirer sur un adversaire au contact inflige un malus de -10 au TN du jet d'attaque."
  },

  // ============ Armes à Chaîne ============
  {
    name: "Kusarigama",
    associatedSkill: "Armes à Chaîne",
    damageRolled: 0,
    damageKept: 2,
    keywords: "Grand",
    price: "5 koku",
    description: "L'arme à chaîne la plus courante, particulièrement populaire chez les samouraïs du Clan de la Mante. Il s'agit essentiellement d'un kama attaché à la base du manche à une chaîne de un mètre cinquante à deux mètres, dont l'autre extrémité porte un poids (cylindre ou sphère métallique).",
    specialRules: "L'extrémité kama inflige 0k2, l'extrémité lestée 0k1."
  },
  {
    name: "Kyoketsu-Shogi",
    associatedSkill: "Armes à Chaîne",
    damageRolled: 0,
    damageKept: 1,
    keywords: "Grand",
    price: "9 bu",
    description: "Plus un outil qu'une arme à proprement parler, le kyoketsu-shogi est un grappin métallique attaché à une longueur de chaîne ou, plus souvent, à une corde de soie dont l'autre extrémité est lestée. Populaire chez les ninjas et autres criminels.",
    specialRules: "Double le bonus au TN d'Armure de l'adversaire."
  },
  {
    name: "Manrikikusari",
    associatedSkill: "Armes à Chaîne",
    damageRolled: 1,
    damageKept: 1,
    keywords: "Grand",
    price: "3 koku",
    description: "Cette arme peu coûteuse est une chaîne lestée aux deux extrémités. Traditionnellement des poids cylindriques de petite à moyenne taille, bien qu'il soit devenu récemment plus courant dans les terres du Crabe d'utiliser de grands poids sphériques."
  },

  // ============ Explosifs et Nageteppo ============
  // Réservés en jeu aux organisations shinobi du Scorpion (Infiltrateurs,
  // Acteurs, Saboteurs) et aux Harceleurs Daidoji, seulement dans les
  // parties se déroulant après l'Ère du Cerf Blanc - à valider avec le MJ.
  {
    name: "Nageteppo (Fumée)",
    associatedSkill: "Ninjutsu",
    damageRolled: 1,
    damageKept: 1,
    keywords: "Ninja, Petit",
    isRanged: true,
    range: 10,
    price: "Fabriqué (voir Artisanat : Explosifs)",
    description: "Petit dispositif fragile en forme d'œuf contenant un mélange de poudre à canon et de substances alchimiques. Utilisé pour semer la confusion pendant une embuscade ou couvrir une retraite.",
    specialRules: "Le jeter est une Action Simple. À l'impact, dégage un nuage de fumée blanche et opaque d'environ 4,5 m de diamètre (ceux à l'intérieur sont considérés Aveugles) durant 5 Tours, sauf vent fort. Un coup direct inflige 1k1 par Tour pendant 2 Tours (ou jusqu'à extinction). Fabrication : Artisanat (Explosifs) / Intelligence à TN 25, nécessite du poivre gaijin et du matériel alchimique ; un échec sous TN 10 provoque une petite explosion infligeant 2k1."
  },
  {
    name: "Nageteppo (Incendiaire)",
    associatedSkill: "Ninjutsu",
    damageRolled: 3,
    damageKept: 2,
    keywords: "Ninja, Petit",
    isRanged: true,
    range: 8,
    price: "Fabriqué (voir Artisanat : Explosifs)",
    description: "Plus imposant et plus délicat à lancer que son équivalent fumigène, l'incendiaire sert surtout à déclencher des feux lors de raids ou d'attaques surprises, par exemple contre un dépôt de ravitaillement ennemi.",
    specialRules: "Le jeter est une Action Simple. À l'impact, s'embrase violemment et enflamme tout ce qui se trouve dans un rayon de 1,5 m. Un coup direct inflige 3k2 par Tour pendant 3 Tours (ou jusqu'à extinction) ; un personnage pris dans le rayon de projection subit 1k1 par Tour. Le feu ignore 3 points de Réduction. Fabrication : Artisanat (Explosifs) / Intelligence à TN 25, nécessite du poivre gaijin et du matériel alchimique ; un échec sous TN 10 provoque une petite explosion infligeant 3k2."
  },
  {
    name: "Charge de Démolition",
    associatedSkill: "",
    damageRolled: 9,
    damageKept: 6,
    keywords: "Ninja, Grand",
    price: "Fabriqué (voir Artisanat : Explosifs)",
    description: "Utilisée pour détruire ponts ou bâtiments, ouvrir une brèche dans un mur ou un château, ou plus rarement posée en mine sur un champ de bataille. Doit être détonée en y introduisant une flamme (flèche enflammée, mèche, mécanisme).",
    specialRules: "Dégâts de type poudre à canon : ignorent la Réduction sur les cibles vivantes, et ignorent 20 points de Réduction sur les cibles inanimées (bâtiments, châteaux...). Dégâts en zone : 9k6 dans un rayon de 3 m (10 pieds), 7k5 jusqu'à 9 m (30 pieds), 4k3 jusqu'à 15 m (50 pieds). Fabrication : Artisanat (Explosifs) / Intelligence à TN 30, nécessite du poivre gaijin ; un échec provoque une explosion infligeant les dégâts normaux de la charge. Mise en place : Ingénierie (Siège) / Intelligence à TN 30, ou Artisanat (Explosifs) / Intelligence à TN 20 - quinze minutes par charge ; rater le jet de 15 points ou plus provoque une détonation immédiate."
  },

  // ============ Armes à Feu ============
  // La poudre à canon est un crime impérial en Rokugan - possession = perte
  // d'Honneur au choix du MJ, et provoque un effet de Peur chez les Rokugani.
  {
    name: "Pistolet",
    associatedSkill: "Teppudo",
    damageRolled: 3,
    damageKept: 2,
    keywords: "Petit, Gaijin",
    isRanged: true,
    range: 6,
    price: "Non disponible à la vente (crime impérial)",
    description: "Arme à feu de poing d'origine gaijin. Le DR d'un pistolet est modifié par la Perception plutôt que par la Force.",
    specialRules: "La possession d'un pistolet est un crime impérial et devrait entraîner une perte d'Honneur (montant au choix du MJ). Ignore le bonus au TN d'Armure ainsi que toute Réduction procurée par une armure ou une résistance naturelle."
  },
  {
    name: "Mousquet",
    associatedSkill: "Teppudo",
    damageRolled: 4,
    damageKept: 3,
    keywords: "Grand, Gaijin",
    isRanged: true,
    range: 46,
    price: "Non disponible à la vente (crime impérial)",
    description: "Arme à feu longue d'origine gaijin. Le DR d'un mousquet est modifié par la Perception plutôt que par la Force. Certaines cultures gaijin montent une courte lame à son extrémité pour un usage de mêlée improvisé.",
    specialRules: "La possession d'un mousquet est un crime impérial et devrait entraîner une perte d'Honneur (montant au choix du MJ). Ignore le bonus au TN d'Armure ainsi que toute Réduction procurée par une armure ou une résistance naturelle. Équipé d'une baïonnette, utilisable en mêlée avec la compétence Armes d'Hast, DR 2k2."
  },

  // ============ Armes Lourdes ============
  // Utilisées à deux mains.
  {
    name: "Dai Tsuchi",
    associatedSkill: "Armes Lourdes",
    damageRolled: 5,
    damageKept: 2,
    keywords: "Grand",
    price: "15 koku",
    description: "Massif marteau de guerre à deux mains, populaire dans le Clan du Crabe. L'un des outils les plus efficaces des samouraïs face aux créatures massives et bien blindées des Terres de l'Ombre."
  },
  {
    name: "Masakari",
    associatedSkill: "Armes Lourdes",
    damageRolled: 2,
    damageKept: 3,
    keywords: "Moyen",
    price: "8 koku",
    description: "En réalité une hache à une main, variante des haches utilisées par les bûcherons. Nettement plus petite que les autres armes lourdes, mais maniée de la même façon."
  },
  {
    name: "Ono",
    associatedSkill: "Armes Lourdes",
    damageRolled: 0,
    damageKept: 4,
    keywords: "Grand",
    price: "20 koku",
    description: "Grande hache à deux mains capable d'abattre un arbre ou de trancher un membre sans difficulté. La force canalisée dans le fin tranchant de la lame en fait sans doute l'arme personnelle la plus dévastatrice qu'un guerrier entraîné puisse manier."
  },
  {
    name: "Tetsubo",
    associatedSkill: "Armes Lourdes",
    damageRolled: 3,
    damageKept: 3,
    keywords: "Grand",
    price: "20 koku",
    description: "Arme emblématique de nombreux grands héros du Clan du Crabe. Essentiellement une masse métallique cloutée d'acier (parfois de jade), sans égale pour briser armures et cibles endurcies."
  },

  // ============ Couteaux ============
  // Peuvent être lancés comme arme à distance jusqu'à 6 m (20 pieds).
  {
    name: "Aiguchi / Tanto",
    associatedSkill: "Couteaux",
    damageRolled: 1,
    damageKept: 1,
    keywords: "Petit",
    price: "1 koku",
    description: "Couteaux simples et basiques, ne différant que par la présence (aiguchi) ou l'absence (tanto) d'une garde. Beaucoup de samouraïs portent un tanto pour des usages de toilette.",
    specialRules: "Peut être lancé jusqu'à 6 m (20 pieds)."
  },
  {
    name: "Jitte / Sai",
    associatedSkill: "Couteaux",
    damageRolled: 1,
    damageKept: 1,
    keywords: "Petit",
    price: "5 bu",
    description: "Adaptés d'outils agricoles, ce sont des cylindres d'acier d'une trentaine de centimètres à pointe émoussée, munis de fourches métalliques (une pour le jitte, deux symétriques pour le sai). Le jitte est un symbole reconnu de charge magistrale.",
    specialRules: "Peut être lancé jusqu'à 6 m (20 pieds). Arme idéale pour désarmer un adversaire sans lui infliger de dégâts significatifs."
  },
  {
    name: "Kama",
    associatedSkill: "Couteaux",
    damageRolled: 0,
    damageKept: 2,
    keywords: "Paysan, Petit",
    price: "5 bu",
    description: "Improvisée à partir d'une faucille, la grande majorité des kama en usage dans l'Empire servent encore aux champs. C'est aussi l'arme emblématique de nombreux samouraïs de la Mante, en particulier de la famille Yoritomo.",
    specialRules: "Peut être lancé jusqu'à 6 m (20 pieds)."
  },

  // ============ Armes de Ninjutsu ============
  {
    name: "Sarbacane",
    associatedSkill: "Ninjutsu",
    damageRolled: 0,
    damageKept: 0,
    keywords: "Moyen",
    isRanged: true,
    range: 0,
    price: "8 zeni",
    description: "Tube servant à propulser de petites fléchettes empoisonnées ou non par le souffle.",
    specialRules: "Portée non précisée par la source. Triple le bonus au TN d'Armure de l'adversaire. Inflige 1 Blessure fixe (pas un jet de dés) ; la maîtrise en Ninjutsu porte ce dégât à 1k1 au rang 3 et 2k1 au rang 7. Recharger est une Action Gratuite."
  },
  {
    name: "Shuriken",
    associatedSkill: "Ninjutsu",
    damageRolled: 1,
    damageKept: 1,
    keywords: "Petit",
    isRanged: true,
    range: 8,
    price: "2 bu",
    description: "Petite lame de jet en étoile, discrète et rapide à dégainer.",
    specialRules: "Peut être lancé jusqu'à 8 m (25 pieds)."
  },
  {
    name: "Tsubute",
    associatedSkill: "Ninjutsu",
    damageRolled: 1,
    damageKept: 1,
    keywords: "Petit",
    isRanged: true,
    range: 9,
    price: "1 bu",
    description: "Petit projectile de jet, souvent une simple pierre travaillée.",
    specialRules: "Peut être lancé jusqu'à 9 m (30 pieds)."
  },

  // ============ Armes d'Hast ============
  {
    name: "Bisento",
    associatedSkill: "Armes d'Hast",
    damageRolled: 3,
    damageKept: 3,
    keywords: "Grand",
    price: "12 koku",
    description: "Manche de bois surmonté d'une lourde lame d'épée, plus lourde que celle d'un katana ou d'un nagamaki - dangereusement déséquilibrée entre des mains inexpérimentées. Populaire chez certaines sectes de sohei, les moines guerriers."
  },
  {
    name: "Nagamaki",
    associatedSkill: "Armes d'Hast",
    damageRolled: 2,
    damageKept: 3,
    keywords: "Grand",
    price: "8 koku",
    description: "Essentiellement une lame d'épée (de facture moins fine que celle du katana) fixée à une courte perche de bois - une arme plus légère, maniée à une main, combinant les vertus de l'épée et le levier d'une arme d'hast."
  },
  {
    name: "Naginata",
    associatedSkill: "Armes d'Hast",
    damageRolled: 3,
    damageKept: 2,
    keywords: "Grand, Samouraï",
    price: "10 koku",
    description: "L'arme d'hast la plus respectée de Rokugan, particulièrement prisée des samouraïs-ko et des guerriers du Clan du Phénix. Similaire au bisento mais plus légère et plus longue que le nagamaki."
  },
  {
    name: "Sasumata",
    associatedSkill: "Armes d'Hast",
    damageRolled: 0,
    damageKept: 2,
    keywords: "Grand",
    price: "6 koku",
    description: "Surnommée l'« attrape-homme » : une perche de bois d'environ 1,20 m terminée par une lame barbelée en croissant, conçue à l'origine pour immobiliser sans infliger de dégâts. Utilisée par les magistrats pour maîtriser samouraïs ivres ou indisciplinés.",
    specialRules: "Peut être utilisée pour initier et maintenir une Empoignade."
  },
  {
    name: "Sodegarami",
    associatedSkill: "Armes d'Hast",
    damageRolled: 1,
    damageKept: 1,
    keywords: "Grand",
    price: "6 koku",
    description: "Là où le sasumata capture en immobilisant, le sodegarami vise à entraver en accrochant les vêtements de la cible : une perche de bois terminée par une tête métallique en T couverte de crochets et de barbes.",
    specialRules: "Peut être utilisée pour initier et maintenir une Empoignade."
  },

  // ============ Lances ============
  {
    name: "Kumade",
    associatedSkill: "Lances",
    damageRolled: 1,
    damageKept: 1,
    keywords: "Grand, Paysan",
    price: "3 bu",
    description: "Un râteau, essentiellement : manche de bois avec une pointe métallique acérée à une extrémité et une série de crochets métalliques à l'autre. Sa construction généralement fragile explique qu'il n'ait jamais vraiment été adopté comme arme.",
    specialRules: "Se brise si elle inflige plus de 25 Blessures en une seule attaque."
  },
  {
    name: "Mai Chong",
    associatedSkill: "Lances",
    damageRolled: 0,
    damageKept: 3,
    keywords: "Grand",
    price: "20 koku",
    description: "Arme curieuse et unique, développée et utilisée presque exclusivement par les samouraïs du Clan du Sanglier dans les Montagnes du Crépuscule. Perche de 2,40 m à pointe métallique triple (une pointe avant, deux latérales) avec deux pics permettant taille et estoc.",
    specialRules: "Peut être lancé avec précision jusqu'à 8 m (25 pieds)."
  },
  {
    name: "Lance",
    associatedSkill: "Lances",
    damageRolled: 3,
    damageKept: 4,
    keywords: "Grand",
    price: "20 koku",
    description: "Arme adaptée de cultures gaijin, quasiment inconnue en dehors des rangs des samouraïs Licorne ou Bœuf. Utilisée uniquement à cheval, calée sous l'épaule du cavalier, pointe en avant, lors d'une charge au galop.",
    specialRules: "Le DR indiqué ne s'applique que si la lance est utilisée à cheval pour une attaque suivant directement une Action de Mouvement. Dans tout autre cas, elle possède un DR de 1k2. L'utiliser en mêlée sans Action de Mouvement augmente le TN de tous les jets d'attaque de +5 à cheval et +10 à pied. La lance se brise si elle inflige plus de 30 Blessures en une seule attaque."
  },
  {
    name: "Nage-Yari",
    associatedSkill: "Lances",
    damageRolled: 1,
    damageKept: 2,
    keywords: "Moyen",
    price: "3 koku",
    description: "Essentiellement un javelot : version plus courte mais légèrement plus lourde du yari, utilisable efficacement en mêlée ou lancée sur de courtes distances.",
    specialRules: "Peut être lancé avec précision jusqu'à 15 m (50 pieds)."
  },
  {
    name: "Yari",
    associatedSkill: "Lances",
    damageRolled: 2,
    damageKept: 2,
    keywords: "Grand",
    price: "5 koku",
    description: "Lance de base, longue de 1,80 à 2,40 m, maniée à deux mains à pied et à une main à cheval. Typiquement distribuée aux légions ashigaru et aux forces anti-cavalerie.",
    specialRules: "Peut être lancé jusqu'à 9 m (30 pieds), avec un DR de 1k2 lorsqu'il est lancé."
  },

  // ============ Bâton ============
  // Double le bonus au TN d'Armure de l'adversaire (peu efficaces contre les cibles blindées).
  {
    name: "Bo",
    associatedSkill: "Bâton",
    damageRolled: 1,
    damageKept: 2,
    keywords: "Grand",
    price: "2 bu",
    description: "L'arme la plus simple et la plus courante de l'Empire : un bâton de bois de 1,50 à 1,80 m, utilisé comme bâton de marche par les voyageurs et les moines, et faisant office d'arme pour les plus téméraires.",
    specialRules: "Double le bonus au TN d'Armure de l'adversaire."
  },
  {
    name: "Jo",
    associatedSkill: "Bâton",
    damageRolled: 0,
    damageKept: 2,
    keywords: "Moyen",
    price: "1 bu",
    description: "Essentiellement la moitié d'un bo : un court bâton d'environ 90 cm, souvent utilisé par paires pour enchaîner de rapides coups percutants.",
    specialRules: "Double le bonus au TN d'Armure de l'adversaire."
  },
  {
    name: "Machi-Kanshisha",
    associatedSkill: "Bâton",
    damageRolled: 0,
    damageKept: 2,
    keywords: "Moyen",
    price: "20 koku",
    description: "Arme très inhabituelle : une pipe à fumer métallique, tube creux d'environ un mètre, pouvant aussi assommer d'un coup bien placé. Vue presque exclusivement entre les mains de la famille Kaeru.",
    specialRules: "Double le bonus au TN d'Armure de l'adversaire."
  },
  {
    name: "Nunchaku",
    associatedSkill: "Bâton",
    damageRolled: 1,
    damageKept: 2,
    keywords: "Paysan, Petit",
    price: "3 bu",
    description: "Outil de battage adapté : deux manches de bois d'environ 30 cm reliés par une chaîne de 30 cm. Piètre arme dans des mains inexpérimentées, redoutable entre des mains entraînées.",
    specialRules: "Double le bonus au TN d'Armure de l'adversaire."
  },
  {
    name: "Sang Kauw",
    associatedSkill: "Bâton",
    damageRolled: 1,
    damageKept: 2,
    keywords: "Moyen",
    price: "10 koku",
    description: "Arme peu commune réservée aux pratiquants de styles exotiques : perche de bois d'un mètre à un mètre vingt avec une pointe métallique à chaque extrémité, existant en variante « lame en croissant » ou « bouclier ».",
    specialRules: "Double le bonus au TN d'Armure de l'adversaire. Variante « bouclier » : DR 2k1 au lieu de 1k2."
  },
  {
    name: "Tonfa",
    associatedSkill: "Bâton",
    damageRolled: 0,
    damageKept: 3,
    keywords: "Moyen, Paysan",
    price: "5 bu",
    description: "À l'origine la poignée d'une meule. Manche de bois de la longueur de l'avant-bras avec une poignée latérale permettant de le tenir le long du bras : outil défensif efficace, mais aussi arme offensive une fois tourné.",
    specialRules: "Double le bonus au TN d'Armure de l'adversaire."
  },

  // ============ Épées ============
  {
    name: "Katana",
    associatedSkill: "Kenjutsu",
    damageRolled: 3,
    damageKept: 2,
    keywords: "Moyen, Samouraï",
    price: "Non disponible à la vente (arme symbolique, transmise ou offerte)",
    description: "L'arme quintessentielle de la caste des samouraïs, représentant l'âme de celui qui la porte. Généralement transmise de génération en génération au sein d'une famille.",
    specialRules: "Un personnage peut dépenser un Point de Vide pour augmenter un jet de dégâts fait avec un katana de 1k1 (les Points de Vide ne peuvent normalement pas être dépensés pour augmenter les dégâts). Un seul Point de Vide peut être dépensé ainsi par tour, même avec une capacité permettant d'en dépenser plusieurs."
  },
  {
    name: "Ninja-to",
    associatedSkill: "Kenjutsu",
    damageRolled: 2,
    damageKept: 2,
    keywords: "Moyen, Ninja",
    price: "5 koku",
    description: "Aussi honni que le katana est révéré, le ninja-to est l'arme de prédilection des ninjas, qui l'emploient aussi bien au combat que pour escalader. Grossièrement forgé, peu esthétique et facile à remplacer.",
    specialRules: "Arme moyenne, mais considérée comme petite pour la dissimulation. Se brise si elle inflige plus de 40 Blessures en une seule attaque."
  },
  {
    name: "No-Dachi",
    associatedSkill: "Kenjutsu",
    damageRolled: 3,
    damageKept: 3,
    keywords: "Grand",
    price: "30 koku",
    description: "Sans doute la plus grande arme couramment maniée par les samouraïs, semblable au katana mais longue de 1,50 à 2,10 m. Conçue à l'origine comme arme anti-cavalerie, redoutable dans les mains d'un bushi entraîné."
  },
  {
    name: "Parangu",
    associatedSkill: "Kenjutsu",
    damageRolled: 2,
    damageKept: 2,
    keywords: "Moyen, Paysan",
    price: "10 bu",
    description: "Essentiellement une machette : fine lame d'acier non plié utilisée pour dégager la végétation. Populaire à bord des navires de la Mante pour couper cordages et tissus sans risquer une vraie lame.",
    specialRules: "Se brise si elle inflige plus de 30 Blessures en une seule attaque."
  },
  {
    name: "Cimeterre",
    associatedSkill: "Kenjutsu",
    damageRolled: 2,
    damageKept: 3,
    keywords: "Moyen",
    price: "20 koku",
    description: "Lourde lame courbe originaire de loin au-delà des frontières de l'Empire Émeraude, rapportée par le Clan de la Licorne après huit siècles d'errance. Rarement forgée en acier plié, elle sert surtout aux samouraïs Licorne, en particulier la famille Moto."
  },
  {
    name: "Wakizashi",
    associatedSkill: "Kenjutsu",
    damageRolled: 2,
    damageKept: 2,
    keywords: "Moyen, Samouraï",
    price: "15 koku",
    description: "Là où le katana représente l'âme d'un samouraï, le wakizashi représente son honneur. Chaque membre de la caste samouraï en possède un, même s'il n'est pas toujours porté au côté. C'est avec le wakizashi que se pratique le rituel du seppuku.",
    specialRules: "Peut être lancé jusqu'à 6 m (20 pieds) comme arme à distance."
  },

  // ============ Éventails de Guerre ============
  {
    name: "Éventail de Guerre",
    associatedSkill: "Éventails de Guerre",
    damageRolled: 0,
    damageKept: 1,
    keywords: "Petit",
    price: "5 koku",
    description: "Aussi appelé tessen. Il en existe de nombreux styles selon les Clans, particulièrement populaires en terres Lion et Grue. Certains ne sont que de courtes tiges métalliques ornées de disques ou de plaques."
  },

  // ============ Armes de Siège ============
  {
    name: "Canon",
    associatedSkill: "Canon",
    damageRolled: 10,
    damageKept: 10,
    keywords: "Grand, Gaijin",
    isRanged: true,
    range: 375,
    price: "Non disponible à la vente",
    description: "Pièce d'artillerie gaijin tirant des boulets pleins. Nécessite un équipage entraîné et un temps de préparation entre chaque tir.",
    specialRules: "Nécessite un équipage de 4 (minimum 2, à cadence réduite) - ne peut pas être utilisé par un seul homme. Un boulet inflige les dégâts complets à la cible, puis 5k5 à tout ce qui se trouve dans une ligne de 9 m (30 pieds) au-delà (un mur épais peut arrêter ce passage). Cadence de tir : 1 coup toutes les deux minutes (une fois par minute avec un équipage de 2). Ignore le bonus au TN d'Armure ainsi que toute Réduction (armure, résistance naturelle, ou celle d'un bâtiment)."
  }
];

/**
 * Dérive `system.size` (voir WeaponDataModel) depuis le mot-clé "Petit"/
 * "Moyen"/"Grand" déjà présent dans `keywords` pour chaque Arme ci-dessus,
 * plutôt que de dupliquer l'info à la main sur les 44 entrées - `keywords`
 * reste la source de vérité "texte affiché", `size` en est simplement une
 * lecture structurée, utilisée par SystemActor#drawWeapon.
 * @param {string} keywords
 * @returns {"small"|"medium"|"large"}
 */
function deriveSizeFromKeywords(keywords) {
  if (/petit/i.test(keywords)) return "small";
  if (/grand/i.test(keywords)) return "large";
  return "medium";
}

export const DEFAULT_WEAPONS = RAW_WEAPONS.map((weapon) => ({
  ...weapon,
  size: deriveSizeFromKeywords(weapon.keywords)
}));
