const Discord = require("discord.js");
const client = require("../index");
const Afk = require("../models/afk");

client.on("messageCreate", async (message) => {
  try {
    if (message.author.bot) return;

    const userAfk = await Afk.findOne({
      discordId: message.author.id,
      guildId: message.guild.id,
      isAfk: true,
    });
    if (userAfk) {
      message.reply(`Olá ${message.author}, seu modo AFK foi desativado!`);
      await Afk.updateOne(
        { discordId: message.author.id, guildId: message.guild.id },
        { isAfk: false, reason: "" }
      );
    }
    if (!message.mentions.members) return;
    let afk_user = message.mentions.members.first();
    if (!afk_user) return;

    if (afk_user) {
      let afk_mode = await Afk.findOne({
        discordId: afk_user.id,
        guildId: message.guild.id,
        isAfk: true,
      });
      if (afk_mode) {
        message.reply(
          `Olá ${message.author}, o usuário **${afk_user.user.username}** está com o modo AFK ativado pelo motivo: \`${afk_mode.reason}\`.`
        );
      } else {
        return;
      }
    }
  } catch (error) {}
});
