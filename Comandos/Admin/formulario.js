const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "formulário",
    description: "Abra o painel do formulário para os membros.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal_formulário",
            description: "Mencione um canal para enviar o formulário para os membros.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não tem permissão para utilizar este comando.`, ephemeral: true });
        } else {
            let canal_formulario = interaction.options.getChannel("canal_formulário");
            let canalLogs = "1264342985256992849"

            if (canal_formulario.type !== Discord.ChannelType.GuildText) {
                interaction.reply({ content: `O canal ${canal_formulario} não é um canal de texto!`, ephemeral: true })

            } else if (canalLogs.type !== Discord.ChannelType.GuildText) {
            
                interaction.reply({ content: `O canal ${canalLogs} não é um canal de texto!`, ephemeral: true })
            
            } else {
                await db.set(`canal_formulario_${interaction.guild.id}`, canal_formulario.id)
                await db.set(`canal_logs_${interaction.guild.id}`, canalLogs.id)

                let embed = new Discord.EmbedBuilder()
                    .setColor("Random")
                    .setTitle("Canais configurados!")
                    .setDescription(`> Canal do formulário: ${canal_formulario}.\n> Canal de logs: ${canalLogs}`)

                interaction.reply({ embeds: [embed], ephemeral: true }).then(() => {
                    let embedFormulario = new Discord.EmbedBuilder()
                        .setColor("Random")
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .setThumbnail(interaction.guild.iconURL({ dynamic: true}))
                        .setTitle(`Formulário:`)
                        .setDescription(`Faça seu formulário clicando no botão abaixo!`)

                    let botao = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                           .setCustomId("formulario")
                           .setEmoji("☝")
                           .setLabel("Clique Aqui")
                           .setStyle(Discord.ButtonStyle.Primary)
                    );

                    canal_formulario.send({embeds: [embedFormulario], components:[botao]})
                })
            }
        }
    }
}