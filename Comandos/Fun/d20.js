const Discord = require("discord.js")

module.exports = {
    name: "d20",
    description: "Role um dado de 20 lados.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let random = Math.floor(Math.random() * 20) + 1;

        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }), })
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`🎲 Dado Rodado! 🎲`)
            .setDescription(`Parabéns ${interaction.user}! Você girou com sucesso o dado e tirou um **${random}**!`)
            .setTimestamp(Date.now())
        let embedErro = new Discord.EmbedBuilder()
            .setColor("Red")
            .setTitle("Erro")
            .setDescription(`❌ Algo deu errado ao rodar o dado!`)

        interaction.reply({ embeds: [embed] }).catch(e => {
            interaction.reply({ embeds: [embedErro] })
        })
    }
}