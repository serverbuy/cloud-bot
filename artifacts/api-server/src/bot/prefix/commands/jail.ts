import { Message, PermissionFlagsBits, EmbedBuilder, GuildMember, Role } from "discord.js";
import type { PrefixCommand } from "../types";
import { sendModLog } from "../../lib/modLog";
import { getLang } from "../../lib/i18n";
import { logger } from "../../../lib/logger";

const JAIL_ROLE_NAME = "🔒 Jailed";

async function getOrCreateJailRole(message: Message<true>): Promise<Role | null> {
  const guild = message.guild;
  let role = guild.roles.cache.find((r) => r.name === JAIL_ROLE_NAME);
  if (!role) {
    role = await guild.roles.create({ name: JAIL_ROLE_NAME, color: 0x808080, reason: "Jail system role", permissions: [] });
    for (const channel of guild.channels.cache.values()) {
      if ("permissionOverwrites" in channel) {
        await (channel as any).permissionOverwrites.create(role, {
          SendMessages: false, AddReactions: false, Connect: false, Speak: false, SendMessagesInThreads: false,
        }).catch(() => {});
      }
    }
    logger.info({ roleId: role.id }, "Created jail role");
  }
  return role;
}

export const jailCmd: PrefixCommand = {
  name: "jail",
  description: "Jail a member / Mitglied jaillen",
  usage: ",jail @user [reason]",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply(L.common.noPermission); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(L.common.noTarget); return; }
    if (target.id === message.author.id) { await message.reply(L.common.selfTarget); return; }
    if (!target.manageable) { await message.reply(L.common.notKickable); return; }
    const reason = args.slice(1).join(" ") || L.common.noReason;
    const loading = await message.channel.send(L.jail.loading);
    try {
      const jailRole = await getOrCreateJailRole(message);
      if (!jailRole) { await loading.edit(L.common.error); return; }
      await target.roles.add(jailRole, reason);
      const embed = new EmbedBuilder().setTitle(L.jail.title).setThumbnail(target.user.displayAvatarURL())
        .addFields(
          { name: L.jail.fields.member, value: `${target}`, inline: true },
          { name: L.jail.fields.moderator, value: `${message.author}`, inline: true },
          { name: L.jail.fields.reason, value: reason }
        ).setColor(0x808080).setFooter({ text: L.jail.footer }).setTimestamp();
      await loading.edit({ content: "", embeds: [embed] });
      await sendModLog(message.guild!, { action: L.jail.title, emoji: "🔒", color: 0x808080, target: { id: target.id, username: target.user.username, avatarURL: target.user.displayAvatarURL() }, moderator: { id: message.author.id, username: message.author.username }, reason });
      try { await target.send(L.jail.dm(message.guild.name, reason)); } catch { }
    } catch (err) {
      logger.error({ err }, "Failed to jail member");
      await loading.edit(L.jail.error);
    }
  },
};

export const unjailCmd: PrefixCommand = {
  name: "unjail",
  description: "Unjail a member / Mitglied entjaillen",
  usage: ",unjail @user",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply(L.common.noPermission); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(L.common.noTarget); return; }
    const jailRole = message.guild.roles.cache.find((r) => r.name === JAIL_ROLE_NAME);
    if (!jailRole) { await message.reply(L.jail.noRole); return; }
    if (!target.roles.cache.has(jailRole.id)) { await message.reply(L.jail.notJailed(`${target}`)); return; }
    await target.roles.remove(jailRole);
    const embed = new EmbedBuilder().setTitle(L.jail.unjailTitle)
      .addFields(
        { name: L.jail.fields.member, value: `${target}`, inline: true },
        { name: L.jail.fields.moderator, value: `${message.author}`, inline: true }
      ).setColor(0x57f287).setTimestamp();
    await message.channel.send({ embeds: [embed] });
    await sendModLog(message.guild!, { action: L.jail.unjailTitle, emoji: "🔓", color: 0x57f287, target: { id: target.id, username: target.user.username }, moderator: { id: message.author.id, username: message.author.username } });
    try { await target.send(L.jail.dmUnjail(message.guild.name)); } catch { }
  },
};
