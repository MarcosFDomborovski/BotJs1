const mongoose = require("mongoose")
const VideoSchema = new mongoose.Schema({
    url: String,
    thumbnail: String,
    createdAt: {
        type: Date,
        default: () => Date.now() * (60 * 60 * 3) * (-1),
    }
})

module.exports = mongoose.model("Video", VideoSchema)