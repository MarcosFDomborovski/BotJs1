const Discord = require("discord.js")
const client = require('../index')
const {QuickDB} = require('quick.db')
const db = new QuickDB()

client.on('messageCreate', async (message) =>{
    await db.add(`messageCounter_${message.author.id}`, 1)
})