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
        name: "draw_picture",
        description: "Request a picture of your description be painted by the butler",
        options: [
            {
                name: "description",
                description: "What do you want the Butler to paint?",
                required: true,
                type: 3
            },
            {
                name: "photo-realistic",
                description: "Do you want the painting to be photo-realistic?",
                required: false,
                type: 5
            }
        ]
    },
    {
        name: "reset_context",
        description: "Resets butler's conversation context.",
    },
    {
        name: "context_length",
        description: "Get length of context in characters."
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