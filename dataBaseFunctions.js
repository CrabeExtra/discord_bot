
import { DB, init } from "./deps.js";
import denovfs from "https://deno.land/x/sqlite3_wasm/vfs.deno.ts";

// init(denovfs);

// const db = new DB("birthdays.db");

// export const initialise = () => {
//     db.exec("CREATE TABLE IF NOT EXISTS birthdays(id TEXT PRIMARY KEY, username TEXT, day TEXT, month TEXT, year TEXT)");
// }


// export const addBirthday = async (userId, username, day, month, year) => {
//     try {
//         if(day > 31 || day < 0 || month > 12 || month < 0) {
//             return 'error'
//         } else {
//             //await db.query(`INSERT OR REPLACE INTO birthdays (id, username, day, month, year) VALUES (? , ?, ?, ?, ?)`, [userId, username, day, month, year]);
//             await db.exec(`INSERT OR REPLACE INTO birthdays VALUES (? , ?, ?, ?, ?)`, [userId, username, day, month, year]);
//             return 'success';
//         }
        
//     } catch(e) {
//         console.error(e);
//         return 'error';
//     }
// }

// export const getBirthday = async (userId) => {
//     try {
//         //return await db.query(`SELECT * FROM birthdays WHERE id=?`, [userId]);
//         return await db.prepare(`SELECT * FROM birthdays WHERE id=${userId}`);
//     } catch(e) {
//         console.error(e)
//         return 'error'
//     }
// }

// export const getAllBirthdays = async () => {
//     try {
//         //return await db.query(`SELECT * FROM birthdays`);
//         return await db.prepare(`SELECT * FROM birthdays`);
//     } catch(e) {
//         console.error(e);
//         return 'error'
//     }
// }

// export const deleteBirthday = async (userId) => {
//     try {
//         //await db.query(`DELETE FROM birthdays WHERE id=?`,[userId]);
//         await db.exec(`DELETE FROM birthdays WHERE id=${userId}`);
//         return "success";
//     } catch(e) {
//         console.error(e);
//         return 'error';
//     }
// }
