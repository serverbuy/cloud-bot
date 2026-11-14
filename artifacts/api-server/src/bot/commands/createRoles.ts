import {
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import {
  createRolePack,
  RolePackCreationError,
  ROLE_PACK,
} from "../lib/rolePack";

export const createRolesCommand = {
  data: new SlashCommandBuilder()
    .setName("create-roles")
    .setDescription("Erstellt das 100-Rollen-Community-Paket")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      const result = await createRolePack(interaction.guild!);
      await interaction.editReply(
        `✅ Rollen-Paket fertig!\n🎭 Erstellt: **${result.created.length}**\n↩️ Bereits vorhanden: **${result.skipped.length}**\n📦 Gesamt im Paket: **${ROLE_PACK.length}**`,
      );
    } catch (error) {
      if (error instanceof RolePackCreationError) {
        await interaction.editReply(
          `⚠️ Nach **${error.createdCount}** Rollen wurde die Erstellung unterbrochen. Prüfe meine **Rollen verwalten**-Berechtigung und die Discord-Rollenbegrenzung.`,
        );
        return;
      }

      const messageByError: Record<string, string> = {
        BOT_MISSING_MANAGE_ROLES:
          "❌ Ich brauche die Berechtigung **Rollen verwalten**.",
        ROLE_LIMIT:
          "❌ Auf diesem Server ist nicht genug Platz: Discord erlaubt maximal 250 Rollen.",
      };
      await interaction.editReply(
        messageByError[error instanceof Error ? error.message : ""] ??
          "❌ Die Rollen konnten nicht erstellt werden. Prüfe meine Bot-Berechtigungen.",
      );
    }
  },
};