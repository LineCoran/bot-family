import { Context } from 'telegraf';
import { UserDto } from '../api/models/userDto';
import { UserController } from '../api/controllers/user';

export const start = async (ctx: Context) => {

  const user = new UserDto(ctx)

  const result = await UserController.getUser(user);
  if (result) return ctx.sendMessage(`Сессия уже создана ${JSON.stringify(result)}`);

  await UserController.createUser(user);
  return ctx.sendMessage('Сессия успешно создана!');

}