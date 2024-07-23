const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "sorteio",
    description: "Crie um sorteio no servidor.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "prêmio",
            description: "Qual será o prêmio do sorteio ?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "descrição",
            description: "Descrição do prêmio ?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "tempo",
            description: "Quanto tempo o sorteio ficará ativo?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: "30 segundos",
                    value: "30s",
                },
                {
                    name: "1 minuto",
                    value: "1m",
                },
                {
                    name: "5 minutos",
                    value: "5m",
                },
                {
                    name: "10 minutos",
                    value: "10m",
                },
                {
                    name: "30 minutos",
                    value: "30m",
                },
                {
                    name: "1 hora",
                    value: "1h",
                },
                {
                    name: "2 horas",
                    value: "2h",
                },
                {
                    name: "5 horas",
                    value: "5h",
                },
                {
                    name: "1 dia",
                    value: "24h",
                },
                {
                    name: "3 dias",
                    value: "72h",
                },
                {
                    name: "1 semana",
                    value: "168h",
                },
                {
                    name: "2 semanas",
                    value: "336h",
                }
            ]
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true })
        } else {
            let premio = interaction.options.getString("prêmio");
            let tempo = interaction.options.getString("tempo");
            let descricao = interaction.options.getString("descrição");

            let duracao = ms(tempo);

            const botao = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("botao")
                    .setEmoji("🎉")
                    .setStyle(Discord.ButtonStyle.Secondary)
            );
            let click = [];
            let embed = new Discord.EmbedBuilder()
                .setAuthor({ name: `**🎉 Novo sorteio!**`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setDescription(`> Patrocinador: ${interaction.user}\n> Sorteando: **${premio}**\n> **${descricao}**\n> Tempo do sorteio: \`${tempo}\`\n\n Clique no **botão abaixo** para participar!`)
                .setTimestamp(Date.now() + ms(tempo))
                .setFooter({ text: "Data do sorteio:" })
                .setColor("Random")

            let erro = new Discord.EmbedBuilder()
                .setColor("Red")
                .setDescription(`❌ Não foi possível realizar o sorteio! ❌`)

            const msg = await interaction.reply({ embeds: [embed], components: [botao] }).catch((e) => {
                interaction.reply({ embeds: [erro] })
            })

            const coletor = msg.createMessageComponentCollector({
                time: ms(tempo)
            })

            coletor.on("end", (i) => {
                interaction.editReply({
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setDisabled(true)
                                .setCustomId("sorteio")
                                .setEmoji("🎉")
                                .setStyle(Discord.ButtonStyle.Secondary)
                        )
                    ]
                })
            })
            coletor.on("collect", (i) => {
                if (i.customId === "botao") {
                    if (click.includes(i.user.id)) {
                        return i.reply({ content: `**Você já está participando!**`, ephemeral: true })
                    }
                    click.push(i.user.id)
                    interaction.editReply({ embeds: [embed] })
                    i.reply({ content: `**Você entrou no sorteio!**`, ephemeral: true })
                }

            })
            setTimeout(() => {
                let ganhador = click[Math.floor(Math.random() * click.length)]

                if (click.length == 0) return interaction.followUp(`**SORTEIO CANCELADO**\nNão houveram participantes no sorteio \`${premio}\`.`)

                interaction.followUp({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`🎉🥳 Temos um(a) ganhador(a)! 🥳🎉`)
                            .setColor("Yellow")
                            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setDescription(`> __Vencedor:__  ${ganhador}\nParabéns!! Você foi sorteado(a) e ganhou um(a) ${premio}`)
                    ]
                })
            }, duracao)
        }
    }
}
