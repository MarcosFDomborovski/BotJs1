const Discord = require("discord.js")
const Database = require("./config/database")
const db = new Database;
require("dotenv").config();
require("colors")
db.connect();

require("./logger.js")

process.on("uncaughtException", (err) => {
    console.log(`${'o'.red} Erro não tratado: ${err.message}`.white)
    process.exit(1);
})

process.on("unhandledRejection", (err) => {
    console.log(`${'o'.red} Erro não tratado: ${err.message}`.white)
})

const client = new Discord.Client({
    intents: [1, 512, 32768, 2, 128,
        Discord.IntentsBitField.Flags.DirectMessages,
        Discord.IntentsBitField.Flags.GuildInvites,
        Discord.IntentsBitField.Flags.GuildMembers,
        Discord.IntentsBitField.Flags.GuildPresences,
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.MessageContent,
        Discord.IntentsBitField.Flags.Guilds,
        Discord.IntentsBitField.Flags.GuildMessageReactions,
        Discord.IntentsBitField.Flags.GuildVoiceStates,
        Discord.IntentsBitField.Flags.GuildMessages
    ],
    partials: [
        Discord.Partials.User,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
    ]
})
module.exports = client

client.on('interactionCreate', (interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const cmd = client.slashCommands.get(interaction.commandName)
        if (!cmd) return interaction.reply('Error');
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction)
    }
})

client.on('clientReady', () => {
    console.log(' o'.green + ` O bot ${client.user.username} ta online em ${client.guilds.cache.size} servidores!`.white)
})

function isClientConnected() {
    return client && client.isReady()
}

async function reconnectClient() {
    if(!isClientConnected()){
        try{
            await client.login(process.env.TOKEN)
            console.log(' o'.green + `Bot ${client.user.username} reconectado com sucesso!`.white)
            return true
        } catch (error) {
            console.log(' o'.red + `Erro ao reconectar o bot: ${error}`.white)
            return false
        }
    }
    return true
}

setInterval(async () => {
    const connected = await reconnectClient();
    if(!connected){
        console.log(' o'.red + `Bot ${client.user.username} desconectado!`.white)
    }
}, 10000)

client.slashCommands = new Discord.Collection()
require('./handler')(client)
client.login(process.env.TOKEN)

const fs = require('fs')
fs.readdir('./Events', (err, file) => {
    file.forEach(event => {
        require(`./Events/${event}`)
    })
})

client.userDB = require("./models/user")
client.userMessages = require("./models/messages")
client.deletedLinks = require("./models/antilink")
client.afk = require("./models/afk")
client.guildSettings = require("./models/guildSettings")
client.counters = require("./models/counters")