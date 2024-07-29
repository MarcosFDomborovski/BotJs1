const Discord = require("discord.js");

module.exports = {
    name: "ban",
    description: "Banir um usuário",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "user",
            description: "Mencione o usuário a ser banido",
            type: Discord.ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "motivo",
            description: "Digite o motivo do banimento",
            type: Discord.ApplicationCommandOptionType.String,
            required: false,
        }
    ],

    run: async (client, interaction) => {

        if(!interaction.member.permissions.has(Discord.PermissionFlagsBits.BanMembers)){
            interaction.reply({content:`Você não possui permissão para utilizar este comando.`, ephemeral: true});
        } else {
            let userr = interaction.options.getUser("user");
            let user = interaction.guild.members.cache.get(userr.id);
            let motivo = interaction.options.getString("motivo");
            if(!motivo) motivo = "Não definido.";

            let embed = new Discord.EmbedBuilder()
            .setColor("Green")
            .setTitle(`✖ Membro Expulso! ✖`)
            .setDescription(`O usuário ${membro} foi expulso com sucesso!\n\nMotivo: \`${motivo}\`.`)
            .setThumbnail(user.displayAvatarURL({dynamic:true}))
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
            .setFooter({text: `Data da expulsão:`})
            .setTimestamp(Date.now())

            let erro = new Discord.EmbedBuilder()
            .setColor("Red")
            .setDescription(`Ocorreu um erro ao banir o usuário ${user} (\`${user.id}\`) do servidor!`);

            user.ban({reason: [motivo] }).then(() =>{
                interaction.reply({embeds: [embed]});
            }).catch( e => {
                interaction.reply({embeds: [erro]});
            })
        }
    }
}