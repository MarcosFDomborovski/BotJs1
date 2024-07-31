const Discord = require('discord.js');

module.exports = {
    name: 'loja',
    description: 'Exibe a loja de itens.',
    type: Discord.ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        // Definição das categorias e itens
        const categorias = {
            'armas': [
                { nome: 'Espada de Fogo', descricao: 'Uma espada encantada com o poder do fogo.', preco: 100, emoji: '🔥', customId: 'comprar_espada' },
                { nome: 'Escudo de Gelo', descricao: 'Um escudo forte com o poder de gelo.', preco: 150, emoji: '❄️', customId: 'comprar_escudo' }
            ],
            'pocoes': [
                { nome: 'Poção de Cura', descricao: 'Uma poção mágica que restaura a saúde.', preco: 50, emoji: '🧪', customId: 'comprar_pocao' }
            ],
            'armaduras': [
                { nome: 'Elmo de Ferro', descricao: 'Um elmo resistente feito de ferro.', preco: 80, emoji: '🪖', customId: 'comprar_elmo' },
                { nome: 'Botas de Velocidade', descricao: 'Botas que aumentam a velocidade de quem as usa.', preco: 120, emoji: '👟', customId: 'comprar_botas' }
            ]
        };

        const categoryOptions = [
            { label: 'Armas', description: 'Veja os itens disponíveis na loja de armas.', emoji: '⚔️', value: 'armas' },
            { label: 'Poções', description: 'Veja as poções disponíveis na loja.', emoji: '🧪', value: 'pocoes' },
            { label: 'Armaduras', description: 'Veja as armaduras disponíveis na loja.', emoji: '🛡️', value: 'armaduras' }
        ];

        // Função para criar o menu de categorias
        const createCategoryMenu = () => {
            return new Discord.ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId('select_category')
                    .setPlaceholder('Escolha uma categoria')
                    .addOptions(categoryOptions)
            );
        };

        // Função para criar o menu de itens baseado na categoria
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

        // Função para criar o embed de confirmação
        const createConfirmationEmbed = (item) => {
            return new Discord.EmbedBuilder()
                .setColor('Yellow')
                .setTitle('Confirmar Compra')
                .setDescription(`Você está prestes a comprar **${item.nome}** por **${item.preco} moedas**.\nDeseja confirmar?`)
        };

        // Enviar o painel inicial com categorias
        const initialEmbed = new Discord.EmbedBuilder()
            .setColor('Random')
            .setTitle('🛒 Loja de Itens')
            .setDescription('Escolha uma categoria abaixo para explorar os itens.')
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }));

        await interaction.reply({ embeds: [initialEmbed], components: [createCategoryMenu()] });

        const filter = i => i.user.id === interaction.user.id;

        // Coletor de interações para categorias e itens
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'select_category') {
                await i.deferUpdate();

                const selectedCategory = i.values[0];
                const itemMenu = createItemMenu(selectedCategory);
                const embed = new Discord.EmbedBuilder()
                    .setColor('Random')
                    .setTitle('🛒 Loja de Itens')
                    .setDescription('Escolha um item para comprar na categoria selecionada.')
                    .setThumbnail(interaction.guild.iconURL({ dynamic: true }));

                await i.editReply({ embeds: [embed], components: [itemMenu] });

            } else if (i.customId === 'select_item') {
                const selectedItem = Object.values(categorias).flat().find(item => item.customId === i.values[0]);

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
                await i.update({ embeds: [confirmEmbed], components: [confirmationButtons] });

                // Criar novo coletor para a confirmação
                const confirmCollector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

                confirmCollector.on('collect', async buttonInteraction => {
                    if (buttonInteraction.customId === 'confirmar_compra') {
                        // Lógica para confirmar a compra e debitar moedas do usuário
                        await buttonInteraction.update({ content: `Você comprou **${selectedItem.nome}**!`, embeds: [], components: [] });
                    } else if (buttonInteraction.customId === 'cancelar_compra') {
                        await buttonInteraction.update({ content: 'Compra cancelada.', embeds: [], components: [] });
                    }
                });

                confirmCollector.on('end', collected => {
                    // Remover botões após o tempo limite
                    if (collected.size === 0) {
                        i.editReply({ content: 'Tempo para confirmar a compra expirado.', embeds: [], components: [] });
                    }
                });
            }
        });

        collector.on('end', collected => {
            console.log(`Coletor terminou com ${collected.size} interações coletadas.`);
        });
    }
};
