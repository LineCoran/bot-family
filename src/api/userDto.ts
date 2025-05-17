// @ts-nocheck
import { Context } from 'telegraf';


export class UserDto {
  id;
  first_name = '';
  last_name = '';
  username = '';
  token = '';

  constructor(ctx: Context) {

    if (ctx.update && ctx.update.callback_query) {
      this.id = ctx.update.callback_query.from.id;
      this.first_name = ctx.update.callback_query.from.first_name || '';
      this.last_name = ctx.update.callback_query.from.last_name || '';
      this.username = ctx.update.callback_query.from.username || '';
    } else {
      this.id = ctx.message?.chat.id;
      this.first_name = ctx.message?.from.first_name || '';
      this.last_name = ctx.message?.from.last_name || '';
      this.username = ctx.message?.from.username || '';
    }
  }
}