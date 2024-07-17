const Discord = require("discord.js");
const transcript = require("discord-html-transcripts");

module.exports = {
    name: "transcript",
    description: "Transcreva todas as mensagens deste canal para um arquivo html.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "chat",
            description: "Mencione um canal para exportar as mensagens.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        let canalTranscript = interaction.options.getChannel("chat");
        if (!canalTranscript) canalTranscript = interaction.channel;

        const attachment = await transcript.createTranscript(canalTranscript, {
            limit: -1,
            returnType: "attachment",
            filename: `${canalTranscript.name}.html`,
            saveImages: true,
            saveVideos: true,
            saveAudios: true,
            saveEmojis: true,
            footerText: "Foram exportadas {number} mensagens.",
            poweredBy: true,
        });

        const embed1 = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription(`O transcript foi criado com sucesso em ${canalTranscript}!`)

        const embed2 = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription(`O transcript do canal ${canalTranscript}  foi criado com sucesso!`)

        if (canalTranscript === interaction.channel) {
            interaction.reply({ embeds: [embed2], files: [attachment] }).catch(e => {
                interaction.reply({ content: "Algo deu errado.", ephemeral: true });
            });
        } else {
            interaction.reply({ embeds: [embed1], ephemeral: true }).then(() => {
                canalTranscript.send({ embeds: [embed2], files: [attachment] }).catch(e => {
                    interaction.reply({ content: "Algo deu errado.", ephemeral: true })
                })
            })
        }
    }
}