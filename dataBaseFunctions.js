import { DB } from "./deps.js"
import { serve } from "./deps.js";
import {
    prepareLocalFile,
    prepareVirtualFile,
} from "./deps.js";

// Prepare the file in memory before opening it.
await prepareLocalFile("./db.sqlite");
prepareVirtualFile("./db.sqlite-journal");

export const db = new DB("./birthdays.sqlite");

export function init() {
    db.query(`CREATE TABLE IF NOT EXISTS birthdays(id INTEGER PRIMARY KEY, username TEXT, day TEXT, month TEXT, year TEXT)`)
}

export const addBirthday = async (userId, username, day, month, year) => {
    try {
        if(day > 31 || day < 0 || month > 12 || month < 0) {
            await db.query(`INSERT OR REPLACE INTO birthdays (id, username, day, month, year) VALUES (? , ?, ?, ?, ?)`, [userId, username, day, month, year]);
            return 'success';
        } else {
            throw e;
        }
        
    } catch(e) {
        console.error(e);
        return 'error';
    }
}

export const getBirthday = async (userId) => {
    try {
        return await db.query(`SELECT * FROM birthdays WHERE id=?`, [userId]);
    } catch(e) {
        console.error(e)
        return 'error'
    }
}

export const getAllBirthdays = async () => {
    try {
        return await db.query(`SELECT * FROM birthdays`);
    } catch(e) {
        console.error(e);
        return 'error'
    }
}

export const deleteBirthday = async (userId) => {
    try {
        await db.query(`DELETE FROM birthdays WHERE id=?`,[userId]);
        return "success";
    } catch(e) {
        console.error(e);
        return 'error';
    }
}
