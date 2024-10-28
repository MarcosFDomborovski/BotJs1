const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
    guildId: {type: String, required: true},
    logsChannelId: { type: String, required: false, default: "Não configurado." },
    welcomeChannelId: { type: String, required: false, default: "Não configurado." },
    leaveChannelId: { type: String, required: false, default: "Não configurado." },
    announcementChannelId: { type: String, required: false, default: "Não configurado." },
    suggestionChannelId: { type: String, required: false, default: "Não configurado." },
    autoRoleId: { type: String, required: false, default: "Não configurado." },
    botVoiceChannelId: { type: String, required: false, default: "Não configurado." },
    storeLogsChannelId: { type: String, required: false, default: "Não configurado." },
    botMessageCountNumbersId: { type: String, required: false, default: "Não configurado." },
})

module.exports = mongoose.model('Configuracoes', ConfigSchema)

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