const Discord = require('discord.js')
const client = require('../index')

client.on("inviteCreate", (invite) => {

    const channelLog = invite.guild.channels.cache.get("1264342985256992849")
    const convite = {
        url: invite.url,
        canal: invite.channel,
        timeExpires: invite.expiresAt,
        member: invite.inviter,
        maxUses: invite.maxUses
    }
    if (convite.maxUses === 0) convite.maxUses = 'Ilimitado.'
    if (!convite.timeExpires) {
        convite.timeExpires = "\`Nunca\`"
    } else {
        convite.timeExpires = `<t:${Math.floor(convite.timeExpires / 1000)}:R>`
    }

    const embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setTitle("Convite criado!")
        .addFields(
            {
                name: `> Dono do Convite`,
                value: `${convite.member}`,
                inline: false
            },
            {
                name: `> Canal do Convite`,
                value: `${convite.canal}`,
                inline: false
            },
            {
                name: `URL do Convite`,
                value: `${convite.url}`,
                inline: false
            },
            {
                name: `Máximo de usos do Convite`,
                value: `${convite.maxUses}`,
                inline: false
            },
            {
                name: `> Tempo de uso do Convite`,
                value: `${convite.timeExpires}`,
                inline: false
            },
        )

    channelLog.send({ embeds: [embed] })

})
client.on("inviteDelete", (invite) => {

    const channelLog = invite.guild.channels.cache.get("1264342985256992849")
    const convite = {
        url: invite.url,
        canal: invite.channel,
        timeExpires: invite.createdAt,
        member: invite.inviter,
        memberCount: invite.memberCount
    }

    const embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTitle("Convite Expirado!")
        .addFields(
            {
                name: `> Canal do Convite`,
                value: `${convite.canal}`,
                inline: false
            },
            {
                name: `> URL do Convite`,
                value: `${convite.url}`,
                inline: false
            },
        )

    channelLog.send({ embeds: [embed] })

})