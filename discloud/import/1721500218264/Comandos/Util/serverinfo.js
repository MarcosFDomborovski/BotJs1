const Discord = require("discord.js");

module.exports = {
    name: "serverinfo",
    description: "Envia informações sobre o servidor.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let nome = interaction.guild.name;
        let id = interaction.guild.id;
        let icon = interaction.guild.iconURL({ dynamic: true });

        let criacao = interaction.guild.createdAt.toLocaleDateString("pt-br");
        let membros = interaction.guild.members.cache.size;

        const canaisTotal = interaction.guild.channels.cache.size;
        const canaisTexto = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildText).size;
        const canaisVoz = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildVoice).size;
        const canaisCategoria = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildCategory).size;

        const embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: nome, iconURL: icon })
            .setThumbnail(icon)
            .setTitle(`Serverinfo: ${nome}`)
            .addFields(
                {
                    name: `💻 Nome:`,
                    value: `\`${nome}\``,
                    inline: true
                },
                {
                    name: `🆔 ID:`,
                    value: `\`${id}\``,
                    inline: true
                },
                {
                    name: `👥 Membros:`,
                    value: `\`${membros + 1}\``,
                    inline: true
                },
                {
                    name: `📆 Criação:`,
                    value: `\`${criacao}\``,
                    inline: true
                },
                {
                    name: `📥 Canais totais:`,
                    value: `\`${canaisTotal}\``,
                    inline: true
                },
                {
                    name: `📝 Canais de texto:`,
                    value: `\`${canaisTexto}\``,
                    inline: false
                },
                {
                    name: `🔊 Canais de voz:`,
                    value: `\`${canaisVoz}\``,
                    inline: false
                },
                {
                    name: `📅 Categorias:`,
                    value: `\`${canaisCategoria}\``,
                    inline: false
                }
            );

        const botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setURL(icon)
                .setLabel("Ícone do servidor")
                .setStyle(Discord.ButtonStyle.Link)
        )

        interaction.reply({ embeds: [embed], components: [botao] })
    }
}
