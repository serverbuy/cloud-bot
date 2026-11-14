import { Message, EmbedBuilder, PermissionFlagsBits, GuildMember } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang, getLangCode } from "../../lib/i18n";
import { warnsystem } from "../../lib/locales/extra/warnsystem";
import { sendModLog } from "../../lib/modLog";

export interface WarnEntry { reason: string; moderator: string; timestamp: number; }
export const warnHistory = new Map<string, WarnEntry[]>();

export const warnAddCmd: PrefixCommand = {
  name: "warns",
  aliases: ["warning", "warnlist"],
  description: "Show warn history / Verwarn-Historie anzeigen",
  usage: ",warns @user",
  async execute(message) {
    const tr = warnsystem[getLangCode(message.guildId ?? "")];
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(tr.noTarget); return; }
    const key = `${message.guildId}-${target.id}`;
    const warns = warnHistory.get(key) ?? [];
    if (warns.length === 0) {
      await message.reply(tr.noWarns(target.displayName)); return;
    }
    const embed = new EmbedBuilder()
      .setTitle(tr.listTitle(target.displayName))
      .setDescription(
        warns.map((w, i) => tr.warnLine(i + 1, w.reason, Math.floor(w.timestamp / 1000), w.moderator)).join("\n\n")
      ).setColor(0xfee75c).setThumbnail(target.user.displayAvatarURL());
    await message.channel.send({ embeds: [embed] });
  },
};

export const warnRemoveCmd: PrefixCommand = {
  name: "warnremove",
  aliases: ["unwarn", "rmwarn"],
  description: "Remove a warn / Verwarnung entfernen",
  usage: ",warnremove @user <index>",
  async execute(message, args) {
    const tr = warnsystem[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply(tr.noPermission); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(tr.noTarget); return; }
    const idx = parseInt(args[args.length - 1] ?? "") - 1;
    const key = `${message.guildId}-${target.id}`;
    const warns = warnHistory.get(key);
    if (!warns || idx < 0 || idx >= warns.length) {
      await message.reply(tr.invalidIndex); return;
    }
    warns.splice(idx, 1);
    warnHistory.set(key, warns);
    await message.reply(tr.removed(idx + 1, target.displayName, warns.length));
  },
};

export async function addWarn(guildId: string, targetId: string, reason: string, moderatorId: string) {
  const key = `${guildId}-${targetId}`;
  const warns = warnHistory.get(key) ?? [];
  warns.push({ reason, moderator: moderatorId, timestamp: Date.now() });
  warnHistory.set(key, warns);
  return warns.length;
}
