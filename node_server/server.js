require("dotenv").config();
const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.NODE_SERVER_PORT;
const Discord = require('discord.js');
const client = new Discord.Client();


// const router = require("./Routes");


app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static(path.join(__dirname + "../public")));

// app.use(router);


client.on('ready', async () => {
    client.channels.fetch('827815696024993844').then(async channel => {
        connectedChannel = await channel.join();

    })
});

client.on('message', async msg => {
    msg.reply("I diagnose you with gay.")
});


client.login(process.env.DISCORD_TOKEN);


app.listen(PORT, () => {
    console.log(`NODE server now on port ${PORT}`)
})