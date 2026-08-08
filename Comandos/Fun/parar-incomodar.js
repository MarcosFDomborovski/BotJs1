const { ApplicationCommandType } = require("discord.js");
const { stopDonnie } = require("./incomodar");

module.exports = {
    name: "parar-incomodar",
    description: "Para o Donnie e tira o bot do canal de voz",
    type: ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        const stopped = stopDonnie(client, interaction.guild.id);
        if (!stopped) {
            return interaction.reply({
                content: "Donnie não está ativo neste servidor.",
                ephemeral: true,
            });
        }
        return interaction.reply({ content: "Donnie parado. Bot saiu da call." });
    },
};
