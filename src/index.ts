import "dotenv/config";
import { Telegraf } from "telegraf";
import { handleStart, handleAction } from "./engine/engine.js"

const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(handleStart);
bot.on("callback_query", handleAction);


bot.launch();
console.log("Bot started");
