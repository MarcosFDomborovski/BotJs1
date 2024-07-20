require(`../index`)
const Discord = require("discord.js")
const client = require('../index')
const {QuickDB} = require('quick.db')
const db = new QuickDB()


client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "formulario") {
            if (!interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`))) return interaction.reply({ content: `O sistema está desativado.`, ephemeral: true })
            const modal = new Discord.ModalBuilder()
                .setCustomId("modal")
                .setTitle(`Formulário`);

            const pergunta1 = new Discord.TextInputBuilder()
                .setCustomId("pergunta1")
                .setLabel("Como está sendo sua relação com os outros membros ?")
                .setMaxLength(30)
                .setMinLength(5)
                .setPlaceholder("Ex: Legal, boa, chata, ruim...")
                .setRequired(true)
                .setStyle(Discord.TextInputStyle.Short)

            const pergunta2 = new Discord.TextInputBuilder()
                .setCustomId("pergunta2")
                .setLabel("O que você pensa do Dono do servidor ? (Gypcoom)")
                .setMaxLength(30)
                .setMinLength(5)
                .setPlaceholder("Ex: É um cara legal, meio chato, muito engraçado...")
                .setStyle(Discord.TextInputStyle.Short)

            const pergunta3 = new Discord.TextInputBuilder()
                .setCustomId("pergunta3")
                .setLabel("Nos diga como está sendo sua experiência com o servidor.")
                .setPlaceholder("Escreva sua resposta.")
                .setStyle(Discord.TextInputStyle.Paragraph)


            const primeiraPergunta = new Discord.ActionRowBuilder().addComponents(pergunta1);
            const segundaPergunta = new Discord.ActionRowBuilder().addComponents(pergunta2);
            const terceiraPergunta = new Discord.ActionRowBuilder().addComponents(pergunta3);

            modal.addComponents(primeiraPergunta, segundaPergunta, terceiraPergunta);
            await interaction.showModal(modal);
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "modal") {
            let resposta1 = interaction.fields.getTextInputValue("pergunta1")
            let resposta2 = interaction.fields.getTextInputValue("pergunta2")
            let resposta3 = interaction.fields.getTextInputValue("pergunta3")

            if (!resposta1) resposta1 = "Não informado.";
            if (!resposta2) resposta2 = "Não informado.";
            if (!resposta3) resposta3 = "Não informado.";


            let embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`O usuário ${interaction.user}, enviou o formulário abaixo:`)
                .addFields(
                    {
                        name: `Pergunta 1`,
                        value: `*Resposta 1:* \`${resposta1}\`.`,
                        inline: false,
                    },
                    {
                        name: `Pergunta 2`,
                        value: `*Resposta 2:* \`${resposta2}\`.`,
                        inline: false,
                    },
                    {
                        name: `Pergunta 3`,
                        value: `*Resposta 3:* \`${resposta3}\`.`,
                        inline: false
                    },
                )
            interaction.reply({ content: `Olá **${interaction.user.username}**, seu formulário foi enviado com sucesso!`, ephemeral: true })
            await interaction.guild.channels.cache.get(await db.get(`canal_logs_${interaction.guild.id}`)).send({ embeds: [embed] })
        }
    }
})