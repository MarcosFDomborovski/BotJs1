const Discord = require("discord.js");

module.exports = {
  name: "clear",
  description: "Limpa o chat",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "quantidade",
      description: "Quantidade de mensagens que deseja limpar",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  run: async (client, interaction) => {
    let numero = interaction.options.getNumber("quantidade");

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
      interaction.reply({
        content: `Você não possui permissão para utilizar este comando!`,
        ephemeral: true
      });
    } else {
      if (parseInt(numero) > 99 || parseInt(numero) <= 0) {
        let embed = new Discord.EmbedBuilder()
          .setColor("Red")
          .setDescription(`\`/clear [1 - 99]\``);
        interaction.reply({ embeds: [embed] });
      } else {
        interaction.channel.bulkDelete(parseInt(numero))

        let embed = new Discord.EmbedBuilder()
          .setColor("Green")
          .setAuthor({
            name: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ dynamic: true })
          })
          .setDescription(
            `O canal de texto ${interaction.channel} teve \`${numero}\` mensagens deletadas por \`${interaction.user.username}\`.`
          )
        interaction.reply({ embeds: [embed] });

        let apagarMensagem = "sim";

        if (apagarMensagem === "sim") {
          setTimeout(() => {
            interaction.deleteReply();
          }, 5000);
        } else if (apagarMensagem === "nao") {
          return;
        }
      }
    }
  },
};
