require(`../index`);
const Discord = require("discord.js");
const client = require("../index");
const guildSettings = require("../models/guildSettings");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === "sugestao") {
      let settings = await guildSettings.findOne({
        guildId: interaction.guild.id,
      });
      if (!settings || !settings.suggestionChannelId) {
        return interaction.reply({
          content: `O sistema está desativado.`,
          ephemeral: true,
        });
      }

      const modal = new Discord.ModalBuilder()
        .setCustomId("sugestao")
        .setTitle(`Painel de sugestões`);
      const sugestao = new Discord.TextInputBuilder()
        .setCustomId("sugestaoUsuario")
        .setLabel("Escreva sua sugestão abaixo:")
        .setPlaceholder("Ex: Canal de texto novo, mudar a cor de um cargo...")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Paragraph);

      const sugerir = new Discord.ActionRowBuilder().addComponents(sugestao);

      modal.addComponents(sugerir);
      await interaction.showModal(modal);
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId === "sugestao") {
      let resposta = interaction.fields.getTextInputValue("sugestaoUsuario");
      if (!resposta) resposta = "Não informado.";

      let embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(
          `O usuário ${interaction.user}, enviou a seguinte sugestão:`
        )
        .setFooter({ text: `Data:` })
        .setTimestamp(Date.now())
        .addFields({
          name: "> **Descrição da sugestão:**",
          value: `\`${resposta}\``,
          inline: false,
        });
      interaction.reply({
        content: `Olá **${
          interaction.user
        }**, sua sugestão foi enviada com sucesso no canal ${interaction.guild.channels.cache.get(
          settings.suggestionChannelId
        )}!`,
        ephemeral: true,
      });
      await interaction.guild.channels.cache
        .get(settings.suggestionChannelId)
        .send({ embeds: [embed] });
    }
  }
});
