const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  discordId: { type: Number, required: true },
  username: { type: String, required: false },
  dinheiro: { type: Number, required: true, default: 0 },
  cooldowns: {
    daily: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: () => Date.now() + 3,
    required: true,
  },
});

module.exports = mongoose.model("UsuáriosGypcoom", UserSchema);
