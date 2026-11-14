import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import {
  createTeamCategory,
  RolePackCreationError,
} from "../lib/rolePack";

export const createTeamCommand = {
  data: new SlashCommandBuilder()
    .setName("create-team")
    .setDescription("Erstellt die private Team-Kategorie und Team-Rollen")
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageChannels,
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const result = await createTeamCategory(interaction.guild!);
      await interaction.editReply(
        `✅ Team-Bereich fertig!\n📁 Kategorie: **Team**\n🎭 Team-Rollen erstellt: **${result.created.length}**\n↩️ Bereits vorhanden: **${result.skipped.length}**\n🔒 Ohne Rollenrechte gesichert: **${result.secured.length}**\n🚫 Bilder/Dateien und Links sind in der Team-Kategorie blockiert.`,
      );
    } catch (error) {
      if (error instanceof RolePackCreationError) {
        await interaction.editReply(
          `⚠️ Die Team-Rollen-Erstellung wurde nach **${error.createdCount}** Rollen unterbrochen. Prüfe meine Bot-Berechtigungen.`,
        );
        return;
      }

      const messageByError: Record<string, string> = {
        BOT_MISSING_MANAGE_ROLES:
          "❌ Ich brauche die Berechtigung **Rollen verwalten**.",
        BOT_MISSING_MANAGE_CHANNELS:
          "❌ Ich brauche die Berechtigung **Kanäle verwalten**.",
        ROLE_LIMIT:
          "❌ Auf diesem Server ist nicht genug Platz: Discord erlaubt maximal 250 Rollen.",
      };
      await interaction.editReply(
        messageByError[error instanceof Error ? error.message : ""] ??
          "❌ Die Team-Kategorie konnte nicht erstellt werden.",
      );
    }
  },
};