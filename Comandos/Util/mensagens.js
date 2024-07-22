const Discord = require("discord.js");

module.exports = {
    name: "mensagens",
    description: "Contador de mensagens.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            description: "Veja quantas mensagens este usuário já digitou.",
            type: Discord.ApplicationCommandOptionType.User,
            required: false,
        }
    ],

    run: async (client, interaction) => {
        let user = interaction.options.getUser("usuário");
        if (!user) user = interaction.user;
    
        let member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            const embed = new Discord.EmbedBuilder()
                .setColor("Red")
                .setDescription(`O usuário ${user.username} não está no servidor!`);
                
            await interaction.reply({ embeds: [embed] });
        } else {
            let messageCountDoc = await client.userDB.findOne({ discordId: member.user.id});
            if (!messageCountDoc) {
                messageCountDoc = await client.userDB.create({ discordId: member.user.id, username: member.user.username, mensagens: 0 });
                await messageCountDoc.save();
            }

            const embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
                .setDescription(`O usuário <@${messageCountDoc.discordId}> possui \`${messageCountDoc.mensagens}\` mensagens neste servidor.`);

            await interaction.reply({ embeds: [embed] });
        }
    }
};
