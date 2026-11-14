import type { Lang } from "../../i18n";

const en = {
  noPermission: "❌ You don't have permission to do this.",
  defaultReason: "Server Lockdown",
  lockTitle: "🔒 Server Lockdown",
  lockDesc: (locked: number, reason: string) =>
    `**${locked}** channels have been locked.\n**Reason:** ${reason}`,
  unlockTitle: "🔓 Server Unlocked",
  unlockDesc: (unlocked: number) => `**${unlocked}** channels have been unlocked.`,
};

type Strings = typeof en;

const de: Strings = {
  noPermission: "❌ Du hast keine Berechtigung dafür.",
  defaultReason: "Server Lockdown",
  lockTitle: "🔒 Server Lockdown",
  lockDesc: (locked: number, reason: string) =>
    `**${locked}** Kanäle wurden gesperrt.\n**Grund:** ${reason}`,
  unlockTitle: "🔓 Server Unlocked",
  unlockDesc: (unlocked: number) => `**${unlocked}** Kanäle wurden entsperrt.`,
};

const sv: Strings = {
  noPermission: "❌ Du har inte behörighet att göra detta.",
  defaultReason: "Server Lockdown",
  lockTitle: "🔒 Server Lockdown",
  lockDesc: (locked: number, reason: string) =>
    `**${locked}** kanaler har låsts.\n**Anledning:** ${reason}`,
  unlockTitle: "🔓 Server Upplåst",
  unlockDesc: (unlocked: number) => `**${unlocked}** kanaler har låsts upp.`,
};

const nl: Strings = {
  noPermission: "❌ Je hebt hier geen toestemming voor.",
  defaultReason: "Server Lockdown",
  lockTitle: "🔒 Server Lockdown",
  lockDesc: (locked: number, reason: string) =>
    `**${locked}** kanalen zijn vergrendeld.\n**Reden:** ${reason}`,
  unlockTitle: "🔓 Server Ontgrendeld",
  unlockDesc: (unlocked: number) => `**${unlocked}** kanalen zijn ontgrendeld.`,
};

const ar: Strings = {
  noPermission: "❌ ليس لديك الصلاحية للقيام بذلك.",
  defaultReason: "إغلاق الخادم",
  lockTitle: "🔒 إغلاق الخادم",
  lockDesc: (locked: number, reason: string) =>
    `تم إغلاق **${locked}** قناة.\n**السبب:** ${reason}`,
  unlockTitle: "🔓 تم فتح الخادم",
  unlockDesc: (unlocked: number) => `تم فتح **${unlocked}** قناة.`,
};

export const lockdown: Record<Lang, Strings> = { en, de, sv, nl, ar };
