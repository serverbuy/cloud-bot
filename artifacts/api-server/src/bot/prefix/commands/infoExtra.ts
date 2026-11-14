import { Message, EmbedBuilder, ChannelType } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang, getLangCode } from "../../lib/i18n";
import { infoextra } from "../../lib/locales/extra/infoextra";

export const roleInfoCmd: PrefixCommand = {
  name: "roleinfo", aliases: ["ri"], description: "Info about a role / Info über eine Rolle", usage: ",roleinfo @role",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const role = message.mentions.roles.first() ?? message.guild.roles.cache.find((r) => r.name.toLowerCase() === args.join(" ").toLowerCase());
    if (!role) { await message.reply(tr.roleNotFound); return; }
    const embed = new EmbedBuilder()
      .setTitle(`🎭 ${role.name}`)
      .setColor(role.color || 0x5865f2)
      .addFields(
        { name: "ID", value: role.id, inline: true },
        { name: tr.members, value: `${role.members.size}`, inline: true },
        { name: tr.color, value: role.hexColor, inline: true },
        { name: tr.mentionable, value: role.mentionable ? "✅" : "❌", inline: true },
        { name: tr.hoisted, value: role.hoist ? "✅" : "❌", inline: true },
        { name: tr.position, value: `${role.position}`, inline: true },
        { name: tr.created, value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: false }
      ).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const channelInfoCmd: PrefixCommand = {
  name: "channelinfo", aliases: ["ci"], description: "Info about a channel / Info über einen Kanal", usage: ",channelinfo [#channel]",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const channel = message.mentions.channels.first() ?? message.channel;
    const types: Record<number, string> = { 0: "Text", 2: "Voice", 4: "Category", 5: "Announcement", 13: "Stage", 15: "Forum" };
    const embed = new EmbedBuilder()
      .setTitle(`📺 ${"name" in channel ? channel.name : "Channel"}`)
      .setColor(0x5865f2)
      .addFields(
        { name: "ID", value: channel.id, inline: true },
        { name: tr.type, value: types[channel.type] ?? `${channel.type}`, inline: true },
        { name: tr.created, value: `<t:${Math.floor(channel.createdTimestamp! / 1000)}:R>`, inline: true }
      ).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const memberCountCmd: PrefixCommand = {
  name: "membercount", aliases: ["mc", "members"], description: "Server member count / Mitgliederzahl", usage: ",membercount",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const g = message.guild;
    const members = g.members.cache;
    const bots = members.filter((m) => m.user.bot).size;
    const humans = g.memberCount - bots;
    const embed = new EmbedBuilder()
      .setTitle(`👥 ${g.name}`)
      .setColor(0x5865f2)
      .addFields(
        { name: tr.total, value: `${g.memberCount}`, inline: true },
        { name: tr.humans, value: `${humans}`, inline: true },
        { name: "Bots", value: `${bots}`, inline: true }
      ).setThumbnail(g.iconURL()).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const serverIconCmd: PrefixCommand = {
  name: "servericon", aliases: ["icon", "guildicon"], description: "Server icon / Server-Icon", usage: ",servericon",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const url = message.guild.iconURL({ size: 1024 });
    if (!url) { await message.reply(tr.noIcon); return; }
    await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`🖼️ ${message.guild.name}`).setImage(url).setColor(0x5865f2)] });
  },
};

export const serverBannerCmd: PrefixCommand = {
  name: "serverbanner", aliases: ["banner", "guildbanner"], description: "Server banner / Server-Banner", usage: ",serverbanner",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const url = message.guild.bannerURL({ size: 1024 });
    if (!url) { await message.reply(tr.noBanner); return; }
    await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`🏞️ ${message.guild.name}`).setImage(url).setColor(0x5865f2)] });
  },
};

export const boostersCmd: PrefixCommand = {
  name: "boosters", aliases: ["boosts"], description: "Server boost info / Boost-Info", usage: ",boosters",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const g = message.guild;
    const embed = new EmbedBuilder()
      .setTitle(`🚀 ${g.name}`)
      .setColor(0xf47fff)
      .addFields(
        { name: tr.boostLevel, value: `${g.premiumTier}`, inline: true },
        { name: tr.boosts, value: `${g.premiumSubscriptionCount ?? 0}`, inline: true }
      ).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const rolesCmd: PrefixCommand = {
  name: "roles", aliases: ["rolelist"], description: "List all server roles / Alle Rollen auflisten", usage: ",roles",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const roles = message.guild.roles.cache.filter((r) => r.id !== message.guild.id).sort((a, b) => b.position - a.position).map((r) => `<@&${r.id}>`);
    const text = roles.join(" ") || tr.noRoles;
    const embed = new EmbedBuilder()
      .setTitle(`🎭 ${tr.roles} (${roles.length})`)
      .setDescription(text.slice(0, 4000)).setColor(0x5865f2).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const emojisCmd: PrefixCommand = {
  name: "emojis", aliases: ["emojilist"], description: "List all server emojis / Alle Emojis auflisten", usage: ",emojis",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const emojis = message.guild.emojis.cache.map((e) => e.toString());
    const text = emojis.join(" ") || tr.noEmojis;
    const embed = new EmbedBuilder()
      .setTitle(`😀 ${tr.emojis} (${emojis.length})`)
      .setDescription(text.slice(0, 4000)).setColor(0x5865f2).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const serverAgeCmd: PrefixCommand = {
  name: "serverage", aliases: ["age", "created"], description: "When the server was created / Server-Alter", usage: ",serverage",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const ts = Math.floor(message.guild.createdTimestamp / 1000);
    await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`📅 ${message.guild.name}`).setDescription(tr.serverAgeDesc(ts)).setColor(0x5865f2)] });
  },
};

export const inviteInfoCmd: PrefixCommand = {
  name: "inviteinfo", aliases: ["invites"], description: "Server invite count / Anzahl Einladungen", usage: ",inviteinfo",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    try {
      const invites = await message.guild.invites.fetch();
      const total = invites.reduce((acc, i) => acc + (i.uses ?? 0), 0);
      await message.channel.send({ embeds: [new EmbedBuilder().setTitle("📨 " + tr.invites).setDescription(tr.invitesDesc(invites.size, total)).setColor(0x5865f2)] });
    } catch { await message.reply(getLang(gid).common.error); }
  },
};

export const channelCountCmd: PrefixCommand = {
  name: "channelcount", aliases: ["channels"], description: "Server channel count / Anzahl Kanäle", usage: ",channelcount",
  async execute(message) {
    const gid = message.guildId!;
    const tr = infoextra[getLangCode(gid)];
    const ch = message.guild.channels.cache;
    const text = ch.filter((c) => c.type === ChannelType.GuildText).size;
    const voice = ch.filter((c) => c.type === ChannelType.GuildVoice).size;
    const cat = ch.filter((c) => c.type === ChannelType.GuildCategory).size;
    await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`📊 ${message.guild.name}`).addFields(
      { name: "💬 Text", value: `${text}`, inline: true },
      { name: "🔊 Voice", value: `${voice}`, inline: true },
      { name: tr.categories, value: `${cat}`, inline: true }
    ).setColor(0x5865f2).setTimestamp()] });
  },
};

export const infoExtraCommands: PrefixCommand[] = [
  roleInfoCmd, channelInfoCmd, memberCountCmd, serverIconCmd, serverBannerCmd,
  boostersCmd, rolesCmd, emojisCmd, serverAgeCmd, inviteInfoCmd, channelCountCmd,
];
