// @ts-nocheck
import { Scenes } from 'telegraf';
import { UserDto } from '../api/models/userDto';
import { CategoriesController } from '../api/controllers/categories';
import { ExpenseController, ICreateExpenseParams } from '../api/controllers/expense';

export const newExpense = new Scenes.WizardScene(
  'new_expense_scene',
  (ctx) => {
    ctx.reply('Сумма:');
    ctx.wizard.state.expense = {
      value: 0,
      subject: null,
    };
    return ctx.wizard.next();
  },
  async (ctx) => {
    const message = ctx.message.text;
    if (isNaN(Number(message))) {
      ctx.reply('Пожалуйста, введи корректное число');
      return;
    }
    ctx.wizard.state.expense.amount = message;
    const user = new UserDto(ctx);
    const inline_keyboard = [];

    const curCategories = await CategoriesController.getUserCategories(user);

    curCategories.forEach(category => {
      inline_keyboard.push([{
        text: category.name,
        callback_data: category.id,
      }])
    })

    if (inline_keyboard.length > 0) {
      ctx.reply('Выбери категорию:', { reply_markup: JSON.stringify({ inline_keyboard }) })
    } else  {
      ctx.reply(`Выбери название категории:`, );
    }
    return ctx.wizard.next()
  },
  async (ctx) => {
    const categoryId = ctx.callbackQuery?.data;
    const user = new UserDto(ctx);

    if (!categoryId) {
      const message = ctx.message.text;
      if (!message || message.length < 3) {
        ctx.reply('Проверь, чтобы название категории было больше 2 символов');
        return;
      }


      const category = await CategoriesController.createCategory(user, message);
      ctx.wizard.state.expense.category = category.rows[0].id;
    }

    try {
      const expense: ICreateExpenseParams = {
        categoryId: categoryId || ctx.wizard.state.expense.category,
        amount: ctx.wizard.state.expense.amount
      }
      const res = await ExpenseController.createExpense(user, expense);
      ctx.reply(`Все прошло отлично!. Сумма: ${JSON.stringify(res)}`);
    } catch (e) {
      throw e
      ctx.reply('Что-то пошло не так. Попробуй позже');
    }

    ctx.scene.leave()
  }
);