const Discord = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "antilink",
    description: "Ative ou desative o sistema de antilink no servidor.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando!`, ephemeral: true })
        } else {
            let embedG = new Discord.EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: interaction.user, iconURL: interaction.user.iconURL({ dynamic: true }) })
                .setDescription(`Olá ${interaction.user}, o sistema de antilink foi \`ativado\`.`)
                .setFooter({ text: `Data de ativação:` })
                .setTimestamp(Date.now())
            let embedR = new Discord.EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: interaction.user, iconURL: interaction.user.iconURL({ dynamic: true }) })
                .setDescription(`Olá ${interaction.user}, o sistema de antilink foi \`desativado\`.`)
                .setFooter({ text: `Data de desativação:` })
                .setTimestamp(Date.now())

            let confirm = await db.get(`antilink_${interaction.guild.id}`);

            if (confirm === null || confirm === false) {
                interaction.reply({ embeds: [embedG], ephemeral: true })
                await db.set(`antilink_${interaction.guild.id}`, true)

            }
            else if (confirm === true) {
                interaction.reply({ embeds: [embedR], ephemeral: true })
                await db.set(`antilink_${interaction.guild.id}`, false)
            }
        }
    }
}