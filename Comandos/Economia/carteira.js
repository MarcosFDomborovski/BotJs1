const Discord = require("discord.js")
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { description } = require("./daily");

module.exports = {
    name: "carteira",
    description: "Veja a quantidade de moedas que você tem na carteira.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuário",
            description: "Veja a carteira de um usuário.",
            type: Discord.ApplicationCommandOptionType.User,
            required: false
        }
    ],

    run: async (client, interaction) => {
        let user = interaction.options.getUser("usuário");
        if(!user) user = interaction.user;

        let carteira = await db.get(`carteira_${user.id}`)
        if(carteira === null) carteira = 0;

        if (user.id === interaction.user.id) {
            let embed = new Discord.EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`💰 Carteira`)
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setDescription(`Olá ${user}, você possui \`${carteira}\` moedas em sua carteira.`)

            interaction.reply({ embeds: [embed] });
        } else {
            let embed = new Discord.EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`💰 Carteira`)
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setDescription(`O usuário ${user} - (\`${user.tag}\`) possui \`${carteira}\` moedas em sua carteira.`)

            interaction.reply({ embeds: [embed] });
        }
    }
}