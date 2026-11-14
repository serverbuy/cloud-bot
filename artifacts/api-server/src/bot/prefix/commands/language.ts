import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import { guildLanguages, getLang, LANG_NAMES, type Lang } from "../../lib/i18n";

const SUPPORTED: Lang[] = ["en", "de", "sv", "nl", "ar"];

export const languageCmd: PrefixCommand = {
  name: "language",
  aliases: ["lang", "sprache"],
  description: "Bot language / Bot-Sprache ändern",
  usage: ",language <en|de|sv|nl|ar>",
  async execute(message, args) {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      const L = getLang(message.guildId!);
      await message.reply(L.language.noPermission);
      return;
    }

    const input = args[0]?.toLowerCase();
    const guildId = message.guildId!;
    const L = getLang(guildId);

    if (!input) {
      const embed = new EmbedBuilder()
        .setTitle("🌐 Language / Sprache")
        .setDescription(
          `${L.language.current(LANG_NAMES[guildLanguages.get(guildId) ?? "en"])}\n\n${L.language.usage}`
        )
        .setColor(0x5865f2)
        .setTimestamp();
      await message.channel.send({ embeds: [embed] });
      return;
    }

    if (!SUPPORTED.includes(input as Lang)) {
      await message.reply(L.language.invalid);
      return;
    }

    guildLanguages.set(guildId, input as Lang);
    const newL = getLang(guildId);

    const embed = new EmbedBuilder()
      .setTitle("🌐 Language / Sprache")
      .setDescription(newL.language.changed(LANG_NAMES[input as Lang]))
      .setColor(0x57f287)
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};
