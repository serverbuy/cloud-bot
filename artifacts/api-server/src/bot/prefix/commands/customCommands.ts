import { Message, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { customcommands } from "../../lib/locales/extra/customcommands";

const customCmds = new Map<string, Map<string, string>>(); // guildId → { trigger → response }

export const customCmdAdd: PrefixCommand = {
  name: "cmd",
  aliases: ["customcmd", "ccmd"],
  description: "Manage custom commands / Eigene Commands verwalten",
  usage: ",cmd add <trigger> <response> | ,cmd remove <trigger> | ,cmd list",
  async execute(message, args) {
    const t = customcommands[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageMessages)) {
      await message.reply(t.noPermission); return;
    }
    const guildId = message.guildId!;
    const cmds = customCmds.get(guildId) ?? new Map<string, string>();
    const sub = args[0]?.toLowerCase();

    if (sub === "list" || !sub) {
      if (cmds.size === 0) { await message.reply(t.noCommands); return; }
      const embed = new EmbedBuilder()
        .setTitle(t.listTitle)
        .setDescription(Array.from(cmds.entries()).map(([k, v]) => `\`${k}\` → ${v.slice(0, 50)}${v.length > 50 ? "..." : ""}`).join("\n"))
        .setColor(0x5865f2).setTimestamp();
      await message.channel.send({ embeds: [embed] }); return;
    }

    if (sub === "add") {
      const trigger = args[1]?.toLowerCase();
      const response = args.slice(2).join(" ");
      if (!trigger || !response) { await message.reply(t.addExample); return; }
      cmds.set(trigger, response);
      customCmds.set(guildId, cmds);
      await message.reply(t.added(trigger));
    } else if (sub === "remove") {
      const trigger = args[1]?.toLowerCase();
      if (!trigger || !cmds.has(trigger)) { await message.reply(t.notFound); return; }
      cmds.delete(trigger);
      customCmds.set(guildId, cmds);
      await message.reply(t.removed(trigger));
    } else {
      await message.reply(t.usageHint);
    }
  },
};

export async function handleCustomCommands(message: Message) {
  if (!message.inGuild() || message.author.bot) return;
  const cmds = customCmds.get(message.guildId);
  if (!cmds) return;
  const prefix = ",";
  const text = message.content.toLowerCase();
  if (!text.startsWith(prefix)) return;
  const trigger = text.slice(prefix.length).trim().split(/\s+/)[0];
  const response = cmds.get(trigger);
  if (response) await message.channel.send(response);
}
