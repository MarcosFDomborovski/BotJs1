const Discord = require("discord.js");
const antilink = require("../../models/antilink");
const guildSettings = require("../../models/guildSettings");

module.exports = {
  name: "antilink",
  description: "Ative ou desative o sistema de antilink no servidor.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      )
    ) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando!`,
        ephemeral: true,
      });
    } else {
      let embedG = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `Olá ${interaction.user}, o sistema de antilink foi \`ativado\`.`
        )
        .setFooter({ text: `Data de ativação:` })
        .setTimestamp(Date.now());
      let embedR = new Discord.EmbedBuilder()
        .setColor("Red")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setDescription(
          `Olá ${interaction.user}, o sistema de antilink foi \`desativado\`.`
        )
        .setFooter({ text: `Data de desativação:` })
        .setTimestamp(Date.now());

      let settings = await guildSettings.findOne({
        guildId: interaction.guild.id,
      });

      if (!settings || settings.antilink === false) {
        interaction.reply({ embeds: [embedG], ephemeral: true });
        if (!settings) {
          await guildSettings.create({
            guildId: interaction.guild.id,
            antilink: true,
          });
        } else {
          await guildSettings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { antilink: true }
          );
        }
      } else if (settings.antilink === true) {
        interaction.reply({ embeds: [embedR], ephemeral: true });
        await guildSettings.findOneAndUpdate(
          { guildId: interaction.guild.id },
          { antilink: false }
        );
      }
    }
  },
};
