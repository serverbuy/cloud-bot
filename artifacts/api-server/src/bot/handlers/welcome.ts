import { GuildMember, EmbedBuilder, TextChannel } from "discord.js";
import { logger } from "../../lib/logger";
import { autoRoleSettings } from "../commands/autorole";
import { getLang } from "../lib/i18n";

export interface WelcomeConfig {
  channelId: string;
  text?: string;
}

export const welcomeSettings = new Map<string, WelcomeConfig>();

async function fetchWelcomeGif(): Promise<string | null> {
  try {
    const res = await fetch("https://nekos.best/api/v2/wave", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: Array<{ url?: string }> };
    return data.results?.[0]?.url ?? null;
  } catch {
    return null;
  }
}

export async function handleGuildMemberAdd(member: GuildMember) {
  const roleId = autoRoleSettings.get(member.guild.id);
  if (roleId) {
    try {
      await member.roles.add(roleId);
      logger.info({ memberId: member.id, roleId }, "Auto-role assigned");
    } catch (err) {
      logger.error({ err }, "Failed to assign auto-role");
    }
  }

  const config = welcomeSettings.get(member.guild.id);
  let channel: TextChannel | undefined;

  if (config) {
    const ch = member.guild.channels.cache.get(config.channelId);
    if (ch?.isTextBased()) channel = ch as TextChannel;
  } else {
    const sys = member.guild.systemChannel;
    if (sys) channel = sys as TextChannel;
  }

  if (!channel) return;

  const L = getLang(member.guild.id);
  const description = config?.text
    ? config.text
        .replace("{user}", member.toString())
        .replace("{username}", member.user.username)
        .replace("{server}", member.guild.name)
        .replace("{count}", String(member.guild.memberCount))
    : L.welcome.desc(member.toString(), member.guild.memberCount);

  const gifUrl = await fetchWelcomeGif();

  const embed = new EmbedBuilder()
    .setTitle(L.welcome.title(member.guild.name))
    .setDescription(description)
    .setThumbnail(member.user.displayAvatarURL())
    .setColor(0x57f287)
    .setTimestamp();

  if (gifUrl) embed.setImage(gifUrl);

  try {
    await channel.send({ embeds: [embed] });
  } catch (err) {
    logger.error({ err }, "Failed to send welcome message");
  }
}
