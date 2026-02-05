const allowedTags = new Set<string>([
  "registered",
  "view_about",
  "view_units",
  "view_vacancies",
  "military",
  "civilian",
  "applied",
]);

export function isAllowedTag(tag: string) {
  return allowedTags.has(tag);
}

export function createTag(tag: string) {
  allowedTags.add(tag);
}

export function deleteTag(tag: string) {
  allowedTags.delete(tag);
}

export function getAllTags() {
  return Array.from(allowedTags);
}
