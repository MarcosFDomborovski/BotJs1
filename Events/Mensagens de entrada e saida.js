const Discord = require("discord.js");
const client = require("../index");
const Channel = require("../models/config");

client.on("guildMemberAdd", async (member) => {
  const guild = member.guild;
  
  try {
    const channel = await Channel.findOne({ guildId: guild.id });
    
    if (!channel || !channel.welcomeChannelId) {
      const owner = await guild.fetchOwner();
      console.log(
        `Servidor: [${guild.name}] - O canal de boas vindas não foi configurado!`
      );
      
      try {
        await owner.send(
          `Servidor: **${guild.name}** - O canal de boas vindas não foi configurado!\nConfigure esse canal pelo comando **/botconfig**.`
        );
      } catch (dmError) {
        console.log(`Não foi possível enviar DM para o dono do servidor ${guild.name}`);
      }
      return;
    }

    const canalLogs = guild.channels.cache.get(channel.welcomeChannelId);
    
    if (!canalLogs) {
      const owner = await guild.fetchOwner();
      console.log(
        `Servidor: [${guild.name}] - Canal de boas vindas ID ${channel.welcomeChannelId} não encontrado!`
      );
      
      try {
        await owner.send(
          `Servidor: **${guild.name}** - O canal de boas vindas configurado não foi encontrado!\nConfigure pelo comando **/botconfig**.`
        );
      } catch (dmError) {
        console.log(`Não foi possível enviar DM para o dono do servidor ${guild.name}`);
      }
      return;
    }

    const embed = new Discord.EmbedBuilder()
      .setColor("Green")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`👋 Boas vindas!`)
      .setDescription(
        `> Olá ${member}!\nseja Bem-Vindo ao servidor \`${guild.name}\`\nAtualmente estamos com \`${guild.memberCount}\` membros.`
      );

    await canalLogs.send({ embeds: [embed], content: `${member}` });
  } catch (err) {
    console.log(`Erro ao processar entrada de membro no servidor ${guild.name}:`, err);
  }
});

client.on("guildMemberRemove", async (member) => {
  const guild = member.guild;
  
  try {
    const channel = await Channel.findOne({ guildId: guild.id });
    
    if (!channel || !channel.leaveChannelId) {
      const owner = await guild.fetchOwner();
      console.log(
        `Servidor: [${guild.name}] - O canal de adeus não foi configurado!`
      );
      
      try {
        await owner.send(
          `Servidor: **${guild.name}** - O canal de adeus não foi configurado!\nConfigure esse canal pelo comando **/botconfig**.`
        );
      } catch (dmError) {
        console.log(`Não foi possível enviar DM para o dono do servidor ${guild.name}`);
      }
      return;
    }

    const canal = guild.channels.cache.get(channel.leaveChannelId);
    
    if (!canal) {
      const owner = await guild.fetchOwner();
      console.log(
        `Servidor: [${guild.name}] - Canal de adeus ID ${channel.leaveChannelId} não encontrado!`
      );
      
      try {
        await owner.send(
          `Servidor: **${guild.name}** - O canal de adeus configurado não foi encontrado!\nConfigure pelo comando **/botconfig**.`
        );
      } catch (dmError) {
        console.log(`Não foi possível enviar DM para o dono do servidor ${guild.name}`);
      }
      return;
    }

    const embed = new Discord.EmbedBuilder()
      .setColor("Red")
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setTitle(`👋 Adeus...`)
      .setDescription(
        `> O usuário ${member} saiu do servidor!\n> Espero que volte algum dia..\n> Atualmente estamos com \`${guild.memberCount}\` membros.`
      );

    await canal.send({ embeds: [embed], content: `${member}` });
  } catch (err) {
    console.log(`Erro ao processar saída de membro no servidor ${guild.name}:`, err);
  }
});
