const Discord = require("discord.js")

module.exports = {
    name: "carteira",
    description: "Veja a quantidade de moedas que você tem na carteira.",
    type: Discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {
        const userDatabase = await client.userDB.findOne({ discordId: interaction.user.id,  username: interaction.user}) || await client.userDB.create({ discordId: interaction.user.id, username: interaction.user })

        let embed = new Discord.EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`💰 Carteira`)
            .setDescription(`Olá ${userDatabase.username}, você possui \`${userDatabase.dinheiro}\` moedas em sua carteira.`)

        interaction.reply({ embeds: [embed] });

    }
}