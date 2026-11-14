import {
  Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  PermissionFlagsBits, ButtonInteraction, TextChannel, MessageFlags,
} from "discord.js";
import type { PrefixCommand } from "../types";
import { logger } from "../../../lib/logger";
import { getLang } from "../../lib/i18n";

interface Giveaway {
  messageId: string; channelId: string; guildId: string; prize: string;
  winnersCount: number; endsAt: number; hostId: string; ended: boolean;
  participants: Set<string>; timer: ReturnType<typeof setTimeout>;
}

export const activeGiveaways = new Map<string, Giveaway>();

function parseDuration(str: string): number | null {
  const match = str.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;
  const n = parseInt(match[1]!);
  const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return n * multipliers[match[2]!]!;
}

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const parts: string[] = [];
  const d = Math.floor(s / 86400); if (d > 0) parts.push(`${d}d`);
  const h = Math.floor((s % 86400) / 3600); if (h > 0) parts.push(`${h}h`);
  const m = Math.floor((s % 3600) / 60); if (m > 0) parts.push(`${m}m`);
  return parts.length ? parts.join(" ") : `${s}s`;
}

function pickWinners(participants: Set<string>, count: number): string[] {
  return Array.from(participants).sort(() => Math.random() - 0.5).slice(0, count);
}

async function endGiveaway(giveaway: Giveaway, client: any) {
  giveaway.ended = true;
  activeGiveaways.delete(giveaway.messageId);
  const L = getLang(giveaway.guildId);
  try {
    const channel = await client.channels.fetch(giveaway.channelId) as TextChannel;
    const msg = await channel.messages.fetch(giveaway.messageId);
    const winners = pickWinners(giveaway.participants, giveaway.winnersCount);
    const embed = new EmbedBuilder()
      .setTitle(L.giveaway.endedTitle)
      .addFields(
        { name: L.giveaway.prize, value: giveaway.prize },
        { name: L.giveaway.winners, value: winners.length > 0 ? winners.map((w) => `<@${w}>`).join(", ") : "—" },
        { name: L.giveaway.participants, value: `${giveaway.participants.size}`, inline: true },
        { name: L.giveaway.drawn, value: `${winners.length}x`, inline: true },
        { name: L.giveaway.host, value: `<@${giveaway.hostId}>`, inline: true }
      ).setColor(0xffd700).setTimestamp();
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`giveaway_reroll_${giveaway.messageId}`).setLabel(L.giveaway.rerollBtn).setStyle(ButtonStyle.Secondary)
    );
    await msg.edit({ embeds: [embed], components: [row] });
    if (winners.length > 0) {
      await channel.send(L.giveaway.winnerMsg(winners.map((w) => `<@${w}>`).join(", "), giveaway.prize, `<@${giveaway.hostId}>`));
    } else {
      await channel.send(L.giveaway.noParticipants);
    }
  } catch (err) { logger.error({ err }, "Failed to end giveaway"); }
}

export function handleGiveawayButton(interaction: ButtonInteraction) {
  const { customId } = interaction;
  const guildId = interaction.guildId ?? "";
  const L = getLang(guildId);

  if (customId.startsWith("giveaway_join_")) {
    const msgId = customId.replace("giveaway_join_", "");
    const giveaway = activeGiveaways.get(msgId);
    if (!giveaway) { interaction.reply({ content: L.giveaway.ended, flags: MessageFlags.Ephemeral }); return; }
    const userId = interaction.user.id;
    if (giveaway.participants.has(userId)) {
      giveaway.participants.delete(userId);
      interaction.reply({ content: L.giveaway.left, flags: MessageFlags.Ephemeral });
    } else {
      giveaway.participants.add(userId);
      interaction.reply({ content: L.giveaway.joined(giveaway.participants.size), flags: MessageFlags.Ephemeral });
    }
    const embed = EmbedBuilder.from(interaction.message.embeds[0]!).setFields(
      { name: L.giveaway.prize, value: giveaway.prize },
      { name: L.giveaway.winners, value: `${giveaway.winnersCount}x`, inline: true },
      { name: L.giveaway.participants, value: `${giveaway.participants.size}`, inline: true },
      { name: L.giveaway.ends, value: `<t:${Math.floor(giveaway.endsAt / 1000)}:R>`, inline: true },
      { name: L.giveaway.host, value: `<@${giveaway.hostId}>`, inline: true }
    );
    interaction.message.edit({ embeds: [embed] }).catch(() => {});
    return;
  }

  if (customId.startsWith("giveaway_reroll_")) {
    if (!interaction.member || !(interaction.member as any).permissions?.has?.(PermissionFlagsBits.ManageGuild)) {
      interaction.reply({ content: L.giveaway.noPermission, flags: MessageFlags.Ephemeral }); return;
    }
    interaction.reply({ content: L.giveaway.rerolling, flags: MessageFlags.Ephemeral });
    (interaction.channel as any)?.send(L.giveaway.rerolling).catch(() => {});
  }
}

