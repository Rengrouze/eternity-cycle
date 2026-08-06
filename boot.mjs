import { SystemActor, SystemItem, SystemCombatant } from "./module/documents/_module.mjs";
import { CharacterDataModel, ItemDataModel, SkillDataModel, WeaponDataModel, ArmorDataModel, MiscItemDataModel, AmmoDataModel, SpellDataModel } from "./module/data-models/_module.mjs";
import { CharacterSheet } from "./module/sheets/actor-sheet.mjs";
import { WeaponSheet } from "./module/sheets/weapon-sheet.mjs";
import { ArmorSheet } from "./module/sheets/armor-sheet.mjs";
import { MiscItemSheet } from "./module/sheets/misc-item-sheet.mjs";
import { AmmoSheet } from "./module/sheets/ammo-sheet.mjs";
import { SpellSheet } from "./module/sheets/spell-sheet.mjs";
import { L5RExplodingDie } from "./module/dice/l5r-die.mjs";
import { L5RRollKeep } from "./module/dice/l5r-roll.mjs";
import { registerSkillSeeding } from "./module/hooks/seed-default-skills.mjs";
import { registerSystemSettings } from "./module/settings.mjs";
import { registerDamageChatActions } from "./module/chat/damage-chat-actions.mjs";
import { registerCombatTrackerStanceBadges } from "./module/hooks/combat-tracker-stances.mjs";
import { registerReactionPhasePrompts } from "./module/hooks/reaction-phase.mjs";
import { registerInitiativeChatCard } from "./module/hooks/initiative-chat-card.mjs";

Hooks.once("init", () => {
   console.log("L5R4EC | Initialisation du système Eternity Cycle");

   // ---- Réglages système (MJ) ----
   registerSystemSettings();

   // ---- Document classes custom ----
   CONFIG.Actor.documentClass = SystemActor;
   CONFIG.Item.documentClass = SystemItem;
   // Raccroche l'Initiative native du Combat Tracker au moteur de dés
   // Retiens & Garde (voir SystemCombatant#getInitiativeRoll).
   CONFIG.Combatant.documentClass = SystemCombatant;

   // ---- Data Models ----
   CONFIG.Actor.dataModels = {
      character: CharacterDataModel,
   };
   CONFIG.Item.dataModels = {
      item: ItemDataModel,
      skill: SkillDataModel,
      weapon: WeaponDataModel,
      armor: ArmorDataModel,
      misc: MiscItemDataModel,
      ammo: AmmoDataModel,
      spell: SpellDataModel,
   };

   // ---- Dés custom ----
   // Nécessaire pour que Foundry sache reconstruire L5RExplodingDie/L5RRollKeep
   // en relisant un message de chat existant (après reload par ex.).
   CONFIG.Dice.termTypes.L5RExplodingDie = L5RExplodingDie;
   CONFIG.Dice.rolls.push(L5RRollKeep);

   // ---- Sheets ----
   foundry.documents.collections.Actors.registerSheet("l5r4ec", CharacterSheet, {
      types: ["character"],
      makeDefault: true,
      label: "L5R4EC.Sheet.Character",
   });

   foundry.documents.collections.Items.registerSheet("l5r4ec", WeaponSheet, {
      types: ["weapon"],
      makeDefault: true,
      label: "TYPES.Item.weapon",
   });
   foundry.documents.collections.Items.registerSheet("l5r4ec", ArmorSheet, {
      types: ["armor"],
      makeDefault: true,
      label: "TYPES.Item.armor",
   });
   foundry.documents.collections.Items.registerSheet("l5r4ec", MiscItemSheet, {
      types: ["misc"],
      makeDefault: true,
      label: "TYPES.Item.misc",
   });
   foundry.documents.collections.Items.registerSheet("l5r4ec", AmmoSheet, {
      types: ["ammo"],
      makeDefault: true,
      label: "TYPES.Item.ammo",
   });
   foundry.documents.collections.Items.registerSheet("l5r4ec", SpellSheet, {
      types: ["spell"],
      makeDefault: true,
      label: "TYPES.Item.spell",
   });

   // ---- Peuplement automatique des Compétences par défaut ----
   registerSkillSeeding();

   // ---- Bouton "Lancer les dégâts" sur les cartes de Jet de Sort/Attaque ----
   registerDamageChatActions();

   // ---- Icône de posture par combattant dans le Combat Tracker ----
   registerCombatTrackerStanceBadges();

   // ---- Phase de Réaction : demande la posture à chaque joueur en début de round ----
   registerReactionPhasePrompts();

   // ---- Harmonise la carte de chat de l'Initiative lancée depuis le Combat Tracker ----
   registerInitiativeChatCard();
});
