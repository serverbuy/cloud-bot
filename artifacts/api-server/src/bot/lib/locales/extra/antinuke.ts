import type { Lang } from "../../i18n";

const en = {
  nukeTriggeredTitle: "🛡️ Anti-Nuke Triggered!",
  nukeTriggeredDesc: (userId: string, punishment: string, reason: string) =>
    `**User:** <@${userId}> (\`${userId}\`)\n` +
    `**Action:** ${punishment}\n` +
    `**Reason:** ${reason}`,
  banReason: (count: number) => `Anti-Nuke: ${count} bans in 10 seconds`,
  channelDeleteReason: (count: number) => `Anti-Nuke: ${count} channels deleted in 10 seconds`,
  roleDeleteReason: (count: number) => `Anti-Nuke: ${count} roles deleted in 10 seconds`,
  noAdmin: "❌ You need Administrator permissions.",
  statusTitle: "🛡️ Anti-Nuke Status",
  statusActive: "✅ Active",
  statusInactive: "❌ Inactive",
  notSet: "Not set",
  none: "None",
  statusDesc: (statusText: string, threshold: number, punishment: string, logChannel: string, whitelist: string) =>
    `**Status:** ${statusText}\n` +
    `**Threshold:** ${threshold} actions/10s\n` +
    `**Punishment:** \`${punishment}\`\n` +
    `**Log channel:** ${logChannel}\n` +
    `**Whitelist:** ${whitelist}`,
  enabled: "✅ Anti-Nuke **enabled**.",
  disabled: "✅ Anti-Nuke **disabled**.",
  invalidThreshold: "❌ Enter a number between 1 and 50.",
  thresholdSet: (val: number) => `✅ Threshold set to **${val}** actions/10s.`,
  invalidPunishment: "❌ Options: `ban`, `kick`, `strip`",
  punishmentSet: (p: string) =>
    `✅ Punishment set to **${p}**.\n> ban = Ban | kick = Kick | strip = Remove all roles`,
  noUser: "❌ Mention a user.",
  whitelistRemovedPart: "**removed** from the whitelist",
  whitelistAddedPart: "**added** to the whitelist",
  whitelistUpdated: (id: string, action: string) => `✅ <@${id}> was ${action}.`,
  noChannel: "❌ Mention a channel.",
  logChannelSet: (id: string) => `✅ Log channel set to <#${id}>.`,
  optionsHelp:
    "**,antinuke options:**\n" +
    "`on` / `off` — Enable the system\n" +
    "`threshold <1-50>` — Number of actions before intervention\n" +
    "`punishment <ban|kick|strip>` — Type of punishment\n" +
    "`whitelist @user` — Whitelist a user\n" +
    "`log #channel` — Log channel\n" +
    "`status` — Show settings",
};

type Strings = typeof en;

const de: Strings = {
  nukeTriggeredTitle: "🛡️ Anti-Nuke ausgelöst!",
  nukeTriggeredDesc: (userId: string, punishment: string, reason: string) =>
    `**Nutzer:** <@${userId}> (\`${userId}\`)\n` +
    `**Aktion:** ${punishment}\n` +
    `**Grund:** ${reason}`,
  banReason: (count: number) => `Anti-Nuke: ${count} Bans in 10 Sekunden`,
  channelDeleteReason: (count: number) => `Anti-Nuke: ${count} Kanäle in 10 Sekunden gelöscht`,
  roleDeleteReason: (count: number) => `Anti-Nuke: ${count} Rollen in 10 Sekunden gelöscht`,
  noAdmin: "❌ Du brauchst Administrator-Rechte.",
  statusTitle: "🛡️ Anti-Nuke Status",
  statusActive: "✅ Aktiv",
  statusInactive: "❌ Inaktiv",
  notSet: "Nicht gesetzt",
  none: "Keine",
  statusDesc: (statusText: string, threshold: number, punishment: string, logChannel: string, whitelist: string) =>
    `**Status:** ${statusText}\n` +
    `**Threshold:** ${threshold} Aktionen/10s\n` +
    `**Strafe:** \`${punishment}\`\n` +
    `**Log-Kanal:** ${logChannel}\n` +
    `**Whitelist:** ${whitelist}`,
  enabled: "✅ Anti-Nuke **aktiviert**.",
  disabled: "✅ Anti-Nuke **deaktiviert**.",
  invalidThreshold: "❌ Gib eine Zahl zwischen 1 und 50 an.",
  thresholdSet: (val: number) => `✅ Threshold auf **${val}** Aktionen/10s gesetzt.`,
  invalidPunishment: "❌ Optionen: `ban`, `kick`, `strip`",
  punishmentSet: (p: string) =>
    `✅ Strafe auf **${p}** gesetzt.\n> ban = Bann | kick = Kick | strip = Alle Rollen entfernen`,
  noUser: "❌ Markiere einen Nutzer.",
  whitelistRemovedPart: "von der Whitelist **entfernt**",
  whitelistAddedPart: "zur Whitelist **hinzugefügt**",
  whitelistUpdated: (id: string, action: string) => `✅ <@${id}> wurde ${action}.`,
  noChannel: "❌ Markiere einen Kanal.",
  logChannelSet: (id: string) => `✅ Log-Kanal auf <#${id}> gesetzt.`,
  optionsHelp:
    "**,antinuke Optionen:**\n" +
    "`on` / `off` — System aktivieren\n" +
    "`threshold <1-50>` — Anzahl Aktionen bis Eingriff\n" +
    "`punishment <ban|kick|strip>` — Art der Strafe\n" +
    "`whitelist @user` — Nutzer whitelist-en\n" +
    "`log #kanal` — Log-Kanal\n" +
    "`status` — Einstellungen anzeigen",
};

