import { SystemActor, SystemItem } from "./module/documents/_module.mjs";
import { CharacterDataModel, ItemDataModel } from "./module/data-models/_module.mjs";
import { CharacterSheet } from "./module/sheets/actor-sheet.mjs";

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
   };

   // ---- Sheets ----
   foundry.documents.collections.Actors.registerSheet("l5r4ec", CharacterSheet, {
      types: ["character"],
      makeDefault: true,
      label: "L5R4EC.Sheet.Character",
   });
});
