import { Message, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import {
  createRolePack,
  RolePackCreationError,
  ROLE_PACK,
} from "../../lib/rolePack";

export const createRolesCmd: PrefixCommand = {
  name: "create-roles",
  aliases: ["create100roles", "roles100"],
  description: "Create 100 community roles / 100 Community-Rollen erstellen",
  usage: ",create-roles",
  async execute(message: Message<true>) {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await message.reply("❌ Du brauchst die Berechtigung **Rollen verwalten**.");
      return;
    }

    const status = await message.reply(
      `⏳ Ich prüfe den Server und erstelle bis zu **${ROLE_PACK.length} Rollen**. Das kann kurz dauern...`,
    );

    try {
      const result = await createRolePack(message.guild);
      await status.edit(
        `✅ Rollen-Paket fertig!\n🎭 Erstellt: **${result.created.length}**\n↩️ Bereits vorhanden: **${result.skipped.length}**\n📦 Gesamt im Paket: **${ROLE_PACK.length}**`,
      );
    } catch (error) {
      if (error instanceof RolePackCreationError) {
        await status.edit(
          `⚠️ Die Erstellung wurde nach **${error.createdCount}** Rollen unterbrochen. Prüfe meine **Rollen verwalten**-Berechtigung und die Discord-Rollenbegrenzung.`,
        );
        return;
      }

      const messageByError: Record<string, string> = {
        BOT_MISSING_MANAGE_ROLES:
          "❌ Ich brauche die Berechtigung **Rollen verwalten**.",
        ROLE_LIMIT:
          "❌ Auf diesem Server ist nicht genug Platz: Discord erlaubt maximal 250 Rollen.",
      };
      await status.edit(
        messageByError[error instanceof Error ? error.message : ""] ??
          "❌ Die Rollen konnten nicht erstellt werden. Prüfe meine Bot-Berechtigungen.",
      );
    }
  },
};