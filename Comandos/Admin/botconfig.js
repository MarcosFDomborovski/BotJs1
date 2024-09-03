const Discord = require('discord.js');
const User = require("../../models/user");
const Channel = require('../../models/config');
const client = require("../../index")

module.exports = {
    name: "botconfig",
    description: "Configure o bot para o seu servidor.",
    type: Discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "canal_de_logs",
            description: "Mencione o canal onde serão enviadas as logs do bot.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        },
        {
            name: "logs_loja",
            description: "Mencione o canal onde serão enviadas as logs da loja.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        },
        {
            name: "canal_de_sugestoes",
            description: "Mencione o canal onde serão enviadas as sugestões dos usuários.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        },
        {
            name: "canal_de_anuncios",
            description: "Mencione o canal onde serão enviados os anúncios do servidor.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        },
        {
            name: "canal_bem_vindo",
            description: "Mencione o canal onde será enviada as logs de entrada de um novo usuário.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        },
        {
            name: "canal_saida_usuarios",
            description: "Mencione o canal onde será enviada as logs de saída de um usuário.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        },
        {
            name: "voicechat_bot",
            description: "Mencione o canal onde será enviada as logs de saída de um usuário.",
            type: Discord.ApplicationCommandOptionType.Channel,
            required: false,
        },
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: `Olá ${interaction.user}, você não possui permissão para utilizar este comando!`, ephemeral: true });
        }

        try {
            const botVoiceChannel = interaction.options.getChannel("voicechat_bot")
            const logsChannel = interaction.options.getChannel("canal_de_logs");
            const storeLogChannel = interaction.options.getChannel("logs_loja");
            const suggestionsChannel = interaction.options.getChannel("canal_de_sugestoes");
            const announcementChannel = interaction.options.getChannel("canal_de_anuncios");
            const welcomeChannel = interaction.options.getChannel("canal_bem_vindo");
            const leaveChannel = interaction.options.getChannel("canal_saida_usuarios");

            let currentConfig = await Channel.findOne({ guildId: interaction.guild.id });

            const filter = { guildId: interaction.guild.id };
            const update = {
                guildId: interaction.guild.id,
                botVoiceChannelId: botVoiceChannel ? botVoiceChannel.id : currentConfig?.botVoiceChannelId,
                logsChannelId: logsChannel ? logsChannel.id : currentConfig?.logsChannelId,
                suggestionChannelId: suggestionsChannel ? suggestionsChannel.id : currentConfig?.suggestionChannelId,
                storeLogsChannelId: storeLogChannel ? storeLogChannel.id : currentConfig?.storeLogsChannelId,
                announcementChannelId: announcementChannel ? announcementChannel.id : currentConfig?.announcementChannelId,
                welcomeChannelId: welcomeChannel ? welcomeChannel.id : currentConfig?.welcomeChannelId,
                leaveChannelId: leaveChannel ? leaveChannel.id : currentConfig?.leaveChannelId,

            };
            const options = { upsert: true, new: true };

            await Channel.findOneAndUpdate(filter, update, options);

            let configuredChannels = [];
            let missingChannels = [];

            if (update.logsChannelId) {
                configuredChannels.push(`**Logs do bot:** <#${update.logsChannelId}>`);
            } else {
                missingChannels.push("Logs do bot");
            }
            if (update.storeLogsChannelId) {
                configuredChannels.push(`**Logs da loja:** <#${update.storeLogsChannelId}>`);
            } else {
                missingChannels.push("Logs da loja");
            }
            if (update.suggestionChannelId) {
                configuredChannels.push(`**Canal de sugestões:** <#${update.suggestionChannelId}>`);
            } else {
                missingChannels.push("Canal de sugestões");
            }
            if (update.announcementChannelId) {
                configuredChannels.push(`**Canal de anúncios:** <#${update.announcementChannelId}>`);
            } else {
                missingChannels.push("Canal de anúncios");
            } 
            if ( update.welcomeChannelId){
                configuredChannels.push(`**Canal de bem-vindo: ** <#${update.welcomeChannelId}>`)
            } else {
                missingChannels.push(`Canal de bem-vindo`)
            }
            if (update.leaveChannelId){
                configuredChannels.push(`**Canal de saída de usuários:** <#${update.leaveChannelId}>`)
            } else {
                missingChannels.push(`**Canal de saída de usuários**`)
            }

            let replyMessage = `Configurações salvas com sucesso!\n\n**Canais configurados:**\n${configuredChannels.join("\n")}`;
            
            if (missingChannels.length > 0) {
                replyMessage += `\n\n**Canais faltando:**\n${missingChannels.join("\n")}`;
            } else {
                replyMessage += `\n\nTodos os canais foram configurados corretamente.`;
            }

            await interaction.reply({ content: replyMessage, ephemeral: true });
        } catch (err) {
            interaction.reply({ content: `Ocorreu um erro ao salvar as configurações.`, ephemeral: true });
            console.error(err);
        }
    }
};

// logChannelId: { type: String, required: false, default: "Não configurado." },
// welcomeChannelId: { type: String, required: false, default: "Não configurado." },
// leaveChannelId: { type: String, required: false, default: "Não configurado." },
// announcementChannelId: { type: String, required: false, default: "Não configurado." },
// suggestionChannelId: { type: String, required: false, default: "Não configurado." },
// botsChannelId: { type: String, required: false, default: "Não configurado." },
// adminChannelId: { type: String, required: false, default: "Não configurado." },
// notificationChannelId: { type: String, required: false, default: "Não configurado." },
// storeLogChannelId: { type: String, required: false, default: "Não configurado." },

// 1269999990139523092 id bots
// 1271462552773328997 id contador
// 983145929634906192 id novidades do canal
// 1037236388292202527 id novidade dos games
// 904104010313773056 id comandos
// 904083876715057192 id anuncios publicos
// 1267456048642658365 id canal cores
// 904081034193301559 id geral
// 1264342985256992849 id logs STAFF
// 1264400463277592647 id sugestoes STAFF
// 1271463088331161632 id logs loja STAFF

// 1190051578351190027 id chat sem mic