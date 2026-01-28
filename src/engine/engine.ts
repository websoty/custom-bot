import { Context } from "telegraf";
import { botTree } from "../tree/botTree.js";
import { renderNode } from "./render.js";

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

  userState.set(userId, nextNodeId);

  const nextNode = botTree[nextNodeId];
  if (!nextNode) {
    return ctx.reply("Нода не знайдена");
  }

  renderNode(ctx, nextNode);
}
