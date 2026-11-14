import { Message, PermissionFlagsBits, EmbedBuilder, ChannelType } from "discord.js";
import type { PrefixCommand } from "../types";
import { vcCreateChannels } from "../../handlers/vcCreate";
import { getLang } from "../../lib/i18n";

export const vcSetupSetCmd: PrefixCommand = {
  name: "vc-setup",
  aliases: ["vcsetup"],
  description: "Set Join-to-Create channel / Join-to-Create Kanal setzen",
  usage: ",vc-setup <channel-id>",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await message.reply(L.common.noPermission); return;
    }
    const channelId = args[0] ?? message.mentions.channels.first()?.id;
    if (!channelId) { await message.reply(L.vc.setupNoId); return; }
    const channel = message.guild?.channels.cache.get(channelId);
    if (!channel) { await message.reply(L.vc.setupNotFound); return; }
    if (channel.type !== ChannelType.GuildVoice) { await message.reply(L.vc.setupNotVoice); return; }
    vcCreateChannels.set(message.guildId!, channelId);
    const embed = new EmbedBuilder()
      .setTitle(L.vc.setupSet)
      .setDescription(L.vc.setupInfo(channelId))
      .setColor(0x57f287).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const vcSetupRemoveCmd: PrefixCommand = {
  name: "vc-remove",
  aliases: ["vcremove"],
  description: "Disable VC system / VC-Create deaktivieren",
  usage: ",vc-remove",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await message.reply(L.common.noPermission); return;
    }
    vcCreateChannels.delete(message.guildId!);
    await message.reply(L.vc.setupRemoved);
  },
};

export const vcSetupStatusCmd: PrefixCommand = {
  name: "vc-status",
  aliases: ["vcstatus"],
  description: "Show VC status / VC-Status anzeigen",
  usage: ",vc-status",
  async execute(message) {
    const L = getLang(message.guildId!);
    const channelId = vcCreateChannels.get(message.guildId!);
    if (!channelId) { await message.reply(L.vc.setupNone); return; }
    await message.reply(L.vc.setupStatus(channelId));
  },
};
