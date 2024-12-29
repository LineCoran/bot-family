import { Context } from 'telegraf';
import { ExpenseController } from '../api/controllers/expense';
import { UserDto } from '../api/models/userDto';

export const getExpenses = async (ctx: Context) => {
  const user = new UserDto(ctx)
  const expenses = await ExpenseController.getUserExpenses(user);

  ctx.sendMessage(JSON.stringify(expenses));
}