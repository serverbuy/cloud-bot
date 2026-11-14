import {
  Message, EmbedBuilder, ButtonBuilder, ButtonStyle,
  ActionRowBuilder, PermissionFlagsBits, ChannelType, Interaction,
  VoiceChannel, ModalBuilder, TextInputBuilder, TextInputStyle,
} from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { vcpanel } from "../../lib/locales/extra/vcpanel";

function buildPanelEmbed(vc: VoiceChannel): EmbedBuilder {
  const t = vcpanel[getLangCode(vc.guild.id)];
  const locked = vc.permissionOverwrites.cache.get(vc.guild.roles.everyone.id)?.deny.has(PermissionFlagsBits.Connect) ?? false;
  const memberList = vc.members
    .filter((m) => !m.user.bot)
    .map((m) => `• ${m.displayName}${m.voice.mute ? " 🔇" : ""}${m.voice.deaf ? " 👂" : ""}`)
    .join("\n") || t.noOneInChannel;

  return new EmbedBuilder()
    .setTitle(t.panelTitle(vc.name))
    .setDescription(
      t.panelDesc(
        vc.id,
        locked ? t.statusLocked : t.statusOpen,
        `${vc.members.filter((m) => !m.user.bot).size}${vc.userLimit ? `/${vc.userLimit}` : ""}`,
        vc.bitrate / 1000,
        memberList,
      ),
    )
    .setColor(locked ? 0xff0000 : 0x5865f2)
    .setTimestamp()
    .setFooter({ text: t.panelFooter });
}

function buildPanelRows(vcId: string, t: (typeof vcpanel)["en"]): ActionRowBuilder<ButtonBuilder>[] {
  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(`vcpanel_mute_${vcId}`).setLabel(t.btnMuteAll).setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId(`vcpanel_unmute_${vcId}`).setLabel(t.btnUnmute).setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`vcpanel_deafen_${vcId}`).setLabel(t.btnDeafAll).setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId(`vcpanel_undeafen_${vcId}`).setLabel(t.btnUndeafen).setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`vcpanel_dc_${vcId}`).setLabel(t.btnDcAll).setStyle(ButtonStyle.Danger),
  );
  const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(`vcpanel_lock_${vcId}`).setLabel(t.btnLock).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`vcpanel_unlock_${vcId}`).setLabel(t.btnUnlock).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`vcpanel_list_${vcId}`).setLabel(t.btnMembers).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`vcpanel_refresh_${vcId}`).setLabel(t.btnRefresh).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`vcpanel_rename_${vcId}`).setLabel(t.btnRename).setStyle(ButtonStyle.Secondary),
  );
  const row3 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(`vcpanel_limit_${vcId}`).setLabel(t.btnLimit).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`vcpanel_bitrate_${vcId}`).setLabel(t.btnBitrate).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`vcpanel_kicker_${vcId}`).setLabel(t.btnKickUser).setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId(`vcpanel_hidden_${vcId}`).setLabel(t.btnHide).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`vcpanel_visible_${vcId}`).setLabel(t.btnVisible).setStyle(ButtonStyle.Secondary),
  );
  const row4 = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(`vcpanel_vcban_${vcId}`).setLabel(t.btnVcBan).setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId(`vcpanel_vcunban_${vcId}`).setLabel(t.btnVcUnban).setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`vcpanel_count_${vcId}`).setLabel(t.btnUserCount).setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId(`vcpanel_announce_${vcId}`).setLabel(t.btnAnnounce).setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`vcpanel_moveall_${vcId}`).setLabel(t.btnMoveAll).setStyle(ButtonStyle.Secondary),
  );
  return [row1, row2, row3, row4];
}

export const vcPanelCmd: PrefixCommand = {
  name: "vcpanel",
  aliases: ["voicepanel", "vccontrol", "vcsteuerung"],
  description: "Voice Channel Steuer-Panel erstellen",
  usage: ",vcpanel",
  async execute(message) {
    const t = vcpanel[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.MuteMembers)) {
      await message.reply(t.noPermMute); return;
    }
    const vc = message.member.voice.channel;
    if (!vc || vc.type !== ChannelType.GuildVoice) {
      await message.reply(t.joinVcFirst); return;
    }
    await message.channel.send({
      embeds: [buildPanelEmbed(vc as VoiceChannel)],
      components: buildPanelRows(vc.id, t),
    });
  },
};

