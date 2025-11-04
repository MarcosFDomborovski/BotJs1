const Discord = require("discord.js");
const guildSettings = require("../../models/guildSettings");

module.exports = {
  name: "verificação",
  description: "Ative o sistema de verificação",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "cargo_verificado",
      description:
        "Mencione um cargo para o membro receber após ser verificado.",
      type: Discord.ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "canal",
      description: "Mencione um canal de texto.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: false,
    },
  ],

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
      let canal = interaction.options.getChannel("canal");
      if (!canal) canal = interaction.channel;

      let cargo = interaction.options.getRole("cargo_verificado");
      let settings = await guildSettings.findOne({
        guildId: interaction.guild.id,
      });
      if (!settings) {
        await guildSettings.create({
          guildId: interaction.guild.id,
          autoRoleId: cargo.id,
        });
      } else {
        await guildSettings.updateOne(
          { guildId: interaction.guild.id },
          { autoRoleId: cargo.id }
        );
      }

      let embedEphemeral = new Discord.EmbedBuilder()
        .setColor("Grey")
        .setDescription(
          `Olá ${interaction.user}, o sistema de verificação foi ativado no canal ${canal} com sucesso.`
        );

      let embedVerificacao = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription(
          `> Clique no botão abaixo para fazer sua verificação no servidor.`
        )
        .setTitle(`✅ Faça sua verificação aqui! ✅`);

      let botao = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("verificar")
          .setEmoji("✅")
          .setLabel("Verifique-se")
          .setStyle(Discord.ButtonStyle.Primary)
      );

      interaction
        .reply({ embeds: [embedEphemeral], ephemeral: true })
        .then(() => {
          canal.send({ embeds: [embedVerificacao], components: [botao] });
        });
    }
  },
};
