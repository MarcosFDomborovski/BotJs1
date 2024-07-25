const mongoose = require('mongoose')

const LinksSchema = new mongoose.Schema({
    username: {type: String, required: false},
    discordId: {type: String, required: true},
    url: {type: String, required: true},
    channelId: {type: String, required: false},
    createdAt: {
        type: Date,
        default: () => Date.now() + (1000 * 60 * 60 * 3) * (-1),
    }
})

module.exports = mongoose.model("Links-Schema", LinksSchema)