/**
 * Item custom pour le système.
 *
 * Seul le MJ peut ajouter un Item à la fiche d'un personnage, ou modifier la
 * définition d'un Item déjà présent (nom, image, DR, prix, description...) -
 * demande explicite de l'utilisateur : le joueur ne doit gérer que son
 * utilisation (équiper, ajuster une quantité, monter un rang de Compétence),
 * pas le contenu de l'objet lui-même. Protégé à deux niveaux, même
 * convention que SystemActor#_preUpdate pour Honneur/Gloire/Statut : les
 * boutons "Ajouter..."/les champs de fiche d'Item sont déjà masqués ou
 * désactivés côté template pour un non-MJ, mais ceci est la protection
 * réelle côté document (empêche aussi un `actor.createEmbeddedDocuments()`
 * ou `item.update()` forcé depuis la console).
 */
export class SystemItem extends Item {
  /** Champs system.* qu'un non-MJ peut modifier sur un Item déjà embarqué : usage, pas définition. */
  static PLAYER_EDITABLE_SYSTEM_KEYS = ["equipped", "quantity", "rank", "specializations", "isSchoolSkill", "subtype", "hand"];

  /** @override */
  async _preCreate(data, options, user) {
    const allowed = await super._preCreate(data, options, user);
    if (allowed === false) return false;

    if (this.isEmbedded && !user.isGM) return false;
  }

  /** @override */
  async _preUpdate(changed, options, user) {
    const allowed = await super._preUpdate(changed, options, user);
    if (allowed === false) return false;

    if (!this.isEmbedded || user.isGM) return;

    delete changed.name;
    delete changed.img;

    if (changed.system) {
      for (const key of Object.keys(changed.system)) {
        if (!SystemItem.PLAYER_EDITABLE_SYSTEM_KEYS.includes(key)) delete changed.system[key];
      }
    }
  }
}
