const Discord = require('discord.js');
const User = require('../../models/user');

module.exports = {
    name: 'mendigar',
    description: 'Tente a sorte para ganhar algumas moedas!',
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let user = await User.findOne({ discordId: interaction.user.id });
        if (!user) user = new User({ discordId: interaction.user.id, username: interaction.user.username });

        let dialogosWin = [
            'Você olha para o chão e encontra um saco de moedas!',
            'ganhou',
            'ganhou',
            'ganhou',
            'ganhou',
        ];
        let dialogoLose = [
            'perdeu',
            'perdeu',
            'perdeu',
            'perdeu',
            'perdeu',
        ];
        let dialogoLoseM = [
            'perdeuDinhero',
            'perdeuDinhero',
            'perdeuDinhero',
        ];

        let randomW = Math.floor(Math.random() * dialogosWin.length);
        let randomLoseM = Math.floor(Math.random() * dialogoLoseM.length);

        let didWin = Math.random() > 0.55;

        let amount = Number((70 * (Math.random() + 0.55)).toFixed(0));
        let amountLoss = Number((60 * (Math.random() + 0.5)).toFixed(0));

        if (didWin) {
            user.dinheiro += amount;
            console.log(amount);

            let embed = new Discord.EmbedBuilder()
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setColor("Green")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`${dialogosWin[randomW]} \n**+ ${amount} moedas.**`)
                .setFooter({ text: `Data de resgate:` })
                .setTimestamp(Date.now())
                .setFields(
                    {
                        name: "> 💵 Saldo anterior",
                        value: `${user.dinheiro - amount} moedas`,
                        inline: false,
                    },
                    {
                        name: "> 💰 Saldo atual",
                        value: `${user.dinheiro} moedas`,
                        inline: true,
                    }
                );
            interaction.reply({ embeds: [embed] });
        } else {
            if (user.dinheiro > 0) {
                let maxLoss = Math.min(amountLoss, user.dinheiro); // Garantir que a perda não seja maior que o saldo

                user.dinheiro -= maxLoss;
                let embed = new Discord.EmbedBuilder()
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor("Red")
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setDescription(`${dialogoLoseM[randomLoseM]} \n**- ${maxLoss} moedas.**`)
                    .setFooter({ text: `Data:` })
                    .setTimestamp(Date.now())
                    .setFields(
                        {
                            name: "> 💵 Saldo anterior",
                            value: `${user.dinheiro + maxLoss} moedas`,
                            inline: false,
                        },
                        {
                            name: "> 💸 Saldo atual",
                            value: `${user.dinheiro} moedas`,
                            inline: true,
                        }
                    );
                interaction.reply({ embeds: [embed] });
            }
        }
        await user.save();
    }
};
