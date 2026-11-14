import { Message, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { autoRoleSettings } from "../../commands/autorole";
import { getLang } from "../../lib/i18n";

export const autoRoleSetCmd: PrefixCommand = {
  name: "autorole-set",
  aliases: ["autorole"],
  description: "Set auto-role / Auto-Role setzen",
  usage: ",autorole-set @role",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await message.reply(L.common.noPermission); return;
    }
    const role = message.mentions.roles.first();
    if (!role) { await message.reply(L.autoRole.noRole); return; }
    const bot = message.guild?.members.me;
    if (!bot || bot.roles.highest.position <= role.position) {
      await message.reply(L.role.tooHigh); return;
    }
    autoRoleSettings.set(message.guildId!, role.id);
    const embed = new EmbedBuilder()
      .setTitle(L.autoRole.set)
      .setDescription(L.autoRole.setInfo(role.toString()))
      .setColor(0x57f287).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const autoRoleRemoveCmd: PrefixCommand = {
  name: "autorole-remove",
  aliases: ["autorole-off"],
  description: "Disable auto-role / Auto-Role deaktivieren",
  usage: ",autorole-remove",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await message.reply(L.common.noPermission); return;
    }
    autoRoleSettings.delete(message.guildId!);
    await message.reply(L.autoRole.removed);
  },
};

export const autoRoleStatusCmd: PrefixCommand = {
  name: "autorole-status",
  description: "Show auto-role status / Auto-Role Status anzeigen",
  usage: ",autorole-status",
  async execute(message) {
    const L = getLang(message.guildId!);
    const roleId = autoRoleSettings.get(message.guildId!);
    if (!roleId) { await message.reply(L.autoRole.none); return; }
    const role = message.guild?.roles.cache.get(roleId);
    await message.reply(L.autoRole.status(role?.toString() ?? `<@&${roleId}>`));
  },
};
