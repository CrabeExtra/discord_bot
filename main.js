import discord, { Client, GatewayIntentBits } from 'discord.js';

import * as dotenv from "dotenv"
import * as cron from 'cron';

import { handleSlashCommands } from './slashCommands.js';

import { commands } from './commandDeclarations.js';

import { getAllBirthdays, initialise } from './dataBaseFunctions.js';

//const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_TYPING", "GUILD_MEMBERS"] });
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMembers] });

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

client.on('messageCreate', (msg) => {
    const content = msg.content;
    //console.log(msg);
    if(content.toLowerCase().includes("butler")) {
        msg.reply('Gday cunt');
    }
});

client.on("guildMemberAdd", async (member) => {
    (await member.guild.channels.get('1043458605636132875')).send(`Good day ${member.user.username}. Would you like some tea and biscuits?`);
    let role = await member.guild.roles.get('1043459158567026748');
    
    member.roles.add(role);
});

client.on("interactionCreate", (interaction) => handleSlashCommands(interaction))

client.login(BOT_TOKEN);