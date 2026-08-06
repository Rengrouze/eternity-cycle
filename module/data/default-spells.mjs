/**
 * Sorts de base du Core Rulebook L5R 4e, pour le compendium de sorts (voir
 * scripts/build-packs.mjs) et le peuplement rapide depuis l'onglet Magie.
 * Construit élément par élément (voir la roadmap du projet) - Terre en
 * premier, les autres Anneaux suivront dans de prochaines sessions.
 *
 * Distances converties de pieds/miles/livres en mètres/kilomètres/kg
 * (arrondies à une valeur sensée), même logique que default-weapons.mjs.
 * `ring`/`masteryRank` correspondent au "Ring/Mastery" du sort (ex:
 * "Earth 1" -> ring: "earth", masteryRank: 1), voir SpellDataModel.
 */
export const DEFAULT_SPELLS = [
  // ============ Sorts de Terre - Rang 1 ============
  {
    name: "Armure de Terre",
    ring: "earth",
    masteryRank: 1,
    keywords: "Bataille, Défense",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "10 tours",
    raises: "Durée (+2 tours)",
    description: "Ce sort infuse le corps du lanceur de la force de la Terre, atténuant l'impact de toute attaque physique ou magique. Pendant la durée du sort, le lanceur gagne une Réduction égale à son Anneau de Terre + son Rang d'École. Cette infusion ralentit cependant ses mouvements : son Anneau d'Eau est considéré inférieur d'1 rang pour le mouvement tant que le sort est actif."
  },
  {
    name: "Courage des Sept Tonnerres",
    ring: "earth",
    masteryRank: 1,
    keywords: "Bataille",
    range: "9 m",
    areaOfEffect: "Cibles jusqu'au Rang d'École de Shugenja du lanceur",
    duration: "10 minutes",
    raises: "Durée (+1 minute), Cibles (+1)",
    description: "Ce sort infuse les cibles (le lanceur inclus) d'un courage inébranlable, soutenu par la puissance éternelle de la Terre. Pendant la durée du sort, toutes les cibles gagnent +5k0 pour résister à tout effet de Peur, magique ou naturel. Les samouraïs qui ne descendent pas des Sept Grands Clans d'origine ne reçoivent que +3k0. Quiconque possède au moins un rang complet de Souillure des Terres de l'Ombre ne peut bénéficier de ce sort, sans que cela ne révèle sa Souillure. Ce sort peut être lancé en rituel combiné par deux Shugenja ou plus le connaissant : ils peuvent alors ajouter le plus haut Anneau de Terre parmi eux à la somme de leurs Rangs d'École pour déterminer le nombre de cibles affectées."
  },
  {
    name: "Stagnation de la Terre",
    ring: "earth",
    masteryRank: 1,
    keywords: "",
    range: "15 m",
    areaOfEffect: "Une cible",
    duration: "6 tours",
    raises: "Durée (+2 tours), Portée (+3 m), Cibles (+1, maximum 4 cibles au total)",
    description: "Ce sort fait appel à la Terre présente dans le corps de la cible pour l'alourdir et entraver ses mouvements. La cible subit un malus de -2k0 à tous les jets utilisant l'Agilité, et son Anneau d'Eau est considéré inférieur d'1 rang pour déterminer sa distance de déplacement."
  },
  {
    name: "Toucher de la Terre",
    ring: "earth",
    masteryRank: 1,
    keywords: "Défense",
    range: "Contact",
    areaOfEffect: "Une cible",
    duration: "1 heure",
    raises: "Durée (+1/2 heure), Cibles (+1 par 2 Augmentations, maximum 3 cibles au total)",
    description: "Le Shugenja invoque la Terre de la cible (qui peut être lui-même) pour renforcer sa santé et sa force mentale. Pendant la durée du sort, l'un des Traits de Terre de la cible (au choix du lanceur) est augmenté de 1. Cela n'augmente pas l'Anneau lui-même, mais peut améliorer la capacité de la cible à résister à la tentation, aux poisons, ou à dominer les autres."
  },
  {
    name: "Rempart Élémentaire",
    ring: "earth",
    masteryRank: 1,
    keywords: "Protections",
    range: "Contact",
    areaOfEffect: "Une cible",
    duration: "1 heure",
    raises: "Durée (+1/2 heure), Cibles (+1 par 2 Augmentations)",
    description: "Ce sort utilise la puissance de la Terre pour renforcer la résistance à la magie hostile : les esprits de la Terre protègent le corps et l'âme de la cible, repoussant les autres kami qui tentent de l'affecter. Le lanceur choisit un Élément (autre que le Vide ou le Maho) à la création du sort : tout sort de cet Élément lancé sur une cible protégée subit un malus égal au Rang d'École du lanceur x 5 à son jet de Lancer de Sort (y compris une magie \"amicale\" comme la guérison)."
  },
  {
    name: "Frappe de Jade",
    ring: "earth",
    masteryRank: 1,
    keywords: "Jade, Tonnerre",
    range: "30 m",
    areaOfEffect: "Une cible",
    duration: "Instantané",
    raises: "Dégâts (+1k0), Portée (+3 m), Cibles (+1 cible, maximum 5 cibles au total)",
    description: "Ce sort invoque les plus purs kami de la Terre, ceux de jade, sous la forme d'un jet d'énergie vert irisé. Le pouvoir de jade frappe infailliblement la cible choisie - il ne peut être intercepté ni dévié, bien qu'une Résistance Magique ou une autre forme de défense magique puisse le contrer. Si la cible possède au moins un rang de Souillure, la Frappe de Jade inflige des dégâts avec un DR de 3k3, brûlant et noircissant la chair souillée. Une cible sans Souillure complète ne subit en revanche aucun dégât. Lancer ce sort sur une cible non-souillée est généralement considéré comme une grave insulte - sauf peut-être chez les membres les plus paranoïaques de la famille Kuni, où c'est vu comme une précaution raisonnable.",
    damage: { mode: "fixed", rolled: 3, kept: 3, note: "Uniquement si la cible a au moins 1 rang de Souillure des Terres de l'Ombre." }
  },
  {
    name: "Baume de Jurojin",
    ring: "earth",
    masteryRank: 1,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 cible",
    duration: "1 heure",
    raises: "Durée (+1/2 heure), Cibles (+1 par 2 Augmentations, maximum 5 cibles au total)",
    description: "Ce sort emplit le corps de la cible de la pureté et de la vigueur de la Terre, chassant poisons et impuretés. Si la cible subit les effets d'un poison ou d'une toxine pendant la durée du sort, ou en subit déjà les effets au moment où le sort est lancé, elle peut relancer tout jet de Constitution raté pour y résister, avec un bonus de +2k0 sur ce second jet (si ce second jet échoue aussi, le poison fait son plein effet). Effet secondaire : ce sort guérit également l'ivresse, et il est impossible de s'enivrer pendant sa durée."
  },
  {
    name: "Entrave Mineure",
    ring: "earth",
    masteryRank: 1,
    keywords: "Artisanat",
    range: "18 m",
    areaOfEffect: "1 cible",
    duration: "2 heures",
    raises: "Durée (+1 heure), Portée (+6 m)",
    description: "Mis au point par la famille Kuni mais aujourd'hui utilisé par d'autres Shugenja combattant les forces des Terres de l'Ombre (Scorpion, Phénix...), ce sort emprisonne sans danger une créature mineure des Terres de l'Ombre, typiquement pour l'interroger. Seule une créature des Terres de l'Ombre avec un Anneau de Terre de 3 ou moins peut être ciblée - il ne peut affecter les Perdus, les Seigneurs Oni ou leur engeance, ni une créature avec un Anneau de Terre de 4 ou plus, ni une créature non-souillée. En cas de succès, des menottes de fer forgées d'esprits de Terre pure surgissent et immobilisent physiquement la cible pour la durée du sort. À l'expiration du sort, les menottes s'effritent instantanément en poussière."
  },
  {
    name: "Âme de Pierre",
    ring: "earth",
    masteryRank: 1,
    keywords: "Défense",
    range: "Contact",
    areaOfEffect: "Une cible",
    duration: "1 heure",
    raises: "Durée (+1/2 heure)",
    description: "Ce sort emplit l'âme de la cible de la force inébranlable de la pierre. Pendant la durée du sort, les sentiments de la cible sont inamovibles et toute tentative de la détourner ou de la distraire est résistée avec une détermination surnaturelle : +3k0 à tout jet résistant à la manipulation émotionnelle ou aux tentations, y compris Courtisan (Manipulation), Tentation, les Compulsions, ou tout effet similaire jugé approprié par le MJ. Cependant, ce contrôle de pierre rend aussi difficile la lecture des émotions d'autrui : la cible subit un malus de -1k0 à tous les jets d'Intuition et aux jets de Compétence liés à l'Intuition visant à influencer les autres."
  },
  {
    name: "Tetsubo de Terre",
    ring: "earth",
    masteryRank: 1,
    keywords: "Artisanat, Jade",
    range: "Personnelle ou 6 m",
    areaOfEffect: "Une arme créée",
    duration: "5 minutes",
    raises: "Dégâts (+1k0), Durée (+5 minutes), Portée (+1,5 m)",
    description: "Vous invoquez un tetsubo de terre pure, hérissé de pierres. L'arme prend par défaut la forme d'un tetsubo, mais une Augmentation permet de choisir n'importe quelle autre arme lourde. Le tetsubo a un DR de 2k2. En le maniant, vous pouvez utiliser votre Rang d'École à la place de votre compétence Armes Lourdes. Si vous possédez déjà cette compétence, le tetsubo confère une Relance Gratuite pour la manœuvre de Renversement (ce bonus ne s'applique pas si vous confiez le tetsubo à quelqu'un d'autre). Le tetsubo disparaît s'il quitte votre main. Vous pouvez aussi le faire apparaître dans les mains d'un allié à moins de 6 m ; celui-ci est alors considéré comme le lanceur pour les besoins du sort, mais ne gagne pas la Relance Gratuite."
  },

  // ============ Sorts de Terre - Rang 2 ============
  {
    name: "Soyez la Montagne",
    ring: "earth",
    masteryRank: 2,
    keywords: "Défense",
    range: "9 m",
    areaOfEffect: "1 créature cible",
    duration: "4 tours",
    raises: "Durée (+1 tour)",
    description: "Variante d'Armure de Terre conçue pour protéger les alliés, cette prière fait envelopper la cible par les kami de Terre, recouvrant sa peau d'une carapace de pierre qui repousse les coups physiques. La cible gagne une Réduction égale à 5 x le Rang d'École du lanceur (maximum 20), mais ne peut effectuer d'Actions de Mouvement Simples pendant la durée du sort (les Actions de Mouvement Libres restent autorisées). Seul un allié consentant peut être ciblé."
  },
  {
    name: "La Terre Devient le Ciel",
    ring: "earth",
    masteryRank: 2,
    keywords: "Jade, Tonnerre",
    range: "30 m",
    areaOfEffect: "1 créature cible",
    duration: "Instantané",
    raises: "Dégâts (+1k0), Cibles (+1 cible), Spécial (rend les rochers de Jade avec 2 Augmentations)",
    description: "Ce sort invoque plusieurs énormes rochers depuis la terre et les projette pour frapper infailliblement une (ou plusieurs) créature cible. La cible touchée subit des dégâts avec un DR égal à l'Anneau de Terre du lanceur. Si plusieurs cibles sont frappées, le DR est réduit de 1k1 par cible supplémentaire, jusqu'à un minimum de 1k1 par cible. Ces rochers sont de pierre ordinaire et mondaine, et ne peuvent donc normalement pas contourner la Réduction ou l'Invulnérabilité - mais un lanceur puissant peut infuser les rochers de la puissance du Jade.",
    damage: { mode: "ring", ring: "earth", rolled: 0, kept: 0, note: "DR réduit de 1k1 par cible supplémentaire touchée (minimum 1k1 par cible)." }
  },
  {
    name: "Étreinte de Kenro-Ji-Jin",
    ring: "earth",
    masteryRank: 2,
    keywords: "Voyage",
    range: "Personnelle ou Contact",
    areaOfEffect: "1 créature cible",
    duration: "1 heure",
    raises: "Durée (+1/2 heure)",
    description: "Ce sort permet à la cible (le lanceur ou une autre personne) de plonger littéralement dans le sol, qui devient pour elle aussi clair et facile à traverser que de l'eau. Elle peut voir à travers la terre sur environ 90 m et s'y déplacer dans toutes les directions aussi facilement que dans l'air. La cible peut voir le monde normal à travers la limite de la terre, mais ne peut ni attaquer, ni lancer de sort, ni parler, ni entendre, ni interagir autrement avec l'extérieur tant qu'elle n'en émerge pas (ce qui met fin immédiatement au sort). Si le sort expire alors que la cible est encore sous terre, les esprits de la Terre, offensés par sa présence prolongée, l'expulsent immédiatement vers l'air libre le plus proche."
  },
  {
    name: "Force de Volonté",
    ring: "earth",
    masteryRank: 2,
    keywords: "Bataille",
    range: "15 m",
    areaOfEffect: "1 cible",
    duration: "2 tours",
    raises: "Durée (+1 tour, maximum 4 tours)",
    description: "Ce sort infuse la cible d'une résistance intense à la douleur et à la mort, les kami de Terre renforçant sa volonté de vivre à un niveau surnaturel. Elle peut ignorer la douleur et le choc de ses blessures, continuant à agir même face à des blessures mortelles pendant un court moment. Pendant la durée du sort, la cible est immunisée à tous les malus et effets liés au rang de blessure - y compris l'effet de la mort si le rang Hors de Combat est atteint. Lorsque le sort expire, les effets de toutes les Blessures s'appliquent immédiatement - ce sort offre donc généralement soit une brève chance d'être soigné avant qu'il ne soit trop tard, soit une chance de mener un dernier combat face à une mort certaine."
  },
  {
    name: "Emprise de la Terre",
    ring: "earth",
    masteryRank: 2,
    keywords: "",
    range: "15 m",
    areaOfEffect: "1 cible",
    duration: "5 tours",
    raises: "Durée (+1 tour), Portée (+1,5 m), Cibles (+1 cible par 2 Augmentations)",
    description: "Ce sort fait surgir les kami de Terre pour saisir la cible, prenant souvent la forme d'une main ou d'une griffe massive qui l'agrippe de doigts de pierre. La cible est presque immobilisée, ne pouvant se déplacer que d'1 m par tour en Action de Mouvement Simple, et pas du tout en Action de Mouvement Libre. Elle peut se libérer en dépensant une Action Complexe et en réussissant un jet de Force Brute contre un TN égal à 5 x l'Anneau de Terre du lanceur."
  },
  {
    name: "Mains d'Argile",
    ring: "earth",
    masteryRank: 2,
    keywords: "Voyage",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "10 minutes",
    raises: "Durée (+5 minutes)",
    description: "Ce sort infuse les mains et les pieds du lanceur d'esprits de Terre, leur permettant de fusionner avec la terre présente dans le bois, la terre et la pierre. Le lanceur peut ainsi marcher et grimper le long de surfaces verticales, y compris des murs et des falaises, à la moitié de sa vitesse normale (arrondie au supérieur). Il peut même se suspendre aux plafonds et s'y déplacer, mais alors seulement d'1 m par Action Simple. Quand le sort prend fin, l'effet cesse sans prévenir, pouvant provoquer une chute douloureuse."
  },
  {
    name: "Les Pieds de la Montagne",
    ring: "earth",
    masteryRank: 2,
    keywords: "Défense",
    range: "Personnelle ou 6 m",
    areaOfEffect: "1 cible",
    duration: "1 heure",
    raises: "Durée (+1/2 heure), Cibles (+1 par 2 Augmentations)",
    description: "Ce sort fortifie la cible en enracinant ses pieds dans la pierre et le sol, lui permettant de résister à tout ce qui chercherait à la séparer du contact de la Terre. La cible gagne +3k0 pour résister à toute manœuvre de Renversement, et tout sort cherchant à la renverser, la soulever dans les airs, ou rompre son lien avec la Terre doit remporter un jet Contesté de son Élément contre l'Anneau de Terre du lanceur."
  },
  {
    name: "Intégrité du Monde",
    ring: "earth",
    masteryRank: 2,
    keywords: "Défense",
    range: "Personnelle ou 6 m",
    areaOfEffect: "1 créature cible",
    duration: "10 minutes",
    raises: "Durée (+1 minute), Portée (+1,5 m), Cibles (+1 par 2 Augmentations)",
    description: "Ce sort infuse la cible de la force de la Terre au point que ses Anneaux et Traits deviennent totalement résistants à tout effort visant à les modifier. Tout effet physique ou magique qui augmenterait ou réduirait ses Traits ou Anneaux est complètement inefficace pendant la durée du sort, les kami de Terre repoussant fermement toute tentative d'altérer l'équilibre élémentaire de la cible."
  },

  // ============ Sorts de Terre - Rang 3 ============
  {
    name: "Liens de Ningen-Do",
    ring: "earth",
    masteryRank: 3,
    keywords: "Protections",
    range: "150 m",
    areaOfEffect: "1 créature spirituelle cible",
    duration: "30 jours",
    raises: "Durée (+1 jour), Portée (+3 m), Cibles (+1 par 2 Augmentations)",
    description: "Forme plus puissante et spécialisée d'Entrave Mineure, ce rituel lie ou bannit les créatures gênantes venues des royaumes spirituels (Sakkaku, Chikushudo, Gaki-Do, Toshigoku ou Yume-Do). Le lancer prend 10 minutes, réduites d'1 minute par Shugenja supplémentaire assistant le rituel (minimum 1 minute). Si la créature ciblée est à portée à la complétion du sort, elle peut être liée ou bannie. Si elle est liée, elle doit obéir aux ordres du lanceur pour la durée du sort (les ordres suicidaires brisent le sort) - c'est ainsi que les Kuni forcent les esprits mujina à travailler dans leurs mines de fer (usage considéré controversé, voire blasphématoire, par beaucoup à Rokugan). Si elle est bannie, elle quitte immédiatement Ningen-Do pour son royaume spirituel d'origine et ne peut y revenir avant la fin de la durée du sort. Dans tous les cas, la créature spirituelle considérera le lanceur comme un ennemi et cherchera probablement vengeance si elle le peut."
  },
  {
    name: "Bénédiction des Kami de Terre",
    ring: "earth",
    masteryRank: 3,
    keywords: "Bataille",
    range: "Personnelle ou 6 m",
    areaOfEffect: "Le lanceur ou 1 créature cible",
    duration: "10 minutes",
    raises: "Durée (+1 minute)",
    description: "Ce sort infuse la cible (le lanceur ou un allié) de la force et de la résilience de la Terre, la rendant plus robuste et plus déterminée. Pendant la durée du sort, la cible gagne +2 Blessures par rang de blessure, et +1k1 à tous les jets impliquant l'Anneau de Terre et ses Traits associés. Quand le sort expire, les Blessures déjà subies demeurent - ce qui peut faire chuter la cible à un rang de blessure inférieur, voire la tuer."
  },
  {
    name: "Protection de la Terre",
    ring: "earth",
    masteryRank: 3,
    keywords: "Défense, Protections",
    range: "Personnelle",
    areaOfEffect: "3 m de rayon autour du lanceur",
    duration: "Concentration",
    raises: "Zone (+1,5 m de rayon par 2 Augmentations, jusqu'à un maximum de 9 m de rayon), Spécial (dégâts réduits de +1k1 supplémentaire pour 2 Augmentations)",
    description: "Ce sort fait appel aux esprits de la Terre pour protéger la zone autour du lanceur des effets des trois autres Éléments (Air, Feu, Eau) pendant un court instant. Tant que le lanceur se concentre pour maintenir la faveur des esprits de Terre, les effets des sorts appelant ces trois autres éléments sont atténués. Tout sort hostile d'Air, de Feu ou d'Eau lancé dans la zone de Protection de la Terre, ou qui y étend ses effets, subit un malus de +10 au TN de son jet de Lancer de Sort. De plus, tous les dégâts que ces sorts infligent aux créatures présentes dans la zone sont réduits de 1k1 (minimum 1k1)."
  },
  {
    name: "Purge de la Souillure",
    ring: "earth",
    masteryRank: 3,
    keywords: "Jade",
    range: "Personnelle",
    areaOfEffect: "15 m de rayon autour du lanceur",
    duration: "Permanente",
    raises: "Zone (+3 m de rayon)",
    description: "Créé à l'origine par la famille Kuni et toujours principalement pratiqué par elle, bien que la connaissance de ses prières se soit répandue à d'autres Clans, ce rituel élaboré (une heure d'incantation) fait appel à la puissance de la Terre pour purger la terre elle-même de la Souillure des Terres de l'Ombre, chassant tous les kansen malfaisants de la zone. Le sort retire la Souillure du sol, de la végétation et des objets inanimés dans la zone d'effet. Il ne retire pas la Souillure des créatures vivantes, et n'affecte pas les artefacts souillés puissants ni les objets d'obsidienne. Ce nettoyage a un prix : les kami élémentaires de la zone, en particulier les esprits de Terre sollicités pour alimenter le sort, en ressortent affaiblis et dispersés, infligeant un malus de +15 au TN de tous les jets de Lancer de Sort dans la zone. Cet effet négatif peut s'estomper avec le temps, surtout si le sort est lancé en un lieu isolé entouré de terres normales. Mais s'il est lancé sur une vaste zone, comme les Terres Perdues Kuni, les kami élémentaires quittent généralement la zone de façon permanente, la réduisant à une étendue grise et sans vie."
  },
  {
    name: "Partage de la Force du Nombre",
    ring: "earth",
    masteryRank: 3,
    keywords: "",
    range: "6 m",
    areaOfEffect: "1 à 6 personnes cibles à portée",
    duration: "5 tours",
    raises: "Durée (+1 tour), Portée (+1,5 m)",
    description: "Ce sort infuse jusqu'à six cibles (le lanceur inclus) de la puissance de la Terre, leur permettant de puiser dans la Terre de leurs compagnons pour soutenir leurs efforts. Pendant la durée du sort, le plus bas Anneau de Terre parmi toutes les cibles est ajouté au total de tous leurs jets d'Anneau, de Trait et de Compétence (mais pas aux jets de Lancer de Sort)."
  },
  {
    name: "Force du Corbeau",
    ring: "earth",
    masteryRank: 3,
    keywords: "Jade",
    range: "Contact",
    areaOfEffect: "1 cible",
    duration: "Heures égales au Rang d'École de Shugenja du lanceur",
    raises: "Durée (+1 heure), Cibles (+1)",
    description: "Ce sort infuse la cible (qui peut être le lanceur) d'une puissante résistance à la Souillure des Terres de l'Ombre, repoussant les sombres kansen de la Souillure par la pure puissance de la Terre. Pendant la durée du sort, la cible gagne un bonus de +5k5 à tous les jets pour résister à l'acquisition de la Souillure, et tout sort de maho visant à l'affecter subit un malus de +10 au TN. Ce bonus ne s'applique pas aux jets visant à résister à une augmentation d'une Souillure déjà possédée - seulement à une nouvelle Souillure venue d'une source extérieure. Il ne protège pas non plus la cible de la Souillure acquise en lançant du Maho."
  },
  {
    name: "La Merci du Loup",
    ring: "earth",
    masteryRank: 3,
    keywords: "",
    range: "15 m",
    areaOfEffect: "1 créature cible",
    duration: "10 tours",
    raises: "Portée (+3 m), Cibles (+1)",
    description: "Ce sort existe à Rokugan depuis des siècles, mais est surtout connu pour l'usage extensif qu'en a fait Toturi Sezaru, \"le Loup\", lors de ses chasses aux Sangs-Sorciers. Il fait appel à la puissance de la Terre pour affliger la cible, alourdissant son corps et entravant ses muscles, la laissant faible, tremblante et vulnérable. L'Anneau de Terre de la cible est réduit d'1 rang, et ses rangs de blessure sont réduits en conséquence pour la durée du sort (ce qui peut potentiellement la tuer immédiatement si elle a déjà subi des Blessures). De plus, son Anneau de Force est également réduit de 1 pour la même durée. Si la cible possède au moins un rang complet de Souillure des Terres de l'Ombre, les esprits de la Terre, emplis de courroux, la punissent plus sévèrement en réduisant son Anneau de Terre de 2 rangs (minimum 1)."
  },

  // ============ Sorts de Terre - Rang 4 ============
  {
    name: "Armure de l'Empereur",
    ring: "earth",
    masteryRank: 4,
    keywords: "Défense",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "5 tours",
    raises: "Durée (+2 tours)",
    description: "Ce sort recouvre le lanceur d'une épaisse couche d'esprits de Terre robustes et résistants, repoussant tous les dégâts, qu'ils soient physiques ou magiques. Chaque fois que le lanceur subit des dégâts d'une attaque ennemie physique ou magique, le total de chaque dé de dégâts individuel est réduit du Rang d'École de Shugenja du lanceur (sans pouvoir descendre sous 0)."
  },
  {
    name: "Essence de la Terre",
    ring: "earth",
    masteryRank: 4,
    keywords: "Bataille",
    range: "Personnelle ou 6 m",
    areaOfEffect: "1 créature cible (soi-même ou autre)",
    duration: "10 minutes",
    raises: "Durée (+1 tour), Portée (+1,5 m), Cibles (+1 par 2 Augmentations), Spécial (+1 rang de Terre par 2 Augmentations, augmentation maximale de 3 rangs)",
    description: "Ce sort infuse la cible de la véritable force de la Terre, lui permettant d'ignorer des coups qui pourraient autrement lui coûter la vie. Pendant la durée du sort, l'Anneau de Terre de la cible est considéré supérieur d'1 rang, et ses Blessures augmentent en conséquence. Cependant, quand le sort prend fin, les esprits de Terre se retirent immédiatement et les Blessures de la cible reviennent à la normale - pouvant entraîner sa mort si elle a subi suffisamment de dégâts."
  },
  {
    name: "Symbole de Terre",
    ring: "earth",
    masteryRank: 4,
    keywords: "Protections",
    range: "Contact",
    areaOfEffect: "Spéciale",
    duration: "Permanente",
    raises: "Dégâts (+1k0)",
    description: "Les prêtres des kami peuvent inscrire de puissantes protections invoquant la puissance des éléments contre quiconque tenterait de les franchir. Un Symbole de Terre peut être inscrit sur un objet solide, le plus souvent une porte, une fenêtre, un portail ou tout autre passage. Quiconque tente de franchir ce passage ou de contourner la protection est affecté par sa puissance et doit réussir un jet Contesté d'Air contre l'Anneau de Terre du lanceur. Ceux qui échouent sont frappés par une puissante onde de choc et doivent réussir un jet de Force contre le total du jet de Lancer de Sort ayant créé la protection, sous peine d'être projetés au sol et Étourdis. S'ils possèdent au moins un rang de Souillure, ils subissent en plus 2k2 Blessures. Un seul Symbole de Terre peut exister à la fois, et des sorts Symbole d'éléments différents ne peuvent jamais affecter la même zone. Ce sort peut être dissipé par un autre lancer de Symbole de Terre par n'importe quel Shugenja, ou en détruisant la surface où le Symbole a été gravé.",
    damage: { mode: "fixed", rolled: 2, kept: 2, note: "Déclenché si la cible échoue son jet Contesté d'Air et possède au moins 1 rang de Souillure." }
  },
  {
    name: "Tombeau de Jade",
    ring: "earth",
    masteryRank: 4,
    keywords: "Jade",
    range: "15 m",
    areaOfEffect: "1 créature cible",
    duration: "Concentration",
    raises: "Portée (+3 m), Spécial (jet Contesté, +1k1 au lanceur par Augmentation)",
    description: "Considéré par beaucoup de Shugenja comme le sort ultime pour s'opposer aux créatures des Terres de l'Ombre, ce sort fait appel aux esprits de Terre les plus purs, ceux de jade, pour consumer la Souillure au sein de la cible. Le sort ne peut affecter qu'une cible possédant au moins un rang complet de Souillure ; en cas d'échec, le lanceur ne sait pas automatiquement que la cible est indemne de Souillure - il est toujours possible qu'elle ait simplement résisté au sort. Une fois Tombeau de Jade lancé, la cible est momentanément immobilisée pendant que les esprits de Terre pénètrent son corps. Chaque tour, à partir du premier, le lanceur doit réussir un jet Contesté de Terre contre la cible. Si la cible gagne, le sort prend fin. Si le lanceur gagne, la cible subit 2k2 Blessures tandis que les esprits commencent à transformer son corps en jade. Cela continue chaque tour jusqu'à ce que la cible résiste avec succès, que le lanceur cesse de se concentrer, ou que la cible meure. Ceux tués par ce sort sont transformés en statues de jade pur, qui s'effritent en poussière mondaine en 24 heures.",
    damage: { mode: "fixed", rolled: 2, kept: 2, note: "Uniquement si la cible a au moins 1 rang de Souillure ; infligé chaque tour où le lanceur gagne le jet Contesté de Terre." }
  },
  {
    name: "Mur de Terre",
    ring: "earth",
    masteryRank: 4,
    keywords: "Défense",
    range: "30 m",
    areaOfEffect: "Mur de 3 m de haut maximum et 30 m de large maximum",
    duration: "10 minutes",
    raises: "Zone (+30 cm de hauteur ou +3 m de largeur par Augmentation), Durée (+1 minute), Portée (+3 m)",
    description: "Ce sort fait surgir les esprits de la Terre pour former une barrière épaisse et puissante protégeant le lanceur. Le mur de terre dure comme le roc peut être façonné à volonté, courbé, placé sur un flanc de colline, ou même formé en cercle. Il est extrêmement résistant : un jet de Force contre un TN égal à (Terre + Rang d'École du lanceur) x 5 est nécessaire pour le briser. Il est assez solide pour contenir une inondation, une coulée de lave, ou des vents d'ouragan, tant que le sort dure. À l'expiration du sort, la barrière de terre s'effrite en quelques instants."
  },

  // ============ Sorts de Terre - Rang 5 ============
  {
    name: "Tremblement de Terre",
    ring: "earth",
    masteryRank: 5,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "1,6 km de rayon",
    duration: "1 minute",
    raises: "Zone (+450 m), Durée (+1 minute par 2 Augmentations)",
    description: "Ce sort déclenche un terrible séisme dévastateur, centré sur le lanceur, seul à en être épargné. Le séisme détruit entièrement tous les bâtiments en bois dans le rayon d'effet et inflige de sévères dégâts aux structures de pierre. Toutes les personnes présentes dans la zone sont projetées au sol, restent Prostrées et Étourdies pour la durée du sort, et subissent 2k1 Blessures. Les individus à l'intérieur de bâtiments (lanceur inclus) subissent 6k6 dégâts dus aux débris, effondrements de toits, etc. Lancer ce sort à portée d'une zone habitée importante est généralement considéré comme un acte de guerre.",
    damage: { mode: "fixed", rolled: 2, kept: 1, note: "6k6 pour les personnes à l'intérieur d'un bâtiment (débris/effondrements) au lieu de 2k1." }
  },
  {
    name: "Entrave Majeure",
    ring: "earth",
    masteryRank: 5,
    keywords: "Jade, Protections",
    range: "30 m",
    areaOfEffect: "1 créature des Terres de l'Ombre cible",
    duration: "12 heures",
    raises: "Durée (+1 heure), Portée (+15 m)",
    description: "Pendant plus puissant de l'Entrave Mineure de la famille Kuni, également employé par d'autres Shugenja de Clan, notamment ceux du Phénix, ce sort emprisonne des créatures des Terres de l'Ombre plus puissantes et des membres des Perdus, typiquement pour les interroger. Il peut cibler n'importe quel Perdu et n'importe quelle créature des Terres de l'Ombre, ainsi que d'autres créatures spirituelles souillées, mais aucune autre créature. Le sort est un rituel nécessitant dix minutes de lancer (le rendant dangereux face à un oni déchaîné), réduites d'1 minute par Shugenja supplémentaire participant (minimum 1 minute). En cas de succès, les lanceurs effectuent un jet Contesté de la somme de leurs Anneaux de Terre contre l'Anneau de Terre de la cible. S'ils gagnent, le sort fait apparaître des menottes de jade élémentaire pur qui emprisonnent la créature et la rendent impuissante par la douleur de ses liens brûlants pour la durée du sort. À l'expiration du sort, les menottes s'effritent instantanément en poussière, et la créature cherchera probablement une vengeance immédiate et sanglante contre ses geôliers."
  },
  {
    name: "Frappe aux Racines",
    ring: "earth",
    masteryRank: 5,
    keywords: "",
    range: "15 m",
    areaOfEffect: "1 créature cible",
    duration: "3 tours",
    raises: "Durée (+1 tour), Portée (+3 m), Cibles (+1 par 2 Augmentations), Spécial (jet Contesté, +1k1 au lanceur par Augmentation)",
    description: "Forme plus puissante et dévastatrice de la Merci du Loup, ce sort déchaîne la véritable colère de la Terre sur la cible, drainant toute la faveur de la Terre de son corps et la laissant faible, tremblante et impuissante. Après le lancer, le lanceur doit réussir un jet Contesté de Terre contre la cible (séparément pour chaque cible si plusieurs sont visées). Si la cible perd, son Anneau de Terre est immédiatement réduit à 1 pour la durée du sort - ce qui réduit aussi ses rangs de blessure et peut entraîner sa mort immédiate si elle a déjà subi des blessures."
  },
  {
    name: "La Force du Kami",
    ring: "earth",
    masteryRank: 5,
    keywords: "Bataille",
    range: "9 m",
    areaOfEffect: "1 créature cible",
    duration: "5 tours",
    raises: "Durée (+1 tour), Portée (+3 m)",
    description: "Ce sort permet au lanceur de fortifier une personne avec la puissance de la Terre, renforçant grandement ses capacités physiques et sa résistance aux dégâts. La cible gagne une Réduction de 20 et voit sa Force ainsi qu'un autre Trait physique augmenter d'un montant égal à l'Anneau de Terre du lanceur. En contrepartie, la cible est alourdie par le poids de la Terre et ne peut effectuer d'Actions de Mouvement Simples (elle peut toujours effectuer une Action de Mouvement Libre)."
  },
  {
    name: "La Volonté du Kami",
    ring: "earth",
    masteryRank: 5,
    keywords: "Défense",
    range: "9 m",
    areaOfEffect: "1 créature cible",
    duration: "10 tours",
    raises: "Durée (+1 tour), Portée (+3 m)",
    description: "Pendant complémentaire de la Force du Kami, ce sort infuse une personne de l'entêtement et de la détermination de la Terre, renforçant grandement sa volonté et la rendant quasiment immunisée aux effets de la magie élémentaire. La cible voit sa Volonté augmenter d'un montant égal à l'Anneau de Terre du lanceur, et tout sort (ami ou hostile, hors Maho) la ciblant subit un malus de -XkX à son jet de Lancer de Sort, où X est l'Anneau de Terre du lanceur. En contrepartie, la cible devient si entêtée et autoritaire qu'elle ne peut plus fonctionner correctement en société, et subit un malus de -Xk0 à tous les jets de Compétence Sociale, où X est l'Anneau de Terre du lanceur."
  },

  // ============ Sorts de Terre - Rang 6 ============
  {
    name: "Essence de Jade",
    ring: "earth",
    masteryRank: 6,
    keywords: "Défense, Jade",
    range: "9 m",
    areaOfEffect: "1 créature cible",
    duration: "10 tours",
    raises: "Durée (+1 tour), Portée (+1,5 m), Cibles (+1 cible par 2 Augmentations, maximum 3 cibles au total)",
    description: "Ce sort fait appel à la pureté du jade pour protéger ses cibles contre la puissance de Jigoku, qu'elle se manifeste sous forme de Souillure ou de la redoutable magie connue sous le nom de maho. La cible rayonne de la lumière verte sacrée du jade, et tant que le sort dure, elle ne peut acquérir la Souillure des Terres de l'Ombre et est totalement immunisée aux effets de tous les sorts de maho. Ce sort ne peut être lancé sur quelqu'un possédant déjà au moins un rang complet de Souillure, les esprits de jade pur reculant devant un individu aussi corrompu - alertant immédiatement le lanceur de sa nature souillée."
  },
  {
    name: "Puissance du Dragon de Terre",
    ring: "earth",
    masteryRank: 6,
    keywords: "Défense",
    range: "15 m",
    areaOfEffect: "1 créature cible",
    duration: "10 minutes",
    raises: "Durée (+1 minute), Portée (+3 m), Cibles (+1), Spécial (absorption de dégâts +10 Blessures par Augmentation)",
    description: "Le plus puissant des sorts de Terre à vocation protectrice, ce sort fait appel à la faveur du Dragon de Terre pour envelopper les cibles d'une protection contre toute forme de dommage. Les esprits de Terre absorbent tous les dégâts subis par les cibles pendant la durée du sort. Il existe cependant des limites même à l'endurance de la Terre : les Nemuranai peuvent contourner cette protection, et si les esprits de Terre protégeant une cible donnée ont absorbé un total de 100 Blessures, ils s'épuisent et l'effet du sort prend fin pour cette cible."
  },
  {
    name: "Prison de Terre",
    ring: "earth",
    masteryRank: 6,
    keywords: "Protections",
    range: "9 m",
    areaOfEffect: "1 créature cible",
    duration: "Permanente",
    raises: "Portée (+1,5 m), Spécial (jet Contesté, +1k1 au lanceur par Augmentation)",
    description: "Le plus puissant des sorts d'entrave utilisés par les Shugenja de Terre pour traiter avec des créatures dangereuses, ce sort peut littéralement emprisonner l'essence d'une telle créature aussi longtemps que le lanceur le souhaite. Le lancer nécessite que le lanceur possède une gemme ou une perle dans laquelle emprisonner la créature (le MJ peut, à sa discrétion, autoriser d'autres objets rares ou précieux, comme un casse-tête finement incrusté ou un pendentif de cristal). Le sort peut cibler toute créature native des royaumes de Jigoku, Gaki-do ou Toshigoku, ainsi que toute autre créature non-humaine possédant au moins un rang complet de Souillure. Après le lancer, le lanceur doit réussir un jet Contesté de Volonté contre la cible. S'il gagne, le corps physique de la créature disparaît et son essence est emprisonnée dans l'objet, où elle reste indéfiniment tant que celui-ci n'est pas physiquement détruit. Si cela se produit, la créature libérée reprend immédiatement forme physique et cherchera probablement vengeance contre le lanceur ou ses descendants."
  },
  {
    name: "Lève-toi, Terre",
    ring: "earth",
    masteryRank: 6,
    keywords: "",
    range: "9 m",
    areaOfEffect: "1 esprit invoqué",
    duration: "Concentration",
    raises: "Aucune",
    description: "La Terre elle-même se lève et prend forme pour vous défendre. Aboutissement ultime du sort d'Invocation, cette prière invoque un kami massif de Terre pure à votre service. Il prend une forme vaguement humanoïde d'environ 3 mètres de haut, au corps large et aux membres épais, entièrement formés de terre et de pierre. Ce puissant kami de Terre peut se déplacer jusqu'à 5 x votre Anneau de Terre en mètres par tour, et ses pas font trembler le sol dans un rayon de 6 m autour de lui, empêchant quiconque dans cette zone d'effectuer des Actions de Mouvement Simples. Cet esprit de Terre est considéré comme ayant tous ses Traits Physiques égaux à votre Anneau de Terre, et attaque avec un rang de compétence Jiujutsu égal à la moitié de votre Anneau de Terre. Le kami peut porter jusqu'à 450 kg s'il en reçoit l'ordre, et ses coups sont assez puissants pour détruire toute structure en bois et briser des murs de pierre de 30 cm d'épaisseur. Pour déterminer les dégâts qu'il subit, l'esprit est considéré avoir des Blessures comme un humain avec un Anneau de Terre égal au vôtre, mais ne subit aucun malus de blessure. Il est Invulnérable. S'il est ramené à zéro Blessure, il est dissipé."
  },

  // ============ Sorts d'Air - Rang 1 ============
  {
    name: "Vol de la Flèche",
    ring: "air",
    masteryRank: 1,
    keywords: "Bataille",
    range: "Contact",
    areaOfEffect: "1 flèche",
    duration: "3 tours",
    raises: "Durée (+1 tour par Augmentation), Spécial (+1 flèche supplémentaire par Augmentation)",
    description: "Prière utilisée par les Shugenja pour aider les bushi lorsqu'une flèche doit absolument atteindre sa cible. Le Shugenja convainc les kami d'Air de guider la flèche par jeu : si elle est tirée pendant la durée du sort, elle frappe infailliblement sa cible (elle doit néanmoins être tirée par quelqu'un ayant au moins 1 rang de Kyujutsu). Comme ce sont les kami qui garantissent le tir, celui-ci ne peut bénéficier des effets d'Augmentations ou de Techniques."
  },
  {
    name: "Vent Béni",
    ring: "air",
    masteryRank: 1,
    keywords: "Défense",
    range: "Personnelle",
    areaOfEffect: "3 m de rayon autour du lanceur",
    duration: "Concentration",
    raises: "Spécial (peut cibler une autre personne avec 3 Augmentations)",
    description: "Vous invoquez une aura tourbillonnante de vents pour vous protéger des attaques à distance : les bourrasques dévient flèches et autres projectiles. Tant que vous maintenez votre concentration, ce sort ajoute +15 à votre TN d'Armure contre toutes les attaques à distance non-magiques."
  },
  {
    name: "À la Lumière de la Lune",
    ring: "air",
    masteryRank: 1,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "6 m de rayon autour du lanceur",
    duration: "1 minute",
    raises: "Zone (+1,5 m de rayon), Durée (+1 minute)",
    description: "Vous faites appel aux kami pour révéler ce qui a été dissimulé. Tous les objets cachés dans la zone d'effet apparaissent pour vous sous forme de contours légèrement lumineux. Toute dissimulation non-magique est révélée : compartiments secrets, trappes, armes cachées, etc. Vous seul pouvez percevoir la présence de ces objets."
  },
  {
    name: "Manteau de Nuit",
    ring: "air",
    masteryRank: 1,
    keywords: "Illusion",
    range: "Contact",
    areaOfEffect: "Un objet",
    duration: "1 heure",
    raises: "Durée (+1 heure)",
    description: "Vous faites appel aux kami pour envelopper un objet de leur étreinte, le dissimulant au regard des mortels. Vous pouvez cibler tout objet inanimé plus petit que vous, qui devient invisible à l'œil nu. Toute tentative de le percevoir magiquement réussit automatiquement si le Rang de Maîtrise du sort employé est supérieur à celui-ci ; à Rang de Maîtrise égal, un jet Contesté d'Air est nécessaire pour détecter l'objet caché. L'objet reste physiquement présent et peut être touché, senti, ou perçu par tout sens autre que la vue."
  },
  {
    name: "Tourbillon Rassembleur",
    ring: "air",
    masteryRank: 1,
    keywords: "",
    range: "Centrée sur le lanceur",
    areaOfEffect: "6 m de rayon autour du lanceur",
    duration: "1 tour",
    raises: "Zone d'Effet (+1,5 m de rayon par 2 Augmentations)",
    description: "Ce sort, souvent trouvé dans les besaces à parchemins des magistrats et de leurs assistants, semble être une version simplifiée de la prière utilisée pour Liberté de l'Air. Il fait souffler les kami d'Air avec vigueur dans la zone d'effet ; après un bref moment de chaos apparent, les vents rassemblent plusieurs objets non tenus et les déposent en une pile nette (mais pas organisée) à l'endroit choisi par le lanceur dans la zone, y compris dans ses mains si désiré. Le lanceur doit nommer les objets à rassembler au moment du lancer - seuls ceux-ci seront collectés. Pratique pour rassembler des papiers éparpillés, retrouver une note enfouie sous une pile, ou récupérer quelque chose d'important avec un minimum d'effort. Peut aussi, plus subtilement, récupérer un objet dissimulé ou caché - un usage que les magistrats trouvent fort utile. Il ne peut cependant pas arracher un objet des mains ou de la personne de quelqu'un d'autre - les esprits d'Air considèrent cela comme gâchant le jeu."
  },
  {
    name: "Héritage de Kaze-no-Kami",
    ring: "air",
    masteryRank: 1,
    keywords: "Artisanat",
    range: "École x 16 km",
    areaOfEffect: "Un individu connu à portée",
    duration: "Spéciale",
    raises: "Zone (+1 individu), Portée (+16 km)",
    description: "Vous êtes capable de faire appel aux esprits du vent pour qu'ils prennent la forme d'un oiseau et transportent un message pour vous. L'oiseau créé par ce sort semble parfaitement normal à tous égards, mais s'il subit le moindre dégât, il se dissipe immédiatement en vent, mettant fin au sort. En le créant, vous pouvez lui parler et lui confier un message oral d'une minute maximum. L'oiseau s'envole alors livrer le message à la ou aux personnes désignées au lancer, se rendant à leur emplacement, délivrant le message par un murmure (audible par d'autres, mais difficilement), puis disparaissant. S'il ne peut atteindre l'individu bien que celui-ci soit à portée (par exemple s'il se trouve dans un bâtiment sans fenêtre), il patiente dehors jusqu'à une semaine avant de disparaître. Si la personne désignée n'est pas à portée, l'oiseau s'envole dans une direction aléatoire et disparaît dès qu'il sort de votre ligne de vue."
  },
  {
    name: "Toucher de la Nature",
    ring: "air",
    masteryRank: 1,
    keywords: "",
    range: "3 m",
    areaOfEffect: "Une créature",
    duration: "Spéciale",
    raises: "Portée (+3 m)",
    description: "Vous pouvez utiliser les esprits du vent pour parler à un animal et vous assurer qu'il comprend ce que vous dites. Ce sort ne fonctionne que sur les animaux naturels, pas sur les créatures des Terres de l'Ombre ni celles d'autres royaumes. Il ne garantit pas que l'animal vous soit favorable ni qu'il exécute vos requêtes, mais il comprendra tout ce que vous lui dites (dans la limite de ce qu'il peut naturellement saisir - les relations politiques n'ont aucun sens pour un cheval, quel que soit le nombre de fois où vous les lui expliquez). Ce sort dure tant que vous maintenez toute votre attention sur l'animal et continuez à lui parler."
  },
  {
    name: "Tempête d'Air",
    ring: "air",
    masteryRank: 1,
    keywords: "Tonnerre",
    range: "Personnelle",
    areaOfEffect: "Cône de 23 m de long et 4,5 m de large à son extrémité",
    duration: "Instantané",
    raises: "Zone (+1,5 m à la largeur du cône), Dégâts (+1k0), Portée (+1,5 m à la longueur du cône), Spécial (+5 au TN d'Air contre le Renversement par Augmentation)",
    description: "Vous invoquez une puissante rafale d'air émanant de votre position, qui s'abat sur tout ce qui se trouve sur son passage et projette au sol quiconque en est frappé. Toutes les cibles dans la zone d'effet subissent 1k1 Blessures et doivent réussir un jet Contesté de leur Terre contre votre Air. Toute cible qui échoue subit un Renversement.",
    damage: { mode: "fixed", rolled: 1, kept: 1, note: "La cible subit aussi un Renversement si elle échoue son jet Contesté de Terre." }
  },
  {
    name: "Symbole de Mémoire",
    ring: "air",
    masteryRank: 1,
    keywords: "Artisanat, Illusion",
    range: "3 m",
    areaOfEffect: "Un petit objet illusoire (30 cm cube ou moins)",
    duration: "1 heure",
    raises: "Zone (+30 cm cube à la taille de l'objet illusoire), Durée (+1 heure)",
    description: "Vous pouvez créer une illusion parfaite d'un objet. Celui-ci semble réel à tous égards jusqu'à l'expiration du sort, où il disparaît. Pour créer un objet familier et spécifique, comme le katana d'un autre samouraï, vous devez déclarer une Augmentation ; cet individu peut alors tenter un jet Contesté de Perception contre le total de votre jet de Lancer de Sort pour détecter la supercherie. Les images créées par ce sort sont parfaitement immobiles et disparaissent instantanément si elles se retrouvent dans une situation exigeant du mouvement (comme flotter sur l'eau). Une image de katana pourrait ainsi être créée posée sur un râtelier, mais pas dans l'obi d'un samouraï en mouvement. Les objets créés par ce sort n'ont aucune substance physique réelle et ne peuvent supporter de poids ni infliger de dégâts."
  },
  {
    name: "Chercher la Vérité",
    ring: "air",
    masteryRank: 1,
    keywords: "",
    range: "Personnelle / Contact",
    areaOfEffect: "Un individu touché (peut être le lanceur)",
    duration: "5 minutes",
    raises: "Durée (+1 minute)",
    description: "Vous invoquez le vent pour purger l'esprit de votre cible, lui apportant clarté. Ce sort peut annuler des malus mentaux ou sociaux temporaires résultant d'un effet mécanique, y compris des Techniques, des rangs de Blessure, ou d'autres sorts. Le TN du jet de Lancer de Sort est augmenté d'un montant égal au Rang de la Technique, au rang de Blessure, ou au Rang de Maîtrise du sort à l'origine du malus. Les Désavantages possédés en permanence par un individu ne peuvent être contrés par ce sort."
  },
  {
    name: "Voix du Vent",
    ring: "air",
    masteryRank: 1,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 personne cible (peut être le lanceur)",
    duration: "10 minutes",
    raises: "Portée (passe à 6 m pour 2 Augmentations), Durée (+2 minutes par Augmentation)",
    description: "Les kami d'Air affectionnent les sons, portés par leur Élément, et peuvent prêter leur pouvoir pour renforcer la beauté, la passion et la conviction de la voix humaine. Le bénéficiaire de ce sort voit sa voix gagner en timbre, en profondeur et en résonance, devenant en tout point plus impressionnante. Pendant la durée du sort, la cible bénéficie de l'Avantage Voix (si elle le possède déjà, les bénéfices se cumulent) et gagne un bonus de +1k0 à tout jet de Compétence Sociale impliquant la parole."
  },
  {
    name: "Voie de la Tromperie",
    ring: "air",
    masteryRank: 1,
    keywords: "Illusion",
    range: "6 m",
    areaOfEffect: "Un double illusoire du lanceur",
    duration: "Concentration plus 5 minutes",
    raises: "Zone (+1 double par 2 Augmentations), Portée (+1,5 m), Spécial (voir description)",
    description: "Vous pouvez prier les esprits capricieux du vent pour créer un double parfait de vous-même à courte distance. L'illusion reflète exactement votre apparence au moment du lancer, y compris vos vêtements et votre équipement. Elle peut apparaître n'importe où dans la portée du sort et effectue les mêmes actions que vous tant que le sort est actif (si vous vous asseyez, votre double s'assied aussi, même sans rien sur quoi s'asseoir). Dès que vous quittez la portée normale du sort, le double disparaît. Avec deux Augmentations sur le jet de Lancer de Sort, vous pouvez quitter la zone d'effet et l'illusion restera dans sa dernière position tant que vous continuez à vous concentrer pour maintenir le sort."
  },
  {
    name: "Yari d'Air",
    ring: "air",
    masteryRank: 1,
    keywords: "Artisanat, Tonnerre",
    range: "Personnelle ou 6 m",
    areaOfEffect: "Une arme créée",
    duration: "5 minutes",
    raises: "Dégâts (+1k0), Durée (+5 minutes), Portée (+1,5 m)",
    description: "Vous invoquez une arme tourbillonnante d'air pur, visible seulement comme un contour brumeux. L'arme prend par défaut la forme d'un yari, mais une Augmentation permet de choisir n'importe quelle autre lance. Elle a un DR de 1k1. Si vous ne possédez pas la compétence Lances, vous pouvez utiliser votre Rang d'École à la place. Si vous la possédez, cette arme confère une Relance Gratuite utilisable pour les manœuvres de Feinte ou d'Augmentation des Dégâts. L'arme disparaît si elle quitte votre main. Vous pouvez aussi la faire apparaître dans les mains d'un allié à moins de 6 m ; celui-ci est alors considéré comme le lanceur pour les besoins du sort, mais ne gagne pas la Relance Gratuite."
  },

  // ============ Sorts d'Air - Rang 2 ============
  {
    name: "Toucher de Benten",
    ring: "air",
    masteryRank: 2,
    keywords: "",
    range: "Personnelle/Contact",
    areaOfEffect: "Individu cible (peut être le lanceur)",
    duration: "1 heure",
    raises: "Portée (peut passer à 1,5 m avec une seule Augmentation)",
    description: "En faisant appel aux kami d'Air pour murmurer des suggestions à autrui, vous pouvez faire percevoir la cible de ce sort de façon plus favorable qu'elle ne le serait autrement. La cible gagne un bonus de +1k1, plus votre Anneau d'Air, au total de tous les jets de Compétence Sociale pendant la durée du sort."
  },
  {
    name: "Appel au Vent",
    ring: "air",
    masteryRank: 2,
    keywords: "Voyage",
    range: "Personnelle ou 6 m",
    areaOfEffect: "Individu cible (peut être le lanceur)",
    duration: "1 minute",
    raises: "Durée (+1 minute), Portée (+1,5 m)",
    description: "Les vents peuvent soulever et porter, transportant même le plus lourd des fardeaux dans les airs pour une courte période. La cible de ce sort gagne une forme limitée de vol, lui permettant de se déplacer dans les airs sans entrave. Elle peut effectuer des Actions de Mouvement Libres, mais pas des Actions de Mouvement Simples, et ne se déplace jamais de plus de 3 m par tour. De forts vents peuvent gêner ce mouvement ou l'empêcher entièrement. À la fin de la durée du sort, la cible redescend sans dommage jusqu'au sol, quelle que soit sa hauteur."
  },
  {
    name: "Chiffre Élémentaire",
    ring: "air",
    masteryRank: 2,
    keywords: "Illusion",
    range: "Contact",
    areaOfEffect: "1 page écrite",
    duration: "1 mois",
    raises: "Durée (+1 semaine par Augmentation), Zone d'Effet (+1 page par Augmentation)",
    description: "Spécial : ce sort n'est connu que des familles Impériales, et est particulièrement prisé des Shugenja Seppun. Comprendre les voies de l'Air révèle la frontière indistincte entre langage et chiffre. Un Shugenja peut placer un écrit sous un chiffre élémentaire, incitant les kami à jouer un petit jeu avec ceux qui lisent le texte. Le bloc de texte devient totalement inintelligible, sauf pour son auteur original ou le destinataire prévu, dont le nom est murmuré au moment du lancer. Normalement, un Chiffre Élémentaire ne peut être cassé par le déchiffrage traditionnel, et les kami ne révèlent le texte véritable qu'au destinataire prévu. D'autres Shugenja peuvent cependant déjouer le jeu des kami et lire le texte via un jet d'Art de la Magie / Intelligence à un TN égal au total du jet de Lancer de Sort original."
  },
  {
    name: "Vol de Colombes",
    ring: "air",
    masteryRank: 2,
    keywords: "Illusion",
    range: "7,5 m",
    areaOfEffect: "Récit conté par 1 personne cible",
    duration: "10 minutes",
    raises: "Portée (+1,5 m par Augmentation), Durée (+5 minutes par Augmentation)",
    description: "Ce sort fut à l'origine conçu par les Illusionnistes Shiba, et compte parmi leurs rares contributions significatives à la magie de Rokugan. Fidèle aux traditions Shiba, il est destiné avant tout au divertissement, mais peut parfois avoir des usages plus pratiques (comme aider un messager à décrire son expérience à son seigneur). Le sort invoque les kami d'Air pour \"illustrer\" un récit conté par un autre individu (désigné par le lanceur). Les esprits fournissent une illusion visuelle et sonore accompagnant l'histoire, puisant les sons et les images dans l'esprit du conteur. Le mélange résultant d'histoire, de son et d'image peut être particulièrement saisissant, et l'on raconte que des conteurs Kakita recherchent activement les maîtres de ce sort pour assister leur art."
  },
  {
    name: "Liberté de l'Air",
    ring: "air",
    masteryRank: 2,
    keywords: "Protections",
    range: "15 m",
    areaOfEffect: "1 maison ou autre bâtiment résidentiel",
    duration: "Heures égales à l'Air du lanceur",
    raises: "Zone d'effet (3 Augmentations pour affecter un bâtiment de la taille d'une auberge, 6 pour un château)",
    description: "Rituel purificateur utilisé par les Shugenja pour préparer une maison ou un bâtiment avant un événement important comme un mariage ou un festival. Le sort convainc les kami d'Air de soulever un vent doux mais soigneusement contrôlé qui balaie toute la saleté, les insectes et autres immondices hors du bâtiment. Il a aussi un effet purificateur spirituel, rendant les esprits malveillants réticents à demeurer dans la demeure : tout kansen, fantôme ou autre esprit désincarné hostile présent quitte les lieux pour un nombre d'heures égal à l'Air du lanceur (les esprits maléfiques exceptionnellement puissants ou fortement attachés au bâtiment ne peuvent être bannis par ce sort de base - au MJ de juger si un esprit est assez fort pour résister à Liberté de l'Air). Ce sort fut conçu à l'origine par les Shugenja Seppun, mais s'est répandu dans tout l'Empire en raison de son utilité."
  },
  {
    name: "Visage Caché",
    ring: "air",
    masteryRank: 2,
    keywords: "Illusion",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "5 minutes",
    raises: "Zone d'Effet (une autre personne en vue peut être ciblée avec 3 Augmentations), Durée (+5 minutes)",
    description: "Les kami d'Air sont espiègles et capricieux, et apprécient tout ce qu'ils perçoivent comme une plaisanterie. Vous pouvez les prier de créer une illusion subtile, modifiant vos traits du visage juste assez pour paraître être une personne différente. Ce sort ne permet pas d'usurper l'identité d'individus spécifiques, ni même de personnes radicalement différentes de vous : vous apparaissez comme une personne du même âge, de la même corpulence, race et genre. Les différences sont assez subtiles pour que l'on puisse vous confondre avec votre propre frère ou cousin."
  },
  {
    name: "Le Murmure du Kami",
    ring: "air",
    masteryRank: 2,
    keywords: "Illusion",
    range: "15 m",
    areaOfEffect: "3 m de rayon",
    duration: "1 tour",
    raises: "Zone (+1,5 m de rayon), Durée (+1 tour), Portée (+1,5 m)",
    description: "Les kami du vent peuvent porter des murmures sur de grandes distances, et même en créer si on les en prie correctement. Vous pouvez leur demander de créer un faux son, qu'il s'agisse d'une voix ou d'un son naturel comme le grognement d'un animal ou de l'eau qui coule. Le son ne peut être plus fort qu'une voix normale et ne peut imiter la voix d'une personne spécifique. Utilisé pour créer le son d'une voix, le sort est limité à vingt mots."
  },
  {
    name: "Brumes d'Illusion",
    ring: "air",
    masteryRank: 2,
    keywords: "Artisanat, Illusion",
    range: "6 m",
    areaOfEffect: "3 m de rayon",
    duration: "1 minute",
    raises: "Zone (+1,5 m), Durée (+1 minute), Portée (+1,5 m)",
    description: "Avec une plus grande aisance envers les kami vient la capacité de façonner des images de plus en plus convaincantes à partir de la matière même du vent. Vous pouvez créer des illusions de tout objet, individu ou image imaginable. Ces images sont immobiles et doivent tenir dans la zone d'effet du sort, mais peuvent être aussi simples ou complexes que désiré. Ces illusions sont purement visuelles, sans composante sonore, ni odeur, etc."
  },
  {
    name: "Quiétude de l'Air",
    ring: "air",
    masteryRank: 2,
    keywords: "Protections",
    range: "Centrée sur le lanceur",
    areaOfEffect: "Sphère de 9 m de diamètre",
    duration: "10 tours",
    raises: "Portée (passe à 15 m pour 2 Augmentations), Durée (+3 tours par Augmentation)",
    description: "La sécurité des communications est primordiale dans bien des situations, et les Shugenja se retrouvent souvent à devoir garantir une conversation totalement privée, ou à ne pas pouvoir se laisser interrompre par des bruits extérieurs. En apaisant les esprits de l'Air, un Shugenja peut les convaincre de créer une barrière contre les sons, une bulle de silence à travers laquelle aucun son ne passe. Cette barrière sphérique est normalement centrée sur le lanceur, bien qu'avec plus d'effort elle puisse aussi être centrée sur un objet physique jusqu'à 15 m de distance. Une fois le sort lancé, les kami n'autorisent aucun son à entrer ou sortir de la bulle, créant une intimité absolue pour quiconque s'y trouve. Une fois créée, la bulle ne se déplace pas, même si le lanceur ou l'objet cible se déplace. Les personnages d'un côté de la barrière gagnent deux Relances Gratuites sur leurs jets de Discrétion effectués contre des personnages de l'autre côté. Les Shugenja Ninube peuvent lancer Quiétude de l'Air comme un Sort de Rien."
  },
  {
    name: "Requête à Hato-no-Kami",
    ring: "air",
    masteryRank: 2,
    keywords: "Voyage",
    range: "45 m",
    areaOfEffect: "1 oiseau",
    duration: "1 heure",
    raises: "Portée (+15 m par Augmentation), Durée (+1 heure par Augmentation)",
    description: "Variante spécialisée de Toucher de la Nature, ce sort est une prière aux Fortunes portée par les kami d'Air jusqu'aux oreilles d'un oiseau au hasard dans la portée du sort (en l'absence d'oiseau disponible, le sort n'a aucun effet). L'oiseau descend se poser sur la main du lanceur, qui peut lui confier une tâche simple (transporter un message, distraire un ennemi) pour la durée du sort. Avec un jet d'Élevage / Intuition réussi à TN 20, le lanceur peut persuader l'oiseau d'accomplir une tâche plus complexe, comme fouiller une zone à la recherche d'ennemis potentiels et faire son rapport (à l'appréciation du MJ, une tâche trop complexe dépassant l'entendement de l'oiseau). Dans tous les cas, l'oiseau ne prend jamais d'action suicidaire (comme voler dans un feu) et rompt immédiatement sa tâche pour fuir s'il est blessé."
  },
  {
    name: "Secrets sur le Vent",
    ring: "air",
    masteryRank: 2,
    keywords: "",
    range: "16 km",
    areaOfEffect: "6 m de rayon",
    duration: "Concentration",
    raises: "Zone (+1,5 m de rayon), Portée (+8 km)",
    description: "Les kami peuvent porter des murmures à travers tout un Empire, si on les en prie correctement. Ce sort nécessite un rituel de préparation pour être lancé efficacement : dix minutes de méditation ininterrompue dans la zone désignée comme zone d'effet du sort. À tout moment dans les 48 heures suivant ce rituel, vous pouvez lancer ce sort et surprendre tout ce qui se dit dans la zone préparée. Si votre concentration est rompue, l'effet cesse et ne peut être renouvelé sans un nouveau rituel de préparation. Une seule zone peut être préparée par ce rituel à la fois."
  },
  {
    name: "Vent Chuchotant",
    ring: "air",
    masteryRank: 2,
    keywords: "Divination",
    range: "6 m",
    areaOfEffect: "Individu cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m)",
    description: "Les kami d'Air font peu de différence entre la parole et la pensée, et peuvent percevoir les deux avec une relative aisance. En comparant les deux, les kami peuvent déterminer si ce qui a été dit est vrai ou mensonger. Malheureusement, leur capacité d'attention est notoirement courte, et ils ne peuvent donc évaluer que des conversations extrêmement récentes. En invoquant ce sort, vous pouvez déterminer si la dernière chose dite par la cible était vraie ou fausse. Les kami n'ont cependant aucune notion d'opinion personnelle : si la cible croit sincèrement que ce qu'elle a dit était vrai, les kami le croiront aussi."
  },
  {
    name: "Sommeils Portés par le Vent",
    ring: "air",
    masteryRank: 2,
    keywords: "",
    range: "15 m",
    areaOfEffect: "1 personne cible",
    duration: "5 minutes",
    raises: "Portée (+3 m par Augmentation), Zone d'Effet (+1 personne par 2 Augmentations), Durée (+1 minute par Augmentation)",
    description: "Ce sort fait s'insinuer subtilement les kami d'Air dans le corps de la cible, la poussant vers la fatigue et le sommeil. Une cible physiquement et mentalement inactive (comme un garde en faction de nuit, ou un samouraï en méditation dans son dojo) s'endort automatiquement en étant ciblée par ce sort (elle se réveille normalement si on la touche ou si un bruit fort survient, mais dort sinon jusqu'à l'expiration du sort). Si la cible est physiquement ou mentalement active, le sort ne l'endort pas, mais elle subit les effets de la Fatigue pour la durée du sort (si elle est déjà Fatiguée, ses malus de Fatigue augmentent comme si elle avait passé un jour de plus sans repos)."
  },
  {
    name: "Proposition du Loup",
    ring: "air",
    masteryRank: 2,
    keywords: "Illusion",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "10 minutes",
    raises: "Zone (peut cibler une autre personne avec 2 Augmentations), Durée (+5 minutes), Spécial (+1 rang d'Honneur par 2 Augmentations)",
    description: "Ce sort, conçu pour faciliter les premiers contacts entre groupes, est facilement détourné à des fins malveillantes. Il appelle les kami à créer une subtile aura de suggestion autour du lanceur, qui ne déguise pas son apparence mais amène les autres à le percevoir comme légèrement plus bienveillant qu'il ne l'est peut-être réellement. Pendant la durée du sort, votre rang d'Honneur est considéré supérieur de 3 rangs pour tout jet de Connaissance : Bushido visant à déterminer votre rang d'Honneur."
  },

  // ============ Sorts d'Air - Rang 3 ============
  {
    name: "Bénédiction du Kami d'Air",
    ring: "air",
    masteryRank: 3,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Le lanceur",
    duration: "8 heures",
    raises: "Spécial (double le bonus pour 4 Augmentations)",
    description: "Prière unique, autant méditation que sort, enseignée uniquement dans les Écoles de Shugenja ayant l'Air pour Affinité. Elle aligne plus justement les kami d'Air au sein de l'âme du lanceur, lui donnant une bien meilleure prise sur le cœur et l'âme des autres, ainsi qu'une certaine vivacité de réaction. Tant que la bénédiction dure, le Shugenja peut ajouter son Anneau d'Air au total de tous les jets basés sur l'Intuition, ainsi qu'à son TN d'Armure. Ceux qui connaissent ce sort accomplissent typiquement la Bénédiction chaque matin lors de leur méditation quotidienne. Les effets de ce sort ne se cumulent pas."
  },
  {
    name: "Essence de l'Air",
    ring: "air",
    masteryRank: 3,
    keywords: "Défense",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "5 tours",
    raises: "Durée (+1 tour)",
    description: "L'Air peut se mêler à l'essence d'un mortel, ce qui peut conférer des capacités formidables, au prix d'un grand risque pour le lanceur. Vous vous mêlez au vent lui-même et devenez immatériel : vous ne pouvez interagir avec aucun objet physique tant que vous êtes immatériel, bien que vous restiez au sol, et pouvez traverser des objets solides à raison de 30 cm par tour. Votre Anneau d'Eau est considéré réduit de moitié (arrondi au inférieur) tant que vous restez immatériel, et vous ne pouvez lancer aucun autre sort avant de redevenir solide."
  },
  {
    name: "L'Œil ne Verra Point",
    ring: "air",
    masteryRank: 3,
    keywords: "Défense",
    range: "Personnelle ou Contact",
    areaOfEffect: "Soi-même ou individu cible",
    duration: "Concentration",
    raises: "Aucune",
    description: "Vous faites appel aux kami pour créer une zone de distraction autour de vous, détournant toute attention de vous et de vos actions. Les kami murmurent aux oreilles de quiconque se trouve à moins de 6 m de vous (ou de la cible, si le sort est lancé sur quelqu'un d'autre), les distrayant opportunément de votre présence. Vous n'êtes pas invisible, mais quiconque se trouve à moins de 6 m ne vous verra pas tant que vous ne faites pas de bruit fort ni n'attirez autrement l'attention sur vous. Ceux qui se trouvent au-delà de cette distance ne sont pas distraits et vous voient parfaitement, quelles que soient vos actions."
  },
  {
    name: "Langue Brouillée",
    ring: "air",
    masteryRank: 3,
    keywords: "Illusion",
    range: "9 m",
    areaOfEffect: "2 personnes en conversation (l'une peut être le lanceur)",
    duration: "5 minutes",
    raises: "Zone d'Effet (+1 personne par 2 Augmentations), Durée (+1 minute par Augmentation)",
    description: "Développé à l'origine par les Shugenja Asahina, ce sort s'est répandu chez les Soshi et quelques autres ordres après plusieurs incidents mineurs en cour. Parfois considéré comme un sort déshonorant, il n'est pourtant pas nécessairement destiné à la subterfuge - à l'image de la technique de Cadence des courtisans Grue, il permet la discrétion dans la communication là où elle ne serait normalement pas possible, en s'appuyant sur le caractère joueur des kami d'Air et les subtilités du langage. Le sort fait obscurcir par les kami une conversation entre deux personnes ou plus. Les esprits d'Air créent une seconde couche de discours, entendue par tous sauf les participants réels à la conversation (qui peuvent inclure le lanceur). Bien que les interlocuteurs aient conscience de cette fausse couche, ils entendent clairement la véritable conversation. L'illusion ne peut normalement être percée qu'en lisant sur les lèvres (puisqu'elles ne correspondent pas à la fausse conversation), bien qu'un Shugenja puisse déjouer la supercherie en remportant un jet Contesté de Rang d'École / Air contre le lanceur."
  },
  {
    name: "Masque du Vent",
    ring: "air",
    masteryRank: 3,
    keywords: "Illusion",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "1 heure",
    raises: "Zone (peut cibler une autre personne avec 2 Augmentations), Durée (+10 minutes)",
    description: "Un Shugenja habile peut prier les kami de créer des illusions incroyablement élaborées pour dissimuler son identité et son apparence. Vous pouvez adopter l'apparence de toute créature humanoïde de taille approximativement similaire, jusqu'à 30 cm de plus ou de moins que vous. Vous pourriez ainsi prendre l'apparence d'un kenku, à peu près de la même taille qu'un humain, mais pas d'un gobelin ou d'un ogre, respectivement trop petit et trop grand."
  },
  {
    name: "Âme de Kaze-no-Kami",
    ring: "air",
    masteryRank: 3,
    keywords: "",
    range: "6 m",
    areaOfEffect: "1 personne cible (peut être le lanceur)",
    duration: "10 minutes",
    raises: "Durée (+2 minutes par Augmentation)",
    description: "Ce sort invoque la Fortune du Vent pour infuser l'âme de la cible de la sérénité glaciale d'une brise nordique, la rendant résistante aux pressions de l'émotion et du stress. La cible semble imperméable à toute manipulation émotionnelle ou pression psychologique ; en réalité, elle ressent des émotions normales, mais la présence des kami d'Air en atténue l'impact, si bien que la cible perçoit ses propres émotions comme quelque chose de distant et d'abstrait. La cible gagne un bonus de +2k2 pour résister aux effets de tout jet de Compétence Sociale ou effet de Peur. Cependant, cette même sérénité glaciale qui la rend résistante à la manipulation d'autrui lui rend aussi difficile de percevoir les émotions des autres : elle subit un malus de -2k0 à tout jet social basé sur l'Intuition."
  },
  {
    name: "Frapper la Tempête",
    ring: "air",
    masteryRank: 3,
    keywords: "Défense",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "3 tours",
    raises: "Durée (+1 tour)",
    description: "Les vents les plus puissants peuvent dévier non seulement les flèches, mais aussi l'acier. Vous pouvez invoquer une rafale de vents qui vous entoure d'un cocon tourbillonnant ininterrompu. Votre TN d'Armure est augmenté de +20 contre les attaques de mêlée comme à distance. La force des vents vous entourant vous empêche cependant d'entendre quiconque vous parle."
  },
  {
    name: "Invocation de la Bourrasque",
    ring: "air",
    masteryRank: 3,
    keywords: "Défense",
    range: "15 m",
    areaOfEffect: "Individu cible (peut être le lanceur)",
    duration: "Concentration",
    raises: "Portée (+1,5 m)",
    description: "Des vents tourbillonnants peuvent être commandés pour encercler une cible désignée, empêchant les attaques à distance dans les deux sens. Ce sort affecte une zone de 9 m tout autour de la cible. Quiconque se trouve dans cette zone gagne un bonus de +15 à son TN d'Armure contre les attaques à distance, mais subit aussi un malus de -3k3 à tous ses jets d'attaque à distance."
  },
  {
    name: "Invoquer le Brouillard",
    ring: "air",
    masteryRank: 3,
    keywords: "",
    range: "30 m",
    areaOfEffect: "15 m de rayon",
    duration: "1 minute",
    raises: "Zone (+1,5 m de rayon), Durée (+1 minute), Portée (+3 m)",
    description: "On peut prier les kami de se rassembler dans une zone comme ils le font sur les côtes, créant un brouillard épais et opaque. Dans la zone affectée, la visibilité est réduite à seulement 1,5 m. Les tissus et autres matériaux absorbants présents dans la zone deviendront humides, voire trempés, s'ils y restent assez longtemps. De petites sources de flamme nue, comme des bougies, peuvent aussi s'éteindre, à la discrétion du MJ. L'humidité du brouillard est particulièrement dommageable pour le papier de riz."
  },
  {
    name: "Toucher de la Grâce de l'Air",
    ring: "air",
    masteryRank: 3,
    keywords: "Illusion",
    range: "Contact",
    areaOfEffect: "1 personne cible (peut être le lanceur)",
    duration: "1 heure",
    raises: "Durée (+10 minutes par Augmentation)",
    description: "Cette illusion fut à l'origine conçue par la famille Soshi, mais des prières similaires ont depuis été développées par d'autres clans fréquentant les couloirs et jardins des palais de cour de Rokugan. Le sort incite les kami d'Air à subtilement rehausser l'attrait physique de la cible, soulignant ses meilleurs traits et lissant ses imperfections. Les kami d'Air trouvent cela un jeu délicieux et se montrent souvent fort créatifs dans les petites astuces employées pour améliorer l'attrait de la cible. Mécaniquement, le sort annule les effets des Désavantages Physionomie Repoussante et Malédiction de Benten pour sa durée. Si la cible ne possède pas l'un ou l'autre de ces Désavantages, elle gagne à la place les bénéfices de l'Avantage correspondant (Beauté Dangereuse ou Bénédiction de Benten). Si elle possède déjà les deux Avantages, le sort n'apporte aucun bénéfice supplémentaire (les kami d'Air trouvent ennuyeux d'essayer d'améliorer quelqu'un déjà si séduisant)."
  },
  {
    name: "L'Ennemi de Votre Cœur",
    ring: "air",
    masteryRank: 3,
    keywords: "Illusion",
    range: "7,5 m",
    areaOfEffect: "Un individu cible",
    duration: "5 tours",
    raises: "Durée (+1 tour), Portée (+1,5 m)",
    description: "Les kami peuvent voir dans le cœur des mortels, et utiliser cette information à la demande d'un Shugenja. Vous manifestez à travers les kami une illusion de ce que votre cible craint le plus au monde : un individu (l'homme qui a tué son père), un objet (une lame maudite ayant ruiné sa famille), ou même une scène (l'image d'un ennemi massacrant sa famille). Cela génère effectivement une Peur 4 que la cible doit surmonter. Seule la cible peut voir les détails de l'illusion ; les autres ne perçoivent qu'un vague contour ressemblant à un petit nuage de brume."
  },

  // ============ Sorts d'Air - Rang 4 ============
  {
    name: "Appeler l'Esprit",
    ring: "air",
    masteryRank: 4,
    keywords: "",
    range: "Spéciale",
    areaOfEffect: "Esprit cible",
    duration: "5 minutes",
    raises: "Durée (+1 minute)",
    description: "Forme extrêmement puissante et spécifique du sort de base Invocation, Appeler l'Esprit permet à un Shugenja d'invoquer n'importe quel esprit précis, quel que soit son royaume, pour un entretien. Vous pouvez invoquer tout esprit issu de n'importe quel royaume spirituel, bien que les habitants de ces royaumes qui ne sont pas des esprits (comme les Fortunes) y soient immunisés. Si vous savez quelque chose de spécifique sur l'esprit, l'ayant déjà vu ou connaissant intimement ses actes (par exemple \"l'esprit qui a tué mon père\"), vous pouvez invoquer cet esprit en particulier. La nature du sort empêche l'esprit de vous attaquer sauf si vous attaquez le premier, mais il ne sera pas nécessairement amical. L'esprit disparaît dès l'expiration du sort. Ce sort peut potentiellement invoquer des créatures extrêmement dangereuses, comme des oni, et doit être utilisé avec prudence."
  },
  {
    name: "Château d'Air",
    ring: "air",
    masteryRank: 4,
    keywords: "Défense, Illusion",
    range: "Soi-même",
    areaOfEffect: "6 m de rayon autour du lanceur",
    duration: "10 tours",
    raises: "Durée (+2 tours par Augmentation), Spécial (voir description)",
    description: "La prière communément appelée Château d'Eau protège le lanceur en créant une barrière physique d'esprits d'eau pour bloquer les attaquants. Le Château d'Air, à l'inverse, protège le lanceur en créant une illusion rusée qui déroute et confond les attaquants. Les kami d'Air créent une barrière circulaire de faux sons et images, rendant incroyablement difficile pour les attaquants de percevoir l'emplacement réel de quiconque se trouve dans les limites du Château d'Air - un attaquant peut croire frapper le lanceur alors qu'il ne frappe que le vide. La barrière circulaire d'illusions est centrée sur le lanceur ; une fois lancée, elle reste en place quel que soit son déplacement. Les illusions ne peuvent être pleinement perçues que par ceux qui se trouvaient hors du Château au moment du lancer ; ceux qui s'y trouvaient déjà perçoivent aisément la nature ombreuse et immatérielle des illusions. Si des ennemis venus de l'extérieur tentent d'attaquer quelqu'un à l'intérieur, les illusions tentent de les tromper : mécaniquement, ces attaquants doivent réussir un jet Contesté de Perception contre l'Air du lanceur à chaque tentative d'attaque. Un succès signifie qu'ils voient brièvement à travers l'illusion et peuvent attaquer normalement ce tour-là (seulement). Un échec signifie que l'illusion les trompe, leur infligeant un malus de -5k0 à leur jet d'attaque ce tour. Les illusions n'affectent pas les sorts ennemis, les kami d'Air ne pouvant tromper d'autres kami."
  },
  {
    name: "Royaume Trompeur",
    ring: "air",
    masteryRank: 4,
    keywords: "Bataille, Illusion",
    range: "75 m",
    areaOfEffect: "30 m de rayon",
    duration: "1 heure",
    raises: "Zone (+3 m de rayon), Durée (+10 minutes)",
    description: "Les plus grands maîtres du vent peuvent créer des illusions d'une beauté et d'une clarté telles que ceux qui en sont affectés pourraient réellement croire se trouver ailleurs. Vous pouvez entièrement modifier l'apparence du terrain dans la zone d'effet de ce sort : faire ressembler, sonner et sentir un marais misérable comme un magnifique jardin, ou l'inverse. Bien que ces illusions puissent être extraordinairement complexes et totalement convaincantes pour tous les autres sens, elles n'ont aucune substance et ne peuvent être touchées."
  },
  {
    name: "Rites Funéraires",
    ring: "air",
    masteryRank: 4,
    keywords: "",
    range: "N/A",
    areaOfEffect: "N/A",
    duration: "5 minutes",
    raises: "",
    description: "Ce rituel fut conçu à l'origine par les sodan-senzo Kitsu mais, en raison de son utilité universelle, s'est rapidement répandu à d'autres familles et Écoles de Shugenja. Les Kitsu souhaitaient que tous les Rokugani vénèrent correctement leurs ancêtres, et n'eurent donc aucune difficulté à partager leur découverte avec les Isawa et les autres clans. Pour ceux qui n'ont pas le sang Kitsu, ce sort est l'un des très rares moyens pour un Shugenja de réellement communiquer avec les ancêtres tout en restant à Ningen-Do. Le sort est en réalité un rituel de prière d'une heure, qui ne peut être accompli qu'en compagnie d'un parent d'un défunt récent, dans les vingt-quatre heures suivant les funérailles (auxquelles le Shugenja et le parent doivent tous deux avoir dûment participé). D'autres Shugenja peuvent assister au rituel s'ils connaissent aussi le sort ; ils n'ont pas besoin de faire de jet de Lancer de Sort, mais consomment tout de même un emplacement de sort. Une fois la prière correctement achevée (un jet de Lancer de Sort réussi par le Shugenja principal), le lanceur et le parent peuvent tous deux converser quelques minutes avec l'esprit du défunt récent (chaque Shugenja assistant supplémentaire ajoute +1 minute à la durée du sort). Ce rituel n'est typiquement utilisé que lorsque les proches vivants souhaitent s'assurer de bien honorer et se souvenir de leur ancêtre nouvellement disparu. Les résultats exacts de cette communion sont laissés à la discrétion du MJ, mais peuvent inclure l'obtention d'informations importantes, de conseils, ou la reprise d'une tâche laissée inachevée par le défunt."
  },
  {
    name: "Don du Vent",
    ring: "air",
    masteryRank: 4,
    keywords: "Illusion",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "5 minutes",
    raises: "Durée (+1 minute)",
    description: "Le don ultime des esprits du vent est de devenir comme le vent lui-même : invisible. Les kami du vent vous entourent et vous rendent totalement invisible. Aucune vision non-magique ne peut détecter votre présence. Vous pouvez toujours être touché, entendu et senti, mais tant que vous n'attaquez personne, vous restez invisible pour la durée du sort. Les kami considèrent qu'attaquer quelqu'un gâche la plaisanterie, et mettent immédiatement fin à l'effet du sort si vous le faites."
  },
  {
    name: "Hurlement d'Isora",
    ring: "air",
    masteryRank: 4,
    keywords: "Tonnerre",
    range: "30 m",
    areaOfEffect: "12 m de diamètre",
    duration: "Instantané",
    raises: "Portée (+6 m par Augmentation), Zone d'Effet (+1,5 m de diamètre pour 2 Augmentations), Spécial (+1k0 dégâts par Augmentation)",
    description: "Ce sort fait appel au pouvoir d'Isora, la Fortune du Rivage, pour déchaîner une bourrasque d'air chargé de tempête et de foudre qui frappe une zone à portée. L'assaut soudain et grondant de vent, de pluie et de foudre inflige 3k2 dégâts à tous ceux présents dans la zone d'effet, qui doivent réussir un jet de Terre à TN 30 ou être Fatigués par le hurlement d'Isora. Le sort endommage aussi les objets physiques fragiles ou vulnérables : les cloisons de papier sont soufflées, les parchemins trempés, etc. Ceux qui ont la chance d'être bénis par le Sang d'Osano-Wo sont immunisés aux effets de ce sort.",
    damage: { mode: "fixed", rolled: 3, kept: 2, note: "Immunisé si béni par le Sang d'Osano-Wo." }
  },
  {
    name: "Connaître l'Esprit",
    ring: "air",
    masteryRank: 4,
    keywords: "",
    range: "3 m",
    areaOfEffect: "Individu cible",
    duration: "3 tours",
    raises: "Durée (+1 tour), Portée (+1,5 m)",
    description: "Bien que les secrets ultimes de l'esprit humain restent à jamais cachés au vent, les kami d'Air peuvent cueillir les pensées les plus immédiates dans l'esprit des autres et les murmurer à ceux qui ont leur faveur. Pendant la durée de ce sort, vous entendez essentiellement les pensées de surface de la cible : vous n'apprenez que ce à quoi elle pense activement. Par exemple, si vous demandez le nom de la fille de la cible, ce nom apparaîtrait instantanément dans son esprit même si elle n'avait aucune intention de le prononcer à voix haute. Un jet Contesté de votre Perception contre l'Intuition de la cible vous permet aussi d'évaluer son véritable état émotionnel, indépendamment de son apparence physique."
  },
  {
    name: "Regarder dans l'Âme",
    ring: "air",
    masteryRank: 4,
    keywords: "Divination",
    range: "15 m",
    areaOfEffect: "1 personne ou créature cible",
    duration: "1 tour",
    raises: "Zone d'Effet (1 cible supplémentaire par 2 Augmentations), Spécial (apprend un Anneau supplémentaire par Augmentation)",
    description: "Lorsqu'un prêtre invoque cette incantation, les kami d'Air se rassemblent et forment une lentille mystique à travers laquelle le Shugenja peut voir le monde comme les esprits eux-mêmes le perçoivent. La lentille ne dure que quelques instants et le lanceur ne peut normalement l'utiliser que pour observer une seule personne ou créature. Ce bref moment d'observation lui permet cependant d'apprendre les 2 Anneaux les plus faibles de la cible et les valeurs de leurs Traits constitutifs, révélant en partie sa composition élémentaire (si les Anneaux du personnage sont tous parfaitement équilibrés, le sort les révèle au hasard). Des Anneaux supplémentaires peuvent être appris avec des Augmentations. Le sort ne peut cependant jamais révéler le Vide de la cible, un tel niveau de compréhension et de perception n'étant possible que par la maîtrise de l'Ishiken-do."
  },
  {
    name: "Netsuke de Vent",
    ring: "air",
    masteryRank: 4,
    keywords: "Artisanat, Illusion",
    range: "Contact",
    areaOfEffect: "Un objet tenu en main",
    duration: "1 heure",
    raises: "Durée (+10 minutes)",
    description: "Bien que cela requière une grande faveur, les kami d'Air acceptent de se solidifier temporairement s'ils sont suffisamment attachés au prêtre qui les prie. Vous pouvez créer un petit objet à partir de l'air lui-même, tenable dans une ou deux mains et pesant au maximum 9 kg. Cette création est une illusion, mais peut être utilisée fonctionnellement, y compris pour infliger des dégâts s'il s'agit d'une arme. L'objet disparaît complètement à la fin de la durée du sort."
  },
  {
    name: "Chercher la Voie",
    ring: "air",
    masteryRank: 4,
    keywords: "Illusion",
    range: "Contact",
    areaOfEffect: "Trace du lanceur sur 800 m",
    duration: "3 heures",
    raises: "Durée (+1 heure par Augmentation), Zone d'Effet (1 trace de personne supplémentaire par Augmentation), Spécial (400 m de trace supplémentaires par Augmentation)",
    description: "Ce sort est une illusion subtile utilisée pour dissimuler la trace d'un Shugenja à ses poursuivants. Il convainc les kami d'Air facétieux de cacher les traces du Shugenja (et de sa monture, le cas échéant), ainsi que toute autre preuve de son passage (branches cassées, etc.), et de créer à la place une fausse piste de preuves similaires menant dans une direction complètement différente sur la même distance. La piste illusoire suit un itinéraire raisonnable (elle ne grimpera pas droit une falaise ni ne plongera directement dans un lac) et est normalement irréprochable pour la perception d'autrui ; cependant, quelqu'un pistant à l'odorat pourra sentir la trace originale, et des pisteurs habiles peuvent potentiellement percer l'illusion via un jet de Chasse / Perception contre l'Art de la Magie / Air du lanceur. Les Shugenja puissants peuvent persuader les kami de dissimuler aussi les traces de leurs compagnons (et montures), ainsi que d'allonger la distance de trace dissimulée et remplacée."
  },
  {
    name: "Symbole d'Air",
    ring: "air",
    masteryRank: 4,
    keywords: "Protections",
    range: "Contact",
    areaOfEffect: "Spéciale",
    duration: "Permanente",
    raises: "Aucune",
    description: "Les prêtres des kami peuvent inscrire de puissantes protections invoquant la puissance des éléments contre quiconque tenterait de les franchir. Un Symbole d'Air doit être inscrit sur un objet solide, le plus souvent une porte, une fenêtre, un portail ou tout autre passage. Quiconque tente de franchir ce passage ou de contourner la zone protégée par le Symbole est affecté par la protection : il doit réussir un jet Contesté de Terre contre l'Air du lanceur. Ceux qui échouent sont pris d'une puissante somnolence et doivent réussir un jet de Volonté contre le total du jet de Lancer de Sort ayant créé la protection, sous peine de sombrer dans un profond sommeil d'une heure. Ceux affectés ne peuvent être réveillés par des moyens normaux, mais se réveillent instantanément s'ils subissent une attaque ou tout dommage, les kami refusant de participer à une plaisanterie aussi dénuée d'humour. Un seul Symbole d'Air peut exister à la fois, et des sorts Symbole d'éléments différents ne peuvent jamais affecter la même zone. Ce sort peut être dissipé par un autre lancer de Symbole d'Air par n'importe quel Shugenja, ou en détruisant la surface où le Symbole a été gravé."
  },
  {
    name: "Oreille de Tenjin",
    ring: "air",
    masteryRank: 4,
    keywords: "Voyage",
    range: "Lanceur",
    areaOfEffect: "9 m de rayon autour du lanceur",
    duration: "5 minutes",
    raises: "Portée (passe à Contact pour 3 Augmentations), Zone d'Effet (+1,5 m de rayon par Augmentation), Durée (+1 minute par Augmentation)",
    description: "Spécial : doit être un Shugenja du Clan de la Licorne. Nommée d'après la Fortune des Scribes, cette puissante incantation fut conçue à l'origine par la Licorne et dérivée de leur magie secrète du Meishodo. À la connaissance de tous, ce sort n'a jamais été enseigné hors du Clan de la Licorne. Il persuade les kami d'Air de porter le vrai sens des mots jusqu'à l'oreille du lanceur, lui permettant de comprendre la langue des étrangers. Pendant la durée du sort, toute parole humaine audible dans la zone d'effet devient intelligible pour le lanceur, quelle que soit la langue employée. Le sort ne confère aucune ouïe renforcée (les murmures restent donc inaudibles), ni la capacité de répondre dans cette langue."
  },
  {
    name: "Murmures des Oubliés",
    ring: "air",
    masteryRank: 4,
    keywords: "",
    range: "15 m",
    areaOfEffect: "1 personne cible (peut être le lanceur)",
    duration: "5 minutes",
    raises: "Portée (+7,5 m par Augmentation), Durée (+1 minute par Augmentation)",
    description: "La mémoire des hommes est chose fragile et lointaine, nichée au plus profond de leur esprit, et presque tous les mortels possèdent quelque péché passé, quelque honte qu'ils préféreraient avoir oublié. Ce sort, prisé des Scorpions, fait évoquer par les kami d'Air les souvenirs et visions de crimes passés. Les souvenirs douloureux et constants distraient et angoissent la victime du sort, lui rendant difficile d'accomplir quoi que ce soit. Pendant la durée du sort, elle doit déclarer une Augmentation sans effet sur tout jet de Compétence ou de Lancer de Sort qu'elle effectue (si elle possède 3 points ou plus en Désavantages Mentaux ou Sociaux, elle doit en déclarer 2 à la place). On notera qu'il existe à Rokugan une poignée d'âmes intègres qui n'ont véritablement aucun péché les hantant : ces rares individus sont immunisés aux effets de ce sort - au MJ de juger si une cible donnée est réellement assez noble pour se soustraire aux Murmures des Oubliés. Certains prêtres de nature plus ascétique sont aussi connus pour se lancer ce sort à eux-mêmes, afin de se rappeler leurs échecs passés et la nécessité de l'humilité face à leurs faiblesses humaines."
  },
  {
    name: "Sagesse du Kami",
    ring: "air",
    masteryRank: 4,
    keywords: "",
    range: "Contact",
    areaOfEffect: "Le lanceur",
    duration: "1 minute",
    raises: "Durée (+1 minute par Augmentation), Spécial (+1 rang de Compétence supplémentaire, une fois, pour 3 Augmentations)",
    description: "Cette prière invite les kami d'Air dans l'esprit même du Shugenja, rehaussant son esprit et ses pensées, lui permettant de mieux tirer parti de ses compétences et de son savoir. Pendant la durée du sort, le lanceur gagne 1 rang dans toutes les Compétences qu'il possède déjà normalement, et peut bénéficier de toute Capacité de Maîtrise que cela lui octroierait. Cela ne peut accorder de rangs que dans des Compétences déjà possédées par le Shugenja - les kami d'Air ne peuvent évoquer un savoir que le lanceur ne possède pas. À l'expiration du sort, tous les bénéfices sont perdus, et les souvenirs du savoir ou de la perspicacité gagnés pendant sa durée restent au mieux flous ; aucun compte précis ou détaillé ne peut jamais en être donné, et de sévères migraines sont connues pour affliger ceux qui s'y essaient trop fort. Les bénéfices de ce sort ne s'appliquent qu'aux Compétences réellement connues du lanceur - il ne peut augmenter le rang de Compétences temporairement acquises par magie, ni se combiner à des Avantages comme Ingénieux."
  },

  // ============ Sorts d'Air - Rang 5 (partiel - voir TODO) ============
  {
    name: "Voiler l'Esprit",
    ring: "air",
    masteryRank: 5,
    keywords: "",
    range: "Contact",
    areaOfEffect: "Un individu cible",
    duration: "Permanente",
    raises: "Spécial (+1 jour d'effet)",
    description: "Ce sort extrêmement intrusif est considéré comme blasphématoire par la plupart des Shugenja honorables, et de nombreux ordres respectables y verraient un motif d'excommunication, voire d'exécution pure et simple. Il fait appel aux kami d'Air pour désorienter et troubler une cible, envahissant son esprit et altérant sa capacité à se souvenir exactement de ce qui lui est arrivé sur une certaine période. Lorsque ce sort est lancé avec succès contre une cible, le lanceur doit réussir un jet Contesté de son Air contre la Terre de la cible. En cas de succès, les souvenirs de la cible sont perturbés, et elle oublie ce qui lui est arrivé durant la semaine (cinq jours) écoulée - cette information est totalement perdue pour elle. Pire encore, le sort la rend extrêmement susceptible à la suggestion, et le lanceur peut alors lui raconter ce qui lui est \"arrivé\" durant la période manquante. Cela permet à des Shugenja sans scrupules d'exploiter autrui en leur donnant essentiellement de faux souvenirs, bien que certains individus soient très résistants à ce type de manipulation. Il est possible de déterminer qu'un individu a été la cible de ce sort via l'usage du sort Communion, mais cela exige de demander spécifiquement aux kami s'ils peuvent détecter une telle manipulation."
  },
  {
    name: "Défenseur de l'Au-delà",
    ring: "air",
    masteryRank: 5,
    keywords: "Bataille",
    range: "9 m",
    areaOfEffect: "1 esprit invoqué",
    duration: "5 minutes",
    raises: "Durée (+1 minute par Augmentation)",
    description: "Spécial : doit être un Shugenja Kitsu. Parmi les cercles les plus intimes de la famille Kitsu se trouvent les Shugenja ancestraux porteurs du sang des premiers esprits kitsu. Ces Shugenja secrets ont découvert des rituels capables de convaincre les kami d'Air de porter un message jusqu'à Yomi elle-même, appelant à l'aide un shiryo ancestral. Seuls les Shugenja Kitsu peuvent apprendre ce sort, un secret de l'ordre des sodan-senzo. Au lancer, le Shugenja implore les esprits ancestraux de Yomi d'envoyer de l'aide. Si le jet de Lancer de Sort réussit, un shiryo - un esprit venu de Yomi - arrive sur les lieux en cinq tours. À son arrivée, l'esprit reprend sa forme mortelle, mais sa nature spirituelle se ressent aisément à la lueur céleste qui l'entoure. Il offre toute l'aide qu'il peut au lanceur, que ce soit un conseil, un savoir ou un soutien au combat, mais ne fera rien de déshonorant. Mécaniquement, un shiryo typique possède le trait de créature Esprit, un rang de 3 dans tous ses Anneaux et Traits, et un rang de 4 dans toute Compétence utile. Une fois la durée du sort expirée, le shiryo retourne immédiatement à Yomi ; il y retourne aussi si son corps physique est détruit (réduit à zéro Blessure). Bien que ce sort invoque normalement un shiryo \"générique\", le MJ peut choisir de permettre au Shugenja d'invoquer un esprit ancestral nommé et spécifique avec des Augmentations supplémentaires, ou de faire répondre un shiryo plus puissant ou célèbre si les circonstances le justifient. Les shiryo les plus puissants possèdent une École adaptée à leur clan ancestral, typiquement avec un Rang d'École entre 3 et 5."
  },
  {
    name: "Repousser l'Ombre",
    ring: "air",
    masteryRank: 5,
    keywords: "",
    range: "30 m",
    areaOfEffect: "9 m de rayon",
    duration: "Instantané",
    raises: "Zone (+1,5 m de rayon), Portée (+3 m)",
    description: "Tout comme les kami façonnent les illusions, ils peuvent aussi les dissiper. Dans la zone affectée par ce sort, toute illusion créée par un sort de Rang de Maîtrise 4 ou inférieur est automatiquement dissipée. Les sorts de Rang de Maîtrise 5 ou 6 nécessitent un jet Contesté d'Air entre vous et le Shugenja qui les a créés ; en cas de succès, ces illusions sont également dissipées. Les effets magiques persistants qui ne sont pas des illusions peuvent aussi être dissipés par ce sort, mais nécessitent un jet Contesté d'Anneau entre vous et leur créateur, votre Air contre son Anneau approprié."
  },
  {
    name: "Échos sur la Brise",
    ring: "air",
    masteryRank: 5,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Un individu cible",
    duration: "Concentration",
    raises: "Aucune",
    description: "Aucune destination n'échappe à la portée du vent. Par une simple prière aux kami, vous pouvez porter vos mots à travers tout l'Empire, murmurant à l'oreille de quiconque vous devez contacter. La personne doit vous être connue, et le sort établit un lien entre vous deux tant que vous vous concentrez. Vous pouvez alors communiquer l'un avec l'autre, bien que vous n'entendiez chacun que des murmures. Les deux participants prennent instantanément conscience de la connexion établie, et l'un ou l'autre peut y mettre fin à tout moment."
  },
  {
    name: "Affronter Ses Démons",
    ring: "air",
    masteryRank: 5,
    keywords: "",
    range: "9 m",
    areaOfEffect: "1 personne ou créature cible",
    duration: "10 tours",
    raises: "Portée (+3 m par Augmentation), Durée (+2 tours par Augmentation)",
    description: "Sort dangereux et puissant, apparu de temps à autre chez les Shugenja ronin depuis près d'un millénaire d'histoire rokugani. Souvent considéré comme malfaisant par les Shugenja de Clan, les ronin qui l'apprennent en gardent jalousement le secret et ne le transmettent qu'à leurs élèves les plus fiables - généralement, pas plus d'un ou deux Shugenja par génération l'apprennent. À l'époque des Guerres de Clan, son utilisateur le plus célèbre fut le ronin Heichi Chokei, qui prétendait descendre du Clan du Sanglier disparu depuis longtemps. Interrogé sur le but du sort, Chokei répondit en souriant : \"Il est pour quiconque a le courage de l'utiliser.\" Plus tard, il devint aussi connu comme le sort favori de Naka Kuro, le soi-disant Grand Maître des Éléments, et de son élève et successeur Naka Tokei. Affronter Ses Démons semble faire appel aux kami d'Air pour éprouver l'équilibre karmique et élémentaire d'une âme en désalignant délibérément les Éléments de la cible. Le sort échange le Trait le plus élevé et le plus bas de la cible pour sa durée, ce qui peut entraîner des changements dans ses rangs d'Anneau, avec des conséquences potentiellement sévères (par exemple, un Anneau de Terre réduit diminuant les Blessures disponibles). Le lanceur peut choisir les Traits affectés en cas d'égalité. Ceux qui utilisent Affronter Ses Démons y voient un moyen d'enseigner à autrui l'importance de l'équilibre en toute chose, mais des usages bien plus sinistres et cruels sont certainement possibles et ont été employés plus d'une fois, valant au sort une réputation funeste. Les esprits d'Air semblent trouver le sort amusant, car ils ne reconnaissent pas toujours le mal qu'il peut causer."
  },
  {
    name: "Légion de la Lune",
    ring: "air",
    masteryRank: 5,
    keywords: "Illusion",
    range: "Personnelle",
    areaOfEffect: "3 m de rayon autour du lanceur",
    duration: "5 minutes",
    raises: "Zone (+1,5 m), Durée (+1 minute)",
    description: "La Lune peut révéler ce qui est caché, mais aussi dissimuler ceux qui reçoivent ses bénédictions. Vous pouvez invoquer la plus grande bénédiction de la Lune et en envelopper un large groupe de personnes, les soustrayant complètement à la vue. Chaque individu que vous choisissez dans la zone d'effet devient invisible à tous les sens normaux pour la durée du sort. Ceux présents dans la zone que vous choisissez d'exclure ne sont pas affectés. Quiconque affecté par le sort et effectuant une action impliquant un contact physique avec un autre individu est immédiatement exclu de l'effet du sort."
  },
  {
    name: "Lames du Tueur",
    ring: "air",
    masteryRank: 5,
    keywords: "Tonnerre",
    range: "9 m",
    areaOfEffect: "Corridor d'air de 3 m de large",
    duration: "Instantané",
    raises: "Zone (+1 m de large), Dégâts (+1k0 par 3 Augmentations)",
    description: "Le vent peut être mortel pour qui n'est pas préparé à sa furie. Vous invoquez un vent puissant qui déchire tout sur son passage. À votre demande, les kami créent un corridor d'air empli d'un vent tranchant infligeant un DR égal à votre Anneau d'Air +2k0 à tout ce qui se trouve sur son chemin (par exemple, un Shugenja avec un Anneau d'Air 4 infligerait 6k4 dégâts avec ce sort). Le papier et les tissus légers sont détruits instantanément, tandis que les tissus plus épais ne sont qu'endommagés. Quiconque subit des dégâts de ces vents doit réussir un jet d'Anneau de Terre (TN 20) ou être Renversé.",
    damage: { mode: "ring", ring: "air", rolled: 2, kept: 0, note: "La cible subit aussi un Renversement si elle échoue son jet d'Anneau de Terre (TN 20)." }
  },

  // ============ Sorts d'Air - Rang 6 ============
  {
    name: "Lève-toi, Air",
    ring: "air",
    masteryRank: 6,
    keywords: "",
    range: "9 m",
    areaOfEffect: "Un esprit invoqué",
    duration: "Concentration",
    raises: "Aucune",
    description: "Le vent lui-même prend forme pour vous défendre. Aboutissement ultime du sort d'Invocation, ce sort invoque un kami massif d'air pur à votre service. Il prend une forme vaguement humanoïde d'environ 3 mètres de haut, son contour indistinct ne se révélant que par les petits débris pris dans son corps. Le kami peut se déplacer jusqu'à 3 m x votre Air par tour, et génère de puissants vents dans un rayon de 6 m autour de lui, entravant le mouvement et empêchant quiconque dans cette zone d'effectuer des Actions de Mouvement Simples. Le kami manifesté est considéré comme ayant tous ses Traits Physiques égaux à votre Anneau d'Air, et attaque avec un rang de compétence Jiujutsu égal à la moitié de votre Anneau d'Air (un esprit invoqué par un Shugenja avec un Anneau d'Air 6 infligerait ainsi 6k6 dégâts avec ses attaques). Pour déterminer les dégâts qu'il subit, l'esprit est considéré avoir des Blessures comme un humain avec un Anneau de Terre égal à votre Anneau d'Air, mais ne subit aucun malus de blessure. Il est Invulnérable. S'il est ramené à zéro Blessure, il est dissipé."
  },
  {
    name: "La Fausse Légion",
    ring: "air",
    masteryRank: 6,
    keywords: "Bataille, Illusion",
    range: "Personnelle",
    areaOfEffect: "Dans un rayon de 30 m autour du lanceur",
    duration: "Concentration",
    raises: "Zone (+3 m), Spécial (+5 silhouettes illusoires par Augmentation)",
    description: "Le plus grand don illusoire du vent est la légion. Dans la zone d'effet de ce sort, vous pouvez créer un nombre de silhouettes illusoires égal à votre Anneau d'Air x 10. Ces silhouettes peuvent être aussi détaillées ou vagues que vous le souhaitez (par exemple \"bushi Grue\" contre \"infanterie lourde de la quatrième légion Daidoji\"), bien que vous deviez connaître l'apparence en question pour que le sort prenne effet (vous ne pourriez, par exemple, pas répliquer un mon familial que vous n'avez jamais vu). Les silhouettes sont pleinement mobiles et effectuent les actions que vous désirez tant qu'elles ne quittent pas la zone d'effet du sort. Elles peuvent être vues, entendues, voire senties, mais comme la plupart des illusions, elles ne peuvent physiquement interagir avec des objets ou individus d'aucune manière."
  },
  {
    name: "Percer les Cieux",
    ring: "air",
    masteryRank: 6,
    keywords: "",
    range: "N/A",
    areaOfEffect: "N/A",
    duration: "5 tours",
    raises: "Durée (+1 tour par 3 Augmentations)",
    description: "Spécial : doit être un Shugenja du Clan du Phénix. Connu seulement des véritables maîtres de la magie, ce sort est un secret du Phénix jamais intentionnellement partagé avec une autre École de Shugenja, pas même l'École Impériale. Il est considéré comme une confiance sacrée parmi les prêtres Phénix les plus haut placés, et même tous les Maîtres Élémentaires n'ont pas été jugés dignes de son pouvoir - car abuser de cette prière, c'est appeler la colère même du Ciel. Cette prière requiert l'attention directe d'une Fortune nommée par le Shugenja. Elle ne peut être accomplie que dans un temple ou sanctuaire spécifiquement dédié à cette Fortune, et ne peut jamais être lancée plus d'une fois par mois sous peine d'irriter l'entièreté de Tengoku. Si le sort réussit, une parcelle de l'essence de la Fortune se manifeste dans l'icône sacrée du sanctuaire, et le Shugenja est autorisé à communier brièvement avec l'être divin. La Fortune n'est ni contrainte de répondre aux questions posées ni d'accorder les faveurs demandées, et le plus grand respect doit être maintenu sous peine de déclencher sa colère immédiate et terrible. Cependant, si un véritable respect est témoigné et la cause jugée digne, la Fortune peut offrir une aide disponible nulle part ailleurs."
  },
  {
    name: "Vent de la Lune",
    ring: "air",
    masteryRank: 6,
    keywords: "",
    range: "15 m",
    areaOfEffect: "1 personne cible",
    duration: "1 minute",
    raises: "Durée (+1 minute par 2 Augmentations), Spécial (+1k1 au jet Contesté d'Air pour 3 Augmentations)",
    description: "Les adeptes d'Air d'une certaine puissance réalisent qu'il est possible de lire les pensées d'autrui, mais quelques Shugenja n'y ont vu qu'un début de ce que l'Air permet d'accomplir. Par des invocations extrêmement avancées et puissantes des kami d'Air, un Shugenja peut non seulement lire les pensées de surface d'une autre personne, mais aussi transmettre ses propres pensées dans son esprit. Cet acte est considéré hautement discutable, et le Clan du Phénix estime que ce sort frôle le blasphème. Néanmoins, les immenses avantages tirés d'une telle manipulation totale d'autrui font que le sort continue de circuler discrètement à travers l'Empire. Pour que cette prière réussisse, le lanceur doit connaître le nom de la cible et pouvoir la voir clairement. Sans ce lien visuel, les pensées de la cible seront trop confuses pour être déchiffrées, n'entraînant qu'un mal de tête douloureux pour le lanceur comme pour la cible. Si le nom connu du lanceur est faux (la cible utilisant un alias, par exemple), le jet de Lancer de Sort subit un malus de +10 au TN, le faux nom troublant les esprits. De plus, pour imposer avec succès ses pensées dans l'esprit de la cible, le lanceur doit remporter un jet Contesté d'Air contre elle ; en cas d'échec, le contact est rompu et les deux parties subissent le même mal de tête sévère. Si le jet d'Air réussit en revanche, la cible ignore tout du contact mental et croit, pour la durée du sort, que les pensées surgissant dans son esprit sont entièrement les siennes. Le lanceur doit maintenir une concentration partielle pour la durée du sort - si elle est rompue, le sort prend fin immédiatement. Effet secondaire particulier : pendant une heure après la fin du sort, le lanceur et la cible ont du mal à se mentir convaincamment l'un à l'autre, subissant un malus de +10 au TN à tout jet de Sincérité (Mensonge) effectué l'un contre l'autre."
  },
  {
    name: "Courroux de Kaze-no-Kami (Ouragan)",
    ring: "air",
    masteryRank: 6,
    keywords: "Tonnerre",
    range: "Personnelle",
    areaOfEffect: "1,6 km de rayon, centré sur le lanceur",
    duration: "Concentration (spéciale)",
    raises: "Aucune",
    description: "La colère des kami d'Air, et de la Fortune du Vent, est véritablement terrible à contempler. En lançant ce sort, vous déchaînez toute la force d'un ouragan sur vos ennemis. Une fois le sort actif, vous vous tenez dans l'œil de la tempête, une zone rayonnant sur 6 m dans toutes les directions autour de vous, où aucun effet néfaste du sort n'est subi. Hors de cet œil, cependant, les effets brutaux de la tempête déchirent tout sur leur passage. Les objets pesant moins de 225 kg sont soulevés par le vent et projetés dans la tempête. Les individus présents dans cette zone doivent s'accrocher à quelque chose d'immobile ou être emportés par les vents vers une mort certaine. Quiconque dans la région affectée sans abri solide subit 1k1 Blessures chaque minute à cause des vents et débris mineurs ; il y a une chance sur dix chaque minute qu'un individu exposé subisse plutôt 5k5 Blessures pour avoir été frappé par un objet emporté par le vent. Ce sort dure au maximum une heure, bien qu'il puisse durer bien moins longtemps si vous êtes interrompu en le maintenant. Ce sort ne peut être lancé plus d'une fois par mois dans une zone donnée, car il épuise entièrement les faveurs des kami d'Air nécessaires à son accomplissement.",
    damage: { mode: "fixed", rolled: 1, kept: 1, note: "Par minute passée hors abri ; 1 chance sur 10 de subir 5k5 à la place (frappé par un objet emporté)." }
  },

  // ============ Sorts de Feu - Rang 1 ============
  {
    name: "Acier Mordant",
    ring: "fire",
    masteryRank: 1,
    keywords: "Artisanat",
    range: "Contact",
    areaOfEffect: "1 arme tranchante",
    duration: "1 minute",
    raises: "Durée (+1 minute)",
    description: "Les esprits du Feu peuvent infuser le métal de leur propre fureur, transformant un tranchant acéré en un tranchant suprêmement parfait. Ce sort renforce les dégâts des armes tranchantes en acier, comme les épées, couteaux, naginata, etc. Acier Mordant ne peut affecter une arme qui n'est pas une lame métallique, qui est un Nemuranai, ou qui a déjà été rehaussée par un effet magique. Le DR de l'arme est augmenté de 1k1 pour la durée du sort."
  },
  {
    name: "Baiser Brûlant de l'Acier",
    ring: "fire",
    masteryRank: 1,
    keywords: "Bataille",
    range: "Contact",
    areaOfEffect: "Une arme de mêlée en main du lanceur",
    duration: "5 minutes",
    raises: "Durée (+2 minutes)",
    description: "Ce sort embrase une arme de feu, la rendant plus grande et plus efficace. Au lancer, une volute de flamme s'étend de vos mains pour engloutir votre arme (si vous la lâchez ou la perdez, l'effet du sort cesse). Cette arme gagne un bonus de +1k1 aux jets d'attaque de mêlée. Le bonus passe à +2k2 contre des adversaires montés ou de taille supérieure à celle d'un humain."
  },
  {
    name: "Flammes Envieuses",
    ring: "fire",
    masteryRank: 1,
    keywords: "",
    range: "9 m",
    areaOfEffect: "1 cible",
    duration: "Instantané",
    raises: "Aucune",
    description: "Le pouvoir le plus élémentaire du Feu est la destruction, et les esprits de Feu invoqués peuvent facilement être déchaînés sur ses ennemis. Ce sort invoque un unique kami de Feu, qui fonce vers la cible et la frappe infailliblement tant qu'elle est à portée. Le sort inflige 2k2 Blessures. Les brûlures infligées par ce sort sont particulièrement douloureuses : si le sort touche un Shugenja en train de lancer un sort, son jet de Volonté a un TN de 20 plus les dégâts subis, au lieu des 10 habituels plus les dégâts.",
    damage: { mode: "fixed", rolled: 2, kept: 2, note: "" }
  },
  {
    name: "Extinction",
    ring: "fire",
    masteryRank: 1,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "30 m de rayon",
    duration: "Instantané",
    raises: "Zone (+6 m)",
    description: "Les esprits de Feu peuvent être chassés par l'invocation appropriée, une capacité fort utile dans les villes et villages rokugani entièrement construits en bois et papier. Le sort renvoie les kami de Feu actifs dans la zone. Tout feu non-magique dans la zone d'effet est immédiatement éteint, et tout dégât infligé par le feu (magique ou non) voit son DR réduit de 1k1 jusqu'au début du tour suivant."
  },
  {
    name: "Feux de Pureté",
    ring: "fire",
    masteryRank: 1,
    keywords: "Défense",
    range: "7,5 m",
    areaOfEffect: "1 cible",
    duration: "1 minute",
    raises: "Dégâts (+1k0 par 2 Augmentations)",
    description: "Ce sort, l'une des rares prières directement protectrices impliquant les kami de Feu, demande aux esprits de protéger une personne en enveloppant la cible d'un linceul de flammes vives. Ni la cible ni ce qu'elle porte ne subit de dégâts du sort, mais quiconque entre en contact avec elle ou la frappe en mêlée subit 2k2 Blessures. Quiconque la cible frappe en mêlée à mains nues ou avec une arme qu'elle portait au moment du lancer subit également 2k2 Blessures supplémentaires. Cependant, tout ce que la cible pose ne peut être ramassé sans subir les dégâts du sort. Les armes à distance comme les flèches contournent cette barrière de feu et infligent leurs dégâts normalement.",
    damage: { mode: "fixed", rolled: 2, kept: 2, note: "+2k2 supplémentaires si la cible frappe en mêlée avec une arme portée au moment du lancer." }
  },
  {
    name: "Les Feux qui Purifient",
    ring: "fire",
    masteryRank: 1,
    keywords: "",
    range: "Soi-même",
    areaOfEffect: "9 m de rayon",
    duration: "Instantané",
    raises: "Zone d'Effet (+1,5 m par 2 Augmentations)",
    description: "La destruction est l'une des pulsions élémentaires du Feu, et ce sort fait appel à cette pulsion pour répandre la destruction autour du lanceur. Le sort fouette les kami dans un chaos frénétique, détruisant tout autour de vous. Tous ceux présents dans la zone d'effet, vous y compris, subissent des dégâts avec un DR égal à votre Anneau de Feu. Ce résultat est tiré une seule fois et appliqué à tous dans la zone - vous ne subissez cependant que la moitié des dégâts (arrondie au supérieur), les kami faisant un effort pour vous épargner.",
    damage: { mode: "ring", ring: "fire", rolled: 0, kept: 0, note: "Touche tous ceux présents dans la zone ; le lanceur ne subit que la moitié de ces dégâts (arrondie au supérieur)." }
  },
  {
    name: "Fureur d'Osano-Wo",
    ring: "fire",
    masteryRank: 1,
    keywords: "Tonnerre",
    range: "90 m",
    areaOfEffect: "1 cible",
    duration: "Instantané",
    raises: "Dégâts (+1k0 par 2 Augmentations)",
    description: "Ce sort est en réalité une prière à la Fortune du Feu et du Tonnerre, invitant sa colère sur votre ennemi. Il ne peut être lancé qu'en extérieur, et invoque un éclair venu du ciel qui frappe la cible pour 5k2 Blessures. Quiconque se trouve à moins de 3 m de la cible doit réussir un jet de Constitution contre un TN de 15 pour éviter d'être assourdi pendant 2 tours. Si ce sort est lancé pendant un orage, les dégâts passent à 6k2 pour une tempête modérée et 6k3 pour une tempête catastrophique ou un ouragan.",
    damage: { mode: "fixed", rolled: 5, kept: 2, note: "6k2 si lancé pendant un orage modéré, 6k3 pendant une tempête catastrophique ou un ouragan." }
  },
  {
    name: "Katana de Feu",
    ring: "fire",
    masteryRank: 1,
    keywords: "Bataille, Artisanat",
    range: "Personnelle ou 6 m",
    areaOfEffect: "1 arme créée",
    duration: "5 minutes",
    raises: "Dégâts (+1k0), Durée (+5 minutes), Portée (+1,5 m)",
    description: "Vous invoquez une lame de feu pur, flamboyante comme l'âme d'un guerrier honorable. L'arme prend par défaut la forme d'un katana, mais une Augmentation permet de choisir n'importe quelle autre épée. Le katana a un DR de 2k2. En le maniant, vous pouvez utiliser votre Rang d'École à la place de votre compétence Kenjutsu. Si vous possédez déjà cette compétence, vous ajoutez votre rang d'Honneur à tous les jets de dégâts effectués avec cette arme. Le katana de feu disparaît s'il quitte votre main. Vous pouvez aussi le faire apparaître dans les mains d'un allié à moins de 6 m ; celui-ci est alors considéré comme le lanceur pour les besoins du sort, mais ne gagne pas le bonus d'Honneur aux dégâts."
  },
  {
    name: "Jamais Seul",
    ring: "fire",
    masteryRank: 1,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 cible",
    duration: "5 tours (voir description)",
    raises: "Cibles (+1)",
    description: "Ce sort invoque l'élément de connaissance et de compréhension du Feu, renforçant l'esprit d'un de vos alliés en ouvrant ses yeux au courage de ses ancêtres. La cible du sort reçoit un bonus égal à votre Anneau de Feu à tous ses jets d'attaque, de Compétence et de Trait. Cet effet dure jusqu'à ce que le sort expire, ou jusqu'à ce que la cible échoue un jet d'attaque ou de Compétence, ou jusqu'à ce qu'elle subisse des Blessures de quelque source que ce soit - le premier de ces événements qui survient met fin à l'effet."
  },
  {
    name: "La Forge Déchaînée",
    ring: "fire",
    masteryRank: 1,
    keywords: "Artisanat",
    range: "Contact",
    areaOfEffect: "1 arme ou armure",
    duration: "Instantané",
    raises: "Aucune",
    description: "Le Feu est l'élément de la création autant que de la destruction, et un Shugenja habile peut en tirer grand profit. Ce sort invoque les pouvoirs de la forge, puissants et sans pitié, pour refaçonner un objet matériel, comme une arme ou une armure, dans sa forme parfaite. L'objet ciblé perd toutes ses imperfections, fissures et entailles comprises. Ce sort ne peut réparer un objet réellement brisé ou détruit ; il ne peut affecter que des objets de qualité ordinaire."
  },

  // ============ Sorts de Feu - Rang 2 ============
  {
    name: "Perturber l'Aura",
    ring: "fire",
    masteryRank: 2,
    keywords: "",
    range: "15 m",
    areaOfEffect: "Personne ou créature cible",
    duration: "24 heures",
    raises: "Durée (+12 heures par Augmentation)",
    description: "Quiconque a ses éléments déséquilibrés en ressent les effets, et ce sort crée délibérément cette condition en aggravant le Feu présent dans le corps de la cible. Tant que le sort est actif, la cible ne peut être soignée par des moyens magiques : les sorts, objets ou Techniques magiques tentant de restaurer ses Blessures échouent automatiquement (les soins mondains via la compétence Médecine restent efficaces). La cible peut sentir que quelque chose ne va pas physiquement, mais ne peut découvrir ce qui se passe sans l'aide d'un Shugenja - lancer Perception (Feu) révélera la présence de nombreux esprits de Feu excités dans son corps."
  },
  {
    name: "Attiser la Danse des Flammes",
    ring: "fire",
    masteryRank: 2,
    keywords: "",
    range: "15 m",
    areaOfEffect: "6 m de rayon",
    duration: "2 tours",
    raises: "Durée (+1 tour)",
    description: "Version plus puissante des Feux qui Purifient, ce sort garde les kami de Feu sous un contrôle plus strict et les persuade de rester présents plus longtemps. En cas de succès, des kami de Feu jaillissent en une danse violente et féroce à l'endroit de votre choix, embrasant la zone. Chaque cible dans la zone subit 3k2 Blessures au tour où le sort prend effet. Au début de chaque tour suivant, si le sort est toujours actif, chaque cible encore présente dans la zone affectée subit 2k1 Blessures supplémentaires.",
    damage: { mode: "fixed", rolled: 3, kept: 2, note: "+2k1 Blessures supplémentaires à chaque tour suivant si le sort reste actif." }
  },
  {
    name: "Les Feux Intérieurs",
    ring: "fire",
    masteryRank: 2,
    keywords: "",
    range: "30 m",
    areaOfEffect: "1 cible",
    duration: "Instantané",
    raises: "Cible (+1 cible par 2 Augmentations)",
    description: "Probablement le sort offensif le plus connu et reconnu de l'élément du Feu, cette prière est utilisée par les Shugenja rokugani depuis les tout premiers jours de l'Empire. Vous invoquez des kami de Feu pour former un orbe de flamme qui flotte un instant dans votre paume avant de foncer vers la cible. La sphère gagne en vitesse et en taille jusqu'à toucher sa cible, offrant un spectacle visuel saisissant. Le sort a un DR égal à votre Anneau de Feu.",
    damage: { mode: "ring", ring: "fire", rolled: 0, kept: 0, note: "" }
  },
  {
    name: "Pas Précipités",
    ring: "fire",
    masteryRank: 2,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "2 tours (voir description)",
    raises: "Aucune",
    description: "Le Feu est l'élément de la pensée, et la pensée est prompte en effet. Vous puisez dans la vitesse des kami de Feu pour vous aider dans le prochain sort que vous lancerez. Le temps d'incantation du prochain sort de Feu que vous lancez est réduit de 4 tours. Si ce prochain sort est de Rang de Maîtrise 3 ou moins, il s'incante instantanément en Action Simple. Si vous ne commencez pas à incanter le nouveau sort dans les 2 tours suivants, le bénéfice de Pas Précipités s'estompe."
  },
  {
    name: "Vivacité Mentale",
    ring: "fire",
    masteryRank: 2,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 objet",
    duration: "10 minutes",
    raises: "Aucune",
    description: "Les kami de Feu peuvent être imprégnés dans des objets physiques, leur permettant de rester présents plus longtemps. Les Shugenja ont conçu de nombreuses façons d'utiliser cette technique pour s'aider eux-mêmes et autrui. Ce sort, l'un des plus basiques de ce type, imprègne un objet matériel de l'intelligence et de la vivacité du Feu. Quiconque porte cet objet voit son Trait d'Intelligence augmenté de 3 pour la durée du sort."
  },
  {
    name: "Chaleur Implacable",
    ring: "fire",
    masteryRank: 2,
    keywords: "Défense",
    range: "Contact",
    areaOfEffect: "1 armure",
    duration: "10 tours",
    raises: "Durée (+2 tours)",
    description: "Ce sort est conçu pour protéger les bushi en imprégnant leur armure d'un kami de Feu. Le sort cible une armure, qui se met à luire de la force d'un soleil de désert impitoyable. Tout adversaire tentant de frapper le porteur de l'armure, que l'attaque touche ou non, est immédiatement considéré Fatigué jusqu'au début de son prochain tour. Ce malus s'applique au jet d'attaque qui a déclenché le sort, et tout attaquant en Posture d'Attaque Totale adopte immédiatement la Posture d'Attaque à la place. Ce sort n'a aucun effet sur les attaques à distance ni sur les sorts ciblant le porteur de l'armure."
  },
  {
    name: "Queue du Dragon de Feu",
    ring: "fire",
    masteryRank: 2,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "4 tours",
    raises: "Durée (+1 tour)",
    description: "Ce sort invoque plusieurs kami de Feu pour former un tentacule semblable à un fouet qui s'étend depuis la main du lanceur. Le tentacule de flamme ne vous brûle pas, les kami étant reconnaissants de pouvoir brûler autrui sur votre commande. Vous pouvez utiliser ce tentacule pour frapper des ennemis jusqu'à 9 m de distance, le déployant et le rétractant avec une vitesse aveuglante. Votre jet d'attaque avec le tentacule est égal à votre Agilité + (deux fois votre Rang d'École), en gardant votre Agilité. Le tentacule a un DR égal à votre Anneau de Feu.",
    damage: { mode: "ring", ring: "fire", rolled: 0, kept: 0, note: "Jet d'attaque du tentacule = Agilité + 2x Rang d'École, en gardant l'Agilité." }
  },
  {
    name: "Protection de Pureté",
    ring: "fire",
    masteryRank: 2,
    keywords: "Protections",
    range: "Contact",
    areaOfEffect: "4,5 m de rayon autour de l'objet touché",
    duration: "1 jour",
    raises: "Aucune",
    description: "Bien que la Terre soit la méthode traditionnelle pour s'opposer aux forces maléfiques comme la Souillure des Terres de l'Ombre, les esprits de Feu peuvent aussi être invoqués pour purger et détruire de telles abominations spirituelles. Ce sort lie un kami de Feu à un lieu précis, qu'il protège contre les forces du mal. Le lancer nécessite d'inscrire d'élaborés kanjis sur une surface plane à la craie ou à l'encre, ce qui prend une minute d'effort concentré, après quoi le jet de Lancer de Sort doit être effectué. Une fois la Protection de Pureté activée et le pouvoir du kami pleinement engagé, celui-ci protège la zone contre l'influence des Terres de l'Ombre ou de l'Obscurité Rampante. Les personnes ou créatures possédant au moins 1 rang de Souillure, ou sous le contrôle de l'Obscurité Rampante, doivent réussir un jet Contesté de Volonté contre vous pour entrer dans la zone d'effet de la Protection (vous gagnez un bonus de +5 à ce jet). De plus, les créatures qui réussissent à y pénétrer subissent une douleur extrême, le pouvoir de la protection brûlant leur essence même : leur corps s'enflamme et elles subissent des Blessures égales au total de votre Anneau de Feu + votre Rang de Réputation, chaque tour où elles restent dans la zone d'effet. Les sorts et projectiles ne sont pas affectés par la Protection de Pureté. L'objet sur lequel la protection est inscrite doit rester immobile et l'inscription clairement visible en permanence, sous peine de dissiper la protection. En cas de superposition de plusieurs Protections de Pureté, leurs effets ne se cumulent pas.",
    damage: { mode: "ring", ring: "fire", rolled: 0, kept: 0, note: "Ajoutez aussi votre Rang de Réputation au DR (lancés et gardés) - à ajuster manuellement. Infligé chaque tour où la cible reste dans la zone protégée." }
  },

  // ============ Sorts de Feu - Rang 3 ============
  {
    name: "Souffle du Dragon de Feu",
    ring: "fire",
    masteryRank: 3,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Jet de 4,5 m de long, 1,5 m de large",
    duration: "4 tours",
    raises: "Aucune",
    description: "Ce sort est une prière au Dragon de Feu, l'un des plus puissants êtres célestes, le suppliant de partager un peu de son pouvoir. En cas de succès, vous gagnez la capacité de souffler un jet de flammes par la bouche une fois par tour, en Action Simple. Le jet a un DR égal à votre Anneau de Feu et frappe toute cible devant vous dans la zone d'effet. Vous pouvez choisir d'effectuer d'autres actions que souffler du feu pendant que le sort est actif, mais vous ne pouvez ni parler ni lancer de sorts. Le sort expire après quatre tours, mais vous pouvez choisir d'y mettre fin pendant la Phase de Réactions de n'importe quel tour antérieur.",
    damage: { mode: "ring", ring: "fire", rolled: 0, kept: 0, note: "Attaque répétable une fois par tour en Action Simple tant que le sort est actif." }
  },
  {
    name: "Courroux Ardent",
    ring: "fire",
    masteryRank: 3,
    keywords: "",
    range: "30 m",
    areaOfEffect: "Une structure autonome, ou une zone de 15 m x 15 m",
    duration: "Instantané",
    raises: "Aucune",
    description: "Courroux Ardent fut à l'origine conçu pour défricher des terres agricoles et démolir des structures en bois avec un minimum d'effort et sans danger ; il sert aussi à allumer des feux de joie pour des rituels et célébrations. Le sort vous permet de détruire un bâtiment ou une autre structure en faisant appel aux kami de Feu excitables présents dans les matériaux de la cible. Tous les matériaux inflammables dans la zone d'effet s'enflamment immédiatement et brûlent jusqu'à ce qu'il ne reste que des cendres. Le feu ne peut être éteint que par des moyens magiques ; l'eau, le sable et autres retardateurs mondains n'ont aucun effet. Une seule structure peut être ciblée par le sort, et le feu ne se propage pas aux structures adjacentes, vos prières maintenant les kami de Feu sous un contrôle strict. Les êtres vivants et les matériaux non-inflammables ne sont pas affectés ; en fait, si les vêtements portés par les personnes prises dans la zone d'effet brûlent, leur chair ne sera même pas roussie."
  },
  {
    name: "Le Poing d'Osano-Wo",
    ring: "fire",
    masteryRank: 3,
    keywords: "Tonnerre",
    range: "15 m",
    areaOfEffect: "6 m de rayon",
    duration: "1 tour",
    raises: "Zone d'Effet (+3 m de rayon)",
    description: "Prière plus puissante à la Fortune du Tonnerre, ce sort invoque sa colère pour dévaster une zone ciblée. De massifs éclairs et des jets de flamme vaguement en forme de poing s'abattent du ciel, frappant la zone d'effet. Les structures fragiles et facilement inflammables (comme la plupart des maisons rokugani) sont détruites par la fureur du sort, ou prennent feu et sont consumées. Le sort a un DR égal à votre Anneau de Feu, infligé à quiconque se trouve dans la zone d'effet. Utiliser ce sort en zone habitée est généralement considéré comme un acte criminel, sauf si le Shugenja peut invoquer des circonstances extrêmes, les incendies étant terriblement dangereux pour les villes rokugani.",
    damage: { mode: "ring", ring: "fire", rolled: 0, kept: 0, note: "" }
  },
  {
    name: "Brume de Bataille",
    ring: "fire",
    masteryRank: 3,
    keywords: "Bataille",
    range: "3 m",
    areaOfEffect: "1 cible",
    duration: "5 tours, ou 1 heure hors combat",
    raises: "Durée (+1 tour)",
    description: "Les esprits de Feu sont connus pour leur nature erratique et impulsive, et les Shugenja peuvent gravement perturber leurs ennemis au combat en leur imprégnant cet aspect de l'élément. La cible de ce sort est emplie de la fureur désordonnée du Feu, l'enrageant et lui faisant perdre toute mesure. Elle adopte immédiatement la Posture d'Attaque Totale et ne peut en changer pour la durée du sort. Si le sort est lancé hors combat, la cible gagne les Désavantages Impétueux et Contrariant pour la durée du sort. Les effets de ce sort peuvent être surmontés par les esprits forts : la cible peut tenter d'y résister par un jet de Volonté opposé, mais vous ajoutez votre Feu au total de votre jet. Si le sort est lancé en combat, ce jet a lieu pendant la Phase de Réactions (et peut être tenté chaque tour). S'il est lancé hors combat, le jet a lieu toutes les 10 minutes."
  },
  {
    name: "Lame Affamée",
    ring: "fire",
    masteryRank: 3,
    keywords: "Artisanat",
    range: "15 m",
    areaOfEffect: "1 arme",
    duration: "5 tours",
    raises: "Durée (+1 tour)",
    description: "Ce sort est une version plus puissante d'Acier Mordant, conçue pour renforcer n'importe quelle arme plutôt qu'une simple épée. Le sort renforce les esprits de Feu présents dans une arme cible, les faisant surgir pour former un léger fourreau de flammes autour d'elle. Le porteur de l'arme ajoute +1k0 à tous ses jets d'attaque, et tous ses dés de dégâts explosent sur un résultat de 8 ou plus. Chaque dé ne peut cependant exploser sur un 8 ou un 9 qu'une seule fois par jet, même si le porteur bénéficie d'autres effets permettant l'explosion sur 9."
  },
  {
    name: "Nuées Voraces",
    ring: "fire",
    masteryRank: 3,
    keywords: "",
    range: "9 m",
    areaOfEffect: "1 personne cible",
    duration: "5 tours",
    raises: "Durée (+1 tour)",
    description: "Forme plus puissante et sophistiquée de la prière invoquant les Feux Intérieurs, ce sort non seulement endommage la cible mais perturbe aussi ses propres tentatives d'invoquer les kami de Feu, en faisant une arme très efficace contre un Shugenja de Feu rival. Vous invoquez un jet de flammes qui fonce vers la cible avec une fureur débridée. Les flammes infligent 5k3 Blessures à l'impact, puis encerclent l'adversaire pour la durée du sort, attendant qu'il commette une erreur. Si la cible lance un sort de Feu pendant ce temps, les kami de Feu frappent instantanément, infligeant 3k3 Blessures supplémentaires et faisant automatiquement échouer le jet de Lancer de Sort (la cible perd tout de même l'emplacement de sort correspondant, comme d'habitude).",
    damage: { mode: "fixed", rolled: 5, kept: 3, note: "+3k3 supplémentaires si la cible lance un sort de Feu pendant l'encerclement (son jet de Lancer de Sort échoue aussi automatiquement)." }
  },
  {
    name: "Lumière Éclatante",
    ring: "fire",
    masteryRank: 3,
    keywords: "Défense",
    range: "9 m",
    areaOfEffect: "1 armure cible",
    duration: "10 tours",
    raises: "Dégâts (+1k0 par 2 Augmentations), Durée (+2 tours)",
    description: "Autre exemple de sort pouvant imprégner des kami de Feu dans des objets, ce sort lie temporairement un kami de Feu à une pièce d'armure (comme un casque ou un plastron). L'armure émet une lumière vive qui devient aveuglante chaque fois que son porteur est attaqué. Chaque fois que le porteur de l'armure est attaqué en mêlée, l'adversaire subit immédiatement après 2k2 Blessures et est Aveuglé jusqu'à la Phase de Réactions de ce même tour. Le sort n'a aucun effet sur les attaques à distance.",
    damage: { mode: "fixed", rolled: 2, kept: 2, note: "Déclenché quand le porteur de l'armure est attaqué en mêlée ; l'attaquant est aussi Aveuglé jusqu'à la Phase de Réactions." }
  },

  // ============ Sorts de Feu - Rang 4 ============
  {
    name: "Mort de la Flamme",
    ring: "fire",
    masteryRank: 4,
    keywords: "",
    range: "30 m",
    areaOfEffect: "1 cible",
    duration: "5 tours",
    raises: "Aucune",
    description: "Ce sort déchaîne la colère du Feu sur la cible, supprimant son Feu élémentaire et réduisant à la fois son Agilité et son Intelligence d'un montant égal à votre Anneau de Feu (minimum 1). Si vous maintenez votre Concentration pour la durée de l'effet, la cible ne peut y échapper. Si vous ne maintenez pas la Concentration, chaque tour au début de son tour, la cible peut tenter un jet Contesté de Feu contre vous (en utilisant son Anneau de Feu original, non modifié) pour mettre fin à l'effet du sort."
  },
  {
    name: "Défense de la Tempête de Feu",
    ring: "fire",
    masteryRank: 4,
    keywords: "Défense",
    range: "Contact",
    areaOfEffect: "1 armure cible",
    duration: "5 tours",
    raises: "Durée (+1 tour)",
    description: "Forme plus puissante de sorts comme Lumière Éclatante, cette prière invoque une aura de flammes magiques depuis une armure, entourant et protégeant son porteur. Ces flammes ne blessent ni le porteur de l'armure ni les êtres vivants. Cependant, toutes les armes en bois (y compris les flèches et de nombreuses armes d'hast) brûlent instantanément avant d'atteindre leur cible, sans infliger de dégâts. Les flammes gênent aussi la vue de la cible, augmentant son TN d'Armure de 20."
  },
  {
    name: "La Forge Réparatrice",
    ring: "fire",
    masteryRank: 4,
    keywords: "Artisanat",
    range: "Contact",
    areaOfEffect: "1 objet cible",
    duration: "Instantané",
    raises: "Aucune",
    description: "Ce sort simple et puissant n'a qu'une seule fonction : faire appel au pouvoir créateur du Feu pour ramener ce qui a été détruit. Tout objet matériel endommagé ou détruit peut être restauré par ce sort, à condition que tous ses morceaux soient rassemblés devant le lanceur (si des morceaux manquent, le sort échoue automatiquement). Le sort prend une minute à lancer, durant laquelle vous devez vous concentrer. En cas de succès, le sort restaure l'objet dans un état intact et sans dommage. Notez que les kami de Feu doivent travailler plus dur pour réparer des objets de qualité inhabituelle : pour réparer un Nemuranai ou un objet de qualité Fine ou supérieure avec ce sort, vous devez offrir aux kami de Feu un présent (un autre objet à brûler et détruire) proportionné à la valeur de l'objet."
  },
  {
    name: "Symbole de Feu",
    ring: "fire",
    masteryRank: 4,
    keywords: "Protections",
    range: "30 m",
    areaOfEffect: "3 m de rayon",
    duration: "Permanente",
    raises: "Aucune",
    description: "Les prêtres des kami peuvent inscrire de puissantes protections invoquant la puissance des éléments contre quiconque tenterait de les franchir. Un Symbole de Feu peut être inscrit sur un objet solide, le plus souvent une porte, une fenêtre, un portail ou tout autre passage. Quiconque tente de franchir ce passage ou de contourner la protection est affecté par sa puissance et doit réussir un jet Contesté d'Eau contre l'Anneau de Feu du lanceur. Ceux qui échouent sont Hébétés, Aveuglés pendant un tour, et subissent 3k3 Blessures. Ce sort peut être dissipé par un autre lancer de Symbole de Feu par n'importe quel Shugenja, ou en détruisant la surface où le Symbole a été gravé. Un seul Symbole de Feu peut exister à la fois, et des sorts Symbole d'éléments différents ne peuvent jamais affecter la même zone.",
    damage: { mode: "fixed", rolled: 3, kept: 3, note: "Déclenché si la cible échoue son jet Contesté d'Eau contre l'Anneau de Feu du lanceur." }
  },
  {
    name: "Mur de Feu",
    ring: "fire",
    masteryRank: 4,
    keywords: "",
    range: "30 m",
    areaOfEffect: "Spéciale (voir description)",
    duration: "1 heure",
    raises: "Zone d'Effet (+1 incrément, voir description)",
    description: "Vous invoquez les kami de Feu pour qu'ils surgissent et forment un mur de flammes, barrant tout passage. Le mur mesure 3 m de haut, 30 cm de large et 7,5 m de long, et inflige 6k6 Blessures à quiconque le touche. Ce mur peut être rendu plus court ou plus fin selon vos désirs, dans les limites des spécifications totales, mais toute la masse des flammes doit être utilisée d'une manière ou d'une autre. Le mur peut être créé à un endroit où se trouvent des personnes ou des créatures, les forçant à réussir un jet de Réflexes contre un TN de 20 pour éviter de subir les Blessures du feu. Vous pouvez déclarer une Augmentation pour augmenter l'une des spécifications (hauteur, largeur ou longueur) de son incrément de base (3 m, 30 cm ou 7,5 m respectivement).",
    damage: { mode: "fixed", rolled: 6, kept: 6, note: "Infligé à quiconque touche le mur de flammes." }
  },
  {
    name: "Protection du Tonnerre",
    ring: "fire",
    masteryRank: 4,
    keywords: "Défense, Protections, Tonnerre",
    range: "Contact",
    areaOfEffect: "4,5 m de rayon autour de l'armure",
    duration: "1 heure",
    raises: "Aucune",
    description: "La protection d'Osano-Wo peut être temporairement invoquée pour une armure en lançant ce sort et en inscrivant le kanji du tonnerre dessus. Quiconque se trouve à moins de 4,5 m de l'armure est sous la protection d'Osano-Wo, et est totalement protégé du feu et du tonnerre non-magiques pour la durée du sort. De plus, tout sort de Feu lancé par un Shugenja autre que vous et ciblant quelque chose dans la zone d'effet voit son TN de Lancer de Sort augmenté de 20."
  },

  // ============ Sorts de Feu - Rang 5 ============
  {
    name: "Vague Destructrice",
    ring: "fire",
    masteryRank: 5,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "7,5 m de rayon",
    duration: "Instantané",
    raises: "Dégâts (+1k1 par 2 Augmentations)",
    description: "Sort offensif extrêmement puissant, conçu à l'origine par les Maîtres Élémentaires Isawa, cette prière invoque une immense masse de kami de Feu, qui déferle depuis le lanceur en une vague de flammes brûlantes. Chaque cible dans la zone d'effet, alliée ou ennemie, subit 7k7 Blessures - les flammes déchaînées ne faisant aucune distinction. Vous seul ne subissez aucun dégât du sort.",
    damage: { mode: "fixed", rolled: 7, kept: 7, note: "Touche alliés et ennemis dans la zone ; le lanceur seul est épargné." }
  },
  {
    name: "Rage Éternellement Brûlante",
    ring: "fire",
    masteryRank: 5,
    keywords: "",
    range: "7,5 m",
    areaOfEffect: "1 cible",
    duration: "1 tour",
    raises: "Durée (+1 tour), Cibles (+1)",
    description: "Puissante malédiction qui imprègne le corps de la cible d'esprits de Feu en colère, la torturant de douleur tandis que les kami brûlent ses nerfs et ligaments. Pendant la durée du sort, la victime est considérée au rang de blessure Épuisé et subit tous les malus et conditions associés, bien qu'elle ne subisse aucune Blessure réelle du sort. Quand le sort expire, la douleur cesse instantanément et la cible peut se relever comme si de rien n'était. Ce sort est quelque peu controversé dans certaines Écoles de Shugenja, en particulier les plus pacifiques, puisqu'il ne revient guère qu'à infliger délibérément de la douleur. Quelques Shugenja ont même noté d'inquiétantes similitudes entre les effets de ce sort et ceux de certaines malédictions de maho."
  },
  {
    name: "Suivre la Flamme",
    ring: "fire",
    masteryRank: 5,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Voir description",
    duration: "5 tours",
    raises: "Dégâts (+1k0 par Augmentation)",
    description: "Ce sort vous accorde un contrôle exceptionnel des kami de Feu environnants, vous permettant de les persuader de mener une attaque aussi inhabituelle que terrifiante. Au tour où ce sort est lancé et à chaque tour suivant, vous pouvez désigner une cible en ligne de vue à moins de 90 m et envoyer vers elle un jet de flammes qui serpente le long du sol (aux tours suivants, désigner une cible ainsi est une Action Simple). Le jet de flammes se déplace à raison de 23 m par tour et contourne les obstacles infranchissables (ou ininflammables) pour atteindre sa cible. Une fois le feu arrivé à destination, la cible s'embrase et subit 6k5 Blessures. Elle prend feu et subit la moitié de ce nombre de Blessures (arrondi à l'inférieur) chaque tour suivant, jusqu'à ce que le feu soit éteint normalement ou que la durée du sort expire.",
    damage: { mode: "fixed", rolled: 6, kept: 5, note: "Puis la moitié de ce total (arrondie à l'inférieur) chaque tour suivant jusqu'à extinction ou fin du sort." }
  },
  {
    name: "Lumière du Soleil",
    ring: "fire",
    masteryRank: 5,
    keywords: "Jade",
    range: "30 m",
    areaOfEffect: "9 m de rayon",
    duration: "10 tours",
    raises: "Aucune",
    description: "Cette prière invoque le pouvoir du Soleil, vénéré et adoré dans tout Rokugan, et particulièrement prisée par la famille Moshi, bien que des Shugenja de tout l'Empire l'aient apprise. Le sort fait descendre un rayon concentré de pure lumière solaire pour punir les indignes. Quiconque est pris dans la zone d'effet subit 2k2 Blessures par tour à cause de la chaleur intense. Les cibles humaines (uniquement) subissent 2k1 Blessures supplémentaires pour chaque rang d'Honneur en dessous de 4, et 2k2 Blessures supplémentaires si elles possèdent au moins 1 rang de Souillure des Terres de l'Ombre ou sont contrôlées par l'Obscurité Rampante. Les cibles humaines avec un rang d'Honneur de 0 sont Aveuglées pendant un nombre de tours égal à votre Anneau de Feu.",
    damage: { mode: "fixed", rolled: 2, kept: 2, note: "Par tour. Cibles humaines : +2k1 par rang d'Honneur sous 4, +2k2 si Souillure/Obscurité Rampante." }
  },
  {
    name: "Ailes du Phénix",
    ring: "fire",
    masteryRank: 5,
    keywords: "Voyage",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "10 tours",
    raises: "Aucune",
    description: "Le Phénix est l'un des symboles du Feu les plus puissants connus des Rokugani, et ce sort fait appel à l'essence de cet être pour accorder à son lanceur le pouvoir du vol. Au lancer, vous invoquez des nuées de kami de Feu qui prennent la forme d'ailes géantes surgissant de votre dos. Vous gagnez la capacité de voler pour la durée du sort, à une vitesse d'Eau x10 en Action Libre ou d'Eau x20 en Action Simple. Si vous êtes en vol quand le sort expire, les kami de Feu vous ramèneront doucement au sol avant de partir."
  },

  // ============ Sorts de Feu - Rang 6 ============
  {
    name: "Rayon de l'Enfer",
    ring: "fire",
    masteryRank: 6,
    keywords: "",
    range: "60 m",
    areaOfEffect: "1 cible",
    duration: "Instantané",
    raises: "Aucune",
    description: "C'est peut-être le sort isolé le plus meurtrier à la disposition des Shugenja, et l'un des sorts les plus redoutables jamais conçus dans l'Empire. La prière invoque un formidable jet de feu contre la cible choisie, qui subit 10k10 Blessures. Le sort plonge tous les kami de Feu de la zone dans un état d'agitation, et les feux normaux à portée brûleront plus fort et plus violemment pendant de longues minutes après le lancer de ce sort.",
    damage: { mode: "fixed", rolled: 10, kept: 10, note: "" }
  },
  {
    name: "Globe du Soleil Éternel",
    ring: "fire",
    masteryRank: 6,
    keywords: "Défense",
    range: "150 m",
    areaOfEffect: "1,6 km",
    duration: "1 jour",
    raises: "Aucune",
    description: "Cette puissante prière demande à tous les kami de Feu de la zone de rester calmes et paisibles, apaisant l'agitation qui les afflige si souvent. Elle est souvent invoquée lors de grands festivals, comme le couronnement d'un nouvel Empereur. Pendant la durée du sort, tous les bâtiments dans la zone d'effet sont immunisés aux effets du feu magique, et tous les sorts de Feu lancés dans la zone voient le TN de leur jet de Lancer de Sort augmenté de 15. Les feux normaux continuent de s'allumer et de brûler, mais le font paresseusement et ne se propagent pas facilement."
  },
  {
    name: "La Lame de l'Âme",
    ring: "fire",
    masteryRank: 6,
    keywords: "Artisanat",
    range: "Contact",
    areaOfEffect: "1 arme cible",
    duration: "5 tours",
    raises: "Durée (+1 tour par 3 Augmentations)",
    description: "Ce sort imprègne une arme d'esprits de Feu incroyablement puissants, lui conférant toute la fureur d'une tempête de feu déchaînée. Un bushi armé de cette arme est un adversaire terrible, les esprits de Feu choquant et hébétant ses ennemis à chaque coup. Pendant la durée du sort, l'arme surmonte l'Invulnérabilité, et chaque cible touchée par elle est automatiquement Étourdie."
  },

  // ============ Sorts d'Eau - Rang 1 ============
  {
    name: "Bo d'Eau",
    ring: "water",
    masteryRank: 1,
    keywords: "Artisanat",
    range: "Personnelle ou 6 m",
    areaOfEffect: "1 arme créée",
    duration: "5 minutes",
    raises: "Dégâts (+1k0), Durée (+5 minutes), Portée (+1,5 m)",
    description: "Vous invoquez un bâton d'eau pure, aussi rigide que le véritable objet malgré sa nature fluide. L'arme prend par défaut la forme d'un bo, mais une Augmentation permet de choisir n'importe quel autre bâton. L'arme a un DR de 1k2. Si vous ne possédez pas la compétence Bâton, vous pouvez utiliser votre Rang d'École à la place. Si vous la possédez, cette arme confère une Relance Gratuite utilisable uniquement pour la manœuvre de Renversement. L'arme disparaît si elle quitte votre main. Vous pouvez aussi la faire apparaître dans les mains d'un allié à moins de 6 m ; celui-ci est alors considéré comme le lanceur pour les besoins du sort, mais ne gagne pas la Relance Gratuite."
  },
  {
    name: "Clarté d'Intention",
    ring: "water",
    masteryRank: 1,
    keywords: "Bataille",
    range: "Personnelle",
    areaOfEffect: "3 m de rayon autour du lanceur",
    duration: "2 tours",
    raises: "Zone (+1,5 m), Durée (+1 tour par 2 Augmentations)",
    description: "L'une des nombreuses forces de l'eau réside dans sa vitesse. Tous les alliés dans la zone d'effet de ce sort gagnent un bonus de +5 à leur score d'Initiative pour la durée du sort."
  },
  {
    name: "Force Déclinante",
    ring: "water",
    masteryRank: 1,
    keywords: "Défense",
    range: "6 m",
    areaOfEffect: "1 créature cible",
    duration: "3 tours",
    raises: "Durée (+1 tour), Portée (+1,5 m)",
    description: "L'énergie circule à travers l'univers tout comme l'eau circule à travers l'enveloppe mortelle. Vous pouvez envoyer votre énergie vers autrui, vous affaiblissant tout en le renforçant. Vous pouvez réduire l'un de vos Traits Physiques d'un montant allant jusqu'à votre Rang d'École. La cible de ce sort voit ce même Trait Physique augmenter du même montant. Si votre Trait est réduit à 0 par ce sort, vous tombez immédiatement inconscient et la durée du sort est réduite à 1 tour. Aucun Trait ne peut être rehaussé au-delà du double de son rang normal par ce sort."
  },
  {
    name: "Chemin vers la Paix Intérieure",
    ring: "water",
    masteryRank: 1,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Aucune",
    description: "Les kami de l'eau peuvent influencer le flux d'eau à travers le corps, accélérant considérablement le processus de guérison naturel. Vous pouvez utiliser ce sort pour soigner les Blessures subies par un autre individu. Ce sort restaure à la cible un nombre de Blessures égal au montant par lequel le jet de Lancer de Sort a dépassé le TN nécessaire pour le lancer."
  },
  {
    name: "Reflets de Pan Ku",
    ring: "water",
    masteryRank: 1,
    keywords: "Divination",
    range: "Contact",
    areaOfEffect: "1 objet",
    duration: "Instantané",
    raises: "Aucune",
    description: "Deviner les capacités d'un objet compte parmi les leçons les plus simples qu'un étudiant de l'eau apprend au temple. Si ce sort est lancé avec succès sur un objet, vous apprenez automatiquement tous les pouvoirs et capacités que cet objet possède. Le plus souvent utilisé pour identifier les qualités surnaturelles d'un objet, comme un Nemuranai ou une arme maudite, il peut aussi identifier le sort contenu dans un parchemin de prière de Shugenja. Ce sort ne permet pas à un Shugenja de lire un parchemin écrit dans un chiffre qu'il ne comprend pas, mais il peut au moins identifier le sort en question. Ce sort accorde aussi au lanceur une connaissance très générale de l'origine de l'objet, comme le lieu où il a été forgé, le Clan de la personne qui l'a porté le plus longtemps, ou quelque chose de similaire à la discrétion du MJ."
  },
  {
    name: "Retournement de Fortune",
    ring: "water",
    masteryRank: 1,
    keywords: "",
    range: "3 m",
    areaOfEffect: "1 individu cible",
    duration: "3 tours",
    raises: "Durée (+1 tour), Portée (+1,5 m)",
    description: "La polyvalence est le domaine de l'eau, et ceux qui portent sa bénédiction en récoltent les fruits. Pendant la durée de ce sort, la cible peut immédiatement relancer un jet de son choix par tour. Cela doit être fait immédiatement après le premier jet, et la cible peut conserver l'un ou l'autre résultat."
  },
  {
    name: "La Vague Déferlante",
    ring: "water",
    masteryRank: 1,
    keywords: "Voyage",
    range: "3 m",
    areaOfEffect: "1 individu cible",
    duration: "1 tour",
    raises: "Durée (+1 tour), Portée (+1,5 m)",
    description: "Vous pouvez temporairement augmenter la vitesse de votre cible. Ce sort lui permet d'effectuer une Action de Mouvement Libre jusqu'à Eau x10 m (au lieu du x5 m normal). Sans Augmentation de Durée, ce bénéfice doit être utilisé au tour suivant de la cible, sous peine d'être perdu."
  },
  {
    name: "Vitesse de la Cascade",
    ring: "water",
    masteryRank: 1,
    keywords: "Voyage",
    range: "Contact",
    areaOfEffect: "1 individu ou créature cible",
    duration: "1 heure",
    raises: "Durée (+10 minutes), Portée (peut passer à 3 m pour 2 Augmentations)",
    description: "Ceux emplis de l'essence de l'eau se déplacent bien plus vite qu'auparavant. La cible de ce sort peut se déplacer d'une distance totale par tour égale à Eau x6 m plus un montant égal à deux fois votre Anneau d'Eau. Ce sort n'accorde pas de mouvement supplémentaire à la cible, il augmente simplement la distance maximale qu'elle peut parcourir en un tour pour la durée du sort."
  },
  {
    name: "Esprit de l'Eau",
    ring: "water",
    masteryRank: 1,
    keywords: "Bataille",
    range: "6 m",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m), Spécial (transforme l'action supplémentaire en Action Complexe pour 5 Augmentations)",
    description: "L'esprit de l'eau est à la fois fluide et rapide. La cible gagne une Action Simple supplémentaire pendant la Phase de Réactions du tour où ce sort est achevé. Cette Action ne peut être utilisée pour effectuer une attaque."
  },
  {
    name: "Énergies Sympathiques",
    ring: "water",
    masteryRank: 1,
    keywords: "",
    range: "7,5 m",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m), Spécial (voir description)",
    description: "L'énergie circule entre tous les êtres vivants comme l'eau circule à travers la terre. Vous pouvez transférer n'importe quel effet de sort actif sur vous vers une cible consentante de ce sort. Avec 3 Augmentations, vous pouvez transférer un effet de sort d'une cible vivante consentante à une autre cible consentante. Vous ne pouvez pas transférer de sorts entre cibles non consentantes."
  },

  // ============ Sorts d'Eau - Rang 2 ============
  {
    name: "Manteau des Miya",
    ring: "water",
    masteryRank: 2,
    keywords: "Défense",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "5 tours",
    raises: "Durée (+1 tour)",
    description: "Vous vous enveloppez dans l'étreinte protectrice de la vague. Votre TN d'Armure est augmenté d'un montant égal à votre Anneau d'Eau plus votre Rang d'École pour la durée de ce sort."
  },
  {
    name: "Bénédiction d'Inari",
    ring: "water",
    masteryRank: 2,
    keywords: "Artisanat",
    range: "Personnelle",
    areaOfEffect: "Nourriture créée",
    duration: "Instantané",
    raises: "Spécial (nourriture suffisante pour 1 personne supplémentaire par Augmentation)",
    description: "Inari est la Fortune du Riz, l'une des entités divines les plus adorées de tout l'Empire. Ce sort invoque la bénédiction d'Inari et crée nourriture et boisson nourrissantes sur votre commande. Ce sort génère assez de nourriture et de boisson pour subvenir aux besoins d'un nombre d'individus égal à votre Rang d'École +1, pour une journée. Sans Augmentation, cette nourriture est fade mais nourrissante, comme du riz nature et de l'eau ; avec des Augmentations, vous pouvez en améliorer la qualité jusqu'à des fruits de mer ou du thé, à la discrétion du MJ. Le TN pour lancer ce sort est doublé dans les Terres de l'Ombre."
  },
  {
    name: "Bassin Réfléchissant",
    ring: "water",
    masteryRank: 2,
    keywords: "Divination",
    range: "16 km",
    areaOfEffect: "Plan d'eau / lieu cible",
    duration: "5 minutes",
    raises: "Durée (+1 minute), Portée (+16 km)",
    description: "Le savoir insondable de l'eau est une grande bénédiction pour ceux qui savent comment l'invoquer. Vous pouvez fixer un plan d'eau, aussi petit qu'une flaque, et à travers lui observer un lieu familier comme si vous y étiez présent, bien que vous ne puissiez qu'y voir ce qui s'y passe, pas l'entendre. Pour qu'un lieu vous soit familier, vous devez soit y avoir passé beaucoup de temps (votre maison, le dojo, un temple de prédilection...), soit y avoir médité pendant au moins dix minutes. N'importe quel plan d'eau peut être utilisé pour ce sort, mais les visions transmises étant visuelles, les images seront plus claires avec de plus grandes étendues d'eau."
  },
  {
    name: "Vapeurs Régénérantes",
    ring: "water",
    masteryRank: 2,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Cibles (+1 par 2 Augmentations)",
    description: "L'eau lave toute impureté, rafraîchissant et revigorant tout ce qu'elle touche. La cible de ce sort est instantanément rafraîchie comme si elle venait de se lever d'une nuit de sommeil complète. Cela ne restaure pas les Points de Vide dépensés, mais élimine la fatigue et l'épuisement. Utilisé sur un Shugenja, ce sort restaure les emplacements de sort associés à l'Anneau de Vide (utilisables pour n'importe quel élément), mais pas les emplacements associés aux autres Anneaux. Les capacités qu'un personnage ne peut utiliser qu'un nombre limité de fois par jour ne sont pas restaurées par ce sort. Aucun individu ne peut bénéficier des Vapeurs Régénérantes plus d'une fois par période de 24 heures."
  },
  {
    name: "Résister aux Vagues",
    ring: "water",
    masteryRank: 2,
    keywords: "Bataille",
    range: "3 m",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Portée (+3 m par 3 Augmentations)",
    description: "Un samouraï possédant la vitesse et la force du puissant fleuve est un adversaire redoutable. La cible de ce sort gagne une Action Simple pendant la Phase de Réactions du Tour de Combat en cours. Cette action ne peut être utilisée que pour effectuer une attaque. Si la cible est incapable d'effectuer une attaque en Action Simple, ce sort lui accorde une Action Complexe à la place. Ce sort ne peut accorder à un Shugenja la capacité de lancer un second sort dans le même tour."
  },
  {
    name: "Les Liens qui Unissent",
    ring: "water",
    masteryRank: 2,
    keywords: "Divination",
    range: "16 km",
    areaOfEffect: "Soi-même",
    duration: "Instantané",
    raises: "Portée (+3 km)",
    description: "Même le plus léger contact forge un lien, et à travers les esprits de l'eau, ce lien peut être exploré. Ce sort vous permet de localiser les esprits d'Eau au sein d'un objet unique et spécifique. Vous devez être familier de cet objet, ayant passé beaucoup de temps à son contact ou l'ayant manipulé personnellement. Si l'objet se trouve dans la portée de ce sort, vous connaîtrez la direction et la distance relative qui vous en sépare."
  },
  {
    name: "Vitesse Portée par la Vague",
    ring: "water",
    masteryRank: 2,
    keywords: "Voyage",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "2 tours",
    raises: "Aucune",
    description: "La vitesse du fleuve peut être transmise par un Shugenja averti. Votre Anneau d'Eau est augmenté de 2 pour déterminer la distance que vous pouvez parcourir dans le cadre de toute Action de Mouvement effectuée pendant le tour en cours ou le suivant."
  },
  {
    name: "Sagesse et Clarté",
    ring: "water",
    masteryRank: 2,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "1 heure",
    raises: "Durée (+30 minutes), Cibles (peut cibler une autre personne avec 2 Augmentations)",
    description: "En sollicitant la perspicacité des kami de l'Eau, un Shugenja peut considérablement accroître sa capacité à percevoir le monde qui l'entoure. Pendant la durée de ce sort, votre vitesse de lecture double, et vous mémorisez parfaitement tout ce que vous lisez sous l'influence de ce sort. Ce sort n'améliore cependant pas la compréhension : toute langue ou tout chiffre que vous ne connaissez pas reste totalement indéchiffrable."
  },

  // ============ Sorts d'Eau - Rang 3 ============
  {
    name: "Proche de la Glace",
    ring: "water",
    masteryRank: 3,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 individu cible",
    duration: "5 tours",
    raises: "Durée (+1 tour), Portée (passe à 3 m avec 2 Augmentations)",
    description: "Tout comme l'eau devient durable et résistante avec l'arrivée de l'hiver, l'eau présente dans le corps humain peut elle aussi devenir plus ferme et plus endurante. Tous les malus de blessure actuels de la cible sont annulés pour la durée du sort. Tout malus supplémentaire subi prend pleinement effet, en utilisant la différence entre le malus annulé et le nouveau malus comme malus effectif. Les Blessures ne sont pas soignées par cet effet, elles cessent simplement d'entraver ceux qui en souffrent."
  },
  {
    name: "Régénérer la Blessure",
    ring: "water",
    masteryRank: 3,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 individu cible",
    duration: "Concentration",
    raises: "Spécial (votre Eau est augmentée de 1 pour les besoins de la guérison par Augmentation)",
    description: "L'eau s'écoule en toute chose et s'en écoule. En s'écoulant, elle peut emporter ce qui est indésirable. La douleur et la souffrance infligées par des blessures peuvent être canalisées loin d'un individu et rejetées dans l'océan infini où elles se perdent à jamais. La cible de ce sort récupère un nombre de Blessures égal à votre Anneau d'Eau plus votre Rang d'École à chaque tour où le sort est actif. Vous devez toucher la cible au moment du lancer, mais le sort peut ensuite être maintenu sans contact physique."
  },
  {
    name: "Eaux Silencieuses",
    ring: "water",
    masteryRank: 3,
    keywords: "Défense",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "Variable",
    raises: "Aucune",
    description: "La mémoire de l'océan est infinie, et son immense pouvoir peut patienter très longtemps avant de se manifester. Une fois ce sort lancé avec succès, vous pouvez immédiatement en lancer un second, de n'importe quel élément. Ce second sort doit être un sort que vous pouvez normalement lancer, de Rang de Maîtrise 3 ou inférieur. Si le second jet de Lancer de Sort réussit, ce second sort est stocké en vous et ne s'activera que lorsqu'un effet physique précis se produira, que vous spécifiez au moment du lancer (prononcer un certain mot, dégainer une lame, tomber au combat, par exemple). Quel que soit le déclencheur, quand il survient, le second sort prend immédiatement effet comme si vous veniez de terminer de le lancer. Un personnage ne peut jamais bénéficier de plusieurs utilisations simultanées d'Eaux Silencieuses. Si une seconde utilisation du sort est lancée sur le même individu, le sort actuellement \"stocké\" est immédiatement dissipé et remplacé par le nouveau."
  },
  {
    name: "Frappe du Tsunami",
    ring: "water",
    masteryRank: 3,
    keywords: "Bataille",
    range: "7,5 m",
    areaOfEffect: "Cône partant du lanceur, 3 m de large à son extrémité",
    duration: "Instantané",
    raises: "Dégâts (+1k0), Portée (+1,5 m), Spécial (+5 au TN du jet de Terre par Augmentation)",
    description: "L'eau est partout, et obéit aux ordres du Shugenja qu'elle favorise. Vous invoquez une vague écrasante d'eau qui submerge tout sur son passage. La vague inflige 3k3 Blessures à tout ce qui se trouve dans la zone affectée, et tous les adversaires présents doivent réussir un jet de Terre (TN 15) ou subir un Renversement. Naturellement, tout ce qui se trouve dans la zone d'effet est trempé."
  },
  {
    name: "Visions du Futur",
    ring: "water",
    masteryRank: 3,
    keywords: "Divination",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "1 minute",
    raises: "Aucune",
    description: "Bien que moins fiable que le don naturel (quoiqu'extrêmement rare) de prescience ou les sorts de Vide (tout aussi rares) permettant la divination, ce sort permet néanmoins de puissantes visions du futur. Développé pour la première fois par la famille Tonbo du Clan de la Libellule, il est rarement rencontré en dehors de leurs rangs. Le sort nécessite l'usage d'un grand bassin d'eau calme dans lequel vous devez plonger votre regard. Une fois le sort achevé, vous entrez dans une brève transe et voyez des images d'événements qui ne se sont pas encore produits. Ces images sont rarement directes et tendent à être symboliques (la violence est dépeinte comme une scène de bataille, par exemple), mais les événements prévus sont parfaitement exacts et se produiront, à moins d'être empêchés par votre intervention directe. Seul le Shugenja lançant ce sort peut voir les événements dépeints dans la vision. Beaucoup de Shugenja estiment que l'usage de ce sort contrecarre l'ordre naturel, et considèrent négativement à la fois le sort et ceux qui l'utilisent."
  },
  {
    name: "Marcher sur les Vagues",
    ring: "water",
    masteryRank: 3,
    keywords: "Voyage",
    range: "Contact",
    areaOfEffect: "1 individu cible (peut être le lanceur)",
    duration: "10 minutes",
    raises: "Durée (+1 minute), Cibles (+1 par Augmentation)",
    description: "Les kami de l'Eau soutiennent ceux qui portent leur faveur et leur accordent le passage. La cible de ce sort peut se déplacer sur la surface de l'eau comme s'il s'agissait de terrain solide (Terrain de Base). Si la surface de l'eau est perturbée, par une tempête, des vagues déferlantes, ou tout événement similaire, elle compte comme Terrain Difficile."
  },
  {
    name: "Bénédiction du Kami d'Eau",
    ring: "water",
    masteryRank: 3,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 individu cible (peut être le lanceur)",
    duration: "5 tours",
    raises: "Spécial (votre Anneau d'Eau est considéré supérieur d'1 rang par 2 Augmentations)",
    description: "En invoquant la clarté de l'eau, vous pouvez recevoir une immense perspicacité sur le monde qui vous entoure. La cible de ce sort reçoit un bonus à tous ses jets basés sur la Perception, qu'il s'agisse de jets de Trait, de Compétence, ou autre, consistant en des dés lancés supplémentaires égaux à votre Anneau d'Eau."
  },

  // ============ Sorts d'Eau - Rang 4 ============
  {
    name: "Dominion de Suitengu",
    ring: "water",
    masteryRank: 4,
    keywords: "Divination",
    range: "160 km",
    areaOfEffect: "2 plans d'eau",
    duration: "Concentration",
    raises: "Portée (+16 km)",
    description: "La Fortune de la Mer est une entité courroucée, mais qui bénit néanmoins ceux qui le sollicitent correctement. Ce sort, créé par le Clan de la Mante, vous permet de fixer un plan d'eau (au moins 30 cm de large et 2,5 cm de profondeur) et de voir à travers n'importe quel autre plan d'eau de l'Empire, tant qu'il est à portée du sort - un point du littoral, un lac, une rivière, un ruisseau, voire une flaque, mais vous devez connaître l'emplacement du plan d'eau visé. Vous pouvez voir tout ce qui entoure ce plan d'eau comme si vous y étiez immergé. Vous ne pouvez pas entendre ce qui s'y passe, seulement le voir."
  },
  {
    name: "Flux et Reflux de la Bataille",
    ring: "water",
    masteryRank: 4,
    keywords: "Bataille",
    range: "Personnelle",
    areaOfEffect: "Tous les alliés choisis dans un rayon de 15 m autour du lanceur",
    duration: "5 tours",
    raises: "Durée (+1 tour par 2 Augmentations)",
    description: "La mobilité est l'une des plus grandes forces de l'Eau. Dans une escarmouche ou une bataille, la mobilité est la clé de la survie. Ce sort augmente la vitesse de déplacement de tous les alliés à portée. Vous pouvez choisir d'exclure certains alliés de ses effets si vous le souhaitez. Tous ceux affectés par le sort peuvent se déplacer d'une distance égale à leur Anneau d'Eau x 3 m en Action Libre (normalement une Action Simple)."
  },
  {
    name: "Cœur du Dragon d'Eau",
    ring: "water",
    masteryRank: 4,
    keywords: "",
    range: "7,5 m",
    areaOfEffect: "Cibles en nombre égal au Rang d'École du lanceur (lanceur inclus possible)",
    duration: "1 tour par Rang d'École",
    raises: "Durée (+1 tour), Spécial (+1k0 soigné par 2 Augmentations)",
    description: "Le Dragon d'Eau est une entité bienveillante, et ses bénédictions sont puissantes. Chaque fois qu'une cible de ce sort subit des dégâts pendant sa durée, elle récupère instantanément 1k1 Blessures."
  },
  {
    name: "Le Chemin Non Emprunté",
    ring: "water",
    masteryRank: 4,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "1 jour",
    raises: "Spécial (gagne 1 emplacement de sort bonus par 5 Augmentations)",
    description: "Aucun élément ne peut égaler la pure polyvalence et l'adaptabilité de l'Eau. Avant de lancer ce sort, vous devez choisir un Anneau que vous affaiblirez temporairement, et un que vous renforcerez temporairement. Une fois le sort réussi, vous pouvez transférer un nombre d'emplacements de sort quotidiens inutilisés de l'Anneau affaibli vers l'Anneau renforcé. Ce sort dure exactement un jour, après quoi ses effets sont perdus."
  },
  {
    name: "Frappe des Eaux Courantes",
    ring: "water",
    masteryRank: 4,
    keywords: "",
    range: "3 m",
    areaOfEffect: "1 individu cible (peut être le lanceur)",
    duration: "1 tour",
    raises: "Durée (+1 tour), Portée (+1,5 m)",
    description: "L'eau s'écoule sur et à travers les obstacles, tout comme ceux qui sont infusés de son énergie. La cible de ce sort peut ignorer le bonus au TN d'Armure de ses adversaires conféré par une armure portée, par des effets de sort de Rang de Maîtrise 3 ou moins, et par d'autres effets mécaniques hors Technique. Contre des créatures non-humaines sans armure, cela permet à la cible de considérer leur TN d'Armure comme inférieur de 5. Ce sort n'annule pas la Réduction accordée par une armure, ni n'ignore l'augmentation du TN d'Armure conférée par l'adoption des Postures de Défense ou de Pleine Défense."
  },
  {
    name: "Symbole d'Eau",
    ring: "water",
    masteryRank: 4,
    keywords: "Protections",
    range: "Contact",
    areaOfEffect: "Spéciale",
    duration: "Permanente",
    raises: "Aucune",
    description: "Les prêtres des kami peuvent inscrire de puissantes protections invoquant la puissance des éléments contre quiconque tenterait de les franchir. Un Symbole d'Eau peut être inscrit sur un objet solide, le plus souvent une porte, une fenêtre, un portail ou tout autre passage. Quiconque tente de franchir ce passage ou de traverser la zone est affecté par la protection, et doit réussir un jet Contesté de Feu contre l'Anneau d'Eau du lanceur. Ceux qui échouent sont saisis d'une terreur paralysante et doivent immédiatement effectuer un jet contre un effet de Peur 7. Un seul Symbole d'Eau peut exister à la fois, et des sorts Symbole d'éléments différents ne peuvent jamais affecter la même zone. Ce sort peut être dissipé par un autre lancer de Symbole d'Eau par n'importe quel Shugenja, ou en détruisant la surface où le Symbole a été gravé."
  },

  // ============ Sorts d'Eau - Rang 5 ============
  {
    name: "Vagues Changeantes",
    ring: "water",
    masteryRank: 5,
    keywords: "Illusion",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "1 heure",
    raises: "Durée (+1 heure)",
    description: "La maîtrise ultime de l'Eau permet à la chair de s'écouler comme un liquide. Ce sort vous permet de modifier physiquement votre corps mortel, changeant votre forme pour correspondre à celle d'une autre créature naturelle. Sous cette forme, vous conservez vos Traits Mentaux. Pour les Traits Physiques, vous conservez le plus élevé des deux, le vôtre ou celui de l'animal en lequel vous vous êtes transformé. D'autres capacités naturelles sont également acquises, y compris des armes naturelles ou des capacités sensorielles. Certaines sectes de Shugenja traditionalistes méprisent ce sort, le jugeant impur."
  },
  {
    name: "Le Lien Ultime",
    ring: "water",
    masteryRank: 5,
    keywords: "Divination",
    range: "Spéciale",
    areaOfEffect: "1 objet ou individu cible",
    duration: "Instantané",
    raises: "Aucune",
    description: "Les plus grands liens ne peuvent jamais être brisés. Ce sort vous permet de détecter l'emplacement d'un objet ou d'un individu que vous connaissez bien, quel que soit son emplacement. L'objet doit être un objet auprès duquel vous avez passé énormément de temps, ou que vous avez fréquemment manipulé. Si la cible est un individu, elle doit vous être bien connue, comme un membre de votre famille proche ou un ami proche. Vous connaissez instantanément son emplacement approximatif, suffisant pour considérablement restreindre toute recherche (par exemple, \"la ville de Ryoko Owari Toshi\", ou \"les confins nord de la Forêt de Shinomen\"). Si la cible se trouve hors de l'Empire de Rokugan, le sort échoue automatiquement."
  },
  {
    name: "Mains des Marées",
    ring: "water",
    masteryRank: 5,
    keywords: "Bataille, Voyage",
    range: "30 m de rayon centré sur le lanceur",
    areaOfEffect: "Cibles jusqu'à l'Anneau d'Eau du lanceur",
    duration: "Instantané",
    raises: "Zone (+3 m), Cibles (+1 par 2 Augmentations)",
    description: "L'échange d'énergie via l'Eau est une chose simple qui peut finalement mener à l'échange de chair également. Dans la zone d'effet de ce sort, vous pouvez choisir un nombre de cibles consentantes jusqu'à votre Anneau d'Eau. Vous pouvez échanger les positions de ces cibles comme bon vous semble, en substituant l'une à l'autre. À la fin du sort, une personne doit se trouver à chaque position occupée au début du sort, mais laquelle s'y trouve peut varier selon le nombre de personnes affectées."
  },
  {
    name: "Puissance de l'Océan",
    ring: "water",
    masteryRank: 5,
    keywords: "Défense",
    range: "Contact",
    areaOfEffect: "1 individu cible",
    duration: "Un nombre de jours égal à votre Rang d'École",
    raises: "Durée (+1 jour par 3 Augmentations)",
    description: "Peut-être le plus grand don que l'Eau puisse offrir nécessite un Shugenja puissant pour le transmettre à autrui. Ce sort est un rituel complexe nécessitant une heure d'incantation, et ne peut être lancé que sur une cible consentante. Pendant la durée du sort, la cible n'a besoin ni de nourriture, ni de boisson, ni de sommeil. Un nombre de fois pendant la durée égal à votre Rang d'École, la cible peut restaurer ses Points de Vide en Action Simple ; ceci équivaut à récupérer des Points de Vide via une nuit complète de repos. La cible récupère aussi un nombre de Blessures par heure égal à deux fois votre Anneau d'Eau. Si la cible de ce sort est un Shugenja, elle regagne tous ses emplacements de sort dépensés au lever du soleil, qu'elle se soit reposée ou non. Après l'expiration du sort, la cible sombre dans un état d'épuisement complet, qui dure exactement la moitié de la durée de l'effet du sort. Pendant ce temps, la cible ne peut entreprendre aucune action physique significative, et ne peut se déplacer que lentement. Tout voyage est totalement impossible."
  },
  {
    name: "L'Étreinte de Suitengu",
    ring: "water",
    masteryRank: 5,
    keywords: "Tonnerre",
    range: "7,5 m",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m)",
    description: "La Fortune de la Mer est courroucée, et nécessite peu d'incitation de la part de ses fidèles adeptes pour frapper autrui. En invoquant les kami de l'Eau, vous pouvez emplir les poumons d'une cible d'eau de mer, la paralysant et pouvant potentiellement la tuer. En cas de succès, la cible ne peut entreprendre aucune action autre que de tenter de résister au sort - à toutes fins utiles, elle est réduite au rang de blessure Épuisé en termes de capacité à agir. Chaque tour, elle doit réussir un jet de Constitution (TN 15) pour résister. Si la cible obtient trois succès au total, elle passe un tour supplémentaire à vomir de l'eau de mer, puis se rétablit complètement. Cependant, si elle subit deux échecs consécutifs, elle tombe inconsciente et mourra dans la minute, sauf intervention magique ou médicale. Bien que les moyens de lutter contre la noyade soient peu connus à Rokugan, il est possible de sauver un individu incapacité par ce sort via un jet de Médecine / Intelligence réussi à TN 50."
  },

  // ============ Sorts d'Eau - Rang 6 ============
  {
    name: "Paix du Kami",
    ring: "water",
    masteryRank: 6,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Aucune",
    description: "La bienveillance ultime du Dragon d'Eau est sans mesure. La cible est instantanément guérie de toutes les maladies, son organisme purgé de tout poison, et toutes ses Blessures sont entièrement soignées."
  },
  {
    name: "Lève-toi, Eau",
    ring: "water",
    masteryRank: 6,
    keywords: "",
    range: "9 m",
    areaOfEffect: "Un esprit invoqué",
    duration: "Concentration",
    raises: "Aucune",
    description: "La mer elle-même prend forme pour vous défendre. Aboutissement ultime du sort d'Invocation, ce sort invoque un kami massif d'eau pure à votre service. Il prend une forme vaguement humanoïde d'environ 3 mètres de haut, son contour changeant constamment en raison de sa constitution fluide. Le kami peut se déplacer jusqu'à 4,5 m x votre Eau par tour, et sature le sol dans un rayon de 6 m autour de lui, garantissant que tout terrain dans cette zone soit au moins un Terrain Modéré (à moins qu'il ne soit déjà Difficile). Le kami manifesté est considéré comme ayant tous ses Traits Physiques égaux à votre Anneau d'Eau, et attaque avec un rang de compétence Jiujutsu égal à la moitié de votre Anneau d'Eau. Les dégâts de ces attaques ont un DR égal à votre Anneau d'Eau. Pour déterminer les dégâts qu'il subit, l'esprit est considéré avoir des Blessures comme un humain avec un Anneau de Terre égal à votre Anneau d'Eau, mais ne subit aucun malus de blessure. Il est Invulnérable. S'il est ramené à zéro Blessure, il est dissipé."
  },
  {
    name: "Douce Clarté de l'Eau",
    ring: "water",
    masteryRank: 6,
    keywords: "Divination",
    range: "Personnelle",
    areaOfEffect: "Plan d'eau cible",
    duration: "3 tours",
    raises: "Aucune",
    description: "La plus grande forme d'augure est celle qui parle directement et permet à d'autres d'en être témoins. En concentrant votre énergie sur un plan d'eau calme, vous pouvez invoquer de puissantes visions du futur en réponse à vos questions. Vous pouvez poser une question, et les eaux en révéleront la réponse. La réponse prend la forme de trois images distinctes, qui peuvent être liées de multiples façons, y compris des événements se déroulant dans le temps, ou peut-être trois facettes d'un même événement. Contrairement à d'autres formes d'augure, d'autres personnes peuvent également être témoins de ces visions."
  },

  // ============ Sorts de Vide - Rang 1 ============
  {
    name: "Vue Sans Limites",
    ring: "void",
    masteryRank: 1,
    keywords: "",
    range: "80 km",
    areaOfEffect: "Soi-même",
    duration: "4 tours",
    raises: "Durée (+1 tour), Portée (+8 km)",
    description: "La leçon la plus essentielle des ishiken est que tout est relié à travers le Vide, et qu'à travers le Vide tout peut être perçu. En concentrant votre énergie, vous pouvez percer le voile et voir un autre lieu comme si vous vous y trouviez. Ce lieu doit vous être familier, et vous devez vous y être déjà rendu au moins une fois. Pendant la durée du sort, vous pouvez voir et entendre tout ce qui s'y passe, mais vous ne pouvez être détecté ni interagir d'aucune façon avec les choses ou les personnes présentes. Pendant ce sort, votre corps est dans un état de transe qui vous rend extrêmement vulnérable aux attaques (votre TN d'Armure est réduit à 5)."
  },
  {
    name: "Puiser dans le Vide",
    ring: "void",
    masteryRank: 1,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "Instantané",
    raises: "Spécial (+1 Point de Vide gagné par 3 Augmentations)",
    description: "La capacité de puiser dans le Vide lui-même et d'en tirer force est une leçon essentielle dans la formation de tout ishiken. Une fois ce sort achevé, vous gagnez un nombre de Points de Vide supplémentaires égal à votre Rang d'École plus un. Si ces Points de Vide vous font dépasser le nombre que vous pouvez normalement posséder, vous perdez l'un de ces Points de Vide supplémentaires chaque tour où vous n'en dépensez pas."
  },
  {
    name: "Flux à Travers le Vide",
    ring: "void",
    masteryRank: 1,
    keywords: "",
    range: "Contact",
    areaOfEffect: "Jusqu'à 30 cm cube de matière élémentaire pure",
    duration: "Permanente",
    raises: "Zone (+30 cm cube)",
    description: "Dans le Vide, toute chose est égale, tout est un et rien à la fois. En puisant dans cette connexion, vous pouvez transformer une petite quantité de matière élémentaire pure - eau, feu, air, ou terre sous forme de terreau ou de sol - en n'importe quel autre élément."
  },
  {
    name: "Voir à Travers les Mensonges",
    ring: "void",
    masteryRank: 1,
    keywords: "",
    range: "7,5 m",
    areaOfEffect: "Individu cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m), Spécial (1 Avantage/Désavantage supplémentaire par Augmentation)",
    description: "Les motifs qui composent toute chose dans le Vide existent aussi chez les individus, et avec l'entraînement, les ishiken peuvent les reconnaître. Vous apprenez l'Avantage de plus haute valeur ou le Désavantage de plus haute valeur (à votre choix) possédé par la cible de ce sort."
  },
  {
    name: "Percevoir le Vide",
    ring: "void",
    masteryRank: 1,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "7,5 m de rayon autour du lanceur",
    duration: "Concentration",
    raises: "Zone (+1,5 m)",
    description: "La vie est aussi évidente dans le Vide que les étoiles dans le ciel nocturne. Ce sort vous fait entrer en transe, période durant laquelle vous prenez conscience de l'existence et de l'emplacement de toutes les créatures vivantes dans le rayon du sort. Bien que vous connaissiez leur emplacement, vous ne pouvez ni les voir ni percevoir de détails. Vous sauriez par exemple que trois humains attendent hors des murs du château, sans pouvoir les reconnaître autrement que par leur présence. Cela vous donne aussi des informations sur les créatures vivantes naturelles non-sentientes. Les esprits et les créatures des Terres de l'Ombre se reconnaissent comme un vide dans votre perception, bien que ce sort ne puisse reconnaître les humains souillés autrement que comme des humains."
  },
  {
    name: "Toucher le Néant",
    ring: "void",
    masteryRank: 1,
    keywords: "",
    range: "9 m",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m)",
    description: "La sensation de faire l'expérience directe du Vide peut être extrêmement perturbante pour ceux qui n'y sont pas habitués. La cible de ce sort subit 1k1 dégâts et est Hébétée.",
    damage: { mode: "fixed", rolled: 1, kept: 1, note: "La cible est aussi Hébétée." }
  },
  {
    name: "La Caresse du Vide",
    ring: "void",
    masteryRank: 1,
    keywords: "",
    range: "Contact",
    areaOfEffect: "Un individu cible",
    duration: "1 minute",
    raises: "Durée (+1 minute)",
    description: "Bien que les étudiants débutants de l'ishiken-do ne puissent affecter le motif du Vide, ils peuvent y apporter de très brèves altérations. Vous pouvez annuler un Désavantage Mental ou Spirituel possédé par la cible de ce sort, jusqu'à une valeur maximale de 5 points. La Souillure des Terres de l'Ombre ne peut être retirée par ce sort, bien que les troubles mentaux qu'elle peut causer puissent être temporairement soulagés."
  },
  {
    name: "Témoin de l'Indicible",
    ring: "void",
    masteryRank: 1,
    keywords: "Divination",
    range: "4,5 m",
    areaOfEffect: "1 individu cible",
    duration: "3 tours",
    raises: "Portée (+1,5 m)",
    description: "Il est possible d'entrevoir fugacement des choses qui ne se sont pas encore produites en scrutant à travers le Vide. Si vous retardez votre action, vous pouvez interrompre la cible de ce sort après qu'elle a déclaré son action mais avant qu'elle ne l'exécute, lorsque son tour arrive. Cela peut être fait à chaque tour pour la durée du sort (normalement, quelqu'un retardant son Action ne peut interrompre l'Action d'un autre participant)."
  },

  // ============ Sorts de Vide - Rang 2 ============
  {
    name: "Altérer le Cours",
    ring: "void",
    masteryRank: 2,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "1 minute",
    raises: "Durée (+1 minute)",
    description: "Les ishiken ont une bien plus grande capacité à puiser dans le Vide que les autres, et peuvent le faire consciemment plutôt qu'inconsciemment. Vous pouvez dépenser plusieurs Points de Vide sur n'importe quel jet effectué pendant la durée de ce sort. Ce doit toujours être un jet sur lequel la dépense de Points de Vide est normalement autorisée (aucun jet de dégâts ne peut être augmenté par ce sort, par exemple)."
  },
  {
    name: "Boire de Votre Essence",
    ring: "void",
    masteryRank: 2,
    keywords: "",
    range: "9 m",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m)",
    description: "À mesure qu'un ishiken gagne en puissance, il peut tirer davantage d'informations en examinant le motif d'un individu dans le Vide. Vous apprenez de nombreuses informations sur la cible de ce sort, y compris ses Anneaux individuels (mais pas ses Traits), ses malus de blessure actuels, et un mot résumant son humeur présente (\"hostile\", \"affligée\", \"confuse\", etc.)."
  },
  {
    name: "La Voix Vide",
    ring: "void",
    masteryRank: 2,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "5 minutes",
    raises: "Aucune",
    description: "Puiser dans l'essence de toute chose permet à un ishiken d'invoquer les kami avec bien plus de facilité que la normale. Pendant la durée de ce sort, vous pouvez lancer des sorts d'autres éléments sans prononcer vos prières à voix haute. Cela ne s'applique qu'aux sorts de Rang de Maîtrise égal ou inférieur (tout sort de Rang de Maîtrise 1 ou 2)."
  },
  {
    name: "Faux Murmures",
    ring: "void",
    masteryRank: 2,
    keywords: "",
    range: "9 m",
    areaOfEffect: "1 individu cible",
    duration: "1 minute",
    raises: "Aucune",
    description: "Mêler le Vide de deux êtres, même un instant, peut amener l'un des deux à être manipulé s'il n'y est pas préparé. La cible de ce sort répète mot pour mot la prochaine phrase que vous prononcez, sans aucune conscience préalable de ce qu'elle fait. Elle prononce les mots de sa propre voix normale, quelle que soit la façon dont vous les avez dits. Cet effet ne permet pas à d'autres de lancer des sorts, même si vous leur faites réciter une portion d'un sort. Ce sort ne permet cet effet qu'une seule fois, la première fois que vous prononcez une phrase pendant la durée du sort."
  },
  {
    name: "Atteindre à Travers le Vide",
    ring: "void",
    masteryRank: 2,
    keywords: "",
    range: "15 m",
    areaOfEffect: "Objet cible, jusqu'à 2,5 kg",
    duration: "Instantané",
    raises: "Zone (+1 kg par 2 Augmentations), Portée (+1,5 m)",
    description: "Toute chose, vivante ou non, existe au sein du Vide, et peut être touchée à travers lui. Vous pouvez manipuler des objets à travers le Vide, les déplaçant sans les toucher. Ces objets sont petits, généralement jusqu'à 2,5 kg seulement, bien qu'un Shugenja puissant puisse déclarer suffisamment d'Augmentations pour déplacer des objets un peu plus lourds."
  },
  {
    name: "Coupé du Courant",
    ring: "void",
    masteryRank: 2,
    keywords: "",
    range: "7,5 m",
    areaOfEffect: "1 individu cible",
    duration: "5 tours",
    raises: "Durée (+1 tour), Portée (+1,5 m)",
    description: "Les ishiken talentueux peuvent priver autrui de sa capacité à puiser dans le Vide, ne serait-ce que temporairement. Si ce sort réussit, la cible doit remporter un jet Contesté de Vide contre vous avant de pouvoir dépenser le moindre Point de Vide. Ce jet ne compte pas comme une action pour la cible, et elle ne doit réussir qu'un seul jet Contesté par tour, même si elle dépense plusieurs Points de Vide par tour grâce à une Technique ou une autre capacité."
  },

  // ============ Sorts de Vide - Rang 3 ============
  {
    name: "Échos dans le Vide",
    ring: "void",
    masteryRank: 3,
    keywords: "",
    range: "7,5 m",
    areaOfEffect: "1 individu cible",
    duration: "Concentration",
    raises: "Portée (+1,5 m)",
    description: "Les pensées sont comme des murmures dans le Vide, pour qui sait écouter. Tant que ce sort est actif et que vous maintenez votre concentration sur une cible dans la zone d'effet, vous pouvez entendre ce que cette personne pense. La manière dont cela se manifeste peut varier selon l'individu : des guerriers résolus peuvent avoir des pensées courtes et abruptes résumant leurs intentions, tandis que des artisans peuvent penser en termes poétiques."
  },
  {
    name: "Intention Karmique",
    ring: "void",
    masteryRank: 3,
    keywords: "",
    range: "6 m",
    areaOfEffect: "1 individu cible",
    duration: "10 minutes",
    raises: "Durée (+1 minute), Portée (+1,5 m)",
    description: "Les liens forgés par le Vide permettent le passage d'une énergie considérable, la substance même de l'univers, entre ceux qui la partagent. Vous pouvez cibler avec ce sort un individu consentant. Tous les Points de Vide restants que vous possédez tous deux sont placés dans une réserve commune, dans laquelle chacun peut puiser normalement. Ce sort permet essentiellement à deux individus de partager leurs Points de Vide comme bon leur semble, y compris les Points de Vide supplémentaires gagnés via d'autres sorts de Vide. À la fin de la durée du sort, tous les Points de Vide restants sont répartis entre les participants, jusqu'à leur maximum normal respectif."
  },
  {
    name: "Instant de Clarté",
    ring: "void",
    masteryRank: 3,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "2 tours",
    raises: "Durée (+1 tour)",
    description: "L'intégralité de l'accomplissement humain se reflète dans le Vide. Vous pouvez sélectionner n'importe quelle Compétence : vous gagnez des rangs temporaires dans cette Compétence égaux à votre Anneau de Vide. Si vous possédez déjà des rangs dans cette Compétence, ce nouveau niveau remplace l'ancien ; les deux ne se cumulent pas."
  },
  {
    name: "Lire l'Essence",
    ring: "void",
    masteryRank: 3,
    keywords: "Divination",
    range: "Personnelle",
    areaOfEffect: "1 objet cible",
    duration: "Instantané (voir description)",
    raises: "Aucune",
    description: "Même les objets ont une résonance, et conservent un peu de la mémoire de ceux qui les ont détenus, ainsi que des événements majeurs qui les ont impliqués. En méditant sur un objet, vous pouvez obtenir une vision de la dernière personne qui l'a tenu, ou d'un événement majeur qui pourrait l'avoir concerné d'une manière ou d'une autre. Utiliser ce sort sur un pinceau de calligraphie pourrait par exemple montrer la dernière personne qui l'a utilisé pour écrire une lettre ; l'utiliser sur une arme pourrait plutôt montrer la dernière mort qu'elle a infligée. Le MJ a l'autorité ultime sur la vision transmise par le sort. Des objets extrêmement importants, comme des armes ou étendards ancestraux, peuvent produire des visions puissantes qui saisissent le lanceur pour des périodes plus longues, plutôt que de simples visions instantanées."
  },
  {
    name: "Relâchement du Vide",
    ring: "void",
    masteryRank: 3,
    keywords: "",
    range: "7,5 m",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m)",
    description: "La plupart ignorent le Vide qui coule en eux, et ne réalisent pas qu'il peut leur être dérobé. Vous devez réussir un jet Contesté de Vide contre la cible de ce sort. En cas de succès, la cible perd un Point de Vide, et vous en gagnez un. Un point supplémentaire est échangé pour chaque tranche de 5 points par laquelle vous dépassez le jet de la cible. Ces Points de Vide temporaires peuvent vous faire dépasser votre nombre maximal de Points de Vide, mais expirent en une heure s'ils ne sont pas utilisés. Ce sort ne peut être utilisé sur une créature ne possédant pas de Points de Vide, ou disposant d'un autre effet mécanique s'y substituant (comme l'Akasha Naga ou le Nom des Ratlings)."
  },

  // ============ Sorts de Vide - Rang 4 ============
  {
    name: "Équilibre des Éléments",
    ring: "void",
    masteryRank: 4,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 individu cible (peut être le lanceur)",
    duration: "5 tours / 5 minutes (voir description)",
    raises: "Durée (+1 tour / +1 minute, voir description), Spécial (+1k1 Blessures soignées par 2 Augmentations)",
    description: "Les failles dans le grand motif du Vide peuvent être surmontées, quelle que soit leur sévérité. Vous pouvez annuler tous les Désavantages de la cible pour la durée du sort. Les effets négatifs infligés par des sorts (comme des malus de TN, une réduction de TN d'Armure, ou une réduction de Trait/Anneau) sont également annulés, tant que le Rang de Maîtrise du sort responsable est de 3 ou moins. Utilisé dans l'environnement éprouvant du combat, la durée du sort est extrêmement limitée (5 tours). Hors combat en revanche, les effets du sort peuvent durer significativement plus longtemps (5 minutes). Cette restauration temporaire du motif de la cible soigne aussi 3k3 Blessures."
  },
  {
    name: "Fléchette de Vide",
    ring: "void",
    masteryRank: 4,
    keywords: "",
    range: "30 m",
    areaOfEffect: "Une créature cible",
    duration: "Instantané",
    raises: "Portée (+30 m par Augmentation), Cibles (+1 cible par 2 Augmentations, maximum de cibles égal à votre Anneau de Vide)",
    description: "Le sort Fléchette de Vide fut créé par le Shugenja Ekuro lors de sa célèbre bataille. Le sort a été préservé comme secret de l'Ordre des Cinq Armes, mais on pense que les Phénix pourraient aussi le posséder dans leurs bibliothèques, et il est possible que d'autres familles de Shugenja en aient des copies. Lancer ce sort nécessite de dépenser un Point de Vide ; le sort invoque un projectile de Vide pur qui fonce et frappe infailliblement une cible à portée. La Fléchette inflige des dégâts avec un DR égal à votre Vide. Ces dégâts ignorent l'Invulnérabilité et la Réduction, quelle qu'en soit la source.",
    damage: { mode: "ring", ring: "void", rolled: 0, kept: 0, note: "Ignore l'Invulnérabilité et la Réduction, quelle qu'en soit la source." }
  },
  {
    name: "Refermer le Voile",
    ring: "void",
    masteryRank: 4,
    keywords: "",
    range: "15 m",
    areaOfEffect: "1 esprit cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m), Cibles (+1 par Augmentation)",
    description: "Le néant qui constitue le Vide fait partie intégrante de ce qui sépare les différents royaumes spirituels les uns des autres, et il est possible de le renforcer dans certaines zones. Vous pouvez cibler tout esprit non natif du royaume mortel de Ningen-do. Cet esprit est banni vers son royaume d'origine pour une durée minimale égale à votre Anneau de Vide en mois. Les esprits possédant un corps physique dans le royaume mortel, comme les oni ou les esprits changeformes, nécessitent un jet Contesté de Volonté pour être affectés par ce sort. Les esprits significativement plus puissants que vous (à la discrétion du MJ) peuvent s'avérer immunisés aux effets de ce sort."
  },
  {
    name: "Combler le Néant",
    ring: "void",
    masteryRank: 4,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Portée (peut passer à 3 m avec 3 Augmentations)",
    description: "Renforcer la connexion d'un individu au Vide peut restaurer ses réserves d'énergie intérieure. La cible de ce sort récupère tous ses Points de Vide perdus, jusqu'à son maximum."
  },
  {
    name: "Frappe du Vide",
    ring: "void",
    masteryRank: 4,
    keywords: "",
    range: "15 m",
    areaOfEffect: "1 individu cible",
    duration: "Instantané",
    raises: "Portée (+1,5 m), Spécial (+1k0 dégâts par 2 Augmentations)",
    description: "L'enveloppe mortelle ne peut endurer qu'un contact limité et direct avec le Vide ; au-delà, la chair peut être détruite par l'exposition. Ce sort inflige des dégâts avec un DR égal à votre Anneau de Vide.",
    damage: { mode: "ring", ring: "void", rolled: 0, kept: 0, note: "" }
  },

  // ============ Sorts de Vide - Rang 5 ============
  {
    name: "Diviser l'Âme",
    ring: "void",
    masteryRank: 5,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "1 minute",
    raises: "Durée (+1 minute)",
    description: "Les véritables mystères du Vide dépassent l'entendement des non-ishiken. Grâce à ce sort, vous pouvez diviser votre âme à travers le Vide et exister en deux endroits du royaume mortel simultanément. Le second \"vous\" apparaît où vous le souhaitez dans votre champ de vision au moment du lancer. Vous avez une pleine conscience de tout ce qui se passe aux deux endroits, et pouvez agir simultanément comme s'il s'agissait de deux individus distincts. Une seule manifestation peut effectuer un jet de Lancer de Sort par tour. Toutes les Blessures subies par l'une ou l'autre manifestation sont combinées à la fin du sort, et si l'un de vos deux corps meurt, les deux meurent."
  },
  {
    name: "Reforger",
    ring: "void",
    masteryRank: 5,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 objet",
    duration: "Permanente",
    raises: "Aucune",
    description: "Tout est un et un est tout. Vous pouvez prendre n'importe quel objet et le transformer en tout autre objet de taille comparable. Cela ne fonctionne qu'avec un objet de construction uniforme, plutôt qu'assemblé à partir de plusieurs pièces. Ce sort n'affecte pas la matière vivante. Bien que l'effet de ce sort soit permanent, il peut être inversé par un second lancer sur le même objet, même par un ishiken différent."
  },
  {
    name: "Essence Déliée",
    ring: "void",
    masteryRank: 5,
    keywords: "",
    range: "7,5 m",
    areaOfEffect: "1 individu cible",
    duration: "1 heure",
    raises: "Durée (+1 heure), Portée (+1,5 m)",
    description: "Altérer le motif du Vide d'un autre être peut entraîner des changements catastrophiques dans ses capacités. Les Anneaux de la cible sont réordonnés aléatoirement, de même que ses Traits. Par exemple, une cible pourrait échanger son Anneau d'Air contre son Anneau de Feu, et son Anneau d'Eau contre son Anneau de Terre, pour la durée du sort. Les Traits Mentaux et Physiques échangent leurs valeurs si celles-ci dépassent celle de l'Anneau. Dans l'exemple ci-dessus, si la cible a Air 3 et Réflexes 4, elle aurait à la place Feu 3 et Agilité 4, avec ses valeurs de Traits réassignées à son Air et ses Réflexes."
  },

  // ============ Sorts de Vide - Rang 6 ============
  {
    name: "Anneau du Vide",
    ring: "void",
    masteryRank: 6,
    keywords: "",
    range: "Personnelle",
    areaOfEffect: "Soi-même",
    duration: "Concentration (nécessite 1 heure d'incantation)",
    raises: "Durée (+5 minutes au temps d'incantation)",
    description: "Rare et extraordinairement puissante, même selon les standards des Shugenja, cette prière fait appel à la faveur unique du dragon dont le domaine est celui que foulent les ishiken : le Dragon du Vide. Contrairement à la plupart des sorts, celui-ci n'est pas enseigné par autrui, mais simplement appris par la perspicacité de ceux capables de le lancer (et n'est donc associé à aucun parchemin). Ce sort, davantage un rituel de méditation, vous permet en réalité de communier avec le Dragon du Vide lui-même, un exploit que peu de mortels ont jamais réussi à accomplir. Pendant vos brefs instants de contact avec cette entité divine, vous pouvez lui poser les questions de votre choix. Le Dragon du Vide connaît tout ce qui peut être connu, bien qu'il ne soit nullement obligé de vous répondre directement, ni même de répondre du tout. Le respect doit être maintenu en toute circonstance, car ceux qui ont tenté cet exploit par le passé sans rendre hommage à leur patron ont purement et simplement cessé d'exister."
  },
  {
    name: "Renaître des Cendres",
    ring: "void",
    masteryRank: 6,
    keywords: "",
    range: "Contact",
    areaOfEffect: "1 individu cible",
    duration: "Instantané (nécessite 1 heure d'incantation)",
    raises: "Spécial (+1 heure de régression par Augmentation)",
    description: "Tout ce qui existe a un motif dans le Vide, un fil tissé dans la tapisserie de l'existence. En évoquant le souvenir de ce motif, vous pouvez inverser les effets récents survenus à une créature vivante. En lançant ce sort sur un individu, vous restaurez essentiellement son existence au sein du Vide conformément à son état antérieur. Une fois le sort achevé, la personne est immédiatement ramenée à l'état dans lequel elle se trouvait huit heures avant le début du sort. Toute blessure subie pendant cette période, les effets de maladies ou de poisons, et même l'acquisition de conditions surnaturelles comme la Souillure des Terres de l'Ombre ou la corruption par l'Obscurité Rampante, peuvent ainsi être annulés. Une fois ce sort achevé, vous perdez tous vos Points de Vide, et ne pouvez en regagner pendant une période de trois jours, après quoi ils recommencent à se régénérer à raison d'un Point de Vide par jour jusqu'à ce que vous retrouviez votre maximum normal. Ce sort ne peut être utilisé pour ramener quelqu'un qui est mort."
  },
  {
    name: "Défaire le Monde",
    ring: "void",
    masteryRank: 6,
    keywords: "",
    range: "15 m",
    areaOfEffect: "1 créature, individu ou objet cible",
    duration: "Instantané",
    raises: "Portée (+3 m)",
    description: "La capacité la plus puissante et terrifiante de ceux qui commandent le Vide est celle de détruire les liens existant entre les cinq éléments. En éradiquant les liens entre les éléments existants, vous pouvez effectivement faire cesser d'exister un objet ou une créature. Lancé sur une créature vivante, ce sort exige un jet Contesté de votre Vide contre la Terre de la cible. En cas de succès, elle est instantanément tuée, et sa dépouille disparaît dans le Vide. Le succès est automatique contre un objet non-magique, mais tenter de détruire un objet éveillé, comme un Nemuranai, peut avoir de graves conséquences à la discrétion du MJ (les kami contenus dans un objet éveillé réagissent souvent très mal à ce type d'attaque, par exemple)."
  }
];
