// @ts-nocheck
import { Context } from 'telegraf';
import { UserDto } from '../../api/userDto';
import { readTokens }  from '../shared/tokensHelper';
import { saveTokenToCtx } from '../shared/utils/saveTokenToCtx';

export const start = async (ctx: Context) => {
  const { username } = new UserDto(ctx)
  const token = ctx.session?.user?.token;
  if (token) return ctx.sendMessage(`Привет ${username}`);
  const tokenJson = readTokens();
  const savedToken = tokenJson[username]
  if (!savedToken) {
    return ctx.scene.enter('new_sign_in')
  }

  saveTokenToCtx(ctx, savedToken)
  return start(ctx);
}