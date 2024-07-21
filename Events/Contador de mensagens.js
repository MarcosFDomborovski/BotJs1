const Discord = require("discord.js")
const client = require('../index')

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    let messageCount = await client.userDB.findOne({ discordId: message.author.id })

    if (!messageCount) {
        messageCount = await client.userDB.create({ discordId: message.author.id, mensagens: 0 });
    }

    messageCount.mensagens += 1;
    await messageCount.save();
});
