/**
 * Génère les compendiums Foundry (packs/) à partir des données par défaut du
 * système (module/data/default-*.mjs) : compile un dossier de fichiers JSON
 * source (packs-source/, régénéré à chaque exécution - pas fait pour être
 * édité à la main) en pack LevelDB via @foundryvtt/foundryvtt-cli.
 *
 * `module/data/default-*.mjs` reste la source de vérité (utilisée aussi pour
 * les listes déroulantes "Arme/Munition de base" de la fiche Acteur) ; ce
 * script se contente de projeter ces données vers le format Document Item
 * attendu par Foundry.
 *
 * Usage : npm run build:packs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { compilePack } from "@foundryvtt/foundryvtt-cli";

import { DEFAULT_WEAPONS } from "../module/data/default-weapons.mjs";
import { DEFAULT_ARMORS } from "../module/data/default-armors.mjs";
import { DEFAULT_AMMO } from "../module/data/default-ammo.mjs";
import { DEFAULT_SKILLS } from "../module/data/default-skills.mjs";
import { DEFAULT_SPELLS } from "../module/data/default-spells.mjs";

const PROJECT_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_ROOT = path.join(PROJECT_ROOT, "packs-source");
const PACKS_ROOT = path.join(PROJECT_ROOT, "packs");

const SYSTEM_ID = "l5r4ec";
const SYSTEM_VERSION = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, "system.json"), "utf8")).version;
// Icône Foundry générique garantie présente sur toute installation - à
// remplacer au cas par cas dans Foundry si une icône dédiée est souhaitée.
const DEFAULT_IMG = "icons/svg/item-bag.svg";

/**
 * ID Foundry (16 caractères alphanumériques) dérivé de façon stable d'une
 * chaîne (type + nom) : deux exécutions successives du script produisent le
 * même ID pour la même entrée, pour éviter de casser les liens de
 * compendium existants à chaque rebuild.
 */
function stableId(seed) {
  const hash = createHash("sha256").update(seed).digest("base64url");
  return hash.replace(/-/g, "x").replace(/_/g, "y").slice(0, 16);
}

function safeFilename(name) {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_");
}

function buildItemDoc({ name, type, system, id, folder = null }) {
  return {
    _id: id,
    _key: `!items!${id}`,
    name,
    type,
    img: DEFAULT_IMG,
    system,
    effects: [],
    folder,
    sort: 0,
    ownership: { default: 0 },
    flags: {},
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "14",
      systemId: SYSTEM_ID,
      systemVersion: SYSTEM_VERSION,
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null
    }
  };
}

/**
 * Dossier de compendium (CompendiumFolder) : les sorts sont bien trop
 * nombreux pour rester dans une liste plate (voir demande utilisateur "y'a
 * BEAUCOUP de sorts"), donc le pack "spells" est organisé en Anneau > Rang.
 */
function buildFolderDoc({ name, type, parent, id, sort }) {
  return {
    _id: id,
    _key: `!folders!${id}`,
    name,
    type,
    description: "",
    sorting: "m",
    sort,
    color: null,
    folder: parent,
    flags: {},
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      coreVersion: "14",
      systemId: SYSTEM_ID,
      systemVersion: SYSTEM_VERSION,
      createdTime: null,
      modifiedTime: null,
      lastModifiedBy: null
    }
  };
}

const RING_LABELS = { air: "Air", earth: "Terre", fire: "Feu", water: "Eau", void: "Vide" };

/**
 * Construit les dossiers Anneau > Rang pour le pack de sorts, et renvoie
 * {folders, folderIdFor(ring, rank)} pour assigner chaque sort à son
 * sous-dossier de rang.
 */
function buildSpellFolders(spells) {
  const folders = [];
  const rankFolderId = new Map();
  let sortCounter = 0;

  const rings = [...new Set(spells.map((s) => s.ring))];
  for (const ring of rings) {
    const ringId = stableId(`folder:spells:${ring}`);
    folders.push(buildFolderDoc({ name: RING_LABELS[ring] ?? ring, type: "Item", parent: null, id: ringId, sort: sortCounter++ }));

    const ranks = [...new Set(spells.filter((s) => s.ring === ring).map((s) => s.masteryRank))].sort((a, b) => a - b);
    for (const rank of ranks) {
      const rankId = stableId(`folder:spells:${ring}:${rank}`);
      rankFolderId.set(`${ring}:${rank}`, rankId);
      folders.push(buildFolderDoc({ name: `Rang ${rank}`, type: "Item", parent: ringId, id: rankId, sort: sortCounter++ }));
    }
  }

  return { folders, folderIdFor: (ring, rank) => rankFolderId.get(`${ring}:${rank}`) };
}

