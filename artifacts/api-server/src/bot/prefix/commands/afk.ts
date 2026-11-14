import { Message, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";

export const afkUsers = new Map<string, { reason: string; time: number }>();

export const afkCmd: PrefixCommand = {
  name: "afk",
  description: "Set AFK status / AFK-Status setzen",
  usage: ",afk [Grund]",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    const reason = args.join(" ") || "AFK";
    afkUsers.set(`${message.guildId}-${message.author.id}`, { reason, time: Date.now() });
    const embed = new EmbedBuilder()
      .setDescription(`😴 **AFK**: ${reason}`)
      .setColor(0x5865f2);
    await message.channel.send({ embeds: [embed] });
    await message.member?.setNickname(`[AFK] ${message.member.displayName}`).catch(() => {});
  },
};

export async function handleAfkMention(message: Message) {
  if (message.author.bot || !message.inGuild()) return;
  const guildId = message.guildId!;
  const L = getLang(guildId);

  // Check if message author is AFK — remove AFK
  const afkKey = `${guildId}-${message.author.id}`;
  const afk = afkUsers.get(afkKey);
  if (afk) {
    afkUsers.delete(afkKey);
    await message.member?.setNickname(message.member?.displayName?.replace(/^\[AFK\]\s/, "") ?? null).catch(() => {});
    const embed = new EmbedBuilder()
      .setDescription(`✅ **Willkommen zurück** <@${message.author.id}>!`)
      .setColor(0x57f287);
    await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(() => {});
  }

  // Check if mentions are AFK
  for (const user of message.mentions.users.values()) {
    const mentionedAfk = afkUsers.get(`${guildId}-${user.id}`);
    if (mentionedAfk) {
      const min = Math.floor((Date.now() - mentionedAfk.time) / 60000);
      const embed = new EmbedBuilder()
        .setDescription(`😴 <@${user.id}> ist **AFK**: ${mentionedAfk.reason}\n(${min} min)`)
        .setColor(0x5865f2);
      await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(() => {});
    }
  }
}
