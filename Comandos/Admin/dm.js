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
            name: "embed",
            description: "Envie a mensagem em embed",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: "normal",
            description: "Envie a mensagem sem embed",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            interaction.reply({ content: `Você não tem permissão para utilizar este comando!`, ephemeral: true });
        } else {
            let user = interaction.options.getUser("usuário");
            let msgEmbed = interaction.options.getString("embed");
            let msgNormal = interaction.options.getString("normal");

            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setTitle(`📬 Mensagem Recebida! 📬`)
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`${msgEmbed}`);

            if (!msgEmbed) msgEmbed = "⠀";
            if (!msgNormal) msgNormal = "⠀";

            if (!msgNormal && !msgEmbed) {
                interaction.reply({ content: `Olá ${interaction.user}, você deve fornecer ao menos uma mensagem!`, ephemeral: true })
            }

            if (msgEmbed === "⠀") {
                try {
                    user.send(msgNormal);
                    let emb = new Discord.EmbedBuilder()
                        .setColor("Green")
                        .setTitle(`📨 Mensagem Enviada! 📨`)
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`Olá ${interaction.user}, a mensagem foi enviada para ${user} com sucesso!`);

                    interaction.reply({ embeds: [emb], ephemeral: true })

                } catch (e) {
                    let emb = new Discord.EmbedBuilder()
                        .setColor("Red")
                        .setTitle(`❌ Algo deu errado! ❌`)
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`Olá ${interaction.user}, a mensagem não foi enviada para ${user}, pois o usuário está com a DM fechada!`);

                    interaction.reply({ embeds: [emb], ephemeral: true })
                }

            } else if (msgNormal === "⠀") {
                try {
                    user.send({ embeds: [embed] })
                    let emb = new Discord.EmbedBuilder()
                        .setColor("Green")
                        .setTitle(`📨 Mensagem Enviada! 📨`)
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`Olá ${interaction.user}, a mensagem foi enviada para ${user} com sucesso!`);

                    interaction.reply({ embeds: [emb], ephemeral: true })

                } catch (e) {
                    let emb = new Discord.EmbedBuilder()
                        .setColor("Red")
                        .setTitle(`❌ Algo deu errado! ❌`)
                        .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(`Olá ${interaction.user}, a mensagem não foi enviada para ${user}, pois o usuário está com a DM fechada!`);

                    interaction.reply({ embeds: [emb], ephemeral: true })
                }
            }
        }
    }
}