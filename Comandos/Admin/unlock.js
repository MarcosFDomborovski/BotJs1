const Discord = require("discord.js");

module.exports = {
    name: "unlock",
    description: "Desbloqueie um canal.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal",
            description: "Mencione um canal para desbloquear o chat.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        },
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true });
        } else {
            let canal = interaction.options.getChannel("canal")
            if(!canal) canal = interaction.channel

            canal.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true }).then(() => {
                if (canal.id !== interaction.channel.id) return interaction.reply({ content: `🔓 O canal de texto ${canal} foi desbloqueado! 🔓` })
                canal.send({ content: `🔓 Este canal foi desbloqueado! 🔓` })
            }).catch(e => {
                interaction.reply({ content: `❌ Ops, algo deu errado.`, ephemeral: true })
            })
        }
    }
}
