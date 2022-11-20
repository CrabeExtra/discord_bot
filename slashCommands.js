//import { addBirthday, deleteBirthday, getBirthday } from "./dataBaseFunctions.js";
import { cron } from './deps.js';

import { ouijaBoard, general, toTrigger, spiritBox } from "./phas.js";

export const handleSlashCommands = async (interaction) => {
    let userId = interaction.user.id;
    let username = interaction.user.username
    let response;

    switch (interaction.data.name) {
        // case "set_birthday":
            
        //     // set variables
        //     let day = interaction.data.options.find((e) => e.name === "day").value
        //     let month = interaction.data.options.find((e) => e.name === "month").value
        //     let year = interaction.data.options.find((e) => e.name === "year").value
            

        //     // add birthdays to database (note to add scheduler to all birthdays on bot restart - ready)
        //     response = await addBirthday(userId, username, day, month, year);
        
        //     // schedule annual birthday message
        //     cron(`* * ${day} ${month} */1`, async () => {
        //         (await interaction.guild.channels.get('1043727687279181975')).send(`Everyone wish a happy birthday to ${username}!`)
        //     });

        //     // respond
        //     if(response === "success") {
        //         interaction.respond({
        //             content: `I will remember your birthday to be on ${day}/${month}/${year}`,
        //             ephemeral: true
        //         });
        //     } else if (response === "error") {
        //         interaction.respond({
        //             content: `My memory seems to be failing me, or maybe you have told me utter bullshit as your birth date, please take this matter to the bar tender, Crabe Extra.`,
        //             ephemeral: true
        //         });
        //     }
            
        // break;
        // case "birthday":
        //     response = await getBirthday(userId);
        //     //console.log(response);
        //     let elementFound;
        //     for (const item of response.query({})) {
        //         elementFound = item
        //     }
        //     if(elementFound) {
        //         interaction.respond({
        //             content: `I believe you said your birthday was on ${elementFound[2]}/${elementFound[3]}/${elementFound[4]}. If you told me the incorrect birthday, you may tell me your true birthday.`,
        //             ephemeral: true
        //         });
        //     } else {
        //         interaction.respond({
        //             content: `I don't believe you have told me your birthday.`,
        //             ephemeral: true
        //         });
        //     }
            
        // break;
        // case "delete_birthday": 
        //     response = await deleteBirthday(userId);
        //     interaction.respond({
        //         content: `I can't seem to recall your birthday.`,
        //         ephemeral: true
        //     });
        // break;
        case "phas_spirit_box":
            interaction.respond({
                content: spiritBox
            });
        break;
        case "phas_general":
            interaction.respond({
                content: general
            });
        break;
        case "phas_ouija_board":
            interaction.respond({
                content: ouijaBoard
            });
        break;
        case "phas_trig":
            interaction.respond({
                content: toTrigger
            });
        break;
    }

    
}