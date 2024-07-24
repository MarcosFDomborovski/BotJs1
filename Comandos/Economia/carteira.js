const Discord = require("discord.js")

module.exports = {
    name: "carteira",
    description: "Veja a quantidade de moedas que você tem na carteira.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let userDatabase = await client.userDB.findOne({ discordId: interaction.user.id})
        if(!userDatabase) userDatabase = await client.userDB.create({ discordId: interaction.user.id, username: interaction.user.username })

        let embed = new Discord.EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`💰 Carteira`)
            .setDescription(`Olá <@${userDatabase.discordId}>, você possui \`${userDatabase.dinheiro}\` moedas em sua carteira.`)

        await interaction.reply({ embeds: [embed] });
    }
}