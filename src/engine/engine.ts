import { Context } from "telegraf";
import { botTree } from "../tree/botTree.js";
import { renderNode } from "./render.js";
import { getVacancyById } from "../services/vacancies.js";
import type { BotNode } from "../types/bot.js";
import { makeVacanciesKeyboard } from "../utils/pagination.js";
import { userPage } from "../store/userState.js";
import { vacancies } from "../services/vacancies.js";
import { unitVacancies } from "../services/unitVacancies.js";
import { renderVacancyList } from "../utils/renderVacancyList.js";

const userState = new Map<number, string>();

export function handleStart(ctx: Context) {
  const userId = ctx.from!.id;
  userState.set(userId, "start");

  console.log("[START]", userId);
  renderNode(ctx, botTree["start"]!);
}

export async function handleAction(ctx: Context) {
  if (!ctx.callbackQuery || !("data" in ctx.callbackQuery)) return;

  try {
    await ctx.answerCbQuery();
  } catch {}

  const userId = ctx.from!.id;
  const pageState = userPage.get(userId) ?? { all: 0, units: 0 };
  userPage.set(userId, pageState);

  const action = ctx.callbackQuery.data;
  if (action === "no_action") return;

  // ===== ALL VACANCIES =====

  if (action === "all_vacancies") {
    return renderVacancyList(ctx, pageState, {
      title: "Доступні вакансії:",
      items: vacancies,
      pageKey: "all",
      prevCallback: "vacancies_prev",
      nextCallback: "vacancies_next",
    }, "init");
  }

  if (action === "vacancies_prev") {
    return renderVacancyList(ctx, pageState, {
      title: "Доступні вакансії:",
      items: vacancies,
      pageKey: "all",
      prevCallback: "vacancies_prev",
      nextCallback: "vacancies_next",
    }, "prev");
  }

  if (action === "vacancies_next") {
    return renderVacancyList(ctx, pageState, {
      title: "Доступні вакансії:",
      items: vacancies,
      pageKey: "all",
      prevCallback: "vacancies_prev",
      nextCallback: "vacancies_next",
    }, "next");
  }

  // ===== UNIT VACANCIES =====

  if (action === "vacancies_units") {
    return renderVacancyList(ctx, pageState, {
      title: "Вакансії підрозділів:",
      items: unitVacancies,
      pageKey: "units",
      itemPrefix: "unit_vacancy_",
      prevCallback: "unit_vacancies_prev",
      nextCallback: "unit_vacancies_next",
    }, "init");
  }

  if (action === "unit_vacancies_prev") {
    return renderVacancyList(ctx, pageState, {
      title: "Вакансії підрозділів:",
      items: unitVacancies,
      pageKey: "units",
      itemPrefix: "unit_vacancy_",
      prevCallback: "unit_vacancies_prev",
      nextCallback: "unit_vacancies_next",
    }, "prev");
  }

  if (action === "unit_vacancies_next") {
    return renderVacancyList(ctx, pageState, {
      title: "Вакансії підрозділів:",
      items: unitVacancies,
      pageKey: "units",
      itemPrefix: "unit_vacancy_",
      prevCallback: "unit_vacancies_prev",
      nextCallback: "unit_vacancies_next",
    }, "next");
  }

  // ===== FALLBACK =====

  userState.set(userId, action);

  const nextNode = resolveNode(action);
  if (!nextNode) {
    return ctx.editMessageText("❌ Сторінка недоступна");
  }

  return renderNode(ctx, nextNode);
}


export function resolveNode(nodeId: string): BotNode | null {
  //  динамічна сторінка вакансії

  if (nodeId.startsWith("unit_vacancy_")) {
    const id = nodeId.replace("unit_vacancy_", "");
    const vacancy = unitVacancies.find((v) => v.id === id);

    if (!vacancy) return null;

    return {
      id: nodeId,
      text: `<b>${vacancy.title}</b>\nПідрозділ: уточнюється`,
      buttons: [
        { label: "📝 Подати заявку", goTo: "join" },
        { label: "⬅️ Назад", goTo: "vacancies_units" },
      ],
    };
  }

  if (nodeId.startsWith("vacancy_")) {
    const vacancyId = nodeId.replace("vacancy_", "");
    const vacancy = getVacancyById(vacancyId);

    if (!vacancy) return null;

    return {
      id: nodeId,
      text: `
<b>Посада: ${vacancy.title}</b>
Підрозділ: ${vacancy.unit}
${vacancy.short}
`,
      buttons: [
        { label: "📝 Подати заявку", goTo: "join" },
        { label: "⬅️ Назад до вакансій", goTo: "all_vacancies" },
      ],
    };
  }
  //  звичайні статичні ноди
  return botTree[nodeId] ?? null;
}
