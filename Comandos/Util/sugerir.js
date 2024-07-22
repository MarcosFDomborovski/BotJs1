const Discord = require("discord.js");

module.exports = {
    name: "sugerir",
    description: "Faça sua sugestão.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "sugestão",
            description: "Escreva algo.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {

        let canal = interaction.guild.channels.cache.get("1264400463277592647")
        if (!canal) {
            interaction.reply(`Olá ${interaction.user}, o canal de sugestões ainda não foi configurado no script!`)
        } else {
            let sugestao = interaction.options.getString("sugestão")
            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle("Nova sugestão!")
                .setDescription(`Sugestão de ${interaction.user}:\n**${sugestao}**`)

            canal.send({ embeds: [embed] }).then(() => {
                interaction.reply({ content: `Olá ${interaction.user}, sua sugestão foi publicada no canal ${canal} com sucesso!` })
            }).catch(() => {
                interaction.reply({ content: `Ops ${interaction.user}, algo deu errado!` })
            })
        }
    }
}