import { vacancies } from "../services/vacancies.js";
import type { VacancyLike } from "../types/bot.js";
const PAGE_SIZE = 10;

/**
 * Створює клавіатуру для сторінки вакансій
 * @param page номер сторінки (0 = перша сторінка)
 * @returns масив рядків кнопок для Telegram
 */

export function makeVacanciesKeyboard(
  items: VacancyLike[],
  page: number,
  options?: {
    backCallback?: string;
    prevCallback?: string;
    nextCallback?: string;
    itemPrefix?: string;
  },
) {
  const startIndex = page * PAGE_SIZE;
  const pageVacancies = items.slice(startIndex, startIndex + PAGE_SIZE);

  const leftCol = pageVacancies.slice(0, 5);
  const rightCol = pageVacancies.slice(5, 10);

  const rows = Array.from({ length: 5 }, (_, i) => {
    const row: { text: string; callback_data?: string; url?: string }[] = [];
    const left = leftCol[i];
    const right = rightCol[i];

    if (left) {
      row.push(
        left.url
          ? { text: left.title, url: left.url }
          : {
              text: left.title,
              callback_data: `${options?.itemPrefix ?? "vacancy_"}${left.id}`,
            },
      );
    }

    if (right) {
      row.push(
        right.url
          ? { text: right.title, url: right.url }
          : {
              text: right.title,
              callback_data: `${options?.itemPrefix ?? "vacancy_"}${right.id}`,
            },
      );
    }

    return row;
  }).filter((row) => row.length > 0);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  rows.push([
    {
      text: page > 0 ? "⬅️ Попередня" : "⬅️ Назад",
      callback_data:
        page > 0
          ? (options?.prevCallback ?? "vacancies_prev")
          : (options?.backCallback ?? "civilian_vacancies"),
    },
    { text: `📄${page + 1}/${totalPages}`, callback_data: "no_action" },
    {
      text: page + 1 < totalPages ? "Наступна ➡️" : " ",
      callback_data: options?.nextCallback ?? "vacancies_next",
    },
  ]);

  rows.push([
  {
    text: "🏠 Повернутись у головне меню",
    callback_data: "start",
  },
]);


  return rows;
}
