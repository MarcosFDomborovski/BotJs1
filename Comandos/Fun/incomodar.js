const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState,
    StreamType,
} = require("@discordjs/voice");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");
const prism = require("prism-media");
const Channel = require("../../models/config");
require("colors");

const SILENCE_FRAME = Buffer.from([0xf8, 0xff, 0xfe]);
const DONNIE_IMAGE = path.join(__dirname, "../../assets/images/donnie.jpg");

const DONNIE_BUF = fs.readFileSync(
    path.join(__dirname, "../../assets/audios/donnie.ogg")
);

/** @type {Promise<Buffer[]>} */
const DONNIE_PACKETS = demuxOggOpus(DONNIE_BUF).then((packets) => {
    let i = 0;
    while (i < packets.length && packets[i].length <= 3) i++;
    return packets.slice(i);
});

function demuxOggOpus(buf) {
    return new Promise((resolve, reject) => {
        const demuxer = new prism.opus.OggDemuxer();
        /** @type {Buffer[]} */
        const packets = [];
        demuxer.on("data", (packet) => packets.push(Buffer.from(packet)));
        demuxer.once("end", () => resolve(packets));
        demuxer.once("error", reject);
        demuxer.end(buf);
    });
}

function opusPacketStream(packets) {
    let i = 0;
    return new Readable({
        objectMode: true,
        read() {
            this.push(i < packets.length ? packets[i++] : null);
        },
    });
}

function silenceStream() {
    return new Readable({
        objectMode: true,
        read() {
            this.push(SILENCE_FRAME);
        },
    });
}

function waitUntilStarted(resource) {
    if (resource.started) return Promise.resolve(resource);
    return new Promise((resolve, reject) => {
        const stream = resource.playStream;
        const onOk = () => {
            cleanup();
            resolve(resource);
        };
        const onFail = (err) => {
            cleanup();
            reject(err || new Error("resource ended before start"));
        };
        const cleanup = () => {
            stream.off("readable", onOk);
            stream.off("error", onFail);
            stream.off("end", onFail);
        };
        stream.once("readable", onOk);
        stream.once("error", onFail);
        stream.once("end", onFail);
    });
}

/** @param {import('discord.js').Client} client */
function getSessions(client) {
    if (!client.donnieSessions) client.donnieSessions = new Map();
    return client.donnieSessions;
}

/** @param {import('discord.js').Client} client @param {string} guildId */
function stopDonnie(client, guildId) {
    const sessions = getSessions(client);
    const session = sessions.get(guildId);
    if (!session) return false;
    sessions.delete(guildId);
    try {
        session.connection.destroy();
    } catch (_) {}
    return true;
}

module.exports = {
    name: "incomodar",
    description: "Donnie monitora a fala do alvo (roda de novo pra trocar o alvo)",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "alvo",
            description: "Usuário pra incomodar (ou trocar o alvo atual)",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
    ],
    stopDonnie,
    getSessions,

    run: async (client, interaction) => {
        const target = interaction.options.getUser("alvo");
        if (!target) {
            return interaction.reply({ content: "Informe um usuário!", ephemeral: true });
        }

        const sessions = getSessions(client);
        const existing = sessions.get(interaction.guild.id);

        // Já rodando: só troca o alvo
        if (existing) {
            existing.targetId = target.id;
            if (existing.isPlaying) existing.player.stop(true);
            return interaction.reply({
                content: `Alvo trocado pra <@${target.id}>.`,
                ephemeral: true,
            });
        }

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({
                content: "Você precisa estar em um canal de voz!",
                ephemeral: true,
            });
        }

        await interaction.reply({ content: "Conectando..." });

        try {
            const packets = await DONNIE_PACKETS;

            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
                selfDeaf: false,
            });

            await entersState(connection, VoiceConnectionStatus.Ready, 15_000);

            const player = createAudioPlayer();
            connection.subscribe(player);

            const session = {
                connection,
                player,
                targetId: target.id,
                isPlaying: false,
                /** @type {import('@discordjs/voice').AudioResource | null} */
                primed: null,
            };
            sessions.set(interaction.guild.id, session);

            const playSilenceWarm = () => {
                player.play(
                    createAudioResource(silenceStream(), {
                        inputType: StreamType.Opus,
                        silencePaddingFrames: 0,
                    })
                );
            };

            const primeNext = async () => {
                const resource = createAudioResource(opusPacketStream(packets), {
                    inputType: StreamType.Opus,
                    silencePaddingFrames: 0,
                });
                await waitUntilStarted(resource);
                if (sessions.get(interaction.guild.id) !== session) return;
                session.primed = resource;
            };

            const playDonnieAudio = () => {
                if (!session.primed) return;
                session.isPlaying = true;
                const resource = session.primed;
                session.primed = null;
                player.play(resource);
                primeNext().catch((err) => {
                    console.error("Erro ao pré-aquecer áudio:".red, err.message);
                });
            };

            player.on(AudioPlayerStatus.Idle, () => {
                session.isPlaying = false;
                if (sessions.has(interaction.guild.id)) playSilenceWarm();
            });

            player.on("error", (error) => {
                console.error("Erro no Player:".red, error.message);
                session.isPlaying = false;
                if (sessions.has(interaction.guild.id)) playSilenceWarm();
            });

            playSilenceWarm();
            await primeNext();

            const handleSpeakingStart = (userId) => {
                if (userId !== session.targetId) return;
                playDonnieAudio();
            };

            const handleSpeakingEnd = (userId) => {
                if (userId !== session.targetId || !session.isPlaying) return;
                player.stop(true);
            };

            connection.receiver.speaking.on("start", handleSpeakingStart);
            connection.receiver.speaking.on("end", handleSpeakingEnd);

            connection.on(VoiceConnectionStatus.Destroyed, () => {
                connection.receiver.speaking.off("start", handleSpeakingStart);
                connection.receiver.speaking.off("end", handleSpeakingEnd);
                sessions.delete(interaction.guild.id);
                player.stop(true);
            });

            const embed = new EmbedBuilder()
                .setColor("Random")
                .setTitle("🔊 **Donnie está solto!!**")
                .setDescription(`Donnie começou a encher o saco do usuário <@${session.targetId}>`)
                .setThumbnail("attachment://donnie.jpg")
                .setTimestamp();

            const config = await Channel.findOne({ guildId: interaction.guild.id });
            if (config?.logsChannelId && config.logsChannelId !== "Não configurado.") {
                const logChannel = interaction.guild.channels.cache.get(config.logsChannelId);
                if (logChannel) {
                    await logChannel.send({
                        embeds: [embed],
                        files: [{ name: "donnie.jpg", attachment: fs.readFileSync(DONNIE_IMAGE) }],
                    });
                }
            }

            await interaction.editReply({
                content: `🔊 **Donnie está solto!!** Alvo: <@${session.targetId}>\nUse \`/incomodar\` de novo pra trocar o alvo, ou \`/parar-incomodar\` pra parar.`,
            });
        } catch (error) {
            stopDonnie(client, interaction.guild.id);
            console.error("Erro ao conectar na call:".red, error);
            await interaction.editReply({
                content: `❌ Falha ao iniciar conexão: ${error.message}`,
            });
        }
    },
};
