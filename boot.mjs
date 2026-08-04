import { SystemActor, SystemItem } from "./module/documents/_module.mjs";
import { CharacterDataModel, ItemDataModel, SkillDataModel } from "./module/data-models/_module.mjs";
import { CharacterSheet } from "./module/sheets/actor-sheet.mjs";
import { L5RExplodingDie } from "./module/dice/l5r-die.mjs";
import { L5RRollKeep } from "./module/dice/l5r-roll.mjs";
import { registerSkillSeeding } from "./module/hooks/seed-default-skills.mjs";

Hooks.once("init", () => {
   console.log("L5R4EC | Initialisation du système Eternity Cycle");

   // ---- Document classes custom ----
   CONFIG.Actor.documentClass = SystemActor;
   CONFIG.Item.documentClass = SystemItem;

   // ---- Data Models ----
   CONFIG.Actor.dataModels = {
      character: CharacterDataModel,
   };
   CONFIG.Item.dataModels = {
      item: ItemDataModel,
      skill: SkillDataModel,
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

   // ---- Peuplement automatique des Compétences par défaut ----
   registerSkillSeeding();
});
