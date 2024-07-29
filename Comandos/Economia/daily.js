const Discord = require("discord.js");

module.exports = {
  name: "daily",
  description: "Resgate suas moedas diárias.",
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    let userDatabase = await client.userDB.findOne({ discordId: interaction.user.id })
    if (!userDatabase) userDatabase = await client.userDB.create({ discordId: interaction.user.id, username: interaction.user.username })

    if (userDatabase.cooldowns.daily < Date.now()) {
      const amount = Math.floor(Math.random() * 5000);
      await client.userDB.updateOne({ discordId: interaction.user.id, }, { $inc: { dinheiro: amount }});
      await client.userDB.updateOne({ discordId: interaction.user.id, }, { $set: { 'cooldowns.daily': Date.now() + 1000 * 60 * 60 * 24} });
      const embed = new Discord.EmbedBuilder()
        .setColor("Green")
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`🤑 Moedas Resgatadas! 🤑`)
        .setDescription(`Parabéns **<@${userDatabase.discordId}>**! Você resgatou com sucesso **${amount} moedas!**`)
        .setTimestamp(Date.now())
        .setFooter({ text: `Data de resgate:` });

      await interaction.reply({ embeds: [embed] });
    } else {
      const embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setTitle(`❌ Moedas já resgatadas! ❌`)
        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true })})
        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
        .setDescription(`Olá <@${userDatabase.discordId}>, você já resgatou suas moedas diárias! Tente novamente <t:${Math.floor(userDatabase.cooldowns.daily / 1000)}:R>!`)

      await interaction.reply({ embeds: [embed] })
    }
  }
}