const sv: Strings = {
  nukeTriggeredTitle: "🛡️ Anti-Nuke utlöst!",
  nukeTriggeredDesc: (userId: string, punishment: string, reason: string) =>
    `**Användare:** <@${userId}> (\`${userId}\`)\n` +
    `**Åtgärd:** ${punishment}\n` +
    `**Anledning:** ${reason}`,
  banReason: (count: number) => `Anti-Nuke: ${count} bannlysningar på 10 sekunder`,
  channelDeleteReason: (count: number) => `Anti-Nuke: ${count} kanaler raderade på 10 sekunder`,
  roleDeleteReason: (count: number) => `Anti-Nuke: ${count} roller raderade på 10 sekunder`,
  noAdmin: "❌ Du behöver administratörsbehörighet.",
  statusTitle: "🛡️ Anti-Nuke-status",
  statusActive: "✅ Aktiv",
  statusInactive: "❌ Inaktiv",
  notSet: "Inte angiven",
  none: "Inga",
  statusDesc: (statusText: string, threshold: number, punishment: string, logChannel: string, whitelist: string) =>
    `**Status:** ${statusText}\n` +
    `**Tröskel:** ${threshold} åtgärder/10s\n` +
    `**Straff:** \`${punishment}\`\n` +
    `**Loggkanal:** ${logChannel}\n` +
    `**Vitlista:** ${whitelist}`,
  enabled: "✅ Anti-Nuke **aktiverat**.",
  disabled: "✅ Anti-Nuke **inaktiverat**.",
  invalidThreshold: "❌ Ange ett tal mellan 1 och 50.",
  thresholdSet: (val: number) => `✅ Tröskel inställd på **${val}** åtgärder/10s.`,
  invalidPunishment: "❌ Alternativ: `ban`, `kick`, `strip`",
  punishmentSet: (p: string) =>
    `✅ Straff inställt på **${p}**.\n> ban = Bannlys | kick = Sparka | strip = Ta bort alla roller`,
  noUser: "❌ Nämn en användare.",
  whitelistRemovedPart: "**borttagen** från vitlistan",
  whitelistAddedPart: "**tillagd** i vitlistan",
  whitelistUpdated: (id: string, action: string) => `✅ <@${id}> blev ${action}.`,
  noChannel: "❌ Nämn en kanal.",
  logChannelSet: (id: string) => `✅ Loggkanal inställd på <#${id}>.`,
  optionsHelp:
    "**,antinuke alternativ:**\n" +
    "`on` / `off` — Aktivera systemet\n" +
    "`threshold <1-50>` — Antal åtgärder innan ingripande\n" +
    "`punishment <ban|kick|strip>` — Typ av straff\n" +
    "`whitelist @user` — Vitlista en användare\n" +
    "`log #kanal` — Loggkanal\n" +
    "`status` — Visa inställningar",
};

