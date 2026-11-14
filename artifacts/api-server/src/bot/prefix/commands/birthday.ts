import { Message, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { birthday } from "../../lib/locales/extra/birthday";

const birthdays = new Map<string, string>(); // userId → "MM-DD"

export const birthdaySetCmd: PrefixCommand = {
  name: "birthday",
  aliases: ["bday", "geburtstag"],
  description: "Set your birthday / Geburtstag eintragen",
  usage: ",birthday <MM-DD>  e.g. ,birthday 12-31",
  async execute(message, args) {
    const t = birthday[getLangCode(message.guildId ?? "")];
    const input = args[0];
    if (!input || !/^\d{2}-\d{2}$/.test(input)) {
      await message.reply(t.formatError);
      return;
    }
    const [m, d] = input.split("-").map(Number);
    if (m! < 1 || m! > 12 || d! < 1 || d! > 31) {
      await message.reply(t.invalidDate);
      return;
    }
    birthdays.set(message.author.id, input);
    const embed = new EmbedBuilder()
      .setDescription(t.birthdaySet(input))
      .setColor(0xff69b4);
    await message.channel.send({ embeds: [embed] });
  },
};

export const birthdayListCmd: PrefixCommand = {
  name: "birthdays",
  aliases: ["bdaylist", "geburtstagliste"],
  description: "List all birthdays / Alle Geburtstage anzeigen",
  usage: ",birthdays",
  async execute(message) {
    const t = birthday[getLangCode(message.guildId ?? "")];
    if (birthdays.size === 0) { await message.reply(t.noBirthdays); return; }
    const now = new Date();
    const today = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const lines = Array.from(birthdays.entries()).map(([uid, date]) => {
      const isToday = date === today;
      return `${isToday ? "🎂" : "📅"} <@${uid}> — **${date}**${isToday ? t.todayLabel : ""}`;
    });
    const embed = new EmbedBuilder()
      .setTitle(t.listTitle)
      .setDescription(lines.join("\n"))
      .setColor(0xff69b4).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export async function checkBirthdays(guild: any) {
  const t = birthday[getLangCode(guild?.id ?? "")];
  const now = new Date();
  const today = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  for (const [uid, date] of birthdays.entries()) {
    if (date === today) {
      const sysCh = guild.systemChannel;
      if (sysCh) {
        const embed = new EmbedBuilder()
          .setTitle(t.congratsTitle)
          .setDescription(t.congratsDesc(uid))
          .setColor(0xff69b4).setTimestamp();
        await sysCh.send({ embeds: [embed] }).catch(() => {});
      }
    }
  }
}
