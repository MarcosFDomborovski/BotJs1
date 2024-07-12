require(`../index`)
const Discord = require("discord.js")
const client = require('../index')


client.on("guildMemberAdd", (member) => {
    let cargoAutoRole = member.guild.roles.cache.get("1131342710737998036")
    if (!cargoAutoRole) return console.log("❌ O AutoRole não está configurado.")

    member.roles.add(cargoAutoRole.id).catch(err => {
        console.log(`❌ Não foi possível adicionar o cargo de AutoRole no usuário ${member.user.tag}.`)
    })
})
