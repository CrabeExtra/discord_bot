import { table, expr, query } from "./deps.js";

export const addBirthday = async (userId, username, day, month, year) => {
    try {
        if(day > 31 || day < 0 || month > 12 || month < 0) {
            //await db.query(`INSERT OR REPLACE INTO birthdays (id, username, day, month, year) VALUES (? , ?, ?, ?, ?)`, [userId, username, day, month, year]);
            table("birthdays")
                .insert({
                    id: userId,
                    username: username,
                    day: day,
                    month: month,
                    year: year
                })
                .build();
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
        //return await db.query(`SELECT * FROM birthdays WHERE id=?`, [userId]);
        return table("birthdays")
            .select("*")
            .where({id: userId})
            .build();
    } catch(e) {
        console.error(e)
        return 'error'
    }
}

export const getAllBirthdays = async () => {
    try {
        //return await db.query(`SELECT * FROM birthdays`);
        return table("birthdays")
            .select("*")
            .build();
    } catch(e) {
        console.error(e);
        return 'error'
    }
}

export const deleteBirthday = async (userId) => {
    try {
        //await db.query(`DELETE FROM birthdays WHERE id=?`,[userId]);
        table("birthdays")
            .delete()
            .where({
                id: userId,
            })
            .build();
        return "success";
    } catch(e) {
        console.error(e);
        return 'error';
    }
}
