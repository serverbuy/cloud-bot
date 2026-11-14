import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import { logger } from "../lib/logger";
import { registerEvents } from "./events";
import { registerCommands } from "./commands/register";
import { initStore } from "./lib/store";
import { startReminderLoop } from "./commands/tools";

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

export const botState: { status: "starting" | "online" | "error" | "disabled"; error: string | null } = {
  status: "starting",
  error: null,
};

client.once("clientReady", async () => {
  botState.status = "online";
  botState.error = null;
  await initStore(client);
  startReminderLoop(client);
});

export async function startBot() {
  const token = process.env["DISCORD_BOT_TOKEN"]?.trim();
  if (!token) {
    botState.status = "error";
    botState.error = "DISCORD_BOT_TOKEN is not set";
    logger.error("DISCORD_BOT_TOKEN is not set");
    return;
  }

  registerEvents(client);
  await registerCommands(token);

  try {
    await client.login(token);
    logger.info("Discord bot logged in");
  } catch (err) {
    botState.status = "error";
    botState.error = err instanceof Error ? err.message : String(err);
    logger.error({ err }, "Discord login failed");
  }
}
