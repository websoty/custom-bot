import { getUserByTelegramId } from "../store/userStore.js";

export function addTag(userId: number, tag: string) {
  const user = getUserByTelegramId(userId);
  if (!user) return;

  user.tags.add(tag);
}

export function removeTag(userId: number, tag: string) {
  const user = getUserByTelegramId(userId);
  if (!user) return;

  user.tags.delete(tag);
}

export function hasTag(userId: number, tag: string): boolean {
  const user = getUserByTelegramId(userId);
  if (!user) return false;

  return user.tags.has(tag);
}

export function getUserTags(userId: number): string[] {
  const user = getUserByTelegramId(userId);
  if (!user) return [];

  return Array.from(user.tags);
}
