import type { BotNode } from "../types/bot.js";
import { vacancies } from "../services/vacancies.js";
import { unitVacancies } from "../services/unitVacancies.js";

export const botTree: Record<string, BotNode> = {

  all_vacancies: {
    id: "all_vacancies",
    text: "Доступні вакансії:",
    buttons: vacancies
      .map(v => ({
        label: v.title,
        goTo: `vacancy_${v.id}`,
      }))
      .concat([{ label: "⬅️ Повернутись у головне меню", goTo: "start" }]),
  },

  vacancies_units: {
    id: "vacancies_units",
    text: "Вакансії підрозділів:",
    buttons: unitVacancies
      .map(v => ({
        label: v.title,
        goTo: `unit_vacancy_${v.id}`,
      }))
      .concat([{ label: "⬅️ Назад", goTo: "civilian_vacancies" }]),
  },

    // start, main screen
  start: {
    id: "start",
    text: "Ви у головному меню, оберіть потрібний вам розділ ⬇️",
    buttons: [
      { label: "🔈Про СБС", goTo: "about" },
      { label: "📑Доєднатись", goTo: "join" },
    ],
  },

  about: {
    id: "about",
    text: "Про СБС",
    buttons: [
      { label: "Підрозділи", goTo: "start" },
      { label: "Умови служби", goTo: "start" },
      { label: "Контракт 18-24", goTo: "start" },
      { label: "Інші поширенні питання", goTo: "start" },
      { label: "⬅️ Назад", goTo: "start" },
    ],
  },

  join: {
    id: "join",
    text:
      "УВАГА - на жаль, ми не розглядаємо підрозділи ДПСУ, Національної гвардії, СБУ, МВС для подальшої співпраці, " +
      "якщо Ви служите у вашому підрозділі менше ніж 8 місяців, ми також не зможемо розглянути Вашу анкету.",
    buttons: [
      { label: "🪖 Військовий", goTo: "join_military" },
      { label: "👤 Цивільний", goTo: "civilian_education" },
      { label: "⬅️ Назад", goTo: "start" },
    ],
  },

  // military
  join_military: {
    id: "join_military",
    text: "Оберіть, з чим Вам потрібна допомога",
    buttons: [
      { label: "СЗЧ", goTo: "awol" },
      { label: "Переведення", goTo: "transfer" },
      { label: "⬅️ Назад", goTo: "join" },
    ],
  },

  // awol - сзч
  awol: {
    id: "awol",
    text: "Вкажіть, чи є це першим випадком СЗЧ?",
    buttons: [
      { label: "Перший раз", goTo: "health" },
      { label: "Не перший раз", goTo: "health" },
      { label: "⬅️ Назад", goTo: "join_military" },
    ],
  },

  health: {
    id: "health",
    text: "Яке рішення військово-лікарської комісії (ВЛК) Вам встановлено?",
    buttons: [
      { label: "Придатний", goTo: "rank" },
      { label: "Обмежено придатний", goTo: "rank" },
      { label: "⬅️ Назад", goTo: "join_military" },
    ],
  },

  rank: {
    id: "rank",
    text: "Ваше військове звання",
    buttons: [
      { label: "Солдат/Сержант", goTo: "act_awol" },
      { label: "Офіцер", goTo: "act_awol" },
      { label: "⬅️ Назад", goTo: "health" },
    ],
  },

  act_awol: {
    id: "act_awol",
    text:
      "Дякуємо.\nВаш запит прийнято, з Вами звʼяжуться для подальших дій.",
    buttons: [{ label: "⬅️ Повернутись у головне меню", goTo: "start" }],
  },

  // mil. transfer - перевод
  transfer: {
    id: "transfer",
    text: "Місце проходження служби",
    buttons: [
      { label: "Служу в бойовій частині", goTo: "health_transfer" },
      { label: "Служу в тиловій частині", goTo: "health_transfer" },
      { label: "⬅️ Назад", goTo: "join_military" },
    ],
  },

  health_transfer: {
    id: "health_transfer",
    text: "Яке рішення військово-лікарської комісії (ВЛК) Вам встановлено?",
    buttons: [
      { label: "Придатний", goTo: "rank_transfer" },
      { label: "Обмежено придатний", goTo: "rank_transfer" },
      { label: "⬅️ Назад", goTo: "transfer" },
    ],
  },

  rank_transfer: {
    id: "rank_transfer",
    text: "Ваше військове звання",
    buttons: [
      { label: "Солдат/Сержант", goTo: "transfer_vacancies" },
      { label: "Офіцер", goTo: "transfer_vacancies" },
      { label: "⬅️ Назад", goTo: "health_transfer" },
    ],
  },

  transfer_vacancies: {
    id: "transfer_vacancies",
    buttons: [
      { label: "Вакансії підрозділів", goTo: "vacancies_units" },
      { label: "Усі вакансії", goTo: "all_vacancies" },
      { label: "⬅️ Назад", goTo: "rank_transfer" },
    ],
  },

  // civilian
  civilian_education: {
    id: "civilian_education",
    text: "Оберіть рівень військової підготовки",
    buttons: [
      { label: "Без військової кафедри", goTo: "civilian_vacancies" },
      { label: "Після військової кафедри", goTo: "civilian_vacancies" },
      { label: "⬅️ Назад", goTo: "join" },
    ],
  },

  civilian_vacancies: {
    id: "civilian_vacancies",
    buttons: [
      { label: "Вакансії підрозділів", goTo: "vacancies_units" },
      { label: "Усі вакансії", goTo: "all_vacancies" },
      { label: "⬅️ Назад", goTo: "civilian_education" },
    ],
  },
};