const nl: Strings = {
  nukeTriggeredTitle: "🛡️ Anti-Nuke geactiveerd!",
  nukeTriggeredDesc: (userId: string, punishment: string, reason: string) =>
    `**Gebruiker:** <@${userId}> (\`${userId}\`)\n` +
    `**Actie:** ${punishment}\n` +
    `**Reden:** ${reason}`,
  banReason: (count: number) => `Anti-Nuke: ${count} bans in 10 seconden`,
  channelDeleteReason: (count: number) => `Anti-Nuke: ${count} kanalen verwijderd in 10 seconden`,
  roleDeleteReason: (count: number) => `Anti-Nuke: ${count} rollen verwijderd in 10 seconden`,
  noAdmin: "❌ Je hebt Administrator-rechten nodig.",
  statusTitle: "🛡️ Anti-Nuke-status",
  statusActive: "✅ Actief",
  statusInactive: "❌ Inactief",
  notSet: "Niet ingesteld",
  none: "Geen",
  statusDesc: (statusText: string, threshold: number, punishment: string, logChannel: string, whitelist: string) =>
    `**Status:** ${statusText}\n` +
    `**Drempel:** ${threshold} acties/10s\n` +
    `**Straf:** \`${punishment}\`\n` +
    `**Logkanaal:** ${logChannel}\n` +
    `**Witte lijst:** ${whitelist}`,
  enabled: "✅ Anti-Nuke **ingeschakeld**.",
  disabled: "✅ Anti-Nuke **uitgeschakeld**.",
  invalidThreshold: "❌ Geef een getal tussen 1 en 50 op.",
  thresholdSet: (val: number) => `✅ Drempel ingesteld op **${val}** acties/10s.`,
  invalidPunishment: "❌ Opties: `ban`, `kick`, `strip`",
  punishmentSet: (p: string) =>
    `✅ Straf ingesteld op **${p}**.\n> ban = Verbannen | kick = Schoppen | strip = Alle rollen verwijderen`,
  noUser: "❌ Vermeld een gebruiker.",
  whitelistRemovedPart: "**verwijderd** van de witte lijst",
  whitelistAddedPart: "**toegevoegd** aan de witte lijst",
  whitelistUpdated: (id: string, action: string) => `✅ <@${id}> is ${action}.`,
  noChannel: "❌ Vermeld een kanaal.",
  logChannelSet: (id: string) => `✅ Logkanaal ingesteld op <#${id}>.`,
  optionsHelp:
    "**,antinuke opties:**\n" +
    "`on` / `off` — Systeem inschakelen\n" +
    "`threshold <1-50>` — Aantal acties tot ingrijpen\n" +
    "`punishment <ban|kick|strip>` — Soort straf\n" +
    "`whitelist @user` — Gebruiker op witte lijst zetten\n" +
    "`log #kanaal` — Logkanaal\n" +
    "`status` — Instellingen tonen",
};

const ar: Strings = {
  nukeTriggeredTitle: "🛡️ تم تفعيل الحماية من التخريب!",
  nukeTriggeredDesc: (userId: string, punishment: string, reason: string) =>
    `**المستخدم:** <@${userId}> (\`${userId}\`)\n` +
    `**الإجراء:** ${punishment}\n` +
    `**السبب:** ${reason}`,
  banReason: (count: number) => `الحماية من التخريب: ${count} حظر خلال 10 ثوانٍ`,
  channelDeleteReason: (count: number) => `الحماية من التخريب: حذف ${count} قنوات خلال 10 ثوانٍ`,
  roleDeleteReason: (count: number) => `الحماية من التخريب: حذف ${count} أدوار خلال 10 ثوانٍ`,
  noAdmin: "❌ تحتاج إلى صلاحيات المسؤول.",
  statusTitle: "🛡️ حالة الحماية من التخريب",
  statusActive: "✅ مُفعّل",
  statusInactive: "❌ غير مُفعّل",
  notSet: "غير محددة",
  none: "لا يوجد",
  statusDesc: (statusText: string, threshold: number, punishment: string, logChannel: string, whitelist: string) =>
    `**الحالة:** ${statusText}\n` +
    `**الحد:** ${threshold} إجراءات/10 ثوانٍ\n` +
    `**العقوبة:** \`${punishment}\`\n` +
    `**قناة السجل:** ${logChannel}\n` +
    `**القائمة البيضاء:** ${whitelist}`,
  enabled: "✅ تم **تفعيل** الحماية من التخريب.",
  disabled: "✅ تم **تعطيل** الحماية من التخريب.",
  invalidThreshold: "❌ أدخل رقمًا بين 1 و50.",
  thresholdSet: (val: number) => `✅ تم ضبط الحد على **${val}** إجراءات/10 ثوانٍ.`,
  invalidPunishment: "❌ الخيارات: `ban`، `kick`، `strip`",
  punishmentSet: (p: string) =>
    `✅ تم ضبط العقوبة على **${p}**.\n> ban = حظر | kick = طرد | strip = إزالة جميع الأدوار`,
  noUser: "❌ أشر إلى مستخدم.",
  whitelistRemovedPart: "**أُزيل** من القائمة البيضاء",
  whitelistAddedPart: "**أُضيف** إلى القائمة البيضاء",
  whitelistUpdated: (id: string, action: string) => `✅ <@${id}> ${action}.`,
  noChannel: "❌ أشر إلى قناة.",
  logChannelSet: (id: string) => `✅ تم ضبط قناة السجل على <#${id}>.`,
  optionsHelp:
    "**خيارات ,antinuke:**\n" +
    "`on` / `off` — تفعيل النظام\n" +
    "`threshold <1-50>` — عدد الإجراءات قبل التدخل\n" +
    "`punishment <ban|kick|strip>` — نوع العقوبة\n" +
    "`whitelist @user` — إضافة مستخدم إلى القائمة البيضاء\n" +
    "`log #channel` — قناة السجل\n" +
    "`status` — عرض الإعدادات",
};

export const antinuke: Record<Lang, Strings> = { en, de, sv, nl, ar };
