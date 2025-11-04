const Discord = require("discord.js");
const client = require("../index");
const Counter = require("../models/counters");
const Channel = require("../models/config");

client.on("messageCreate", async (message) => {
  console.log(`${message.author.username}:\n${message.content}\n`);
  if (message.author.bot) return;

  let channel = await Channel.findOne({ guildId: message?.author?.guild?.id });
  if (!channel || !channel.botMessageCountNumbersId) return;
  if (message.channel.id !== `${channel.botMessageCountNumbersId}`) return;

  let numberCount = await Counter.findOne({
    channelId: message.channel.id,
    guildId: message.guild.id,
  });
  if (!numberCount)
    numberCount = await Counter.create({
      channelId: message.channel.id,
      guildId: message.guild.id,
      counter: 0,
    });
  if (isNaN(message.content))
    return message.reply({ content: `Isso não é um número!` }).then((msg) => {
      message.react(`❌`);
      setTimeout(() => {
        msg.delete();
        message.delete();
      }, 2500);
    });

  if (Number(message.content) !== numberCount.counter + 1) {
    return message
      .reply({ content: `O próximo número é \`${numberCount.counter + 1}\`.` })
      .then((msg) => {
        message.react(`❌`);
        setTimeout(() => {
          msg.delete();
          message.delete();
        }, 4000);
      });
  }
  await Counter.updateOne(
    { channelId: message.channel.id, guildId: message.guild.id },
    { counter: Number(message.content) }
  );
  message.react(`✅`);
});
