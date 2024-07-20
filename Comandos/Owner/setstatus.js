const Discord = require("discord.js");
const DONO = "474334792830156805"

module.exports = {
    name: "setstatus",
    description: "Permite configurar o status do bot",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "status",
            description: "Qual é o estado do bot ? (online, dnd, idle, invisible) ?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "descrição",
            description: "Qual será a descrição do bot ?",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    run: async (client, interaction) => {

        if (interaction.user.id !== DONO) return interaction.reply({ content: `Apenas o meu dono pode utilizar este comando!`, ephemeral: true })
        try {
            const status = interaction.options.getString("status");
            const desc = interaction.options.getString("descrição");

            client.user.setStatus(`${status}`)
            client.user.setPresence({
                activities: [{
                    name: desc
                }],
            });

            let embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setTitle("Status atualizado!")
                .addFields(
                    {
                        name: `🎭 Mudei meu status para:`,
                        value: `\`${status}\``,
                        inline: false
                    },
                    {
                        name: `📝 Mudei minha descrição para:`,
                        value: `\`${desc}\``,
                        inline: false
                    }
                )

            await interaction.reply({embeds: [embed]})
        } catch (error) {
            return console.log(`*❌ - Ocorreu um erro ao executar este comando!*`, error)
        }
    }
}
