import { DatabaseSync } from "node:sqlite";
import { error } from './helperFunctions.js';

export function openDb() {
    return new DatabaseSync("./birthdays.db");
}

export const initialise = async () => {
    const db = openDb();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS birthdays(
            id TEXT PRIMARY KEY,
            username TEXT,
            day TEXT,
            month TEXT,
            year TEXT
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS imageNonce(
            id TEXT PRIMARY KEY,
            nonce
        )
    `).run();

    db.prepare(`
        CREATE TABLE IF NOT EXISTS context(
            words
        )
    `).run();
}


export const addBirthday = async (userId, username, day, month, year) => {
    const db = openDb();
    try {
        if(day > 31 || day <= 0 || month > 12 || month <= 0) {
            return 'error'
        } else {
            db.prepare(`
                INSERT OR REPLACE INTO birthdays(id, username, day, month, year)
                VALUES (?, ?, ?, ?, ?)
            `).run(userId, username, day, month, year);
            return 'success';
        }
        
    } catch(e) {
        error(e);
        return 'error';
    }
}

export const getBirthday = async (userId) => {
    const db = openDb();
    try {
        //return await db.query(`SELECT * FROM birthdays WHERE id=?`, [userId]);
        return db.prepare(`SELECT * FROM birthdays WHERE id = ?`).get(userId);
    } catch(e) {
        error(e)
        return 'error'
    }
}

export const getAllBirthdays = async () => {
    const db = openDb();
    try {
        return db.prepare(`SELECT * FROM birthdays`).all();
    } catch(e) {
        error(e);
        return 'error'
    }
}

export const deleteBirthday = async (userId) => {
    const db = openDb();
    try {
        db.prepare(`DELETE FROM birthdays WHERE id = ?`).run(userId);
        return "success";
    } catch(e) {
        error(e);
        return 'error';
    }
}

export const incrementImageNumber = async () => {
    const db = openDb();
    try {
        let newNonce = (await getImageNumber())[0].nonce + 1;

        if(newNonce <= 100) {
            db.prepare(`DELETE FROM birthdays WHERE id = ?`).run();
        } else {
            db.prepare(`
                INSERT OR REPLACE INTO imageNonce(id, nonce)
                VALUES (1, ?)
            `).run(newNonce);
        }
        
        return 'success'
    } catch(e) {
        error(e);
        return 'error'
    }
    
}

export const getImageNumber = async () => {
    const db = openDb();
    try {
        return db.prepare(`SELECT * FROM imageNonce`).all();
    } catch(e) {
        error(e);
        return 'error'
    }
}

export const addWords = async (words) => {
    const db = openDb();
    try {
        db.prepare(`INSERT INTO context(words) VALUES (?)`).run(words);
    } catch(e) {
        error(e);
        return 'error'
    }
}

export const getWords = async () => {
    const db = openDb();
    try {
        return db.prepare(`SELECT words FROM context`).all();
    } catch(e) {
        error(e);
        return 'error'
    }
}

export const clearWords = async() => {
    const db = openDb();
    try {
        db.prepare(`DROP TABLE IF EXISTS context`).run();

        db.prepare(`CREATE TABLE IF NOT EXISTS context(words)`).run();
    } catch(e) {
        error(e);
    }
    
}
