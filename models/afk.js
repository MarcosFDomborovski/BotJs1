const mongoose = require("mongoose");

const AfkSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  guildId: { type: String, required: true },
  isAfk: { type: Boolean, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Afk", AfkSchema);
