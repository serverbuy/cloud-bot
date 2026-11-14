import { Message, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { modnotes } from "../../lib/locales/extra/modnotes";

interface Note { text: string; moderator: string; timestamp: number; }
const modNotes = new Map<string, Note[]>(); // guildId-userId → notes

export const noteAddCmd: PrefixCommand = {
  name: "note",
  aliases: ["modnote", "addnote"],
  description: "Add a mod note / Mod-Notiz hinzufügen",
  usage: ",note @user <text>",
  async execute(message, args) {
    const t = modnotes[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply(t.noPermission); return;
    }
    const target = message.mentions.users.first();
    if (!target) { await message.reply(t.noTarget); return; }
    const text = args.slice(1).join(" ");
    if (!text) { await message.reply(t.noText); return; }
    const key = `${message.guildId}-${target.id}`;
    const notes = modNotes.get(key) ?? [];
    notes.push({ text, moderator: message.author.id, timestamp: Date.now() });
    modNotes.set(key, notes);
    await message.reply(t.added(target.id, notes.length));
  },
};

export const noteListCmd: PrefixCommand = {
  name: "notes",
  aliases: ["modnotes", "viewnotes"],
  description: "View mod notes / Mod-Notizen anzeigen",
  usage: ",notes @user",
  async execute(message) {
    const t = modnotes[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply(t.noPermission); return;
    }
    const target = message.mentions.users.first() ?? message.author;
    const key = `${message.guildId}-${target.id}`;
    const notes = modNotes.get(key) ?? [];
    if (notes.length === 0) {
      await message.reply(t.noNotes(target.username)); return;
    }
    const embed = new EmbedBuilder()
      .setTitle(t.listTitle(target.username))
      .setDescription(
        notes.map((n, i) => t.noteLine(i + 1, n.text, Math.floor(n.timestamp / 1000), n.moderator)).join("\n\n")
      ).setColor(0x5865f2).setThumbnail(target.displayAvatarURL());
    await message.channel.send({ embeds: [embed] });
  },
};

export const noteRemoveCmd: PrefixCommand = {
  name: "noteremove",
  aliases: ["rmnote", "delnote"],
  description: "Remove a mod note / Mod-Notiz entfernen",
  usage: ",noteremove @user <index>",
  async execute(message, args) {
    const t = modnotes[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      await message.reply(t.noPermission); return;
    }
    const target = message.mentions.users.first();
    if (!target) { await message.reply(t.noTarget); return; }
    const idx = parseInt(args[args.length - 1] ?? "") - 1;
    const key = `${message.guildId}-${target.id}`;
    const notes = modNotes.get(key);
    if (!notes || idx < 0 || idx >= notes.length) {
      await message.reply(t.invalidIndex); return;
    }
    notes.splice(idx, 1);
    modNotes.set(key, notes);
    await message.reply(t.removed(idx + 1, target.username));
  },
};
