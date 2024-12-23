import { Telegraf } from 'telegraf';

import { about } from './commands';
import { greeting } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import { ISession, SessionService } from './api/session';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.telegram.setMyCommands([
  {
    command: '/start',
    description: 'start'
  },
  {
    command: '/create_family',
    description: 'Создать учёт'
  },
])

bot.command('start', (ctx) => {
  ctx.sendMessage('hello');
});

bot.command('create_family', async (ctx) => {
  const msg = ctx.update.message
  const { username, last_name, first_name } = msg.from

  if (!username) {
    ctx.sendMessage('Не удалось определить ваш никнейм');
    return;
  }

  const newSession: ISession = { username, last_name: last_name || '', first_name, chat_id: msg.chat.id }

  try {

    await SessionService.saveUserSession(newSession);
    return ctx.sendMessage(`Сессия ${newSession.chat_id} успешно создана!`)
  } catch(error) {
    return ctx.sendMessage(`Ошибка ${error}`)
  }
})
bot.on('message', greeting());
bot.on('callback_query', (ctx) => {

  console.log(ctx.callbackQuery);

})

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