export async function handleVcPanelButton(interaction: Interaction) {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("vcpanel_")) return;

  const t = vcpanel[getLangCode(interaction.guildId ?? "")];

  if (!interaction.memberPermissions?.has(PermissionFlagsBits.MuteMembers)) {
    await interaction.reply({ content: t.noPermMute, ephemeral: true });
    return;
  }

  const parts = interaction.customId.split("_");
  const action = parts[1]!;
  const channelId = parts[2]!;

  const guild = interaction.guild;
  if (!guild) return;
  const vc = guild.channels.cache.get(channelId) as VoiceChannel | undefined;
  if (!vc || vc.type !== ChannelType.GuildVoice) {
    await interaction.reply({ content: t.vcNotFound, ephemeral: true }); return;
  }

  // --- Modals ---
  if (action === "rename") {
    const modal = new ModalBuilder()
      .setCustomId(`vcpanel_renamemodal_${channelId}`)
      .setTitle(t.renameModalTitle(vc.name));
    const input = new TextInputBuilder()
      .setCustomId("vcpanel_newname").setLabel(t.renameInputLabel)
      .setStyle(TextInputStyle.Short).setPlaceholder(vc.name)
      .setMinLength(1).setMaxLength(100).setRequired(true);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
    return;
  }

  if (action === "limit") {
    const modal = new ModalBuilder()
      .setCustomId(`vcpanel_limitmodal_${channelId}`)
      .setTitle(t.limitModalTitle);
    const input = new TextInputBuilder()
      .setCustomId("vcpanel_limitvalue").setLabel(t.limitInputLabel)
      .setStyle(TextInputStyle.Short).setPlaceholder(String(vc.userLimit || "0"))
      .setMinLength(1).setMaxLength(2).setRequired(true);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
    return;
  }

  if (action === "bitrate") {
    const modal = new ModalBuilder()
      .setCustomId(`vcpanel_bitratemodal_${channelId}`)
      .setTitle(t.bitrateModalTitle);
    const input = new TextInputBuilder()
      .setCustomId("vcpanel_bitratevalue").setLabel(t.bitrateInputLabel)
      .setStyle(TextInputStyle.Short).setPlaceholder(String(vc.bitrate / 1000))
      .setMinLength(1).setMaxLength(3).setRequired(true);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
    return;
  }

  if (action === "kicker") {
    const modal = new ModalBuilder()
      .setCustomId(`vcpanel_kickermodal_${channelId}`)
      .setTitle(t.kickerModalTitle);
    const input = new TextInputBuilder()
      .setCustomId("vcpanel_kickername").setLabel(t.kickerInputLabel)
      .setStyle(TextInputStyle.Short).setPlaceholder(t.exampleCloud)
      .setMinLength(1).setMaxLength(100).setRequired(true);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
    return;
  }

  if (action === "vcban") {
    const modal = new ModalBuilder()
      .setCustomId(`vcpanel_vcbanmodal_${channelId}`)
      .setTitle(t.vcbanModalTitle);
    const input = new TextInputBuilder()
      .setCustomId("vcpanel_vcbanname").setLabel(t.vcbanInputLabel)
      .setStyle(TextInputStyle.Short).setPlaceholder(t.exampleCloud)
      .setMinLength(1).setMaxLength(100).setRequired(true);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
    return;
  }

  if (action === "vcunban") {
    const modal = new ModalBuilder()
      .setCustomId(`vcpanel_vcunbanmodal_${channelId}`)
      .setTitle(t.vcunbanModalTitle);
    const input = new TextInputBuilder()
      .setCustomId("vcpanel_vcunbanname").setLabel(t.vcunbanInputLabel)
      .setStyle(TextInputStyle.Short).setPlaceholder(t.exampleCloud)
      .setMinLength(1).setMaxLength(100).setRequired(true);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
    return;
  }

  if (action === "announce") {
    const modal = new ModalBuilder()
      .setCustomId(`vcpanel_announcemodal_${channelId}`)
      .setTitle(t.announceModalTitle);
    const input = new TextInputBuilder()
      .setCustomId("vcpanel_announcetext").setLabel(t.announceInputLabel)
      .setStyle(TextInputStyle.Paragraph).setPlaceholder(t.announcePlaceholder)
      .setMinLength(1).setMaxLength(500).setRequired(true);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
    return;
  }

  if (action === "moveall") {
    const modal = new ModalBuilder()
      .setCustomId(`vcpanel_moveallmodal_${channelId}`)
      .setTitle(t.moveallModalTitle);
    const input = new TextInputBuilder()
      .setCustomId("vcpanel_moveallname").setLabel(t.moveallInputLabel)
      .setStyle(TextInputStyle.Short).setPlaceholder(t.moveallPlaceholder)
      .setMinLength(1).setMaxLength(100).setRequired(true);
    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
    await interaction.showModal(modal);
    return;
  }

  // --- Count (no modal needed) ---
  if (action === "count") {
    const humans = vc.members.filter((m) => !m.user.bot);
    const limit = vc.userLimit ? `/${vc.userLimit}` : "";
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(t.countTitle(vc.name))
          .setDescription(
            t.countDesc(
              `${humans.size}${limit}`,
              humans.size > 0
                ? humans.map((m) => `• ${m.displayName}${m.voice.mute ? " 🔇" : ""}${m.voice.deaf ? " 👂" : ""}`).join("\n")
                : t.noOneInChannel,
            ),
          )
          .setColor(0x5865f2).setTimestamp(),
      ],
      ephemeral: true,
    });
    return;
  }

  // --- Info / List ---
  if (action === "list") {
    const humans = vc.members.filter((m) => !m.user.bot);
    const list = humans.size > 0
      ? humans.map((m) => `• **${m.displayName}**${m.voice.mute ? " 🔇" : ""}${m.voice.deaf ? " 👂" : ""}`).join("\n")
      : t.noOneInChannel;
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(t.listTitle(vc.name, humans.size))
          .setDescription(list).setColor(0x5865f2).setTimestamp(),
      ],
      ephemeral: true,
    });
    return;
  }

  if (action === "refresh") {
    await interaction.update({ embeds: [buildPanelEmbed(vc)], components: buildPanelRows(vc.id, t) });
    return;
  }

  // --- Actions that update the panel ---
  if (action === "lock") {
    await vc.permissionOverwrites.edit(guild.roles.everyone, { Connect: false }).catch(() => {});
    await interaction.update({ embeds: [buildPanelEmbed(vc)], components: buildPanelRows(vc.id, t) });
  } else if (action === "unlock") {
    await vc.permissionOverwrites.edit(guild.roles.everyone, { Connect: null }).catch(() => {});
    await interaction.update({ embeds: [buildPanelEmbed(vc)], components: buildPanelRows(vc.id, t) });
  } else if (action === "hidden") {
    await vc.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: false }).catch(() => {});
    await interaction.reply({ content: t.hiddenMsg(vc.name), ephemeral: true });
  } else if (action === "visible") {
    await vc.permissionOverwrites.edit(guild.roles.everyone, { ViewChannel: null }).catch(() => {});
    await interaction.reply({ content: t.visibleMsg(vc.name), ephemeral: true });
  } else if (action === "mute") {
    let count = 0;
    for (const [, m] of vc.members) { if (!m.user.bot) { await m.voice.setMute(true).catch(() => {}); count++; } }
    await interaction.reply({ content: t.mutedMsg(count, vc.name), ephemeral: true });
  } else if (action === "unmute") {
    let count = 0;
    for (const [, m] of vc.members) { if (!m.user.bot) { await m.voice.setMute(false).catch(() => {}); count++; } }
    await interaction.reply({ content: t.unmutedMsg(count, vc.name), ephemeral: true });
  } else if (action === "deafen") {
    let count = 0;
    for (const [, m] of vc.members) { if (!m.user.bot) { await m.voice.setDeaf(true).catch(() => {}); count++; } }
    await interaction.reply({ content: t.deafenedMsg(count, vc.name), ephemeral: true });
  } else if (action === "undeafen") {
    let count = 0;
    for (const [, m] of vc.members) { if (!m.user.bot) { await m.voice.setDeaf(false).catch(() => {}); count++; } }
    await interaction.reply({ content: t.undeafenedMsg(count, vc.name), ephemeral: true });
  } else if (action === "dc") {
    const count = vc.members.filter((m) => !m.user.bot).size;
    for (const [, m] of vc.members) { if (!m.user.bot) await m.voice.disconnect().catch(() => {}); }
    await interaction.reply({ content: t.dcMsg(count, vc.name), ephemeral: true });
  }
}

