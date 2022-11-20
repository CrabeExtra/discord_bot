import {
    Client,
    Message,
    Intents
} from './deps.js';

import { config } from "./deps.js"

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_TYPING"] });
let {BOT_TOKEN, GUILD_ID_QG } = Deno.env.toObject(); //config();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
    const guildId = GUILD_ID_QG; // change per server

    let commands;

    commands = client.application?.commands;
    
    
});

client.on('messageCreate', (msg) => {
    const content = msg.content;
    //console.log(msg);
    if(content.toLowerCase().includes("butler")) {
        msg.reply('Gday cunt');
    }
});

client.connect(BOT_TOKEN, Intents.None);