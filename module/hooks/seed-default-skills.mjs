import { DEFAULT_SKILLS } from "../data/default-skills.mjs";

/**
 * À la création d'un Actor de type "character", peuple automatiquement la
 * liste de compétences par défaut (rang 0) - si l'acteur n'a pas déjà
 * d'Items (évite de dupliquer sur un import/duplicate qui aurait déjà ses
 * propres compétences).
 */
export function registerSkillSeeding() {
  Hooks.on("createActor", async (actor, options, userId) => {
    // Ne laisse qu'un seul client (celui à l'origine de la création) faire
    // le travail, sinon chaque client connecté tenterait de peupler en double.
    if (userId !== game.user.id) return;
    if (actor.type !== "character") return;
    if (actor.items.size > 0) return;

    const itemsData = DEFAULT_SKILLS.map((skill) => ({
      name: skill.name, // pas de sous-type collé au nom : regroupement fait côté fiche
      type: "skill",
      system: {
        category: skill.category,
        trait: skill.trait,
        subtype: skill.subtype ?? "",
        rank: 0,
        isSchoolSkill: false,
        specializations: skill.specializations ?? "",
        masteryBonuses: skill.masteryBonuses ?? [],
        description: skill.description ?? ""
      }
    }));

    await actor.createEmbeddedDocuments("Item", itemsData);
  });
}
