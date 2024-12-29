import * as dotenv from 'dotenv';
// @ts-ignore
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

const USERS = `
    CREATE TABLE IF NOT EXISTS family_users (
        id SERIAL PRIMARY KEY,
        chat_id BIGINT NOT NULL,
        last_name VARCHAR(32),
        first_name VARCHAR(32),
        timestamp timestamp default current_timestamp,
        username VARCHAR(32)
    );
`

const CATEGORIES = `
 CREATE TABLE IF NOT EXISTS family_categories (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL REFERENCES user_sessions(chat_id) ON DELETE CASCADE,
    name VARCHAR(32) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
 );
`

const EXPENSES = `
 CREATE TABLE IF NOT EXISTS family_expenses (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL REFERENCES user_sessions(chat_id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    description TEXT,
    FOREIGN KEY (category_id) references family_categories(id) ON DELETE CASCADE
);
`;

// const drop = `DROP TABLE family_expenses, family_categories, family_users`

const ALL_TABLES = [
    // drop
    USERS,
    CATEGORIES,
    EXPENSES,

];

let successFully = 0;

pool.connect((err: any) => {
    if (err) throw err

    const createTable = (sqlText: string) => {
        pool.query(sqlText, (err: any, data: any) => {
            if (err) {
                console.log(err)
                return
            }
            successFully += 1;
            console.log(`Tables created: ${successFully} / ${ALL_TABLES.length} success!`)
        })
    }

    ALL_TABLES.forEach(tableText => createTable(tableText))
})

export default pool