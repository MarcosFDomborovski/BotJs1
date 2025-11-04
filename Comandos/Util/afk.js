const Discord = require("discord.js");
const Afk = require("../../models/afk");
const { slashCommands } = require("../..");

module.exports = {
  name: "afk",
  description: "Ative o modo AFK.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "motivo",
      description: "Escreva o motivo da inatividade.",
      type: Discord.ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  run: async (client, interaction) => {
    let motivo = interaction.options.getString("motivo");node 
    let afk = slaporra;

    let afk_mode = await Afk.findOne({
      discordId: interaction.user.id,
      guildId: interaction.guild.id,
    });

    if (afk_mode?.isAfk === true) {
      interaction.reply({
        content: `Olá ${interaction.user}, seu modo AFK já está ativado.`,
        ephemeral: true,
      });
    } else {
      if (!afk_mode) {
        await Afk.create({
          discordId: interaction.user.id,
          guildId: interaction.guild.id,
          isAfk: true,
          reason: motivo,
        });
      } else {
        await Afk.updateOne(
          { discordId: interaction.user.id, guildId: interaction.guild.id },
          { isAfk: true, reason: motivo }
        );
      }
      interaction.reply({
        content: `Olá ${interaction.user}, seu modo AFK foi ativado com sucesso!`,
        ephemeral: true,
      });
    }
  },
};
