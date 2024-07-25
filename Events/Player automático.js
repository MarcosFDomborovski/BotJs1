// const { Client, GatewayIntentBits, Partials } = require('discord.js');
// const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require('@discordjs/voice');
// const fs = require('fs');
// const path = require('path');

// const client = require('../index')

// const TARGET_USER_ID = '474334792830156805'; // Substitua pelo ID do usuário alvo
// const MP3_PATH = "../assets/audios/teste.mp3" // Caminho para o arquivo MP3

// let player;
// let connection;

// client.on('voiceStateUpdate', async (oldState, newState) => {
//   if (newState.id === TARGET_USER_ID) {
//     // Verifica se o usuário específico está falando
//     if (newState.channel && !oldState.channel && !newState.member.voice.serverMute) {
//       // O usuário entrou em um canal de voz e não está mudo
//       if (!connection || connection.joinConfig.channelId !== newState.channel.id) {
//         // Se o bot não estiver conectado ao canal de voz ou estiver em um canal diferente
//         if (connection) {
//           connection.destroy(); // Desconecta o bot do canal atual
//         }

//         connection = joinVoiceChannel({
//           channelId: newState.channel.id,
//           guildId: newState.guild.id,
//           adapterCreator: newState.guild.voiceAdapterCreator,
//         });

//         player = createAudioPlayer({
//           behaviors: {
//             noSubscriber: NoSubscriberBehavior.Pause,
//           },
//         });

//         const playResource = () => {
//           const resource = createAudioResource(fs.createReadStream(MP3_PATH));
//           player.play(resource);
//         };

//         playResource();

//         player.on(AudioPlayerStatus.Idle, () => {
//           playResource(); // Toca novamente quando termina
//         });

//         connection.subscribe(player);

//         player.on('error', error => {
//           console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
//           connection.destroy();
//         });

//         connection.on('stateChange', (oldState, newState) => {
//           if (newState.status === VoiceConnectionStatus.Disconnected) {
//             connection = null;
//             player = null; // Reseta o player quando o bot se desconecta
//           }
//         });
//       }
//     }
//   }
// });