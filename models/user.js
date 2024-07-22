const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  discordId: { type: String, required: true },
  username: { type: String, required: true, default: "Usuário" },
  dinheiro: { type: Number, required: false, default: 0 },
  mensagens: { type: Number, default: 0 },
  cooldowns: {
    daily: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: () => Date.now() + (1000 * 3 * 60 * 60) * (-1),
    required: true,
  },
});

module.exports = mongoose.model("UsuáriosGypcoom", UserSchema);
