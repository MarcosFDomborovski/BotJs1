const Discord = require('discord.js');
const User = require('../../models/user');
const dono = "474334792830156805";
const selectedItems = new Map(); // Map para armazenar itens selecionados temporariamente
const client = require("../../index")

module.exports = {
    name: 'loja',
    description: 'Exibe a loja de itens.',
    type: Discord.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        let membro = await User.findOne({ discordId: interaction.user.id });
        if (!membro) membro = new User({ discordId: interaction.user.id, username: interaction.user.username });

        // Definição das categorias e itens
        const categorias = {
            'chatvoz': [
                { nome: 'Mute de 5 minutos', descricao: 'Mute um membro do servidor por 5 minutos.', preco: 10000, emoji: '🔇', customId: 'mute_membro5' },
                { nome: 'Mute de 10 minutos', descricao: 'Mute um membro do servidor por 10 minutos.', preco: 20000, emoji: '🔇', customId: 'mute_membro10' },
                { nome: 'Disconnect', descricao: 'Desconecte um membro de uma chamada de voz por 10 minutos.', preco: 5000, emoji: '📴', customId: 'disconnect_membro' },
                { nome: 'Ensurdecer', descricao: 'Deixe um membro do servidor surdo por 5 minutos.', preco: 20000, emoji: '🔈', customId: 'deafen_membro' },
            ],
            'cargos': [
                { nome: 'Promoção', descricao: 'Solicitar uma promoção!', preco: 1000, emoji: '🧪', customId: 'promocao_membro' },
                { nome: 'Troca de cargos', descricao: 'Trocar o cargo atual por outro', preco: 2500, emoji: '🧪', customId: 'troca_cargo' }
            ],
            '': [
                { nome: 'Elmo de Ferro', descricao: 'Um elmo resistente feito de ferro.', preco: 80, emoji: '🪖', customId: 'comprar_elmo' },
                { nome: 'Botas de Velocidade', descricao: 'Botas que aumentam a velocidade de quem as usa.', preco: 120, emoji: '👟', customId: 'comprar_botas' }
            ]
        };

        const categoryOptions = [
            { label: 'Canais de Voz', description: 'Veja os itens disponíveis relacionados a canais de voz.', emoji: '🔊', value: 'chatvoz' },
            { label: 'Cargos', description: 'Veja as opções disponíveis relacionado aos cargos.', emoji: '🧪', value: 'cargos' },
        ];

        const createCategoryMenu = () => {
            return new Discord.ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select_category')
                    .setPlaceholder('Escolha uma categoria')
                    .addOptions(categoryOptions)
            );
        };

        const createItemMenu = (categoria) => {
            const items = categorias[categoria];
            return new Discord.ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select_item')
                    .setPlaceholder('Escolha um item para comprar')
                    .addOptions(items.map(item => ({
                        label: item.nome,
                        description: item.descricao,
                        value: item.customId,
                        emoji: item.emoji
                    })))
            );
        };

        const createConfirmationEmbed = (item) => {
            return new Discord.EmbedBuilder()
                .setColor('Yellow')
                .setTitle('Confirmar Compra')
                .setDescription(`Você está prestes a comprar **${item.nome}** por **${item.preco} moedas**.\nDeseja confirmar?`);
        };

        const initialEmbed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setTitle('🛒 Loja de Itens')
            .setDescription('Escolha uma categoria abaixo para explorar os itens.')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }));

        await interaction.reply({ embeds: [initialEmbed], components: [createCategoryMenu()], ephemeral: true });

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, max: 3 });

        collector.on('collect', async i => {
            try {
                if (i.customId === 'select_category') {
                    const selectedCategory = i.values[0];
                    const itemMenu = createItemMenu(selectedCategory);
                    const embed = new Discord.EmbedBuilder()
                        .setColor('Random')
                        .setTitle('🛒 Loja de Itens')
                        .setDescription('Escolha um item para comprar na categoria selecionada.')
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true }));

                    await i.deferUpdate({ embeds: [embed], components: [itemMenu], ephemeral: true });
                    await i.editReply({ embeds: [embed], components: [itemMenu], ephemeral: true });
                } else if (i.customId === 'select_item') {
                    const selectedItem = Object.values(categorias).flat().find(item => item.customId === i.values[0]);

                    selectedItems.set(interaction.user.id, selectedItem); // Armazena o item selecionado

                    const confirmationButtons = new Discord.ActionRowBuilder()
                        .addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId('confirmar_compra')
                                .setLabel('Confirmar')
                                .setStyle(Discord.ButtonStyle.Success),
                            new Discord.ButtonBuilder()
                                .setCustomId('cancelar_compra')
                                .setLabel('Cancelar')
                                .setStyle(Discord.ButtonStyle.Danger)
                        );

                    const confirmEmbed = createConfirmationEmbed(selectedItem);
                    await i.deferUpdate({ embeds: [confirmEmbed], components: [confirmationButtons] });
                    await i.editReply({ embeds: [confirmEmbed], components: [confirmationButtons] });

                    const confirmCollector = interaction.channel.createMessageComponentCollector({ filter, max: 3 });

                    confirmCollector.on('collect', async buttonInteraction => {
                        try {
                            if (buttonInteraction.customId === 'confirmar_compra') {
                                if (membro.dinheiro < selectedItem.preco) {
                                    let embed = new Discord.EmbedBuilder()
                                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                                        .setColor('Red')
                                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                        .setTitle('❌ Saldo Insuficiente! ❌')
                                        .setDescription(`Olá ${interaction.user}, você não tem moedas suficientes para comprar o item (${selectedItem.nome})!`)
                                        .setFooter({ text: 'Data:' })
                                        .setTimestamp(Date.now())
                                        .addFields(
                                            {
                                                name: '> 💰 Saldo Atual',
                                                value: `**${membro.dinheiro} moedas**`,
                                                inline: false,
                                            },
                                            {
                                                name: '> 💰 Faltam',
                                                value: `**${selectedItem.preco - membro.dinheiro} moedas**`,
                                                inline: false,
                                            }
                                        );
                                    await buttonInteraction.deferUpdate();
                                    await buttonInteraction.editReply({ embeds: [embed], components: [], ephemeral: true });
                                    return;

                                } else {
                                    // MODAL
                                    if (['mute_membro5', 'mute_membro10', 'disconnect_membro', 'deafen_membro', 'troca_cargo'].includes(selectedItem.customId)) {
                                        const modal = new Discord.ModalBuilder()
                                            .setCustomId('modal_' + selectedItem.customId)
                                            .setTitle('Informações Adicionais');

                                        const textInput = new Discord.TextInputBuilder()
                                            .setCustomId('usuarioAlvo')
                                            .setLabel(`Em quem ? ${selectedItem.nome} ?`)
                                            .setStyle(Discord.TextInputStyle.Short)
                                            .setRequired(true);

                                        modal.addComponents(new Discord.ActionRowBuilder().addComponents(textInput));

                                        await buttonInteraction.showModal(modal);

                                    } else { // BOTÃO
                                        membro.dinheiro -= selectedItem.preco;
                                        await membro.save();
                                        let embed = new Discord.EmbedBuilder()
                                            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                                            .setColor('Green')
                                            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                            .setTitle('✅ Compra Efetuada! ✅')
                                            .setDescription(`Olá ${interaction.user}, você comprou **${selectedItem.nome}**\nNo momento, os itens são enviados manualmente por um ADM, peço que aguarde pacientemente!\nOu fale com o meu dono <@${dono}>!`)
                                            .setFooter({ text: 'Data da compra:' })
                                            .setTimestamp(Date.now())
                                            .addFields(
                                                {
                                                    name: '> 💸 Quantia gasta',
                                                    value: `**${selectedItem.preco} moedas**`,
                                                    inline: false,
                                                },
                                                {
                                                    name: '> 🛒 Produto Comprado',
                                                    value: `**${selectedItem.nome}**`,
                                                    inline: false,
                                                },
                                                {
                                                    name: '> 💰 Saldo Atual',
                                                    value: `**${membro.dinheiro} moedas**`,
                                                    inline: false,
                                                }
                                            );

                                        await buttonInteraction.deferUpdate();
                                        await buttonInteraction.editReply({ embeds: [embed], components: [], ephemeral: true });
                                    }
                                }
                            } else if (buttonInteraction.customId === 'cancelar_compra') {
                                let embed = new Discord.EmbedBuilder()
                                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                                    .setColor('Red')
                                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                                    .setTitle('❌ Compra Cancelada! ❌')
                                    .setDescription(`Olá ${interaction.user}, você cancelou a compra do item **${selectedItem.nome}**!`)
                                    .setFooter({ text: 'Data:' })
                                    .setTimestamp(Date.now());

                                await buttonInteraction.deferUpdate();
                                await buttonInteraction.editReply({ embeds: [embed], components: [], ephemeral: true });
                            }
                        } catch (error) {
                            console.error('Erro ao processar interação do botão de confirmação:', error);
                        }
                    });

                    confirmCollector.on('end', collected => {
                        if (collected.size === 0) {
                            console.log("deu boa")
                        }
                    });
                }
            } catch (error) {
                console.error('Erro ao processar interação:', error);
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    }
};

