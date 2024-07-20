const Discord = require("discord.js");
module.exports = {
  name: "ping",
  description: "Vê o ping do bot",
  type: Discord.ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    let ping = client.ws.ping;

    let embed = new Discord.EmbedBuilder()
    .setAuthor({name: client.user.username,iconURL: client.user.displayAvatarURL({ dynamic: true }),})
    .setDescription(`Olá ${interaction.user}, meu ping está em: \`calculando...\`.`)
    .setColor("Random")

    let embed2 = new Discord.EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(`Olá ${interaction.user}, meu ping está em: \`${ping}ms\`.`)
      .setColor("Random");

    interaction.reply({ embeds: [embed] }).then(() => {
      setTimeout(() => {
        interaction.editReply({ embeds: [embed2] });
      }, 2000);
    });
  },
};
