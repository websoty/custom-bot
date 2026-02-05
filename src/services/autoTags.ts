import { addTag } from "../services/tagService.js";

export function addAutoTags(userId: number, nodeId: string) {
  const map: Record<string, string> = {
    about: "view_about",
    units: "view_units",
    units_list: "view_units",
    all_vacancies: "view_vacancies",
    join_military: "military",
    civilian_education: "civilian",
  };

  const tag = map[nodeId];
  if (tag) {
    addTag(userId, tag);
  }
}
