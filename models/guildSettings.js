const mongoose = require("mongoose");

const GuildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  botVoiceChannelId: { type: String, required: false },
  logsChannelId: { type: String, required: false },
  logsInvite: { type: String, required: false },
  suggestionChannelId: { type: String, required: false },
  storeLogsChannelId: { type: String, required: false },
  announcementChannelId: { type: String, required: false },
  welcomeChannelId: { type: String, required: false },
  leaveChannelId: { type: String, required: false },
  antilink: { type: Boolean, required: false },
});

module.exports = mongoose.model("GuildSettings", GuildSettingsSchema);
