const Discord = require("discord.js");
const client = require('../index');
const User = require('../models/user');
const Message = require("../models/messages");
const dono = `474334792830156805`;

client.on("messageCreate", async (message) => {    
    if (!message.content || message.content.trim() === '') return;

    try {
        let membro = await User.findOne({ discordId: message.author.id });
        if (!membro) {
            membro = new User({
                discordId: message.author.id,
                username: message.author.username,
                mensagens: 0
            });
        }
        membro.mensagens += 1;
        await membro.save();

        const newMessage = new Message({
            discordId: message.author.id,
            username: message.author.username,
            content: message.content,
            channelId: message.channel.id
        });
        await newMessage.save();
    } catch (err) {
        console.error(`Erro ao salvar mensagem de ${message.author.username} no canal ${message.channel.name}`, err);
    }

    let mencoes = [`<@${client.user.id}>`, `${client.user.id}>`];

    mencoes.forEach(element => {
        if (message.content.includes(`conta a novidade ${element}`)) {
            message.reply(`Adivinha quem que já pode dirigir? Isso mesmo, **ele**, o **ILUMINADO** <@${dono}>`);
        } else if (message.content === element) {
            let embed = new Discord.EmbedBuilder()
                .setColor("Random")
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`🛠 Olá ${message.author}, utilize \`/help\` para ver meus comandos!`)
                .addFields({ name: `**Ou...**`, value: `Chame meu dono <@${dono}> no privado!` });

            message.reply({ embeds: [embed], ephemeral: true });
        }
    });
});
