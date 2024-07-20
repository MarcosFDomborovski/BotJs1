const Discord = require("discord.js")
const client = require('../index')
const { QuickDB } = require('quick.db')
const db = new QuickDB()

client.on("guildMemberAdd", (member) => {
    let canalLogs = "1131707660593537175";
    if (!canalLogs) return;

    let embed = new Discord.EmbedBuilder()
        .setColor('Green')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`👋 Boas vindas!`)
        .setDescription(`> Olá ${member}!\nseja Bem-Vindo ao servidor \`${member.guild.name}\`\nAtualmente estamos com \`${member.guild.memberCount}\` membros.`)

    member.guild.channels.cache.get(canalLogs).send({ embeds: [embed], content: `${member}` })
})

client.on("guildMemberRemove", (member) => {
    let canalLogs = "1131707660593537175";
    if (!canalLogs) return;

    let embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`👋 Adeus...`)
        .setDescription(`> O usuãrio ${member} saiu do servidor!\n> Espero que volte algum dia..\n> Nos sobrou apenas \`${member.guild.memberCount}\` membros.`)

    member.guild.channels.cache.get(canalLogs).send({ embeds: [embed], content: `${member}` })
})