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
        let owner = await client.users.fetch(interaction.guild.ownerId);
        
        const canaisTotal = interaction.guild.channels.cache.size;
        const canaisTexto = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildText).size;
        const canaisVoz = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildVoice).size;
        const canaisCategoria = interaction.guild.channels.cache.filter(c => c.type === Discord.ChannelType.GuildCategory).size;

        const embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: nome, iconURL: icon })
            .setThumbnail(icon)
            .setTitle(`Informações do servidor: **${nome}**`)
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
                    name: `👑 Dono:`,
                    value: `\`${owner.username}\``,
                    inline: true
                },
                {
                    name: `👥 Membros:`,
                    value: `\`${membros}\``,
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
                    inline: true
                },
                {
                    name: `🔊 Canais de voz:`,
                    value: `\`${canaisVoz}\``,
                    inline: true
                },
                {
                    name: `📅 Categorias:`,
                    value: `\`${canaisCategoria}\``,
                    inline: true
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
