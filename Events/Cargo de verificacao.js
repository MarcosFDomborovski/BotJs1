require(`../index`);
const Discord = require("discord.js");
const client = require("../index");
const guildSettings = require("../models/guildSettings");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "verificar") {
      let settings = await guildSettings.findOne({
        guildId: interaction.guild.id,
      });
      if (!settings || !settings.autoRoleId) {
        return interaction.reply({
          content: `Sistema de verificação não configurado!`,
          ephemeral: true,
        });
      }
      let role = interaction.guild.roles.cache.get(settings.autoRoleId);
      if (!role) return;
      if (!interaction.member.roles.cache.get(role.id)) {
        interaction.member.roles.add(role.id);
        interaction.reply({
          content: `Olá **${interaction.user.username}**, você foi verificado!`,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: `Olá **${interaction.user.username}**, você já está com o cargo de verificado!`,
          ephemeral: true,
        });
      }
    }
  }
});
