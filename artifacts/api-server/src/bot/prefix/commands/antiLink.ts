import { EmbedBuilder, PermissionFlagsBits } from "discord.js";
import type { PrefixCommand } from "../types";
import { autoModSettings } from "./autoMod";
import { getLangCode } from "../../lib/i18n";
import { antilink } from "../../lib/locales/extra/antilink";

type ExtSettings = ReturnType<typeof autoModSettings.get> & { bypassRoles?: string[]; exemptChannels?: string[] };

function getExt(gid: string): ExtSettings {
  const base = autoModSettings.get(gid) ?? {
    antiSpam: false, antiCaps: false, antiLinks: false,
    spamThreshold: 5, capsThreshold: 70, excludedChannels: [],
  };
  return base as ExtSettings;
}

export const antiLinkCmd: PrefixCommand = {
  name: "antilink",
  aliases: ["linkfilter", "linkschutz"],
  description: "Anti-Link System — Links automatisch löschen",
  usage: ",antilink <on|off|bypass @role|exempt #kanal|status>",
  async execute(message, args) {
    const t = antilink[getLangCode(message.guildId ?? "")];
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await message.reply(t.noPermission); return;
    }
    const gid = message.guildId!;
    const s = getExt(gid);
    const sub = args[0]?.toLowerCase();

    if (!sub || sub === "status") {
      const statusText = s.antiLinks ? t.active : t.inactive;
      const bypassText = (s.bypassRoles ?? []).length > 0 ? (s.bypassRoles!).map((id) => `<@&${id}>`).join(", ") : t.none;
      const exemptText = (s.exemptChannels ?? []).length > 0 ? (s.exemptChannels!).map((id) => `<#${id}>`).join(", ") : t.none;
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(t.statusTitle)
            .setDescription(t.statusDesc(statusText, bypassText, exemptText))
            .setColor(s.antiLinks ? 0x00ff00 : 0xff0000)
            .setTimestamp(),
        ],
      });
      return;
    }

    if (sub === "on") {
      autoModSettings.set(gid, { ...s, antiLinks: true } as any);
      await message.reply(t.enabled);
    } else if (sub === "off") {
      autoModSettings.set(gid, { ...s, antiLinks: false } as any);
      await message.reply(t.disabled);
    } else if (sub === "bypass") {
      const role = message.mentions.roles.first();
      if (!role) { await message.reply(t.noRole); return; }
      const list = s.bypassRoles ?? [];
      const was = list.includes(role.id);
      const updated = was ? list.filter((id) => id !== role.id) : [...list, role.id];
      autoModSettings.set(gid, { ...s, bypassRoles: updated } as any);
      await message.reply(t.bypassToggle(role.id, was));
    } else if (sub === "exempt") {
      const ch = message.mentions.channels.first();
      if (!ch) { await message.reply(t.noChannel); return; }
      const list = s.exemptChannels ?? [];
      const was = list.includes(ch.id);
      const updated = was ? list.filter((id) => id !== ch.id) : [...list, ch.id];
      autoModSettings.set(gid, { ...s, exemptChannels: updated } as any);
      await message.reply(t.exemptToggle(ch.id, was));
    } else {
      await message.reply(t.optionsHelp);
    }
  },
};
