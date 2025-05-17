import { Context } from 'telegraf';
// import { ExpenseController } from '../../backend/api/controllers/expense';
import { UserDto } from '../../backend/api/models/userDto';

export const getExpenses = async (ctx: Context) => {
  const user = new UserDto(ctx)
  const expenses = 'hello' ;

  ctx.sendMessage(expenses);
}