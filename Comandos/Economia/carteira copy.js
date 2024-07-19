const Discord = require("discord.js")

module.exports = {
    name: "carteira",
    description: "Veja a quantidade de moedas que você tem na carteira.",
    type: Discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {
        const userDatabase = await client.userDB.findOne({ discordId: interaction.user.id }) || await client.userDB.create({ discordId: interaction.user.id })

        let embed = new Discord.EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`💰 Carteira`)
            .setDescription(`Olá ${userDatabase.discordId}, você possui \`${userDatabase.dinheiro}\` moedas em sua carteira.`)

        interaction.reply({ embeds: [embed] });

    }
}