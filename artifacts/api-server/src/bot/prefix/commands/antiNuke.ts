import { Guild, AuditLogEvent, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { antinuke } from "../../lib/locales/extra/antinuke";

type NukeSettings = {
  enabled: boolean;
  threshold: number;
  punishment: "ban" | "kick" | "strip";
  whitelist: string[];
  logChannel?: string;
};

type ActionTrack = { bans: number[]; channelDeletes: number[]; roleDeletes: number[] };

const nukeSettings = new Map<string, NukeSettings>();
const nukeTracker = new Map<string, ActionTrack>();

const WINDOW_MS = 10_000;

function getSettings(guildId: string): NukeSettings {
  return nukeSettings.get(guildId) ?? { enabled: false, threshold: 5, punishment: "ban", whitelist: [] };
}

function trackAction(guildId: string, userId: string, type: keyof ActionTrack): number {
  const key = `${guildId}:${userId}`;
  const data: ActionTrack = nukeTracker.get(key) ?? { bans: [], channelDeletes: [], roleDeletes: [] };
  const now = Date.now();
  data[type].push(now);
  data[type] = data[type].filter((ts) => now - ts < WINDOW_MS);
  nukeTracker.set(key, data);
  return data[type].length;
}

async function punish(guild: Guild, userId: string, s: NukeSettings, reason: string) {
  if (userId === guild.ownerId) return;
  const t = antinuke[getLangCode(guild.id)];
  const key = `${guild.id}:${userId}`;
  nukeTracker.set(key, { bans: [], channelDeletes: [], roleDeletes: [] });

  try {
    const member = guild.members.cache.get(userId) ?? await guild.members.fetch(userId).catch(() => null);
    if (member) {
      if (s.punishment === "ban") {
        await guild.bans.create(userId, { reason });
      } else if (s.punishment === "kick") {
        await member.kick(reason);
      } else {
        await member.roles.set([], reason);
      }
    }

    if (s.logChannel) {
      const ch = guild.channels.cache.get(s.logChannel);
      if (ch?.isTextBased()) {
        await (ch as any).send({
          embeds: [
            new EmbedBuilder()
              .setTitle(t.nukeTriggeredTitle)
              .setDescription(t.nukeTriggeredDesc(userId, s.punishment, reason))
              .setColor(0xff0000)
              .setTimestamp(),
          ],
        });
      }
    }
  } catch {
  }
}

export async function handleAntiNukeBan(guild: Guild, executorId: string) {
  const s = getSettings(guild.id);
  if (!s.enabled || s.whitelist.includes(executorId)) return;
  const t = antinuke[getLangCode(guild.id)];
  const count = trackAction(guild.id, executorId, "bans");
  if (count >= s.threshold) {
    await punish(guild, executorId, s, t.banReason(count));
  }
}

export async function handleAntiNukeChannelDelete(guild: Guild, executorId: string) {
  const s = getSettings(guild.id);
  if (!s.enabled || s.whitelist.includes(executorId)) return;
  const t = antinuke[getLangCode(guild.id)];
  const count = trackAction(guild.id, executorId, "channelDeletes");
  if (count >= s.threshold) {
    await punish(guild, executorId, s, t.channelDeleteReason(count));
  }
}

export async function handleAntiNukeRoleDelete(guild: Guild, executorId: string) {
  const s = getSettings(guild.id);
  if (!s.enabled || s.whitelist.includes(executorId)) return;
  const t = antinuke[getLangCode(guild.id)];
  const count = trackAction(guild.id, executorId, "roleDeletes");
  if (count >= s.threshold) {
    await punish(guild, executorId, s, t.roleDeleteReason(count));
  }
}

export const antiNukeCmd: PrefixCommand = {
  name: "antinuke",
  aliases: ["nukeschutz"],
  description: "Anti-Nuke System konfigurieren",
  usage: ",antinuke <on|off|threshold <n>|punishment <ban|kick|strip>|whitelist @user|log #channel|status>",
  async execute(message, args) {
    const t = antinuke[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
      await message.reply(t.noAdmin); return;
    }
    const gid = message.guildId!;
    const s = getSettings(gid);
    const sub = args[0]?.toLowerCase();

    if (!sub || sub === "status") {
      const statusText = s.enabled ? t.statusActive : t.statusInactive;
      const logChannelText = s.logChannel ? `<#${s.logChannel}>` : t.notSet;
      const whitelistText = s.whitelist.length > 0 ? s.whitelist.map((id) => `<@${id}>`).join(", ") : t.none;
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(t.statusTitle)
            .setDescription(t.statusDesc(statusText, s.threshold, s.punishment, logChannelText, whitelistText))
            .setColor(s.enabled ? 0x00ff00 : 0xff0000)
            .setTimestamp(),
        ],
      });
      return;
    }

    if (sub === "on") {
      nukeSettings.set(gid, { ...s, enabled: true });
      await message.reply(t.enabled);
    } else if (sub === "off") {
      nukeSettings.set(gid, { ...s, enabled: false });
      await message.reply(t.disabled);
    } else if (sub === "threshold") {
      const val = parseInt(args[1] ?? "");
      if (isNaN(val) || val < 1 || val > 50) { await message.reply(t.invalidThreshold); return; }
      nukeSettings.set(gid, { ...s, threshold: val });
      await message.reply(t.thresholdSet(val));
    } else if (sub === "punishment") {
      const p = args[1]?.toLowerCase();
      if (!["ban", "kick", "strip"].includes(p ?? "")) {
        await message.reply(t.invalidPunishment); return;
      }
      nukeSettings.set(gid, { ...s, punishment: p as "ban" | "kick" | "strip" });
      await message.reply(t.punishmentSet(p!));
    } else if (sub === "whitelist") {
      const user = message.mentions.users.first();
      if (!user) { await message.reply(t.noUser); return; }
      const was = s.whitelist.includes(user.id);
      const list = was ? s.whitelist.filter((id) => id !== user.id) : [...s.whitelist, user.id];
      nukeSettings.set(gid, { ...s, whitelist: list });
      await message.reply(t.whitelistUpdated(user.id, was ? t.whitelistRemovedPart : t.whitelistAddedPart));
    } else if (sub === "log") {
      const ch = message.mentions.channels.first();
      if (!ch) { await message.reply(t.noChannel); return; }
      nukeSettings.set(gid, { ...s, logChannel: ch.id });
      await message.reply(t.logChannelSet(ch.id));
    } else {
      await message.reply(t.optionsHelp);
    }
  },
};
