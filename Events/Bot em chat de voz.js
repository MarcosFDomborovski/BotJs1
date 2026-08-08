// const Discord = require("discord.js");
// const client = require("../index");
// const {
//   joinVoiceChannel,
//   VoiceConnectionStatus,
//   VoiceConnectionDisconnectReason,
//   entersState,
//   getVoiceConnection,
// } = require("@discordjs/voice");
// const Channel = require("../models/config");
// require("colors");
// const sodium = require("libsodium-wrappers");

// const createDisconnectionHandler = (connection, canal) => {
//   const guildName = canal.guild.name;

//   return async (oldState, newState) => {
//     console.log(`${'o'.yellow} [${guildName}] Desconectado do canal [${canal.name}]! Motivo: ${newState.reason} (Code: ${newState.closeCode})`);

//     if (
//       newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
//       newState.closeCode === 4014
//     ) {
//       console.log(`${'o'.yellow} [${guildName}] Bot foi desconectado por um usuário. Não vai reconectar.`);
//       connection.destroy();
//       return;
//     }

//     try {
//       console.log(`${'o'.blue} [${guildName}] Tentando reconexão automática para [${canal.name}] (5s)...`);
//       await entersState(connection, VoiceConnectionStatus.Ready, 5_000);
//       console.log(`${'o'.green} [${guildName}] Reconectado automaticamente ao canal [${canal.name}]!`);
//     } catch (error) {
//       console.log(`${'o'.red} [${guildName}] Reconexão automática para [${canal.name}] falhou. Destruindo conexão.`);
//       connection.destroy();
//     }
//   };
// };

// client.on("clientReady", async () => {
//   try {
//     await sodium.ready;
//     console.log(`${'o'.blue} [Global] Sodium pronto para uso.`);
//   } catch (error) {
//     console.log(`${'o'.red} [Global] Erro ao carregar Sodium: ${error.message}`);
//     return;
//   }
//   await new Promise((resolve) => setTimeout(resolve, 2000));

//   const guilds = Array.from(client.guilds.cache.values());

//   for (const guild of guilds) {
//     const guildName = guild.name;
//     try {
//       console.log(`${'o'.blue} [${guildName}] Verificando servidor...`);

//       const channelConfig = await Channel.findOne({ guildId: guild.id });

//       if (!channelConfig) {
//         if (guild.id === "1106736904440913942") {
//           console.log(`${'o'.blue} [${guildName}] Pulando servidor específico.`);
//           continue;
//         }

//         console.log(`${'o'.yellow} [${guildName}] Servidor sem configuração de canal no DB.`);
//         const chatChannel = guild.channels.cache.find((ch) => ch.name === "logs");
//         if (chatChannel) {
//           try {
//             await chatChannel.send("o ".red + `Servidor: [${guildName}] - O bot não conseguiu entrar no canal de voz! Utilize o comando **/botconfig** para configurar os canais! Caso não faça isso, alguns comandos não funcionarão!`);
//           } catch (sendError) {
//             console.log(`${'o'.red} [${guildName}] Erro ao enviar msg no canal logs: ${sendError.message}`);
//           }
//         }
//         continue;
//       }

//       const voiceChannelId = channelConfig.botVoiceChannelId;
//       if (!voiceChannelId || voiceChannelId === "Não configurado.") {
//         console.log(`${'o'.yellow} [${guildName}] Canal de voz do bot não foi configurado.`);
//         continue;
//       }

//       const canal = guild.channels.cache.get(voiceChannelId);
//       if (!canal) {
//         console.log(`${'o'.yellow} [${guildName}] Canal de voz não encontrado (ID: ${voiceChannelId})`);
//         continue;
//       }

//       if (canal.type !== Discord.ChannelType.GuildVoice) {
//         console.log(`${'o'.yellow} [${guildName}] Canal [${canal.name}] não é de voz (Tipo: ${canal.type})`);
//         continue;
//       }

//       const botMember = guild.members.cache.get(client.user.id);
//       if (!botMember) {
//         console.log(`${'o'.yellow} [${guildName}] Bot não é membro do servidor (cache?).`);
//         continue;
//       }

//       const permissions = canal.permissionsFor(botMember);
//       if (!permissions.has(Discord.PermissionFlagsBits.Connect)) {
//         console.log(`${'o'.yellow} [${guildName}] Sem permissão para CONECTAR em [${canal.name}]`);
//         continue;
//       }

//       if (!permissions.has(Discord.PermissionFlagsBits.Speak)) {
//         console.log(`${'o'.yellow} [${guildName}] Sem permissão para FALAR em [${canal.name}] (continuando mesmo assim)`);
//       }

//       if (getVoiceConnection(guild.id)) {
//         console.log(`${'o'.blue} [${guildName}] Bot já está conectado em um canal de voz.`);
//         continue;
//       }

//       console.log(`${'o'.blue} [${guildName}] Tentando conectar ao canal: [${canal.name}]`);
//       try {
//         const connection = joinVoiceChannel({
//           channelId: canal.id,
//           guildId: canal.guild.id,
//           adapterCreator: canal.guild.voiceAdapterCreator,
//         });

//         try {
//           await entersState(connection, VoiceConnectionStatus.Ready, 15_000);
//           console.log(`${'o'.green} [${guildName}] Conectado com sucesso ao canal [${canal.name}]`);

//           connection.on(
//             VoiceConnectionStatus.Disconnected,
//             createDisconnectionHandler(connection, canal)
//           );
//         } catch (timeoutError) {
//           console.log(`${'o'.yellow} [${guildName}] Timeout ao conectar em [${canal.name}] - ${timeoutError.message}`);
//           connection.destroy();
//         }
//       } catch (connectionError) {
//         console.log(`${'o'.red} [${guildName}] Erro inicial ao conectar em [${canal.name}] - ${connectionError.message}`);

//         setTimeout(async () => {
//           console.log(`${'o'.blue} [${guildName}] (RETRY) Tentando reconectar ao canal [${canal.name}]`);
//           try {
//             const retryConnection = joinVoiceChannel({
//               channelId: canal.id,
//               guildId: canal.guild.id,
//               adapterCreator: canal.guild.voiceAdapterCreator,
//             });

//             await entersState(
//               retryConnection,
//               VoiceConnectionStatus.Ready,
//               15_000
//             );
//             console.log(`${'o'.green} [${guildName}] (RETRY) Reconectado com sucesso ao canal [${canal.name}]`);

//             retryConnection.on(
//               VoiceConnectionStatus.Disconnected,
//               createDisconnectionHandler(retryConnection, canal)
//             );
//           } catch (retryError) {
//             console.log(`${'o'.red} [${guildName}] (RETRY) Falha ao reconectar em [${canal.name}] - ${retryError.message}`);
//           }
//         }, 15000);
//       }

//       await new Promise((resolve) => setTimeout(resolve, 1000));
//     } catch (guildError) {
//       console.log(`${'o'.red} [${guildName}] Erro geral no servidor: ${guildError.message}`);
//     }
//   }

//   console.log(`${'o'.green} [Global] Processo de conexão aos canais de voz finalizado.`);
// });

// Comentado pois fica desconectando frequentemente e reconectando, fazendo com que o Discord invalide o token dele.