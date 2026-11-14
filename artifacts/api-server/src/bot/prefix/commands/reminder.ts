import { Message, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";
import { logger } from "../../../lib/logger";

function parseDuration(str: string): number | null {
  const match = str.match(/^(\d+)(s|m|h|d)$/);
  if (!match) return null;
  const n = parseInt(match[1]!);
  const multipliers: Record<string, number> = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return n * multipliers[match[2]!]!;
}

export const reminders = new Map<string, ReturnType<typeof setTimeout>>();

export const remindCmd: PrefixCommand = {
  name: "remind",
  aliases: ["reminder", "timer"],
  description: "Set a reminder / Erinnerung setzen",
  usage: ",remind <time> <message>   e.g. ,remind 1h Hausaufgaben machen",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (args.length < 2) {
      await message.reply("❌ Beispiel: `,remind 1h Hausaufgaben machen`\nZeiten: `30s`, `5m`, `2h`, `1d`");
      return;
    }
    const duration = parseDuration(args[0]!);
    if (!duration) {
      await message.reply("❌ Ungültige Zeit. Beispiele: `30s`, `5m`, `2h`, `1d`");
      return;
    }
    const text = args.slice(1).join(" ");
    const when = Date.now() + duration;
    const s = Math.floor(duration / 1000);
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    const durStr = d > 0 ? `${d}d` : h > 0 ? `${h}h` : m > 0 ? `${m}m` : `${s}s`;

    const key = `${message.author.id}-${message.guildId}`;
    if (reminders.has(key)) clearTimeout(reminders.get(key)!);

    const timer = setTimeout(async () => {
      reminders.delete(key);
      try {
        const embed = new EmbedBuilder()
          .setTitle("⏰ Erinnerung")
          .setDescription(`⏰ **<@${message.author.id}>**, du wolltest daran erinnert werden:\n\n${text}`)
          .setColor(0xffd700).setTimestamp();
        await message.channel.send({ content: `<@${message.author.id}>`, embeds: [embed] });
      } catch (err) {
        logger.error({ err }, "Reminder failed");
      }
    }, duration);

    reminders.set(key, timer);

    const embed = new EmbedBuilder()
      .setDescription(`⏰ Erinnerung gesetzt für **<t:${Math.floor(when / 1000)}:R>**\n\n${text}`)
      .setColor(0x57f287);
    await message.channel.send({ embeds: [embed] });
  },
};
