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
    largeImageKey:
      "https://cdn.discordapp.com/attachments/1106736905313337397/1263300426527281254/faf.png?ex=6699bbb4&is=66986a34&hm=33a01a519b931e3ff578d0f243858f6099b88c208e524db8bcb7ad7d74e08414&",
    largeImageText: "sim",
    smallImageKey:
      "https://cdn.discordapp.com/avatars/474334792830156805/336c45ee65b6a5ce56896dbb1b2c539d.webp?size=1024&format=webp&width=0&height=192",
    smallImageText: "textin",

    instance: false,
    startTimestamp: Date.now(),
    buttons: [
      {
        label: `YouTube`,
        url: `https://www.youtube.com/watch?v=jtIYMTL51ok`,
      },
      {
        label: `Google`,
        url: `https://www.google.com`,
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
