const Discord = require("discord.js")
const config = require("./config.json")
const { QuickDB } = require("quick.db")
const db = new QuickDB()
const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildModeration,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.MessageContent,
    ]
})
module.exports = client

client.on('interactionCreate', (interaction) => {
    if (interaction.type === Discord.InteractionType.ApplicationCommand) {
        const cmd = client.slashCommands.get(interaction.commandName)
        if (!cmd) return interaction.reply('Error');
        interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction)
    }
})

client.on('ready', () => {
    console.log(`🔥 Bot ta online em ${client.user.username}!`)
})

client.slashCommands = new Discord.Collection()
require('./handler')(client)
client.login(config.token)

/////// nao funciona
client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    let confirm = await db.get(`antilink_${message.guild.id}`);

    if (confirm === false || confirm === null) {
        return;
    }
    else if (confirm === true) {
        if (message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)) return;
        if (message.content.toLocaleLowerCase().includes("http")) {
            message.delete()
            message.channel.send(`${message.author}, você não pode usar links neste chat!`)
        }
    }
})
///////

client.on("interactionCreate", (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.customId === "painel_ticket") {
            let opc = interaction.values[0]
            if (opc === "opc1") { ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let nome = `opc1-${interaction.user.id}`
                let categoria = ""

                if (!interaction.guild.channels.cache.get(categoria)) categoria = null;

                if (interaction.guild.channels.cache.find(c => c.name === nome)) {
                    interaction.reply({ content: `❌ Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)}!`, ephemeral: true })
                } else {
                    interaction.guild.channels.create({
                        name: nome,
                        type: Discord.ChannelType.GuildText,
                        parent: categoria,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [
                                    Discord.PermissionFlagsBits.ViewChannel
                                ],
                                id: interaction.user.id,
                                allow: [
                                    Discord.PermissionFlagsBits.ViewChannel,
                                    Discord.PermissionFlagsBits.SendMessages,
                                    Discord.PermissionFlagsBits.AttachFiles,
                                    Discord.PermissionFlagsBits.EmbedLinks,
                                    Discord.PermissionFlagsBits.AddReactions,
                                ]
                            }
                        ]

                    }).then((ch) => {
                        interaction.reply({ content: `✅ Olá ${interaction.user}, seu ticket foi aberto em ${ch}`, ephemeral: true })
                        let embed = new Discord.EmbedBuilder()
                            .setColor("Random")
                            .setDescription(`Olá ${interaction.user}, você abriu o ticket pela opção 1.`)
                        let botao = new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId("fechar_ticket")
                                .setEmoji("🔒")
                                .setStyle(Discord.ButtonStyle.Danger)
                        );

                        ch.send({ embeds: [embed], components: [botao] }).then(m => {
                            m.pin();
                        })
                    })
                }
            } else if (opc === "opc2") { ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let nome = `opc2-${interaction.user.id}`
                let categoria = ""

                if (!interaction.guild.channels.cache.get(categoria)) categoria = null;

                if (interaction.guild.channels.cache.find(c => c.name === nome)) {
                    interaction.reply({ content: `❌ Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)}!`, ephemeral: true })
                } else {
                    interaction.guild.channels.create({
                        name: nome,
                        type: Discord.ChannelType.GuildText,
                        parent: categoria,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [
                                    Discord.PermissionFlagsBits.ViewChannel
                                ],
                                id: interaction.user.id,
                                allow: [
                                    Discord.PermissionFlagsBits.ViewChannel,
                                    Discord.PermissionFlagsBits.SendMessages,
                                    Discord.PermissionFlagsBits.AttachFiles,
                                    Discord.PermissionFlagsBits.EmbedLinks,
                                    Discord.PermissionFlagsBits.AddReactions,
                                ]
                            }
                        ]

                    }).then((ch) => {
                        interaction.reply({ content: `✅ Olá ${interaction.user}, seu ticket foi aberto em ${ch}`, ephemeral: true })
                        let embed = new Discord.EmbedBuilder()
                            .setColor("Random")
                            .setDescription(`Olá ${interaction.user}, você abriu o ticket pela opção 2.`)
                        let botao = new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId("fechar_ticket")
                                .setEmoji("🔒")
                                .setStyle(Discord.ButtonStyle.Danger)
                        );

                        ch.send({ embeds: [embed], components: [botao] }).then(m => {
                            m.pin();
                        })
                    })
                }
            } else if (opc === "opc3") { ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                let nome = `opc3-${interaction.user.id}`
                let categoria = ""

                if (!interaction.guild.channels.cache.get(categoria)) categoria = null;

                if (interaction.guild.channels.cache.find(c => c.name === nome)) {
                    interaction.reply({ content: `❌ Você já possui um ticket aberto em ${interaction.guild.channels.cache.find(c => c.name === nome)}!`, ephemeral: true })
                } else {
                    interaction.guild.channels.create({
                        name: nome,
                        type: Discord.ChannelType.GuildText,
                        parent: categoria,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.id,
                                deny: [
                                    Discord.PermissionFlagsBits.ViewChannel
                                ],
                                id: interaction.user.id,
                                allow: [
                                    Discord.PermissionFlagsBits.ViewChannel,
                                    Discord.PermissionFlagsBits.SendMessages,
                                    Discord.PermissionFlagsBits.AttachFiles,
                                    Discord.PermissionFlagsBits.EmbedLinks,
                                    Discord.PermissionFlagsBits.AddReactions,
                                ]
                            }
                        ]

                    }).then((ch) => {
                        interaction.reply({ content: `✅ Olá ${interaction.user}, seu ticket foi aberto em ${ch}`, ephemeral: true })
                        let embed = new Discord.EmbedBuilder()
                            .setColor("Random")
                            .setDescription(`Olá ${interaction.user}, você abriu o ticket pela opção 3.`)
                        let botao = new Discord.ActionRowBuilder().addComponents(
                            new Discord.ButtonBuilder()
                                .setCustomId("fechar_ticket")
                                .setEmoji("🔒")
                                .setStyle(Discord.ButtonStyle.Danger)
                        );

                        ch.send({ embeds: [embed], components: [botao] }).then(m => {
                            m.pin();
                        })
                    })
                }
            }
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === "fechar_ticket") {
            interaction.reply(`Olá ${interaction.user}, este ticket será excluído em 5 segundos...`)
            setTimeout(() => {
                interaction.channel.delete().catch(e => { return })
            }, 5000)
        }
    }
})
const { joinVoiceChannel } = require('@discordjs/voice')

