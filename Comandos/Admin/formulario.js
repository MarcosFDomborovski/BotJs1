const Discord = require("discord.js");
const guildSettings = require("../../models/guildSettings");
const Channel = require("../../models/config");

module.exports = {
  name: "formulário",
  description: "Abra o painel do formulário para os membros.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal_formulário",
      description:
        "Mencione um canal para enviar o formulário para os membros.",
      type: Discord.ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      )
    ) {
      return interaction.reply({
        content: `Você não tem permissão para utilizar este comando.`,
        ephemeral: true,
      });
    }

    let canal_formulario = interaction.options.getChannel("canal_formulário");

    const channel = await Channel.findOne({ guildId: interaction.guild.id });
    if (!channel || !channel.logsChannelId) {
      return interaction.reply({
        content: `O canal de logs não está configurado!\nUtilize o comando **/botconfig** para configurar o bot.`,
        ephemeral: true,
      });
    }

    let canalLogs = interaction.guild.channels.cache.get(
      `${channel.logsChannelId}`
    );
    if (!canalLogs || canalLogs === undefined) {
      return interaction.reply({
        content: `O canal de logs não está configurado!\nUtilize o comando **/botconfig** para configurar o bot.`,
        ephemeral: true,
      });
    }

    if (canal_formulario.type !== Discord.ChannelType.GuildText) {
      return interaction.reply({
        content: `O canal ${canal_formulario} não é um canal de texto!`,
        ephemeral: true,
      });
    }

    if (
      canalLogs.type !== Discord.ChannelType.GuildText &&
      canalLogs.type !== Discord.ChannelType.PrivateThread
    ) {
      return interaction.reply({
        content: `O canal ${canalLogs} não é um canal de texto!\nConfigure o canal de logs com o comando **/botconfig**.`,
        ephemeral: true,
      });
    }

    let settings = await guildSettings.findOne({
      guildId: interaction.guild.id,
    });
    if (!settings) {
      await guildSettings.create({
        guildId: interaction.guild.id,
        logsChannelId: canalLogs.id,
      });
    } else {
      await guildSettings.updateOne(
        { guildId: interaction.guild.id },
        { logsChannelId: canalLogs.id }
      );
    }

    let embed = new Discord.EmbedBuilder()
      .setColor("Green")
      .setTitle("Canais configurados!")
      .setDescription(
        `> Canal do formulário: ${canal_formulario}.\n> Canal de logs: ${canalLogs}`
      );

    interaction.reply({ embeds: [embed], ephemeral: true }).then(() => {
      let embedFormulario = new Discord.EmbedBuilder()
        .setColor("Random")
        .setTitle("📝 Formulário de Solicitação 📝")
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setDescription("Clique no botão abaixo para preencher o formulário.")
        .addFields({
          name: "Sua resposta nos ajuda a:",
          value:
            "🔹 Melhorar sua experiência com o servidor.\n🔹 Trazer melhorias!",
        })
        .setFooter({
          text: "Sua participação é importante!",
          iconURL: interaction.client.user.displayAvatarURL(),
        })
        .setTimestamp();

      let botao = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("formulario")
          .setEmoji("☝")
          .setLabel("Clique Aqui")
          .setStyle(Discord.ButtonStyle.Primary)
      );

      canal_formulario.send({ embeds: [embedFormulario], components: [botao] });
    });
  },
};