export async function handleVcPanelModal(interaction: Interaction) {
  if (!interaction.isModalSubmit()) return;
  if (!interaction.customId.startsWith("vcpanel_")) return;

  const guild = interaction.guild;
  if (!guild) return;

  const t = vcpanel[getLangCode(guild.id)];

  // Rename
  if (interaction.customId.startsWith("vcpanel_renamemodal_")) {
    const channelId = interaction.customId.replace("vcpanel_renamemodal_", "");
    const vc = guild.channels.cache.get(channelId) as VoiceChannel | undefined;
    if (!vc) { await interaction.reply({ content: t.channelNotFound, ephemeral: true }); return; }
    const newName = interaction.fields.getTextInputValue("vcpanel_newname").trim();
    if (!newName) { await interaction.reply({ content: t.noNameEntered, ephemeral: true }); return; }
    await vc.setName(newName).catch(() => {});
    await interaction.reply({ content: t.renamedMsg(newName), ephemeral: true });
    return;
  }

  // Limit
  if (interaction.customId.startsWith("vcpanel_limitmodal_")) {
    const channelId = interaction.customId.replace("vcpanel_limitmodal_", "");
    const vc = guild.channels.cache.get(channelId) as VoiceChannel | undefined;
    if (!vc) { await interaction.reply({ content: t.channelNotFound, ephemeral: true }); return; }
    const val = parseInt(interaction.fields.getTextInputValue("vcpanel_limitvalue"));
    if (isNaN(val) || val < 0 || val > 99) { await interaction.reply({ content: t.limitInvalid, ephemeral: true }); return; }
    await vc.setUserLimit(val).catch(() => {});
    await interaction.reply({ content: t.limitSetMsg(val === 0 ? t.limitNoLimitWord : val), ephemeral: true });
    return;
  }

  // Bitrate
  if (interaction.customId.startsWith("vcpanel_bitratemodal_")) {
    const channelId = interaction.customId.replace("vcpanel_bitratemodal_", "");
    const vc = guild.channels.cache.get(channelId) as VoiceChannel | undefined;
    if (!vc) { await interaction.reply({ content: t.channelNotFound, ephemeral: true }); return; }
    const val = parseInt(interaction.fields.getTextInputValue("vcpanel_bitratevalue"));
    if (isNaN(val) || val < 8 || val > 384) { await interaction.reply({ content: t.bitrateInvalid, ephemeral: true }); return; }
    await vc.setBitrate(val * 1000).catch(() => {});
    await interaction.reply({ content: t.bitrateSetMsg(val), ephemeral: true });
    return;
  }

  // Kick User
  if (interaction.customId.startsWith("vcpanel_kickermodal_")) {
    const channelId = interaction.customId.replace("vcpanel_kickermodal_", "");
    const vc = guild.channels.cache.get(channelId) as VoiceChannel | undefined;
    if (!vc) { await interaction.reply({ content: t.channelNotFound, ephemeral: true }); return; }
    const name = interaction.fields.getTextInputValue("vcpanel_kickername").trim().toLowerCase().replace(/^@/, "");
    const member = vc.members.find(
      (m) => m.user.username.toLowerCase() === name || m.displayName.toLowerCase() === name || m.id === name,
    );
    if (!member) { await interaction.reply({ content: t.noMemberInChannel(name), ephemeral: true }); return; }
    await member.voice.disconnect("VC Panel Kick").catch(() => {});
    await interaction.reply({ content: t.kickedMsg(member.displayName), ephemeral: true });
    return;
  }

  // VC-Ban (deny Connect permission for specific user)
  if (interaction.customId.startsWith("vcpanel_vcbanmodal_")) {
    const channelId = interaction.customId.replace("vcpanel_vcbanmodal_", "");
    const vc = guild.channels.cache.get(channelId) as VoiceChannel | undefined;
    if (!vc) { await interaction.reply({ content: t.channelNotFound, ephemeral: true }); return; }
    const name = interaction.fields.getTextInputValue("vcpanel_vcbanname").trim().toLowerCase().replace(/^@/, "");
    const member = guild.members.cache.find(
      (m) => m.user.username.toLowerCase() === name || m.displayName.toLowerCase() === name || m.id === name,
    );
    if (!member) { await interaction.reply({ content: t.noMemberFound(name), ephemeral: true }); return; }
    // Kick from VC first, then deny connect
    if (member.voice.channelId === channelId) await member.voice.disconnect().catch(() => {});
    await vc.permissionOverwrites.edit(member, { Connect: false }).catch(() => {});
    await interaction.reply({ content: t.vcbannedMsg(member.displayName), ephemeral: true });
    return;
  }

  // VC-Unban (remove deny Connect for specific user)
  if (interaction.customId.startsWith("vcpanel_vcunbanmodal_")) {
    const channelId = interaction.customId.replace("vcpanel_vcunbanmodal_", "");
    const vc = guild.channels.cache.get(channelId) as VoiceChannel | undefined;
    if (!vc) { await interaction.reply({ content: t.channelNotFound, ephemeral: true }); return; }
    const name = interaction.fields.getTextInputValue("vcpanel_vcunbanname").trim().toLowerCase().replace(/^@/, "");
    const member = guild.members.cache.find(
      (m) => m.user.username.toLowerCase() === name || m.displayName.toLowerCase() === name || m.id === name,
    );
    if (!member) { await interaction.reply({ content: t.noMemberFound(name), ephemeral: true }); return; }
    await vc.permissionOverwrites.edit(member, { Connect: null }).catch(() => {});
    await interaction.reply({ content: t.vcunbannedMsg(member.displayName), ephemeral: true });
    return;
  }

  // Announce — send embed to the nearest text channel
  if (interaction.customId.startsWith("vcpanel_announcemodal_")) {
    const channelId = interaction.customId.replace("vcpanel_announcemodal_", "");
    const vc = guild.channels.cache.get(channelId) as VoiceChannel | undefined;
    const text = interaction.fields.getTextInputValue("vcpanel_announcetext").trim();
    // Find the first text channel in the same category or the system channel
    const textCh = (vc?.parent?.children.cache.find((c) => c.isTextBased()) ?? guild.systemChannel) as any;
    if (!textCh) { await interaction.reply({ content: t.noTextChannel, ephemeral: true }); return; }
    await textCh.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(t.announceTitle)
          .setDescription(text)
          .setColor(0x5865f2)
          .setFooter({ text: t.announceFooter(vc?.name ?? t.unknown) })
          .setTimestamp(),
      ],
    }).catch(() => {});
    await interaction.reply({ content: t.announceSentMsg(textCh), ephemeral: true });
    return;
  }

  // Move All — move all VC members to another voice channel
  if (interaction.customId.startsWith("vcpanel_moveallmodal_")) {
    const channelId = interaction.customId.replace("vcpanel_moveallmodal_", "");
    const vc = guild.channels.cache.get(channelId) as VoiceChannel | undefined;
    if (!vc) { await interaction.reply({ content: t.channelNotFound, ephemeral: true }); return; }
    const targetName = interaction.fields.getTextInputValue("vcpanel_moveallname").trim().toLowerCase();
    const targetVc = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildVoice && c.name.toLowerCase().includes(targetName),
    ) as VoiceChannel | undefined;
    if (!targetVc) { await interaction.reply({ content: t.noVcFound(targetName), ephemeral: true }); return; }
    let moved = 0;
    for (const [, m] of vc.members) {
      if (!m.user.bot) { await m.voice.setChannel(targetVc).catch(() => {}); moved++; }
    }
    await interaction.reply({ content: t.movedMsg(moved, targetVc.name), ephemeral: true });
    return;
  }
}
