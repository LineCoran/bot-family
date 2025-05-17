// @ts-nocheck
import { Scenes } from 'telegraf';
// import { UserDto } from '../../backend/api/models/userDto';
// import { CategoriesController } from '../../backend/api/controllers/categories';
// import { ExpenseController, ICreateExpenseParams } from '../../backend/api/controllers/expense';
import { dayjs } from '../../shared/utils/date-utils';
import axios from 'axios';
import { ApiRequests } from '../../api/api';
import { UserDto } from '../../backend/api/models/userDto';


const MIN_CATEGORY_NAME_LENGTH = 3;
const DATE_FORMAT_FOR_USER = 'ДД.ММ.ГГГГ';

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api',
// })

// const createExpenseRequest = async (data) => {
//   const response = await api.post('/posts', data);
//   console.log(response)
// }

const sendButtons = (inline_keyboard) => {
  return {
    reply_markup: JSON.stringify({ inline_keyboard })
  }
}

const isValidNumber = (value: unknown) => !isNaN(Number(value))

const enterSumStep = (ctx) => {
  ctx.reply('Сумма:');
  ctx.wizard.state.expense = {};
  return ctx.wizard.next();
}

const enterCategoryStep = async (ctx) => {
  const message = ctx.message.text;
  if (!isValidNumber(message)) {
    ctx.reply('Пожалуйста, введи корректное число');
    return;
  }
  const user = new UserDto(ctx);
  ctx.wizard.state.expense.amount = message;

  const curCategories = [];
  const inline_keyboard = [...curCategories].map(category => ([{ text: category.name, callback_data: category.id }]))


  if (inline_keyboard.length > 0) {
    ctx.reply(`Выбери категорию или введи новую (минимальное кол-во символов - ${MIN_CATEGORY_NAME_LENGTH}):`, sendButtons(inline_keyboard) )
  } else  {
    ctx.reply(`Выбери название категории:`, inline_keyboard);
  }

  return ctx.wizard.next()
}

const enterDateStep = async (ctx) => {

  const categoryId = ctx.callbackQuery?.data;
  const user = new UserDto(ctx);


  if (!categoryId) {
    const message = ctx.message.text;
    if (!message || message.length < MIN_CATEGORY_NAME_LENGTH) {
      ctx.reply(`Проверь, чтобы название категории было не меньше ${MIN_CATEGORY_NAME_LENGTH} символов`);
      return;
    }
    // const category = await CategoriesController.createCategory(user, message);
    ctx.wizard.state.expense.category = 3;
  } else {
    ctx.wizard.state.expense.category = categoryId
  }

  const inline_keyboard = [[{ text: 'Трата была сегодня', callback_data: 'now' }]];
  ctx.reply(`Введи дату в формате ${DATE_FORMAT_FOR_USER} или нажми на кнопку "Сегодня":`, sendButtons(inline_keyboard));

  return ctx.wizard.next()
}

const createExpenseStep = async (ctx) => {
  const user = new UserDto(ctx);

  const isToday = ctx.callbackQuery?.data === 'now';

  console.log("isToday", isToday)

  const saveExpense = async () => {
    try {

      const data = {
        chat_id: user.id,
        category_id: ctx.wizard.state.expense.category,
        amount: Number(ctx.wizard.state.expense.amount),
        description: 'hello',
      }

      const test = await ApiRequests.expense.createOne({
        amount: data.amount,
        category_id: data.category_id,
        description: data.description,
      })

      console.log(test)
      // await ExpenseController.createExpense(user, { categoryId: data.category_id, amount: data.amount, description: data.description})
      // await createExpenseRequest(data);
      ctx.reply(`Сумма: ${data.amount} успешно внесена`);
    } catch (e) {
      ctx.reply(`Что-то пошло не так. Попробуй позже ${e.message}`);
      throw e
    }

    ctx.scene.leave()
  }

  if (isToday) {
    ctx.wizard.state.date = new Date();
    saveExpense()
    // return ctx.wizard.next()
  } else {
    const message = ctx.message.text;

    const isValidDate = dayjs(message, 'DD.MM.YYYY').isValid();
    if (message.length !== 10 && !isValidDate) {
      return ctx.reply(`Вы ввели неправильный формат даты (${DATE_FORMAT_FOR_USER}) Повторите попытку`)
    }
    saveExpense()
  }
}

const steps = [
  enterSumStep,
  enterCategoryStep,
  enterDateStep,
  createExpenseStep,
]

export const newExpense = new Scenes.WizardScene('new_expense_scene', ...steps);