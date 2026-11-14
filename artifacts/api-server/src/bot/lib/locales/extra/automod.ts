import type { Lang } from "../../i18n";

const en = {
  noPermission: "No permission.",
  settingsTitle: "Auto-Mod Settings",
  settingsDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean, spamThreshold: number, capsThreshold: number) =>
    `Anti-Spam: ${antiSpam ? "ON" : "OFF"}\n` +
    `Anti-Caps: ${antiCaps ? "ON" : "OFF"}\n` +
    `Anti-Links: ${antiLinks ? "ON" : "OFF"}\n` +
    `Spam-Limit: ${spamThreshold} msg/5s\n` +
    `Caps-Limit: ${capsThreshold}%\n\n` +
    `Commands: ,automod spam <5> | ,automod caps <70> | ,automod links | ,automod off`,
  spamToggle: (active: boolean, threshold: number) =>
    `Anti-Spam ${active ? "enabled" : "disabled"}${active ? ` (Limit: ${threshold} msg/5s)` : ""}.`,
  capsToggle: (active: boolean, threshold: number) =>
    `Anti-Caps ${active ? "enabled" : "disabled"}${active ? ` (Limit: ${threshold}%)` : ""}.`,
  linksToggle: (active: boolean) =>
    `Anti-Links ${active ? "enabled" : "disabled"}.`,
  offDisabled: "Auto-Mod completely disabled.",
  statusTitle: "Auto-Mod Status",
  statusDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean) =>
    `Anti-Spam: ${antiSpam ? "ON" : "OFF"}\nAnti-Caps: ${antiCaps ? "ON" : "OFF"}\nAnti-Links: ${antiLinks ? "ON" : "OFF"}`,
  unknownSetting: "Unknown setting. Use: spam, caps, links, off, status",
  linksNotAllowed: (id: string) => `🛡️ <@${id}> Links are not allowed on this server!`,
  noSpam: (id: string, count: number) => `🛡️ <@${id}> Please don't spam! (${count} msg/5s)`,
  tooManyCaps: (id: string) => `🛡️ <@${id}> Too many CAPS!`,
};

type Strings = typeof en;

const de: Strings = {
  noPermission: "No permission.",
  settingsTitle: "Auto-Mod Settings",
  settingsDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean, spamThreshold: number, capsThreshold: number) =>
    `Anti-Spam: ${antiSpam ? "ON" : "OFF"}\n` +
    `Anti-Caps: ${antiCaps ? "ON" : "OFF"}\n` +
    `Anti-Links: ${antiLinks ? "ON" : "OFF"}\n` +
    `Spam-Limit: ${spamThreshold} msg/5s\n` +
    `Caps-Limit: ${capsThreshold}%\n\n` +
    `Commands: ,automod spam <5> | ,automod caps <70> | ,automod links | ,automod off`,
  spamToggle: (active: boolean, threshold: number) =>
    `Anti-Spam ${active ? "aktiviert" : "deaktiviert"}${active ? ` (Limit: ${threshold} msg/5s)` : ""}.`,
  capsToggle: (active: boolean, threshold: number) =>
    `Anti-Caps ${active ? "aktiviert" : "deaktiviert"}${active ? ` (Limit: ${threshold}%)` : ""}.`,
  linksToggle: (active: boolean) =>
    `Anti-Links ${active ? "aktiviert" : "deaktiviert"}.`,
  offDisabled: "Auto-Mod komplett deaktiviert.",
  statusTitle: "Auto-Mod Status",
  statusDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean) =>
    `Anti-Spam: ${antiSpam ? "ON" : "OFF"}\nAnti-Caps: ${antiCaps ? "ON" : "OFF"}\nAnti-Links: ${antiLinks ? "ON" : "OFF"}`,
  unknownSetting: "Unbekannte Einstellung. Nutze: spam, caps, links, off, status",
  linksNotAllowed: (id: string) => `🛡️ <@${id}> Links sind in diesem Server nicht erlaubt!`,
  noSpam: (id: string, count: number) => `🛡️ <@${id}> Bitte nicht spammen! (${count} msg/5s)`,
  tooManyCaps: (id: string) => `🛡️ <@${id}> Zu viele GROSSBUCHSTABEN!`,
};

const sv: Strings = {
  noPermission: "Ingen behörighet.",
  settingsTitle: "Auto-Mod-inställningar",
  settingsDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean, spamThreshold: number, capsThreshold: number) =>
    `Anti-Spam: ${antiSpam ? "PÅ" : "AV"}\n` +
    `Anti-Caps: ${antiCaps ? "PÅ" : "AV"}\n` +
    `Anti-Links: ${antiLinks ? "PÅ" : "AV"}\n` +
    `Spam-gräns: ${spamThreshold} medd/5s\n` +
    `Caps-gräns: ${capsThreshold}%\n\n` +
    `Kommandon: ,automod spam <5> | ,automod caps <70> | ,automod links | ,automod off`,
  spamToggle: (active: boolean, threshold: number) =>
    `Anti-Spam ${active ? "aktiverad" : "inaktiverad"}${active ? ` (Gräns: ${threshold} medd/5s)` : ""}.`,
  capsToggle: (active: boolean, threshold: number) =>
    `Anti-Caps ${active ? "aktiverad" : "inaktiverad"}${active ? ` (Gräns: ${threshold}%)` : ""}.`,
  linksToggle: (active: boolean) =>
    `Anti-Links ${active ? "aktiverad" : "inaktiverad"}.`,
  offDisabled: "Auto-Mod helt inaktiverad.",
  statusTitle: "Auto-Mod-status",
  statusDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean) =>
    `Anti-Spam: ${antiSpam ? "PÅ" : "AV"}\nAnti-Caps: ${antiCaps ? "PÅ" : "AV"}\nAnti-Links: ${antiLinks ? "PÅ" : "AV"}`,
  unknownSetting: "Okänd inställning. Använd: spam, caps, links, off, status",
  linksNotAllowed: (id: string) => `🛡️ <@${id}> Länkar är inte tillåtna på den här servern!`,
  noSpam: (id: string, count: number) => `🛡️ <@${id}> Spamma inte! (${count} medd/5s)`,
  tooManyCaps: (id: string) => `🛡️ <@${id}> För många VERSALER!`,
};

