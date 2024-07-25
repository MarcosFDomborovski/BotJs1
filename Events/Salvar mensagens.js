const Discord = require("discord.js")
const client = require('../index')

client.on("messageCreate", async (message) => {
    if (!message.content || message.content.trim() === '') return;
    try {
        let membro = await client.userMessages.findOne({ discordId: message.author.id })
        if (!membro) {
            membro = await client.userMessages.create({
                username: message.author.username,
                discordId: message.author.id,
                content: message.content,
                channelId: message.channel.id
            })
        }

    } catch (err) {
        console.error(`Erro ao salvar mensagem: de ${message.author.username} no canal #${message.channel.name}\n`, err)
    }
})