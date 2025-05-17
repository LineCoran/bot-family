// import * as dotenv from 'dotenv';
// // @ts-ignore
// import { Pool } from 'pg';

// dotenv.config();

// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'family',
//     password: '3832',
//     port: 5432,
// });

// const USERS = `
//     CREATE TABLE IF NOT EXISTS family_users (
//         id SERIAL PRIMARY KEY,
//         chat_id BIGINT UNIQUE NOT NULL,
//         last_name VARCHAR(32),
//         first_name VARCHAR(32),
//         timestamp timestamp default current_timestamp,
//         username VARCHAR(32)
//     );
// `

// const CATEGORIES = `
//  CREATE TABLE IF NOT EXISTS category (
//     id SERIAL PRIMARY KEY,
//     chat_id BIGINT NOT NULL REFERENCES family_users(chat_id) ON DELETE CASCADE,
//     name VARCHAR(32) NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     is_deleted BOOLEAN,
//     deleted_at TIMESTAMP
//  );
// `

// const EXPENSES = `
//  CREATE TABLE IF NOT EXISTS famyli_expense (
//     id SERIAL PRIMARY KEY,
//     chat_id BIGINT NOT NULL,
//     category_id INTEGER NOT NULL,
//     amount DECIMAL(10, 2) NOT NULL,
//     created_at TIMESTAMP DEFAULT NOW(),
//     description TEXT,
//     FOREIGN KEY (category_id) references category(id) ON DELETE CASCADE
// );
// `;

// const ALL_TABLES = [
//     // drop,
//     USERS,
//     CATEGORIES,
//     EXPENSES,
// ];

// let successFully = 0;

// pool.connect((err: any) => {
//     if (err) throw err

//     const createTable = (sqlText: string) => {
//         pool.query(sqlText, (err: any, data: any) => {
//             if (err) {
//                 console.log(err)
//                 return
//             }
//             successFully += 1;
//             console.log(`Tables created: ${successFully} / ${ALL_TABLES.length} success!`)
//         })
//     }

//     ALL_TABLES.forEach(tableText => createTable(tableText))
// })

// export default pool