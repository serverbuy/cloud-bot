import { Message, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import {
  createTeamCategory,
  RolePackCreationError,
} from "../../lib/rolePack";

export const createTeamCmd: PrefixCommand = {
  name: "create-team",
  aliases: ["team-category", "teamsetup"],
  description: "Create private Team category / Team-Kategorie erstellen",
  usage: ",create-team",
  async execute(message: Message<true>) {
    const requiredPermissions =
      PermissionFlagsBits.ManageRoles | PermissionFlagsBits.ManageChannels;
    if (!message.member?.permissions.has(requiredPermissions)) {
      await message.reply(
        "❌ Du brauchst die Berechtigungen **Rollen verwalten** und **Kanäle verwalten**.",
      );
      return;
    }

    const status = await message.reply(
      "⏳ Ich erstelle die Team-Rollen ohne Rollenrechte und richte die private Team-Kategorie ein...",
    );

    try {
      const result = await createTeamCategory(message.guild);
      await status.edit(
        `✅ Team-Bereich fertig!\n📁 Kategorie: **Team**\n🎭 Team-Rollen erstellt: **${result.created.length}**\n↩️ Bereits vorhanden: **${result.skipped.length}**\n🔒 Ohne Rollenrechte gesichert: **${result.secured.length}**\n🚫 Bilder/Dateien und Links sind in der Team-Kategorie blockiert.`,
      );
    } catch (error) {
      if (error instanceof RolePackCreationError) {
        await status.edit(
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
      await status.edit(
        messageByError[error instanceof Error ? error.message : ""] ??
          "❌ Die Team-Kategorie konnte nicht erstellt werden.",
      );
    }
  },
};