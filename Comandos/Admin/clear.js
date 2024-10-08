const Discord = require("discord.js");
const client = require('../../index');
client.cooldowns = new Map();

module.exports = {
  name: "clear",
  description: "Limpe o chat.",
  type: Discord.ApplicationCommandType.ChatInput,
  options: [
    {
      name: "quantidade",
      description: "Quantidade de mensagens que deseja limpar.",
      type: Discord.ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  cooldown: 5000,

  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const now = Date.now();
    const cooldown = client.cooldowns.get(userId) || 0;

    if (now - cooldown < module.exports.cooldown) {
      const remaining = Math.ceil((module.exports.cooldown - (now - cooldown)) / 1000);
      const reply = await interaction.reply({ content: `Você precisa esperar ${remaining} segundo(s) antes de usar o comando novamente.`, ephemeral: true });
      setTimeout(async () => {
        try {
          await interaction.editReply({ content: 'Esta mensagem foi removida.', embeds: [], components: [],  ephemeral: true });
          reply.delete();
        } catch (error) {
          console.error('Erro ao editar a resposta:', error);
        }
      }, remaining * 1000); 
      return;
    }

    client.cooldowns.set(userId, now);
    
    let numero = interaction.options.getNumber("quantidade");

    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({
        content: `Você não possui permissão para utilizar este comando!`,
        ephemeral: true
      });
    }

    if (parseInt(numero) > 99 || parseInt(numero) <= 0) {
      let embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setDescription(`\`/clear [1 - 99]\``);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    try {
      const fetchedMessages = await interaction.channel.messages.fetch({ limit: numero });

      if (fetchedMessages.size === 0) {
        let embed = new Discord.EmbedBuilder()
          .setColor("Red")
          .setDescription(`Não há mensagens suficientes para deletar.`);
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const deletedMessages = await interaction.channel.bulkDelete(fetchedMessages, true);

      let embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL({ dynamic: true })
        })
        .setDescription(`O canal de texto ${interaction.channel} teve \`${deletedMessages.size}\` mensagens deletadas por \`${interaction.user.username}\`.`);
      const reply = await interaction.reply({ embeds: [embed], ephemeral: true });

      setTimeout(async () => {
        try {
          await interaction.deleteReply();
        } catch (error) {
          console.error('Erro ao deletar a resposta:', error);
        }
      }, 5000); 

    } catch (error) {
      console.error(error);
      let embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setDescription(`Ocorreu um erro ao tentar deletar as mensagens. Certifique-se de que as mensagens não são mais antigas que 14 dias e que há mensagens suficientes para deletar.`);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
}
