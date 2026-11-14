import {
  VoiceState, ChannelType, PermissionFlagsBits,
  ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,
  ModalSubmitInteraction, VoiceChannel, MessageFlags,
} from "discord.js";
import { logger } from "../../lib/logger";
import { getLang } from "../lib/i18n";

export const vcCreateChannels = new Map<string, string>();
export const tempVoiceChannels = new Map<string, string>();

async function sendVcPanel(voiceChannel: VoiceChannel, ownerId: string) {
  const L = getLang(voiceChannel.guild.id);
  const embed = new EmbedBuilder()
    .setTitle(L.vc.panelTitle)
    .setDescription(L.vc.panelDesc(voiceChannel.name))
    .addFields(
      { name: L.vc.owner, value: `<@${ownerId}>`, inline: true },
      { name: L.vc.limit, value: L.vc.unlimited, inline: true },
      { name: L.vc.status, value: L.vc.open, inline: true },
      { name: L.vc.bitrate, value: `${voiceChannel.bitrate / 1000}kbps`, inline: true }
    ).setColor(0x5865f2).setFooter({ text: L.vc.panelFooter }).setTimestamp();

  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("vc_rename").setLabel(L.vc.renameLabel).setStyle(ButtonStyle.Primary).setEmoji("✏️"),
    new ButtonBuilder().setCustomId("vc_limit").setLabel(L.vc.limitLabel).setStyle(ButtonStyle.Primary).setEmoji("👥"),
    new ButtonBuilder().setCustomId("vc_bitrate").setLabel(L.vc.bitrateLabel).setStyle(ButtonStyle.Primary).setEmoji("📡"),
    new ButtonBuilder().setCustomId("vc_lock").setLabel(L.vc.lockLabel).setStyle(ButtonStyle.Danger).setEmoji("🔒"),
    new ButtonBuilder().setCustomId("vc_unlock").setLabel(L.vc.unlockLabel).setStyle(ButtonStyle.Success).setEmoji("🔓")
  );
  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId("vc_hide").setLabel(L.vc.hideLabel).setStyle(ButtonStyle.Secondary).setEmoji("🙈"),
    new ButtonBuilder().setCustomId("vc_show").setLabel(L.vc.showLabel).setStyle(ButtonStyle.Secondary).setEmoji("👁️"),
    new ButtonBuilder().setCustomId("vc_allow").setLabel(L.vc.allowLabel).setStyle(ButtonStyle.Success).setEmoji("✅"),
    new ButtonBuilder().setCustomId("vc_kick").setLabel(L.vc.kickLabel).setStyle(ButtonStyle.Danger).setEmoji("👢"),
    new ButtonBuilder().setCustomId("vc_delete").setLabel(L.vc.deleteLabel).setStyle(ButtonStyle.Danger).setEmoji("🗑️")
  );

  try {
    const owner = await voiceChannel.guild.members.fetch(ownerId);
    await owner.send({ embeds: [embed], components: [row1, row2] });
  } catch {
    const textCh = voiceChannel.guild.channels.cache.find(
      (c) => c.isTextBased() && c.type === ChannelType.GuildText && c.parentId === voiceChannel.parentId
    );
    if (textCh?.isTextBased()) {
      await (textCh as any).send({ content: `<@${ownerId}>`, embeds: [embed], components: [row1, row2] });
    }
  }
}

export async function handleVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
  const joinToCreateId = vcCreateChannels.get(newState.guild.id);
  if (!joinToCreateId) return;

  if (newState.channelId === joinToCreateId && newState.member) {
    const member = newState.member;
    try {
      const tempChannel = await newState.guild.channels.create({
        name: `🔊 ${member.displayName}`,
        type: ChannelType.GuildVoice,
        parent: newState.channel?.parentId ?? undefined,
        userLimit: 0,
        permissionOverwrites: [
          { id: member.id, allow: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.MoveMembers, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers] },
        ],
      }) as VoiceChannel;
      tempVoiceChannels.set(tempChannel.id, member.id);
      await member.voice.setChannel(tempChannel);
      await sendVcPanel(tempChannel, member.id);
    } catch (err) { logger.error({ err }, "Failed to create temp VC"); }
  }

  if (oldState.channelId && tempVoiceChannels.has(oldState.channelId) && oldState.channel?.members.size === 0) {
    try {
      await oldState.channel.delete("Temp VC empty");
      tempVoiceChannels.delete(oldState.channelId);
    } catch (err) { logger.error({ err }, "Failed to delete temp VC"); }
  }
}

function getOwnerVoiceChannel(interaction: ButtonInteraction): VoiceChannel | null {
  const member = interaction.guild?.members.cache.get(interaction.user.id);
  const vc = member?.voice.channel as VoiceChannel | null;
  if (!vc) return null;
  if (tempVoiceChannels.get(vc.id) !== interaction.user.id) return null;
  return vc;
}

