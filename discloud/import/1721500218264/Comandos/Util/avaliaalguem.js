const Discord = require("discord.js")
const client = require("../../index")

module.exports = {
    name: "avaliação",
    description: "Avalie alguém do servidor.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "Mencione um membro para avaliar.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "nota",
            description: "Dê uma nota de 0 a 10 para esse usuário.",
            type: Discord.ApplicationCommandOptionType.Number,
            required: true,
        },
        {
            name: "comentário",
            description: "Faça um comentário sobre essa avaliação.",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],
    run: async (client, interaction) => {

        let canalLogsId = "1131707660593537175";
        let member = interaction.options.getUser("membro")
        let nota = interaction.options.getNumber("nota")
        let comentario = interaction.options.getString("comentário")

        if (!comentario || comentario === null) comentario = `Não definido.`

        function avaliarAlguem(user, nota, comentario) {
            const embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setDescription(`O usuário ${interaction.user}, enviou uma avaliação.`)
                .addFields(
                    {
                        name: `> 👤 Usuário`,
                        value: `${user}`,
                        inline: false
                    },
                    {
                        name: `> 📝 Nota`,
                        value: `\`${nota}/10\``,
                        inline: false
                    },
                    {
                        name: `> 🖨 Comentário`,
                        value: `\`${comentario}\``,
                        inline: false
                    }
                )

            try {
                interaction.guild.channels.cache.get(canalLogsId).send({ embeds: [embed] }).then(() => {
                    interaction.reply({content: `Sua avaliação foi enviada com sucesso!\nDados:\n\`\`\`\n- [👤] Usuário: (${user.username})\n- [📝] Nota: (${nota})\n- [🖨] Comentário: (${comentario}) \`\`\``, ephemeral: true })
                })
            } catch (err) {
                interaction.reply({ content: `❌ Algo deu errado`, ephemeral: true })
            }
        }

        if (!interaction.guild.channels.cache.get(canalLogsId)) {
            interaction.reply(`❌ O canal de logs não foi encontrado. Verifique se o ID do canal está correto e se ele está ativado.`);
        } else if (nota < 0 || nota > 10) {
            interaction.reply({ content: `❌ A nota fornecida é inválida! Por favor forneça uma nota de 0 a 10 !`, ephemeral: true })
        } else {
            avaliarAlguem(member, nota, comentario)
        }
    }
}