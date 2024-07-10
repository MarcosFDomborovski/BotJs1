const Discord = require("discord.js");

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

        let user = interaction.options.getUser("usuário");
        let dataConta = user.createdAt.toLocaleString();
        let id = user.id
        let tag = user.tag
        let isBot = user.bot

        if (isBot === true) isBot = "Sim";
        if (isBot === false) isBot = "Não";

        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTitle("Informações do usuário:")
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
