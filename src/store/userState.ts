// Зберігаємо поточну сторінку пагінації для кожного користувача

export const userPage = new Map<number, {
  all: number;
  units: number;
}>();

