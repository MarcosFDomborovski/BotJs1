const Discord = require("discord.js");
const { description } = require("./dm");
const Channel = require("../../models/config")

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
            name: "cor",
            description: "Coloque uma cor em hexadecimal.",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        const channel = await Channel.findOne({ guildId: interaction.guild.id })

        if (!channel || !channel.announcementChannelId)
            return interaction.reply({ content: `Canal de anúncios não configurado!\nUtilize o comando **/botconfig** para configurar os canais.`, ephemeral: true });

        const announcementChannel = interaction.guild.channels.cache.get(channel.announcementChannelId)
        if (!announcementChannel || announcementChannel === undefined)
            return interaction.reply({ content: `O canal de anúncios não foi configurado!\nUtilize o comando **/botconfig** para configurar os canais.`, ephemeral: true });


        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true })
        } else {
            let titulo = interaction.options.getString("título");
            let descricao = interaction.options.getString("descrição");
            let cor = interaction.options.getString("cor");
            if (!cor) cor = "Random";

            let embed = new Discord.EmbedBuilder()
                .setColor(cor)
                .setTitle(`✨ ${titulo} ✨`)
                .setDescription(descricao)
                .setTimestamp();

                announcementChannel.send({ embeds: [embed] }).then(() => {
                interaction.reply({ content: `✅ Seu anúncio foi enviado em ${announcementChannel} com sucesso!`, ephemeral: true })
            }).catch((e) => {
                interaction.reply({ content: `❌ Algo deu errado.`, ephemeral: true });
            })
        }
    }
}