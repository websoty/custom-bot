export type User = {
  telegramId: number;
  username: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  utmSource: string | undefined;
  utmCampaign: string | undefined;
  createdAt: Date;
};

const users = new Map<number, User>();

export function getUserByTelegramId(telegramId: number): User | undefined {
  return users.get(telegramId);
}

export function createUser(user: User): User {
  users.set(user.telegramId, user);
  return user;
}

export function getAllUsers() {
  return Array.from(users.values());
}
