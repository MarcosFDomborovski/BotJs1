const Discord = require("discord.js")
const client = require("../index")

client.on("messageReactionAdd", (react, user) => {
    if (user.bot) return;

    const cores = {
        azul: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1194294023968522351"),
        verde: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267451959825403995"),
        amarelo: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452119003435121"),
        laranja: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452176477851729"),
        vermelho: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452333424382013"),
        rosa: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452514358399077"),
        roxo: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452549967904799"),
        preto: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452693270495344"),
        branco: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452802180059309")
    }
    if (react.message.channel.id === "1267456048642658365") {
        if (client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.cache.find(role => role.name.startsWith('Cor')))
            client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.cache.find(role => role.name.startsWith("Cor")).id)

        if (react.emoji.name === "🔵") {
            react.message.reply(`Olá ${user}, você alterou a cor do seu nick para ${cores.azul}.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.add(cores.azul)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🟢") {
            react.message.reply(`Olá ${user}, você alterou a cor do seu nick para ${cores.verde}.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.add(cores.verde)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🟡") {
            react.message.reply(`Olá ${user}, você alterou a cor do seu nick para ${cores.amarelo}.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.add(cores.amarelo)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🟠") {
            react.message.reply(`Olá ${user}, você alterou a cor do seu nick para ${cores.laranja}.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.add(cores.laranja)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🔴") {
            react.message.reply(`Olá ${user}, você alterou a cor do seu nick para ${cores.vermelho}.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.add(cores.vermelho)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🌹") {
            react.message.reply(`Olá ${user}, você alterou a cor do seu nick para ${cores.rosa}.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.add(cores.rosa)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🟣") {
            react.message.reply(`Olá ${user}, você alterou a cor do seu nick para ${cores.roxo}.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.add(cores.roxo)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "⚫") {
            react.message.reply(`Olá ${user}, você alterou a cor do seu nick para ${cores.preto}.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.add(cores.preto)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "⚪") {
            react.message.reply(`Olá ${user}, você alterou a cor do seu nick para ${cores.branco}.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.add(cores.branco)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        }
    }
}
)

client.on("messageReactionRemove", (react, user) => {
    if (user.bot) return;

    const cores = {
        azul: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1194294023968522351"),
        verde: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267451959825403995"),
        amarelo: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452119003435121"),
        laranja: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452176477851729"),
        vermelho: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452333424382013"),
        rosa: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452514358399077"),
        roxo: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452549967904799"),
        preto: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452693270495344"),
        branco: client.guilds.cache.get(react.message.channel.guildId).roles.cache.get("1267452802180059309")
    }
    if (react.message.channel.id === "1267456048642658365") {
        if (client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.cache.find(role => role.name.startsWith('Cor')))
            client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(client.guilds.cache.get(react.message.channel.guildId).roles.cache.find(role => role.name.startsWith('Cor')))

        if (react.emoji.name === "🔵") {
            react.message.reply(`Olá ${user}, você removeu a cor ${cores.azul} do seu nick.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(cores.azul)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🟢") {
            react.message.reply(`Olá ${user}, você removeu a cor ${cores.verde} do seu nick.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(cores.verde)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🟡") {
            react.message.reply(`Olá ${user}, você removeu a cor ${cores.amarelo} do seu nick.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(cores.amarelo)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🟠") {
            react.message.reply(`Olá ${user}, você removeu a cor ${cores.azul} do seu nick.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(cores.laranja)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🔴") {
            react.message.reply(`Olá ${user}, você removeu a cor ${cores.vermelho} do seu nick.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(cores.vermelho)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🌹") {
            react.message.reply(`Olá ${user}, você removeu a cor ${cores.rosa} do seu nick.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(cores.rosa)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "🟣") {
            react.message.reply(`Olá ${user}, você removeu a cor ${cores.roxo} do seu nick.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(cores.roxo)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "⚫") {
            react.message.reply(`Olá ${user}, você removeu a cor ${cores.preto} do seu nick.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(cores.preto)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        } else if (react.emoji.name === "⚪") {
            react.message.reply(`Olá ${user}, você removeu a cor ${cores.branco} do seu nick.`).then(msg => {
                client.guilds.cache.get(react.message.channel.guildId).members.cache.get(user.id).roles.remove(cores.branco)
                setTimeout(() => {
                    msg.delete().catch(e => { })
                }, 4000);
            })
        }
    }
}
)