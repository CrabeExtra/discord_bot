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
const logger = async (textToAppend) => {
    const filePath = "./butler.log";
    const newLine = textToAppend + "\n";

    try {
        let content = "";

        try {
            content = await fs.readFile(filePath, "utf8");
        } catch {
            content = "";
        }

        let lines = content
            .split("\n")
            .filter(line => line.length > 0);

        // add new log at the top
        lines.unshift(textToAppend);

        // keep only latest 499 lines
        if (lines.length > 499) {
            lines = lines.slice(0, 499);
        }

        await fs.writeFile(filePath, lines.join("\n") + "\n");

    } catch (err) {
        console.error("Logging failed:", err); // kind of a pointless catch.
    }
}

export const log = async (textToAppend) => {
    console.log(textToAppend); // for developement
    await logger(`INFO: ${textToAppend}`);
}

export const error = async (textToAppend) => {
    console.error(textToAppend);
    await logger(`ERROR: ${textToAppend}`);
}

/**
 *  VERY VERY basic fuzzy distance between 2 strings.
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
const fuzzyDistance = (a, b) => {
    a = a.toLowerCase();
    b = b.toLowerCase();

    let i = 0;
    let j = 0;
    let cost = 0;

    while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
        i++;
        j++;
        continue;
    }

    // adjacent swapped letters
    if (
        i + 1 < a.length &&
        j + 1 < b.length &&
        a[i] === b[j + 1] &&
        a[i + 1] === b[j]
    ) {
        cost += 1;
        i += 2;
        j += 2;
        continue;
    }

    cost += 1;
    i++;
    j++;
    }

    cost += (a.length - i) + (b.length - j);

    return cost;
}

export const messageContainsButler =(message, threshold = 1) =>  {
    const target = "butler";
    const targetTwo = "jeeves"
    const words = message
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);

    for (const word of words) {
        if (fuzzyDistance(word, target) <= threshold || fuzzyDistance(word, targetTwo) <= threshold) {
            return true;
        }
    }

    return false;
}