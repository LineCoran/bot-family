// @ts-nocheck
import { Context } from 'telegraf';
import { UserDto } from '../../api/userDto';
import { PublicApi } from '../../api/publicApi/publicApi';
import { AxiosResponse } from 'axios';

export const start = async (ctx: Context) => {
  const { username } = new UserDto(ctx)
  const token = ctx.session?.user?.token;
  if (token) {
    return ctx.sendMessage(`Привет ${username}`);
  }
  ctx.scene.enter('new_sign_in')
}