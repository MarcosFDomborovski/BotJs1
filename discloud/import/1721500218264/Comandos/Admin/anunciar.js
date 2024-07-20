const Discord = require("discord.js");
const { description } = require("./dm");

module.exports = {
    name: "anunciar",
    description: "Anuncie algo em uma embed.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "título",
            description: "Escreva algo",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "descrição",
            description: "Escreva algo",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "chat",
            description: "Mencione um canal onde o anúncio será enviado.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: "cor",
            description: "Coloque uma cor em hexadecimal.",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true })
        } else {
            let titulo = interaction.options.getString("título");
            let descricao = interaction.options.getString("descrição");
            let chat = interaction.options.getChannel("chat");
            let cor = interaction.options.getString("cor");
            if (!cor) cor = "Random";
            if (Discord.ChannelType.GuildText !== chat.type)
                return interaction.reply({content:`❌ Este canal não é um canal de texto para enviar uma mensagem!`, ephemeral: true});

            let embed = new Discord.EmbedBuilder()
                .setTitle(titulo)
                .setDescription(descricao)
                .setColor(cor)

            chat.send({ embeds: [embed] }).then(() => {
                interaction.reply({ content: `✅ Seu anúncio foi enviado em ${chat} com sucesso!`, ephemeral: true })
            }).catch((e) => {
                interaction.reply({ content: `❌ Algo deu errado.`, ephemeral: true });
            })
        }
    }
}