client.on("ready", () => {
    let canal = client.channels.cache.get("1132384009503133807")
    if (!canal) return console.log("❌ Não foi possível entrar no canal de voz!")
    if (canal.type !== Discord.ChannelType.GuildVoice) return console.log(`❌ Erro ao conectar ao canal de voz: [ ${canal.name} ]`)
    try {
        joinVoiceChannel({
            channelId: canal.id,
            guildId: canal.guild.id,
            adapterCreator: canal.guild.voiceAdapterCreator,
        })
        console.log(`✅ Conectado ao canal [ ${canal.name} ]`);
    } catch (e) {
        console.log(`❌ Erro ao conectar ao canal de voz: [ ${canal.name} ].`);
    }
})

client.on("guildMemberAdd", (member) => {
    let canalLogs = "1131707660593537175";
    if (!canalLogs) return;

    let embed = new Discord.EmbedBuilder()
        .setColor('Green')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`👋 Boas vindas!`)
        .setDescription(`> Olá ${member}!\nseja Bem-Vindo ao servidor \`${member.guild.name}\`\nAtualmente estamos com \`${member.guild.memberCount}\` membros.`)

    member.guild.channels.cache.get(canalLogs).send({ embeds: [embed], content: `${member}` })
})

client.on("guildMemberRemove", (member) => {
    let canalLogs = "1131707660593537175";
    if (!canalLogs) return;

    let embed = new Discord.EmbedBuilder()
        .setColor("Red")
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`👋 Adeus...`)
        .setDescription(`> O usuãrio ${member} saiu do servidor!\n> Espero que volte algum dia..\n> Nos sobrou apenas \`${member.guild.memberCount}\` membros.`)

    member.guild.channels.cache.get(canalLogs).send({ embeds: [embed], content: `${member}` })
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "verificar") {
            let roleId = await db.get(`cargo_verificação_${interaction.guild.id}`)
            let role = interaction.guild.roles.cache.get(roleId)
            if (!role) return;
            interaction.member.roles.add(role.id)
            interaction.reply({ content: `Olá **${interaction.user.username}**, você foi verificado!`, ephemeral: true })
        }
    }
})

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "ticketsBasico") {
            let nomeCanal = `🎫 -${interaction.user.id}`;
            let canal = interaction.guild.channels.cache.find(c => c.name === nomeCanal)

            if (canal) {
                interaction.reply({ content: `Olá **${interaction.user.username}**, você já possui um ticket em **${canal}**.`, ephemeral: true })
            } else {

                let categoria = interaction.channel.parent;
                if (!categoria) categoria = null;
                interaction.guild.channels.create({
                    name: nomeCanal,
                    parent: categoria,
                    type: Discord.ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [Discord.PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                Discord.PermissionFlagsBits.ViewChannel,
                                Discord.PermissionFlagsBits.SendMessages,
                                Discord.PermissionFlagsBits.AttachFiles,
                                Discord.PermissionFlagsBits.EmbedLinks,
                                Discord.PermissionFlagsBits.AddReactions
                            ]
                        }
                    ]
                }).then((chat) => {

                    interaction.reply({ content: `�� Olá **${interaction.user.username}**, seu ticket foi aberto em **${chat}**`, ephemeral: true })
                    let embed = new Discord.EmbedBuilder()
                        .setColor("Random")
                        .setDescription(`Olá ${interaction.user}, você abriu o seu ticket.\nAguarde um momento para ser atendido!`);

                    let botao_close = new Discord.ActionRowBuilder().addComponents(
                        new Discord.ButtonBuilder()
                            .setCustomId("closeTicket")
                            .setEmoji("🔒")
                            .setStyle(Discord.ButtonStyle.Danger)
                    );


                    chat.send({ embeds: [embed], components: [botao_close] }).then(m => {
                        m.pin();
                    })
                })
            }
        } else if (interaction.customId === "closeTicket") {
            interaction.reply(`Olá ${interaction.user}, este ticket será excluído em 5 segundos.`)
            try {
                setTimeout(() => {
                    interaction.channel.delete().catch(e => { return; })
                }, 5000)
            } catch (e) {
                return;
            }
        }
    }

})

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (await db.get(`modo_afk_${message.author.id}`) === true) {
        message.reply(`Olá ${message.author}, seu modo AFK foi desativado!`)
        await db.delete(`modo_afk_${message.author.id}`)
    }

    let afk_user = message.mentions.members.first()
    if (!afk_user) return;

    if (afk_user) {
        let afk_mode = await db.get(`modo_afk_${afk_user.id}`)
        if (afk_mode === true) {
            let afk_motivo = await db.get(`motivo_afk_${afk_user.id}`)
            message.reply(`Olá ${message.author}, o usuário **${afk_user.user.username}** está com o modo AFK ativado pelo motivo: \`${afk_motivo}\`.`)
        } else {
            return;
        }
    }
})