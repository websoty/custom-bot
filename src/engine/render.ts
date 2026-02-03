import { Context } from "telegraf";
import type { BotNode } from "../types/bot.js";
import type { InlineKeyboardButton } from "telegraf/types";
import { resolveAssetPath } from "../utils/media.js";

export function renderNode(ctx: Context, node: BotNode) {
  console.log("[RENDER]", node.id);

  const keyboard = {
    inline_keyboard:
      node.buttons?.map((b): InlineKeyboardButton[] => {
        if (b.url) {
          return [{ text: b.label, url: b.url }];
        }
        return [{ text: b.label, callback_data: b.goTo! }];
      }) ?? [],
  };

  if (node.image) {
    const imagePath = resolveAssetPath(node.image);
    const isGif = imagePath.endsWith(".gif");

    if (isGif) {
      return ctx.replyWithAnimation(
        { source: imagePath },
        {
          caption: node.text ?? "",
          parse_mode: "HTML",
          reply_markup: keyboard,
        },
      );
    }

    return ctx.replyWithPhoto(
      { source: imagePath },
      {
        caption: node.text ?? "",
        parse_mode: "HTML",
        reply_markup: keyboard,
      },
    );
  }

  if (ctx.callbackQuery?.message) {   
     // є текст  міняємо текст + кнопки
    if (node.text) {
      return ctx.editMessageText(node.text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }

    return ctx.editMessageReplyMarkup(keyboard);
  }

  // перший рендер
  return ctx.reply(node.text ?? " ", {
    reply_markup: keyboard,
  });
}
