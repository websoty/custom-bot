import { Context } from "telegraf";
import {
  getUserByTelegramId,
  createUser,
  type User,
} from "../store/userStore.js";

function parseUtm(payload?: string) {
  if (!payload) return {};

  const [utmSource, utmCampaign] = payload.split("__");

  return {
    utmSource,
    utmCampaign,
  };
}

export function registerUserIfNotExists(
  from: Context["from"],
  startPayload?: string,
): User | null {
  if (!from) return null;

  console.log("[USER]", from.id, from.username ?? "no_username");
  const utm = parseUtm(startPayload);

  const existingUser = getUserByTelegramId(from.id);

  if (existingUser) {
    return existingUser;
  }

  const newUser: User = {
    telegramId: from.id,
    username: from.username,
    firstName: from.first_name,
    lastName: from.last_name,
    utmSource: utm.utmSource,
    utmCampaign: utm.utmCampaign,
    tags: new Set(["registered"]),
    createdAt: new Date(),
  };

  return createUser(newUser);
}
