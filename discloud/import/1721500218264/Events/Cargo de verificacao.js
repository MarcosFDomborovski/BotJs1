require(`../index`)
const Discord = require("discord.js")
const client = require('../index')
const {QuickDB} = require('quick.db')
const db = new QuickDB()

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "verificar") {
            let roleId = await db.get(`cargo_verificação_${interaction.guild.id}`)
            let role = interaction.guild.roles.cache.get(roleId)
            if (!role) return;
            interaction.member.roles.add(role.id)
            interaction.reply({ content: `Olá **${interaction.user.username}**, você foi verificado!`, ephemeral: true })
        }
    }
})