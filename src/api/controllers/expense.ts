import { UserDto } from '../models/userDto';
import pool from '../../db';

// CREATE TABLE IF NOT EXISTS family_expenses (
//   id SERIAL PRIMARY KEY,
//   chat_id BIGINT NOT NULL REFERENCES user_sessions(chat_id) ON DELETE CASCADE,
//   category_id INTEGER NOT NULL,
//   amount DECIMAL(10, 2) NOT NULL,
//   created_at TIMESTAMP DEFAULT NOW(),
//   description TEXT,
//   FOREIGN KEY (category_id) references family_categories(id) ON DELETE CASCADE
// );

export interface ICreateExpenseParams {
  categoryId: number;
  amount: number;
  description?: string;
}

export class ExpenseController {

  static async createExpense(user: UserDto, { categoryId, amount, description }: ICreateExpenseParams) {
    try {

      const { id } = user;

      const query = `INSERT INTO family_expenses (chat_id, category_id, amount, description) VALUES ($1, $2, $3, $4)`;
      const data = [id, categoryId, amount, description || ''];

      return await pool.query(query, data);

    } catch (e) {
      throw e
    }
  }

  static async getUserExpenses(user: UserDto) {
    try {
      const { id } = user;
      const query = `SELECT e.id, c.name, e.amount, e.created_at FROM family_expenses e JOIN family_categories c ON e.category_id = c.id WHERE e.chat_id = $1`;
      const data = [id];
      const res = await pool.query(query, data);
      return res.rows;
    } catch (e) {
      throw e
    }
  }
}