const Discord = require('discord.js')
const client = require('../../index')
const User = require("../../models/user")

module.exports = {
    name: "config",
    description: "Configure o bot para o seu servidor.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal_de_logs",
            description: "Mencione o canal onde será enviado as logs do bot.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "canal_de_sugestoes",
            description: "Mencione o canal onde serão enviadas as sugestões dos usuários.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        }
    ],

    run: async (client, interaction) =>{
        let user = await User.findOne({discordId: interaction.user.id})
        if(!user){
            user = new User({discordId: interaction.user.id, username: interaction.user.username, mensagens: 0})
        }
        
        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)){
            interaction.reply({content: `Olá ${interaction.user}, você não possui permissão para utilizar este comando!`, ephemeral: true});
        } else {
            const logsChannel = interaction.options.getChannel("canal_de_logs");
            const suggestionsChannel = interaction.options.getChannel("canal_de_sugestoes");
        }







    }
}