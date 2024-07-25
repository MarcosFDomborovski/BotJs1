const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
    username: { type: String, default: 'Usuário' },
    discordId: { type: String, required: true},
    content: { type: String, required: true },
    channelId: { type: String },
    createdAt: {
        type: Date,
        default: () => Date.now() + (1000 * 3 * 60 * 60) * (-1),
    }
})

module.exports = mongoose.model('Mensagens', MessagesSchema);