const Discord = require("discord.js");
const client = require("../index");
const guildSettings = require("../models/guildSettings");
const antilink = require("../models/antilink");

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator))
    return;

  let settings = await guildSettings.findOne({ guildId: message.guild.id });
  let confirm = settings ? settings.antilink : false;

  if (!confirm) {
    return;
  } else if (confirm === true) {
    try {
      let link;
      let membro = await client.userDB.findOne({
        discordId: message.author.id,
      });
      if (!membro)
        membro = await client.userDB.create({
          discordId: message.author.id,
          username: message.author.username,
        });

      if (message.content.toLocaleLowerCase().includes("http")) {
        linkContent = message.content;
        link = await antilink.create({
          username: message.author.username,
          discordId: message.author.id,
          guildId: message.guild.id,
          channelId: message.channel.id,
          url: `${linkContent}`,
        });
        message.delete();
        message.channel.send({
          content: `${message.author}, você não pode enviar links neste chat!`,
        });
      }
    } catch (err) {
      console.error(
        `Erro ao salvar link de ${message.author.username} no canal ${message.channel.name}`,
        err
      );
    }
  }
});
