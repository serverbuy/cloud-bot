import { Guild, EmbedBuilder, TextChannel, ColorResolvable } from "discord.js";
import { logger } from "../../lib/logger";
import { getLangCode } from "./i18n";
import { modlog } from "./locales/extra/modlog";

export const modLogChannels = new Map<string, string>();

export interface ModLogData {
  action: string;
  emoji: string;
  color: ColorResolvable;
  target?: { id: string; username: string; avatarURL?: string | null };
  moderator?: { id: string; username: string };
  reason?: string;
  duration?: string;
  extra?: Record<string, string>;
}

export async function sendModLog(guild: Guild, data: ModLogData) {
  const channelId = modLogChannels.get(guild.id);
  if (!channelId) return;
  const channel = guild.channels.cache.get(channelId) as TextChannel | undefined;
  if (!channel) return;

  const t = modlog[getLangCode(guild.id)];

  const embed = new EmbedBuilder()
    .setTitle(`${data.emoji} ${data.action}`)
    .setColor(data.color)
    .setTimestamp();

  if (data.target) {
    embed.setThumbnail(data.target.avatarURL ?? null);
    embed.addFields({ name: t.target, value: `<@${data.target.id}> (\`${data.target.username}\`)`, inline: true });
  }
  if (data.moderator) {
    embed.addFields({ name: t.moderator, value: `<@${data.moderator.id}>`, inline: true });
  }
  if (data.reason) {
    embed.addFields({ name: t.reason, value: data.reason });
  }
  if (data.duration) {
    embed.addFields({ name: t.duration, value: data.duration, inline: true });
  }
  if (data.extra) {
    for (const [k, v] of Object.entries(data.extra)) {
      embed.addFields({ name: k, value: v, inline: true });
    }
  }

  try {
    await channel.send({ embeds: [embed] });
  } catch (err) {
    logger.error({ err }, "Failed to send mod log");
  }
}
