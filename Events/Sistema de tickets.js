require(`../index`)
const Discord = require("discord.js")
const client = require('../index')

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "ticketsBasico") {
            let nomeCanal = `🎫-ticket-${interaction.user.username}`;
            let canal = interaction.guild.channels.cache.find(c => c.name === nomeCanal)

            if (canal) {
                interaction.reply({ content: `Olá **${interaction.user.username}**, você já possui um ticket em **${canal}**.`, ephemeral: true })
            } else {

                let categoria = interaction.channel.parent;
                if (!categoria) categoria = null;
                interaction.guild.channels.create({
                    name: nomeCanal,
                    parent: categoria,
                    type: Discord.ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [Discord.PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.SendMessages,
                                Discord.PermissionFlagsBits.AttachFiles,
                                Discord.PermissionFlagsBits.EmbedLinks,
                                Discord.PermissionFlagsBits.AddReactions
                            ]
                        }
                    ]
                }).then((chat) => {

                    interaction.reply({ content: `🎫 Olá **${interaction.user.username}**, seu ticket foi aberto em **${chat}**`, ephemeral: true })
                    let embed = new Discord.EmbedBuilder()
                        .setColor("Random")
                        .setDescription(`Olá ${interaction.user}, você abriu o seu ticket.\nAguarde um momento para ser atendido!`);

                    let botao_close = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("closeTicket")
                            .setEmoji("🔒")
                            .setStyle(Discord.ButtonStyle.Danger)
                    );

                    chat.send({ embeds: [embed], components: [botao_close] }).then(m => {
                        m.pin();
                    })
                })
            }
        } else if (interaction.customId === "closeTicket") {
            interaction.reply(`Olá ${interaction.user}, este ticket será excluído em 5 segundos.`)
            try {
                setTimeout(() => {
                    interaction.channel.delete().catch(e => { return; })
                }, 5000)
            } catch (e) {
                return;
            }
        }
    }
})