import {
    Client,
    Message,
    Intents
} from './deps.js';

import { config } from "./deps.js"
import { cron } from './deps.js';

import { handleSlashCommands } from './slashCommands.js';

import { commands } from './commandDeclarations.js';

import { getAllBirthdays } from './dataBaseFunctions.js';

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_TYPING", "GUILD_MEMBERS"] });
//let {BOT_TOKEN, GUILD_ID_QG } = Deno.env.toObject();  
let {BOT_TOKEN, GUILD_ID_QG } = config(); 


client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag}!`);

    const guildId = GUILD_ID_QG; // change per server

    commands.forEach(command => {
        client.slash.commands.create(command, guildId)
            .then((cmd) => console.log(`Created Slash Command ${cmd.name}!`))
            .catch((cmd) => console.log(`Failed to create ${cmd.name} command!`));
    });

    // let birthdays = (await getAllBirthdays());
    // console.log(birthdays);
    // birthdays.forEach((birthday) => {
    //     cron(`* * ${birthday[2]} ${birthday[3]} */1`, async () => {
    //         (await interaction.guild.channels.get('1043727687279181975')).send(`Everyone wish a happy birthday to ${birthday[1]}!`)
    //     });
    // })

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

client.connect(BOT_TOKEN, Intents.None);