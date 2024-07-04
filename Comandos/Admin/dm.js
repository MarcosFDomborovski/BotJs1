const Discord = require("discord.js");

module.exports = {
    name: "dm",
    description: "Envie uma mensagem no privado de um usuário",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            description: "Mencione um usuário",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "mensagem",
            description: "Digite a mensagem",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            interaction.reply({ content: `Você não tem permissão para utilizar este comando!`, ephemeral: true });
        } else {
            let user = interaction.options.getUser("usuário");
            let msg = interaction.options.getString("mensagem");

            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${msg}`);

            try {
                user.send({ embeds: [embed] })
                let emb = new Discord.EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`Olá ${interaction.user}, a mensagem foi enviada para ${user} com sucesso!`);

                    interaction.reply({embeds: [emb]})

            } catch (e) {
                let emb = new Discord.EmbedBuilder()
                .setColor("Red")
                .setDescription(`Olá ${interaction.user}, a mensagem não foi enviada para ${user}, pois o usuário está com a DM fechada!`);
                
                interaction.reply({embeds: [emb]})
            }
        }
    }
}