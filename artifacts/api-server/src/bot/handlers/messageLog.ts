import { Message, EmbedBuilder, PartialMessage, ChannelType } from "discord.js";
import { logger } from "../../lib/logger";
import { modLogChannels } from "../lib/modLog";
import { getLang } from "../lib/i18n";

export async function handleMessageDelete(message: Message | PartialMessage) {
  if (!message.guild || !message.author || message.author.bot) return;
  const logId = modLogChannels.get(message.guild.id);
  if (!logId) return;
  const channel = message.guild.channels.cache.get(logId);
  if (!channel?.isTextBased()) return;

  const L = getLang(message.guild.id);
  const embed = new EmbedBuilder()
    .setTitle("🗑️ Nachricht gelöscht")
    .setDescription(message.content || "\_\_(leer)\_\_")
    .addFields(
      { name: "🧑", value: `${message.author}`, inline: true },
      { name: "📢", value: `<#${message.channel.id}>`, inline: true },
    )
    .setColor(0xed4245)
    .setFooter({ text: `ID: ${message.author.id}` })
    .setTimestamp();

  if (message.attachments.size > 0) {
    embed.addFields({ name: "📂", value: `${message.attachments.size} Anhänge` });
  }

  try { await (channel as any).send({ embeds: [embed] }); } catch (err) { logger.error({ err }, "Failed to log deleted message"); }
}

export async function handleMessageUpdate(oldMsg: Message | PartialMessage, newMsg: Message | PartialMessage) {
  if (!oldMsg.guild || !oldMsg.author || oldMsg.author.bot || !oldMsg.content || !newMsg.content) return;
  if (oldMsg.content === newMsg.content) return;
  const logId = modLogChannels.get(oldMsg.guild.id);
  if (!logId) return;
  const channel = oldMsg.guild.channels.cache.get(logId);
  if (!channel?.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setTitle("✏️ Nachricht bearbeitet")
    .setDescription(`\n**Vorher:**\n${oldMsg.content.slice(0, 1024)}\n\n**Nachher:**\n${newMsg.content.slice(0, 1024)}`)
    .addFields(
      { name: "🧑", value: `${oldMsg.author}`, inline: true },
      { name: "📢", value: `<#${oldMsg.channel.id}>`, inline: true },
    )
    .setColor(0xfee75c)
    .setFooter({ text: `ID: ${oldMsg.author.id}` })
    .setTimestamp();

  try { await (channel as any).send({ embeds: [embed] }); } catch (err) { logger.error({ err }, "Failed to log edited message"); }
}
