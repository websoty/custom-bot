import { vacancies } from "../services/vacancies.js";

const PAGE_SIZE = 10;

/**
 * Створює клавіатуру для сторінки вакансій
 * @param page номер сторінки (0 = перша сторінка)
 * @returns масив рядків кнопок для Telegram
 */

export function makeVacanciesKeyboard(page: number) {
  const startIndex = page * PAGE_SIZE;
  const pageVacancies = vacancies.slice(startIndex, startIndex + PAGE_SIZE);

  const leftCol = pageVacancies.slice(0, 5);
  const rightCol = pageVacancies.slice(5, 10);

  const rows = Array.from({ length: 5 }, (_, i) => {
    const row: { text: string; callback_data: string }[] = [];
    const left = leftCol[i];
    const right = rightCol[i];

    if (left)
      row.push({ text: left.title, callback_data: `vacancy_${left.id}` });
    if (right)
      row.push({ text: right.title, callback_data: `vacancy_${right.id}` });
    return row;
  });

  const buttons = rows.filter((row) => row.length > 0);

  const totalPages = Math.ceil(vacancies.length / PAGE_SIZE);

  buttons.push([
    {
      text: page > 0 ? "⬅️ Попередня" : "⬅️ Назад",
      callback_data: page > 0 ? "vacancies_prev" : "no_action"
    },
    { text: `📄${page + 1}/${totalPages}`, callback_data: "no_action" },
    {
      text: page + 1 < totalPages ? "Наступна ➡️" : " ",
      callback_data: "vacancies_next",
    },
  ]);

  return buttons;
}
