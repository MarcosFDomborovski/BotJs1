const Discord = require("discord.js");
const os = require("os");
const { version } = require("discord.js");

module.exports = {
    name: "infobot",
    description: "Fornece informações sobre o bot",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let dono = "474334792830156805";
        let membros = client.users.cache.size;
        let servidores = client.guilds.cache.size;
        let canais = client.channels.cache.size;
        let bot = client.user.tag;
        let avatarBot = client.user.displayAvatarURL();
        let ping = client.ws.ping;
        let botId = client.user.id;
        let dataCriacao = client.user.createdAt.toLocaleDateString("pt-BR");
        let totalComandos = client.slashCommands.size;

        // Cálculo do uptime
        let uptime = client.uptime;
        let dias = Math.floor(uptime / 86400000);
        let horas = Math.floor(uptime / 3600000) % 24;
        let minutos = Math.floor(uptime / 60000) % 60;
        let segundos = Math.floor(uptime / 1000) % 60;
        let uptimeFormatado = `${dias}d ${horas}h ${minutos}m ${segundos}s`;

        // Uso de memória
        let memoriaUsada = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        let memoriaTotal = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);

        // Versão do Node.js
        let versaoNode = process.version;

        // Versão do Discord.js
        let versaoDiscord = version;

        // Status do bot
        let status = "online";
        try {
            status = client.user.presence?.status || "online";
        } catch (e) {
            status = "online";
        }
        let statusEmoji = {
            "online": "🟢",
            "idle": "🟡",
            "dnd": "🔴",
            "offline": "⚫"
        };

        // Plataforma/Sistema Operacional
        let plataforma = os.platform();
        let arquitetura = os.arch();

        // CPU
        let cpu = os.cpus()[0].model;

        let embed = new Discord.EmbedBuilder()
            .setColor("Random")
            .setAuthor({ name: bot, iconURL: avatarBot })
            .setFooter({ text: bot, iconURL: avatarBot })
            .setTimestamp(new Date())
            .setThumbnail(avatarBot)
            .setDescription(`Olá ${interaction.user}, veja minhas informações detalhadas abaixo:`)
            .addFields(
                { name: "🤖 Informações Básicas", value: `**Nome:** \`${bot}\`\n**ID:** \`${botId}\`\n**Status:** ${statusEmoji[status]} \`${status}\`\n**Criado em:** \`${dataCriacao}\`\n**Dono:** ${client.users.cache.get(dono) || "Não encontrado"}`, inline: false },
                { name: "📊 Estatísticas", value: `**Servidores:** \`${servidores}\`\n**Membros:** \`${membros.toLocaleString("pt-BR")}\`\n**Canais:** \`${canais}\`\n**Comandos:** \`${totalComandos}\`\n**Ping:** \`${ping}ms\``, inline: true },
                { name: "⏱️ Sistema", value: `**Uptime:** \`${uptimeFormatado}\`\n**Memória:** \`${memoriaUsada}MB / ${memoriaTotal}MB\`\n**Plataforma:** \`${plataforma}\`\n**Arquitetura:** \`${arquitetura}\``, inline: true },
                { name: "💻 Tecnologias", value: `**Linguagem:** \`JavaScript\`\n**Biblioteca:** \`Discord.js ${versaoDiscord}\`\n**Node.js:** \`${versaoNode}\`\n**CPU:** \`${cpu.substring(0, 30)}...\``, inline: false }
            );

        interaction.reply({ embeds: [embed] })
    }
}