require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.NODE_SERVER_PORT;
const Discord = require('discord.js');
const client = new Discord.Client();
const Say = require('say').Say;
const say = new Say('win32');
const axios = require("axios");
const googleTTS = require("google-tts-api");
const Canvas = require('canvas')
const textToSpeech = require('@google-cloud/text-to-speech');
const ytdl = require('ytdl-core');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const speechClient = new textToSpeech.TextToSpeechClient();

let connectedChannel;
let channel2;
let dispatcher;


// const router = require("./Routes");


app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname + "../public")));
app.use(express.static(path.join(__dirname + `../../../../../Music`)));
app.use(express.static(path.join(__dirname + `../../../../../Pictures`)));


client.on('ready', async () => {

    // await client.channels.map(c => {
    //     console.log(c)
    // })


    // console.log(client.channels.cache.map(c => {
    //     console.log(c.guild.members.cache.map(c => c.user))
    // }))


    await client.channels.fetch('827348440782340117').then(async channel => {
        connectedChannel = await channel.join();
    });


    // client.channels.cache.get('827815696024993844').send("I'm not a bot, I swear, I'm just very shy.")


});

client.on("voiceStateUpdate", async (oldState, newState) => {

    let channelId = client.voice.connections.find(c => c.channel.type === 'voice').channel.id;

    if (!channelId) {
        return;
    } else if (oldState.serverDeaf !== newState.serverDeaf ||
        oldState.serverMute !== newState.serverMute ||
        oldState.selfDeaf !== newState.selfDeaf ||
        oldState.selfMute !== newState.selfMute ||
        oldState.selfVideo !== newState.selfVideo ||
        oldState.streaming !== newState.streaming) {
        return;
    }

    console.log(newState)

    let newUserChannel = newState.channelID;
    let oldUserChannel = oldState.channelID;
    let user = await client.users.fetch(newState.id).then(async u => { console.log(u); return u.username });
    let userId = await client.users.fetch(newState.id).then(async u => { console.log(u); return u.id });
    let userName;


    switch (userId) {
        case '268212578092580864':
            userName = "Harrison";
            break;
        case '319004973117734913':
            userName = "Matt";
            break;
        case '219518400009994251':
            userName = "Japes";
            break;
        case '320732199592787969':
            userName = "Nick";
            break;
        case '594953556922990607':
            userName = "Cody";
            break;
        case '327210267182366720':
            userName = "Pork";
            break;
        case '333794055114850307':
            userName = "Zac";
            break;
        case '419275595680317440':
            userName = "Josh";
            break;
        case '116633485594066950':
            userName = "Hector";
            break;
        case '226355855627517953':
            userName = "Sean";
            break;
        case '828530052349820938':
            userName = 'Bot';
            break;
        default:
            userName = user;
            break;
    }

    if (newUserChannel === channelId) {
        setTimeout(async () => {

            // await quickStart(`${user} entered the channel.`);
            const url = googleTTS.getAudioUrl(`${userName} joined`, {
                lang: 'en',
                slow: false,
                host: 'https://translate.google.com',
            });

            dispatcher = connectedChannel.play(url, { volume: 1 });

            // dispatcher = connectedChannel.play('http://localhost:9000/voice/googlevoice.mp3', { volume: 1 });
        }, 500)
    } else if (oldUserChannel === channelId) {
        setTimeout(async () => {
            // await quickStart(`${user} left the channel`);
            const url = googleTTS.getAudioUrl(`${userName} left`, {
                lang: 'en',
                slow: false,
                host: 'https://translate.google.com',
            });

            dispatcher = connectedChannel.play(url, { volume: 1 });
            // dispatcher = connectedChannel.play('http://localhost:9000/voice/googlevoice.mp3', { volume: 1 });
        }, 500)
    }
});


