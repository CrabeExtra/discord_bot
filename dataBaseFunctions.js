import { open } from 'sqlite'
import sqlite3 from 'sqlite3'

export async function openDb () {
    return await open({
        filename: './birthdays.db',
        driver: sqlite3.Database
    })
}

export const initialise = async () => {
    let db = await openDb();
    await db.run("CREATE TABLE IF NOT EXISTS birthdays(id TEXT PRIMARY KEY, username TEXT, day TEXT, month TEXT, year TEXT)");
    await db.run("CREATE TABLE IF NOT EXISTS imageNonce(id TEXT PRIMARY KEY, nonce)");
}


export const addBirthday = async (userId, username, day, month, year) => {
    let db = await openDb();
    try {
        if(day > 31 || day < 0 || month > 12 || month < 0) {
            return 'error'
        } else {
            await db.run(`INSERT OR REPLACE INTO birthdays(id, username, day, month, year) VALUES (:id, :username, :day, :month, :year)`, { ':id': userId, ':username': username, ':day': day, ':month': month, ":year": year});
            
            return 'success';
        }
        
    } catch(e) {
        console.error(e);
        return 'error';
    }
}

export const getBirthday = async (userId) => {
    let db = await openDb();
    try {
        //return await db.query(`SELECT * FROM birthdays WHERE id=?`, [userId]);
        return await db.get(`SELECT * FROM birthdays WHERE id=${userId}`);
    } catch(e) {
        console.error(e)
        return 'error'
    }
}

export const getAllBirthdays = async () => {
    let db = await openDb();
    try {
        //return await db.query(`SELECT * FROM birthdays`);
        return await db.all(`SELECT * FROM birthdays`);
    } catch(e) {
        console.error(e);
        return 'error'
    }
}

export const deleteBirthday = async (userId) => {
    let db = await openDb();
    try {
        await db.run(`DELETE FROM birthdays WHERE id=${userId}`);
        return "success";
    } catch(e) {
        console.error(e);
        return 'error';
    }
}

export const incrementImageNumber = async () => {
    let db = await openDb();
    try {
        let newNonce = (await getImageNumber())[0].nonce + 1;

        if(newNonce <= 100) {
            await db.run(`INSERT OR REPLACE INTO imageNonce(id, nonce) VALUES (1, ${newNonce})`);
        } else {
            await db.run(`INSERT OR REPLACE INTO imageNonce(id, nonce) VALUES (1, ${1})`)
        }
        
        return 'success'
    } catch(e) {
        console.error(e);
        return 'error'
    }
    
}

export const getImageNumber = async () => {
    let db = await openDb();
    try {
        return await db.all(`SELECT * FROM imageNonce`);
    } catch(e) {
        
    }
}
