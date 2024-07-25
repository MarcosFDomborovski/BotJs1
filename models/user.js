const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, default: "Usuário" },
  discordId: { type: String, required: true },
  mensagens: { type: Number, default: 0 },
  dinheiro: { type: Number, required: false, default: 0 },
  cooldowns: {
    daily: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: () => Date.now() + (1000 * 3 * 60 * 60) * (-1),
    required: true,
  },
});

module.exports = mongoose.model("Usuarios", UserSchema);