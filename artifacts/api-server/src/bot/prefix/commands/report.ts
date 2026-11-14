import { Message, EmbedBuilder, ChannelType, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { report } from "../../lib/locales/extra/report";

export const reportCmd: PrefixCommand = {
  name: "report",
  aliases: ["melden", "reportuser"],
  description: "Report a user / Nutzer melden",
  usage: ",report @user <reason>",
  async execute(message, args) {
    const t = report[getLangCode(message.guildId ?? "")];
    const target = message.mentions.users.first();
    if (!target) { await message.reply(t.noUser); return; }
    const reason = args.slice(1).join(" ");
    if (!reason) { await message.reply(t.noReason); return; }

    const guild = message.guild!;
    // Find mod-log or report channel
    const modLog = guild.channels.cache.find((c) =>
      c.type === ChannelType.GuildText &&
      (c.name.includes("mod-log") || c.name.includes("reports"))
    );
    if (!modLog) {
      await message.reply(t.noChannel);
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle(t.embedTitle)
      .addFields(
        { name: t.fieldTarget, value: `${target} (${target.id})`, inline: true },
        { name: t.fieldReportedBy, value: `${message.author}`, inline: true },
        { name: t.fieldChannel, value: `<#${message.channelId}>`, inline: true },
        { name: t.fieldReason, value: reason }
      ).setColor(0xffa500).setTimestamp();

    await (modLog as any).send({ embeds: [embed] });
    const reply = await message.reply(t.sent);
    await message.delete().catch(() => {});
    setTimeout(() => reply.delete().catch(() => {}), 5000);
  },
};

export const reportBanCmd: PrefixCommand = {
  name: "reportban",
  aliases: ["rb"],
  description: "Ban user from reports / Nutzer bannen (aus Reports)",
  usage: ",reportban @user [reason]",
  async execute(message, args) {
    const t = report[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) {
      await message.reply(t.noPermission); return;
    }
    const target = message.mentions.members?.first();
    if (!target) { await message.reply(t.noMember); return; }
    const reason = args.slice(1).join(" ") || t.defaultReason;
    await target.ban({ reason });
    await message.reply(t.banned(`${target}`, reason));
  },
};
