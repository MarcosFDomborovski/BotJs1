const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "slowmode",
    description: "Configure o modo lento em um canal de texto.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "tempo",
            description: "Coloque o tempo do modo lento [s|m|h].",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "canal",
            description: "Mencione um canal de texto.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageChannels)) {
            return interaction.reply({ content: `Você não tem permissão para utilizar este comando!`, ephemeral: true });
        }

        let t = interaction.options.getString("tempo");
        let tempo = ms(t);
        let channel = interaction.options.getChannel("canal") || interaction.channel;

        if (!tempo && t !== "0s") {
            return interaction.reply({ content: `Forneça um tempo válido: [s|m|h].`, ephemeral: true });
        }

        if (t === "0s") {
            if (channel.rateLimitPerUser === 0) {
                return interaction.reply({ content: `O modo lento já está desativado no canal ${channel}.`, ephemeral: true });
            }

            channel.setRateLimitPerUser(0).then(() => {
                interaction.reply({ content: `O modo lento foi desativado no canal ${channel}.` });
            }).catch(e => {
                interaction.reply({ content: "Algo deu errado ao desativar o modo lento.", ephemeral: true });
                console.error(e);
            });
        } else {
            channel.setRateLimitPerUser(tempo / 1000).then(() => {
                interaction.reply({ content: `O canal de texto ${channel} teve seu modo lento definido para \`${t}\`.` });
            }).catch(e => {
                interaction.reply({ content: `Algo deu errado ao executar este comando, verifique minhas permissões.`, ephemeral: true });
                console.error(e);
            });
        }
    }
};
