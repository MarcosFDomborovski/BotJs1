const Discord = require("discord.js");

module.exports = {
    name: "unban",
    description: "Desbanir um usuário",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "Mencione o usuário a ser desbanido",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Digite o motivo do desbanimento",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {

        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)) {
            interaction.reply({ content: `Você não possui permissão para utilizar este comando.`, ephemeral: true });
        } else {
            let user = interaction.options.getUser("user");
            let reason = interaction.options.getString("motivo");
            if (!reason) reason = "Não definido.";

            let embed = new Discord.EmbedBuilder()
                .setColor("Green")
                .setDescription(`O usuário ${user} - (\`${user.id}\`) foi desbanido com sucesso!`);

            let erro = new Discord.EmbedBuilder()
                .setColor("Red")
                .setDescription(`Ocorreu um erro ao desbanir o usuário ${user} (\`${user.id}\`) do servidor!`);

            interaction.guild.members.unban(user.id, reason).then(() => {
                interaction.reply({ embeds: [embed] });
            }).catch(e => {
                interaction.reply({ embeds: [erro] });
            })

        }

    }
}