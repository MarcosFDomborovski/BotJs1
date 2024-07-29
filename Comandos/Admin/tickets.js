const Discord = require("discord.js");

module.exports = {
    name: "tickets",
    description: "Ative o sistema de tickets no servidor",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal",
            description: "Mencione um canal de texto",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true });
        } else {
            let canal = interaction.options.getChannel("canal")
            if (!canal) canal = interaction.channel;

            let embedEphemeral = new Discord.EmbedBuilder()
                .setColor("Green")
                .setDescription(`Olá ${interaction.user}, o sistema foi adicionado com sucesso em ${canal} com sucesso.`)

            let embedTickets = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`> Clique no botão abaixo para abrir um ticket!`)

            let botao = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("ticketsBasico")
                    .setEmoji("🎫")
                    .setStyle(Discord.ButtonStyle.Primary)
            );

            interaction.reply({ embeds: [embedEphemeral], ephemeral: true }).then(() => {
                canal.send({ embeds: [embedTickets], components: [botao] })
            })
        }
    }
}
