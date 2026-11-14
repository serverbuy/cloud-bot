import { Message, GuildMember, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";

export const roleCmd: PrefixCommand = {
  name: "r",
  aliases: ["role"],
  description: "Give/remove roles / Rolle geben oder entfernen",
  usage: ",r add @user @role | ,r remove @user @role | ,r list @user",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await message.reply(L.role.noPermission); return;
    }
    const sub = args[0]?.toLowerCase();
    if (!sub || !["add", "remove", "list"].includes(sub)) {
      await message.reply(L.role.invalidSub); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(L.role.noTarget); return; }

    if (sub === "list") {
      const roles = target.roles.cache
        .filter((r) => r.id !== message.guildId)
        .sort((a, b) => b.position - a.position)
        .map((r) => r.toString()).slice(0, 15).join(", ") || L.role.noRoles;
      const embed = new EmbedBuilder()
        .setTitle(L.role.listTitle(target.displayName))
        .setDescription(roles)
        .setThumbnail(target.user.displayAvatarURL())
        .setColor(0x5865f2).setTimestamp();
      await message.channel.send({ embeds: [embed] }); return;
    }

    const role = message.mentions.roles.first();
    if (!role) { await message.reply(L.role.noRole(sub)); return; }
    const bot = message.guild?.members.me;
    if (!bot || bot.roles.highest.position <= role.position) {
      await message.reply(L.role.tooHigh); return;
    }

    if (sub === "add") {
      await target.roles.add(role);
      await message.reply(L.role.added(role.toString(), target.displayName));
    } else {
      await target.roles.remove(role);
      await message.reply(L.role.removed(role.toString(), target.displayName));
    }
  },
};

export const roleAddCmd: PrefixCommand = {
  name: "r-add",
  aliases: ["radd"],
  description: "Give a role / Rolle geben",
  usage: ",r-add @user @role",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await message.reply(L.role.noPermission); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    const role = message.mentions.roles.first();
    if (!target || !role) { await message.reply(L.role.noRole("add")); return; }
    const bot = message.guild?.members.me;
    if (!bot || bot.roles.highest.position <= role.position) {
      await message.reply(L.role.tooHigh); return;
    }
    await target.roles.add(role);
    await message.reply(L.role.added(role.toString(), target.displayName));
  },
};

export const roleRemoveCmd: PrefixCommand = {
  name: "r-remove",
  aliases: ["rremove", "rrem"],
  description: "Remove a role / Rolle entfernen",
  usage: ",r-remove @user @role",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await message.reply(L.role.noPermission); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    const role = message.mentions.roles.first();
    if (!target || !role) { await message.reply(L.role.noRole("remove")); return; }
    await target.roles.remove(role);
    await message.reply(L.role.removed(role.toString(), target.displayName));
  },
};

export const roleListCmd: PrefixCommand = {
  name: "r-list",
  aliases: ["rlist"],
  description: "Show member roles / Rollen anzeigen",
  usage: ",r-list @user",
  async execute(message) {
    const L = getLang(message.guildId!);
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(L.role.noTarget); return; }
    const roles = target.roles.cache
      .filter((r) => r.id !== message.guildId)
      .sort((a, b) => b.position - a.position)
      .map((r) => r.toString()).join(", ") || L.role.noRoles;
    const embed = new EmbedBuilder()
      .setTitle(L.role.listTitle(target.displayName))
      .setDescription(roles)
      .setThumbnail(target.user.displayAvatarURL())
      .setColor(0x5865f2).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};
