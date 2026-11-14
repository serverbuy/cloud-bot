import { EmbedBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import type { PrefixCommand } from "../types";
import { welcomeSettings } from "../../handlers/welcome";
import { getLangCode } from "../../lib/i18n";
import { setwelcome } from "../../lib/locales/extra/setwelcome";

export const setWelcomeCmd: PrefixCommand = {
  name: "setwelcome",
  aliases: ["welcomeset"],
  description: "Configure welcome channel / Willkommens-Kanal konfigurieren",
  usage: ",setwelcome #kanal [text] | ,setwelcome off | ,setwelcome status",
  async execute(message, args) {
    const t = setwelcome[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await message.reply(t.noPermission); return;
    }
    const gid = message.guildId!;
    const sub = args[0]?.toLowerCase();

    if (sub === "off" || sub === "disable" || sub === "aus") {
      welcomeSettings.delete(gid);
      await message.reply(t.disabled);
      return;
    }

    if (sub === "status") {
      const cfg = welcomeSettings.get(gid);
      if (!cfg) { await message.reply(t.notConfigured); return; }
      const ch = message.guild?.channels.cache.get(cfg.channelId);
      const embed = new EmbedBuilder()
        .setTitle(t.statusTitle)
        .addFields(
          { name: t.channelField, value: ch ? ch.toString() : `<#${cfg.channelId}>`, inline: true },
          { name: t.textField, value: cfg.text ?? t.textDefault, inline: false },
        )
        .setColor(0x57f287).setTimestamp();
      await message.channel.send({ embeds: [embed] });
      return;
    }

    const channel = message.mentions.channels.first()
      ?? message.guild?.channels.cache.find(
        (c) => c.type === ChannelType.GuildText && args[0] && c.name.includes(args[0].replace("#", ""))
      );

    if (!channel || !channel.isTextBased()) {
      await message.reply(t.markChannel); return;
    }

    const customText = args.slice(1).join(" ") || undefined;
    welcomeSettings.set(gid, { channelId: channel.id, text: customText });

    const embed = new EmbedBuilder()
      .setTitle(t.activatedTitle)
      .setDescription(
        t.activatedDesc(channel.toString()) +
        (customText
          ? t.customText(customText)
          : t.defaultText)
      )
      .setColor(0x57f287).setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
