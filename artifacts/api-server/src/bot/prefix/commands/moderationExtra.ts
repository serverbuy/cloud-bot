import { Message, EmbedBuilder, PermissionFlagsBits, ChannelType, TextChannel } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang, getLangCode } from "../../lib/i18n";
import { moderationextra } from "../../lib/locales/extra/moderationextra";

function noPerm(message: Message<true>, flag: bigint): boolean {
  return !message.member?.permissions.has(flag);
}

export const slowmodeCmd: PrefixCommand = {
  name: "slowmode", aliases: ["slow"], description: "Set channel slowmode / Slowmode setzen", usage: ",slowmode <seconds>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageChannels)) { await message.reply(getLang(gid).common.noPermission); return; }
    const seconds = Math.min(Math.max(parseInt(args[0] ?? "0") || 0, 0), 21600);
    if (message.channel.type !== ChannelType.GuildText) { await message.reply("❌"); return; }
    await message.channel.setRateLimitPerUser(seconds);
    await message.reply(seconds === 0 ? tr.slowmodeDisabled : tr.slowmodeSet(seconds));
  },
};

export const nickCmd: PrefixCommand = {
  name: "nick", aliases: ["setnick", "nickname"], description: "Change a member's nickname / Spitzname ändern", usage: ",nick @user <name>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageNicknames)) { await message.reply(getLang(gid).common.noPermission); return; }
    const member = message.mentions.members?.first();
    if (!member) { await message.reply(getLang(gid).common.noTarget); return; }
    const name = args.slice(1).join(" ") || null;
    try {
      await member.setNickname(name);
      await message.reply(name ? tr.nickChanged(name) : tr.nickReset);
    } catch { await message.reply(getLang(gid).common.error); }
  },
};

export const lockCmd: PrefixCommand = {
  name: "lockchannel", aliases: ["lockch", "sperren"], description: "Lock the current channel / Kanal sperren", usage: ",lockchannel",
  async execute(message) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageChannels)) { await message.reply(getLang(gid).common.noPermission); return; }
    if (message.channel.type !== ChannelType.GuildText) { await message.reply("❌"); return; }
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
    await message.reply(tr.channelLocked);
  },
};

export const unlockCmd: PrefixCommand = {
  name: "unlockchannel", aliases: ["unlockch", "entsperren"], description: "Unlock the current channel / Kanal entsperren", usage: ",unlockchannel",
  async execute(message) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageChannels)) { await message.reply(getLang(gid).common.noPermission); return; }
    if (message.channel.type !== ChannelType.GuildText) { await message.reply("❌"); return; }
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
    await message.reply(tr.channelUnlocked);
  },
};

export const hideCmd: PrefixCommand = {
  name: "hide", description: "Hide the current channel / Kanal verstecken", usage: ",hide",
  async execute(message) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageChannels)) { await message.reply(getLang(gid).common.noPermission); return; }
    if (message.channel.type !== ChannelType.GuildText) { await message.reply("❌"); return; }
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { ViewChannel: false });
    await message.reply(tr.channelHidden);
  },
};

export const unhideCmd: PrefixCommand = {
  name: "unhide", description: "Reveal the current channel / Kanal sichtbar machen", usage: ",unhide",
  async execute(message) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageChannels)) { await message.reply(getLang(gid).common.noPermission); return; }
    if (message.channel.type !== ChannelType.GuildText) { await message.reply("❌"); return; }
    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { ViewChannel: null });
    await message.reply(tr.channelRevealed);
  },
};

export const announceCmd: PrefixCommand = {
  name: "announce", aliases: ["ankündigung"], description: "Make an announcement / Ankündigung machen", usage: ",announce <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageMessages)) { await message.reply(getLang(gid).common.noPermission); return; }
    const text = args.join(" ");
    if (!text) { await message.reply(tr.provideMessage); return; }
    const embed = new EmbedBuilder().setTitle("📢 " + tr.announcement).setDescription(text).setColor(0x5865f2).setFooter({ text: message.author.username }).setTimestamp();
    await message.delete().catch(() => {});
    await message.channel.send({ embeds: [embed] });
  },
};

export const dmCmd: PrefixCommand = {
  name: "dm", description: "DM a member / Mitglied anschreiben", usage: ",dm @user <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageMessages)) { await message.reply(getLang(gid).common.noPermission); return; }
    const member = message.mentions.members?.first();
    if (!member) { await message.reply(getLang(gid).common.noTarget); return; }
    const text = args.slice(1).join(" ");
    if (!text) { await message.reply(tr.provideMessage); return; }
    const embed = new EmbedBuilder().setTitle(`📬 ${message.guild.name}`).setDescription(text).setColor(0x5865f2).setTimestamp();
    try { await member.send({ embeds: [embed] }); await message.reply(tr.messageSent); }
    catch { await message.reply(tr.dmFailed); }
  },
};

export const roleAllCmd: PrefixCommand = {
  name: "addemoji", aliases: ["stealemoji"], description: "Add an emoji from another server / Emoji hinzufügen", usage: ",addemoji <emoji> [name]",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageGuildExpressions)) { await message.reply(getLang(gid).common.noPermission); return; }
    const match = args[0]?.match(/<(a?):(\w+):(\d+)>/);
    if (!match) { await message.reply(tr.provideEmoji); return; }
    const animated = match[1] === "a";
    const name = args[1] ?? match[2]!;
    const url = `https://cdn.discordapp.com/emojis/${match[3]}.${animated ? "gif" : "png"}`;
    try {
      const emoji = await message.guild.emojis.create({ attachment: url, name });
      await message.reply(tr.emojiAdded(String(emoji)));
    } catch { await message.reply(getLang(gid).common.error); }
  },
};

export const nukeCmd: PrefixCommand = {
  name: "nuke", description: "Clone & clear the channel / Kanal klonen & leeren", usage: ",nuke",
  async execute(message) {
    const gid = message.guildId!;
    const tr = moderationextra[getLangCode(gid)];
    if (noPerm(message, PermissionFlagsBits.ManageChannels)) { await message.reply(getLang(gid).common.noPermission); return; }
    const channel = message.channel;
    if (channel.type !== ChannelType.GuildText) { await message.reply("❌"); return; }
    const position = channel.position;
    const clone = await channel.clone();
    await channel.delete().catch(() => {});
    await clone.setPosition(position);
    await (clone as TextChannel).send(tr.channelNuked);
  },
};

export const moderationExtraCommands: PrefixCommand[] = [
  slowmodeCmd, nickCmd, lockCmd, unlockCmd, hideCmd, unhideCmd,
  announceCmd, dmCmd, roleAllCmd, nukeCmd,
];
