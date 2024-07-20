const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "enquete",
    description: "Crie uma enquete no servidor.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "tempo",
            description: "Coloque um tempo em [ s | m | h ].",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "titulo",
            description: "Coloque um título para a enquete.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "opção1",
            description: "Adicione a opção 1 da votação.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "opção2",
            description: "Adicione a opção 2 da votação.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: "Você não possui permissão para executar este comando!", ephemeral: true });
        } else {
            const tempo = interaction.options.getString("tempo");
            const titulo = interaction.options.getString("titulo");
            const op1 = interaction.options.getString("opção1");
            const op2 = interaction.options.getString("opção2");

            let tempoMs = ms(tempo);
            if (isNaN(tempoMs)) return interaction.reply({ ephemeral: true, content: `**Informe um tempo válido!**}` })

            const emojis = ['1️⃣', '2️⃣']

            const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor("Yellow")
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setTitle(`Nova enquete:  ` + titulo)
                .setDescription(`Nova enquete criada por ${interaction.user}.\n\n> ${emojis[0]} - ${op1}\n> ${emojis[1]} - ${op2}`)
                .setTimestamp(new Date(new Date().getTime() + tempoMs))
                .setFooter({ text: `Data de término da enquete:` })

            interaction.reply({ ephemeral: true, content: `Enquete Criada!` }).then(() => {
                interaction.channel.send({ embeds: [embed] }).then((msgg) => {
                    emojis.forEach(emoji => {
                        msgg.react(emoji)
                    })
                    setTimeout(async () => {

                        const msg = await interaction.channel.messages.fetch(msgg.id)

                        let emojiOpc1 = msg.reactions.cache.get(emojis[0])?.count || 0;
                        let emojiOpc2 = msg.reactions.cache.get(emojis[1])?.count || 0;

                        if (msg.reactions.cache.get(emojis[0])?.me) {
                            emojiOpc1--
                        }
                        if (msg.reactions.cache.get(emojis[1])?.me) {
                            emojiOpc2--
                        }
                        
                        let win
                        
                        if (!emojiOpc1) emojiOpc1 = 0
                        if (!emojiOpc2) emojiOpc2 = 0
                        
                        if (emojiOpc1 > emojiOpc2) win = `**${op1}**` + `\n*(Total de reações:* \`${emojiOpc1}\`)`
                        if (emojiOpc2 > emojiOpc1) win = `**${op2}**` + `\n*(Total de reações:* \`${emojiOpc2}\`)`             
                      
                        if (emojiOpc1 === emojiOpc2) win = `Houve um empate! (Total de reações: \`${emojiOpc1}\`)`
                        
                        const embedOff = new Discord.EmbedBuilder()
                            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                            .setColor("Red")
                            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                            .setTitle(`Enquete Encerrada: ${titulo}`)
                            .setDescription(`Enquete criada por ${interaction.user}.\n\n> ${emojis[0]} - ${op1}\n> ${emojis[1]} - ${op2}`)
                            .setTimestamp(new Date(new Date().getTime() + tempoMs))
                            .setFooter({ text: `Enquete encerrada às:` })

                        msg.reply({ content: `**Enquete Encerrada!**\n\n> __Vencedor:__  ${win} ` })

                        msg.edit({ embeds: [embedOff] })
                    }, tempoMs);
                })
            })
        }
    }
}
