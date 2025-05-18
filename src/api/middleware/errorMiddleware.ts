import { ApiError } from '../service/apiError';
import { Context } from 'telegraf';

export const errorMiddleware = (error: ApiError | Error | unknown, ctx: Context) => {

  let message = 'Неизвестная ошибка'
  let code = 500;
  if (error instanceof ApiError) {
    message = error.message
    code = error.status;
  }

  if (error instanceof Error) {
    message = error.message
  }
  const finalMessage = `${message}; Код ошибки: ${code}`;
  void ctx.sendMessage(finalMessage);
}