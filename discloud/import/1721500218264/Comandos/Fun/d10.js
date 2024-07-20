const Discord = require("discord.js")

module.exports = {
    name: "d10",
    description: "Role um dado de 10 lados.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let random = Math.floor(Math.random() * 10) + 1;

        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Rolando dados...`)
            .setDescription(`O usuário rolou um D10 e tirou: \`${random}\`.`)
        let embedErro = new Discord.EmbedBuilder()
            .setColor("Red")
            .setTitle("Erro")
            .setDescription(`❌ Algo deu errado ao rodar o dado!`)

        interaction.reply({ embeds: [embed] }).catch(e => {
            interaction.reply({ embeds: [embedErro] })
        })
    }
}