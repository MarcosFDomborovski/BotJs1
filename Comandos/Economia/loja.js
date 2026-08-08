const Discord = require('discord.js');
const client = require('../../index');
const User = require('../../models/user');
const Channel = require('../../models/config');

const DONO = '474334792830156805';
// ponytail: cargo castigo hardcoded; mover p/ config se multi-guild
const CARGO_CASTIGO = '1357909360042446858';
const pending = new Map();

const ITEMS = [
  { id: 'mute_membro5', nome: 'Mute 5 min', desc: 'Mute por 5 min', preco: 1000, emoji: '🔇', action: 'mute', ms: 300000 },
  { id: 'mute_membro10', nome: 'Mute 10 min', desc: 'Mute por 10 min', preco: 2000, emoji: '🔇', action: 'mute', ms: 600000 },
  { id: 'disconnect_membro', nome: 'Disconnect', desc: 'Desconecta de voz', preco: 500, emoji: '📴', action: 'disconnect' },
  { id: 'deafen_membro', nome: 'Ensurdecer', desc: 'Surdo por 5 min', preco: 2000, emoji: '🔈', action: 'deafen', ms: 300000 },
  { id: 'promocao_membro', nome: 'Promoção', desc: 'Pedir promoção', preco: 1000, emoji: '🧪', action: 'manual' },
  { id: 'troca_cargo', nome: 'Troca de cargos', desc: 'Trocar cargo', preco: 2500, emoji: '🧪', action: 'manual', modal: true },
  { id: 'punish_user', nome: 'Punição', desc: 'Castigo 1 dia', preco: 880, emoji: '🚫', action: 'punish', ms: 86400000 },
];

const findItem = (id) => ITEMS.find((i) => i.id === id);
const needsModal = (item) => item.action !== 'manual' || item.modal;

async function getUser(id, username) {
  return (await User.findOne({ discordId: id })) || User.create({ discordId: id, username });
}

async function charge(u, preco) {
  if (u.dinheiro < preco) return false;
  u.dinheiro -= preco;
  await u.save();
  return true;
}

function dm(m, t) { return m.send(t).catch(() => {}); }
function later(ms, fn) { setTimeout(() => fn().catch((e) => console.error('loja:', e.message)), ms); }

function embed(i, color, title, desc, fields = []) {
  return new Discord.EmbedBuilder()
    .setColor(color)
    .setAuthor({ name: i.guild.name, iconURL: i.guild.iconURL({ dynamic: true }) })
    .setThumbnail(i.user.displayAvatarURL({ dynamic: true }))
    .setTitle(title)
    .setDescription(desc)
    .setTimestamp()
    .addFields(fields);
}

function bought(i, item, saldo, extra = '') {
  return embed(i, 'Green', '✅ Compra Efetuada!', `Olá ${i.user}, comprou **${item.nome}**${extra}`, [
    { name: '💸 Gasto', value: `**${item.preco}**` },
    { name: '💰 Saldo', value: `**${saldo}**` },
  ]);
}

/** @returns {Promise<string|null>} */
async function apply(i, item, target) {
  const r = `loja (${i.user.tag})`;
  const mins = item.ms / 60000;

  if (['mute', 'deafen', 'disconnect'].includes(item.action) && !target.voice.channel) {
    return `**${target.user}** fora de voz.`;
  }

  if (item.action === 'mute') {
    if (target.voice.mute) return `**${target.user}** já mutado.`;
    await target.voice.setMute(true, r);
    await dm(target, `Mutado ${mins} min por ${i.user} (loja).`);
    later(item.ms, async () => { await target.voice.setMute(false, 'loja'); await dm(target, `Pode falar (${mins} min).`); });
    return null;
  }
  if (item.action === 'deafen') {
    if (target.voice.deaf || target.voice.selfDeaf) return `**${target.user}** já surdo.`;
    await target.voice.setDeaf(true, r);
    await dm(target, `Ensurdecido por ${i.user} (loja).`);
    later(item.ms, async () => { await target.voice.setDeaf(false, 'loja'); await dm(target, `Audição ok (${mins} min).`); });
    return null;
  }
  if (item.action === 'disconnect') {
    await target.voice.disconnect(r);
    await dm(target, `Desconectado por ${i.user} (loja).`);
    return null;
  }
  if (item.action === 'punish') {
    const role = i.guild.roles.cache.get(CARGO_CASTIGO);
    if (!role) return 'Cargo de castigo sumiu.';
    await target.roles.add(role);
    await dm(target, `Castigo 1 dia por **${i.user}**.`);
    later(item.ms, async () => { await target.roles.remove(role); await dm(target, 'Fim do castigo.'); });
    return null;
  }
  return null;
}

