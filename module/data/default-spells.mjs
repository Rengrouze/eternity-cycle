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
    description: "Ce sort invoque les plus purs kami de la Terre, ceux de jade, sous la forme d'un jet d'énergie vert irisé. Le pouvoir de jade frappe infailliblement la cible choisie - il ne peut être intercepté ni dévié, bien qu'une Résistance Magique ou une autre forme de défense magique puisse le contrer. Si la cible possède au moins un rang de Souillure, la Frappe de Jade inflige des dégâts avec un DR de 3k3, brûlant et noircissant la chair souillée. Une cible sans Souillure complète ne subit en revanche aucun dégât. Lancer ce sort sur une cible non-souillée est généralement considéré comme une grave insulte - sauf peut-être chez les membres les plus paranoïaques de la famille Kuni, où c'est vu comme une précaution raisonnable."
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
    description: "Ce sort invoque plusieurs énormes rochers depuis la terre et les projette pour frapper infailliblement une (ou plusieurs) créature cible. La cible touchée subit des dégâts avec un DR égal à l'Anneau de Terre du lanceur. Si plusieurs cibles sont frappées, le DR est réduit de 1k1 par cible supplémentaire, jusqu'à un minimum de 1k1 par cible. Ces rochers sont de pierre ordinaire et mondaine, et ne peuvent donc normalement pas contourner la Réduction ou l'Invulnérabilité - mais un lanceur puissant peut infuser les rochers de la puissance du Jade."
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
    description: "Les prêtres des kami peuvent inscrire de puissantes protections invoquant la puissance des éléments contre quiconque tenterait de les franchir. Un Symbole de Terre peut être inscrit sur un objet solide, le plus souvent une porte, une fenêtre, un portail ou tout autre passage. Quiconque tente de franchir ce passage ou de contourner la protection est affecté par sa puissance et doit réussir un jet Contesté d'Air contre l'Anneau de Terre du lanceur. Ceux qui échouent sont frappés par une puissante onde de choc et doivent réussir un jet de Force contre le total du jet de Lancer de Sort ayant créé la protection, sous peine d'être projetés au sol et Étourdis. S'ils possèdent au moins un rang de Souillure, ils subissent en plus 2k2 Blessures. Un seul Symbole de Terre peut exister à la fois, et des sorts Symbole d'éléments différents ne peuvent jamais affecter la même zone. Ce sort peut être dissipé par un autre lancer de Symbole de Terre par n'importe quel Shugenja, ou en détruisant la surface où le Symbole a été gravé."
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
    description: "Considéré par beaucoup de Shugenja comme le sort ultime pour s'opposer aux créatures des Terres de l'Ombre, ce sort fait appel aux esprits de Terre les plus purs, ceux de jade, pour consumer la Souillure au sein de la cible. Le sort ne peut affecter qu'une cible possédant au moins un rang complet de Souillure ; en cas d'échec, le lanceur ne sait pas automatiquement que la cible est indemne de Souillure - il est toujours possible qu'elle ait simplement résisté au sort. Une fois Tombeau de Jade lancé, la cible est momentanément immobilisée pendant que les esprits de Terre pénètrent son corps. Chaque tour, à partir du premier, le lanceur doit réussir un jet Contesté de Terre contre la cible. Si la cible gagne, le sort prend fin. Si le lanceur gagne, la cible subit 2k2 Blessures tandis que les esprits commencent à transformer son corps en jade. Cela continue chaque tour jusqu'à ce que la cible résiste avec succès, que le lanceur cesse de se concentrer, ou que la cible meure. Ceux tués par ce sort sont transformés en statues de jade pur, qui s'effritent en poussière mondaine en 24 heures."
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
    description: "Ce sort déclenche un terrible séisme dévastateur, centré sur le lanceur, seul à en être épargné. Le séisme détruit entièrement tous les bâtiments en bois dans le rayon d'effet et inflige de sévères dégâts aux structures de pierre. Toutes les personnes présentes dans la zone sont projetées au sol, restent Prostrées et Étourdies pour la durée du sort, et subissent 2k1 Blessures. Les individus à l'intérieur de bâtiments (lanceur inclus) subissent 6k6 dégâts dus aux débris, effondrements de toits, etc. Lancer ce sort à portée d'une zone habitée importante est généralement considéré comme un acte de guerre."
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
    description: "Vous invoquez une puissante rafale d'air émanant de votre position, qui s'abat sur tout ce qui se trouve sur son passage et projette au sol quiconque en est frappé. Toutes les cibles dans la zone d'effet subissent 1k1 Blessures et doivent réussir un jet Contesté de leur Terre contre votre Air. Toute cible qui échoue subit un Renversement."
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
    description: "Ce sort fait appel au pouvoir d'Isora, la Fortune du Rivage, pour déchaîner une bourrasque d'air chargé de tempête et de foudre qui frappe une zone à portée. L'assaut soudain et grondant de vent, de pluie et de foudre inflige 3k2 dégâts à tous ceux présents dans la zone d'effet, qui doivent réussir un jet de Terre à TN 30 ou être Fatigués par le hurlement d'Isora. Le sort endommage aussi les objets physiques fragiles ou vulnérables : les cloisons de papier sont soufflées, les parchemins trempés, etc. Ceux qui ont la chance d'être bénis par le Sang d'Osano-Wo sont immunisés aux effets de ce sort."
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
  }
  // TODO: description tronquée côté utilisateur à "Draw Back the Shadow"
  // (Air 5) - il manque cette entrée, le reste du Rang 5, et tout le Rang 6
  // d'Air. À compléter dès réception du texte complet.
];
