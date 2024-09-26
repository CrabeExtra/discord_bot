import { addBirthday, deleteBirthday, getBirthday, incrementImageNumber, getImageNumber, clearWords, getWords } from "./dataBaseFunctions.js";
import * as cron from 'cron';
import * as dotenv from "dotenv"
import { ouijaBoard, general, toTrigger, spiritBox } from "./phas.js";
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch"
import fs from 'fs';
import { sleep, log } from "./helperFunctions.js";

const fsAsync = fs.promises;

const { OPEN_AI_KEY, BFL_API_KEY } = dotenv.config().parsed; 

const configuration = new Configuration({
	apiKey: OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

export const handleSlashCommands = async (interaction) => {
    let userId = interaction.user.id;
    let username = interaction.user.username
    let response;
    
    switch (interaction.commandName) {
        case "set_birthday":
            
            // set variables
            let day = interaction.options.getString("day")
            let month = interaction.options.getString("month")
            let year = interaction.options.getString("year")
            

            // add birthdays to database (note to add scheduler to all birthdays on bot restart - ready)
            response = await addBirthday(userId, username, day, month, year);
        
            // schedule annual birthday message
            new cron.CronJob(`0 0 ${day-1} ${month-1} */1`, async () => {
                (await interaction.guild.channels.cache.find((i) => i.name === 'foyer')).send(`Everyone wish a happy birthday to ${username}!`)
            }, null, true, 'America/New_York');//, null, true); // <-- null, true has it send birthday message straight away so you know it's working properly

            // respond
            if(response === "success") {
                interaction.reply({
                    content: `I will remember your birthday to be on ${day}/${month}/${year}`,
                    ephemeral: true
                });
            } else if (response === "error") {
                interaction.reply({
                    content: `My memory seems to be failing me, or maybe you have told me utter bullshit as your birth date, please take this matter to the bar tender, Crabe Extra.`,
                    ephemeral: true
                });
            }
            
        break;
        case "birthday":
            response = await getBirthday(userId);

            if(response) {
                interaction.reply({
                    content: `I believe you said your birthday was on ${response.day}/${response.month}/${response.year}. If you told me the incorrect birthday, you may tell me your true birthday.`,
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: `I don't believe you have told me your birthday.`,
                    ephemeral: true
                });
            }
            
        break;
        case "draw_picture":
            let description = interaction.options.getString("description");
            let style = interaction.options.getBoolean("photo-realistic");
            let blackForestLabs = interaction.options.getBoolean("words-in-image");
            interaction.reply({
                content: `I have begun crafting a piece of art depicting ${description}. I shall put it in the gallery when it is complete. photorealistic? ${style ? "yes" : "no"}. Will I account for words in the image? ${blackForestLabs ? "yes" : "no"}`,
                ephemeral: true
            });
            try {
                let response;
                let imageUrl;
                if(blackForestLabs) {
                    log("Creating image based on black forest labs AI.")
                    response = await fetch('https://api.bfl.ml/v1/image', {
                        method: 'POST',
                        headers: {
                          'accept': 'application/json',
                          'x-key': BFL_API_KEY,
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          prompt: description,
                          width: 1024,
                          height: 1024,
                          variant: "flux.1-pro",
                          steps: 50,
                          prompt_upsampling: false,
                          seed: null,
                          guidance: 2.5,
                          safety_tolerance: 2,
                          interval: 2
                        })
                    });
                    log(JSON.stringify(response))
                    let taskId = JSON.stringify(JSON.parse(response.id));

                    log(taskId);

                    while(true) {

                        response = await fetch(`https://api.bfl.ml/v1/get_result?id=${taskId}`);

                        if(response.status === "Ready") {
                            imageUrl = response.result.sample;
                            break;
                        }
                        sleep(1000);
                    }
                } else {
                    log("Creating image based on openAI GPT.")
                    response = await openai.createImage({
                        quality: "hd",
                        model: "dall-e-3",
                        prompt: description,
                        n: 1,
                        size: "1024x1024",
                        style: style ? "vivid" : "natural"
                    });
                    // console.log(response);
                    imageUrl = response.data.data[0].url;
                }
                    
                let fileName = `image_${(await getImageNumber())[0].nonce}`

                let res = await fetch(imageUrl);
                    
                let stream = res.body.pipe(fs.createWriteStream(`./images/${fileName}.png`));

                stream.on("finish", async () => {
                    (await interaction.guild.channels.cache.find((i) => i.name === 'gallery')).send({ files: [`./images/${fileName}.png`]})
                    await incrementImageNumber();
                    await fsAsync.unlink(`./images/${fileName}.png`);
                })
                
            } catch(e) {
                console.log(e);
                (await interaction.guild.channels.cache.find((i) => i.name === 'gallery')).send("It appears I have run into some problems creating the painting your requested good citizen.")
                try {
                    (await interaction.guild.channels.cache.find((i) => i.name === 'gallery')).send(JSON.stringify(e.message))
                } catch(e2) {
                    console.log("unable to send error to Discord.")
                }
            }
            

        break;
        case "reset_context":
            try {
                clearWords();
                interaction.reply({
                    content: `Context reset successfully, I will now converse as though it was the first time we have spoken.`,
                    ephemeral: true
                });
            } catch(e) {
                console.log(e);
                interaction.reply({
                    content: `There has been an error, please try again or contact Jude.`,
                    ephemeral: true
                });
            }
        break;
        case "context_length":
            try {
                let contextWords = await getWords();

                let totalContextLength = 0;

                contextWords = contextWords.map((element) => {
                    totalContextLength += element.words ? element.words.length : 0;
                });

                interaction.reply({
                    content: `Number of characters in context: ${totalContextLength}`,
                    ephemeral: true
                });

            } catch(e) {
                console.log(e);
                interaction.reply({
                    content: `There has been an error, please try again or contact Jude.`,
                    ephemeral: true
                });
            }
        break;
        case "delete_birthday": 
            response = await deleteBirthday(userId);
            interaction.reply({
                content: `I can't seem to recall your birthday.`,
                ephemeral: true
            });
        break;
        case "phas_spirit_box":
            interaction.reply({
                content: spiritBox
            });
        break;
        case "phas_general":
            interaction.reply({
                content: general
            });
        break;
        case "phas_ouija_board":
            interaction.reply({
                content: ouijaBoard
            });
        break;
        case "phas_trig":
            interaction.reply({
                content: toTrigger
            });
        break;
    }

    
}