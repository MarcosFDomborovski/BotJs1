const Discord = require("discord.js");

module.exports = {
    name: "help",
    description: "Painel de comandos do bot.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        let embedPainel = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, veja meus comandos interagindo com o painel abaixo:`)

        let embedUtilidade = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, veja meus comandos de **utilidade** abaixo:`)

        let embedDiversao = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, veja meus comandos de **diversão** abaixo:`)

        let embedAdm = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, veja meus comandos de **administração** abaixo:`)

        let painel = new Discord.ActionRowBuilder().addComponents(
            new Discord.SelectMenuBuilder()
                .setCustomId("painelTicket")
                .setPlaceholder("CLique aqui!")
                .addOptions({
                    label: "Painel Inicial",
                    emoji: "📚",
                    value: "painel",
                },
                    {
                        label: "Utilidade",
                        description: "Veja meus comandos de utilidade.",
                        emoji: "✨",
                        value: "utilidade",
                    },
                    {
                        label: "Diversão",
                        description: "Veja meus comandos de diversão.",
                        emoji: "😂",
                        value: "diversao",
                    },
                    {
                        label: "Administração",
                        description: "Veja meus comandos de administração.",
                        emoji: "🛠",
                        value: "adm",
                    }
                ))
        interaction.reply({ embeds: [embedPainel], components: [painel], ephemeral: true }).then(() => {
            interaction.channel.createMessageComponentCollector().on("collect", (c) => {
                let valor = c.values[0];

                if (valor === "painel") {
                    c.deferUpdate();
                    interaction.editReply({ embeds: [embedPainel] })
                } else if (valor === "utilidade") {
                    c.deferUpdate();
                    interaction.editReply({ embeds: [embedUtilidade] })
                } else if (valor === "diversao") {
                    c.deferUpdate();
                    interaction.editReply({ embeds: [embedDiversao] })
                } else if (valor === "adm") {
                    c.deferUpdate();
                    interaction.editReply({ embeds: [embedAdm] })
                }
            })
        })
    }
}
