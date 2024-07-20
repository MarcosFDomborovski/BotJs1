const Discord = require("discord.js")

module.exports = {
    name: "d12",
    description: "Role um dado de 12 lados.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let random = Math.floor(Math.random() * 12) + 1;

        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setTitle(`Rolando dados...`)
            .setDescription(`O usuário rolou um D12 e tirou: \`${random}\`.`)
        let embedErro = new Discord.EmbedBuilder()
            .setColor("Red")
            .setTitle("Erro")
            .setDescription(`❌ Algo deu errado ao rodar o dado!`)

        interaction.reply({ embeds: [embed] }).catch(e => {
            interaction.reply({ embeds: [embedErro] })
        })
    }
}