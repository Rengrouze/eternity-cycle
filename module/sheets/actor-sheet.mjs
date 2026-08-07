const { HandlebarsApplicationMixin } = foundry.applications.api;
const { ActorSheetV2 } = foundry.applications.sheets;

import { DEFAULT_ARMORS } from "../data/default-armors.mjs";
import { DEFAULT_WEAPONS } from "../data/default-weapons.mjs";
import { DEFAULT_AMMO } from "../data/default-ammo.mjs";
import { SUBTYPE_SKILL_NAMES } from "../data/default-skills.mjs";
import { qualityBadge } from "./mixins/quality.mjs";
import { computeMaxLearnableRank } from "../rules/spellcasting.mjs";
import { STANCES, canAttackInStance } from "../rules/stances.mjs";
import { effectiveMoveBudget, ACTION_POINTS_PER_TURN } from "../rules/actions.mjs";
import { isActionEconomyEnforced } from "../settings.mjs";
import { findSkillByName } from "../rules/skills.mjs";
import { RING_OPTIONS, RING_VISUALS, AFFINITY_OPTIONS, TRAIT_OPTIONS, SKILL_CATEGORIES } from "./actor/constants.mjs";
import { listOtherCombatants } from "./actor/combat-targets.mjs";
import { onAddSpell, onAddSkill, onAddWeapon, onAddArmorCustom, onAddMisc, onAddAmmo } from "./actor/item-dialogs.mjs";
import { onAddWeaponPreset, onAddAmmoPreset, onAddArmorPreset } from "./actor/item-presets.mjs";
import {
  onRollTrait,
  onRollRing,
  onRollSkill,
  onRollSpell,
  onRollAttack,
  onDrawWeapon,
  onSheatheWeapon,
  onDeclareGuard,
  onStandUp,
  onSpendMoveAction,
  onInitiateGrapple,
  onGrappleHit,
  onGrappleThrow,
  onGrappleBreak,
  onGrapplePass,
  onAttemptGrappleControl,
  onRollInitiative,
  onRollFullDefense,
  onSetStance,
} from "./actor/combat-actions.mjs";
import {
  onChangeItemField,
  onOpenItem,
  onShowItemInfo,
  onAddSubtype,
  onToggleArmorEquip,
  onResyncSkills,
  onDeleteItem,
  onToggleTaintVisibility,
} from "./actor/item-actions.mjs";
import { onBreakKoku, onBreakBu, onSpendMoney } from "./actor/money-actions.mjs";

/**
 * Feuille de personnage de base pour L5R 4e - Eternity Cycle.
 * Structurée en onglets : Anneaux/Traits, Compétences, Combat, Historique.
 *
 * Les handlers d'action et modales sont répartis en plusieurs fichiers sous
 * module/sheets/actor/ plutôt que des méthodes statiques privées de cette
 * classe (voir module/sheets/actor/constants.mjs, roll-prompts.mjs,
 * item-dialog-helper.mjs, item-dialogs.mjs, item-presets.mjs,
 * combat-actions.mjs, item-actions.mjs, money-actions.mjs) - Foundry
 * ApplicationV2 appelle un handler d'action via `handler.call(this, event,
 * target)`, donc une simple fonction exportée (avec `this` lié par Foundry)
 * fonctionne identiquement à une méthode de classe ; cette classe ne garde
 * que ce qui a vraiment besoin de vivre sur l'instance (construction du
 * contexte, cycle de vie du rendu, tooltip des buffs).
 */
