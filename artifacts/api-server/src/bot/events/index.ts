import { Client, Events, AuditLogEvent } from "discord.js";
import { logger } from "../../lib/logger";
import { getLang } from "../lib/i18n";
import { commands } from "../commands/register";
import { handleVoiceStateUpdate, handleVcButton, handleVcModal } from "../handlers/vcCreate";
import { handleTicketCreate, handleTicketClose } from "../handlers/ticket";
import { handleGuildMemberAdd } from "../handlers/welcome";
import { handlePrefixCommand } from "../prefix/handler";
import { handleGiveawayButton } from "../prefix/commands/giveaway";
import { handleMarriageButton } from "../prefix/commands/marriage";
import { handleRpsButton } from "../prefix/commands/fun";
import { handleXpGain } from "../prefix/commands/level";
import { handleAfkMention } from "../prefix/commands/afk";
import { handleBlackjackButton } from "../prefix/commands/blackjack";
import { handleMessageDelete, handleMessageUpdate } from "../handlers/messageLog";
import { handleReactionRoleButton } from "../handlers/reactionRole";
import { handleAutoMod } from "../prefix/commands/autoMod";
import { handleCustomCommands } from "../prefix/commands/customCommands";
import { handleStarboardReaction } from "../handlers/starboard";
import { checkBirthdays } from "../prefix/commands/birthday";
import { checkXpRoleRewards } from "../prefix/commands/xpRoles";
import { handleHelpButton } from "../handlers/helpHandler";
import { handleAntiNukeBan, handleAntiNukeChannelDelete, handleAntiNukeRoleDelete } from "../prefix/commands/antiNuke";
import { handleVcPanelButton, handleVcPanelModal } from "../prefix/commands/vcPanel";

export function registerEvents(client: Client) {
  client.once(Events.ClientReady, (c) => {
    logger.info(`Bot logged in as ${c.user.tag}`);
  });

  client.on(Events.MessageCreate, async (message) => {
    await handleCustomCommands(message).catch(() => {});
    await handleAutoMod(message).catch(() => {});
    await handleXpGain(message).catch(() => {});
    await handleAfkMention(message).catch(() => {});
    await handlePrefixCommand(message).catch((err) =>
      logger.error({ err }, "Prefix command error")
    );
  });

  client.on(Events.MessageDelete, async (message) => {
    await handleMessageDelete(message).catch((err) => logger.error({ err }, "Message delete log error"));
  });

  client.on(Events.MessageUpdate, async (oldMsg, newMsg) => {
    await handleMessageUpdate(oldMsg, newMsg).catch((err) => logger.error({ err }, "Message update log error"));
  });

  // Anti-Nuke: monitor bans, channel deletes, role deletes via audit log
  client.on(Events.GuildBanAdd, async (ban) => {
    const entries = await ban.guild.fetchAuditLogs({ type: AuditLogEvent.MemberBanAdd, limit: 1 }).catch(() => null);
    const entry = entries?.entries.first();
    if (entry?.executor && !entry.executor.bot) {
      await handleAntiNukeBan(ban.guild, entry.executor.id).catch(() => {});
    }
  });

  client.on(Events.ChannelDelete, async (channel) => {
    if (!("guild" in channel) || !channel.guild) return;
    const entries = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 1 }).catch(() => null);
    const entry = entries?.entries.first();
    if (entry?.executor && !entry.executor.bot) {
      await handleAntiNukeChannelDelete(channel.guild, entry.executor.id).catch(() => {});
    }
  });

  client.on(Events.GuildRoleDelete, async (role) => {
    const entries = await role.guild.fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 1 }).catch(() => null);
    const entry = entries?.entries.first();
    if (entry?.executor && !entry.executor.bot) {
      await handleAntiNukeRoleDelete(role.guild, entry.executor.id).catch(() => {});
    }
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const cmd = commands.find((c) => c.data.name === interaction.commandName);
      if (!cmd) return;
      try {
        await cmd.execute(interaction);
      } catch (err) {
        logger.error({ err, command: interaction.commandName }, "Command error");
        const msg = { content: getLang(interaction.guildId ?? "").common.error, ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(msg).catch(() => {});
        } else {
          await interaction.reply(msg).catch(() => {});
        }
      }
      return;
    }

    if (interaction.isButton()) {
      const id = interaction.customId;

      if (id === "ticket_create") {
        await handleTicketCreate(interaction).catch((err) => logger.error({ err }, "Ticket create error"));
        return;
      }
      if (id === "ticket_close_btn") {
        await handleTicketClose(interaction).catch((err) => logger.error({ err }, "Ticket close error"));
        return;
      }
      if (id.startsWith("vcpanel_")) {
        await handleVcPanelButton(interaction).catch((err) => logger.error({ err }, "VC panel button error"));
        return;
      }
      if (id.startsWith("vc_")) {
        await handleVcButton(interaction).catch((err) => logger.error({ err }, "VC button error"));
        return;
      }
      if (id.startsWith("giveaway_join_") || id.startsWith("giveaway_reroll_")) {
        handleGiveawayButton(interaction);
        return;
      }
      if (id.startsWith("marry_")) {
        await handleMarriageButton(interaction).catch((err) => logger.error({ err }, "Marriage button error"));
        return;
      }
      if (id.startsWith("rps_")) {
        await handleRpsButton(interaction).catch((err) => logger.error({ err }, "RPS button error"));
        return;
      }
      if (id.startsWith("bj_")) {
        await handleBlackjackButton(interaction).catch((err) => logger.error({ err }, "Blackjack button error"));
        return;
      }
      if (id.startsWith("rr_")) {
        await handleReactionRoleButton(interaction).catch((err) => logger.error({ err }, "Reaction role button error"));
        return;
      }
      if (id.startsWith("help_nav_")) {
        await handleHelpButton(interaction).catch((err) => logger.error({ err }, "Help button error"));
        return;
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith("vc_")) {
        await handleVcModal(interaction).catch((err) => logger.error({ err }, "VC modal error"));
        return;
      }
      if (interaction.customId.startsWith("vcpanel_renamemodal_")) {
        await handleVcPanelModal(interaction).catch((err) => logger.error({ err }, "VC panel modal error"));
        return;
      }
    }
  });

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    await handleStarboardReaction(reaction, user).catch((err) => logger.error({ err }, "Starboard error"));
  });

  client.on(Events.MessageReactionRemove, async (reaction, user) => {
    await handleStarboardReaction(reaction, user).catch((err) => logger.error({ err }, "Starboard update error"));
  });

  const birthdayInterval = setInterval(() => {
    for (const guild of client.guilds.cache.values()) {
      checkBirthdays(guild).catch(() => {});
    }
  }, 60 * 60 * 1000);
  client.on(Events.ShardDisconnect, () => clearInterval(birthdayInterval));

  client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);
  client.on(Events.GuildMemberAdd, handleGuildMemberAdd);
  client.on(Events.Error, (err) => logger.error({ err }, "Discord client error"));
  client.on(Events.Warn, (msg) => logger.warn({ msg }, "Discord warning"));
}
