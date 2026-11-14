import {
  Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ButtonInteraction, MessageFlags, PermissionFlagsBits,
} from "discord.js";
import type { PrefixCommand } from "../prefix/types";
import { getLang, getLangCode } from "../lib/i18n";
import { reactionrole } from "../lib/locales/extra/reactionrole";
import { logger } from "../../lib/logger";

export const reactionRoleCmd: PrefixCommand = {
  name: "reactionrole",
  aliases: ["rr", "reactrole"],
  description: "Reaction-Rollen Panel erstellen",
  usage: ",reactionrole <titel> | 🎨 @Rolle1 | 🎮 @Rolle2 | 🎵 @Rolle3",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    const tr = reactionrole[getLangCode(message.guildId!)];
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await message.reply(L.common.noPermission); return;
    }
    const text = args.join(" ");
    if (!text.includes("|")) {
      await message.reply(tr.formatHint);
      return;
    }

    const parts = text.split("|").map((s) => s.trim());
    const title = parts[0]!.trim();
    const roleEntries = parts.slice(1);

    if (roleEntries.length === 0 || roleEntries.length > 5) {
      await message.reply(tr.maxRoles); return;
    }

    // Collect roles in mention order
    const allRoles = Array.from(message.mentions.roles.values());
    if (allRoles.length === 0) {
      await message.reply(tr.noRoles); return;
    }

    const styles = [
      ButtonStyle.Primary, ButtonStyle.Danger, ButtonStyle.Success,
      ButtonStyle.Secondary, ButtonStyle.Primary,
    ];

    const roles: { label: string; roleId: string; style: ButtonStyle }[] = [];

    for (let i = 0; i < roleEntries.length; i++) {
      const entry = roleEntries[i]!;
      // Find role referenced in this entry segment
      const matchedRole = allRoles.find((r) => entry.includes(r.id));
      if (!matchedRole) continue;
      // Label = everything before the role mention
      const label = entry.replace(/<@&\d+>/g, "").trim() || matchedRole.name;
      roles.push({ label, roleId: matchedRole.id, style: styles[i % styles.length]! });
    }

    if (roles.length === 0) {
      await message.reply(tr.noValidRoles); return;
    }

    const embed = new EmbedBuilder()
      .setTitle(`🎭 ${title}`)
      .setDescription(
        roles.map((r) => `• ${r.label} → <@&${r.roleId}>`).join("\n") +
        tr.clickHint
      )
      .setColor(0x5865f2)
      .setFooter({ text: "Reaction Roles — Cloud Bot" })
      .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      roles.map((r) =>
        new ButtonBuilder()
          .setCustomId(`rr_${r.roleId}`)
          .setLabel(r.label)
          .setStyle(r.style)
      )
    );

    await message.channel.send({ embeds: [embed], components: [row] });
    await message.delete().catch(() => {});
  },
};

export async function handleReactionRoleButton(interaction: ButtonInteraction) {
  if (!interaction.customId.startsWith("rr_")) return;

  // Extract roleId directly from customId — no in-memory map needed, survives restarts
  const roleId = interaction.customId.slice(3);
  const tr = reactionrole[getLangCode(interaction.guildId ?? "")];
  const member = interaction.guild?.members.cache.get(interaction.user.id)
    ?? await interaction.guild?.members.fetch(interaction.user.id).catch(() => null);

  if (!member) {
    await interaction.reply({ content: tr.memberNotFound, flags: MessageFlags.Ephemeral });
    return;
  }

  // Verify the role still exists in the guild
  const role = interaction.guild?.roles.cache.get(roleId);
  if (!role) {
    await interaction.reply({ content: tr.roleGone, flags: MessageFlags.Ephemeral });
    return;
  }

  try {
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);
      await interaction.reply({ content: tr.roleRemoved(role.name), flags: MessageFlags.Ephemeral });
    } else {
      await member.roles.add(roleId);
      await interaction.reply({ content: tr.roleAdded(role.name), flags: MessageFlags.Ephemeral });
    }
  } catch (err) {
    logger.error({ err }, "Reaction role toggle failed");
    await interaction.reply({ content: tr.updateError, flags: MessageFlags.Ephemeral });
  }
}
