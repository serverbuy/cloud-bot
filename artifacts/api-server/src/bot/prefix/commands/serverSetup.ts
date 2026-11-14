import { Message, PermissionFlagsBits, EmbedBuilder, ChannelType, OverwriteType, GuildChannel } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";
import { logger } from "../../../lib/logger";

const COMMUNITY_ROLES = [
  // Farben (20)
  { name: "🔴 Rot", color: 0xed4245 },
  { name: "🔵 Blau", color: 0x3498db },
  { name: "🟢 Grün", color: 0x57f287 },
  { name: "🟡 Gelb", color: 0xfee75c },
  { name: "🟣 Lila", color: 0x9b59b6 },
  { name: "🟠 Orange", color: 0xe67e22 },
  { name: "🎨 Rosa", color: 0xff69b4 },
  { name: "💧 Türkis", color: 0x1abc9c },
  { name: "⚪ Weiß", color: 0xecf0f1 },
  { name: "⚫ Schwarz", color: 0x2c3e50 },
  { name: "🔷 Grau", color: 0x95a5a6 },
  { name: "🟤 Braun", color: 0x8b4513 },
  { name: "💎 Gold", color: 0xffd700 },
  { name: "🔸 Silber", color: 0xc0c0c0 },
  { name: "💚 Cyan", color: 0x00ffff },
  { name: "💜 Magenta", color: 0xff00ff },
  { name: "💛 Limette", color: 0x32cd32 },
  { name: "💐 Koralle", color: 0xff7f50 },
  { name: "💙 Indigo", color: 0x4b0082 },
  { name: "💥 Olive", color: 0x808000 },

  // Superhelden (15)
  { name: "🛡️ Batman", color: 0x1a1a1a },
  { name: "🐣 Superman", color: 0x1e90ff },
  { name: "🕷️ Spider-Man", color: 0xe23636 },
  { name: "🛡️ Iron Man", color: 0xb87333 },
  { name: "💪 Hulk", color: 0x32cd32 },
  { name: "⚡ Thor", color: 0x87ceeb },
  { name: "🎭 Joker", color: 0x8a2be2 },
  { name: "⚡ Flash", color: 0xff0000 },
  { name: "🐠 Aquaman", color: 0x20b2aa },
  { name: "👸 Wonder Woman", color: 0xff1493 },
  { name: "💀 Deadpool", color: 0x8b0000 },
  { name: "🖤 Black Panther", color: 0x1a1a1a },
  { name: "🐅 Wolverine", color: 0xffd700 },
  { name: "💪 Captain America", color: 0x1e90ff },
  { name: "💎 Green Lantern", color: 0x00ff00 },

  // VIP / Status (20)
  { name: "👑 VIP", color: 0xffd700 },
  { name: "💎 OG", color: 0x00bfff },
  { name: "🏆 Legend", color: 0xffa500 },
  { name: "💧 Noob", color: 0x3498db },
  { name: "💀 Pro", color: 0x9b59b6 },
  { name: "🎮 Gamer", color: 0x2ecc71 },
  { name: "📺 Streamer", color: 0x9b59b6 },
  { name: "🎨 Artist", color: 0xff69b4 },
  { name: "🎵 Music", color: 0x1abc9c },
  { name: "💻 Coder", color: 0x34495e },
  { name: "💰 Rich", color: 0x27ae60 },
  { name: "💸 Broke", color: 0x95a5a6 },
  { name: "💵 Millionaire", color: 0xf1c40f },
  { name: "💡 Hustler", color: 0xe67e22 },
  { name: "📈 Investor", color: 0x2ecc71 },
  { name: "💹 Trader", color: 0x3498db },
  { name: "👑 King", color: 0xffd700 },
  { name: "👸 Queen", color: 0xff69b4 },
  { name: "💂 Knight", color: 0x95a5a6 },
  { name: "💪 Lord", color: 0x9b59b6 },

  // Persönlichkeit (20)
  { name: "😂 Funny", color: 0xf1c40f },
  { name: "😐 Serious", color: 0x34495e },
  { name: "😎 Chill", color: 0x1abc9c },
  { name: "👹 Toxic", color: 0x27ae60 },
  { name: "🤗 Kind", color: 0xff69b4 },
  { name: "😈 Savage", color: 0x8e44ad },
  { name: "💗 Simp", color: 0xff69b4 },
  { name: "💪 Alpha", color: 0xe74c3c },
  { name: "👑 Sigma", color: 0x2c3e50 },
  { name: "🧐 Beta", color: 0x3498db },
  { name: "💠 Kawaii", color: 0xff69b4 },
  { name: "💀 Emo", color: 0x1a1a1a },
  { name: "💫 Dreamer", color: 0x9b59b6 },
  { name: "🔥 Rizzler", color: 0xff4500 },
  { name: "💤 Sleepy", color: 0x87ceeb },
  { name: "💎 Bling", color: 0xffd700 },
  { name: "🌯 Spicy", color: 0xff4500 },
  { name: "🏄 Surfer", color: 0x1abc9c },
  { name: "🎧 DJ", color: 0xff69b4 },
  { name: "👊 Fighter", color: 0xe74c3c },

  // Hobbys / Interessen (20)
  { name: "⚽ Football", color: 0x27ae60 },
  { name: "🏀 Basketball", color: 0xe67e22 },
  { name: "🎾 Tennis", color: 0x2ecc71 },
  { name: "🏆 Gym", color: 0x95a5a6 },
  { name: "🎸 Guitar", color: 0x8e44ad },
  { name: "🎶 Piano", color: 0x1abc9c },
  { name: "🎨 Anime", color: 0xff69b4 },
  { name: "📖 Manga", color: 0x34495e },
  { name: "🎬 Movies", color: 0xf1c40f },
  { name: "📺 Series", color: 0x9b59b6 },
  { name: "🎰 Casino", color: 0xffd700 },
  { name: "📸 Photography", color: 0x2ecc71 },
  { name: "📐 Astrology", color: 0x9b59b6 },
  { name: "🌐 Traveler", color: 0x1abc9c },
  { name: "📚 Bookworm", color: 0x8b4513 },
  { name: "📲 TikTok", color: 0xff69b4 },
  { name: "📧 Meme", color: 0xffd700 },
  { name: "🏠 Architect", color: 0x95a5a6 },
  { name: "👾 Tech", color: 0x3498db },
  { name: "💡 Genius", color: 0xffd700 },
];

