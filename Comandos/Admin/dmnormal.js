const Discord = require("discord.js");

module.exports = {
    name: "dm-normal",
    description: "Envie uma mensagem no privado de um usuário (ADM apenas)",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            description: "Mencione um usuário",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "normal",
            description: "Conteúdo da mensagem.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não tem permissão para utilizar este comando!`, ephemeral: true });
        } else {
            let user = interaction.options.getUser("usuário");
            let msgNormal = interaction.options.getString("normal");

            user.send(msgNormal)
            let emb = new Discord.EmbedBuilder()
                .setColor("Green")
                .setTitle(`📨 Mensagem Enviada! 📨`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Olá ${interaction.user}, a mensagem foi enviada para ${user} com sucesso!`);

            interaction.reply({ embeds: [emb], ephemeral: true })
        }
    }
}
