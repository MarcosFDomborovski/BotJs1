const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const { options } = require("../..")
const db = new QuickDB()

module.exports = {
    name: "afk",
    description: "Ative o modo AFK.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "motivo",
            description: "Escreva o motivo da inatividade.",
            type: Discord.ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    run: async (client, interaction) => {
        let motivo = interaction.options.getString("motivo");
        let afk_mode = await db.get(`modo_afk_${interaction.user.id}`)

        if (afk_mode === true) {
            interaction.reply({ content: `Olá ${interaction.user}, seu modo AFK já está ativado.`, ephemeral: true })
        } else {
            interaction.reply({content: `Olá ${interaction.user}, seu modo AFK foi ativado com sucesso!`, ephemeral: true })
            await db.set(`modo_afk_${interaction.user.id}`, true)
            await db.set(`motivo_afk_${interaction.user.id}`, motivo)
        }
    }
}