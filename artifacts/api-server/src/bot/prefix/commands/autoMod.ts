import { Message, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { automod } from "../../lib/locales/extra/automod";

export type AutoModSettings = {
  antiSpam: boolean;
  antiCaps: boolean;
  antiLinks: boolean;
  spamThreshold: number;
  capsThreshold: number;
  excludedChannels: string[];
  bypassRoles: string[];
  exemptChannels: string[];
};

export const autoModSettings = new Map<string, AutoModSettings>();

const userMessageTracker = new Map<string, number[]>();

function getSettings(guildId: string): AutoModSettings {
  return autoModSettings.get(guildId) ?? {
    antiSpam: false, antiCaps: false, antiLinks: false,
    spamThreshold: 5, capsThreshold: 70,
    excludedChannels: [], bypassRoles: [], exemptChannels: [],
  };
}

export const autoModCmd: PrefixCommand = {
  name: "automod",
  aliases: ["am", "automoderation"],
  description: "Configure auto-moderation",
  usage: ",automod <spam|caps|links|off|status> [value]",
  async execute(message, args) {
    const t = automod[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
      await message.reply(t.noPermission); return;
    }
    const guildId = message.guildId!;
    const s = getSettings(guildId);
    const sub = args[0]?.toLowerCase();
    if (!sub) {
      const embed = new EmbedBuilder()
        .setTitle(t.settingsTitle)
        .setDescription(
          t.settingsDesc(s.antiSpam, s.antiCaps, s.antiLinks, s.spamThreshold, s.capsThreshold),
        ).setColor(0x5865f2).setTimestamp();
      await message.channel.send({ embeds: [embed] }); return;
    }

    if (sub === "spam") {
      const val = parseInt(args[1] ?? "");
      if (!isNaN(val)) { s.spamThreshold = val; s.antiSpam = true; }
      else { s.antiSpam = !s.antiSpam; }
      autoModSettings.set(guildId, s);
      await message.reply(t.spamToggle(s.antiSpam, s.spamThreshold));
    } else if (sub === "caps") {
      const val = parseInt(args[1] ?? "");
      if (!isNaN(val)) { s.capsThreshold = val; s.antiCaps = true; }
      else { s.antiCaps = !s.antiCaps; }
      autoModSettings.set(guildId, s);
      await message.reply(t.capsToggle(s.antiCaps, s.capsThreshold));
    } else if (sub === "links") {
      s.antiLinks = !s.antiLinks;
      autoModSettings.set(guildId, s);
      await message.reply(t.linksToggle(s.antiLinks));
    } else if (sub === "off") {
      autoModSettings.set(guildId, { ...s, antiSpam: false, antiCaps: false, antiLinks: false });
      await message.reply(t.offDisabled);
    } else if (sub === "status") {
      const embed = new EmbedBuilder()
        .setTitle(t.statusTitle)
        .setDescription(
          t.statusDesc(s.antiSpam, s.antiCaps, s.antiLinks),
        ).setColor(0x5865f2).setTimestamp();
      await message.channel.send({ embeds: [embed] });
    } else {
      await message.reply(t.unknownSetting);
    }
  },
};

export async function handleAutoMod(message: Message) {
  if (!message.inGuild() || message.author.bot) return;
  if (message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) return;

  const s = getSettings(message.guildId);
  const t = automod[getLangCode(message.guildId)];

  if (s.excludedChannels.includes(message.channelId) || s.exemptChannels.includes(message.channelId)) return;

  const memberRoleIds = message.member?.roles.cache.map((r) => r.id) ?? [];
  const hasBypass = s.bypassRoles.some((id) => memberRoleIds.includes(id));

  const key = `${message.guildId}-${message.author.id}`;

  if (s.antiLinks && !hasBypass) {
    const linkRegex = /https?:\/\/[^\s]+/gi;
    if (linkRegex.test(message.content)) {
      await message.delete().catch(() => {});
      const reply = await message.channel.send(t.linksNotAllowed(message.author.id));
      setTimeout(() => reply.delete().catch(() => {}), 5000);
      return;
    }
  }

  if (s.antiSpam) {
    const now = Date.now();
    const msgs = userMessageTracker.get(key) ?? [];
    msgs.push(now);
    const recent = msgs.filter((ts) => now - ts < 5000);
    userMessageTracker.set(key, recent);
    if (recent.length > s.spamThreshold) {
      await message.delete().catch(() => {});
      const reply = await message.channel.send(t.noSpam(message.author.id, recent.length));
      setTimeout(() => reply.delete().catch(() => {}), 5000);
      return;
    }
  }

  if (s.antiCaps && message.content.length > 5) {
    const caps = message.content.replace(/\s/g, "").split("").filter((c) => c === c.toUpperCase() && /[A-Z]/.test(c)).length;
    const ratio = (caps / message.content.replace(/\s/g, "").length) * 100;
    if (ratio > s.capsThreshold) {
      await message.delete().catch(() => {});
      const reply = await message.channel.send(t.tooManyCaps(message.author.id));
      setTimeout(() => reply.delete().catch(() => {}), 5000);
      return;
    }
  }
}
