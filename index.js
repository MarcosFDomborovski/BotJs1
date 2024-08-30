const Discord = require("discord.js")
const Database = require("./config/database")
const db = new Database;
require("dotenv").config();

db.connect();

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

client.on('ready', () => {
    console.log(`🔥 O bot ${client.user.username} ta online!`)
})

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
client.deletedLinks = require("./models/anti-link")