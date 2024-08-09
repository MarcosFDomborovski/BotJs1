const Discord = require("discord.js");

module.exports = {
    name: "infobot",
    description: "Fornece informações sobre o bot",
    type: Discord.ApplicationCommandType.ChatInput,


    run: async (client, interaction) => {
        let dono = "474334792830156805";
        let membros = client.users.cache.size;
        let servidores = client.guilds.cache.size;
        let canais = client.channels.cache.size;
        let bot = client.user.tag;
        let avatarBot = client.user.displayAvatarURL();
        let ping = client.ws.ping;

        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: bot, iconURL: avatarBot })
            .setFooter({ text: bot, iconURL: avatarBot })
            .setTimestamp(new Date())
            .setThumbnail(avatarBot)
            .setDescription(`Olá ${interaction.user}, veja minhas informações abaixo:\n\n 🤖 Nome: \`${bot}\`.\n> 🤖 Dono: ${client.users.cache.get(dono)}.\n> ⚙ Membros: \`${membros}\`.\n> ⚙ Servidores: \`${servidores}\`.\n> ⚙ Canais: \`${canais}\`.\n> ⚙ Ping: \`${ping}\`.\n> 📚 Linguagem de programação: \`JavaScript\`.\n> 📚 Livraria: \`Discord.Js\`.`)

        interaction.reply({ embeds: [embed] })
    }
}