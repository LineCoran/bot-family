// @ts-nocheck
import { Scenes } from 'telegraf';
import { UserDto } from '../../api/userDto';
import { PublicApi } from '../../api/publicApi/publicApi';

const enterPasswordScene = (ctx) => {
  ctx.reply('Придумайте пароль:');
  const user = new UserDto(ctx);
  ctx.wizard.state.signUp = { username: user.username };
  return ctx.wizard.next();
}

const signUpScene = async (ctx) => {
  const password = ctx.message.text;
  if (!password.trim() || password.length < 3) {
    ctx.reply('Пожалуйста, введи более сложный пароль');
    return;
  }

  const user = new UserDto(ctx)

  try {

    const data = await PublicApi.user.signUp({ password, username: user.username })
    
  } catch (error) {
    return ctx.reply('Что-то пошло не так :(\nПопробуйте еще раз. Error: ', error.message)
  }

  ctx.reply('Все прошло успешно!');

  return ctx.wizard.next()
}

const steps = [
  enterPasswordScene,
  signUpScene
]

export const signUpScene = new Scenes.WizardScene('new_sign_up', ...steps);