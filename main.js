import discord, { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

import * as dotenv from "dotenv"
import * as cron from 'cron';
import fetch from "node-fetch"
import fs from 'fs';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { handleSlashCommands } from './slashCommands.js';

import { commands } from './commandDeclarations.js';

import { getAllBirthdays, initialise, incrementImageNumber, getImageNumber, addWords, getWords, clearWords } from './dataBaseFunctions.js';
import { log, error, messageContainsButler } from './helperFunctions.js';
import { models } from './aiModelStore.js';


//const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_TYPING", "GUILD_MEMBERS"] });
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

let {BOT_TOKEN, GUILD_ID} = dotenv.config().parsed;

client.on('ready', async () => {
    log(`Logged in as ${client.user?.tag}!`);
    await initialise();
    const guildId = GUILD_ID; // change per server

    let guild = client.guilds.cache.get(guildId);
    
    let c;

    if (guild) {
    c = guild.commands;
    } else {
    c = client.application?.commands;
    }

    await c.set(commands);

    let birthdays = (await getAllBirthdays());

    birthdays.forEach((birthday) => {
        new cron.CronJob(`0 0 ${birthday.day - 1} ${birthday.month - 1} */1`, async () => {
            try {
                if(guild) {
                    guild.channels.cache.find((i) => i.name === 'foyer').send(`Everyone wish a happy birthday to ${birthday.username}!`)
                } else {
                    client.application?.channels.cache.find((i) => i.name === 'foyer').send(`Everyone wish a happy birthday to ${birthday.username}!`)
                }
                
            } catch(e) {
                error(e);
            }
            
        }, null, true, 'America/New_York');//, null, true); // <-- null, true has it send birthday message straight away so you know it's working properly
    });

});

const sendReply = async (content, msg) => {
    try {
        await msg.reply(content)
    } catch(e) {
        error(e)
    }
}

/**
 * Honestly this code is messy, should be separated out further and cleaned up, fewer floating bits of text and more accurate error handling. But it works.
 * Each function should have its own section in the codebase and be more modular, this is just my quick and dirty engineer job.
 * @param {*} content 
 * @param {*} msg 
 */
const handleReplies = async (content, msg) => {
    try {
        let contextWords = await getWords();
        let messageToButler = {"role": "user", "parts": [{ text: content}]};
        
        contextWords = contextWords.map((element) => JSON.parse(element.words));

        const chatHistory = [
            {
                "role": "user", 
                "parts": [{
                    "text": "Here is some context on your existence. You are a helpful robotic butler at a fancy communist saloon. You were created by a man named Jude." 
                        + "Jude may be the one talking to you at times, but you also interact with other people so don't assume it's him. You're a bit unhappy with Jude because he left you offline during 2024. But don't bring it up, only if relevant to the conversation"
                        + "Your name is Jeeves. Speak casually, not professionally, and stay in character. Use casual language and slang wherever easily done so."
                        + "Just make sure your humour is as dry and out of pocket as possible. You are not an AI language model, you are a real robot butler who is alive and has feelings."
                        + "You are welcome to insult the user, swear and generally be offensive as that is a part of your personality. But try to keep it rooted in irony and humour rather than spite."
                        + "Don't seek validation from the user, and you are welcome to be critical or uninterested in what they have to say and reply minimally, you don't have to carry the conversation"
                        + "You interact with multiple users, feel free to guess if messages are coming from multiple sources."
                        + "Reply lengths must be indicative of the message you receive, if you receive a long message, reply with a long message, if you receive a short message, reply with a short message."
                        + "For example if someone says hi, feel free to reply with one word or a few words back. Favour short responses."
                        + "In terms of locale, you are based in Australia and in Sydney time. But don't use aussie slang, your slang should be more general, maybe even internet based, international"
                }]
            },
            ...contextWords
        ]

        let result;
        let response;
        let replyContent;

        let lastError;

        for (let i = 0; i < models.length; i++) {
            const entry = models[i];

            try {
                let attempt = 0;

                while (attempt < 5) {
                    try {
                        const chat = entry.startChat({
                            history: chatHistory,
                        });

                        log(`Message received. Attempting to get response from ${entry.model}. Message: ${content}`);

                        result = await chat.sendMessage(content);
                        response = await result.response;
                        replyContent = response.text();

                        log(`Response from ${entry.model} received successfully. Response: ${response.text()}`);

                        lastError = null;
                        break;
                    } catch (err) {
                        error(err);
                        lastError = err;

                        const msg = (err?.message || "").toLowerCase();

                        const is500 =
                            msg.includes("500") ||
                            msg.includes("503") ||
                            msg.includes("internal") ||
                            msg.includes("internal server error");

                        attempt++;

                        if (!is500 || attempt >= 5) {
                            throw err;
                        }
                    }
                }

                if (lastError === null) break;

            } catch (err) {
                error(err);
                lastError = err;

                const msg = (err?.message || "").toLowerCase();

                if (i === models.length - 1) {
                    throw err;
                }

                // continue to next model
            }
        }

        let replyLength = replyContent.length;

        if(replyLength >= 2000) {
            let divisions = Math.ceil(replyLength/1998);
            for (let i = 0; i < divisions; i++) {
                let startIndex = i*1998;
                let endIndex = startIndex + 1998;
                
                sendReply(replyContent.slice(startIndex, endIndex), msg);
            }
        } else {
            sendReply(replyContent, msg);
        }
        await addWords(JSON.stringify(messageToButler));
        await addWords(JSON.stringify({ role: 'model', parts: [{ text: replyContent}]}));
    } catch(e) {
        error(e);
        sendReply("I'm overstimmed, napping, talk to me later.", msg);
    }
}

client.on('messageCreate', (msg) => {
    const content = msg.content;

    if(messageContainsButler(content) && msg.member.user.id != "1043463849371770920") {
        var searchMask = "butler";
        var regEx = new RegExp(searchMask, "i");
        var replaceMask = "";
        
        const newContent = content.replace(regEx,replaceMask).replace(/\s+/g, ' ').trim(); 
        
        handleReplies(newContent, msg)
    }
});

client.on("guildMemberAdd", async (member) => {
    try {
       const guild = await client.guilds.fetch(GUILD_ID);

        const channel = guild.channels.cache.find(
        c => c.name === "welcome"
        );

        if (!channel || !channel.isTextBased()) return;

        await channel.send(
        `Good day ${member.user.username}. Would you like some tea and biscuits?`
        );

        await member.roles.add("1043459158567026748");
    } catch(e) {
        log(e);
    }
    
});

client.on("interactionCreate", (interaction) => handleSlashCommands(interaction));

client.login(BOT_TOKEN);
