const Discord = require("discord.js");

module.exports = {
    name: "dm-embed",
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
            name: "embed",
            description: "Envie a mensagem em embed",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            interaction.reply({ content: `Você não tem permissão para utilizar este comando!`, ephemeral: true });
        } else {
            let user = interaction.options.getUser("usuário");
            let msgEmbed = interaction.options.getString("embed");

            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setTitle(`📬 Mensagem Recebida! 📬`)
                .setDescription(`**${msgEmbed}**`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'De:', value: `${interaction.user}`, inline: true },
                    { name: 'Para:', value: `${user}`, inline: true }
                )
                .setFooter({ text: 'Mensagem enviada via Discord Bot', iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setTimestamp();

            try {
                user.send({ embeds: [embed] })
                let emb = new Discord.EmbedBuilder()
                    .setColor("Green")
                    .setTitle(`📨 Mensagem Enviada! 📨`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Olá ${interaction.user}, a mensagem foi enviada para ${user} com sucesso!`);

                await interaction.reply({ embeds: [emb], ephemeral: true })

            } catch (e) {
                let emb = new Discord.EmbedBuilder()
                    .setColor("Red")
                    .setTitle(`❌ Algo deu errado! ❌`)
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(`Olá ${interaction.user}, a mensagem não foi enviada para ${user}, pois o usuário está com a DM fechada!`);


                await interaction.reply({ embeds: [emb], ephemeral: true })
            }
        }
    }
}
