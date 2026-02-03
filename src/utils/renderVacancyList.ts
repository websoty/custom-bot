import { Context } from "telegraf";
import { makeVacanciesKeyboard } from "../utils/pagination.js";
import type { VacancyLike } from "../types/bot.js";
import type { InlineKeyboardButton } from "telegraf/types";

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
  backCallback: string;
  forceReply?: boolean;
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
    backCallback,
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

  const keyboard = makeVacanciesKeyboard(items, pageState[pageKey], {
    itemPrefix,
    prevCallback,
    nextCallback,
    backCallback,
  });

if (mode === "init") {
  if (options.forceReply) {
    return ctx.reply(options.title, {
      reply_markup: { inline_keyboard: keyboard as InlineKeyboardButton[][],},
    });
  }

  return ctx.editMessageText(options.title, {
    reply_markup: { inline_keyboard: keyboard as InlineKeyboardButton[][],},
  });
}


  return ctx.editMessageReplyMarkup({
    inline_keyboard: keyboard as InlineKeyboardButton[][],
  });
}
