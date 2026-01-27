import "dotenv/config";

import { Telegraf } from "telegraf";

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start((ctx) => {
  ctx.reply("Бот живий ✅", {
    // /inline-кнопка під повідомленням
    reply_markup: {
      inline_keyboard: [
        [{ text: "Натисни мене", callback_data: "TEST" }] //що бот отримає, коли кнопку натиснуть
      ]
    }
  });
});

//bot слухає натискання кнопок
bot.on("text", (ctx) => {
  ctx.reply("Я тебе бачу 👀");
});


bot.launch();
console.log("Bot started");
