import { Context } from "telegraf";
import { botTree } from "../tree/botTree.js";
import { renderNode } from "./render.js";
import { getVacancyById } from "../services/vacancies.js";
import type { BotNode } from "../types/bot.js";
import { makeVacanciesKeyboard } from "../utils/pagination.js";
import { userPage } from "../store/userState.js";

const userState = new Map<number, string>();

export function handleStart(ctx: Context) {
  const userId = ctx.from!.id;
  userState.set(userId, "start");

  console.log("[START]", userId);
  renderNode(ctx, botTree["start"]!);
}

export function handleAction(ctx: Context) {
  if (!ctx.callbackQuery) return;
  if (!("data" in ctx.callbackQuery)) return;

  ctx.answerCbQuery();

  const userId = ctx.from!.id;
  const nextNodeId = ctx.callbackQuery.data;
  if (nextNodeId === "no_action") return;
  if (nextNodeId === "all_vacancies") {
    userPage.set(userId, 0); // first page
    const keyboard = makeVacanciesKeyboard(0);
    return ctx.editMessageText("Доступні вакансії:", {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  }

  if (nextNodeId === "vacancies_prev" || nextNodeId === "vacancies_next") {
    let page = userPage.get(userId) ?? 0;
    if (nextNodeId === "vacancies_prev" && page > 0) page--;
    if (nextNodeId === "vacancies_next") page++;
    userPage.set(userId, page);

    const keyboard = makeVacanciesKeyboard(page);
    return ctx.editMessageReplyMarkup({ inline_keyboard: keyboard });
  }

  userState.set(userId, nextNodeId);

  const nextNode = resolveNode(nextNodeId);
  if (!nextNode) {
    return ctx.editMessageText("❌ Сторінка недоступна");
  }

  renderNode(ctx, nextNode);
}

export function resolveNode(nodeId: string): BotNode | null {
  //  динамічна сторінка вакансії
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
