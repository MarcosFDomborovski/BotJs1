const mongoose = require('mongoose')

const LinksSchema = new mongoose.Schema({
    discordId: {type: String, required: true},
    username: {type: String, required: false},
    guildId: {type: String, required: true},
    channelId: {type: String, required: false},
    url: {type: String, required: true},
    createdAt: {
        type: Date,
        default: () => Date.now() + (1000 * 60 * 60 * 3) * (-1),
    }
})

module.exports = mongoose.model("Links-Schema", LinksSchema)