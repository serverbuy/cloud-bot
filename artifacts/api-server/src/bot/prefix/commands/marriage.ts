import {
  Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ButtonInteraction, MessageFlags,
} from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";

export const marriages = new Map<string, string>();
const pendingProposals = new Map<string, ReturnType<typeof setTimeout>>();

export const marryCmd: PrefixCommand = {
  name: "marry",
  aliases: ["propose", "heirat"],
  description: "Propose to someone / Heiratsantrag machen",
  usage: ",marry @user",
  async execute(message) {
    const L = getLang(message.guildId!);
    const target = message.mentions.members?.first();
    if (!target) { await message.reply(L.marriage.noTarget); return; }
    if (target.id === message.author.id) { await message.reply(L.marriage.selfMarry); return; }
    if (target.user.bot) { await message.reply(L.marriage.botMarry); return; }
    if (marriages.has(message.author.id)) {
      await message.reply(L.marriage.alreadyMarried(marriages.get(message.author.id)!)); return;
    }
    if (marriages.has(target.id)) {
      await message.reply(L.marriage.targetMarried(`${target}`, marriages.get(target.id)!)); return;
    }
    const proposalKey = `${message.author.id}-${target.id}`;
    if (pendingProposals.has(proposalKey)) {
      await message.reply(L.marriage.pending); return;
    }

    const embed = new EmbedBuilder()
      .setTitle(L.marriage.proposalTitle)
      .setDescription(L.marriage.proposalDesc(`${message.author}`, `${target}`))
      .setColor(0xff73fa)
      .setThumbnail(message.author.displayAvatarURL())
      .setFooter({ text: L.marriage.proposalFooter })
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`marry_accept_${message.author.id}_${target.id}`).setLabel(L.marriage.acceptBtn).setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId(`marry_decline_${message.author.id}_${target.id}`).setLabel(L.marriage.declineBtn).setStyle(ButtonStyle.Danger)
    );

    await message.channel.send({ content: `${target}`, embeds: [embed], components: [row] });

    const timer = setTimeout(async () => {
      pendingProposals.delete(proposalKey);
      await message.channel.send(L.marriage.expired(`${message.author}`, `${target}`)).catch(() => {});
    }, 60000);
    pendingProposals.set(proposalKey, timer);
  },
};

export const divorceCmd: PrefixCommand = {
  name: "divorce",
  aliases: ["scheidung"],
  description: "File for divorce / Scheidung einreichen",
  usage: ",divorce",
  async execute(message) {
    const L = getLang(message.guildId!);
    const partnerId = marriages.get(message.author.id);
    if (!partnerId) { await message.reply(L.marriage.notMarried); return; }
    marriages.delete(message.author.id);
    marriages.delete(partnerId);
    const embed = new EmbedBuilder()
      .setTitle(L.marriage.divorceTitle)
      .setDescription(L.marriage.divorceDesc(`${message.author}`, partnerId))
      .setColor(0xed4245).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const partnerCmd: PrefixCommand = {
  name: "partner",
  aliases: ["ehe", "married"],
  description: "Show partner / Partner anzeigen",
  usage: ",partner [@user]",
  async execute(message) {
    const L = getLang(message.guildId!);
    const target = message.mentions.users.first() ?? message.author;
    const partnerId = marriages.get(target.id);
    if (!partnerId) {
      await message.reply(L.marriage.notMarriedUser(target.id === message.author.id, target.username)); return;
    }
    const embed = new EmbedBuilder()
      .setTitle(L.marriage.partnerTitle)
      .setDescription(L.marriage.partnerDesc(`${target}`, partnerId))
      .setColor(0xff73fa).setThumbnail(target.displayAvatarURL()).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export async function handleMarriageButton(interaction: ButtonInteraction) {
  const parts = interaction.customId.split("_");
  const action = parts[1]!;
  const proposerId = parts[2]!;
  const targetId = parts[3]!;

  const guildId = interaction.guildId ?? "";
  const L = getLang(guildId);

  if (interaction.user.id !== targetId) {
    await interaction.reply({ content: L.marriage.notForYou, flags: MessageFlags.Ephemeral }); return;
  }

  const proposalKey = `${proposerId}-${targetId}`;
  const timer = pendingProposals.get(proposalKey);
  if (timer) clearTimeout(timer);
  pendingProposals.delete(proposalKey);

  if (action === "accept") {
    marriages.set(proposerId, targetId);
    marriages.set(targetId, proposerId);
    const embed = new EmbedBuilder()
      .setTitle(L.marriage.acceptedTitle)
      .setDescription(L.marriage.acceptedDesc(`<@${proposerId}>`, `<@${targetId}>`))
      .setColor(0xff73fa).setTimestamp();
    await interaction.update({ embeds: [embed], components: [] });
  } else {
    const embed = new EmbedBuilder()
      .setTitle(L.marriage.declinedTitle)
      .setDescription(L.marriage.declinedDesc(`<@${targetId}>`, `<@${proposerId}>`))
      .setColor(0xed4245).setTimestamp();
    await interaction.update({ embeds: [embed], components: [] });
  }
}
