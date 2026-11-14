import type { Lang } from "../../i18n";

const en = {
  noTarget: "❌ Please mention a member.",
  noWarns: (name: string) => `✅ ${name} has no warnings.`,
  listTitle: (name: string) => `⚠️ Warnings — ${name}`,
  warnLine: (index: number, reason: string, timestamp: number, moderator: string) =>
    `${index}. **${reason}** \n   ⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  noPermission: "❌ You don't have permission to do this.",
  invalidIndex: "❌ Invalid index.",
  removed: (index: number, name: string, remaining: number) =>
    `✅ Warning #${index} removed from ${name}.\n\u26a0️ Remaining: ${remaining}`,
};

type Strings = typeof en;

const de: Strings = {
  noTarget: "❌ Bitte markiere ein Mitglied.",
  noWarns: (name: string) => `✅ ${name} hat keine Verwarnungen.`,
  listTitle: (name: string) => `⚠️ Verwarnungen — ${name}`,
  warnLine: (index: number, reason: string, timestamp: number, moderator: string) =>
    `${index}. **${reason}** \n   ⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  noPermission: "❌ Du hast keine Berechtigung dafür.",
  invalidIndex: "❌ Ungültiger Index.",
  removed: (index: number, name: string, remaining: number) =>
    `✅ Verwarnung #${index} von ${name} entfernt.\n\u26a0️ Verbleibend: ${remaining}`,
};

const sv: Strings = {
  noTarget: "❌ Vänligen nämn en medlem.",
  noWarns: (name: string) => `✅ ${name} har inga varningar.`,
  listTitle: (name: string) => `⚠️ Varningar — ${name}`,
  warnLine: (index: number, reason: string, timestamp: number, moderator: string) =>
    `${index}. **${reason}** \n   ⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  noPermission: "❌ Du har inte behörighet att göra detta.",
  invalidIndex: "❌ Ogiltigt index.",
  removed: (index: number, name: string, remaining: number) =>
    `✅ Varning #${index} borttagen från ${name}.\n\u26a0️ Återstående: ${remaining}`,
};

const nl: Strings = {
  noTarget: "❌ Vermeld alsjeblieft een lid.",
  noWarns: (name: string) => `✅ ${name} heeft geen waarschuwingen.`,
  listTitle: (name: string) => `⚠️ Waarschuwingen — ${name}`,
  warnLine: (index: number, reason: string, timestamp: number, moderator: string) =>
    `${index}. **${reason}** \n   ⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  noPermission: "❌ Je hebt hier geen toestemming voor.",
  invalidIndex: "❌ Ongeldige index.",
  removed: (index: number, name: string, remaining: number) =>
    `✅ Waarschuwing #${index} verwijderd van ${name}.\n\u26a0️ Resterend: ${remaining}`,
};

const ar: Strings = {
  noTarget: "❌ يرجى الإشارة إلى عضو.",
  noWarns: (name: string) => `✅ ${name} ليس لديه أي تحذيرات.`,
  listTitle: (name: string) => `⚠️ التحذيرات — ${name}`,
  warnLine: (index: number, reason: string, timestamp: number, moderator: string) =>
    `${index}. **${reason}** \n   ⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  noPermission: "❌ ليس لديك صلاحية للقيام بذلك.",
  invalidIndex: "❌ فهرس غير صالح.",
  removed: (index: number, name: string, remaining: number) =>
    `✅ تمت إزالة التحذير رقم ${index} من ${name}.\n\u26a0️ المتبقي: ${remaining}`,
};

export const warnsystem: Record<Lang, Strings> = { en, de, sv, nl, ar };
