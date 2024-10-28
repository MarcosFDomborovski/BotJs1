////////////////////////////////////////////// TESTAR /////////////////////////////////////
const Discord = require("discord.js")
const client = require("../index")
const { QuickDB } = require("quick.db")
const db = new QuickDB();
const Channel = require('../models/config')

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    let channel = await Channel.findOne({ guildId: message.author.guild.id })
    if (!channel || !channel.botMessageCountNumbersId)
        return

    if (message.channel.id !== `${channel.botMessageCountNumbersId}`) return;

    let numberCount = await db.get(`numberCount_${message.channel.id}`)
    if (!numberCount) numberCount = 0;

    if (isNaN(message.content)) return message.reply({ content: `Isso não é um número!` }).then(msg => {
        message.react(`❌`)
        setTimeout(() => {
            msg.delete()
            message.delete()
        }, 2500)
    })

    if (Number(message.content) !== numberCount + 1) {
        return message.reply({ content: `O próximo número é \`${numberCount + 1}\`.` }).then(msg => {
            message.react(`❌`)
            setTimeout(() => {
                msg.delete()
                message.delete()
            }, 4000)
        })
    }
    await db.set(`numberCount_${message.channel.id}`, Number(message.content))
    message.react(`✅`)

})