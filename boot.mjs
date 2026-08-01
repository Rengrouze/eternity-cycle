import { SystemActor, SystemItem } from "./module/documents.mjs";
import { CharacterDataModel, ItemDataModel } from "./module/data-models.mjs";
import { CharacterSheet } from "./module/sheets/actor-sheet.mjs";

Hooks.once("init", () => {
  console.log("L5R4EC | Initialisation du système Eternity Cycle");

  // ---- Document classes custom ----
  CONFIG.Actor.documentClass = SystemActor;
  CONFIG.Item.documentClass = SystemItem;

  // ---- Data Models ----
  CONFIG.Actor.dataModels = {
    character: CharacterDataModel
  };
  CONFIG.Item.dataModels = {
    item: ItemDataModel
  };

  // ---- Sheets ----
  // On enregistre notre feuille de personnage comme feuille par défaut
  // pour le type "character". L'ancienne feuille v1 reste disponible
  // en secours dans le menu de configuration de la feuille.
  foundry.documents.collections.Actors.registerSheet("l5r4ec", CharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "L5R4EC.Sheet.Character"
  });
});
