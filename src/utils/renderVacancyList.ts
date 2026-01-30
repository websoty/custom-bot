import { Context } from "telegraf";
import { makeVacanciesKeyboard } from "../utils/pagination.js";
import type { VacancyLike } from "../types/bot.js";

type PageState = {
  all: number;
  units: number;
};

type RenderOptions = {
  title: string;
  items: VacancyLike[];
  pageKey: keyof PageState;
  itemPrefix?: string;
  prevCallback: string;
  nextCallback: string;
};

export function renderVacancyList(
  ctx: Context,
  pageState: PageState,
  options: RenderOptions,
  mode: "init" | "prev" | "next",
) {
  const {
    items,
    pageKey,
    itemPrefix = "vacancy_",
    prevCallback,
    nextCallback,
  } = options;

  if (mode === "init") {
    pageState[pageKey] = 0;
  }

  if (mode === "prev" && pageState[pageKey] > 0) {
    pageState[pageKey]--;
  }

  if (mode === "next") {
    pageState[pageKey]++;
  }

  const keyboard = makeVacanciesKeyboard(
    items,
    pageState[pageKey],
    {
      itemPrefix,
      prevCallback,
      nextCallback,
    }
  );

  if (mode === "init") {
    return ctx.editMessageText(options.title, {
      reply_markup: { inline_keyboard: keyboard },
    });
  }

  return ctx.editMessageReplyMarkup({
    inline_keyboard: keyboard,
  });
}
