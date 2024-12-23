import * as dotenv from 'dotenv';
// @ts-ignore
import { Pool } from 'pg';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
})

const SESSION_TABLE = `
    CREATE TABLE IF NOT EXISTS family_user_sessions (
        chat_id BIGINT PRIMARY KEY,
        last_name VARCHAR(32),
        first_name VARCHAR(32),
        timestamp timestamp default current_timestamp,
        username VARCHAR(32) UNIQUE NOT NULL
    );
`

// const ORDERS_TABLE = `
//  CREATE TABLE IF NOT EXISTS orders (
//     id SERIAL PRIMARY KEY,
//     session_chat_id BIGINT NOT NULL REFERENCES user_sessions(chat_id) ON DELETE CASCADE,
//     created_at TIMESTAMP DEFAULT NOW(),
//     message TEXT NOT NULL,
//     username VARCHAR(32),
//     first_name VARCHAR(32),
//     second_name VARCHAR(32),
//     message_id BIGINT NOT NULL
//  );
// `;

// const ORDERS_TABLE = `
//  DROP TABLE orders
// `;

// const ADMINS = `
//     CREATE TABLE IF NOT EXISTS admins (
//         id SERIAL PRIMARY KEY,
//         username VARCHAR(32) UNIQUE NOT NULL
//     );
// `

// const CHAT_WITH_ADMINS = `
//     CREATE TABLE IF NOT EXISTS admins_chats (
//         id SERIAL PRIMARY KEY,
//         admin_username VARCHAR(32) UNIQUE,
//         chat_id BIGINT NOT NULL
//     );
// `

// const MESSAGE_LOGS = `
//     CREATE TABLE IF NOT EXISTS message_logs (
//         id SERIAL PRIMARY KEY,
//         chat_id BIGINT NOT NULL,
//         username VARCHAR(32) DEFAULT NULL,
//         message TEXT,
//         created_at TIMESTAMP DEFAULT NOW()
//     );
// `

const ALL_TABLES = [
    SESSION_TABLE
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