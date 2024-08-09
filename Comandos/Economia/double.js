const Discord = require('discord.js')
const User = require('../../models/user')

module.exports = {
    name: 'double',
    description: 'Double or nothing! (50% de chance para duplicar sua aposta!)',
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'quantidade',
            description: 'Quantidade de moedas que deseja apostar.',
            type: Discord.ApplicationCommandOptionType.Number,
            required: true
        },
    ],
    run: async (client, interaction) => {

        let moedas = interaction.options.getNumber("quantidade");
        let user = await User.findOne({ discordId: interaction.user.id });
        if (!user) user = new User({ discordId: interaction.user.id, username: interaction.user.username });

        if (user.dinheiro < moedas) {
            let embed = new Discord.EmbedBuilder()
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setColor("Red")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }), })
                .setTitle(`💸 Saldo Insuficiente! 💸`)
                .setDescription(`Olá ${interaction.user}, você tentou apostar **${moedas} moedas**, tendo apenas **${user.dinheiro} moedas!**\nUtilize o comando \`/daily\` ou aposte uma **quantia menor!**`)
                .setFooter({ text: `Data:` })
                .setTimestamp(Date.now())
            interaction.reply({ embeds: [embed] })
        } else {

            let didWin = Math.random() < 0.5;

            const amountWon = Math.floor(moedas * 2);
            if (didWin) {
                user.dinheiro += amountWon

                let embed = new Discord.EmbedBuilder()
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor("Green")
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }), })
                    .setTitle(`🤑 Algo inesperado ocorreu! 🤑`)
                    .setDescription(`O usuário ${interaction.user} apostou **${moedas} moedas**, e **ganhou ${amountWon} moedas**!`)
                    .setFooter({ text: `Data de resgate:` })
                    .setTimestamp(Date.now())
                    .setFields(
                        {
                            name: "> 💵 Saldo anterior",
                            value: `**${user.dinheiro - amountWon} moedas**`,
                            inline: false,
                        },
                        {
                            name: "> 💰 Saldo atual",
                            value: `**${user.dinheiro} moedas**`,
                            inline: true,
                        }
                    )
                interaction.reply({ embeds: [embed] })
            }
            else if (!didWin) {
                user.dinheiro -= moedas;

                let embed = new Discord.EmbedBuilder()
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setColor("Red")
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }), })
                    .setTitle(`💸 Temos um novo perdedor! 💸`)
                    .setDescription(`Parabéns **${interaction.user}**, você apostou **${moedas} moedas**, e **PERDEU!** :rofl:`)
                    .setFooter({ text: `Data da falência:` })
                    .setTimestamp(Date.now())
                    .setFields(
                        {
                            name: "> 💵 Saldo anterior",
                            value: `**${user.dinheiro + moedas} moedas**`,
                            inline: false,
                        },
                        {
                            name: "> 💸 Saldo atual",
                            value: `**${user.dinheiro} moedas**`,
                            inline: true,
                        }
                    )
                interaction.reply({ embeds: [embed] })
            }
        }
        await user.save()
    }
}
