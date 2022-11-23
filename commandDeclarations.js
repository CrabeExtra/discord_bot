//import { SlashCommandOptionType } from './deps.js'

import discord from 'discord.js';

export const commands = [
    {
        name: "set_birthday",
        description: "Set your date of birth.",
        options: [
            {
                name: "day",
                description: "day of the month",
                required: true,
                type: 3,
            },
            {
                name: "month",
                description: "month in the year",
                required: true,
                type: 3,
            },
            {
                name: "year",
                description: "year number",
                required: true,
                type: 3,
            }
        ]
    },
    {
        name: "birthday",
        description: "see what birthday has been logged by the butler"
    },
    {
        name: "delete_birthday",
        description: "wipe your birthday from the butler's fucking memory"
    },
    {
        name: "phas_spirit_box",
        description: "I can tell you spirit box phrases in Phasmophobia"
    },
    {
        name: "phas_general",
        description: "I can tell you all general ghost phrases in Phasmophobia"
    },
    {
        name: "phas_ouija_board",
        description: "I can tell you all ouija board phrases in Phasmophobia"
    },
    {
        name: "phas_trig",
        description: "I can tell you all ghost trigger phrases in Phasmophobia"
    }
]