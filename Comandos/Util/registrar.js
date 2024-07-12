const Discord = require("discord.js");

module.exports = {
    name: "registrar",
    description: "Registre-se no servidor.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const roles = {
            registrado: interaction.guild.roles.cache.get("1261039779684810755"),
            idade: {
                mais18: interaction.guild.roles.cache.get("1261039251089395722"),
                menos18: interaction.guild.roles.cache.get("1261039735670050967"),
            },
            genero: {
                homem: interaction.guild.roles.cache.get("1261039204113059890"),
                mulher: interaction.guild.roles.cache.get("1261039161469567106"),
                outro: interaction.guild.roles.cache.get("1261039389698425025"),
            }
        }
        const canal = {
            logs: interaction.guild.channels.cache.get("1131707660593537175"),
        }

        if (interaction.member.roles.cache.get(roles.registrado.id)) return interaction.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setDescription(`Erro: Você já está registrado!`)
            ]
        })

        let embed = new Discord.EmbedBuilder()
            .setColor("White")
            .setDescription(`Clique no botão abaixo para começar seu registro!`)
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })

        const button = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setCustomId("iniciarRegistro" + interaction.id)
                .setEmoji("✅")
                .setLabel("Iniciar!")
                .setStyle(Discord.ButtonStyle.Primary)
        )

        interaction.reply({ embeds: [embed], ephemeral: true, components: [button] }).then(() => {
            const filter = (i) => i.customId === "iniciarRegistro" + interaction.id;
            interaction.channel.createMessageComponentCollector({ max: 1, filter: filter })
                .on("collect", (c) => {
                    c.deferUpdate();
                    const embedIdade = new Discord.EmbedBuilder()
                        .setColor("White")
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setDescription(`**Selecione sua idade!**\n\n*Opções selecionadas:*`);

                    const idadeButton = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("mais18" + interaction.id)
                            .setEmoji("🍻")
                            .setLabel("+18")
                            .setStyle(Discord.ButtonStyle.Primary),

                        new Discord.ButtonBuilder()
                            .setCustomId("menos18" + interaction.id)
                            .setEmoji("🍼")
                            .setLabel("-18")
                            .setStyle(Discord.ButtonStyle.Primary)
                    );

                    let idadeSelecionada;

                    interaction.editReply({ embeds: [embedIdade], components: [idadeButton], ephemeral: true }).then(() => {
                        const filter = (i) => i.customId === "mais18" + interaction.id || i.customId === "menos18" + interaction.id;
                        interaction.channel.createMessageComponentCollector({ max: 1, filter: filter })
                            .on("collect", (c) => {
                                c.deferUpdate();

                                if (c.customId === "mais18" + interaction.id) {
                                    idadeSelecionada = roles.idade.mais18;
                                } else if (c.customId === "menos18" + interaction.id) {
                                    idadeSelecionada = roles.idade.menos18;
                                }

                                const embedGenero = new Discord.EmbedBuilder()
                                    .setColor("White")
                                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                    .setDescription(`**Selecione o seu gênero!**\n\n*Opções selecionadas:* ${idadeSelecionada}`);

                                const generoButton = new Discord.ActionRowBuilder().addComponents(
                                    new Discord.ButtonBuilder()
                                        .setCustomId("Homem" + interaction.id)
                                        .setEmoji("👨")
                                        .setLabel("Homem")
                                        .setStyle(Discord.ButtonStyle.Primary),

                                    new Discord.ButtonBuilder()
                                        .setCustomId("Mulher" + interaction.id)
                                        .setEmoji("👩")
                                        .setLabel("Mulher")
                                        .setStyle(Discord.ButtonStyle.Primary),

                                    new Discord.ButtonBuilder()
                                        .setCustomId("Outro" + interaction.id)
                                        .setEmoji("👀")
                                        .setLabel("Outro")
                                        .setStyle(Discord.ButtonStyle.Primary)
                                );
                                let generoSelecionado;

                                interaction.editReply({ embeds: [embedGenero], components: [generoButton], ephemeral: true }).then(() => {
                                    const filter = (i) => i.customId === "Homem" + interaction.id || i.customId === "Mulher" + interaction.id || i.customId === "Outro" + interaction.id;
                                    interaction.channel.createMessageComponentCollector({ max: 1, filter: filter })
                                        .on("collect", (c) => {
                                            c.deferUpdate();
                                            if (c.customId === "Homem" + interaction.id) {
                                                generoSelecionado = roles.genero.homem;
                                            } else if (c.customId === "Mulher" + interaction.id) {
                                                generoSelecionado = roles.genero.mulher;
                                            } else if (c.customId === "Outro" + interaction.id) {
                                                generoSelecionado = roles.genero.outro;
                                            }

                                            const embedConcluirRegistro = new Discord.EmbedBuilder()
                                                .setColor("White")
                                                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                                .setDescription(`**Confira as opções selecionadas e prossiga com o seu registro.**\n\n*Opções selecionadas:* ${idadeSelecionada} e ${generoSelecionado}`);

                                            const concluirRegistroButton = new Discord.ActionRowBuilder().addComponents(
                                                new Discord.ButtonBuilder()
                                                    .setCustomId("sim" + interaction.id)
                                                    .setEmoji("✅")
                                                    .setStyle(Discord.ButtonStyle.Primary),

                                                new Discord.ButtonBuilder()
                                                    .setCustomId("nao" + interaction.id)
                                                    .setEmoji("❌")
                                                    .setStyle(Discord.ButtonStyle.Primary),
                                            );

                                            interaction.editReply({ ephemeral: true, embeds: [embedConcluirRegistro], components: [concluirRegistroButton] }).then(() => {
                                                const filter = (i) => i.customId === "sim" + interaction.id || i.customId === "nao" + interaction.id;
                                                interaction.channel.createMessageComponentCollector({ max: 1, filter: filter })
                                                    .on("collect", (c) => {
                                                        c.deferUpdate();
                                                        if (c.customId === "sim" + interaction.id) {
                                                            const embedSim = new Discord.EmbedBuilder()
                                                                .setColor("White")
                                                                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                                                .setDescription(`**Seu registro foi concluído!**\n\n*Cargos recebidos: ${idadeSelecionada}, ${generoSelecionado} e ${roles.registrado}*`);
                                                            const embedSimUser = new Discord.EmbedBuilder()
                                                                .setColor("White")
                                                                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                                                .setDescription(`**Seu registro foi concluído!**\n\n*Cargos recebidos:* \`${idadeSelecionada.name}\`, \`${generoSelecionado.name} e \`${roles.registrado.name}\``);

                                                            interaction.editReply({ ephemeral: true, embeds: [embedSim], components: [] });
                                                            interaction.user.send({ embeds: [embedSimUser] });

                                                            interaction.member.roles.add(idadeSelecionada.id);
                                                            interaction.member.roles.add(generoSelecionado.id);
                                                            interaction.member.roles.add(roles.registrado.id);

                                                            const embedLog = new Discord.EmbedBuilder()
                                                                .setColor("White")
                                                                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                                                .setDescription(`Usuário registrado: ${interaction.user}.\n*Cargos recebidos:* ${idadeSelecionada.name}, ${generoSelecionado.name} e ${roles.registrado.name}`);

                                                            canal.logs.send({ embeds: [embedLog] });

                                                        } else if (c.customId === "nao" + interaction.id) {
                                                            const embedNao = new Discord.EmbedBuilder()
                                                                .setColor("White")
                                                                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                                                .setDescription(`**Seu registro foi cancelado!**`);

                                                            interaction.editReply({ ephemeral: true, embeds: [embedNao] });

                                                        }
                                                    });
                                            });
                                        });
                                });
                            });
                    });
                });
        });
    }
}
