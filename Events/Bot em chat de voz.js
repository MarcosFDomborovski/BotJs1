const Discord = require("discord.js")
const client = require('../index')
const { joinVoiceChannel } = require('@discordjs/voice')
const Channel = require('../models/config')

client.on("ready", async () => {
    client.guilds.cache.forEach(async (guild) => {
        const channel = await Channel.findOne({ guildId: guild.id })
        if (!channel) {
            const owner = await guild.fetchOwner()
            // const owner = guild.members.cache.get(`474334792830156805`)
            if (owner) {
                owner.send(`❌ Servidor: [${guild.name}] - O bot não conseguiu entrar no canal de voz! Utilize o comando **/botconfig** para configurar os canais! Caso não faça isso, alguns comandos não funcionarão!`)
                console.log(`❌ Servidor: [${guild.name}] - O bot não conseguiu entrar no canal de voz! Utilize o comando **/botconfig** para configurar os canais!`)
            } else {
                console.log(`Servidor: [${guild.name}] Algo deu errado ao pegar informações do dono do servidor.`)
            }
            return
        }
        if (channel.botVoiceChannelId === null || channel.botVoiceChannelId === undefined) {
            return console.log(`Servidor: [${guild.name}] - O canal de voz do bot não foi configurado`)
        }
        let canal = guild.channels.cache.get(`${channel.botVoiceChannelId}`)

        if (!canal || canal === undefined || canal === null) return console.log("❌ Não foi possível entrar no canal de voz!")

        if (canal.type !== Discord.ChannelType.GuildVoice) return console.log(`❌ O canal configurado não é um canal de voz! [ ${canal.name} ]`)
        try {
            joinVoiceChannel({
                channelId: canal.id,
                guildId: canal.guild.id,
                adapterCreator: canal.guild.voiceAdapterCreator,
            })
            console.log(`✅ Conectado ao canal [ ${canal.name} ]`);
        } catch (e) {
            return console.log(`❌ Erro ao conectar ao canal de voz: [ ${canal.name} ].`);
        }
    })
})

// 1264342784505020557 chat de voz do pasteco