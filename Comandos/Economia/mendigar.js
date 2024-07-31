const Discord = require('discord.js')
const User = require('../../models/user')

module.exports = {
    name: 'mendigar',
    description: 'Tente a sorte para ganhar algumas moedas!',
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        let user = await User.findOne({ discordId: interaction.user.id });
        if (!user) user = new User({ discordId: interaction.user.id, username: interaction.user.username });

        let dialogosWin = [
            'Você olha para o chão e encontra um saco de moedas!',
            '',
            '',
            '',
            '',
        ]
        let dialogoLose = [
            '',
            '',
            '',
            '',
            '',
        ]

        let randomL = Math.floor(Math.random() * dialogosWin.length);
        let randomW = Math.floor(Math.random() * dialogosWin.length);

        let didWin = Math.random() > 0.5;

        const amount = Number((User.dinheiro * (Math.random() + 0.55)).toFixed(0))
        if (didWin) {
            user.dinheiro += amount

            let embed = new Discord.EmbedBuilder()
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setColor("Green")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }), })
                .setDescription(`${dialogosWin[randomW]} **+ ${amount} moedas.**`)
                .setFooter({ text: `Data de resgate:` })
                .setTimestamp(Date.now())
                .setFields(
                    {
                        name: "> 💵 Saldo anterior",
                        value: `${user.dinheiro} moedas`,
                        inline: false,
                    },
                    {
                        name: "> 💰 Saldo atual",
                        value: `${user.dinheiro + amount} moedas`,
                        inline: true,
                    }
                )
            interaction.reply({ embeds: [embed] })
        }
        else if (!didWin) {
            user.dinheiro -= amount;

            let embed = new Discord.EmbedBuilder()
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setColor("Red")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }), })
                .setDescription(`${dialogoLose[randomL]}`)
                .setFooter({ text: `Data:` })
                .setTimestamp(Date.now())
                .setFields(
                    {
                        name: "> 💵 Saldo anterior",
                        value: `${user.dinheiro} moedas`,
                        inline: false,
                    },
                    {
                        name: "> 💸 Saldo atual",
                        value: `${user.dinheiro - amount} moedas`,
                        inline: true,
                    }
                )
            interaction.reply({ embeds: [embed] })
        }
        await user.save()
    }
}
