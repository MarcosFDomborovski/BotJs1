require(`../index`)
const Discord = require("discord.js")
const client = require('../index')

// Ao mencionar o bot, ele responderá com uma mensagem.
client.on("messageCreate", (message) => {
    if (message.author.bot) return;

    let mencoes = [`<@${client.user.id}>`, `${client.user.id}>`]

    mencoes.forEach(element => {

        // if (message.content.includes(element))  caso queira que o bot responda a qualquer mensagem que ele seja mencionado.
        if (message.content === element) {
            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`🛠 Olá ${message.author}, utilize \`/help\` para ver meus comandos!`)

            message.reply({ embeds: [embed], ephemeral: true })
        } 
    })
})