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
import { userRole } from "../store/userRole.js";

const userState = new Map<number, string>();

export function handleStart(ctx: Context) {
  const userId = ctx.from!.id;
  userState.set(userId, "start");

  console.log("[START]", userId);
  renderNode(ctx, botTree["start"]!);
}

export async function handleAction(ctx: Context) {
  if (!ctx.callbackQuery || !("data" in ctx.callbackQuery)) return;

  const userId = ctx.from!.id;
  const action = ctx.callbackQuery.data;

  const role = userRole.get(userId);
  const backTo =
    role === "military" ? "transfer_vacancies" : "civilian_vacancies";

  if (action === "join_military") {
    userRole.set(userId, "military");
  }

  if (action === "civilian_education") {
    userRole.set(userId, "civilian");
  }

  try {
    await ctx.answerCbQuery();
  } catch {}

  const pageState = userPage.get(userId) ?? { all: 0, units: 0 };
  userPage.set(userId, pageState);

  if (action === "no_action") return;

  //ALL VACANCIES

  if (action === "all_vacancies") {
    return renderVacancyList(
      ctx,
      pageState,
      {
        title: "Доступні вакансії:",
        items: vacancies,
        pageKey: "all",
        prevCallback: "vacancies_prev",
        nextCallback: "vacancies_next",
        backCallback: backTo,
      },
      "init",
    );
  }

  if (action === "vacancies_prev") {
    return renderVacancyList(
      ctx,
      pageState,
      {
        title: "Доступні вакансії:",
        items: vacancies,
        pageKey: "all",
        prevCallback: "vacancies_prev",
        nextCallback: "vacancies_next",
        backCallback: backTo,
      },
      "prev",
    );
  }

  if (action === "vacancies_next") {
    return renderVacancyList(
      ctx,
      pageState,
      {
        title: "Доступні вакансії:",
        items: vacancies,
        pageKey: "all",
        prevCallback: "vacancies_prev",
        nextCallback: "vacancies_next",
        backCallback: backTo,
      },
      "next",
    );
  }

  // UNIT VACANCIES

  if (action === "vacancies_units") {
    return renderVacancyList(
      ctx,
      pageState,
      {
        title: "Вакансії підрозділів:",
        items: unitVacancies,
        pageKey: "units",
        itemPrefix: "unit_vacancy_",
        prevCallback: "unit_vacancies_prev",
        nextCallback: "unit_vacancies_next",
        backCallback: backTo,
      },
      "init",
    );
  }

  if (action === "unit_vacancies_prev") {
    return renderVacancyList(
      ctx,
      pageState,
      {
        title: "Вакансії підрозділів:",
        items: unitVacancies,
        pageKey: "units",
        itemPrefix: "unit_vacancy_",
        prevCallback: "unit_vacancies_prev",
        nextCallback: "unit_vacancies_next",
        backCallback: backTo,
      },
      "prev",
    );
  }

  if (action === "unit_vacancies_next") {
    return renderVacancyList(
      ctx,
      pageState,
      {
        title: "Вакансії підрозділів:",
        items: unitVacancies,
        pageKey: "units",
        itemPrefix: "unit_vacancy_",
        prevCallback: "unit_vacancies_prev",
        nextCallback: "unit_vacancies_next",
        backCallback: backTo,
      },
      "next",
    );
  }
  // FALLBACK

  userState.set(userId, action);

  const nextNode = resolveNode(action, userId);
  if (!nextNode) {
    return ctx.editMessageText("❌ Сторінка недоступна");
  }

  return renderNode(ctx, nextNode);
}

export function resolveNode(nodeId: string, userId: number): BotNode | null {
  //  динамічна сторінка вакансії

  const role = userRole.get(userId);

  if (nodeId.startsWith("unit_vacancy_")) {
    const id = nodeId.replace("unit_vacancy_", "");
    const vacancy = unitVacancies.find((v) => v.id === id);

    if (!vacancy) return null;

    return {
      id: nodeId,
      text: `<b>${vacancy.title}</b>\nПідрозділ: уточнюється`,
      buttons: [
        {
          label: "📝 Подати заявку",
          goTo:
            role === "military" ? "military_form_status" : "civilian_form_age",
        },
        {
          label: "⬅️ Назад",
          goTo:
            role === "military" ? "transfer_vacancies" : "civilian_vacancies",
        },
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
        {
          label: "📝 Подати заявку",
          goTo:
            role === "military" ? "military_form_status" : "civilian_form_age",
        },
        {
          label: "⬅️ Назад до вакансій",
          goTo:
            role === "military" ? "transfer_vacancies" : "civilian_vacancies",
        },
      ],
    };
  }
  //  звичайні статичні ноди
  return botTree[nodeId] ?? null;
}
