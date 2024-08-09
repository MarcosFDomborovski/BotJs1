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
                .setDescription(`Olá ${interaction.user}, o sistema foi adicionado com sucesso no canal ${canal} com sucesso.`)

            let embedTickets = new Discord.EmbedBuilder()
            .setColor("Random")
            .setTitle("📩 Suporte ao Cliente 📩")
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setDescription(`Clique no botão abaixo para abrir um ticket e falar diretamente com nossa equipe de suporte.`)
            .addFields(
                { name: 'O que você pode fazer:', value: '🔹 Reportar problemas\n🔹 Fazer perguntas\n🔹 Solicitar ajuda' }
            )
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter({ text: "Estamos aqui para ajudar!", iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

            let botao = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("ticketsBasico")
                    .setEmoji("🎫")
                    .setLabel("Abrir Ticket!")
                    .setStyle(Discord.ButtonStyle.Primary)
            );

            interaction.reply({ embeds: [embedEphemeral], ephemeral: true }).then(() => {
                canal.send({ embeds: [embedTickets], components: [botao] })
            })
        }
    }
}
