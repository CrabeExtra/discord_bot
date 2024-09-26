import fs from 'fs/promises';

/**
 * 
 * JS equivalent of a thread sleep.
 * 
 * @param { * } ms amount of milliseconds to sleep for. 
 * @returns Promise.
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 
 * Rudimentary logger. The native logger was causing me issues.
 * 
 * @param {*} textToAppend what to log to the output file (butler.log)
 */
export const log = async (textToAppend) => {
    try {
        let filePath = './butler.log';
        // Check if the file exists
        await fs.access(filePath);
        // File exists, append to it
        await fs.appendFile(filePath, textToAppend);
    } catch (err) {
        await fs.writeFile(filePath, textToAppend);
    }
}