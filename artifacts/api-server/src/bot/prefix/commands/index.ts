import { Collection } from "discord.js";
import type { PrefixCommand } from "../types";
import { logger } from "../../../lib/logger";
import { kickCmd, banCmd, unbanCmd, timeoutCmd, purgeCmd, warnCmd } from "./moderation";
import { roleCmd, roleAddCmd, roleRemoveCmd, roleListCmd } from "./role";
import { userinfoCmd, serverinfoCmd, avatarCmd, botinfoCmd, pingCmd, helpCmd } from "./info";
import { giveawayStartCmd, giveawayEndCmd, giveawayRerollCmd, giveawayListCmd } from "./giveaway";
import { ticketSetupCmd, ticketCloseCmd } from "./ticket";
import { vcSetupSetCmd, vcSetupRemoveCmd, vcSetupStatusCmd } from "./vcsetup";
import { autoRoleSetCmd, autoRoleRemoveCmd, autoRoleStatusCmd } from "./autorole";
import { jailCmd, unjailCmd } from "./jail";
import { logSetupCmd, logRemoveCmd } from "./logsetup";
import { marryCmd, divorceCmd, partnerCmd } from "./marriage";
import { levelCmd, leaderboardCmd } from "./level";
import { eightballCmd, coinflipCmd, diceCmd, pollCmd, rpsCmd } from "./fun";
import { languageCmd } from "./language";
import { afkCmd } from "./afk";
import { remindCmd } from "./reminder";
import { dragCmd } from "./drag";
import { slotsCmd } from "./slots";
import { blackjackCmd } from "./blackjack";
import { embedCmd } from "./customembed";
import { reactionRoleCmd } from "../../handlers/reactionRole";
import { serverSetupCmd } from "./serverSetup";
import { dailyCmd, balanceCmd, workCmd, payCmd, coinLeaderboardCmd, crimeCmd } from "./economy";
import { warnAddCmd, warnRemoveCmd } from "./warnSystem";
import { autoModCmd } from "./autoMod";
import { antiNukeCmd } from "./antiNuke";
import { antiLinkCmd } from "./antiLink";
import { vcPanelCmd } from "./vcPanel";
import { xpRoleSetCmd, levelSetupCmd } from "./xpRoles";
import { noteAddCmd, noteListCmd, noteRemoveCmd } from "./modNotes";
import { birthdaySetCmd, birthdayListCmd } from "./birthday";
import { botStatsCmd } from "./botStats";
import { customCmdAdd } from "./customCommands";
import { lockdownCmd, unlockdownCmd } from "./lockdown";
import { reportCmd, reportBanCmd } from "./report";
import { setWelcomeCmd } from "./setwelcome";
import { funExtraCommands } from "./funExtra";
import { utilityCommands } from "./utility";
import { economyExtraCommands } from "./economyExtra";
import { moderationExtraCommands } from "./moderationExtra";
import { infoExtraCommands } from "./infoExtra";
import { createRolesCmd } from "./createRoles";
import { createTeamCmd } from "./createTeam";

export const prefixCommands = new Collection<string, PrefixCommand>();

const allCommands: PrefixCommand[] = [
  kickCmd, banCmd, unbanCmd, timeoutCmd, purgeCmd, warnCmd,
  jailCmd, unjailCmd,
  logSetupCmd, logRemoveCmd,
  roleCmd, roleAddCmd, roleRemoveCmd, roleListCmd,
  createRolesCmd,
  createTeamCmd,
  userinfoCmd, serverinfoCmd, avatarCmd, botinfoCmd, pingCmd, helpCmd,
  giveawayStartCmd, giveawayEndCmd, giveawayRerollCmd, giveawayListCmd,
  ticketSetupCmd, ticketCloseCmd,
  vcSetupSetCmd, vcSetupRemoveCmd, vcSetupStatusCmd,
  autoRoleSetCmd, autoRoleRemoveCmd, autoRoleStatusCmd,
  marryCmd, divorceCmd, partnerCmd,
  levelCmd, leaderboardCmd,
  eightballCmd, coinflipCmd, diceCmd, pollCmd, rpsCmd,
  languageCmd,
  afkCmd,
  remindCmd,
  dragCmd,
  slotsCmd,
  blackjackCmd,
  embedCmd,
  reactionRoleCmd,
  serverSetupCmd,
  dailyCmd, balanceCmd, workCmd, payCmd, coinLeaderboardCmd, crimeCmd,
  warnAddCmd, warnRemoveCmd,
  autoModCmd,
  antiNukeCmd,
  antiLinkCmd,
  vcPanelCmd,
  xpRoleSetCmd, levelSetupCmd,
  noteAddCmd, noteListCmd, noteRemoveCmd,
  birthdaySetCmd, birthdayListCmd,
  botStatsCmd,
  customCmdAdd,
  lockdownCmd, unlockdownCmd,
  reportCmd, reportBanCmd,
  setWelcomeCmd,
  ...funExtraCommands,
  ...utilityCommands,
  ...economyExtraCommands,
  ...moderationExtraCommands,
  ...infoExtraCommands,
];

for (const cmd of allCommands) {
  const triggers = [cmd.name, ...(cmd.aliases ?? [])];
  for (const trigger of triggers) {
    const existing = prefixCommands.get(trigger);
    if (existing && existing.name !== cmd.name) {
      logger.warn(
        `Duplicate prefix command trigger "${trigger}": "${existing.name}" is being overridden by "${cmd.name}"`
      );
    }
    prefixCommands.set(trigger, cmd);
  }
}
