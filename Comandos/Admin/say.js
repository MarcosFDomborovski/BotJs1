const Discord = require("discord.js");

module.exports = {
    name: "say",
    description: "Faça o bot dizer algo",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "embed",
            description: "Faça o bot dizer algo em Embed",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: "normal",
            description: "Faça o bot dizer algo normal",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageMessages)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true });
        } else {
            let embedMessage = interaction.options.getString("embed");
            let normalMessage = interaction.options.getString("normal");

            if (!embedMessage) embedMessage = "⠀";
            if (!normalMessage) normalMessage = "⠀";

            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(embedMessage);

            if (embedMessage === "⠀") {
                interaction.reply({ content: `Sua mensagem foi enviada!`, ephemeral: true })
                interaction.channel.send({ content: `${normalMessage}` })
            } else if (normalMessage === "⠀") {
                interaction.reply({ content: `Sua mensagem foi enviada!`, ephemeral: true })
                interaction.channel.send({ embeds: [embed] })
            } else {
                interaction.reply({ content: `Sua mensagem foi enviada!`, ephemeral: true })
                interaction.channel.send({ content: `${normalMessage}`, embeds: [embed] })

            }
        }
    }
}