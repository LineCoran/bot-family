// @ts-nocheck
import { Scenes } from 'telegraf';
import { dayjs } from '../shared/utils/date-utils';
import { AuthApi } from '../../api/authApi/authApi'

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

const viewExpenseStep = async (ctx: WizardContext) => {
  try {
    const api = new AuthApi(ctx);
    const { data: { data } } = await api.expense.getAll();
    await ctx.reply(`${JSON.stringify(data)}`);
  } catch (error) {
    console.error('Error in viewExpenseStep:', error);
    ctx.reply(`Не удалось получить список расходов :( ${error.message}`);
    return ctx.scene.leave();
  }

  ctx.scene.leave()
};

const steps = [
  viewExpenseStep,
];

export const viewExpensesScene = new Scenes.WizardScene('view_expense_scene', ...steps);