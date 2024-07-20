const Discord = require("discord.js")
const Video = require("../../models/video")
module.exports = {
    name: "video",
    description: "Armazenar um vídeo.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "link",	
            type: Discord.ApplicationCommandOptionType.String,
            description: "Coloque o link do vídeo.",
            required: true,
        },
        {
            name: "linkthumb",
            type: Discord.ApplicationCommandOptionType.String,
            description: "Coloque o link da thumbnail.",
            required: true,
        }
    ],
    run: async (client, interaction) => {
        const videoLink = interaction.options.getString("link");
        const thumbLink = interaction.options.getString("linkthumb");

        await Video.create({
            url: videoLink,
            thumbnail: thumbLink,
        });
        await interaction.reply(`${videoLink}, ${thumbLink} registrados com sucesso.`);
    }
}