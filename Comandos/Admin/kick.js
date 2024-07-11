const Discord = require("discord.js")
const { description } = require("./lock")

module.exports = {
    name: "kick",
    description: "Expulse um membro do servidor.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "Mencione um membro para expulsar.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Descreva o motivo da expulsão.",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.KickMembers)) {
            interaction.reply({ content: `Você não tem permissão para utilizar este comando.` })
        } else {
            const user = interaction.options.getUser("membro");
            const membro = interaction.guild.members.cache.get(user.id);
            const motivo = interaction.options.getString("motivo")

            if (!motivo) motivo = "Não especificado.";

            let embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setDescription(`O usuário ${membro} foi expulso com sucesso!\n\nMotivo: \`${motivo}\`.`)

            let embed2 = new Discord.EmbedBuilder()
                .setColor("Red")
                .setDescription(`Ocorreu um erro ao expulsar o usuário ${membro}. Por favor tente novamente.`)

            membro.kick({ reason: [motivo] }).then(() => {
                interaction.reply({ embeds: [embed] })
            }).catch(e => {
                interaction.reply({ embeds: [embed2] })
            })




        }
    }








}