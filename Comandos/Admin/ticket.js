const Discord = require("discord.js");
//1532.
module.exports = {
    name: "ticket",
    description: "Abra o painel de tickets.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true });
        } else {
            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`Abra um ticket aqui no servidor selecionando uma das opções abaixo:`);

            let painel = new Discord.ActionRowBuilder().addComponents(
                new Discord.SelectMenuBuilder()
                    .setCustomId("painel_ticket")
                    .setPlaceholder("Clique aqui!")
                    .addOptions(
                        {
                            label: "Opção 1",
                            description: "Abra um ticket na opção 1",
                            value: "opc1",
                        },
                        {
                            label: "Opção 2",
                            description: "Abra um ticket na opção 2",
                            value: "opc2",
                        },
                        {
                            label: "Opção 3",
                            description: "Abra um ticket na opção 3",
                            value: "opc3",
                        },
                    )
            )
            interaction.reply({ content: `✅ Mensagem enviada!`, ephemeral: true })
            interaction.channel.send({ embeds: [embed], components: [painel] })
        }
    }
}