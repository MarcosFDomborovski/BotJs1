const Discord = require("discord.js")
const User = require("../../models/user")

module.exports = {
    name: "punir",
    description: "Puna um usuário do Discord proibindo ele de entrar em canais de voz.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            description: "Mencione o usuário a ser punido.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Digite o motivo da punição.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async(client, interaction) =>{
        const usuario = interaction.options.get("usuario").user
        const motivo = interaction.options.getString("motivo")

        if(!interaction.member.Discord.has(Discord.PermissionFlagsBits.ModerateMembers)){
            interaction.reply({ content: "Você não tem permissão para utilizar este comando.", ephemeral: true })
            return;
        }






    }
}