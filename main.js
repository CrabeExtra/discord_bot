import discord, { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

import * as dotenv from "dotenv"
import * as cron from 'cron';
import fetch from "node-fetch"
import fs from 'fs';
import cleverbot from 'cleverbot-free';

import { handleSlashCommands } from './slashCommands.js';

import { commands } from './commandDeclarations.js';
import {Timer} from "easytimer.js";

import { getAllBirthdays, initialise, incrementImageNumber, getImageNumber, addWords, getWords, clearWords } from './dataBaseFunctions.js';

//const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_TYPING", "GUILD_MEMBERS"] });
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

let {BOT_TOKEN, GUILD_ID_QG} = dotenv.config().parsed; 

//initialise();

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
        new cron.CronJob(`* * ${birthday.day} ${birthday.month} */1`, async () => {
            guild.channels.cache.find((i) => i.name === 'foyer').send(`Everyone wish a happy birthday to ${birthday.username}!`)
        }, null, true, 'America/New_York');//, null, true); // <-- null, true has it send birthday message straight away so you know it's working properly
    })

});

let timerBool = false;

const handleReplies = async (timer, content, msg) => {
    let contextWords = await getWords();
        
    contextWords = contextWords.map((element) => element.words);

    //console.log(contextWords);

    let reply = await cleverbot(content, ["your name is butler", "My name is The Butler", "good", ...contextWords]);
    msg.reply(reply)
    if(!timerBool) {
        timerBool = true;
        timer.addEventListener('secondsUpdated', async function(e) {
            if(timer.getTimeValues().hours === 24) {
                await clearWords();
                timer.stop();
                timerBool = false;
            }
        })
    } 
    
    await addWords(content);
    await addWords(reply);
}

client.on('messageCreate', (msg) => {
    const content = msg.content;
    //console.log(msg);
    if(content.toLowerCase().includes("butler")) {
        let timer = new Timer();
        timer.reset();
        timer.start();
        
        handleReplies(timer, content, msg)
    }
});

client.on("guildMemberAdd", async (member) => {
    const guildId = GUILD_ID_QG; // change per server
    let guild = client.guilds.cache.get(guildId);
    await guild.channels.cache.find((i) => i.name === 'welcome').send(`Good day ${member.user.username}. Would you like some tea and biscuits?`);
    
    member.roles.add('1043459158567026748');
});

client.on("interactionCreate", (interaction) => handleSlashCommands(interaction))

client.login(BOT_TOKEN);