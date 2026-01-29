import { Context } from "telegraf";
import type { BotNode } from "../types/bot.js";

export function renderNode(ctx: Context, node: BotNode) {
  console.log("[RENDER]", node.id);

  const keyboard = {
    inline_keyboard:
      node.buttons?.map((b) => [{ text: b.label, callback_data: b.goTo }]) ??
      [],
  };

  // якщо це клік по кнопці  редаг існуюче повідомлення
  if (ctx.callbackQuery?.message) {
    // є текст  міняємо текст + кнопки
    if (node.text) {
      return ctx.editMessageText(node.text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }

    // нема тексту  міняємо онлі кнопки
    return ctx.editMessageReplyMarkup(keyboard);
  }

  // перший рендер
  return ctx.reply(node.text ?? " ", {
    reply_markup: keyboard,
  });
}
