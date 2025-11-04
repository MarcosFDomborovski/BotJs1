const Discord = require("discord.js");
const client = require("../index");
const {
  joinVoiceChannel,
  VoiceConnectionStatus,
  entersState,
} = require("@discordjs/voice");
const Channel = require("../models/config");

client.on("clientReady", async () => {
  // Aguarda um pouco antes de tentar conectar aos canais
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const guilds = Array.from(client.guilds.cache.values());

  for (const guild of guilds) {
    try {
      console.log(' o '.blue + `Verificando servidor: [${guild.name}]`.white);

      const channel = await Channel.findOne({ guildId: guild.id });
      let canal = guild.channels.cache.get(`${channel?.botVoiceChannelId}`);
      let chatChannel = guild?.channels?.cache.find((ch) => ch.name == "logs");

      if (!channel) {
        const owner = await guild.fetchOwner();
        if (guild.id == "1106736904440913942") {
          console.log(' o '.yellow + `Pulando servidor específico: [${guild.name}]`.white);
          continue;
        }

        if (chatChannel) {
          try {
            await chatChannel.send(
              ' o '.red + `Servidor: [${guild.name}] - O bot não conseguiu entrar no canal de voz! Utilize o comando **/botconfig** para configurar os canais! Caso não faça isso, alguns comandos não funcionarão!`
            );
          } catch (sendError) {
            console.log(
              ' o '.red + `Erro ao enviar mensagem no canal logs: ${sendError.message}`
            );
          }
        } else {
          console.log(
            ' o '.red + `Servidor: [${guild.name}] - Canal de logs não encontrado e configuração não existe`
          );
        }
        continue;
      }

      if (
        channel.botVoiceChannelId === null ||
        channel.botVoiceChannelId === undefined ||
        channel.botVoiceChannelId === "Não configurado."
      ) {
        console.log(
          ' o '.red + `Servidor: [${guild.name}] - Canal de voz do bot não foi configurado`
        );
        continue;
      }

      if (!canal || canal === undefined || canal === null) {
        console.log(
          ' o '.red + `Servidor: [${guild.name}] - Canal de voz não encontrado (ID: ${channel.botVoiceChannelId})`
        );
        continue;
      }

      if (canal.type !== Discord.ChannelType.GuildVoice) {
        console.log(
          ' o '.red + `Servidor: [${guild.name}] - Canal configurado não é de voz! [ ${canal.name} ] (Tipo: ${canal.type})`
        );
        continue;
      }

      // Verifica permissões do bot no canal
      const botMember = guild.members.cache.get(client.user.id);
      if (!botMember) {
        console.log(
          ' o '.red + `Servidor: [${guild.name}] - Bot não é membro do servidor`
        );
        continue;
      }

      const permissions = canal.permissionsFor(botMember);
      if (!permissions.has(Discord.PermissionFlagsBits.Connect)) {
        console.log(
          ' o '.red + `Servidor: [${guild.name}] - Bot não tem permissão para conectar no canal [ ${canal.name} ]`
        );
        continue;
      }

      if (!permissions.has(Discord.PermissionFlagsBits.Speak)) {
        console.log(
          ' o '.red + `Servidor: [${guild.name}] - Bot não tem permissão para falar no canal [ ${canal.name} ]`
        );
      }

      // Verifica se o bot já está conectado em algum canal de voz neste servidor
      const existingConnection = client.voice?.connections?.get(guild.id);
      if (existingConnection) {
        console.log(
          ' o '.red + `Servidor: [${guild.name}] - Bot já está conectado em outro canal de voz`
        );
        continue;
      }

      console.log(
        ' o '.yellow + `Tentando conectar ao canal: [ ${canal.name} ] no servidor [${guild.name}]`
      );

      try {
        const connection = joinVoiceChannel({
          channelId: canal.id,
          guildId: canal.guild.id,
          adapterCreator: canal.guild.voiceAdapterCreator,
        });

        // Aguarda a conexão ser estabelecida com timeout menor
        try {
          await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
          console.log(' o '.green + `Conectado com sucesso ao canal [ ${canal.name} ] no servidor [${guild.name}]`);

          // Adiciona listener para desconexões inesperadas
          connection.on(
            VoiceConnectionStatus.Disconnected,
            (oldState, newState) => {
              console.log(
                ' o '.red + `Desconectado do canal [ ${canal.name} ] no servidor [${guild.name}]`
              );
            }
          );
        } catch (timeoutError) {
          console.log(
            ' o '.red + `Timeout ao conectar ao canal [ ${canal.name} ] no servidor [${guild.name}] - ${timeoutError.message}`
          );
          connection.destroy();
        }
      } catch (connectionError) {
        console.log(
          ' o '.red + `Erro ao conectar ao canal [ ${canal.name} ] no servidor [${guild.name}] - ${connectionError.message}`
        );

        // Tenta reconectar após 15 segundos (tempo maior para evitar spam)
        setTimeout(async () => {
          try {
            console.log(
              ' o '.yellow + `Tentando reconectar ao canal [ ${canal.name} ] no servidor [${guild.name}]`
            );
            const retryConnection = joinVoiceChannel({
              channelId: canal.id,
              guildId: canal.guild.id,
              adapterCreator: canal.guild.voiceAdapterCreator,
            });

            await entersState(
              retryConnection,
              VoiceConnectionStatus.Ready,
              15_000
            );
            console.log(
              ' o '.green + `Reconectado com sucesso ao canal [ ${canal.name} ] no servidor [${guild.name}]`
            );
          } catch (retryError) {
            console.log(
              ' o '.red + `Falha ao reconectar ao canal [ ${canal.name} ] no servidor [${guild.name}] - ${retryError.message}`
            );
          }
        }, 15000);
      }

      // Aguarda um pouco antes de tentar conectar ao próximo servidor
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (guildError) {
      console.log(
        ' o '.red + `Erro geral no servidor [${guild.name}]: ${guildError.message}`
      );
    }
  }

  console.log(' o '.green + `Processo de conexão aos canais de voz finalizado`.white);
});

// 1264342784505020557 chat de voz do pasteco
