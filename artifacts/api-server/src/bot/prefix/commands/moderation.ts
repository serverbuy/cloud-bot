import { Message, EmbedBuilder, GuildMember, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import { sendModLog } from "../../lib/modLog";
import { getLang } from "../../lib/i18n";

export const kickCmd: PrefixCommand = {
  name: "kick",
  description: "Kick a member / Mitglied kicken",
  usage: ",kick @user [reason]",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.KickMembers)) {
      await message.reply(L.common.noPermission); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(L.common.noTarget); return; }
    if (!target.kickable) { await message.reply(L.mod.kick.notKickable); return; }
    const reason = args.slice(1).join(" ") || L.common.noReason;
    await target.kick(reason);
    const embed = new EmbedBuilder().setTitle(L.mod.kick.title)
      .addFields(
        { name: L.mod.fields.member, value: `${target.user}`, inline: true },
        { name: L.mod.fields.moderator, value: `${message.author}`, inline: true },
        { name: L.mod.fields.reason, value: reason }
      ).setColor(0xfee75c).setTimestamp();
    await message.channel.send({ embeds: [embed] });
    await sendModLog(message.guild!, { action: L.mod.kick.title, emoji: "👢", color: 0xfee75c, target: { id: target.id, username: target.user.username, avatarURL: target.user.displayAvatarURL() }, moderator: { id: message.author.id, username: message.author.username }, reason });
    try { await target.send(L.mod.kick.dm(message.guild!.name, reason)); } catch { }
  },
};

export const banCmd: PrefixCommand = {
  name: "ban",
  description: "Ban a member / Mitglied bannen",
  usage: ",ban @user [reason]",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) {
      await message.reply(L.common.noPermission); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(L.common.noTarget); return; }
    if (!target.bannable) { await message.reply(L.mod.ban.notBannable); return; }
    const reason = args.slice(1).join(" ") || L.common.noReason;
    try { await target.send(L.mod.ban.dm(message.guild!.name, reason)); } catch { }
    await target.ban({ reason });
    const embed = new EmbedBuilder().setTitle(L.mod.ban.title)
      .addFields(
        { name: L.mod.fields.member, value: `${target.user}`, inline: true },
        { name: L.mod.fields.moderator, value: `${message.author}`, inline: true },
        { name: L.mod.fields.reason, value: reason }
      ).setColor(0xed4245).setTimestamp();
    await message.channel.send({ embeds: [embed] });
    await sendModLog(message.guild!, { action: L.mod.ban.title, emoji: "🔨", color: 0xed4245, target: { id: target.id, username: target.user.username, avatarURL: target.user.displayAvatarURL() }, moderator: { id: message.author.id, username: message.author.username }, reason });
  },
};

export const unbanCmd: PrefixCommand = {
  name: "unban",
  description: "Unban a user / Mitglied entbannen",
  usage: ",unban <user-id>",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.BanMembers)) {
      await message.reply(L.common.noPermission); return;
    }
    const userId = args[0];
    if (!userId) { await message.reply(L.mod.unban.noId); return; }
    try {
      const unbanned = await message.guild!.members.unban(userId);
      const uname = unbanned?.username ?? userId;
      await message.reply(L.mod.unban.success(uname));
      await sendModLog(message.guild!, { action: "Unban", emoji: "🔓", color: 0x57f287, target: { id: userId, username: uname }, moderator: { id: message.author.id, username: message.author.username } });
    } catch {
      await message.reply(L.mod.unban.notFound);
    }
  },
};

export const timeoutCmd: PrefixCommand = {
  name: "timeout",
  aliases: ["mute"],
  description: "Timeout a member / Mitglied timeoutten",
  usage: ",timeout @user <minutes> [reason]",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply(L.common.noPermission); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(L.mod.timeout.usage); return; }
    const minutes = parseInt(args[1] ?? "");
    if (isNaN(minutes)) { await message.reply(L.mod.timeout.noNumber); return; }
    const reason = args.slice(2).join(" ") || L.common.noReason;
    if (minutes === 0) {
      await target.timeout(null);
      await message.reply(L.mod.timeout.removed(`${target}`));
      await sendModLog(message.guild!, { action: "Timeout removed", emoji: "🔊", color: 0x57f287, target: { id: target.id, username: target.user.username }, moderator: { id: message.author.id, username: message.author.username } });
    } else {
      await target.timeout(minutes * 60 * 1000, reason);
      const embed = new EmbedBuilder().setTitle(L.mod.timeout.title)
        .addFields(
          { name: L.mod.fields.member, value: `${target.user}`, inline: true },
          { name: L.mod.fields.duration, value: `${minutes}min`, inline: true },
          { name: L.mod.fields.reason, value: reason }
        ).setColor(0xffa500).setTimestamp();
      await message.channel.send({ embeds: [embed] });
      await sendModLog(message.guild!, { action: L.mod.timeout.title, emoji: "🔇", color: 0xffa500, target: { id: target.id, username: target.user.username, avatarURL: target.user.displayAvatarURL() }, moderator: { id: message.author.id, username: message.author.username }, reason, duration: `${minutes}min` });
    }
  },
};

export const purgeCmd: PrefixCommand = {
  name: "purge",
  aliases: ["clear"],
  description: "Delete messages / Nachrichten löschen",
  usage: ",purge <amount> [@user]",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
      await message.reply(L.common.noPermission); return;
    }
    const amount = parseInt(args[0] ?? "");
    if (isNaN(amount) || amount < 1 || amount > 100) {
      await message.reply(L.mod.purge.usage); return;
    }
    const targetUser = message.mentions.users.first();
    const messages = await message.channel.messages.fetch({ limit: amount + 1 });
    const toDelete = targetUser ? messages.filter((m) => m.author.id === targetUser.id) : messages;
    const deleted = await (message.channel as any).bulkDelete(toDelete, true);
    const reply = await message.channel.send(L.mod.purge.success(deleted.size));
    setTimeout(() => reply.delete().catch(() => {}), 3000);
    await sendModLog(message.guild!, { action: "Purge", emoji: "🧹", color: 0x5865f2, moderator: { id: message.author.id, username: message.author.username }, extra: { "🗑️": `${deleted.size}`, "📢": `<#${message.channelId}>` } });
  },
};

export const warnCmd: PrefixCommand = {
  name: "warn",
  description: "Warn a member / Mitglied verwarnen",
  usage: ",warn @user <reason>",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply(L.common.noPermission); return;
    }
    const target = message.mentions.users.first();
    if (!target) { await message.reply(L.common.noTarget); return; }
    const reason = args.slice(1).join(" ");
    if (!reason) { await message.reply(L.mod.warn.noReason); return; }
    const embed = new EmbedBuilder().setTitle(L.mod.warn.title)
      .addFields(
        { name: L.mod.fields.member, value: `${target}`, inline: true },
        { name: L.mod.fields.moderator, value: `${message.author}`, inline: true },
        { name: L.mod.fields.reason, value: reason }
      ).setColor(0xfee75c).setTimestamp();
    await message.channel.send({ embeds: [embed] });
    await sendModLog(message.guild!, { action: L.mod.warn.title, emoji: "⚠️", color: 0xfee75c, target: { id: target.id, username: target.username, avatarURL: target.displayAvatarURL() }, moderator: { id: message.author.id, username: message.author.username }, reason });
    try { await target.send(L.mod.warn.dm(message.guild?.name ?? "", reason)); } catch { }
  },
};
