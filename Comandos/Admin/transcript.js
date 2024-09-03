//////////////////////////////////////////////// testar //////////////////////////////////////////////////////
const Discord = require("discord.js");
const transcript = require("discord-html-transcripts");
const Channel = require

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
        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)){
            return interaction.reply({content: `Você não tem permissão para utilizar este comando!`, ephemeral: true})
        }
        
        const channel = await Channel.findOne({guildId: interaction.guild.id})
        if(!channel || !channel.logsChannelId){
            return interaction.reply({content: `O canal de logs não está configurado!\nConfigure o canal de logs antes de usar este comando.`})
        }
        
        let canalLogs = `${channel.logsChannelId}`
        if (canalLogs === null || canalLogs === ``){
            return interaction.reply({content: `O canal de logs não foi encontrado! Verifique se o canal foi configurado corretamente com o comando **/botconfig**.`})
        }

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
            .setDescription(`O transcript do canal ${canalTranscript} foi criado com sucesso em ${canalLogs}!`)

        const embed2 = new Discord.EmbedBuilder()
            .setColor("Green")
            .setDescription(`O transcript do canal ${canalTranscript} foi criado com sucesso!`)

        if (canalTranscript === interaction.channel) {
            interaction.reply({ embeds: [embed2], files: [attachment] }).catch(e => {
                interaction.reply({ content: "Algo deu errado.", ephemeral: true });
            });
        } else {
            interaction.reply({ embeds: [embed1], ephemeral: true }).then(() => {
                canalLogs.send({ embeds: [embed2], files: [attachment] }).catch(e => {
                    interaction.reply({ content: "Algo deu errado.", ephemeral: true })
                })
            })
        }
    }
}