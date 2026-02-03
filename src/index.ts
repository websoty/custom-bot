import "dotenv/config";
import { Telegraf } from "telegraf";
import { handleStart, handleAction } from "./engine/engine.js"
import { botTree } from "./tree/botTree.js";
import { renderNode } from "./engine/render.js";


const bot = new Telegraf(process.env.BOT_TOKEN!);

bot.start(handleStart);
bot.on("callback_query", handleAction);

bot.command("about", (ctx) => {
  renderNode(ctx, botTree["about"]!);
});

bot.command("join", (ctx) => {
  renderNode(ctx, botTree["join"]!);
});

bot.command("vacancies", (ctx) => {
  renderNode(ctx, botTree["all_vacancies"]!);
});

bot.command("units", (ctx) => {
  renderNode(ctx, botTree["units"]!);
});

bot.command("help", (ctx) => {
  renderNode(ctx, botTree["contact_rc"]!);
});


bot.launch();
console.log("Bot started");
