import discord, { Client, GatewayIntentBits } from 'discord.js';

import * as dotenv from "dotenv"
import * as cron from 'cron';

import { handleSlashCommands } from './slashCommands.js';

import { commands } from './commandDeclarations.js';

import { getAllBirthdays, initialise } from './dataBaseFunctions.js';

import deepai from "deepai";

//const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_TYPING", "GUILD_MEMBERS"] });
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

let {BOT_TOKEN, GUILD_ID_QG} = dotenv.config().parsed; 

//initialise();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    await initialise()
    const guildId = GUILD_ID_QG; // change per server
    // deepai.setApiKey("33f72fde-d5ea-468b-953c-a6b9c6e488e9")
    // console.log(await deepai.callStandardApi("text2img", {
    //     text: "mario with a doughnut"
    // }));

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

client.on('messageCreate', (msg) => {
    const content = msg.content;
    //console.log(msg);
    if(content.toLowerCase().includes("butler")) {
        msg.reply('Gday cunt');
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