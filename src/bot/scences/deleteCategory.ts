// @ts-nocheck
import { Scenes } from 'telegraf';
import { UserDto } from '../../backend/api/models/userDto';
// import { CategoriesController } from '../../backend/api/controllers/categories';
// import { ExpenseController, ICreateExpenseParams } from '../../backend/api/controllers/expense';

export const deleteCategory = new Scenes.WizardScene(
  'delete_category_scene',
  async (ctx) => {
    const user = new UserDto(ctx);
    const curCategories = []

    if (!curCategories.length) {
      ctx.reply('У вас нету категорий');
      ctx.scene.leave()
      return
    }

    const inline_keyboard = [];

    curCategories.forEach(category => {
      inline_keyboard.push([{
        text: category.name,
        callback_data: category.id,
      }])
    })

    ctx.reply('Выбери категорию:', { reply_markup: JSON.stringify({ inline_keyboard }) })

    return ctx.wizard.next();
  },
  async (ctx) => {
    const categoryId = ctx.callbackQuery?.data;
    if (isNaN(Number(categoryId))) {
      ctx.reply('Что-то пошло не так');
      ctx.scene.leave()
      return;
    }

    try {
      // const res = await CategoriesController.deleteCategory(categoryId);
      // ctx.reply(`Категория ${res.rows[0].name} успешно удалена!`);
      ctx.scene.leave()
    } catch (e) {
      ctx.reply('Что-то пошло не так', e.message);
      ctx.scene.leave()
    }
  }
);