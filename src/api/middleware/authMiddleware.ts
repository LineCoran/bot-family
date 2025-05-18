// @ts-nocheck
import { start } from '../../bot/commands/start';
import { Context } from "telegraf";
import { readTokens } from '../../bot/shared/tokensHelper';
import { UserDto } from '../userDto';
import { saveTokenToCtx } from '../../bot/shared/utils/saveTokenToCtx';

export const authMiddleware = (ctx: Context, next: () => Promise<void>) => {
    if (!ctx.session?.user?.token) {
      const { username } = new UserDto(ctx)
      const tokenJson = readTokens();
      const savedToken = tokenJson[username]
      if (!savedToken) return start(ctx);
      saveTokenToCtx(ctx, savedToken)
      return next()
    }
    return next();
  };