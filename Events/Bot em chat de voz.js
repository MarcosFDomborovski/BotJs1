///////////////////////////////// TESTAR OUTRA HORA ///////////////////////////////////////

const Discord = require("discord.js")
const client = require('../index')
const Channel = require('../models/config')
const { joinVoiceChannel } = require('@discordjs/voice')

client.on("ready", async () => {


    const channel = await Channel.findOne({guildId: interaction.guild.id})
    if (!channel || !channel.botVoiceChannelId){
        console.log(`O bot não conseguiu se conectar ao chat de voz!\nVerifique se o canal foi configurado corretamente com o comando /botconfig`)

    }

    const owner = await guild.fetchOwner()
    if(owner){
        owner.send(`O bot não foi configurado, utilize o comando "/botconfig", para configurar os canais!\nCaso não faça isso, alguns comandos não funcionarão!`)
    }


    let canal = client.channels.cache.get("1264342784505020557")
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

// 1264342784505020557 chat de voz do pasteco