async function logBuy(i, item, target) {
  const cfg = await Channel.findOne({ guildId: i.guild.id });
  const id = cfg?.storeLogsChannelId;
  if (!id || id === 'Não configurado.') return;
  const ch = i.guild.channels.cache.get(id);
  if (!ch) return;
  const alvo = target ? ` em **${target.user.username}**` : '';
  await ch.send({
    embeds: [embed(i, 'Random', '✅ Compra loja', `<@${DONO}> - ${i.user} \`${i.user.id}\` usou **${item.nome}**${alvo}`)],
  }).catch(() => {});
}

function extra(item, target, query) {
  if (item.action === 'mute') return `\n${target.user} mutado **${item.ms / 60000} min**.`;
  if (item.action === 'deafen') return `\n**${target.user}** ensurdecido.`;
  if (item.action === 'disconnect') return `\n${target.user} desconectado.`;
  if (item.action === 'punish') return ` em **${target.user}**`;
  return `\nManual (ADM / <@${DONO}>)${query ? `\n\`${query}\`` : ''}`;
}

async function finishBuy(i, item, user, target, query) {
  if (!(await charge(user, item.preco))) return 'Saldo insuficiente.';
  pending.delete(i.user.id);

  const err = item.action === 'manual' ? null : await apply(i, item, target);
  if (err) {
    user.dinheiro += item.preco;
    await user.save();
    return err;
  }

  const payload = { content: '', embeds: [bought(i, item, user.dinheiro, extra(item, target, query))], components: [] };
  if (i.deferred || i.replied) await i.editReply(payload);
  else if (i.isModalSubmit()) {
    await i.deferUpdate();
    await i.editReply(payload);
  } else await i.update(payload);

  await logBuy(i, item, target);
  return null;
}

module.exports = {
  name: 'loja',
  description: 'Exibe a loja de itens.',
  type: Discord.ApplicationCommandType.ChatInput,

  run: async (_c, interaction) => {
    await interaction.reply({
      embeds: [new Discord.EmbedBuilder().setColor('Random').setTitle('🛒 Loja').setDescription('Escolha um item.').setThumbnail(interaction.guild.iconURL({ dynamic: true }))],
      components: [new Discord.ActionRowBuilder().addComponents(
        new Discord.StringSelectMenuBuilder()
          .setCustomId('loja_item')
          .setPlaceholder('Item')
          .addOptions(ITEMS.map((x) => ({ label: `${x.nome} (${x.preco})`, description: x.desc, value: x.id, emoji: x.emoji }))),
      )],
      ephemeral: true,
    });

    const collector = (await interaction.fetchReply()).createMessageComponentCollector({
      filter: (x) => x.user.id === interaction.user.id,
      time: 60_000,
      max: 1,
    });

    collector.on('collect', async (i) => {
      try {
        const item = findItem(i.values[0]);
        if (!item) return i.update({ content: 'Item inválido.', embeds: [], components: [] });

        const user = await getUser(interaction.user.id, interaction.user.username);
        if (user.dinheiro < item.preco) {
          return i.update({
            embeds: [embed(i, 'Red', '❌ Sem saldo', `Faltam **${item.preco - user.dinheiro}** p/ **${item.nome}**.`)],
            components: [],
          });
        }

        if (needsModal(item)) {
          pending.set(interaction.user.id, item);
          return i.showModal(
            new Discord.ModalBuilder()
              .setCustomId(`loja_modal_${item.id}`)
              .setTitle('Alvo')
              .addComponents(new Discord.ActionRowBuilder().addComponents(
                new Discord.TextInputBuilder()
                  .setCustomId('alvo')
                  .setLabel(item.modal ? 'Descreva o pedido' : 'Username ou ID')
                  .setPlaceholder(item.modal ? 'quero trocar cargo com...' : 'id ou username')
                  .setStyle(Discord.TextInputStyle.Short)
                  .setRequired(true),
              )),
          );
        }

        const err = await finishBuy(i, item, user, null, '');
        if (err) await i.update({ content: err, embeds: [], components: [] });
      } catch (e) {
        console.error('loja:', e);
      }
    });
  },
};

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isModalSubmit() || !interaction.customId.startsWith('loja_modal_')) return;

  try {
    const item = pending.get(interaction.user.id) || findItem(interaction.customId.slice(11));
    if (!item) return interaction.reply({ content: 'Sessão expirada. Use /loja.', ephemeral: true });

    const user = await getUser(interaction.user.id, interaction.user.username);
    const query = interaction.fields.getTextInputValue('alvo');
    const target = await interaction.guild.members.cache.find((m) => m.user.username === query)
      || await interaction.guild.members.fetch(query).catch(() => null);

    if (item.action !== 'manual' && !target) {
      await interaction.deferUpdate();
      return interaction.editReply({ content: '❌ ID/username inválido.', embeds: [], components: [] });
    }

    const err = await finishBuy(interaction, item, user, target, query);
    if (err) {
      await interaction.deferUpdate();
      await interaction.editReply({ content: err, embeds: [], components: [] });
    }
  } catch (e) {
    console.error('loja modal:', e);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: 'Erro na compra.', ephemeral: true }).catch(() => {});
    }
  }
});
