// @ts-nocheck
import { Scenes } from 'telegraf';
import { UserDto } from '../../api/userDto';
import { PublicApi } from '../../api/publicApi/publicApi';
import { readTokens, writeTokens } from '../shared/tokensHelper';

const isExistUser = async (username: string) => {
  try {

    const { data: { id }} = await PublicApi.user.getIdByUsername({ username }) as AxiosResponse<{id: number}>
    return Boolean(id);

  } catch(error) {
    return false
  }
}

const enterPasswordScene = async (ctx) => {
  const { username } = new UserDto(ctx);
  const isExist = await isExistUser(username);
  if (isExist) {
    ctx.reply('Введи пароль:');
    return ctx.wizard.next();
  }
  return ctx.scene.enter('new_sign_up')
}

const signInScene = async (ctx) => {
  const password = ctx.message.text;
  if (!password.trim() || password.length < 3) {
    ctx.reply('Повтори попытку');
    return;
  }

  const user = new UserDto(ctx)

  try {

    const { data: { token }} = await PublicApi.user.signIn({ password, username: user.username })
    const tokens = readTokens();
    saveTokenToCtx(ctx, token)
    writeTokens({...tokens, [user.username]: token})
    
  } catch (error) {
    return ctx.reply(`Неверный пароль! ${error.message}` )
  }

  ctx.reply(`Добро пожаловать ${user.username}`);

  return ctx.scene.leave()
}

const steps = [
  enterPasswordScene,
  signInScene
]

export const signInScene = new Scenes.WizardScene('new_sign_in', ...steps);