client.on('message', async msg => {


    if (msg.content === 'draw') {
        // let { body } = await superagent.get(msg.attachments.first().url);

        let files = fs.readdirSync(path.join(__dirname + `../../../../../Pictures`));

        let random = Math.floor(Math.random() * files.length) + 1;

        // client.on('guildMemberAdd', async member => {
        // // const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
        // // if (!channel) return;

        // const canvas = Canvas.createCanvas(700, 250);
        // const ctx = canvas.getContext('2d');

        // const background = await Canvas.loadImage(`http://localhost:9000/` + files[random]);

        // console.log(background)

        // const imgData = ctx.getImageData(background, canvas.width, canvas.height);

        // // function randomInt(min, max) {
        // //     return Math.floor(Math.random() * (max - min + 1)) + min;
        // // }

        // // for (var i = 0; i < imgData.data.length; i += 4) {
        // //     imgData.data[i] = randomInt(0, 2); // red
        // //     imgData.data[i + 1] = randomInt(0, 10); // green
        // //     imgData.data[i + 2] = randomInt(10, 100); // blue
        // //     imgData.data[i + 3] = 200; // alpha
        // // }
        // const avatar = await Canvas.loadImage(msg.author.displayAvatarURL({ format: 'jpg' }));


        // ctx.putImageData(imgData, 0, 0);
        // ctx.drawImage(avatar, 25, 25, 200, 200);


        // ctx.font = 'italic 18px Arial';
        // ctx.textAlign = 'center';
        // ctx.textBaseline = 'middle';
        // ctx.fillStyle = 'red';  // a color name or by using rgb/rgba/hex values
        // ctx.fillText('Hello World!', 150, 50);


        // const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        // msg.reply(`I'm an artist!`, attachment);


        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');

            // Declare a base size of the font
            let fontSize = 70;

            do {
                // Assign the font to the context and decrement it so it can be measured again
                ctx.font = `${fontSize -= 10}px sans-serif`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (ctx.measureText(text).width > canvas.width - 300);

            // Return the result to use in the actual canvas
            return ctx.font;
        };






        // const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
        // if (!channel) return;

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage(`http://localhost:9000/${files[random]}`);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#74037b';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Slightly smaller text placed above the member's display name
        ctx.font = '28px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

        // Add an exclamation point here and below
        ctx.font = applyText(canvas, `Stupid Cunt!`);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Filthy whore!`, canvas.width / 2.5, canvas.height / 1.8);

        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        const avatar = await Canvas.loadImage(msg.author.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        msg.reply(`Welcome to the server, ${'dumb slut'}!`, attachment);

        // });
    }


    // if (msg.content.length > 40 && msg.author.id !== "828530052349820938") {
    //     msg.channel.send("You talk a lot. I diagnose you with chatty bitch disease.")
    // }

    if (msg.content === 'pause') {
        dispatcher.pause();
    }

    if (msg.content === 'resume') {
        dispatcher.resume();
    }


    if (msg.content.startsWith('duke')) {
        const choice = Math.floor(Math.random() * 14) + 1;

        console.log("hey")

        let files = fs.readdirSync(path.join(__dirname + `../../../../../Music/voice/duke_nukem`))

        dispatcher = connectedChannel.play(`http://localhost:9000/voice/duke_nukem/${files[choice]}`, { volume: 1.5 });

        return;
    }


    if (msg.content.startsWith('say')) {
        let text = msg.content.split(" ");
        text.shift();

        text = text.join(' ')

        // say.getInstalledVoices(null);    

        // Imports the Google Cloud client library
        // const textToSpeech = require('@google-cloud/text-to-speech');

        // // Import other required libraries
        // const fs = require('fs');
        // const util = require('util');
        // // Creates a client
        // const client = new textToSpeech.TextToSpeechClient();
        // async function quickStart(text) {



        //     // const [result] = await client.listVoices({});
        //     // let voices = result.voices;

        //     // console.log('Voices:');

        //     // voices.forEach(v => console.log(v.languageCodes[0].split("-")))

        //     // voices = voices.filter(v => v.languageCodes[0].split("-")[0] === 'en')


        //     // voices.forEach(voice => {
        //     //     console.log(`Name: ${voice.name}`);
        //     //     console.log(`  SSML Voice Gender: ${voice.ssmlGender}`);
        //     //     console.log(`  Natural Sample Rate Hertz: ${voice.naturalSampleRateHertz}`);
        //     //     console.log('  Supported languages:');
        //     //     voice.languageCodes.forEach(languageCode => {
        //     //         console.log(`    ${languageCode}`);
        //     //     });
        //     // });


        //     // The text to synthesize
        //     // const text = 'hello, world!';

        //     // Construct the request
        //     const request = {
        //         input: { text: text },
        //         // Select the language and SSML voice gender (optional)
        //         voice: { languageCode: 'en-US', name: 'en-US-Standard-I' },
        //         // select the type of audio encoding
        //         audioConfig: { audioEncoding: 'MP3' },
        //     };

        //     // Performs the text-to-speech request
        //     const [response] = await client.synthesizeSpeech(request);

        //     // dispatcher = connectedChannel.play(response.audioContent, { volume: 1 });

        //     // Write the binary audio content to a local file
        //     const writeFile = util.promisify(fs.writeFile);
        //     await writeFile(path.join(__dirname + `../../../../../Music/voice/googlevoice.mp3`), response.audioContent, 'binary');
        //     console.log('Audio content written to file: output.mp3');
        // }
        // await quickStart(text);



        const url = googleTTS.getAudioUrl(text, {
            lang: 'en',
            slow: false,
            host: 'https://translate.google.com',
        });

        dispatcher = connectedChannel.play(url, { volume: 1 });


        // say.export(text, null, 1, path.join(__dirname + `../../../../../Music/voice/voice.wav`), (err) => {
        // console.log(err)
        // if (err) {
        //     return console.log(err)
        // }

        // dispatcher = connectedChannel.play('http://localhost:9000/voice/googlevoice.mp3', { volume: 1 });

        //     console.log('here we are')

        // });
    }

});



quickStart = async (text) => {



    // const [result] = await client.listVoices({});
    // let voices = result.voices;

    // console.log('Voices:');

    // voices.forEach(v => console.log(v.languageCodes[0].split("-")))

    // voices = voices.filter(v => v.languageCodes[0].split("-")[0] === 'en')


    // voices.forEach(voice => {
    //     console.log(`Name: ${voice.name}`);
    //     console.log(`  SSML Voice Gender: ${voice.ssmlGender}`);
    //     console.log(`  Natural Sample Rate Hertz: ${voice.naturalSampleRateHertz}`);
    //     console.log('  Supported languages:');
    //     voice.languageCodes.forEach(languageCode => {
    //         console.log(`    ${languageCode}`);
    //     });
    // });


    // The text to synthesize
    // const text = 'hello, world!';

    // Construct the request
    const request = {
        input: { text: text },
        // Select the language and SSML voice gender (optional)
        voice: { languageCode: 'en-US', name: 'en-US-Standard-J' },
        // select the type of audio encoding
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Performs the text-to-speech request
    const [response] = await speechClient.synthesizeSpeech(request);

    // dispatcher = connectedChannel.play(response.audioContent, { volume: 1 });

    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(path.join(__dirname + `../../../../../Music/voice/googlevoice.mp3`), response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
}


client.login(process.env.DISCORD_TOKEN);


app.listen(PORT, () => {
    console.log(`NODE server now on port ${PORT}`)
})