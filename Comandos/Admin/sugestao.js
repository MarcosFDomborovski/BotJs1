const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "sugestao",
    description: "Crie um formulário de sugestões para os membros.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal_formulário",
            description: "Mencione um canal onde será enviado o formulário para os membros.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: "Você não possui permissão para utilizar este comando!", ephemeral: true })
        } else {
            let canal = interaction.options.getChannel("canal_formulário")
            let canalSugestoes = interaction.guild.channels.cache.get("1264400463277592647")

            if (canal.type !== Discord.ChannelType.GuildText) {
                interaction.reply({ content: `O canal ${canal} não é um canal de texto!`, ephemeral: true })
            } else if (canalSugestoes.type !== Discord.ChannelType.GuildText && canalSugestoes.type !== Discord.ChannelType.PrivateThread) {
                interaction.reply({ content: `O canal ${canalSugestoes} não é um canal de texto válido!`, ephemeral: true })
            } else {
                await db.set(`canal_${interaction.guild.id}`, canal.id)
                await db.set(`canalSugestoes_${interaction.guild.id}`, canalSugestoes.id)

                let embed = new Discord.EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Canais configurados!")
                    .setDescription(`> Canal de formulário: **${canal}**\n> Canal de sugestões: **${canalSugestoes}**`)

                interaction.reply({ embeds: [embed], ephemeral: true }).then(() => {
                    let embedPainel = new Discord.EmbedBuilder()
                        .setColor("Random")
                        .setTitle("📝 Formulário de sugestões 📝")
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setDescription(`Faça sua sugestão clicando no botão abaixo!`)
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                        .setFooter({text: `Data:`})
                        .setTimestamp(Date.now())

                    let botao = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("sugestao")
                            .setEmoji("📔")
                            .setLabel(`Sugerir!`)
                            .setStyle(Discord.ButtonStyle.Primary)
                    )

                    canal.send({embeds:[embedPainel], components: [botao]})
                })
            }
        }
    }
}