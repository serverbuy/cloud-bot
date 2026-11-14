import { Message, PermissionFlagsBits, EmbedBuilder, ChannelType } from "discord.js";
import type { PrefixCommand } from "../types";
import { modLogChannels } from "../../lib/modLog";
import { getLang } from "../../lib/i18n";

export const logSetupCmd: PrefixCommand = {
  name: "logsetup",
  aliases: ["setlog", "modlog"],
  description: "Set mod-log channel / Mod-Log Kanal setzen",
  usage: ",logsetup #channel",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await message.reply(L.common.noPermission); return;
    }
    const channel = message.mentions.channels.first();
    if (!channel || channel.type !== ChannelType.GuildText) {
      await message.reply(L.log.noChannel); return;
    }
    modLogChannels.set(message.guildId!, channel.id);
    const embed = new EmbedBuilder()
      .setTitle(L.log.setup)
      .setDescription(L.log.setupDesc(channel.toString()))
      .setColor(0x57f287).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const logRemoveCmd: PrefixCommand = {
  name: "logremove",
  description: "Disable mod-log / Mod-Log deaktivieren",
  usage: ",logremove",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await message.reply(L.common.noPermission); return;
    }
    modLogChannels.delete(message.guildId!);
    await message.reply(L.log.removed);
  },
};
