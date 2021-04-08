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


let connectedChannel;
let dispatcher;


// const router = require("./Routes");


app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname + "../public")));
app.use(express.static(path.join(__dirname + `../../../../../Music`)));
app.use(express.static(path.join(__dirname + `../../../../../Pictures`)));

// app.use(router);


client.on('ready', async () => {
    await client.channels.fetch('827815696024993844').then(async channel => {
        connectedChannel = await channel.join();

    });


    // client.channels.cache.get('827815696024993844').send("I'm not a bot, I swear, I'm just very shy.")


});

client.on("voiceStateUpdate", async (oldMember, newMember) => {

    let newUserChannel = newMember.channelID;
    let oldUserChannel = oldMember.channelID;

    if (oldUserChannel !== "827815696024993844" && newUserChannel === "827815696024993844") {
        console.log("whats up you musty bitch");
        setTimeout(async () => {
            await quickStart("We'll talk about it later");
            dispatcher = connectedChannel.play('http://localhost:8080/voice/googlevoice.mp3', { volume: 1 });
        }, 2000)

    }

});




client.on('message', async msg => {


    if (msg.content === 'smile random') {
        // let { body } = await superagent.get(msg.attachments.first().url);

        let files = fs.readdirSync(path.join(__dirname + `../../../../../Pictures`));

        let random = Math.floor(Math.random() * files.length) + 1;

        // client.on('guildMemberAdd', async member => {
        // const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
        // if (!channel) return;

        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');


        var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        for (var i = 0; i < imgData.data.length; i += 4) {
            imgData.data[i] = randomInt(0, 2); // red
            imgData.data[i + 1] = randomInt(0, 10); // green
            imgData.data[i + 2] = randomInt(10, 100); // blue
            imgData.data[i + 3] = 200; // alpha
        }
        const avatar = await Canvas.loadImage(msg.author.displayAvatarURL({ format: 'jpg' }));


        ctx.putImageData(imgData, 0, 0);
        ctx.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

        msg.reply(`I'm an artist!`, attachment);
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

        let files = fs.readdirSync(path.join(__dirname + `../../../../../Music/voice/duke_nukem`))

        dispatcher = connectedChannel.play(`http://localhost:8080/voice/duke_nukem/${files[choice]}`, { volume: 1.5 });

        return;
    }


    if (msg.content.startsWith('say')) {
        let text = msg.content.split(" ");
        text.shift();

        text = text.join(' ')

        say.getInstalledVoices(null);







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
        await quickStart(text);



        // const url = googleTTS.getAudioUrl(text.join(' '), {
        //     lang: 'en',
        //     slow: false,
        //     host: 'https://translate.google.com',
        // });

        // dispatcher = connectedChannel.play(url, { volume: 1 });


        // say.export(text, null, 1, path.join(__dirname + `../../../../../Music/voice/voice.wav`), (err) => {
        // console.log(err)
        // if (err) {
        //     return console.log(err)
        // }

        dispatcher = connectedChannel.play('http://localhost:8080/voice/googlevoice.mp3', { volume: 1 });

        //     console.log('here we are')

        // });
    }

});


const textToSpeech = require('@google-cloud/text-to-speech');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const speechClient = new textToSpeech.TextToSpeechClient();
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
        voice: { languageCode: 'en-US', name: 'en-US-Standard-I' },
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