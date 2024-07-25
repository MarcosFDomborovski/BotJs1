const Discord = require("discord.js")
const client = require('../index')
const dono = `474334792830156805`

client.on("messageCreate", async (message) => {
    let mencoes = [`<@${client.user.id}>`, `${client.user.id}>`]

    mencoes.forEach(element => {
        //292817343011094528 id bir
        if (message.author.bot) return;
        if (message.content.includes(`<@292817343011094528>`)){
            message.reply(`<@292817343011094528> o bobão que mandou mensagem pra ex :clown:`)
        }

        // if (message.content.includes(element))  caso queira que o bot responda a qualquer mensagem que ele seja mencionado. 
        if (message.content.includes(`conta a novidade ${element}`)) {
            message.reply(`Adivinha quem que já pode dirigir ? Isso mesmo, **ele**, o **ILUMINADO** <@${dono}>`)
            return;
        } else if (message.content === element) {
            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`🛠 Olá ${message.author}, utilize \`/help\` para ver meus comandos!`)
                .addFields({ name: `**Ou...**`, value: `Chame meu dono <@${dono}> no privado!` })

            message.reply({ embeds: [embed], ephemeral: true })
        }
    })
})