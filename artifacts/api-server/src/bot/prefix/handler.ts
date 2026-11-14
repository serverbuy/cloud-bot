import { Message } from "discord.js";
import { logger } from "../../lib/logger";
import { prefixCommands } from "./commands";
import { trackCommand } from "../prefix/commands/botStats";

export const PREFIX = ",";

export async function handlePrefixCommand(message: Message) {
  if (message.author.bot) return;
  if (!message.inGuild()) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/\s+/);
  const commandName = args.shift()?.toLowerCase();
  if (!commandName) return;

  const cmd = prefixCommands.get(commandName);
  if (!cmd) return;

  try {
    trackCommand(cmd.name);
    await cmd.execute(message, args);
  } catch (err) {
    logger.error({ err, command: commandName }, "Prefix command error");
    await message.reply("❌ Ein Fehler ist aufgetreten.").catch(() => {});
  }
}
