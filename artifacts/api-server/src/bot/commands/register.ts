import { REST, Routes } from "discord.js";
import { client } from "../index";
import { logger } from "../../lib/logger";
import { roleCommand } from "./role";
import { ticketCommand } from "./ticket";
import { moderationCommands } from "./moderation";
import { infoCommands } from "./info";
import { vcSetupCommand } from "./vcsetup";
import { autoRoleCommand } from "./autorole";
import { createRolesCommand } from "./createRoles";
import { createTeamCommand } from "./createTeam";

export const commands = [
  roleCommand,
  ticketCommand,
  vcSetupCommand,
  autoRoleCommand,
  createRolesCommand,
  createTeamCommand,
  ...moderationCommands,
  ...infoCommands,
];

export async function registerCommands(token: string) {
  const rest = new REST({ version: "10" }).setToken(token);

  client.once("clientReady", async () => {
    try {
      logger.info("Registering slash commands globally...");
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: commands.map((c) => c.data.toJSON()),
      });
      logger.info(`Registered ${commands.length} slash commands`);
    } catch (err) {
      logger.error({ err }, "Failed to register slash commands");
    }
  });
}
