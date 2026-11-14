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
import { funCommands } from "./fun";

export const commands = [
  roleCommand,
  ticketCommand,
  vcSetupCommand,
  autoRoleCommand,
  createRolesCommand,
  createTeamCommand,
  ...moderationCommands,
  ...infoCommands,
  ...funCommands,
];

// Commands that also work as a user-installed app (DMs, group chats, other servers).
const EVERYWHERE = new Set([
  "ping", "avatar", "botinfo", "userinfo",
  ...funCommands.map((c) => c.data.name),
]);

export function commandPayload() {
  return commands.map((c) => {
    const json = c.data.toJSON() as unknown as Record<string, unknown>;
    if (EVERYWHERE.has(json["name"] as string)) {
      json["integration_types"] = [0, 1]; // guild install + user install
      json["contexts"] = [0, 1, 2]; // server, bot DM, other DMs/groups
    } else {
      json["integration_types"] = [0];
      json["contexts"] = [0]; // server only
    }
    return json;
  });
}

export async function registerCommands(token: string) {
  const rest = new REST({ version: "10" }).setToken(token);

  client.once("clientReady", async () => {
    try {
      logger.info("Registering slash commands globally...");
      await rest.put(Routes.applicationCommands(client.user!.id), {
        body: commandPayload(),
      });
      logger.info(`Registered ${commands.length} slash commands`);
    } catch (err) {
      logger.error({ err }, "Failed to register slash commands");
    }
  });
}
