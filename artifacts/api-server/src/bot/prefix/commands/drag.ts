import { Message, PermissionFlagsBits, GuildMember } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";

export const dragCmd: PrefixCommand = {
  name: "d",
  aliases: ["drag", "move"],
  description: "Drag a user into your voice channel / Nutzer in deinen VC ziehen",
  usage: ",d @user",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.MoveMembers)) {
      await message.reply(L.common.noPermission); return;
    }
    const target = message.mentions.members?.first() as GuildMember | undefined;
    if (!target) { await message.reply(L.common.noTarget); return; }
    const myVc = message.member?.voice.channel;
    if (!myVc) {
      await message.reply("❌ Du bist in keinem Voice-Kanal.");
      return;
    }
    const targetVc = target.voice.channel;
    if (!targetVc) {
      await message.reply("❌ Dieser Nutzer ist in keinem Voice-Kanal.");
      return;
    }
    if (targetVc.id === myVc.id) {
      await message.reply("❌ Der Nutzer ist bereits in deinem Kanal.");
      return;
    }
    try {
      await target.voice.setChannel(myVc);
      await message.reply(`✅ <@${target.id}> wurde in <#${myVc.id}> gezogen!`);
    } catch {
      await message.reply("❌ Ich kann diesen Nutzer nicht verschieben.");
    }
  },
};
