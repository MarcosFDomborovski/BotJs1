const Discord = require("discord.js");
const client = require("../../index");
const helpInteraction = new Map();

module.exports = {
    name: "help",
    description: "Painel de comandos do bot.",
    type: Discord.ApplicationCommandType.ChatInput,

    run: async (client, interaction) => {
        let embedPainel = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, veja meus comandos interagindo com o painel abaixo:`);

        let embedUtilidade = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, veja meus comandos relacionados a **utilidade** abaixo:`)
            .addFields({ name: `/afk`, value: `Ative o modo AFK.` })
            .addFields({ name: `/avaliação`, value: `Avalie alguém do servidor.` })
            .addFields({ name: `/botinfo`, value: `Fornece informações sobre o bot` })
            .addFields({ name: `/mensagens`, value: `Contador de mensagens.` })
            .addFields({ name: `/ping`, value: `Veja o ping do bot.` })
            .addFields({ name: `/registrar`, value: `Registre-se no servidor. (Desativado no momento.)` })
            .addFields({ name: `/serverinfo`, value: `Envia informações sobre o servidor.` })
            .addFields({ name: `/userinfo`, value: `Veja as informações de um usuário.` });

        let embedEconomia = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, veja meus comandos relacionados a **economia** abaixo:`)
            .addFields({ name: `/carteira`, value: `Veja a quantidade de moedas que você tem na carteira.` })
            .addFields({ name: `/daily`, value: `Resgate suas moedas diárias.` })
            .addFields({ name: `/allwin`, value: `All-win! Aposte todas suas moedas para ter uma chance de 25% para multiplicar suas moedas em x5` })
            .addFields({ name: `/double`, value: `Double or nothing! (50% de chance para duplicar sua aposta!)` })
            .addFields({ name: `/triple`, value: `Triple or nothing! (33% de chance para triplicar sua aposta!)` })
            .addFields({ name: `/mendigar`, value: `Tente a sorte para ganhar algumas moedas!` });

        let embedDiversao = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, veja meus comandos de **diversão** abaixo:`)
            .addFields({ name: `/d4`, value: `Role um dado de 4 lados.` })
            .addFields({ name: `/d6`, value: `Role um dado de 6 lados.` })
            .addFields({ name: `/d10`, value: `Role um dado de 10 lados.` })
            .addFields({ name: `/d12`, value: `Role um dado de 12 lados.` })
            .addFields({ name: `/d20`, value: `Role um dado de 20 lados.` })
            .addFields({ name: `/hug`, value: `Abrace um membro.` })
            .addFields({ name: `/slap`, value: `Dê um tapa em uma pessoa.` });

        let embedAdm = new Discord.EmbedBuilder()
            .setColor("Aqua")
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`Olá ${interaction.user}, veja meus comandos de **administração** abaixo:`)
            .addFields({ name: `/antilink`, value: `Ative ou desative o sistema de antilink no servidor.` })
            .addFields({ name: `/anunciar`, value: `Anuncie algo em uma embed.` })
            .addFields({ name: `/ban`, value: `Bana um membro do servidor.` })
            .addFields({ name: `/cargo_botao`, value: `Ganhe cargos clicando em botões.` })
            .addFields({ name: `/clear`, value: `Limpe o chat.` })
            .addFields({ name: `/cores`, value: `Abra o painel de seleção de cores do nick.` })
            .addFields({ name: `/dm`, value: `Envie uma mensagem no privado de um usuário.` })
            .addFields({ name: `/enquete`, value: `Crie uma enquete no servidor.` })
            .addFields({ name: `/formulário`, value: `Abra o painel do formulário para os membros.` })
            .addFields({ name: `/kick`, value: `Expulse um membro do servidor.` })
            .addFields({ name: `/lock`, value: `Bloqueie um canal.` })
            .addFields({ name: `/say`, value: `Faça o bot dizer algo.` })
            .addFields({ name: `/setnick`, value: `Configura o nickname de um usuário no servidor.` })
            .addFields({ name: `/slowmode`, value: `Configure o modo lento em um canal de texto.` })
            .addFields({ name: `/sorteio`, value: `Crie um sorteio no servidor.` })
            .addFields({ name: `/sugestao`, value: `Crie um formulário de sugestões para os membros.` })
            .addFields({ name: `/tickets`, value: `Ative o sistema de tickets no servidor.` })
            .addFields({ name: `/transcript`, value: `Transcreva todas as mensagens de um canal para um arquivo html.` })
            .addFields({ name: `/unban`, value: `Desbana um membro do servidor.` })
            .addFields({ name: `/unlock`, value: `Desbloqueie um canal.` })
            .addFields({ name: `/verificacao`, value: `Ative o sistema de verificação por cargo.` })
            .addFields({ name: `/video`, value: `Armazenar um vídeo.` });

        let painel = new Discord.ActionRowBuilder().addComponents(
            new Discord.StringSelectMenuBuilder()
                .setCustomId("painelTicket")
                .setPlaceholder("Clique aqui!")
                .addOptions([
                    { label: "Painel Inicial", emoji: "📚", value: "painel" },
                    { label: "Utilidade", description: "Veja meus comandos de utilidade.", emoji: "✨", value: "utilidade" },
                    { label: "Diversão", description: "Veja meus comandos de diversão.", emoji: "😂", value: "diversao" },
                    { label: "Economia", description: "Veja meus comandos de economia.", emoji: "💰", value: "economia" },
                    { label: "Administração", description: "Veja meus comandos de administração.", emoji: "🛠", value: "adm" }
                ])
        );

        if (helpInteraction.has(interaction.user.id)) {
            const oldMessage = helpInteraction.get(interaction.user.id);
            try {
                await oldMessage.delete();
            } catch (err) {
                console.error('Erro ao tentar deletar a mensagem anterior:', err);
            }
            helpInteraction.delete(interaction.user.id);
        }

        // Envia a nova mensagem e a armazena no mapa
        const newMessage = await interaction.reply({ embeds: [embedPainel], components: [painel], ephemeral: true });
        helpInteraction.set(interaction.user.id, newMessage);

        // Cria o coletor com filtro e tempo limite
        const filter = i => i.customId === 'painelTicket' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 }); // 60 segundos de tempo limite

        collector.on("collect", async c => {
            try {
                if (!c.values || c.values.length === 0) return;

                let valor = c.values[0];
                await c.deferUpdate();

                if (valor === "painel") {
                    await c.editReply({ embeds: [embedPainel] });
                } else if (valor === "utilidade") {
                    await c.editReply({ embeds: [embedUtilidade] });
                } else if (valor === "diversao") {
                    await c.editReply({ embeds: [embedDiversao] });
                } else if (valor === "economia") {
                    await c.editReply({ embeds: [embedEconomia] });
                } else if (valor === "adm") {
                    await c.editReply({ embeds: [embedAdm] });
                }

            } catch (error) {
                console.error('Erro ao processar a interação:');
            }
        });

        // Finaliza e limpa as interações ao término do coletor
        collector.on("end", () => {
            helpInteraction.delete(interaction.user.id);
        });
    }
};
