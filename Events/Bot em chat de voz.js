const Discord = require("discord.js")
const client = require('../index')
const { joinVoiceChannel } = require('@discordjs/voice')

client.on("ready", () => {
    let canal = client.channels.cache.get("1132384009503133807")
    if (!canal) return console.log("❌ Não foi possível entrar no canal de voz!")
    if (canal.type !== Discord.ChannelType.GuildVoice) return console.log(`❌ Erro ao conectar ao canal de voz: [ ${canal.name} ]`)
    try {
        joinVoiceChannel({
            channelId: canal.id,
            guildId: canal.guild.id,
            adapterCreator: canal.guild.voiceAdapterCreator,
        })
        console.log(`✅ Conectado ao canal [ ${canal.name} ]`);
    } catch (e) {
        console.log(`❌ Erro ao conectar ao canal de voz: [ ${canal.name} ].`);
    }
})