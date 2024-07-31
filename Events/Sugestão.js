require(`../index`)
const Discord = require("discord.js")
const client = require('../index')
const { QuickDB } = require('quick.db')
const db = new QuickDB()

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "sugestao") {
            if (!interaction.guild.channels.cache.get(await db.get(`canalSugestoes_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })

            const modal = new Discord.ModalBuilder()
                .setCustomId("sugestao")
                .setTitle(`Painel de sugestões`)
            const sugestao = new Discord.TextInputBuilder()
                .setCustomId("sugestaoUsuario")
                .setLabel("Escreva sua sugestão abaixo:")
                .setPlaceholder("Ex: Canal de texto novo, mudar a cor de um cargo...")
                .setRequired(true)
                .setStyle(Discord.TextInputStyle.Paragraph)

            const sugerir = new Discord.ActionRowBuilder().addComponents(sugestao)

            modal.addComponents(sugerir)
            await interaction.showModal(modal)
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "sugestao") {
            let resposta = interaction.fields.getTextInputValue("sugestaoUsuario")
            if (!resposta) resposta = "Não informado."

            let embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`O usuário ${interaction.user}, enviou a seguinte sugestão:`)
                .setFooter({ text: `Data:` })
                .setTimestamp(Date.now())
                .addFields(
                    {
                        name: "> **Descrição da sugestão:**",
                        value: `\`${resposta}\``,
                        inline: false
                    },
                )
            interaction.reply({ content: `Olá **${interaction.user}**, sua sugestão foi enviada com sucesso no canal ${interaction.guild.channels.cache.get(await db.get(`canalSugestoes_${interaction.guild.id}`))}!`, ephemeral: true })
            await interaction.guild.channels.cache.get(await db.get(`canalSugestoes_${interaction.guild.id}`)).send({ embeds: [embed] })
        }
    }
})