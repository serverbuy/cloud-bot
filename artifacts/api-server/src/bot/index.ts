import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import { logger } from "../lib/logger";
import { registerEvents } from "./events";
import { registerCommands } from "./commands/register";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,      // Privileged — enable in Dev Portal
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,    // Privileged — enable in Dev Portal
  ],
  partials: [Partials.Channel, Partials.Message],
});

export async function startBot() {
  const token = process.env["DISCORD_BOT_TOKEN"];
  if (!token) {
    logger.error("DISCORD_BOT_TOKEN is not set");
    return;
  }

  registerEvents(client);
  await registerCommands(token);

  await client.login(token);
  logger.info("Discord bot logged in");
}
