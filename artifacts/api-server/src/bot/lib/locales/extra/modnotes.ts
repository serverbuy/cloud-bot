import type { Lang } from "../../i18n";

const en = {
  noPermission: "❌ You don't have permission to do this.",
  noTarget: "❌ Please mention a user.",
  noText: "❌ Please provide a note text.",
  added: (targetId: string, count: number) =>
    `✅ Note added for <@${targetId}>.\nTotal: **${count}** note(s).`,
  noNotes: (username: string) => `✅ No notes for ${username}.`,
  listTitle: (username: string) => `📝 Mod Notes — ${username}`,
  noteLine: (index: number, text: string, timestamp: number, moderator: string) =>
    `**${index}.** ${text}\n⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  invalidIndex: "❌ Invalid index.",
  removed: (index: number, username: string) =>
    `✅ Note #${index} removed from ${username}.`,
};

type Strings = typeof en;

const de: Strings = {
  noPermission: "❌ Du hast keine Berechtigung dafür.",
  noTarget: "❌ Bitte markiere einen Nutzer.",
  noText: "❌ Bitte gib einen Notiz-Text an.",
  added: (targetId: string, count: number) =>
    `✅ Notiz für <@${targetId}> hinzugefügt.\nGesamt: **${count}** Notiz(en).`,
  noNotes: (username: string) => `✅ Keine Notizen für ${username}.`,
  listTitle: (username: string) => `📝 Mod-Notizen — ${username}`,
  noteLine: (index: number, text: string, timestamp: number, moderator: string) =>
    `**${index}.** ${text}\n⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  invalidIndex: "❌ Ungültiger Index.",
  removed: (index: number, username: string) =>
    `✅ Notiz #${index} von ${username} entfernt.`,
};

const sv: Strings = {
  noPermission: "❌ Du har inte behörighet att göra detta.",
  noTarget: "❌ Vänligen nämn en användare.",
  noText: "❌ Vänligen ange en anteckningstext.",
  added: (targetId: string, count: number) =>
    `✅ Anteckning tillagd för <@${targetId}>.\nTotalt: **${count}** anteckning(ar).`,
  noNotes: (username: string) => `✅ Inga anteckningar för ${username}.`,
  listTitle: (username: string) => `📝 Mod-anteckningar — ${username}`,
  noteLine: (index: number, text: string, timestamp: number, moderator: string) =>
    `**${index}.** ${text}\n⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  invalidIndex: "❌ Ogiltigt index.",
  removed: (index: number, username: string) =>
    `✅ Anteckning #${index} borttagen från ${username}.`,
};

const nl: Strings = {
  noPermission: "❌ Je hebt hier geen toestemming voor.",
  noTarget: "❌ Vermeld alsjeblieft een gebruiker.",
  noText: "❌ Geef alsjeblieft een notitietekst op.",
  added: (targetId: string, count: number) =>
    `✅ Notitie toegevoegd voor <@${targetId}>.\nTotaal: **${count}** notitie(s).`,
  noNotes: (username: string) => `✅ Geen notities voor ${username}.`,
  listTitle: (username: string) => `📝 Mod-notities — ${username}`,
  noteLine: (index: number, text: string, timestamp: number, moderator: string) =>
    `**${index}.** ${text}\n⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  invalidIndex: "❌ Ongeldige index.",
  removed: (index: number, username: string) =>
    `✅ Notitie #${index} verwijderd van ${username}.`,
};

const ar: Strings = {
  noPermission: "❌ ليس لديك صلاحية للقيام بذلك.",
  noTarget: "❌ يرجى الإشارة إلى مستخدم.",
  noText: "❌ يرجى إدخال نص الملاحظة.",
  added: (targetId: string, count: number) =>
    `✅ تمت إضافة ملاحظة لـ <@${targetId}>.\nالإجمالي: **${count}** ملاحظة.`,
  noNotes: (username: string) => `✅ لا توجد ملاحظات لـ ${username}.`,
  listTitle: (username: string) => `📝 ملاحظات المشرفين — ${username}`,
  noteLine: (index: number, text: string, timestamp: number, moderator: string) =>
    `**${index}.** ${text}\n⏱️ <t:${timestamp}:R> · ✍️ <@${moderator}>`,
  invalidIndex: "❌ فهرس غير صالح.",
  removed: (index: number, username: string) =>
    `✅ تمت إزالة الملاحظة رقم ${index} من ${username}.`,
};

export const modnotes: Record<Lang, Strings> = { en, de, sv, nl, ar };
