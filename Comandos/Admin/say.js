const Discord = require("discord.js");

module.exports = {
    name: "say",
    description: "Faça o bot dizer algo",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "normal",
            description: "Faça o bot dizer algo",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true });
        } else {
            let normalMessage = interaction.options.getString("normal");

            interaction.reply({ content: `Sua mensagem foi enviada!`, ephemeral: true })
            interaction.channel.send({ content: `${normalMessage}`})
        }
    }
}
