/**
 * Sentinelle utilisée comme `ammoId` pour désigner la flèche invoquée d'un
 * arc enchanté (voir WeaponDataModel.conjuresAmmo) au lieu d'un vrai Item
 * Munition - ne consomme aucun stock, toujours disponible. Partagée entre
 * CharacterSheet#promptRangedAttack (construction de la liste déroulante) et
 * SystemActor#rollAttack (résolution du DR) pour ne pas risquer une faute de
 * frappe entre les deux occurrences si la valeur change un jour.
 */
export const CONJURED_AMMO_ID = "conjured";
