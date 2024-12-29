import { UserDto } from '../models/userDto';
import pool from '../../db';

// CREATE TABLE IF NOT EXISTS family_categories (
//   id SERIAL PRIMARY KEY,
//   chat_id BIGINT NOT NULL REFERENCES user_sessions(chat_id) ON DELETE CASCADE,
//   name VARCHAR(32) NOT NULL,
//   created_at TIMESTAMP DEFAULT NOW()
// );

export class CategoriesController {

  static async createCategory(user: UserDto, name: string ) {
    try {

      const { id } = user;

      const query = `INSERT INTO family_categories (chat_id, name) VALUES ($1, $2) RETURNING id`;
      const data = [id, name];
      return await pool.query(query, data);

    } catch (e) {
      throw e
    }
  }

  static async getUserCategories(user: UserDto) {
    try {
      const { id } = user;
      const query = `SELECT * FROM family_categories WHERE chat_id = $1`;
      const data = [id];
      const res = await pool.query(query, data);
      return res.rows;
    } catch (e) {
      throw e
    }
  }
}