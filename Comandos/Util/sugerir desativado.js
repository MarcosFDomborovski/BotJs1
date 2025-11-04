
// é a versão feia

// const Discord = require("discord.js");

// module.exports = {
//     name: "sugerir",
//     description: "Faça sua sugestão.",
//     type: Discord.ApplicationCommandType.ChatInput,
//     options: [
//         {
//             name: "sugestão",
//             description: "Faça uma sugestão.",
//             type: Discord.ApplicationCommandOptionType.String,
//             required: true,
//         },
//     ],

//     run: async (client, interaction) => {

//         let canal = interaction.guild.channels.cache.get("1264400463277592647")

//         let membro = await client.userDB.findOne({ discordId: interaction.user.id })
//         if (!membro) membro = await client.userDB.create({ discordId: interaction.user.id, username: interaction.user.username })

//         if (!canal) {
//             interaction.reply(`Olá <@${membro.discordId}>, o canal de sugestões ainda não foi configurado no script!`)
//         } else {
//             let sugestao = interaction.options.getString("sugestão")
//             let embed = new Discord.EmbedBuilder()
//                 .setColor("Random")
//                 .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
//                 .setTitle("📝 Nova sugestão! 📝")
//                 .setDescription(`Sugestão de <@${membro.discordId}>:\n**${sugestao}**`)
//                 .setFooter({ text: `Data de publicação:` })
//                 .setTimestamp(Date.now())

//             canal.send({ embeds: [embed] }).then(() => {
//                 interaction.reply({ content: `Olá <@${membro.discordId}>, sua sugestão foi publicada no canal ${canal} com sucesso!`, ephemeral: true })
//             }).catch(() => {
//                 interaction.reply({ content: `Ops <@${membro.discordId}>, algo deu errado!` })
//             })
//         }
//     }
// }