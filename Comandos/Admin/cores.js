const Discord = require("discord.js");

module.exports = {
    name: "cores",
    description: "Abra o painel de seleção de cores do nick",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true });
        } else {
            const cores = {
                azul: interaction.guild.roles.cache.get("1261369186307936266"),
                verde: interaction.guild.roles.cache.get("1261369253471191070"),
                amarelo: interaction.guild.roles.cache.get("1261369293267009626"),
                laranja: interaction.guild.roles.cache.get("1261369500729610332"),
                vermelho: interaction.guild.roles.cache.get("1261369406072688721"),
                rosa: interaction.guild.roles.cache.get("1261369743542321214"),
                roxo: interaction.guild.roles.cache.get("1261369680199942186"),
                preto: interaction.guild.roles.cache.get("1261369866724573315"),
                branco: interaction.guild.roles.cache.get("1261369946051706982")
            }

            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor("Random")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setDescription(`Reaja a mensagem abaixo para mudar a **cor** do ***seu nick!***\n
                🔵 Azul -  [${cores.azul}]
                🟢 Verde - [${cores.verde}]
                🟡 Amarelo - [${cores.amarelo}]
                🟠 Laranja - [${cores.laranja}]
                🔴 Vermelho - [${cores.vermelho}]
                🌹  Rosa - [${cores.rosa}]
                🟣 Roxo - [${cores.roxo}]
                ⚫ Preto - [${cores.preto}]
                ⚪ Branco - [${cores.branco}]
                `)

            interaction.reply({ ephemeral: true, content: `Mensagem enviada abaixo:` }).then(() => {
                interaction.channel.send({ embeds: [embed] }).then(message => {
                    const emojis = [`🔵`, `🟢`, `🟡`, `🟠`, `🔴`, `🌹`, `🟣`, `⚫`, `⚪`]
                    emojis.forEach(emoji => {
                        message.react(emoji)
                    })
                })
            })
        }
    }
}