export class CharacterSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
   static DEFAULT_OPTIONS = {
      classes: ["l5r4ec", "sheet", "actor", "character"],
      position: {
         width: 860,
         height: 780,
      },
      window: {
         resizable: true,
         title: "L5R4EC.Sheet.Character",
      },
      form: {
         submitOnChange: true,
      },
      // Permet de glisser une Arme/Armure/Objet/Munition depuis un compendium
      // (ou la barre latérale) directement sur la fiche pour l'ajouter à
      // l'inventaire - comportement standard Foundry, hérité d'ActorSheetV2
      // (_onDropItem crée une copie embarquée sans code supplémentaire ici).
      // Permet aussi de glisser une ligne d'inventaire pour la réordonner/sortir.
      dragDrop: [{ dragSelector: "[data-item-id]", dropSelector: null }],
      actions: {
         rollTrait: onRollTrait,
         rollRing: onRollRing,
         rollSkill: onRollSkill,
         rollSpell: onRollSpell,
         addSpell: onAddSpell,
         rollAttack: onRollAttack,
         drawWeapon: onDrawWeapon,
         sheatheWeapon: onSheatheWeapon,
         declareGuard: onDeclareGuard,
         standUp: onStandUp,
         spendMoveAction: onSpendMoveAction,
         initiateGrapple: onInitiateGrapple,
         grappleHit: onGrappleHit,
         grappleThrow: onGrappleThrow,
         grappleBreak: onGrappleBreak,
         grapplePass: onGrapplePass,
         attemptGrappleControl: onAttemptGrappleControl,
         rollInitiative: onRollInitiative,
         rollFullDefense: onRollFullDefense,
         setStance: onSetStance,
         showSkillInfo: onShowItemInfo,
         showItemInfo: onShowItemInfo,
         openItem: onOpenItem,
         addSkill: onAddSkill,
         addSubtype: onAddSubtype,
         addWeapon: onAddWeapon,
         addWeaponPreset: onAddWeaponPreset,
         addArmorCustom: onAddArmorCustom,
         addArmorPreset: onAddArmorPreset,
         addMisc: onAddMisc,
         addAmmo: onAddAmmo,
         addAmmoPreset: onAddAmmoPreset,
         toggleArmorEquip: onToggleArmorEquip,
         breakKoku: onBreakKoku,
         breakBu: onBreakBu,
         spendMoney: onSpendMoney,
         resyncSkills: onResyncSkills,
         deleteItem: onDeleteItem,
         toggleTaintVisibility: onToggleTaintVisibility,
      },
   };

   /**
    * Élément flottant du tooltip des icônes de buff (voir #_bindBuffTooltips),
    * réutilisé entre les rendus - créé au premier survol, retiré à la
    * fermeture de la fiche (#_onClose). Attaché à document.body plutôt qu'à
    * l'intérieur de la fiche : le panneau de buffs vit dans un onglet
    * `overflow-y-auto` (voir tab-combat.hbs), qui aurait sinon rogné un
    * tooltip positionné en `absolute` dès qu'il dépasse la zone visible.
    * @type {HTMLElement|null}
    */
   #buffTooltip = null;

   /** @override */
   static PARTS = {
      header: {
         template: "systems/l5r4ec/templates/actor/parts/header.hbs",
      },
      tabs: {
         // Template générique fourni par Foundry pour la barre d'onglets.
         template: "templates/generic/tab-navigation.hbs",
      },
      rings: {
         template: "systems/l5r4ec/templates/actor/parts/tab-rings.hbs",
         scrollable: [""],
      },
      skills: {
         template: "systems/l5r4ec/templates/actor/parts/tab-skills.hbs",
         scrollable: [""],
      },
      combat: {
         template: "systems/l5r4ec/templates/actor/parts/tab-combat.hbs",
         scrollable: [""],
      },
      magic: {
         template: "systems/l5r4ec/templates/actor/parts/tab-magic.hbs",
         scrollable: [""],
      },
      inventory: {
         template: "systems/l5r4ec/templates/actor/parts/tab-inventory.hbs",
         scrollable: [""],
      },
      bio: {
         template: "systems/l5r4ec/templates/actor/parts/tab-bio.hbs",
         scrollable: [""],
      },
   };

   /** @override */
   static TABS = {
      sheet: {
         tabs: [
            { id: "rings", group: "sheet", label: "L5R4EC.Tabs.RingsAndTraits", icon: "fa-solid fa-circle-notch" },
            { id: "skills", group: "sheet", label: "L5R4EC.Tabs.Skills", icon: "fa-solid fa-book" },
            { id: "combat", group: "sheet", label: "L5R4EC.Tabs.Combat", icon: "fa-solid fa-khanda" },
            { id: "magic", group: "sheet", label: "L5R4EC.Tabs.Magic", icon: "fa-solid fa-hand-sparkles" },
            { id: "inventory", group: "sheet", label: "L5R4EC.Tabs.Inventory", icon: "fa-solid fa-shield-halved" },
            { id: "bio", group: "sheet", label: "L5R4EC.Tabs.Bio", icon: "fa-solid fa-scroll" },
         ],
         initial: "rings",
      },
   };

   /** @override */
   async _prepareContext(options) {
      const context = await super._prepareContext(options);

      context.actor = this.actor;
      context.system = this.actor.system;

      // Honneur devient "Infamie" à l'affichage dès que le rang passe sous
      // zéro (mécanique L5R 4e).
      context.isInfamous = this.actor.system.honor.rank < 0;

      // Honneur, Gloire, Statut et Souillure : le MJ édite, le joueur lit
      // seulement (voir header.hbs et SystemActor#_preUpdate).
      context.isGM = game.user.isGM;

      context.tabs = this._prepareTabs("sheet");

      const s = this.actor.system;
      context.ringGroups = [
         {
            key: "air",
            labelKey: "L5R4EC.Ring.Air",
            rank: s.rings.air.rank,
            traits: [
               { key: "ref", labelKey: "L5R4EC.Trait.Reflexes", value: s.traits.ref },
               { key: "awa", labelKey: "L5R4EC.Trait.Awareness", value: s.traits.awa },
            ],
         },
         {
            key: "earth",
            labelKey: "L5R4EC.Ring.Earth",
            rank: s.rings.earth.rank,
            traits: [
               { key: "sta", labelKey: "L5R4EC.Trait.Stamina", value: s.traits.sta },
               { key: "wil", labelKey: "L5R4EC.Trait.Willpower", value: s.traits.wil },
            ],
         },
         {
            key: "fire",
            labelKey: "L5R4EC.Ring.Fire",
            rank: s.rings.fire.rank,
            traits: [
               { key: "agi", labelKey: "L5R4EC.Trait.Agility", value: s.traits.agi },
               { key: "int", labelKey: "L5R4EC.Trait.Intelligence", value: s.traits.int },
            ],
         },
         {
            key: "water",
            labelKey: "L5R4EC.Ring.Water",
            rank: s.rings.water.rank,
            traits: [
               { key: "str", labelKey: "L5R4EC.Trait.Strength", value: s.traits.str },
               { key: "per", labelKey: "L5R4EC.Trait.Perception", value: s.traits.per },
            ],
         },
      ].map((ring) => ({ ...ring, ...RING_VISUALS[ring.key] }));
      context.voidRing = RING_VISUALS.void;

      context.skillsByCategory = this._buildSkillsByCategory();
      context.inventory = this._buildInventory();
      context.activeBuffs = this.actor.system.activeBuffs ?? [];
      context.magic = this._buildMagic();
      context.combat = this._buildCombat();

      return context;
   }

   /**
    * Construit le contexte de l'onglet Combat : postures disponibles (avec
    * leur description non-automatisée, voir module/rules/stances.mjs) et la
    * liste des Armes équipées prêtes à attaquer, avec la Compétence associée
    * résolue par nom sur la fiche (voir module/rules/skills.mjs#findSkillByName -
    * même résolution que SystemActor#rollAttack, dupliquée ici uniquement
    * pour l'affichage, "trouvée ou non").
    */
   _buildCombat() {
      const s = this.actor.system;
      const stance = s.combat.stance;

      const attacks = this.actor.items
         .filter((i) => i.type === "weapon" && i.system.equipped)
         .map((item) => {
            const skillItem = findSkillByName(this.actor, item.system.associatedSkill);
            return {
               id: item.id,
               name: item.name,
               associatedSkill: item.system.associatedSkill,
               dr: `${item.system.damageRolled}k${item.system.damageKept}`,
               isRanged: item.system.isRanged,
               range: item.system.range,
               skillFound: Boolean(skillItem),
               skillRank: skillItem?.system.rank ?? 0,
               hand: item.system.hand,
               drawn: item.system.hand !== "none",
            };
         });

      // Barre de vie : pourcentage + couleur dérivés du rang de blessure actuel
      // (system.wounds.rankIndex, calculé par CharacterDataModel) - précalculés
      // ici plutôt qu'en Handlebars, qui n'a pas d'opérateur arithmétique/ternaire
      // garanti (voir pièges du projet).
      const woundsColors = [
         "bg-green-500",
         "bg-green-500",
         "bg-yellow-500",
         "bg-yellow-500",
         "bg-orange-500",
         "bg-orange-500",
         "bg-red-600",
         "bg-red-800",
         "bg-black",
      ];

      const inCombat = this.actor.isInCombat;
      const stanceLocked = this.actor.isStanceLocked;

      // Économie d'Action (voir module/rules/actions.mjs) : n'a de sens que si
      // le réglage est actif ET que le personnage est engagé dans un combat en
      // cours - hors de ces conditions, tout reste libre (voir SystemActor#_ensureCanRoll).
      const actionEconomyActive = isActionEconomyEnforced() && inCombat;
      const isCurrentTurn = this.actor.isCurrentTurn;
      const moveBudget = effectiveMoveBudget(this.actor);
      // Cap actuel du budget de déplacement (voir SystemActor#spendMoveAction,
      // module/hooks/token-movement-tracking.mjs qui applique le blocage réel) -
      // "libre" par défaut, +1× `moveBudget.simple` par Action Simple "Foncer"
      // déjà dépensée ce tour (répétable, voir system.combat.moveActionsSpent).
      const moveActionsSpent = s.combat.moveActionsSpent;
      const moveCap = moveActionsSpent === 0 ? moveBudget.free : moveActionsSpent * moveBudget.simple;

      return {
         stance,
         stances: STANCES.map((st) => ({ ...st, active: st.key === stance, isFullDefense: st.key === "fullDefense" })),
         canAttack: canAttackInStance(stance),
         inCombat,
         stanceLocked,
         stanceDisabled: !inCombat || stanceLocked || Boolean(s.combat.grappleGroupId),
         attacks,
         initiativeBonus: s.combat.initiativeBonus,
         fullDefenseBonus: s.combat.fullDefenseBonus,
         woundsPercent: s.wounds.max > 0 ? Math.min(100, Math.round((s.wounds.value / s.wounds.max) * 100)) : 0,
         woundsColorClass: woundsColors[s.wounds.rankIndex] ?? "bg-red-800",
         actionEconomyActive,
         isCurrentTurn,
         actionPoints: s.combat.actionPoints,
         actionPips: Array.from({ length: ACTION_POINTS_PER_TURN }, (_, i) => ({ filled: i < s.combat.actionPoints })),
         moveBudget,
         moveCap,
         moveActionsSpent,
         distanceMovedThisTurn: s.combat.distanceMovedThisTurn,
         moveOverBudget: s.combat.distanceMovedThisTurn >= moveCap,
         handLabels: {
            left: game.i18n.localize("L5R4EC.Sheet.HandLeft"),
            right: game.i18n.localize("L5R4EC.Sheet.HandRight"),
            both: game.i18n.localize("L5R4EC.Sheet.HandBoth"),
         },
         dominantHandIsLeft: s.combat.dominantHand === "left",
         // Source commune des menus déroulants de cible (Garde, Empoignade,
         // Attaque, Sort - voir module/sheets/actor/combat-targets.mjs).
         targetOptions: listOtherCombatants(this.actor),
         guardTargetName:
            s.combat.guardRound === (game.combat?.round ?? -1) ? (game.actors.get(s.combat.guardTargetActorId)?.name ?? null) : null,
         isProne: this.actor.statuses?.has("prone") ?? false,
         grappled: Boolean(s.combat.grappleGroupId),
         grappleControl: s.combat.grappleControl,
         // Boutons Frapper/Jeter/Rompre/Passer (voir tab-combat.hbs, une seule
         // boucle plutôt que 4 boutons codés en dur) - seuls Frapper/Jeter
         // sont réservés au contrôleur de l'Empoignade (voir SystemActor#grappleAction).
         grappleActions: [
            { action: "grappleHit", labelKey: "L5R4EC.Maneuver.GrappleHit", requiresControl: true },
            { action: "grappleThrow", labelKey: "L5R4EC.Maneuver.GrappleThrow", requiresControl: true },
            { action: "grappleBreak", labelKey: "L5R4EC.Maneuver.GrappleBreak", requiresControl: false },
            { action: "grapplePass", labelKey: "L5R4EC.Maneuver.GrapplePass", requiresControl: false },
         ],
         grappleTargets: (game.combat?.combatants ?? [])
            .filter((c) => c.actor && c.actor.id !== this.actor.id && c.actor.system.combat?.grappleGroupId === s.combat.grappleGroupId)
            .map((c) => ({ id: c.actor.id, name: c.actor.name })),
      };
   }

   /**
    * Construit les listes Armes/Armures/Objets Divers + l'équipement actuel
    * (armure équipée, armes équipées) pour l'onglet Inventaire.
    */
   _buildInventory() {
      const badge = qualityBadge;

      const weapons = this.actor.items
         .filter((i) => i.type === "weapon")
         .map((item) => ({
            id: item.id,
            name: item.name,
            associatedSkill: item.system.associatedSkill,
            dr: `${item.system.damageRolled}k${item.system.damageKept}`,
            equipped: item.system.equipped,
            quality: badge(item),
         }));

      const armors = this.actor.items
         .filter((i) => i.type === "armor")
         .map((item) => ({
            id: item.id,
            name: item.name,
            armorType: item.system.armorType,
            tnBonus: item.system.tnBonus,
            reduction: item.system.reduction,
            equipped: item.system.equipped,
            quality: badge(item),
         }));

      const miscItems = this.actor.items
         .filter((i) => i.type === "misc")
         .map((item) => ({
            id: item.id,
            name: item.name,
            associatedSkill: item.system.associatedSkill,
            equipped: item.system.equipped,
            quality: badge(item),
         }));

      const ammo = this.actor.items
         .filter((i) => i.type === "ammo")
         .map((item) => ({
            id: item.id,
            name: item.name,
            dr: `${item.system.damageRolled}k${item.system.damageKept}`,
            quantity: item.system.quantity,
            unlimited: item.system.unlimited,
            quality: badge(item),
         }));

      return {
         weapons,
         armors,
         miscItems,
         ammo,
         equippedArmor: armors.find((a) => a.equipped) ?? null,
         equippedWeapons: weapons.filter((w) => w.equipped),
         equippedMisc: miscItems.filter((m) => m.equipped),
         armorPresets: DEFAULT_ARMORS.map((a) => ({ key: a.name, name: a.name })),
         weaponPresets: DEFAULT_WEAPONS.map((w) => ({ key: w.name, name: w.name })),
         ammoPresets: DEFAULT_AMMO.map((a) => ({ key: a.name, name: a.name })),
      };
   }

   /**
    * Construit le contexte de l'onglet Magie : config Shugenja (rang
    * d'école, affinités par Anneau avec rang max apprenable dérivé),
    * emplacements de sorts (max/dépensés/disponibles par Anneau), et la
    * liste des sorts connus groupée par Anneau puis triée par rang.
    */
   _buildMagic() {
      const s = this.actor.system;

      const rings = RING_OPTIONS.map((ring) => ({
         ...ring,
         affinity: s.shugenja.affinities[ring.key],
         affinityOptions: AFFINITY_OPTIONS.map((opt) => ({ ...opt, selected: opt.key === s.shugenja.affinities[ring.key] })),
         maxLearnableRank: computeMaxLearnableRank(s.shugenja.schoolRank, s.shugenja.affinities[ring.key]),
         slots: s.spellSlots[ring.key],
      }));

      const spells = this.actor.items
         .filter((i) => i.type === "spell")
         .sort((a, b) => a.system.masteryRank - b.system.masteryRank || a.name.localeCompare(b.name));

      const spellsByRing = RING_OPTIONS.map((ring) => ({
         ...ring,
         spells: spells
            .filter((i) => i.system.ring === ring.key)
            .map((item) => ({
               id: item.id,
               name: item.name,
               masteryRank: item.system.masteryRank,
               keywords: item.system.keywords,
            })),
      }));

      return { schoolRank: s.shugenja.schoolRank, rings, spellsByRing };
   }

   /**
    * Groupe les compétences par catégorie, puis par nom au sein d'une
    * catégorie : plusieurs compétences partageant le même nom (ex :
    * "Connaissance" avec plusieurs sous-types créés via "Ajouter une
    * compétence") deviennent un groupe dépliable ; une compétence seule
    * reste une simple ligne.
    */
   _buildSkillsByCategory() {
      const isGM = game.user.isGM;

      // Compétence à sous-types : recherche par nom (voir SUBTYPE_SKILL_NAMES),
      // pas un champ stocké sur l'Item - fonctionne même pour une Compétence
      // déjà créée avant ce champ. Le OU avec un sous-type déjà renseigné garde
      // le champ visible pour une Compétence homebrew qui en a un, même si son
      // nom n'est pas dans la liste officielle des 5 du LdB.
      const hasSubtype = (item) => SUBTYPE_SKILL_NAMES.includes(item.name) || Boolean(item.system.subtype);

      const buildRow = (item) => {
         const subtyped = hasSubtype(item);
         return {
            id: item.id,
            subtype: item.system.subtype,
            rank: item.system.rank,
            specializations: item.system.specializations,
            isSchoolSkill: item.system.isSchoolSkill,
            hasSubtype: subtyped,
            showAddSubtype: isGM && subtyped,
            // Règle maison : rang 10 -> Augmentation gratuite sur chaque jet
            // utilisant cette Compétence (voir SystemActor#_freeAugmentBonus).
            freeAugment: item.system.rank >= 10,
            traitOptions: TRAIT_OPTIONS.map((opt) => ({ ...opt, selected: opt.key === item.system.trait })),
         };
      };

      const skills = this.actor.items.filter((i) => i.type === "skill");

      return SKILL_CATEGORIES.map((category) => {
         const categorySkills = skills
            .filter((i) => i.system.category === category)
            .sort((a, b) => a.name.localeCompare(b.name) || a.system.subtype.localeCompare(b.system.subtype));

         const byName = new Map();
         for (const item of categorySkills) {
            if (!byName.has(item.name)) byName.set(item.name, []);
            byName.get(item.name).push(item);
         }

         const rows = [...byName.entries()].map(([name, items]) => {
            if (items.length === 1) return { isGroup: false, name, ...buildRow(items[0]) };
            return { isGroup: true, name, showAddSubtype: isGM, entries: items.map(buildRow) };
         });

         return { key: category, labelKey: `L5R4EC.SkillCategory.${category}`, skills: rows };
      });
   }

   /**
    * Branche les champs des lignes de Compétence (rang, Trait...) : ils ne
    * peuvent pas passer par le submitOnChange standard de la sheet (qui ne
    * met à jour que l'Actor), donc on écoute leurs changements nous-mêmes et
    * on met à jour l'Item embarqué correspondant directement.
    * @override
    */
   _onRender(context, options) {
      super._onRender(context, options);

      this.element.querySelectorAll("[data-item-id][data-item-field]").forEach((el) => {
         el.addEventListener("change", onChangeItemField.bind(this));
      });

      this.#bindBuffTooltips();
   }

   /** @override */
   _onClose(options) {
      super._onClose(options);
      this.#buffTooltip?.remove();
      this.#buffTooltip = null;
   }

   /**
    * Câble le survol des icônes du panneau "Capacités de Maîtrise actives"
    * (voir tab-combat.hbs) sur un unique élément flottant positionné en
    * `fixed` et repositionné en JS au survol, plutôt qu'un tooltip CSS
    * `absolute`/`group-hover` classique - nécessaire ici parce que ce panneau
    * vit dans un onglet à défilement (`overflow-y-auto`), qui rogne tout
    * enfant positionné en `absolute` dès qu'il déborderait de la zone
    * visible (c'est pour ça que le premier essai ne montrait rien au survol).
    * Le contenu du tooltip est le HTML déjà rendu (et donc déjà échappé par
    * Handlebars) dans le `<template>` caché de chaque icône - simplement
    * cloné dans l'élément flottant, jamais reconstruit à la main.
    */
   #bindBuffTooltips() {
      this.element.querySelectorAll(".buff-icon").forEach((wrapper) => {
         const template = wrapper.querySelector("template");
         if (!template) return;

         wrapper.addEventListener("mouseenter", () => {
            const tooltip = this.#ensureBuffTooltip();
            tooltip.replaceChildren(template.content.cloneNode(true));
            const rect = wrapper.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 4}px`;
            tooltip.classList.remove("hidden");
         });
         wrapper.addEventListener("mouseleave", () => {
            this.#buffTooltip?.classList.add("hidden");
         });
      });
   }

   /** @returns {HTMLElement} L'élément flottant du tooltip de buff, créé au besoin (voir #bindBuffTooltips). */
   #ensureBuffTooltip() {
      if (this.#buffTooltip) return this.#buffTooltip;

      const el = document.createElement("div");
      el.className =
         "l5r4ec hidden fixed w-56 p-2 rounded border border-black/30 bg-black text-white text-xs shadow-lg pointer-events-none -translate-x-1/2 -translate-y-full";
      // z-index fixe très élevé plutôt qu'une classe Tailwind : la fenêtre de
      // la fiche (ApplicationV2) a elle-même un z-index dynamique que Foundry
      // augmente à chaque mise au premier plan (Application#bringToTop), donc
      // toute valeur statique "raisonnable" finit par repasser dessous.
      el.style.zIndex = "10000";
      document.body.appendChild(el);
      this.#buffTooltip = el;
      return el;
   }
}
