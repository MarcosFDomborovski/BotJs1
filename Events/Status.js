//MUDAR O SEU STATUS
const Discord = require("discord.js");
const client = require("../index");

const DiscordRPC = require("discord-rpc");
const RPC = new DiscordRPC.Client({ transport: "ipc" });
const ID = "1243649637903110227"; // ID da aplicação do discord.

DiscordRPC.register(ID);

async function activity() {
  if (!RPC) return;
  RPC.setActivity({
    details: "De boa",
    state: "Esperando virar o mês 💸",
    smallImageKey:
      "https://cdn.discordapp.com/avatars/474334792830156805/336c45ee65b6a5ce56896dbb1b2c539d.webp?size=1024&format=webp&width=0&height=192",
    smallImageText: "PIMPOSO",

    instance: false,
    startTimestamp: Date.now(),
    buttons: [
      {
        label: `YouTube`,
        url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygUIcmlja3JvbGw%3D`,
      },
      {
        label: `Twitch`,
        url: `https://www.twitch.tv/d4rknorris`,
      },
    ],
  });
}

RPC.on("ready", async () => {
  console.log("RPC ligado");
  activity();

  setInterval(() => {
    activity();
  }, 10000000);
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  RPC.login({ clientId: ID }).catch(console.error);
});
