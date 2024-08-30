
//////////////////////////////////////////////////////////////// CONFIGURAR CANAL DE LOGS //////////////////////////////////////////////////////////////////

const Discord = require("discord.js");
module.exports = {
    name: "cargo_botao",
    description: "Ganhe cargos clicando nos botões.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "cargo",
            description: "Mencione o cargo que deseja ser adicionado no botão.",
            type: Discord.ApplicationCommandOptionType.Role,
            required: true,
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageRoles)) {
            interaction.reply({ content: `Você não tem permissões para utilizar este comando!`, ephemeral: true })
        } else {
            let cargo = interaction.options.getRole("cargo");
            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setTitle(`💼 Resgate seu Cargo! 💼`)
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setDescription(`Clique no botão abaixo para adquirir o cargo **${cargo.name}**.`)
                .setFooter({ text: `Data:` })
                .setTimestamp(Date.now())

            let botao = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId("cargo_b" + interaction.id)
                    .setLabel("Clique Aqui!")
                    .setStyle(Discord.ButtonStyle.Primary)
            );

            interaction.reply({ embeds: [embed], components: [botao] }).then(() => {
                let coletor = interaction.channel.createMessageComponentCollector();

                coletor.on("collect", (c) => {
                    if (!c.member.roles.cache.get(cargo.id)) {
                        c.member.roles.add(cargo.id)
                        // testar ${cargo}
                        c.reply({ content: `Olá ${c.user.username}, você resgatou o cargo ${cargo}.`, ephemeral: true })
                    } else if (c.member.roles.cache.get(cargo.id)) {
                        c.member.roles.remove(cargo.id)
                        // testar ${cargo}
                        c.reply({ content: `Olá ${c.user.username}, você perdeu o cargo ${cargo}.`, ephemeral: true })
                    }
                })
            })
        }
    }
}