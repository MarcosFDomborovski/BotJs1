const Discord = require("discord.js")

module.exports = {
    name: "carteira",
    description: "Veja a quantidade de moedas que você tem na carteira.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let userDatabase = await client.userDB.findOne({ discordId: interaction.user.id})
        if(!userDatabase) userDatabase = await client.userDB.create({ discordId: interaction.user.id, username: interaction.user.username })

        let embed = new Discord.EmbedBuilder()
        .setColor("#FFD700")
        .setTitle("💰 Carteira 💰")
        .setDescription(`Olá <@${userDatabase.discordId}>, aqui estão os detalhes da sua carteira:`)
        .addFields(
            { name: "Moedas", value: `\`${userDatabase.dinheiro}\``, inline: true },
            { name: "Status", value: userDatabase.dinheiro > 0 ? "💵 Ricaço!" : "🚫 Pobre!", inline: true }
        )
        .setFooter({ text: "Consulta realizada em:" })  
        .setTimestamp(Date.now());

        await interaction.reply({ embeds: [embed] });
    }
}