const Discord = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB();
const ms = require("ms");
const cooldowns = {}

module.exports = {
    name: "daily",
    description: "Resgate seu prêmio diário",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        if (!cooldowns[interaction.user.id]) cooldowns[interaction.user.id] = { lastCmd: null };
        let ultimoCmd = cooldowns[interaction.user.id].lastCmd;
        if (ultimoCmd !== null && timeout - (Date.now() - ultimoCmd) > 0) {
            let time = ms(timeout - (Date.now() - ultimoCmd));
            let falta = [time.seconds, 'segundos'];
            if (resta[0] == 0) resta = ['alguns', 'milisegundos'];
            if (resta[0] == 1) resta = [time.seconds, 'segundo'];

            let embed = new Discord.EmbedBuilder()
                .setColor("Yellow")
                .setTitle(`❌ Daily já resgatado! ❌`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`Espere \`${time}\` para poder resgatar seu daily novamente!`)

            interaction.reply({ embeds: [embed], ephemeral: true })
            return
        } else {
            cooldowns[interaction]

            let quantia = Math.ceil(Math.random() * 5000); // Máximo de moedas
            if (quantia < 1000) quantia += 1000;           // Mínimo de moedas

            await db.add(`carteira_${interaction.user.id}`, quantia)

            let embed = new Discord.EmbedBuilder()
            .setColor("Green")
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`Você resgatou \`${quantia}\` moedas em seu daily.\nUtilize o comando \`/carteira\` para ver seu total de moedas.`)
            
            interaction.reply({embeds: [embed]})
        }
    }








}
