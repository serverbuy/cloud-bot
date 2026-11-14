import { Message } from "discord.js";

export interface PrefixCommand {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  execute(message: Message<true>, args: string[]): Promise<void>;
}
