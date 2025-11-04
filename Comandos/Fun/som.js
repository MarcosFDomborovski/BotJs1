// const Discord = require("discord.js");
// const path = require("path");
// const {
//   joinVoiceChannel,
//   createAudioPlayer,
//   createAudioResource,
//   AudioPlayerStatus,
//   VoiceConnectionStatus,
//   entersState,
// } = require("@discordjs/voice");

// module.exports = {
//   name: "som",
//   description: "Toca um som no canal de voz.",
//   type: Discord.ApplicationCommandType.ChatInput,
//   options: [],
//   run: async (client, interaction, args) => {
//     // 1. Verifique se o usuário está em um canal de voz
//     const voiceChannel = interaction.member.voice.channel;
//     if (!voiceChannel) {
//       return interaction.reply({
//         content:
//           "Você precisa estar em um canal de voz para usar este comando!",
//         ephemeral: true,
//       });
//     }

//     // 2. Verifique se o bot tem permissão para entrar e falar no canal
//     const permissions = voiceChannel.permissionsFor(client.user);
//     if (
//       !permissions.has(Discord.PermissionFlagsBits.Connect) ||
//       !permissions.has(Discord.PermissionFlagsBits.Speak)
//     ) {
//       return interaction.reply({
//         content:
//           "Eu não tenho permissão para entrar ou falar no seu canal de voz!",
//         ephemeral: true,
//       });
//     }

//     try {
//       await interaction.reply({
//         content: "Entrando no canal e tocando o som...",
//         ephemeral: true,
//       });

//       // 3. Crie a conexão com o canal de voz
//       const connection = joinVoiceChannel({
//         channelId: voiceChannel.id,
//         guildId: interaction.guild.id,
//         adapterCreator: interaction.guild.voiceAdapterCreator,
//       });

//       // 4. Crie o player de áudio
//       const player = createAudioPlayer();

//       // 5. Crie o recurso de áudio a partir do arquivo MP3
//       // Usamos path.join para garantir que o caminho do arquivo seja correto em qualquer sistema operacional
//       const resource = createAudioResource(
//         path.join(process.cwd(), "assets", "audios", "teste.mp3")
//       );

//       // 6. Faça a conexão "assinar" o player
//       connection.subscribe(player);

//       // 7. Toque o recurso
//       player.play(resource);

//       // 8. Lide com o estado do player
//       player.on(AudioPlayerStatus.Idle, () => {
//         // Quando o áudio terminar (ficar ocioso), destrua a conexão
//         connection.destroy();
//       });

//       player.on("error", (error) => {
//         console.error(`Erro no player de áudio: ${error.message}`);
//         connection.destroy();
//       });

//       // 9. Lide com o estado da conexão
//       connection.on(
//         VoiceConnectionStatus.Disconnected,
//         async (oldState, newState) => {
//           // Se a desconexão for inesperada, tente reconectar
//           try {
//             await Promise.race([
//               entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
//               entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
//             ]);
//             // A conexão foi restabelecida
//           } catch (error) {
//             // Não foi possível reconectar, então destrua a conexão
//             connection.destroy();
//           }
//         }
//       );
//     } catch (error) {
//       console.error("Erro ao tentar tocar o áudio:", error);
//       await interaction.followUp({
//         content: "Ocorreu um erro ao tentar tocar o áudio.",
//         ephemeral: true,
//       });
//     }
//   },
// };