export async function handleVcButton(interaction: ButtonInteraction) {
  const { customId } = interaction;
  const L = getLang(interaction.guildId ?? "");

  const modals: Record<string, { id: string; title: string; label: string; placeholder?: string }> = {
    vc_rename:  { id: "vc_rename_modal",  title: L.vc.renameTitle,  label: L.vc.renameInputLabel },
    vc_limit:   { id: "vc_limit_modal",   title: L.vc.limitTitle,   label: L.vc.limitInputLabel,   placeholder: L.vc.limitPlaceholder },
    vc_bitrate: { id: "vc_bitrate_modal", title: L.vc.bitrateTitle, label: L.vc.bitrateInputLabel, placeholder: L.vc.bitratePlaceholder },
    vc_kick:    { id: "vc_kick_modal",    title: L.vc.kickTitle,    label: L.vc.kickInputLabel },
    vc_allow:   { id: "vc_allow_modal",   title: L.vc.allowTitle,   label: L.vc.allowInputLabel },
  };

  if (customId in modals) {
    const m = modals[customId]!;
    const modal = new ModalBuilder().setCustomId(m.id).setTitle(m.title);
    const input = new TextInputBuilder().setCustomId("vc_input").setLabel(m.label).setStyle(TextInputStyle.Short).setRequired(true);
    if (m.placeholder) input.setPlaceholder(m.placeholder);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
    return;
  }

  const channel = getOwnerVoiceChannel(interaction);
  if (!channel) {
    await interaction.reply({ content: L.vc.notOwner, flags: MessageFlags.Ephemeral }); return;
  }

  if (customId === "vc_lock") {
    await channel.permissionOverwrites.edit(channel.guild.id, { Connect: false });
    await interaction.reply({ content: L.vc.locked, flags: MessageFlags.Ephemeral });
  } else if (customId === "vc_unlock") {
    await channel.permissionOverwrites.edit(channel.guild.id, { Connect: null });
    await interaction.reply({ content: L.vc.unlocked, flags: MessageFlags.Ephemeral });
  } else if (customId === "vc_hide") {
    await channel.permissionOverwrites.edit(channel.guild.id, { ViewChannel: false });
    await interaction.reply({ content: L.vc.hidden, flags: MessageFlags.Ephemeral });
  } else if (customId === "vc_show") {
    await channel.permissionOverwrites.edit(channel.guild.id, { ViewChannel: null });
    await interaction.reply({ content: L.vc.shown, flags: MessageFlags.Ephemeral });
  } else if (customId === "vc_delete") {
    await interaction.reply({ content: L.vc.deleting, flags: MessageFlags.Ephemeral });
    tempVoiceChannels.delete(channel.id);
    await channel.delete("Deleted by owner").catch(() => {});
  }
}

export async function handleVcModal(interaction: ModalSubmitInteraction) {
  const { customId } = interaction;
  const L = getLang(interaction.guildId ?? "");
  const member = interaction.guild?.members.cache.get(interaction.user.id);
  const voiceChannel = member?.voice.channel as VoiceChannel | null;
  if (!voiceChannel || tempVoiceChannels.get(voiceChannel.id) !== interaction.user.id) {
    await interaction.reply({ content: L.vc.notInVC, flags: MessageFlags.Ephemeral }); return;
  }

  const value = interaction.fields.getTextInputValue("vc_input");

  if (customId === "vc_rename_modal") {
    await voiceChannel.setName(value);
    await interaction.reply({ content: L.vc.renamed(value), flags: MessageFlags.Ephemeral });
  } else if (customId === "vc_limit_modal") {
    const limit = parseInt(value, 10);
    if (isNaN(limit) || limit < 0 || limit > 99) {
      await interaction.reply({ content: L.vc.limitInvalid, flags: MessageFlags.Ephemeral }); return;
    }
    await voiceChannel.setUserLimit(limit);
    await interaction.reply({ content: L.vc.limitSet(limit), flags: MessageFlags.Ephemeral });
  } else if (customId === "vc_bitrate_modal") {
    const kbps = parseInt(value, 10);
    if (isNaN(kbps) || kbps < 8 || kbps > 96) {
      await interaction.reply({ content: L.vc.bitrateInvalid, flags: MessageFlags.Ephemeral }); return;
    }
    await voiceChannel.setBitrate(kbps * 1000);
    await interaction.reply({ content: L.vc.bitrateSet(kbps), flags: MessageFlags.Ephemeral });
  } else if (customId === "vc_kick_modal") {
    const target = voiceChannel.members.get(value);
    if (!target) { await interaction.reply({ content: L.vc.notInChannel, flags: MessageFlags.Ephemeral }); return; }
    await target.voice.disconnect();
    await interaction.reply({ content: L.vc.kickedUser(value), flags: MessageFlags.Ephemeral });
  } else if (customId === "vc_allow_modal") {
    try {
      await voiceChannel.permissionOverwrites.create(value, { Connect: true, ViewChannel: true });
      await interaction.reply({ content: L.vc.allowed(value), flags: MessageFlags.Ephemeral });
    } catch {
      await interaction.reply({ content: L.vc.userNotFound, flags: MessageFlags.Ephemeral });
    }
  }
}
