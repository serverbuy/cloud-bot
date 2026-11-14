import { Message, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";

export const embedCmd: PrefixCommand = {
  name: "embed",
  aliases: ["customembed"],
  description: "Post a custom embed / Benutzerdefinierte Embed senden",
  usage: ",embed <titel> | <beschreibung> | [farbe] | [footer]",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
      await message.reply(L.common.noPermission); return;
    }
    const text = args.join(" ");
    if (!text.includes("|")) {
      await message.reply("❌ Beispiel: `,embed Willkommen | Dies ist der Willkommenstext | #5865f2 | Powered by Cloud`");
      return;
    }
    const parts = text.split("|").map((s) => s.trim()).filter(Boolean);
    if (parts.length < 2) {
      await message.reply("❌ Mindestens Titel und Beschreibung benötigt.");
      return;
    }
    const [title, desc, colorStr, footer] = [parts[0]!, parts[1]!, parts[2] ?? null, parts[3] ?? null];
    let color = 0x5865f2;
    if (colorStr) {
      const parsed = colorStr.startsWith("#") ? parseInt(colorStr.replace("#", ""), 16) : parseInt(colorStr, 16);
      if (!isNaN(parsed)) color = parsed;
    }
    const embed = new EmbedBuilder().setTitle(title).setDescription(desc).setColor(color).setTimestamp();
    if (footer) embed.setFooter({ text: footer });
    await message.channel.send({ embeds: [embed] });
    await message.delete().catch(() => {});
  },
};
