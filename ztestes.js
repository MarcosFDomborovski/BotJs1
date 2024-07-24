const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, AudioPlayer } = require('@discordjs/voice');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once('ready', () => {
    console.log('Bot está online!');
});

client.on('messageCreate', async message => {
    if (message.content === '!play') {
        if (message.member.voice.channel) {
            const channel = message.member.voice.channel;
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            const player = createAudioPlayer();
            const resource = createAudioResource('path/to/your/audio/file.mp3');
            // Aqui você pode aplicar filtros ou efeitos adicionais se estiver usando uma biblioteca apropriada
            player.play(resource);
            connection.subscribe(player);
            message.reply('Estou tocando sua música!');
        } else {
            message.reply('Você precisa estar em um canal de voz para eu tocar música!');
        }
    }
});

client.login('YOUR_BOT_TOKEN');