export const serverSetupCmd: PrefixCommand = {
  name: "server-setup",
  aliases: ["setup", "ssetup"],
  description: "Complete server setup / Komplette Server-Einrichtung",
  usage: ",server-setup",
  async execute(message) {
    const L = getLang(message.guildId!);
    if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) {
      await message.reply("❌ Nur Administratoren können das Server-Setup durchführen.");
      return;
    }

    const guild = message.guild!;
    const reply = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🛠️ Server-Setup gestartet")
          .setDescription("Das Server-Setup läuft... Bitte warten.\n\n**Schritte:**\n1. Community-Rollen erstellen\n2. Jail-System einrichten\n3. Server-Kanäle vorbereiten")
          .setColor(0xffd700)
      ]
    });

    let createdRoles = 0;
    let createdChannels = 0;
    let errors: string[] = [];

    // Step 1: Create community roles
    for (const roleDef of COMMUNITY_ROLES) {
      try {
        const exists = guild.roles.cache.find((r) => r.name === roleDef.name);
        if (!exists) {
          await guild.roles.create({
            name: roleDef.name,
            color: roleDef.color,
            reason: "Server-Setup by Cloud",
            permissions: [],
          });
          createdRoles++;
        }
        // Small delay to avoid rate limits
        if (createdRoles % 5 === 0) await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        errors.push(`Rolle ${roleDef.name}: ${(err as Error).message}`);
      }
    }

    // Step 2: Create Jail System
    try {
      const jailRoleName = "🔒 Jailed";
      let jailRole = guild.roles.cache.find((r) => r.name === jailRoleName);
      if (!jailRole) {
        jailRole = await guild.roles.create({
          name: jailRoleName,
          color: 0x808080,
          reason: "Jail system by Cloud",
          permissions: [],
        });
        createdRoles++;
      }

      // Deny all permissions on existing channels
      for (const channel of guild.channels.cache.values()) {
        if ("permissionOverwrites" in channel && channel.id !== message.channelId) {
          try {
            await (channel as GuildChannel).permissionOverwrites.create(jailRole, {
              ViewChannel: false,
              SendMessages: false,
              Connect: false,
              Speak: false,
              AddReactions: false,
              SendMessagesInThreads: false,
              SendVoiceMessages: false,
              SendTTSMessages: false,
              CreatePublicThreads: false,
              CreatePrivateThreads: false,
              EmbedLinks: false,
              AttachFiles: false,
              UseExternalEmojis: false,
              UseExternalStickers: false,
              UseApplicationCommands: false,
              ReadMessageHistory: false,
              UseEmbeddedActivities: false,
            });
          } catch {}
        }
      }

      // Create jail category
      const jailCatName = "🔒 Jail";
      let jailCategory = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildCategory && c.name === jailCatName
      ) as any;
      if (!jailCategory) {
        jailCategory = await guild.channels.create({
          name: jailCatName,
          type: ChannelType.GuildCategory,
          reason: "Jail system by Cloud",
        });
        createdChannels++;
      }

      // Create jail text channel
      const jailTextName = "🔒-jail-text";
      let jailText = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildText && c.name === jailTextName
      );
      if (!jailText) {
        await guild.channels.create({
          name: jailTextName,
          type: ChannelType.GuildText,
          parent: jailCategory.id,
          reason: "Jail system by Cloud",
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: jailRole.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ReadMessageHistory,
                PermissionFlagsBits.EmbedLinks,
                PermissionFlagsBits.AttachFiles,
              ],
            },
            {
              id: guild.members.me!.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ManageChannels,
                PermissionFlagsBits.ReadMessageHistory,
              ],
            },
          ],
        });
        createdChannels++;
      }

      // Create jail VC
      const jailVcName = "🔒-jail-vc";
      let jailVc = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildVoice && c.name === jailVcName
      );
      if (!jailVc) {
        await guild.channels.create({
          name: jailVcName,
          type: ChannelType.GuildVoice,
          parent: jailCategory.id,
          reason: "Jail system by Cloud",
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: jailRole.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.Speak,
              ],
            },
            {
              id: guild.members.me!.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
                PermissionFlagsBits.ManageChannels,
              ],
            },
          ],
        });
        createdChannels++;
      }
    } catch (err) {
      errors.push(`Jail-System: ${(err as Error).message}`);
    }

    // Step 3: Create useful server channels
    try {
      // Ticket category
      const ticketCatName = "🎫 Tickets";
      let ticketCat = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildCategory && c.name === ticketCatName
      );
      if (!ticketCat) {
        await guild.channels.create({
          name: ticketCatName,
          type: ChannelType.GuildCategory,
          reason: "Server-Setup by Cloud",
        });
        createdChannels++;
      }

      // Mod-Log
      const modLogName = "📋-mod-log";
      let modLog = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildText && c.name === modLogName
      );
      if (!modLog) {
        await guild.channels.create({
          name: modLogName,
          type: ChannelType.GuildText,
          reason: "Server-Setup by Cloud",
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: guild.members.me!.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
          ],
        });
        createdChannels++;
      }

      // Welcome
      const welcomeName = "👋-welcome";
      let welcomeCh = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildText && c.name === welcomeName
      );
      if (!welcomeCh) {
        await guild.channels.create({
          name: welcomeName,
          type: ChannelType.GuildText,
          reason: "Server-Setup by Cloud",
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
            },
          ],
        });
        createdChannels++;
      }

      // Rules
      const rulesName = "📌-regeln";
      let rulesCh = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildText && c.name === rulesName
      );
      if (!rulesCh) {
        await guild.channels.create({
          name: rulesName,
          type: ChannelType.GuildText,
          reason: "Server-Setup by Cloud",
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.AddReactions],
            },
          ],
        });
        createdChannels++;
      }

      // Join-to-Create
      const jtcName = "➡️-join-to-create";
      let jtcCh = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildVoice && c.name === jtcName
      );
      if (!jtcCh) {
        const jtc = await guild.channels.create({
          name: jtcName,
          type: ChannelType.GuildVoice,
          reason: "Server-Setup by Cloud",
        });
        // Import the vc setup map
        const { vcCreateChannels } = await import("../../handlers/vcCreate");
        vcCreateChannels.set(guild.id, jtc.id);
        createdChannels++;
      }
    } catch (err) {
      errors.push(`Server-Kanäle: ${(err as Error).message}`);
    }

    // Final update
    const embed = new EmbedBuilder()
      .setTitle("✅ Server-Setup abgeschlossen!")
      .setDescription(
        `Das Server-Setup ist fertig!\n\n**Erstellt:**\n🎭 **${createdRoles}** Rollen\n📢 **${createdChannels}** Kanäle\n\n` +
        `**Systeme:**\n🔒 Jail-System (Rolle + Text + VC)\n🎫 Ticket-Kategorie\n📋 Mod-Log\n👋 Willkommen\n📌 Regeln\n🔊 Join-to-Create VC\n\n` +
        (errors.length > 0
          ? `⚠️ **${errors.length}** Fehler aufgetreten (meist Rate-Limit):\n${errors.slice(0, 3).join("\n")}`
          : "✅ Alles ohne Fehler erstellt!")
      )
      .setColor(errors.length === 0 ? 0x57f287 : 0xfee75c)
      .setFooter({ text: "Powered by Cloud#0836" })
      .setTimestamp();

    await reply.edit({ embeds: [embed] });

    logger.info({ guildId: guild.id, roles: createdRoles, channels: createdChannels }, "Server setup completed");
  },
};
