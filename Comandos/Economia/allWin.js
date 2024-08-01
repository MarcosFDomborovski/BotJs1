const Discord = require('discord.js');
const User = require('../../models/user');

module.exports = {
    name: 'allwin',
    description: 'All-win! Aposte todas suas moedas para ter uma chance de 25% para multiplicar suas moedas em x5!',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'confirmação',
            description: 'Tem certeza do que está fazendo? Não dá pra voltar atrás.',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Sim, eu tenho certeza! 😎',
                    value: 'true',
                },
                {
                    name: 'Não, mudei de idéia ☠',
                    value: 'false',
                },
            ],
        },
    ],
    run: async (client, interaction) => {
        let user = await User.findOne({ discordId: interaction.user.id });
        if (!user) {
            user = new User({ discordId: interaction.user.id, username: interaction.user.username });
        }

        let confirm = interaction.options.getString('confirmação');
        let amount = user.dinheiro * 5;

        if (confirm === 'true') {
            if (user.dinheiro === 0) {
                let embed;
                embed = new Discord.EmbedBuilder()
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor('Red')
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTitle('☠ Ricasso! ☠')
                    .setDescription(`Parabéns ${interaction.user}, você apostou incríveis **${user.dinheiro} moedas**, e **GANHOU 0 MOEDAS!**\nQuem diria né 🤔:skull_crossbones:`)
                    .setFooter({ text: 'Data da comédia:' })
                    .setTimestamp(Date.now())
                    .addFields(
                        {
                            name: '> ☠ Saldo anterior',
                            value: `**${user.dinheiro} moedas**`,
                            inline: false,
                        },
                        {
                            name: '> ☠ Saldo atual',
                            value: `**${user.dinheiro} moedas**`,
                            inline: true,
                        }
                    );
                interaction.reply({ embeds: [embed] });
            } else {
                let didWin = Math.random() < 0.25; // 25% de chance de ganhar
                if (didWin) {
                    user.dinheiro += amount;
                    embed = new Discord.EmbedBuilder()
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setColor('Green')
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTitle('🤑 Estourou! 🤑')
                        .setDescription(`Olá ${interaction.user}, você apostou todas suas **${amount / 5} moedas**, e **ganhou ${amount} moedas**!`)
                        .setFooter({ text: 'Data:' })
                        .setTimestamp(Date.now())
                        .addFields(
                            {
                                name: '> 💵 Saldo anterior',
                                value: `${amount / 5} moedas`,
                                inline: false,
                            },
                            {
                                name: '> 💰 Saldo atual',
                                value: `${user.dinheiro} moedas`,
                                inline: true,
                            }
                        )
                    interaction.reply({ embeds: [embed] });
                } else {
                    user.dinheiro = 0;
                    embed = new Discord.EmbedBuilder()
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setColor('Red')
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setTitle('☠ Faliu! ☠')
                        .setDescription(`Parabéns ${interaction.user}, você apostou **${amount / 5} moedas**, e **PERDEU!** :skull_crossbones:`)
                        .setFooter({ text: 'Data da falência:' })
                        .setTimestamp(Date.now())
                        .addFields(
                            {
                                name: '> 💵 Saldo anterior',
                                value: `${amount / 5} moedas`,
                                inline: false,
                            },
                            {
                                name: '> :leaves: Saldo atual',
                                value: `${user.dinheiro} moedas`,
                                inline: true,
                            }
                        )
                    interaction.reply({ embeds: [embed] });
                }
            }
        } else {
            let embed = new Discord.EmbedBuilder()
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setColor('Random')
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTitle('🧠 Fez a escolha certa... 🧠')
                .setDescription(`Olá ${interaction.user}, você decidiu fugir!`)
                .setFooter({ text: 'Data:' })
                .setTimestamp(Date.now())
                .addFields(
                    {
                        name: '> 💰 Saldo Atual',
                        value: `**${user.dinheiro} moedas**`,
                        inline: false,
                    },
                    {
                        name: '> 🤑 Possíveis ganhos',
                        value: `**${amount} moedas**`,
                        inline: true,
                    },
                );

            interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await user.save();
    }
};