function writeSource(packName, docs) {
  const dir = path.join(SOURCE_ROOT, packName);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  for (const doc of docs) {
    const filename = `${safeFilename(doc.name)}_${doc._id}.json`;
    fs.writeFileSync(path.join(dir, filename), `${JSON.stringify(doc, null, 2)}\n`);
  }
  return dir;
}

const PACKS = [
  {
    name: "weapons",
    docs: DEFAULT_WEAPONS.map((entry) => {
      const { name, ...rest } = entry;
      const id = stableId(`weapon:${name}`);
      const system = {
        associatedSkill: rest.associatedSkill ?? "",
        damageRolled: rest.damageRolled ?? 0,
        damageKept: rest.damageKept ?? 0,
        keywords: rest.keywords ?? "",
        specialRules: rest.specialRules ?? "",
        price: rest.price ?? "",
        isRanged: rest.isRanged ?? false,
        range: rest.range ?? 0,
        strengthRating: rest.strengthRating ?? 0,
        equipped: false,
        description: rest.description ?? "",
        quality: "white",
        nemuranaiPower: ""
      };
      return buildItemDoc({ name, type: "weapon", system, id });
    })
  },
  {
    name: "armors",
    docs: DEFAULT_ARMORS.map((entry) => {
      const { name, ...rest } = entry;
      const id = stableId(`armor:${name}`);
      const system = {
        armorType: rest.armorType ?? "",
        tnBonus: rest.tnBonus ?? 0,
        reduction: rest.reduction ?? 0,
        specialRules: rest.specialRules ?? "",
        price: rest.price ?? "",
        equipped: false,
        description: rest.description ?? "",
        quality: "white",
        nemuranaiPower: ""
      };
      return buildItemDoc({ name, type: "armor", system, id });
    })
  },
  {
    name: "ammo",
    docs: DEFAULT_AMMO.map((entry) => {
      const { name, ...rest } = entry;
      const id = stableId(`ammo:${name}`);
      const system = {
        damageRolled: rest.damageRolled ?? 0,
        damageKept: rest.damageKept ?? 0,
        quantity: rest.quantity ?? 0,
        unlimited: false,
        specialRules: rest.specialRules ?? "",
        price: rest.price ?? "",
        description: rest.description ?? "",
        quality: "white",
        nemuranaiPower: ""
      };
      return buildItemDoc({ name, type: "ammo", system, id });
    })
  },
  {
    name: "skills",
    docs: DEFAULT_SKILLS.map((entry) => {
      // isWeaponSkill n'est pas un champ de SkillDataModel - c'est une
      // simple étiquette utilisée pour dériver WEAPON_SKILL_NAMES.
      const { name, isWeaponSkill: _isWeaponSkill, ...rest } = entry;
      const id = stableId(`skill:${name}`);
      const system = {
        category: rest.category,
        isSchoolSkill: false,
        trait: rest.trait,
        subtype: "",
        rank: 0,
        specializations: "",
        masteryBonuses: rest.masteryBonuses ?? [],
        description: rest.description ?? ""
      };
      return buildItemDoc({ name, type: "skill", system, id });
    })
  },
  {
    name: "spells",
    docs: (() => {
      const { folders, folderIdFor } = buildSpellFolders(DEFAULT_SPELLS);
      const items = DEFAULT_SPELLS.map((entry) => {
        const { name, ...rest } = entry;
        const id = stableId(`spell:${rest.ring}:${rest.masteryRank}:${name}`);
        const system = {
          ring: rest.ring,
          masteryRank: rest.masteryRank,
          keywords: rest.keywords ?? "",
          range: rest.range ?? "",
          areaOfEffect: rest.areaOfEffect ?? "",
          duration: rest.duration ?? "",
          raises: rest.raises ?? "",
          description: rest.description ?? ""
        };
        return buildItemDoc({ name, type: "spell", system, id, folder: folderIdFor(rest.ring, rest.masteryRank) });
      });
      return [...folders, ...items];
    })()
  }
];

for (const pack of PACKS) {
  const srcDir = writeSource(pack.name, pack.docs);
  const destDir = path.join(PACKS_ROOT, pack.name);
  await compilePack(srcDir, destDir, { log: true });
  const itemCount = pack.docs.filter((d) => d._key.startsWith("!items!")).length;
  const folderCount = pack.docs.length - itemCount;
  const folderNote = folderCount ? ` (+ ${folderCount} dossiers)` : "";
  console.log(`Pack "${pack.name}" : ${itemCount} entrées${folderNote} -> ${path.relative(PROJECT_ROOT, destDir)}`);
}
