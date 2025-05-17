// @ts-nocheck
import { Scenes } from 'telegraf';
import { dayjs } from '../../shared/utils/date-utils';
import { AuthApi } from '../../api/authApi/authApi';
import { UserDto } from '../../api/userDto';

const MIN_CATEGORY_NAME_LENGTH = 3;
const DATE_FORMAT_FOR_USER = 'DD.MM.YYYY';
const DATE_FORMAT_FOR_USER_DISPLAY = 'ДД.ММ.ГГГГ';

interface ExpenseState {
  amount?: string;
  category?: string;
  date?: Date;
}

interface WizardContext extends Scenes.WizardContext {
  wizard: {
    state: ExpenseState;
    next: () => void;
  };
}

const sendButtons = (inline_keyboard: any[][]) => ({
  reply_markup: JSON.stringify({ inline_keyboard })
});

const isValidNumber = (value: unknown): boolean => !isNaN(Number(value));

const handleApiError = (ctx: WizardContext, error: any, defaultMessage: string) => {
  console.error('API Error:', error);
  const errorMessage = error.response?.data?.message || error.message || defaultMessage;
  ctx.reply(`Ошибка: ${errorMessage}`);
  return ctx.scene.leave();
};

const enterSumStep = (ctx: WizardContext) => {
  try {
    ctx.reply('Введите сумму:');
    ctx.wizard.state.expense = {};
    return ctx.wizard.next();
  } catch (error) {
    console.error('Error in enterSumStep:', error);
    ctx.reply('Произошла ошибка при инициализации. Пожалуйста, попробуйте позже.');
    return ctx.scene.leave();
  }
};

const enterCategoryStep = async (ctx: WizardContext) => {
  try {
    const message = ctx.message?.text;
    if (!message || !isValidNumber(message)) {
      ctx.reply('Пожалуйста, введите корректное число');
      return;
    }

    const user = new UserDto(ctx);
    const authApi = new AuthApi(ctx);

    let userCategoryList = [];
    try {
      const response = await authApi.CategoryService.getAll();
      userCategoryList = [...response.data.data];
    } catch (error) {
      return handleApiError(ctx, error, 'Не удалось получить список категорий');
    }

    ctx.wizard.state.expense = ctx.wizard.state.expense || {};
    ctx.wizard.state.expense.amount = message;

    const inline_keyboard = userCategoryList.map(category => 
      [{ text: category.category_name, callback_data: category.id }]
    );

    const messageText = inline_keyboard.length > 0
      ? `Выберите категорию или введите новую (минимум ${MIN_CATEGORY_NAME_LENGTH} символов):`
      : 'Введите название категории:';

    ctx.reply(messageText, sendButtons(inline_keyboard));
    return ctx.wizard.next();
  } catch (error) {
    console.error('Error in enterCategoryStep:', error);
    ctx.reply('Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.');
    return ctx.scene.leave();
  }
};

const enterDateStep = async (ctx: WizardContext) => {
  try {
    const existCategoryId = ctx.callbackQuery?.data;
    const user = new UserDto(ctx);
    const authApi = new AuthApi(ctx);

    if (!existCategoryId) {
      const newUserCategoryName = ctx.message?.text;
      if (!newUserCategoryName || newUserCategoryName.length < MIN_CATEGORY_NAME_LENGTH) {
        ctx.reply(`Название категории должно содержать не менее ${MIN_CATEGORY_NAME_LENGTH} символов`);
        return;
      }

      try {
        const response = await authApi.CategoryService.createOne(newUserCategoryName);
        ctx.wizard.state.expense.category = response.data.id;
      } catch (error) {
        return handleApiError(ctx, error, 'Не удалось создать категорию');
      }
    } else {
      ctx.wizard.state.expense.category = existCategoryId;
    }

    const inline_keyboard = [[{ text: 'Трата была сегодня', callback_data: 'now' }]];
    ctx.reply(
      `Введите дату в формате ${DATE_FORMAT_FOR_USER_DISPLAY} или нажмите "Сегодня":`,
      sendButtons(inline_keyboard)
    );

    return ctx.wizard.next();
  } catch (error) {
    console.error('Error in enterDateStep:', error);
    ctx.reply('Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.');
    return ctx.scene.leave();
  }
};

const createExpenseStep = async (ctx: WizardContext) => {
  try {
    const user = new UserDto(ctx);
    const authApi = new AuthApi(ctx);
    const isToday = ctx.callbackQuery?.data === 'now';

    const saveExpense = async (date?: Date) => {
      try {
        if (!ctx.wizard.state.expense?.amount || !ctx.wizard.state.expense?.category) {
          throw new Error('Отсутствуют обязательные данные о расходе');
        }

        const expenseData = {
          amount: Number(ctx.wizard.state.expense.amount),
          category_id: Number(ctx.wizard.state.expense.category),
          description: 'hello', // Можно добавить шаг для ввода описания
          date: date?.toISOString(),
        };

        await authApi.expense.createOne(expenseData);
        ctx.reply(`Сумма ${expenseData.amount} успешно внесена`);
      } catch (error) {
        console.error('Error saving expense:', error);
        throw error;
      }
    };

    if (isToday) {
      await saveExpense(new Date());
    } else {
      const message = ctx.message?.text;
      if (!message) {
        ctx.reply('Пожалуйста, введите дату');
        return;
      }

      const isValidDate = dayjs(message, DATE_FORMAT_FOR_USER, true).isValid();
      if (!isValidDate) {
        return ctx.reply(`Неверный формат даты. Используйте ${DATE_FORMAT_FOR_USER_DISPLAY}`);
      }

      const date = dayjs(message, DATE_FORMAT_FOR_USER).toDate();
      await saveExpense(date);
    }

    return ctx.scene.leave();
  } catch (error) {
    console.error('Error in createExpenseStep:', error);
    ctx.reply(`Не удалось сохранить расход: ${error.message}`);
    return ctx.scene.leave();
  }
};

const steps = [
  enterSumStep,
  enterCategoryStep,
  enterDateStep,
  createExpenseStep,
];

export const newExpense = new Scenes.WizardScene('new_expense_scene', ...steps);