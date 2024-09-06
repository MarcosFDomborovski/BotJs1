const Discord = require("discord.js")
const client = require('../index')
const { QuickDB } = require('quick.db')
const db = new QuickDB()
const Channel = require('../models/config')

client.on("guildMemberAdd", (member) => {
    client.guilds.cache.forEach(async (guild) => {
        const channel = await Channel.findOne({ guildId: guild.id })
        if (!channel || !channel.welcomeChannelId) {
            const owner = await guild.fetchOwner()
            console.log(`O canal de boas vindas não foi configurado!\nConfigure esse canal pelo comando /botconfig.`)
            return owner.send(`O canal de boas vindas não foi configurado!\nConfigure esse canal pelo comando **/botconfig**.`)
        }
        let canalLogs = guild.channels.cache.get(`${channel.welcomeChannelId}`);
        if (!canalLogs) {
            console.log(`Servidor: [${guild.name}] - O canal de boas vindas não foi configurado!\n`)
            owner.send(`Servidor: [${guild.name}] - O canal de boas vindas não foi configurado!\nConfigure pelo comando **/botconfig**.`)
        }

        try {
            let embed = new Discord.EmbedBuilder()
                .setColor('Green')
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`👋 Boas vindas!`)
                .setDescription(`> Olá ${member}!\nseja Bem-Vindo ao servidor \`${member.guild.name}\`\nAtualmente estamos com \`${member.guild.memberCount}\` membros.`)

            member.guild.channels.cache.get(canalLogs).send({ embeds: [embed], content: `${member}` })
        } catch (err) {
            console.log(`Algo deu errado ao enviar a mensagem de boas vindas.`, err)
        }
    });
})

client.on("guildMemberRemove", (member) => {
    client.guilds.cache.forEach(async (guild) => {
        const channel = await Channel.findOne({ guildId: guild.id })
        if (!channel || !channel.welcomeChannelId) {
            const owner = await guild.fetchOwner()
            console.log(`O canal de adeus não foi configurado!\nConfigure esse canal pelo comando /botconfig.`)
            return owner.send(`O canal de adeus não foi configurado!\nConfigure esse canal pelo comando **/botconfig**.`)
        }

        let canal = guild.channels.cache.get(`${channel.leaveChannelId}`)
        if (!canal || canal === undefined || canal === null) {
            console.log(`Servidor: [${guild.name}] - O canal de adeus não foi configurado!\n`)
            owner.send(`Servidor: [${guild.name}] - O canal de adeus não foi configurado!\nConfigure pelo comando **/botconfig**.`)
            return;
        }

        try {
            let embed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setTitle(`👋 Adeus...`)
                .setDescription(`> O usuãrio ${member} saiu do servidor!\n> Espero que volte algum dia..\n> Atualmente estamos com \`${member.guild.memberCount}\` membros.`)

            member.guild.channels.cache.get(canalLogs).send({ embeds: [embed], content: `${member}` })
        } catch (err) {
            console.log(`Algo deu errado ao enviar a mensagem de adeus.`, err)
        }
    })
})