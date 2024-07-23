const Discord = require('discord.js');

module.exports = {
    name: "slap",
    description: "Dê um tapa em um membro.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "membro",
            description: "Mencione um membro.",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    run: async (client, interaction, args) => {
        try {
            let user = interaction.options.getUser("membro");

            let lista1 = [
                'https://imgur.com/RgfGLNk.gif',
                'https://i.imgur.com/r9aU2xv.gif',
                'https://i.imgur.com/wOmoeF8.gif',
                'https://i.imgur.com/nrdYNtL.gif',
                'https://imgur.com/82xVqUg.gif'
            ];

            let lista2 = [
                'https://imgur.com/c3WzMZu.gif',
                'https://imgur.com/BPLqSJC.gif',
                'https://imgur.com/ntqYLGl.gif',
                'https://imgur.com/v47M1S4.gif',
                'https://imgur.com/6qYOUQF.gif'
            ];

            let random1 = lista1[Math.floor(Math.random() * lista1.length)];
            let random2 = lista2[Math.floor(Math.random() * lista2.length)];

            let embed = new Discord.EmbedBuilder()
                .setDescription(`**O membro ${interaction.user} deu um tapa em ${user}.**`)
                .setImage(`${random1}`)
                .setColor("Random");

            let button = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('1')
                        .setLabel('Devolver')
                        .setStyle(Discord.ButtonStyle.Primary)
                        .setDisabled(false)
                );

            let embed1 = new Discord.EmbedBuilder()
                .setDescription(`**${user} Devolveu o tapa de ${interaction.user}.**`)
                .setImage(`${random2}`)
                .setColor("Random")
            await interaction.reply({ embeds: [embed], components: [button] });

            const filter = i => i.customId === '1' && i.user.id === user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                try {
                    if (i.customId === '1') {
                        await i.reply({ embeds: [embed1] });
                        collector.stop();
                    }
                } catch (error) {
                    console.error('Erro ao responder à interação:', error);
                    await i.followUp({ content: 'Ocorreu um erro ao processar sua interação.', ephemeral: true });
                }
            });

            collector.on("end", async collected => {
                try {
                    if (collected.size === 0) {
                        await interaction.followUp({ content: 'O tempo para retribuir o tapa acabou.', ephemeral: true });
                    }
                    await interaction.editReply({
                        components: [
                            new Discord.ActionRowBuilder()
                                .addComponents(
                                    new Discord.ButtonBuilder()
                                        .setCustomId('1')
                                        .setLabel('Devolver')
                                        .setStyle(Discord.ButtonStyle.Primary)
                                        .setDisabled(true)
                                )
                        ]
                    });
                } catch (error) {
                    console.error('Erro ao editar a resposta:', error);
                }
            });
        } catch (error) {
            console.error('Erro na execução do comando:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true });
            } else {
                await interaction.followUp({ content: 'Ocorreu um erro ao executar o comando.', ephemeral: true });
            }
        }
    }
};