const nl: Strings = {
  noPermission: "Geen toestemming.",
  settingsTitle: "Auto-Mod-instellingen",
  settingsDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean, spamThreshold: number, capsThreshold: number) =>
    `Anti-Spam: ${antiSpam ? "AAN" : "UIT"}\n` +
    `Anti-Caps: ${antiCaps ? "AAN" : "UIT"}\n` +
    `Anti-Links: ${antiLinks ? "AAN" : "UIT"}\n` +
    `Spam-limiet: ${spamThreshold} ber/5s\n` +
    `Caps-limiet: ${capsThreshold}%\n\n` +
    `Commando's: ,automod spam <5> | ,automod caps <70> | ,automod links | ,automod off`,
  spamToggle: (active: boolean, threshold: number) =>
    `Anti-Spam ${active ? "ingeschakeld" : "uitgeschakeld"}${active ? ` (Limiet: ${threshold} ber/5s)` : ""}.`,
  capsToggle: (active: boolean, threshold: number) =>
    `Anti-Caps ${active ? "ingeschakeld" : "uitgeschakeld"}${active ? ` (Limiet: ${threshold}%)` : ""}.`,
  linksToggle: (active: boolean) =>
    `Anti-Links ${active ? "ingeschakeld" : "uitgeschakeld"}.`,
  offDisabled: "Auto-Mod volledig uitgeschakeld.",
  statusTitle: "Auto-Mod-status",
  statusDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean) =>
    `Anti-Spam: ${antiSpam ? "AAN" : "UIT"}\nAnti-Caps: ${antiCaps ? "AAN" : "UIT"}\nAnti-Links: ${antiLinks ? "AAN" : "UIT"}`,
  unknownSetting: "Onbekende instelling. Gebruik: spam, caps, links, off, status",
  linksNotAllowed: (id: string) => `🛡️ <@${id}> Links zijn niet toegestaan op deze server!`,
  noSpam: (id: string, count: number) => `🛡️ <@${id}> Niet spammen alstublieft! (${count} ber/5s)`,
  tooManyCaps: (id: string) => `🛡️ <@${id}> Te veel HOOFDLETTERS!`,
};

const ar: Strings = {
  noPermission: "لا تملك الصلاحية.",
  settingsTitle: "إعدادات الإشراف التلقائي",
  settingsDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean, spamThreshold: number, capsThreshold: number) =>
    `مكافحة السبام: ${antiSpam ? "تشغيل" : "إيقاف"}\n` +
    `مكافحة الأحرف الكبيرة: ${antiCaps ? "تشغيل" : "إيقاف"}\n` +
    `مكافحة الروابط: ${antiLinks ? "تشغيل" : "إيقاف"}\n` +
    `حد السبام: ${spamThreshold} رسالة/5ث\n` +
    `حد الأحرف الكبيرة: ${capsThreshold}%\n\n` +
    `الأوامر: ,automod spam <5> | ,automod caps <70> | ,automod links | ,automod off`,
  spamToggle: (active: boolean, threshold: number) =>
    `مكافحة السبام ${active ? "مُفعّلة" : "مُعطّلة"}${active ? ` (الحد: ${threshold} رسالة/5ث)` : ""}.`,
  capsToggle: (active: boolean, threshold: number) =>
    `مكافحة الأحرف الكبيرة ${active ? "مُفعّلة" : "مُعطّلة"}${active ? ` (الحد: ${threshold}%)` : ""}.`,
  linksToggle: (active: boolean) =>
    `مكافحة الروابط ${active ? "مُفعّلة" : "مُعطّلة"}.`,
  offDisabled: "تم تعطيل الإشراف التلقائي بالكامل.",
  statusTitle: "حالة الإشراف التلقائي",
  statusDesc: (antiSpam: boolean, antiCaps: boolean, antiLinks: boolean) =>
    `مكافحة السبام: ${antiSpam ? "تشغيل" : "إيقاف"}\nمكافحة الأحرف الكبيرة: ${antiCaps ? "تشغيل" : "إيقاف"}\nمكافحة الروابط: ${antiLinks ? "تشغيل" : "إيقاف"}`,
  unknownSetting: "إعداد غير معروف. استخدم: spam, caps, links, off, status",
  linksNotAllowed: (id: string) => `🛡️ <@${id}> الروابط غير مسموح بها في هذا الخادم!`,
  noSpam: (id: string, count: number) => `🛡️ <@${id}> الرجاء عدم إرسال الرسائل المزعجة! (${count} رسالة/5ث)`,
  tooManyCaps: (id: string) => `🛡️ <@${id}> أحرف كبيرة كثيرة جداً!`,
};

export const automod: Record<Lang, Strings> = { en, de, sv, nl, ar };
