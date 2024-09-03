const Discord = require('discord.js');
const User = require('../../models/user');
const dono = "474334792830156805";
const selectedItems = new Map(); // Map para armazenar itens selecionados temporariamente
const lojaInteracoes = new Map();
const client = require("../../index");
const messages = require('../../models/messages');
const Channel = require('../../models/config')

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
                { nome: 'Mute de 5 minutos', descricao: 'Mute um membro do servidor por 5 minutos.', preco: 1000, emoji: '🔇', customId: 'mute_membro5' },
                { nome: 'Mute de 10 minutos', descricao: 'Mute um membro do servidor por 10 minutos.', preco: 2000, emoji: '🔇', customId: 'mute_membro10' },
                { nome: 'Disconnect', descricao: 'Desconecte um membro de uma chamada de voz.', preco: 500, emoji: '📴', customId: 'disconnect_membro' },
                { nome: 'Ensurdecer', descricao: 'Deixe um membro do servidor surdo por 5 minutos.', preco: 2000, emoji: '🔈', customId: 'deafen_membro' },
            ],
            'cargos': [
                { nome: 'Promoção', descricao: 'Solicitar uma promoção!', preco: 1000, emoji: '🧪', customId: 'promocao_membro' },
                { nome: 'Troca de cargos', descricao: 'Trocar o cargo atual por outro', preco: 2500, emoji: '🧪', customId: 'troca_cargo' }
            ],
            'punicao': [
                { nome: 'Punição', descricao: 'Puna um usuário por 1 dia, proibindo ele de usar canais de voz', preco: 880, emoji: '🚫', customId: 'punish_user' }
            ]
        };

        const categoryOptions = [
            { label: 'Canais de Voz', description: 'Veja os itens disponíveis relacionados a canais de voz.', emoji: '🔊', value: 'chatvoz' },
            { label: 'Cargos', description: 'Veja as opções disponíveis relacionado aos cargos.', emoji: '🧪', value: 'cargos' },
            { label: 'Punição', description: 'Veja os tipos de punições disponíveis para aplicar a um usuário.', emoji: '⛔', value: 'punicao' },
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

        if (lojaInteracoes.has(interaction.user.id)) {
            const oldMessage = lojaInteracoes.get(interaction.user.id);
            try {
                await oldMessage.delete(); // Exclui a mensagem anterior da loja
            } catch (err) {
                console.error('Erro ao deletar a mensagem anterior da loja:', err);
            }
            lojaInteracoes.delete(interaction.user.id); // Remove a referência para evitar duplicidade
        }

        // Responde à interação com a nova mensagem da loja
        const newMessage = await interaction.reply({ embeds: [initialEmbed], components: [createCategoryMenu()], ephemeral: true });
        lojaInteracoes.set(interaction.user.id, newMessage);

        const filter = i => i.user.id === interaction.user.id;
        const collector = newMessage.createMessageComponentCollector({ filter, max: 3, time: 60000 }); ////////////////////////////////////////////////////////////////////////////

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

                    await i.update({ embeds: [embed], components: [itemMenu], ephemeral: true });
                } else if (i.customId === 'select_item') {
                    const selectedItem = Object.values(categorias).flat().find(item => item.customId === i.values[0]);

                    selectedItems.set(interaction.user.id, selectedItem);

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
                    await i.update({ embeds: [confirmEmbed], components: [confirmationButtons], ephemeral: true });

                    const confirmCollector = newMessage.createMessageComponentCollector({ filter, max: 99, time: 60000 }); ////////////////////////////////////////////////////////////////////////////

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
                                    await buttonInteraction.editReply({ embeds: [embed], components: [], ephemeral: true }) || await buttonInteraction.reply({ embeds: [embed], components: [], ephemeral: true });
                                } else {
                                    // MODAL
                                    if (selectedItem.customId === 'deafen_membro') {
                                        const modal = new Discord.ModalBuilder()
                                            .setCustomId('modal_' + selectedItem.customId)
                                            .setTitle('Informações Importantes');

                                        const textInput = new Discord.TextInputBuilder()
                                            .setCustomId('usuarioAlvo')
                                            .setLabel(`${selectedItem.nome} Em quem ? (username/ID)`)
                                            .setPlaceholder(`Ex: 474334792830156805 ou d4rknorris`)
                                            .setStyle(Discord.TextInputStyle.Short)
                                            .setRequired(true);

                                        modal.addComponents(new Discord.ActionRowBuilder().addComponents(textInput));
                                        await buttonInteraction.showModal(modal);
                                    }
                                    else if (['mute_membro5', 'mute_membro10'.includes(selectedItem.customId)]) {
                                        const modal = new Discord.ModalBuilder()
                                            .setCustomId('modal_' + selectedItem.customId)
                                            .setTitle('Informações Importantes');

                                        const textInput = new Discord.TextInputBuilder()
                                            .setCustomId('usuarioAlvo')
                                            .setLabel(`${selectedItem.nome} Em quem ? (ID/username)`)
                                            .setPlaceholder(`Ex: 474334792830156805 ou gypccom`)
                                            .setStyle(Discord.TextInputStyle.Short)
                                            .setRequired(true);

                                        modal.addComponents(new Discord.ActionRowBuilder().addComponents(textInput));

                                        await buttonInteraction.showModal(modal);
                                    }
                                    else if (selectedItem.customId.includes('disconnect_membro')) {
                                        const modal = new Discord.ModalBuilder()
                                            .setCustomId('modal_' + selectedItem.customId)
                                            .setTitle('Informações Importantes');

                                        const textInput = new Discord.TextInputBuilder()
                                            .setCustomId('usuarioAlvo')
                                            .setLabel(`Digite o username/ID do Discord do usuário alvo.`)
                                            .setPlaceholder('Ex: 474334792830156805 ou gypcoom')
                                            .setStyle(Discord.TextInputStyle.Short)
                                            .setRequired(true);

                                        modal.addComponents(new Discord.ActionRowBuilder().addComponents(textInput));

                                        await buttonInteraction.showModal(modal);
                                    }
                                    else if (selectedItem.customId === 'punish_user') {
                                        const modal = new Discord.ModalBuilder()
                                            .setCustomId('modal_' + selectedItem.customId)
                                            .setTitle('Informações Obrigatórias para o funcionamento');

                                        const textInput = new Discord.TextInputBuilder()
                                            .setCustomId('usuarioAlvo')
                                            .setLabel(`Digite o username/ID do Discord do usuário alvo.`)
                                            .setPlaceholder('Ex: 474334792830156805 ou d4rknorris')
                                            .setStyle(Discord.TextInputStyle.Short)
                                            .setRequired(true);

                                        modal.addComponents(new Discord.ActionRowBuilder().addComponents(textInput));

                                        await buttonInteraction.showModal(modal);

                                    } else if (['troca_cargo'].includes(selectedItem.customId)) {
                                        const modal = new Discord.ModalBuilder()
                                            .setCustomId('modal_' + selectedItem.customId)
                                            .setTitle('Informações Adicionais');

                                        const textInput = new Discord.TextInputBuilder()
                                            .setCustomId('usuarioAlvo')
                                            .setLabel(`${selectedItem.nome} Em quem ?`)
                                            .setPlaceholder(`Ex: quero *trocar de cargo* com o dark...`)
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
                                        await buttonInteraction.editReply({ embeds: [embed], components: [], ephemeral: true }) || await buttonInteraction.reply({ embeds: [embed], components: [], ephemeral: true });
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
                                    .setTimestamp(Date.now())
                                    .addFields(
                                        {
                                            name: '> 💰 Saldo Atual',
                                            value: `**${membro.dinheiro} moedas**`,
                                            inline: false,
                                        }
                                    )

                                await buttonInteraction.deferUpdate();
                                await buttonInteraction.editReply({ embeds: [embed], components: [], ephemeral: true }) || await buttonInteraction.reply({ embeds: [embed], components: [], ephemeral: true });
                                confirmCollector.stop();
                            }
                        } catch (error) {
                            console.error('Erro ao processar interação do botão de confirmação:', error);
                        }
                    });

                    confirmCollector.on('end', async collected => {
                        if (collected.size === 0) {
                            console.table('confirmColector reiniciou')
                        }

                        lojaInteracoes.delete(interaction.user.id)
                    });
                }
            } catch (err) {
                console.error('Erro ao processar a interação:', err);
            }
        });

        collector.on('end', collected => {
            if (!collected.size) {
                console.table('Coletor reiniciou')
            }
        });
    }
};
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    let membro = await User.findOne({ discordId: interaction.user.id });
    if (!membro) membro = new User({ discordId: interaction.user.id, username: interaction.user.username });

    const modalId = interaction.customId;

    const channel = await Channel.findOne({guildId: interaction.guild.id})
    if(!channel || !channel.logsChannelId){
        return interaction.reply({content: `O canal de logs da loja não está configurado!\nConfigure esse canal pelo comando **/botconfig**.`})
    }
    const canalLogs = interaction.guild.channels.cache.get(`${channel.logsChannelId}`)
    if(!canalLogs || canalLogs === null || canalLogs === ``){
        return interaction.reply({content: `O canal de logs da loja não foi encontrado! Verifique se foi configurado corretamente pelo comando **/botconfig**.`})
    }

    let memberDono = await interaction.guild.members.fetch(dono);

    const selectedItem = selectedItems.get(interaction.user.id);
    const targetId = interaction.fields.getTextInputValue('usuarioAlvo');

    // Check if the interaction is from the correct modal
    if (modalId.startsWith('modal_')) {
        if (modalId.endsWith('deafen_membro')) {
            const selectedItem = selectedItems.get(interaction.user.id);
            const targetId = interaction.fields.getTextInputValue('usuarioAlvo');

            try {


                let targetUsername = interaction.guild.members.cache.find(m => m.user.username === targetId) || await interaction.guild.members.fetch(targetId);
                targetUsername = await interaction.guild.members.fetch(targetUsername.id);

                let deafSelf = targetUsername.voice.deaf || targetUsername.voice.selfDeaf;


                if (!targetUsername || targetUsername === undefined || targetUsername === null) {
                    console.log('username/ID errado')
                    return
                }
                else if (targetUsername) {
                    const voiceChannnel = targetUsername.voice.channel
                    if (voiceChannnel) {
                        if (deafSelf) {
                            await interaction.deferUpdate();
                            await interaction.editReply({ content: `**O usuário ${targetUsername.user} já perdeu a audição!\nTente com outro usuário.**`, components: [], embeds: [], ephemeral: true });
                        } else {
                            await targetUsername.voice.setDeaf(true, `Perdeu a audição pelo usuário ${interaction.user}\n**Motivo: Item comprado na loja!**`);
                            await targetUsername.send(`Perdeu a audição pelo usuário ${interaction.user}\n**Motivo:** Item comprado na loja!`);
                        }
                    } else {
                        await interaction.deferUpdate();
                        await interaction.editReply({ content: `**O usuário ${targetUsername.user} não está em um canal de voz!\nTente com outro usuário.**`, ephemeral: true, embeds: [], components: [] }) || await interaction.reply({ content: `**O usuário ${targetUsername.user} não está em um canal de voz!\nTente com outro usuário.**`, ephemeral: true, embeds: [], components: [] });
                        return;
                    }
                }
                setTimeout(async () => {
                    await targetUsername.voice.setDeaf(false, `Sua audição voltou!\n**Motivo**: Já se passaram **5 minutos!**`)
                    await targetUsername.send(`Olá ${targetUsername.user}, Sua audição voltou!\n**Motivo**: Já se passaram **5 minutos!**`)
                }, 300000);

                membro.dinheiro -= selectedItem.preco
                await membro.save();

                let embed = new Discord.EmbedBuilder()
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor('Green')
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTitle('✅ Compra Efetuada! ✅')
                    .setDescription(`Olá ${interaction.user}, você comprou **${selectedItem.nome}**\nO usuário **${targetUsername.user}** perdeu o direito de ouvir outros membros com sucesso!`)
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
                await interaction.editReply({ content: '', embeds: [embed], components: [], ephemeral: true }) || await interaction.reply({ content: '', embeds: [embed], components: [], ephemeral: true });
            } catch (err) {
                console.log('o imundo escreveu o id/username errado')
            }

        }
        else if (modalId.endsWith('mute_membro5') || modalId.endsWith('mute_membro10')) {
            const selectedItem = selectedItems.get(interaction.user.id); // Recupera o item selecionado
            const targetId = interaction.fields.getTextInputValue('usuarioAlvo');

            try {
                let targetUsername = interaction.guild.members.cache.find(m => m.user.username === targetId) || await interaction.guild.members.fetch(targetId);
                targetUsername = await interaction.guild.members.fetch(targetUsername.id);

                let muteSelf = targetUsername.voice.mute;
                const voiceChannnel = targetUsername.voice.channel

                let tempo
                if (modalId.endsWith('mute_membro5')) tempo = '5 minutos';
                else tempo = '10 minutos';

                if (!targetUsername || targetUsername === null || targetUsername === undefined) {
                    console.log("usuario/ID inválido")
                    return;
                } else if (voiceChannnel) {
                    if (muteSelf) {
                        await interaction.deferUpdate();
                        await interaction.editReply({ content: `**O usuário ${targetUsername.user.username} já está mutado!**\n**Tente novamente com outro usuário!**`, embeds: [], components: [], ephemeral: true }) || await interaction.reply({ content: `**O usuário ${targetUsername.user.username} já está mutado!**\n**Tente novamente com outro usuário!**`, embeds: [], components: [], ephemeral: true });
                        return;
                    } else {
                        try {
                            if (!targetUsername) throw new Error('Usuário não encontrado!')
                            await targetUsername.voice.setMute(true, `Mutado por ${tempo} pelo usuário ${interaction.user}\n**Motivo**: Item comprado na loja!`);
                            await targetUsername.send(`Mutado por ${tempo} pelo usuário ${interaction.user}\n**Motivo**: Item comprado na loja!`);
                        } catch (err) {
                            console.log('deu merda porra')
                        }
                    }
                } else {
                    await interaction.deferUpdate();
                    await interaction.editReply({ content: `**O usuário ${targetUsername.user} não está em um canal de voz!\nTente com outro usuário.**`, ephemeral: true, embeds: [], components: [] }) || await interaction.reply({ content: `**O usuário ${targetUsername.user} não está em um canal de voz!\nTente com outro usuário.**`, ephemeral: true, embeds: [], components: [] });
                    return;
                }
                try {

                    if (tempo === "10 minutos") {
                        setTimeout(async () => {
                            await targetUsername.voice.setMute(false, `**Desmutado!**\n**Motivo**: Já se passaram **${tempo}**`)
                            await targetUsername.send({ content: `Olá ${targetUsername.user}, Você já pode falar novamente!\n**Motivo**: Já se passaram **${tempo}**` })
                        }, 600000);
                    } else if (tempo === "5 minutos") {
                        setTimeout(async () => {
                            await targetUsername.voice.setMute(false, `**Desmutado!**\n**Motivo**: Já se passaram **${tempo}**`)
                            await targetUsername.send({ content: `Olá ${targetUsername.user}, Você já pode falar novamente!\n**Motivo**: Já se passaram **${tempo}**` })
                        }, 300000);
                    }
                } catch (err) {
                    console.error(`Erro ao desmutar o usuário\n`, err);
                }

                membro.dinheiro -= selectedItem.preco
                await membro.save();

                let embed = new Discord.EmbedBuilder()
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor('Green')
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTitle('✅ Compra Efetuada! ✅')
                    .setDescription(`Olá ${interaction.user}, você comprou **${selectedItem.nome}**\nO usuário ${targetUsername.user} foi mutado por **${tempo}**`)
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
                await interaction.editReply({ embeds: [embed], components: [], ephemeral: true }) || await interaction.reply({ embeds: [embed], components: [], ephemeral: true });
            } catch (err) {
                console.log('o arrombado escreveu o id/username errado')
                await interaction.deferUpdate();
                return interaction.editReply({ content: `❌ **Erro: ID ou nome de usuário inválido. Por favor, insira um ID ou nome de usuário válido.**`, embeds: [], components: [], ephemeral: true })
            }
        }
        else if (modalId.endsWith('disconnect_membro')) {
            const selectedItem = selectedItems.get(interaction.user.id); // Recupera o item selecionado
            const targetId = interaction.fields.getTextInputValue('usuarioAlvo');

            try {
                let targetUsername = interaction.guild.members.cache.find(m => m.user.username === targetId) || await interaction.guild.members.fetch(targetId);
                targetUsername = await interaction.guild.members.fetch(targetUsername.id);
                if (!targetUsername || targetUsername === undefined || targetUsername === null) {
                    console.log('username/ID errado')
                    return
                }
                else if (targetUsername) {
                    const voiceChannnel = targetUsername.voice.channel
                    if (voiceChannnel) {
                        await targetUsername.voice.disconnect(`Desconectado pelo usuário ${interaction.user}\n**Motivo:** Item comprado na loja!`);
                        await targetUsername.send(`Desconectado pelo usuário ${interaction.user}\n**Motivo:** Item comprado na loja!`);
                        membro.dinheiro -= selectedItem.preco
                    } else {
                        await interaction.deferUpdate();
                        await interaction.editReply({ content: `**O usuário ${targetUsername.user} não está em um canal de voz!\nTente com outro usuário.**`, ephemeral: true, embeds: [], components: [] }) || await interaction.reply({ content: `**O usuário ${targetUsername.user} não está em um canal de voz!\nTente com outro usuário.**`, ephemeral: true, embeds: [], components: [] });
                        return;
                    }
                }
                await membro.save();

                let embed = new Discord.EmbedBuilder()
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor('Green')
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTitle('✅ Compra Efetuada! ✅')
                    .setDescription(`Olá ${interaction.user}, você comprou **${selectedItem.nome}**\nO usuário ${targetUsername.user} foi desconectado com sucesso!`)
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
                await interaction.editReply({ content: ``, embeds: [embed], components: [], ephemeral: true });
            } catch (err) {
                console.log('o infeliz escreveu errado o id/username')
                await interaction.deferUpdate();
                return interaction.editReply({ content: `❌ **Erro: ID ou nome de usuário inválido. Por favor, insira um ID ou nome de usuário válido.**`, embeds: [], components: [], ephemeral: true })
            }
        }
        else if (modalId.endsWith('punish_user')) {
            const selectedItem = selectedItems.get(interaction.user.id); // Recupera o item selecionado
            const targetUser = interaction.fields.getTextInputValue('usuarioAlvo');
            const cargoCastigo = interaction.guild.roles.cache.get('1269001666632487044').id


            try {
                let targetUsername = interaction.guild.members.cache.find(m => m.user.username === targetUser) || await interaction.guild.members.fetch(targetUser);
                targetUsername = await interaction.guild.members.fetch(targetUsername.id);

                if (!targetUsername || targetUsername === undefined || targetUsername === null) {
                    console.log('username/ID errado')
                    console.log(3123124892134)
                } else if (targetUsername) {
                    try {
                        targetUsername.roles.add(cargoCastigo)
                        targetUsername.send(`Olá ${targetUsername.user}\nVocê foi colocado de castigo por 1 dia pelo usuário **${interaction.user}**`)
                        console.log('usuário entrou no castigo')
                        setTimeout(() => {
                            targetUsername.roles.remove(cargoCastigo);
                            targetUsername.send(`Olá ${targetUsername.user}\nVocê saiu do castigo!\**nMotivo:** Já se passou 1 dia.`)
                            console.log("usuário saiu do castigo")
                        }, 86400000);




                        let embed = new Discord.EmbedBuilder()
                            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                            .setColor('Green')
                            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setTitle('✅ Compra Efetuada! ✅')
                            .setDescription(`Olá ${interaction.user}, você comprou **${selectedItem.nome}** para usar no usuário **${targetUsername.user}**\n`)
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
                        await interaction.editReply({ content: ``, embeds: [embed], components: [], ephemeral: true });
                    } catch (err) {
                        interaction.deferUpdate() || interaction.deferReply();
                        interaction.editReply({ content: `❌ **Erro: ID ou nome de usuário inválido. Por favor, insira um ID ou nome de usuário válido.**`, embeds: [], components: [], ephemeral: true }) || interaction.reply({ content: `❌ **Erro: ID ou nome de usuário inválido. Por favor, insira um ID ou nome de usuário válido.**`, embeds: [], components: [], ephemeral: true })

                    }
                }

            } catch (err) {
                console.log('o incompetente digitou o id/username errado')
                await interaction.deferUpdate();
                return interaction.editReply({ content: `❌ **Erro: ID ou nome de usuário inválido. Por favor, insira um ID ou nome de usuário válido.**`, embeds: [], components: [], ephemeral: true })
            }

            membro.dinheiro -= selectedItem.preco
            await membro.save();


        } else {
            const selectedItem = selectedItems.get(interaction.user.id); // Recupera o item selecionado
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
            await interaction.editReply({ content: ``, embeds: [embed], components: [], ephemeral: true });
        }
    }
    try {
        let targetUsername = interaction.guild.members.cache.find(m => m.user.username === targetId) || await interaction.guild.members.fetch(targetId);
        targetUsername = await interaction.guild.members.fetch(targetUsername.id);
        if (!targetUsername) throw new Error('Usuário não encontrado!')

        let embedAviso = new Discord.EmbedBuilder()
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setColor('Random')
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setTitle('✅ Compra Efetuada! ✅')
            .setDescription(`Olá ${memberDono}\nO usuário (${interaction.user}) - (id - ${interaction.user.id}) comprou e usou **${selectedItem.nome}** no usuário **${targetUsername.user.username}**!`)
            .setFooter({ text: 'Data da compra:' })
            .setTimestamp(Date.now());

        canalLogs.send({ embeds: [embedAviso] });
    } catch (err) {
        await interaction.deferUpdate();
        await interaction.editReply({ content: `**O usuário ${targetUsername.user} não está em um canal de voz!\nTente com outro usuário.**`, ephemeral: true, embeds: [], components: [] }) || await interaction.reply({ content: `**O usuário ${targetUsername.user} não está em um canal de voz!\nTente com outro usuário.**`, ephemeral: true, embeds: [], components: [] });
        return;
    }
});
