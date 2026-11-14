import { Message, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";

const SLOTS_EMOJIS = ["🍒", "🍋", "🍇", "🍊", "🍉", "💎", "🎰"];

export const slotsCmd: PrefixCommand = {
  name: "slots",
  aliases: ["slot", "slotmachine"],
  description: "Play slots / Slot-Machine spielen",
  usage: ",slots",
  async execute(message) {
    const L = getLang(message.guildId!);
    const spin = () => SLOTS_EMOJIS[Math.floor(Math.random() * SLOTS_EMOJIS.length)]!;
    const rows = [
      [spin(), spin(), spin()],
      [spin(), spin(), spin()],
      [spin(), spin(), spin()],
    ];

    const centerRow = rows[1]!;
    let result = "😔 **Kein Gewinn**";
    let color = 0xed4245;

    // All 3 same
    if (centerRow[0] === centerRow[1] && centerRow[1] === centerRow[2]) {
      if (centerRow[0] === "💎") {
        result = "💎 **JACKPOT!** 🎉🎉🎉";
        color = 0xffd700;
      } else {
        result = "🎉 **Gewinn!** 3 in einer Reihe!";
        color = 0x57f287;
      }
    }
    // 2 in a row
    else if (centerRow[0] === centerRow[1] || centerRow[1] === centerRow[2]) {
      result = "✅ **Kleiner Gewinn!** 2 in einer Reihe!";
      color = 0xfee75c;
    }

    const display = rows.map((r) => "│ " + r.join(" ") + " │").join("\n");
    const embed = new EmbedBuilder()
      .setTitle("🎰 Slots")
      .setDescription(display)
      .addFields({ name: "👀 Ergebnis", value: result, inline: true })
      .setColor(color).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};
