import {
  Message, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder,
  ButtonStyle, EmbedBuilder, TextChannel,
} from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";

export const ticketSetupCmd: PrefixCommand = {
  name: "ticket-setup",
  aliases: ["ticketsetup"],
  description: "Create ticket panel / Ticket-Panel erstellen",
  usage: ",ticket-setup [title]",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await message.reply(L.common.noPermission); return;
    }
    const title = args.join(" ") || "Support Ticket";
    const embed = new EmbedBuilder()
      .setTitle(`🎫 ${title}`)
      .setDescription(L.ticket.setupDesc)
      .setColor(0x5865f2)
      .setFooter({ text: "Ticket System" })
      .setTimestamp();
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_create")
        .setLabel(L.ticket.createBtn)
        .setStyle(ButtonStyle.Primary)
        .setEmoji("🎫")
    );
    await message.channel.send({ embeds: [embed], components: [row] });
    await message.delete().catch(() => {});
  },
};

export const ticketCloseCmd: PrefixCommand = {
  name: "ticket-close",
  aliases: ["tclose"],
  description: "Close current ticket / Ticket schließen",
  usage: ",ticket-close",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageChannels)) {
      await message.reply(L.common.noPermission); return;
    }
    const channel = message.channel as TextChannel;
    if (!channel.name.startsWith("ticket-")) {
      await message.reply(L.ticket.notTicket); return;
    }
    const embed = new EmbedBuilder()
      .setTitle(L.ticket.closingTitle)
      .setDescription(L.ticket.closingDesc(`${message.author}`))
      .setColor(0xed4245).setTimestamp();
    await message.channel.send({ embeds: [embed] });
    setTimeout(() => channel.delete("Ticket closed").catch(() => {}), 5000);
  },
};
