import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { xproles } from "../../lib/locales/extra/xproles";

export const xpRoleRewards = new Map<string, Map<number, string>>();

export const xpRoleSetCmd: PrefixCommand = {
  name: "xprole",
  aliases: ["levelrole", "levelreward"],
  description: "XP-Belohnungsrollen setzen",
  usage: ",xprole add <level> @role | ,xprole list | ,xprole remove <level>",
  async execute(message, args) {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await message.reply(xproles[getLangCode(message.guildId ?? "")].noPermission); return;
    }
    const guildId = message.guildId!;
    const t = xproles[getLangCode(guildId)];
    const sub = args[0]?.toLowerCase();
    const rewards = xpRoleRewards.get(guildId) ?? new Map<number, string>();

    if (sub === "list" || !sub) {
      if (rewards.size === 0) { await message.reply(t.noRewards); return; }
      const embed = new EmbedBuilder()
        .setTitle(t.listTitle)
        .setDescription(
          Array.from(rewards.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([lvl, rid]) => t.rewardLine(lvl, rid))
            .join("\n")
        )
        .setColor(0xffd700).setTimestamp();
      await message.channel.send({ embeds: [embed] }); return;
    }

    if (sub === "add") {
      const lvl = parseInt(args[1] ?? "");
      const role = message.mentions.roles.first();
      if (isNaN(lvl) || lvl < 1 || !role) { await message.reply(t.addExample); return; }
      rewards.set(lvl, role.id);
      xpRoleRewards.set(guildId, rewards);
      await message.reply(t.added(lvl, role.toString()));
    } else if (sub === "remove") {
      const lvl = parseInt(args[1] ?? "");
      if (isNaN(lvl) || !rewards.has(lvl)) { await message.reply(t.noRewardForLevel); return; }
      rewards.delete(lvl);
      xpRoleRewards.set(guildId, rewards);
      await message.reply(t.removed(lvl));
    } else {
      await message.reply(t.usage);
    }
  },
};

const LEVEL_MILESTONES = [
  { level: 5,   name: "🌱 Neuling",       color: 0x8bc34a as number },
  { level: 10,  name: "⚡ Lehrling",      color: 0xffd700 as number },
  { level: 20,  name: "🔥 Fortgeschritten", color: 0xff8c00 as number },
  { level: 30,  name: "💎 Veteran",       color: 0x00bcd4 as number },
  { level: 50,  name: "👑 Elite",         color: 0x9c27b0 as number },
  { level: 75,  name: "🌟 Legende",       color: 0xff4444 as number },
  { level: 100, name: "⚡ Gott",          color: 0xffffff as number },
];

export const levelSetupCmd: PrefixCommand = {
  name: "levelsetup",
  aliases: ["lvlsetup", "setuplevels"],
  description: "Level-Rollen automatisch erstellen und einrichten",
  usage: ",levelsetup [create|reset|list]",
  async execute(message, args) {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await message.reply(xproles[getLangCode(message.guildId ?? "")].needManageRoles); return;
    }
    const gid = message.guildId!;
    const guild = message.guild!;
    const t = xproles[getLangCode(gid)];
    const sub = (args[0] ?? "create").toLowerCase();

    if (sub === "list") {
      const rewards = xpRoleRewards.get(gid) ?? new Map<number, string>();
      if (rewards.size === 0) {
        await message.reply(t.noLevelRoles); return;
      }
      const lines = Array.from(rewards.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([lvl, rid]) => t.rewardLine(lvl, rid));
      const embed = new EmbedBuilder()
        .setTitle(t.overviewTitle)
        .setDescription(lines.join("\n"))
        .setColor(0xffd700).setTimestamp();
      await message.channel.send({ embeds: [embed] }); return;
    }

    if (sub === "reset") {
      xpRoleRewards.delete(gid);
      await message.reply(t.reset);
      return;
    }

    // create
    const statusMsg = await message.channel.send(t.creating);
    const rewards = xpRoleRewards.get(gid) ?? new Map<number, string>();
    const created: string[] = [];
    const skipped: string[] = [];

    for (const m of LEVEL_MILESTONES) {
      if (rewards.has(m.level)) { skipped.push(t.skippedItem(m.level)); continue; }
      try {
        let role = guild.roles.cache.find((r) => r.name === m.name);
        if (!role) {
          role = await guild.roles.create({ name: m.name, color: m.color, reason: "Level Setup — Cloud Bot" });
        }
        rewards.set(m.level, role.id);
        created.push(t.createdLine(m.level, role.toString()));
      } catch {
        skipped.push(t.skippedItemError(m.level));
      }
    }

    xpRoleRewards.set(gid, rewards);

    const desc =
      (created.length > 0 ? t.createdHeader(created.join("\n")) : "") +
      (skipped.length > 0 ? t.skippedHeader(skipped.join(", ")) : "");

    const embed = new EmbedBuilder()
      .setTitle(t.setupDoneTitle)
      .setDescription(desc.trim() || t.noNewRoles)
      .addFields({
        name: t.infoFieldName,
        value: t.infoFieldValue,
      })
      .setColor(0xffd700).setTimestamp();

    await statusMsg.edit({ content: "", embeds: [embed] });
  },
};

export async function checkXpRoleRewards(guildId: string, userId: string, level: number, member: any) {
  const rewards = xpRoleRewards.get(guildId);
  if (!rewards) return;
  for (const [lvl, roleId] of rewards.entries()) {
    if (level >= lvl && !member.roles.cache.has(roleId)) {
      await member.roles.add(roleId).catch(() => {});
    }
  }
}
