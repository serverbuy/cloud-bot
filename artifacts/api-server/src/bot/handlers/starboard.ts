import { MessageReaction, Message, EmbedBuilder, PartialMessageReaction, PartialUser, User, ChannelType } from "discord.js";
import { logger } from "../../lib/logger";
import { getLangCode } from "../lib/i18n";
import { starboard } from "../lib/locales/extra/starboard";

const STAR_EMOJI = "⭐";
const MIN_STARS = 3;
const starboardChannels = new Map<string, string>(); // guildId → channelId

export function setStarboardChannel(guildId: string, channelId: string) {
  starboardChannels.set(guildId, channelId);
}

export function getStarboardChannel(guildId: string) { return starboardChannels.get(guildId); }

export async function handleStarboardReaction(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
  if (reaction.emoji.name !== STAR_EMOJI) return;
  const message = reaction.message instanceof Message ? reaction.message : await reaction.message.fetch();
  if (!message.guild) return;
  const sbId = starboardChannels.get(message.guild.id);
  if (!sbId) return;
  const sb = message.guild.channels.cache.get(sbId);
  if (!sb?.isTextBased()) return;

  const count = reaction.count ?? 0;
  if (count < MIN_STARS) return;

  const existing = await (sb as any).messages.fetch({ limit: 100 }).catch(() => []);
  const found = existing.find((m: any) => m.embeds[0]?.footer?.text?.includes(message.id));
  if (found) {
    const embed = EmbedBuilder.from(found.embeds[0]!).setTitle(`${STAR_EMOJI} ${count}`);
    await found.edit({ embeds: [embed] }).catch(() => {});
  } else {
    const embed = new EmbedBuilder()
      .setTitle(`${STAR_EMOJI} ${count}`)
      .setDescription(message.content || starboard[getLangCode(message.guild.id)].noText)
      .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL() })
      .setColor(0xffd700)
      .setFooter({ text: `${message.id} · ${message.channel.id}` })
      .setTimestamp(message.createdAt);
    if (message.attachments.size > 0) {
      const att = message.attachments.first();
      if (att?.contentType?.startsWith("image/")) embed.setImage(att.url);
    }
    await (sb as any).send({ content: message.url, embeds: [embed] }).catch((err: any) => logger.error({ err }, "Starboard send failed"));
  }
}
