import { Message, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { botstats } from "../../lib/locales/extra/botstats";

const commandUsage = new Map<string, number>();

export function trackCommand(commandName: string) {
  commandUsage.set(commandName, (commandUsage.get(commandName) ?? 0) + 1);
}

export const botStatsCmd: PrefixCommand = {
  name: "stats",
  aliases: ["botstats", "commandstats"],
  description: "Show bot stats / Bot-Nutzungsstatistiken",
  usage: ",stats",
  async execute(message) {
    const t = botstats[getLangCode(message.guildId ?? "")];
    const total = Array.from(commandUsage.values()).reduce((a, b) => a + b, 0);
    const sorted = Array.from(commandUsage.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const lines = sorted.length === 0
      ? t.noData
      : sorted.map(([cmd, count]) => t.usageLine(cmd, count)).join("\n");
    const embed = new EmbedBuilder()
      .setTitle(t.title)
      .addFields(
        { name: t.totalField, value: `${total}`, inline: true },
        { name: t.uniqueField, value: `${commandUsage.size}`, inline: true },
        { name: t.topField, value: lines }
      ).setColor(0x5865f2).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};
