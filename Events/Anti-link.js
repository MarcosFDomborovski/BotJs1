const Discord = require("discord.js")
const client = require('../index')
const { QuickDB } = require('quick.db')
const db = new QuickDB()

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;

    let confirm = await db.get(`antilink_${message.guild.id}`);

    if (confirm === false || confirm === null) {
        return;
    }
    else if (confirm === true) {
        try {
            let link
            let membro = await client.userDB.findOne({ discordId: message.author.id })
            if (!membro) membro = await client.userDB.create({ discordId: message.author.id, username: message.author.username, })

            if (message.content.toLocaleLowerCase().includes("http")) {
                linkContent = message.content
                link = client.deletedLinks.create({
                    username: message.author.username,
                    discordId: message.author.id,
                    channelId: message.channel.id,
                    url: `${linkContent}`
                })
                message.delete()
                message.channel.send({content: `${message.author}, você não pode enviar links neste chat!`, ephemeral: true})
            }
        } catch (err) {
            console.error(`Erro ao salvar link de ${message.author.username} no canal ${message.channel.name}`, err)
        }
    }
})