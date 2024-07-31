const Discord = require('discord.js');
const User = require('../../models/user');

module.exports = {
    name: 'allwin',
    description: 'All-win!',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'confirmação',
            description: 'Tem certeza do que está fazendo? (30% de chance para multiplicar suas moedas em x5)',
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Sim, eu tenho certeza! 😎',
                    value: 'true',
                },
                {
                    name: 'Não, vou voltar atrás ☠',
                    value: 'false',
                },
            ],
        },
    ],
    run: async (client, interaction) => {
        let user = await User.findOne({ discordId: interaction.user.id });
        if (!user) {
            user = new User({ discordId: interaction.user.id, username: interaction.user.username });
            await user.save();
        }

        let confirm = interaction.options.getString('confirmação');
        let amount = user.dinheiro * 2;
        
        if (confirm === 'true') {
            let didWin = Math.random() < 0.25; // 25% de chance de ganhar
            let embed;

            if (didWin) {
                user.dinheiro += amount;
                embed = new Discord.EmbedBuilder()
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor('Green')
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTitle('🤑 Estourou! 🤑')
                    .setDescription(`Olá ${interaction.user}, você apostou todas suas **${amount / 2} moedas**, e **ganhou ${amount} moedas**!`)
                    .setFooter({ text: 'Data:' })
                    .setTimestamp(Date.now())
                    .addFields(
                        {
                            name: '> 💵 Saldo anterior',
                            value: `${amount / 2} moedas`,
                            inline: false,
                        },
                        {
                            name: '> 💰 Saldo atual',
                            value: `${user.dinheiro} moedas`,
                            inline: true,
                        }
                    );
            } else {
                user.dinheiro = 0;
                embed = new Discord.EmbedBuilder()
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor('Red')
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTitle('☠ Faliu! ☠')
                    .setDescription(`Parabéns ${interaction.user}, você apostou **${amount / 2} moedas**, e **PERDEU!** :skull_crossbones:`)
                    .setFooter({ text: 'Data da falência:' })
                    .setTimestamp(Date.now())
                    .addFields(
                        {
                            name: '> 💵 Saldo anterior',
                            value: `${amount / 2} moedas`,
                            inline: false,
                        },
                        {
                            name: '> :leaves: Saldo atual',
                            value: `${user.dinheiro} moedas`,
                            inline: true,
                        }
                    );
            }

            interaction.reply({ embeds: [embed] });
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
                    }
                );

            interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await user.save();
    }
};
