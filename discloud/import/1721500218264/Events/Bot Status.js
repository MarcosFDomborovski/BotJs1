const { Discord, ActivityType, Activity } = require("discord.js");
const client = require("../index");

let activity = [
  {
    name: "🍸 Bot da pastelaria 🍸",
    type: ActivityType.Streaming,
    url: "https://www.twitch.tv/gypcoom",
  },
  {
    name: "🥘😋 De boa, fritando uns pastel 😋🥘",
  },
  {
    name: "😯🥘 o homem-pastel 😯🥘",
    type: ActivityType.Watching,
  },
  {
    name: "🎶😎 um batidão 😎🎶",
    type: ActivityType.Listening,
  },
];
let status = [
  {
    status: "online",
  },
  {
    status: "idle",
  },
  {
    status: "dnd",
  },
];

client.on("ready", (c) => {
  setInterval(() => {
    let random = Math.floor(Math.random() * activity.length);
    let random2 = Math.floor(Math.random() * status.length);
    client.user.setActivity(activity[random]);
    client.user.setPresence(status[random2])
  }, 30000);
});
