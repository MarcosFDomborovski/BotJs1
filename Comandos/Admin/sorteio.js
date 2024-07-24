const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "sorteio",
    description: "Crie um sorteio no servidor.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "prêmio",
            description: "Qual será o prêmio do sorteio?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "descrição",
            description: "Descrição do prêmio?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "tempo",
            description: "Quanto tempo o sorteio ficará ativo?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: "30 segundos", value: "30s" },
                { name: "1 minuto", value: "1m" },
                { name: "5 minutos", value: "5m" },
                { name: "10 minutos", value: "10m" },
                { name: "30 minutos", value: "30m" },
                { name: "1 hora", value: "1h" },
                { name: "2 horas", value: "2h" },
                { name: "5 horas", value: "5h" },
                { name: "1 dia", value: "24h" },
                { name: "3 dias", value: "72h" },
                { name: "1 semana", value: "168h" },
                { name: "2 semanas", value: "336h" },
            ],
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true });
        } else {
            let premio = interaction.options.getString("prêmio");
            let tempo = interaction.options.getString("tempo");
            let descricao = interaction.options.getString("descrição");

            let duracao = ms(tempo);

            const botao = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("botao")
                    .setEmoji("🎉")
                    .setLabel(`Participar!`)
                    .setStyle(Discord.ButtonStyle.Primary)
            );

            let click = [];
            let participantes = "Ninguém está participando!";

            let embed = new Discord.EmbedBuilder()
                .setTitle(`🎉 **Novo Sorteio!** 🎉`)
                .setColor("Aqua")
                .setAuthor({
                    name: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({ dynamic: true })
                })
                .setThumbnail('https://example.com/path_to_sponsor_image.png') 
                .setDescription(`
                🎁 **Prêmio:** ${premio}
                📜 **Descrição:** ${descricao}
                ⏳ **Duração:** ${tempo}
                👥 **Participantes:** ${participantes}
        
                Clique no **botão abaixo** para participar!
            `)
                .addFields(
                    { name: '📅 Início do Sorteio:', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                    { name: '🎉 Patrocinador:', value: `${interaction.user}`, inline: true }
                )
                .setImage('https://example.com/path_to_giveaway_banner_image.png')
                .setFooter({
                    text: "Data de Finalização:",
                    iconURL: 'https://example.com/path_to_luck_icon.png' 
                })
                .setTimestamp(Date.now() + duracao);


            let erro = new Discord.EmbedBuilder()
                .setColor("Red")
                .setDescription(`❌ Não foi possível realizar o sorteio! ❌`);

            const msg = await interaction.reply({ embeds: [embed], components: [botao] }).catch(() => {
                interaction.reply({ embeds: [erro] });
            });

            const coletor = msg.createMessageComponentCollector({
                time: duracao
            });
            coletor.on("collect", async (i) => {
                if (i.customId === "botao") {
                    if (click.includes(i.user.id)) {
                        return i.reply({ content: `🚫 **Você já está participando!** 🚫`, ephemeral: true });
                    }
                    click.push(i.user.id);
                    participantes = click.length;
                    embed.setDescription(`
                        🎁 **Prêmio:** ${premio}
                        📜 **Descrição:** ${descricao}
                        ⏳ **Duração:** ${tempo}
                        👥 **Participantes:** ${participantes} participante(s)
            
                        Clique no **botão abaixo** para participar!
                    `);
                    embed.setFields(
                        { name: '📅 Início do Sorteio:', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true },
                        { name: '🎉 Patrocinador:', value: `${interaction.user}`, inline: true }
                    );
                    await i.update({ embeds: [embed], components: [botao] });
                    i.followUp({ content: `✅ **Você entrou no sorteio!** ✅`, ephemeral: true });
                }
            });

            coletor.on("end", () => {
                interaction.editReply({
                    components: [
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setDisabled(true)
                                .setCustomId("sorteio")
                                .setEmoji("🎉")
                                .setStyle(Discord.ButtonStyle.Primary)
                        )
                    ]
                });

                let ganhador = click[Math.floor(Math.random() * click.length)];

                if (click.length == 0) {
                    return interaction.followUp(`**SORTEIO CANCELADO**\nNão houveram participantes no sorteio \`${premio}\`.`);
                }

                interaction.followUp({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle(`🎉🥳 Temos um(a) Ganhador(a)! 🥳🎉`)
                            .setColor("Gold")
                            .setAuthor({
                                name: interaction.guild.name,
                                iconURL: interaction.guild.iconURL({ dynamic: true })
                            })
                            .setThumbnail('https://example.com/path_to_winner_trophy_image.png') 
                            .setDescription(`✨ **Parabéns <@${ganhador}>!** ✨\n\n🎁 Você foi sorteado(a) e ganhou:\n **${premio}**\n\n📜 **Descrição do Prêmio:**\n${descricao}`)
                            .addFields(
                                { name: '👥 Número de Participantes:', value: `${click.length}`, inline: true },
                                { name: '⏰ Duração do Sorteio:', value: `${tempo}`, inline: true },
                                { name: '🎲 Sorteio Concluído em:', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true } 
                            )
                            .setImage('https://example.com/path_to_congratulatory_banner_image.png') 
                            .setFooter({
                                text: "Obrigado a todos que participaram!",
                                iconURL: 'https://example.com/path_to_participation_image.png' 
                            })
                            .setTimestamp()
                    ]
                });
            });
        }
    }
};
