import { Context } from 'telegraf';
import { UserDto } from '../../api/userDto';

export const getExpenses = async (ctx: Context) => {
  const user = new UserDto(ctx)
  const expenses = 'hello' ;

  ctx.sendMessage(expenses);
}