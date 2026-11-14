import { Message, EmbedBuilder, GuildMember } from "discord.js";
import type { PrefixCommand } from "../types";
import { PREFIX } from "../handler";
import { getLang } from "../../lib/i18n";

export const userinfoCmd: PrefixCommand = {
  name: "userinfo",
  aliases: ["ui", "whois"],
  description: "Show user info / Nutzer-Informationen anzeigen",
  usage: ",userinfo [@user]",
  async execute(message) {
    const L = getLang(message.guildId!);
    const target = (message.mentions.members?.first() as GuildMember | undefined) ?? (message.member as GuildMember);
    const user = target.user;
    const roles = target.roles.cache
      .filter((r) => r.id !== message.guildId)
      .sort((a, b) => b.position - a.position)
      .map((r) => r.toString()).slice(0, 10).join(", ") || L.info.userFields.roles;
    const embed = new EmbedBuilder()
      .setTitle(`👤 ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ size: 256 }))
      .addFields(
        { name: L.info.userFields.id, value: user.id, inline: true },
        { name: L.info.userFields.isBot, value: user.bot ? L.info.bot : L.info.notBot, inline: true },
        { name: L.info.userFields.created, value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: L.info.userFields.joined, value: target.joinedTimestamp ? `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>` : L.info.unknown, inline: true },
        { name: `${L.info.userFields.roles} (${target.roles.cache.size - 1})`, value: roles }
      ).setColor(target.displayHexColor !== "#000000" ? target.displayHexColor as `#${string}` : "#5865F2").setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const serverinfoCmd: PrefixCommand = {
  name: "serverinfo",
  aliases: ["si", "server"],
  description: "Show server info / Server-Informationen anzeigen",
  usage: ",serverinfo",
  async execute(message) {
    const L = getLang(message.guildId!);
    const guild = message.guild!;
    const embed = new EmbedBuilder()
      .setTitle(`🏠 ${guild.name}`)
      .setThumbnail(guild.iconURL({ size: 256 }))
      .addFields(
        { name: L.info.serverFields.id, value: guild.id, inline: true },
        { name: L.info.serverFields.owner, value: `<@${guild.ownerId}>`, inline: true },
        { name: L.info.serverFields.members, value: guild.memberCount.toString(), inline: true },
        { name: L.info.serverFields.channels, value: guild.channels.cache.size.toString(), inline: true },
        { name: L.info.serverFields.roles, value: guild.roles.cache.size.toString(), inline: true },
        { name: L.info.serverFields.emojis, value: guild.emojis.cache.size.toString(), inline: true },
        { name: L.info.serverFields.created, value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
        { name: L.info.serverFields.verification, value: L.info.verificationLevels[guild.verificationLevel] ?? L.info.unknown, inline: true }
      ).setColor(0x5865f2).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const avatarCmd: PrefixCommand = {
  name: "avatar",
  aliases: ["av", "pfp"],
  description: "Show avatar / Avatar anzeigen",
  usage: ",avatar [@user]",
  async execute(message) {
    const user = message.mentions.users.first() ?? message.author;
    const embed = new EmbedBuilder()
      .setTitle(`🖼️ ${user.username}`)
      .setImage(user.displayAvatarURL({ size: 1024 }))
      .setColor(0x5865f2);
    await message.channel.send({ embeds: [embed] });
  },
};

export const botinfoCmd: PrefixCommand = {
  name: "botinfo",
  aliases: ["bot"],
  description: "Show bot info / Bot-Informationen anzeigen",
  usage: ",botinfo",
  async execute(message) {
    const L = getLang(message.guildId!);
    const { client } = message;
    const up = process.uptime();
    const d = Math.floor(up / 86400), h = Math.floor((up % 86400) / 3600), m = Math.floor((up % 3600) / 60), s = Math.floor(up % 60);
    const embed = new EmbedBuilder()
      .setTitle(`🤖 ${client.user?.username}`)
      .setThumbnail(client.user?.displayAvatarURL() ?? null)
      .addFields(
        { name: L.info.botFields.ping, value: `${client.ws.ping}ms`, inline: true },
        { name: L.info.botFields.uptime, value: `${d}d ${h}h ${m}m ${s}s`, inline: true },
        { name: L.info.botFields.guilds, value: client.guilds.cache.size.toString(), inline: true },
        { name: L.info.botFields.version, value: "v14", inline: true }
      ).setColor(0x5865f2).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const pingCmd: PrefixCommand = {
  name: "ping",
  description: "Measure latency / Latenz messen",
  usage: ",ping",
  async execute(message) {
    const L = getLang(message.guildId!);
    const sent = await message.channel.send(L.info.ping.measuring);
    const latency = sent.createdTimestamp - message.createdTimestamp;
    await sent.edit(L.info.ping.result(latency, message.client.ws.ping));
  },
};

export const helpCmd: PrefixCommand = {
  name: "help",
  aliases: ["hilfe", "h", "?"],
  description: "Show all commands / Alle Commands anzeigen",
  usage: ",help [category|command]",
  async execute(message, args) {
    const { sendHelpMessage } = await import("../../handlers/helpHandler");
    const L = getLang(message.guildId!);
    const query = args.join(" ").toLowerCase();

    if (!query) {
      await sendHelpMessage(message);
      return;
    }

    const cat = L.info.categories.find((c) =>
      c.name.toLowerCase().includes(query) ||
      query.includes(c.name.toLowerCase().split(" ")[1]?.toLowerCase() ?? "")
    );

    if (cat) {
      const embed = new EmbedBuilder()
        .setTitle(cat.name)
        .setDescription(cat.commands.map((c) => `\`${PREFIX}${c.name}\`\n↳ ${c.desc}`).join("\n\n"))
        .setColor(0x5865f2).setTimestamp();
      await message.channel.send({ embeds: [embed] });
      return;
    }

    const { prefixCommands } = await import("./index");
    const cmd = prefixCommands.get(query);
    if (cmd) {
      const embed = new EmbedBuilder()
        .setTitle(`📖 \`${PREFIX}${cmd.name}\``)
        .addFields(
          { name: "📝", value: cmd.description },
          { name: "💡", value: `\`${cmd.usage}\`` },
          ...(cmd.aliases ? [{ name: "🔁", value: cmd.aliases.map((a) => `\`${PREFIX}${a}\``).join(", ") }] : [])
        ).setColor(0x5865f2);
      await message.channel.send({ embeds: [embed] });
      return;
    }

    await message.reply(L.info.notFound(PREFIX, query));
  },
};
