/**
 * 
 * JS equivalent of a thread sleep.
 * 
 * @param { * } ms amount of milliseconds to sleep for. 
 * @returns Promise.
 */
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));