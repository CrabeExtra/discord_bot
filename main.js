import discord, { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

import * as dotenv from "dotenv"
import * as cron from 'cron';
import fetch from "node-fetch"
import fs from 'fs';
import cleverbot from 'cleverbot-free';
import { Configuration, OpenAIApi } from 'openai';
import { handleSlashCommands } from './slashCommands.js';

import { commands } from './commandDeclarations.js';

import { getAllBirthdays, initialise, incrementImageNumber, getImageNumber, addWords, getWords, clearWords } from './dataBaseFunctions.js';


//const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_TYPING", "GUILD_MEMBERS"] });
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

let {BOT_TOKEN, GUILD_ID_QG, OPEN_AI_KEY} = dotenv.config().parsed; 

const configuration = new Configuration({
    apiKey: OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    await initialise()
    const guildId = GUILD_ID_QG; // change per server

    let guild = client.guilds.cache.get(guildId);
    
    let c;

    if(guild) {
        c = guild.commands;
    } else {
        c = client.application?.commands;
    }
    commands.forEach(command => {
        c?.create(command)
            .then((cmd) => console.log(`Created Slash Command ${cmd.name}!`))
            .catch((cmd) => console.log(`Failed to create ${cmd.name} command!`));
    });

    let birthdays = (await getAllBirthdays());
    
    birthdays.forEach((birthday) => {
        new cron.CronJob(`0 0 ${birthday.day - 1} ${birthday.month - 1} */1`, async () => {
            guild.channels.cache.find((i) => i.name === 'foyer').send(`Everyone wish a happy birthday to ${birthday.username}!`)
        }, null, true, 'America/New_York');//, null, true); // <-- null, true has it send birthday message straight away so you know it's working properly
    })

});

const handleReplies = async (content, msg) => {
    try {
        let contextWords = await getWords();
        let messageToButler = {"role": "user", "content": content};

        contextWords = contextWords.map((element) => JSON.parse(element.words));

        let reply = await openai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages:[
                {"role": "system", "content": "You are a helpful butler at a fancy saloon. Your name is Jeeves. Speak casually, not professionally, and stay in character."},
                ...contextWords,
                messageToButler
            ]
        });

        let replyContent = reply.data.choices[0].message.content;
        let replyLength = replyContent.length;

        if(replyLength >= 2000) {
            let divisions = Math.ceil(replyLength/1998);
            for (let i = 0; i < divisions; i++) {
                let startIndex = i*1998;
                let endIndex = startIndex + 1998;

                msg.reply(replyContent.slice(startIndex, endIndex));
            }
        } else {
            msg.reply(replyContent);
        }
        
        

        await addWords(JSON.stringify(messageToButler));
        await addWords(JSON.stringify(reply.data.choices[0].message));
    } catch(e) {
        console.error(e);
    }
}

client.on('messageCreate', (msg) => {
    const content = msg.content;
    //console.log(msg);
    if(content.toLowerCase().includes("butler") && msg.member.user.id != "1043463849371770920") {
        var searchMask = "butler";
        var regEx = new RegExp(searchMask, "i");
        var replaceMask = "";
        
        const newContent = content.replace(regEx,replaceMask).replace(/\s+/g, ' ').trim(); 
        //console.log(newContent)
        
        handleReplies(newContent, msg)
    }
});

client.on("guildMemberAdd", async (member) => {
    try {
        const guildId = GUILD_ID_QG; // change per server
        let guild = client.guilds.cache.get(guildId);
        await guild.channels.cache.find((i) => i.name === 'welcome').send(`Good day ${member.user.username}. Would you like some tea and biscuits?`);
        
        member.roles.add('1043459158567026748');
    } catch(e) {
        console.error(e);
    }
    
});

client.on("interactionCreate", (interaction) => handleSlashCommands(interaction));

client.login(BOT_TOKEN);
