// @ts-nocheck

import { Context, Telegraf, Scenes, session, } from 'telegraf';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './bot/core';
import { errorMiddleware } from './middleware/errorMiddleware';
import { start } from './bot/commands/start';
import { scences } from './bot/scences';
import { getExpenses } from './bot/commands/getExpenses';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.telegram.setMyCommands([
  {
    command: '/start',
    description: 'Старт'
  },
  {
    command: '/new_expense',
    description: 'Внести расход'
  },
  {
    command: '/get_expenses',
    description: 'Получить расходы'
  },
  {
    command: '/delete_category',
    description: 'Удалить категорию'
  }
])


const stage = new Scenes.Stage(scences);
bot.use(session());
bot.use(stage.middleware());
bot.catch(errorMiddleware)

bot.command('start', start);
bot.command('new_expense', (ctx: Context) => ctx.scene.enter('new_expense_scene'));
bot.command('delete_category', (ctx: Context) => ctx.scene.enter('delete_category_scene'));
bot.command('get_expenses', getExpenses);


bot.on('message', (context: Context) => {});
bot.on('callback_query', (ctx) => {})

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
