import { Message, PermissionFlagsBits, EmbedBuilder, ChannelType, GuildChannel } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { lockdown } from "../../lib/locales/extra/lockdown";

export const lockdownCmd: PrefixCommand = {
  name: "lockdown",
  aliases: ["lock"],
  description: "Lock all channels / Alle Kanäle sperren",
  usage: ",lockdown [reason]",
  async execute(message, args) {
    const t = lockdown[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await message.reply(t.noPermission); return;
    }
    const reason = args.join(" ") || t.defaultReason;
    const guild = message.guild!;
    let locked = 0;
    for (const channel of guild.channels.cache.values()) {
      if ("permissionOverwrites" in channel && channel.type !== ChannelType.GuildCategory) {
        try {
          await (channel as GuildChannel).permissionOverwrites.edit(guild.id, {
            SendMessages: false,
            AddReactions: false,
            Connect: false,
            Speak: false,
          });
          locked++;
        } catch {}
      }
    }
    const embed = new EmbedBuilder()
      .setTitle(t.lockTitle)
      .setDescription(t.lockDesc(locked, reason))
      .setColor(0xed4245).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const unlockdownCmd: PrefixCommand = {
  name: "unlock",
  aliases: ["unlockdown", "ulock"],
  description: "Unlock all channels / Alle Kanäle entsperren",
  usage: ",unlock",
  async execute(message) {
    const t = lockdown[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await message.reply(t.noPermission); return;
    }
    const guild = message.guild!;
    let unlocked = 0;
    for (const channel of guild.channels.cache.values()) {
      if ("permissionOverwrites" in channel && channel.type !== ChannelType.GuildCategory) {
        try {
          await (channel as GuildChannel).permissionOverwrites.edit(guild.id, {
            SendMessages: null,
            AddReactions: null,
            Connect: null,
            Speak: null,
          });
          unlocked++;
        } catch {}
      }
    }
    const embed = new EmbedBuilder()
      .setTitle(t.unlockTitle)
      .setDescription(t.unlockDesc(unlocked))
      .setColor(0x57f287).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};