// Listener para modal submit
client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;

    const modalId = interaction.customId;

    let membro = await User.findOne({ discordId: interaction.user.id });
    if (!membro) membro = new User({ discordId: interaction.user.id, username: interaction.user.username });

    // Check if the interaction is from the correct modal
    if (modalId.startsWith('modal_')) {
        const selectedItem = selectedItems.get(interaction.user.id); // Recupera o item selecionado
        const targetUser = interaction.fields.getTextInputValue('usuarioAlvo');
        let member = await interaction.guild.members.fetch(dono);
        membro.dinheiro -= selectedItem.preco
        await membro.save();

        let embed = new Discord.EmbedBuilder()
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setColor('Green')
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle('✅ Compra Efetuada! ✅')
            .setDescription(`Olá ${interaction.user}, você comprou **${selectedItem.nome}**\nNo momento, os itens são enviados manualmente por um ADM, peço que aguarde pacientemente!\nOu fale com o meu dono <@${dono}>!`)
            .setFooter({ text: 'Data da compra:' })
            .setTimestamp(Date.now())
            .addFields(
                {
                    name: '> 💸 Quantia gasta',
                    value: `**${selectedItem.preco} moedas**`,
                    inline: false,
                },
                {
                    name: '> 🛒 Produto Comprado',
                    value: `**${selectedItem.nome}**`,
                    inline: false,
                },
                {
                    name: '> 💰 Saldo Atual',
                    value: `**${membro.dinheiro} moedas**`,
                    inline: false,
                }
            );
        await interaction.deferUpdate();
        await interaction.editReply({ embeds: [embed], components: [], ephemeral: true });

        let embedAviso = new Discord.EmbedBuilder()
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setColor('Random')
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle('✅ Compra Efetuada! ✅')
            .setDescription(`Olá ${member}, o usuário (${interaction.user}) - [id - ${interaction.user.id}] comprou **${selectedItem.nome}** para usar no usuário **${targetUser}!**\n**_Lembre-se de enviar para ele!_**`)
            .setFooter({ text: 'Data da compra:' })
            .setTimestamp(Date.now());

        member.send({ embeds: [embedAviso] });
    }
});