export const giveawayStartCmd: PrefixCommand = {
  name: "giveaway",
  aliases: ["gw"],
  description: "Start a giveaway / Gewinnspiel starten",
  usage: ",giveaway <duration> <winners> <prize>  e.g. ,giveaway 1h 1 Nitro",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await message.reply(L.giveaway.noPermission); return;
    }
    if (args.length < 3) { await message.reply(L.giveaway.usage); return; }
    const duration = parseDuration(args[0]!);
    if (!duration) { await message.reply(L.giveaway.invalidDuration); return; }
    const winnersCount = parseInt(args[1]!);
    if (isNaN(winnersCount) || winnersCount < 1) { await message.reply(L.giveaway.invalidWinners); return; }
    const prize = args.slice(2).join(" ");
    const endsAt = Date.now() + duration;

    const embed = new EmbedBuilder()
      .setTitle(L.giveaway.title)
      .addFields(
        { name: L.giveaway.prize, value: prize },
        { name: L.giveaway.winners, value: `${winnersCount}x`, inline: true },
        { name: L.giveaway.participants, value: "0", inline: true },
        { name: L.giveaway.ends, value: `<t:${Math.floor(endsAt / 1000)}:R>`, inline: true },
        { name: L.giveaway.host, value: `<@${message.author.id}>`, inline: true }
      ).setColor(0xff73fa)
      .setFooter({ text: L.giveaway.footer(formatDuration(duration)) })
      .setTimestamp(endsAt);

    const giveawayMsg = await message.channel.send({ embeds: [embed] });
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`giveaway_join_${giveawayMsg.id}`).setLabel(L.giveaway.joinBtn).setStyle(ButtonStyle.Success)
    );
    await giveawayMsg.edit({ components: [row] });
    await message.delete().catch(() => {});

    const giveaway: Giveaway = {
      messageId: giveawayMsg.id, channelId: message.channelId, guildId: message.guildId!,
      prize, winnersCount, endsAt, hostId: message.author.id, ended: false,
      participants: new Set(),
      timer: setTimeout(() => endGiveaway(giveaway, message.client), duration),
    };
    activeGiveaways.set(giveawayMsg.id, giveaway);
  },
};

export const giveawayEndCmd: PrefixCommand = {
  name: "giveaway-end",
  aliases: ["gw-end", "gwend"],
  description: "End a giveaway / Gewinnspiel beenden",
  usage: ",giveaway-end <message-id>",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await message.reply(L.giveaway.noPermission); return;
    }
    const msgId = args[0];
    if (!msgId) { await message.reply(L.giveaway.usage); return; }
    const giveaway = activeGiveaways.get(msgId);
    if (!giveaway) { await message.reply(L.giveaway.notFound); return; }
    clearTimeout(giveaway.timer);
    await endGiveaway(giveaway, message.client);
  },
};

export const giveawayRerollCmd: PrefixCommand = {
  name: "giveaway-reroll",
  aliases: ["gw-reroll", "gwreroll"],
  description: "Reroll giveaway winner / Neuen Gewinner ziehen",
  usage: ",giveaway-reroll <message-id>",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await message.reply(L.giveaway.noPermission); return;
    }
    await message.reply(L.giveaway.rerolling);
  },
};

export const giveawayListCmd: PrefixCommand = {
  name: "giveaway-list",
  aliases: ["gw-list", "gwlist"],
  description: "List active giveaways / Aktive Gewinnspiele anzeigen",
  usage: ",giveaway-list",
  async execute(message) {
    const L = getLang(message.guildId!);
    const guildGiveaways = Array.from(activeGiveaways.values()).filter((g) => g.guildId === message.guildId);
    if (guildGiveaways.length === 0) { await message.reply(L.giveaway.noActive); return; }
    const embed = new EmbedBuilder()
      .setTitle(L.giveaway.listTitle)
      .setDescription(
        guildGiveaways.map((g) => `• **${g.prize}** — ${g.participants.size} ${L.giveaway.participants.split(" ")[1] ?? "participants"} — <t:${Math.floor(g.endsAt / 1000)}:R>`).join("\n")
      ).setColor(0xff73fa).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};
