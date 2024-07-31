const Discord = require("discord.js");
const moment = require("moment-timezone");
const User = require("../../models/user")

require('moment/locale/pt-br')
moment.updateLocale('pt-br', {
    months: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ],
    monthsShort: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ],
    weekdays: [
        "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
    ],
    weekdaysShort: [
        "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"
    ],
    longDateFormat:
    {
        LLLL: 'dddd, D [de] MMMM [de] YYYY [às] LTS'
    }
})

module.exports = {
    name: "userinfo",
    description: "Veja as informações de um usuário.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            description: "Mencione um usuário.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        moment.locale('pt-br')
        let user = interaction.options.getUser("usuário")
        let member = await interaction.guild.members.fetch(user.id)


        let carteiraUsuario = await User.findOne({ discordId: member.id })
        if (!carteiraUsuario) carteiraUsuario = new User({ discordId: member.id, username: user.username })
        await carteiraUsuario.save()

        let dinheiro = carteiraUsuario.dinheiro


        let roles = member.roles.cache.filter(role => role.name !== "@everyone")
            .map(role => role.name)
            .join(', ') || 'Nenhum'

        let dataEntrada = moment(member.joinedAt).tz('America/Sao_Paulo').format("LLLL")
        let dataConta = moment(user.createdAt).tz('America/Sao_Paulo').format("LLLL")

        let id = user.id
        let tag = user.tag
        let isBot = user.bot

        if (isBot === true) isBot = "Sim."
        if (isBot === false) isBot = "Não."

        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle("Informações do usuário:")
            .setFooter({text: `Data:`})
            .setTimestamp(Date.now())
            .setFields(
                {
                    name: `🎇 Tag:`,
                    value: `\`${tag}\`.`,
                    inline: false
                },
                {
                    name: `📆 Criação da conta:`,
                    value: `\`${dataConta}\`.`,
                    inline: false
                },
                {
                    name: `🤖 é um bot ?`,
                    value: `\`${isBot}\`.`,
                    inline: false
                },
                {
                    name: `🆔 ID:`,
                    value: `\`${id}\`.`,
                    inline: false
                },
                {
                    name: `🔹 Status:`,
                    value: `\`${member.presence?.status || 'Offline'}\`.`,
                    inline: true
                },
                {
                    name: `🎮 Atividade:`,
                    value: `\`${member.presence?.activities[0]?.name || 'Nenhuma atividade'}\`.`,
                    inline: true
                },
                {
                    name: `💰 Carteira:`,
                    value: `\`${dinheiro} moedas.\``,
                    inline: true
                },
                {
                    name: `📅 Entrou no servidor:`,
                    value: `\`${dataEntrada}\`.`,
                    inline: false
                },
                {
                    name: `📛 Cargos:`,
                    value: `${roles}`,
                    inline: true
                },
            )

        let botao = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
                .setURL(user.displayAvatarURL({ dynamic: true }))
                .setEmoji("📎")
                .setStyle(Discord.ButtonStyle.Link)
                .setLabel(`Avatar de ${user.username}.`)
        )

        interaction.reply({ embeds: [embed], components: [botao] })
    }
}
