import { Message, EmbedBuilder, GuildMember } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";
import { checkXpRoleRewards } from "./xpRoles";

interface UserXP { xp: number; level: number; lastMessage: number; }
export const xpData = new Map<string, UserXP>();
const XP_COOLDOWN = 60_000;
const XP_MIN = 15, XP_MAX = 25;

export function calcLevel(xp: number) { return Math.floor(Math.sqrt(xp / 100)); }
export function xpForNextLevel(level: number) { return Math.pow(level + 1, 2) * 100; }

export async function handleXpGain(message: Message) {
  if (message.author.bot || !message.inGuild()) return;
  const key = `${message.guildId}-${message.author.id}`;
  const now = Date.now();
  const data = xpData.get(key) ?? { xp: 0, level: 0, lastMessage: 0 };
  if (now - data.lastMessage < XP_COOLDOWN) return;
  const gained = Math.floor(Math.random() * (XP_MAX - XP_MIN + 1)) + XP_MIN;
  data.xp += gained;
  data.lastMessage = now;
  const newLevel = calcLevel(data.xp);
  if (newLevel > data.level) {
    data.level = newLevel;
    const L = getLang(message.guildId);
    const embed = new EmbedBuilder()
      .setTitle(L.level.levelUpTitle)
      .setDescription(L.level.levelUpDesc(`${message.author}`, newLevel))
      .setColor(0xffd700).setThumbnail(message.author.displayAvatarURL());
    await message.channel.send({ embeds: [embed] }).catch(() => {});
    const member = message.guild?.members.cache.get(message.author.id);
    if (member) {
      await checkXpRoleRewards(message.guildId, message.author.id, newLevel, member).catch(() => {});
    }
  }
  xpData.set(key, data);
}

export const levelCmd: PrefixCommand = {
  name: "level",
  aliases: ["lvl", "xp", "rank"],
  description: "Show level and XP / Level und XP anzeigen",
  usage: ",level [@user]",
  async execute(message) {
    const L = getLang(message.guildId!);
    const target = (message.mentions.members?.first() as GuildMember | undefined) ?? message.member!;
    const key = `${message.guildId}-${target.id}`;
    const data = xpData.get(key) ?? { xp: 0, level: 0, lastMessage: 0 };
    const currentLevel = calcLevel(data.xp);
    const nextXp = xpForNextLevel(currentLevel);
    const prevXp = Math.pow(currentLevel, 2) * 100;
    const progress = data.xp - prevXp;
    const needed = nextXp - prevXp;
    const bars = Math.round((progress / needed) * 20);
    const progressBar = `[${"█".repeat(bars)}${"░".repeat(20 - bars)}]`;
    const embed = new EmbedBuilder()
      .setTitle(L.level.title(target.displayName))
      .setThumbnail(target.user.displayAvatarURL())
      .addFields(
        { name: L.level.levelField, value: `**${currentLevel}**`, inline: true },
        { name: L.level.xpField, value: `**${data.xp.toLocaleString()}**`, inline: true },
        { name: L.level.nextField, value: `${progressBar}\n${progress}/${needed} XP` }
      ).setColor(0xffd700).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const leaderboardCmd: PrefixCommand = {
  name: "leaderboard",
  aliases: ["lb", "top"],
  description: "Show XP leaderboard / XP Rangliste anzeigen",
  usage: ",leaderboard",
  async execute(message) {
    const L = getLang(message.guildId!);
    const guildPrefix = `${message.guildId}-`;
    const sorted = Array.from(xpData.entries())
      .filter(([k]) => k.startsWith(guildPrefix))
      .sort(([, a], [, b]) => b.xp - a.xp)
      .slice(0, 10);

    if (sorted.length === 0) {
      await message.reply(L.level.empty); return;
    }

    const medals = ["🥇", "🥈", "🥉"];
    const lines = sorted.map(([key, data], i) => {
      const userId = key.replace(guildPrefix, "");
      const medal = medals[i] ?? `**${i + 1}.**`;
      return `${medal} <@${userId}> — Level **${calcLevel(data.xp)}** (${data.xp.toLocaleString()} XP)`;
    });

    const embed = new EmbedBuilder()
      .setTitle(L.level.leaderboardTitle(message.guild!.name))
      .setDescription(lines.join("\n"))
      .setColor(0xffd700).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};
