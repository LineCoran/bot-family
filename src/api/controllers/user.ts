import { UserDto } from '../models/userDto';
import pool from '../../db';

// CREATE TABLE IF NOT EXISTS family_users (
//   id SERIAL PRIMARY KEY,
//   chat_id BIGINT NOT NULL,
//   last_name VARCHAR(32),
//   first_name VARCHAR(32),
//   timestamp timestamp default current_timestamp,
//   username VARCHAR(32)
// );

export class UserController {

  static async createUser(user: UserDto) {
    try {

        const { id, first_name, last_name, username } = user;

        const query = `INSERT INTO family_user_sessions (chat_id, first_name, last_name, username) VALUES ($1, $2, $3, $4)`;
        const data = [id, first_name, last_name, username];
        return await pool.query(query, data);

      } catch (e) {
        throw e
      }
  }

  static async getUser(user: UserDto) {
    try {
      const { id } = user;
      const query = `SELECT * FROM family_user_sessions WHERE chat_id = $1`;
      const data = [id];
      const res = await pool.query(query, data);
      return res.rows[0];
    } catch (e) {
      throw e
    }
  }
}