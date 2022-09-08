const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discordjs");
const { QueryType } = require("discord-player");


// This is for future reference

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("loads songs from youtube")
        .addSubcommand((subcommand) => {
            subcommand
                .setName("song")
                .setDescription("Loads a single song from a url")
                .addStringOption((option) => option.setName("url"))
        })
        .addSubcommand((subcommand) => {
            subcommand
                .setName("playlist")
                .setDescription("Loads a playlist of songs from a url")
                .addStringOption((option) => option.setName("url").setDescription("the playlist's url"))
        })
        .addSubcommand((subcommand) => {
            subcommand
                .setname("search")
                .setDescription("Searches for song based on provided keywords")
                .addStringOption((option) => {
                    option.setName("searchterms").setDescription("the search keywords").setRequired(true)
                })
        }),
    run: async ({ client, interaction }) => {
        if (!interaction.member.voice.channel) {
            return interaction.editReply("You need to be in a VC to use this command")
        }

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) {
            await queue.connect(interaction.member.voice.channel)
        }

        let embed = new MessageEmbed()

        if (interaction.options.getSubcommand === "song") {
            let url = interaction.options.getString("url")
            const result = client.plater.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO

            })
            if (SpeechRecognitionResultList.tracks.length === 0) {
                return interaction.editReply("No Results")
            }

            const song = result.tracks[0];
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` })

        } else if (interaction.options.getSubcommand() === "playlist") {

        } else if (interaction.options.getSubcommand() === "search") {

        }
    }
}