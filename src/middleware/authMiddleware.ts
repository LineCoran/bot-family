// @ts-nocheck
import { Context } from "telegraf";

export const authMiddleware = (ctx: Context, next: () => Promise<void>) => {
    if (!ctx.session?.user?.token) {
      ctx.reply('Пожалуйста, авторизуйтесь сначала');
      return ctx.scene.leave();
    }
    return next();
  };