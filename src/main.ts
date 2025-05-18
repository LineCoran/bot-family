// @ts-nocheck
import { Context, Telegraf, Scenes, session, } from 'telegraf';
import { development } from './bot/core';
import { errorMiddleware } from './api/middleware/errorMiddleware';
import { start } from './bot/commands/start';
import { scences } from './bot/scences';
import { getExpenses } from './bot/commands/getExpenses';
import { authMiddleware } from './api/middleware/authMiddleware';

const tgToken = process.env.FAMILY_BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(tgToken);

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

const stage = new Scenes.Stage(
  scences.map(scene => {
    if (['new_expense_scene', 'delete_category_scene'].includes(scene.id)) scene.use(authMiddleware);
    return scene;
  })
);


// const stage = new Scenes.Stage(scences);
bot.use(session());
bot.use(stage.middleware());
bot.catch(errorMiddleware)

bot.command('start', start);
bot.command('new_expense', (ctx: Context) => {
  return ctx.scene.enter('new_expense_scene')
});
bot.command('get_expenses', getExpenses);

ENVIRONMENT !== 'production' && development(bot);
