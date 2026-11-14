import {
  ButtonInteraction, ChannelType, PermissionFlagsBits,
  ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder,
  TextChannel, CategoryChannel, MessageFlags,
} from "discord.js";
import { logger } from "../../lib/logger";
import { getLang } from "../lib/i18n";

const openTickets = new Map<string, string>();

export async function handleTicketCreate(interaction: ButtonInteraction) {
  const guild = interaction.guild!;
  const user = interaction.user;
  const L = getLang(guild.id);

  const existingId = openTickets.get(`${guild.id}-${user.id}`);
  if (existingId) {
    const existing = guild.channels.cache.get(existingId);
    if (existing) {
      await interaction.reply({ content: L.ticket.alreadyOpen(existing.toString()), flags: MessageFlags.Ephemeral });
      return;
    }
    openTickets.delete(`${guild.id}-${user.id}`);
  }

  await interaction.reply({ content: L.ticket.creating, flags: MessageFlags.Ephemeral });

  try {
    const category = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildCategory && c.name.toLowerCase().includes("ticket")
    ) as CategoryChannel | undefined;

    const ticketChannel = await guild.channels.create({
      name: `ticket-${user.username.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      type: ChannelType.GuildText,
      parent: category ?? undefined,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks] },
        { id: guild.members.me!.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ReadMessageHistory] },
      ],
    }) as TextChannel;

    openTickets.set(`${guild.id}-${user.id}`, ticketChannel.id);

    const embed = new EmbedBuilder()
      .setTitle(L.ticket.title)
      .setDescription(L.ticket.desc(user.toString()))
      .setColor(0x5865f2)
      .setFooter({ text: L.ticket.footer(user.username) })
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_close_btn")
        .setLabel(L.ticket.closeBtn)
        .setStyle(ButtonStyle.Danger)
        .setEmoji("🔒")
    );

    await ticketChannel.send({ content: `${user}`, embeds: [embed], components: [row] });
    await interaction.editReply({ content: L.ticket.created(ticketChannel.toString()) });
    logger.info({ channelId: ticketChannel.id, userId: user.id }, "Ticket created");
  } catch (err) {
    logger.error({ err }, "Failed to create ticket");
    await interaction.editReply({ content: L.ticket.error });
  }
}

export async function handleTicketClose(interaction: ButtonInteraction) {
  const channel = interaction.channel as TextChannel;
  const L = getLang(interaction.guildId ?? "");

  if (!channel.name.startsWith("ticket-")) {
    await interaction.reply({ content: L.ticket.notTicket, flags: MessageFlags.Ephemeral });
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(L.ticket.closingTitle)
    .setDescription(L.ticket.closingDesc(interaction.user.toString()))
    .setColor(0xed4245).setTimestamp();

  await interaction.reply({ embeds: [embed] });

  for (const [key, id] of openTickets.entries()) {
    if (id === channel.id) { openTickets.delete(key); break; }
  }

  setTimeout(() => channel.delete("Ticket closed").catch(() => {}), 5000);
}
