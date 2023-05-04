require("dotenv").config();
const { exec } = require("child_process");


const { DISCORD_TOKEN, GUILD_ID, CHANNEL_ID } = process.env;
const { Client } = require('discord.js');
const { createAudioResource, createAudioPlayer, getVoiceConnection, VoiceConnectionStatus, joinVoiceChannel } = require('@discordjs/voice');

const { createReadStream } = require("node:fs");

const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.NODE_SERVER_PORT;
const client = new Client({
    intents: [
        "Guilds",
        "GuildVoiceStates",
        "GuildMessages",
        "MessageContent"
    ]
});


///--------------------------------------------------------

const fs = require('fs');
const { join } = require("path");

let connectedChannel;
const player = createAudioPlayer()


app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname + "../public")));
app.use(express.static(path.join(__dirname + `../../../../../Music`)));
app.use(express.static(path.join(__dirname + `../../../../../Pictures`)));

client.on('ready', async () => {


    await client.channels.fetch('832424837707857970').then(async channel => {

        connectedChannel = joinVoiceChannel({
            channelId: CHANNEL_ID,
            guildId: GUILD_ID,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: false
        }).subscribe(player);

    });

    client.on("voiceStateUpdate", async (oldState, newState) => {

        let channelId = CHANNEL_ID;

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

        let newUserChannel = newState.channelId;
        let oldUserChannel = oldState.channelId;
        let user = await client.users.fetch(newState.id).then(async u => { return u.username });
        let userId = await client.users.fetch(newState.id).then(async u => { return u.id });
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

            fs.readdir(join(__dirname, '../public/audio_outputs'), (err, files) => {
                if (err) {
                    return console.log(err);
                }

                if (files.includes(`${userId}_joined.wav`)) {
                    let resource = createAudioResource(createReadStream(join(__dirname, `../public/audio_outputs/${userId}_joined.wav`)), { inlineVolume: true });
                    resource.volume.setVolume(0.3);
                    player.play(resource);
                } else {
                    exec(`tts --text "${userName} joined" --model_name "tts_models/en/ljspeech/vits" --out_path ${join(__dirname, `../public/audio_outputs/${userId}_joined.wav`)}`, (err, stdout, stderr) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (stderr) {
                            console.log(stderr);
                            return
                        }
                        let resource = createAudioResource(createReadStream(join(__dirname, `../public/audio_outputs/${userId}_joined.wav`)), { inlineVolume: true });
                        resource.volume.setVolume(0.3);
                        player.play(resource);
                        console.log(stdout);

                    })
                }
            })

        } else if (oldUserChannel === channelId) {

            fs.readdir(join(__dirname, '../public/audio_outputs'), (err, files) => {
                if (err) {
                    return console.log(err);
                }

                if (files.includes(`${userId}_left.wav`)) {
                    let resource = createAudioResource(createReadStream(join(__dirname, `../public/audio_outputs/${userId}_left.wav`)), { inlineVolume: true });
                    resource.volume.setVolume(0.3);
                    player.play(resource);
                } else {

                    exec(`tts --text "${userName} left" --model_name "tts_models/en/ljspeech/vits" --out_path ${join(__dirname, `../public/audio_outputs/${userId}_left.wav`)}`, (err, stdout, stderr) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        if (stderr) {
                            console.log(stderr);
                            return
                        }
                        let resource = createAudioResource(createReadStream(join(__dirname, `../public/audio_outputs/${userId}_left.wav`)), { inlineVolume: true });
                        resource.volume.setVolume(0.3);
                        player.play(resource);
                        console.log(stdout);

                    })


                }
            })


        }
    });


    client.on('messageCreate', async (msg) => {

        if (msg.content.startsWith('say')) {

            let text = msg.content.split(" ");
            text.shift();

            text = text.join(' ')

            exec(`tts --text "${text}" --model_name "tts_models/en/ljspeech/vits" --out_path ${join(__dirname, '../public/audio_outputs/discord_tts.wav')}`, (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    return;
                }
                if (stderr) {
                    console.log(stderr);
                    return
                }
                let resource = createAudioResource(createReadStream(join(__dirname, '../public/audio_outputs/discord_tts.wav')), { inlineVolume: true });
                resource.volume.setVolume(0.3);
                player.play(resource);
                console.log(stdout);

            })

        }

    });

})


client.login(DISCORD_TOKEN);


app.listen(PORT, () => {
    console.log(`NODE server now on port ${PORT}`)
})