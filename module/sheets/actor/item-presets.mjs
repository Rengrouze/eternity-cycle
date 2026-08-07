import { DEFAULT_WEAPONS } from "../../data/default-weapons.mjs";
import { DEFAULT_AMMO } from "../../data/default-ammo.mjs";
import { DEFAULT_ARMORS } from "../../data/default-armors.mjs";

/**
 * Handlers d'action "ajout en un clic" depuis une liste prédéfinie (voir
 * module/data/default-*.mjs) - pas de modale, contrairement à
 * module/sheets/actor/item-dialogs.mjs.
 */

/**
 * "Arme de base" : ajoute une arme depuis DEFAULT_WEAPONS (liste
 * déroulante à côté du bouton), sans repasser par la modale complète.
 * @this {CharacterSheet}
 */
export async function onAddWeaponPreset(event, target) {
  const select = target.parentElement.querySelector('select[name="weaponPreset"]');
  const preset = DEFAULT_WEAPONS.find((w) => w.name === select?.value);
  if (!preset) return;

  const { name, ...system } = preset;
  await this.actor.createEmbeddedDocuments("Item", [{ name, type: "weapon", system }]);
}

/**
 * "Munition de base" : ajoute une munition depuis DEFAULT_AMMO (liste
 * déroulante à côté du bouton), sans repasser par la modale complète.
 * @this {CharacterSheet}
 */
export async function onAddAmmoPreset(event, target) {
  const select = target.parentElement.querySelector('select[name="ammoPreset"]');
  const preset = DEFAULT_AMMO.find((a) => a.name === select?.value);
  if (!preset) return;

  const { name, ...system } = preset;
  await this.actor.createEmbeddedDocuments("Item", [{ name, type: "ammo", system }]);
}

/**
 * "+ Ashigaru/Légère/Lourde/Monture" : ajoute une des 4 armures de base
 * en un clic, sans modale. Même convention de spread que les deux presets
 * ci-dessus (`specialRules` absent d'une entrée DEFAULT_ARMORS - ex: Armure
 * Ashigaru - retombe simplement sur le défaut du schema plutôt qu'un `""` explicite).
 * @this {CharacterSheet}
 */
export async function onAddArmorPreset(event, target) {
  const preset = DEFAULT_ARMORS.find((a) => a.name === target.dataset.preset);
  if (!preset) return;

  const { name, ...system } = preset;
  await this.actor.createEmbeddedDocuments("Item", [{ name, type: "armor", system }]);
}
