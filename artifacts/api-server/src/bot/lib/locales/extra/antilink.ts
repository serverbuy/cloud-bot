import type { Lang } from "../../i18n";

const en = {
  noPermission: "❌ You need the **Manage Server** permission.",
  statusTitle: "🔗 Anti-Link Status",
  active: "✅ Active",
  inactive: "❌ Inactive",
  none: "None",
  statusDesc: (status: string, bypass: string, exempt: string) =>
    `**Status:** ${status}\n**Bypass Roles:** ${bypass}\n**Exempt Channels:** ${exempt}`,
  enabled: "✅ Anti-Link **enabled** — links will be deleted automatically.",
  disabled: "✅ Anti-Link **disabled**.",
  noRole: "❌ Mention a role (e.g. `@Moderator`).",
  bypassToggle: (id: string, was: boolean) =>
    `✅ <@&${id}> was ${was ? "**removed** from the bypass list" : "**added** to the bypass list"}.`,
  noChannel: "❌ Mention a channel.",
  exemptToggle: (id: string, was: boolean) =>
    `✅ <#${id}> was ${was ? "**removed** from the exempt channels" : "**added** to the exempt channels"}.`,
  optionsHelp:
    "**,antilink options:**\n" +
    "`on` / `off` — enable Anti-Link\n" +
    "`bypass @Role` — role may send links\n" +
    "`exempt #Channel` — exclude channel from filter\n" +
    "`status` — show settings",
};

type Strings = typeof en;

const de: Strings = {
  noPermission: "❌ Du brauchst die Berechtigung **Server verwalten**.",
  statusTitle: "🔗 Anti-Link Status",
  active: "✅ Aktiv",
  inactive: "❌ Inaktiv",
  none: "Keine",
  statusDesc: (status: string, bypass: string, exempt: string) =>
    `**Status:** ${status}\n**Bypass-Rollen:** ${bypass}\n**Exempt-Kanäle:** ${exempt}`,
  enabled: "✅ Anti-Link **aktiviert** — Links werden automatisch gelöscht.",
  disabled: "✅ Anti-Link **deaktiviert**.",
  noRole: "❌ Markiere eine Rolle (z.B. `@Moderator`).",
  bypassToggle: (id: string, was: boolean) =>
    `✅ <@&${id}> wurde ${was ? "von der Bypass-Liste **entfernt**" : "zur Bypass-Liste **hinzugefügt**"}.`,
  noChannel: "❌ Markiere einen Kanal.",
  exemptToggle: (id: string, was: boolean) =>
    `✅ <#${id}> wurde ${was ? "aus den Exempt-Kanälen **entfernt**" : "zu den Exempt-Kanälen **hinzugefügt**"}.`,
  optionsHelp:
    "**,antilink Optionen:**\n" +
    "`on` / `off` — Anti-Link aktivieren\n" +
    "`bypass @Rolle` — Rolle darf Links senden\n" +
    "`exempt #Kanal` — Kanal vom Filter ausnehmen\n" +
    "`status` — Einstellungen anzeigen",
};

const sv: Strings = {
  noPermission: "❌ Du behöver behörigheten **Hantera server**.",
  statusTitle: "🔗 Anti-Link Status",
  active: "✅ Aktiv",
  inactive: "❌ Inaktiv",
  none: "Inga",
  statusDesc: (status: string, bypass: string, exempt: string) =>
    `**Status:** ${status}\n**Bypass-roller:** ${bypass}\n**Undantagna kanaler:** ${exempt}`,
  enabled: "✅ Anti-Link **aktiverad** — länkar tas bort automatiskt.",
  disabled: "✅ Anti-Link **inaktiverad**.",
  noRole: "❌ Markera en roll (t.ex. `@Moderator`).",
  bypassToggle: (id: string, was: boolean) =>
    `✅ <@&${id}> ${was ? "**togs bort** från bypass-listan" : "**lades till** i bypass-listan"}.`,
  noChannel: "❌ Markera en kanal.",
  exemptToggle: (id: string, was: boolean) =>
    `✅ <#${id}> ${was ? "**togs bort** från de undantagna kanalerna" : "**lades till** i de undantagna kanalerna"}.`,
  optionsHelp:
    "**,antilink alternativ:**\n" +
    "`on` / `off` — aktivera Anti-Link\n" +
    "`bypass @Roll` — rollen får skicka länkar\n" +
    "`exempt #Kanal` — undanta kanal från filtret\n" +
    "`status` — visa inställningar",
};

const nl: Strings = {
  noPermission: "❌ Je hebt de rechten **Server beheren** nodig.",
  statusTitle: "🔗 Anti-Link Status",
  active: "✅ Actief",
  inactive: "❌ Inactief",
  none: "Geen",
  statusDesc: (status: string, bypass: string, exempt: string) =>
    `**Status:** ${status}\n**Bypass-rollen:** ${bypass}\n**Uitgezonderde kanalen:** ${exempt}`,
  enabled: "✅ Anti-Link **ingeschakeld** — links worden automatisch verwijderd.",
  disabled: "✅ Anti-Link **uitgeschakeld**.",
  noRole: "❌ Tag een rol (bijv. `@Moderator`).",
  bypassToggle: (id: string, was: boolean) =>
    `✅ <@&${id}> is ${was ? "**verwijderd** van de bypass-lijst" : "**toegevoegd** aan de bypass-lijst"}.`,
  noChannel: "❌ Tag een kanaal.",
  exemptToggle: (id: string, was: boolean) =>
    `✅ <#${id}> is ${was ? "**verwijderd** uit de uitgezonderde kanalen" : "**toegevoegd** aan de uitgezonderde kanalen"}.`,
  optionsHelp:
    "**,antilink opties:**\n" +
    "`on` / `off` — Anti-Link inschakelen\n" +
    "`bypass @Rol` — rol mag links sturen\n" +
    "`exempt #Kanaal` — kanaal uitsluiten van filter\n" +
    "`status` — instellingen tonen",
};

const ar: Strings = {
  noPermission: "❌ تحتاج إلى صلاحية **إدارة الخادم**.",
  statusTitle: "🔗 حالة مكافحة الروابط",
  active: "✅ مُفعّل",
  inactive: "❌ مُعطّل",
  none: "لا يوجد",
  statusDesc: (status: string, bypass: string, exempt: string) =>
    `**الحالة:** ${status}\n**أدوار الاستثناء:** ${bypass}\n**القنوات المستثناة:** ${exempt}`,
  enabled: "✅ تم **تفعيل** مكافحة الروابط — سيتم حذف الروابط تلقائيًا.",
  disabled: "✅ تم **تعطيل** مكافحة الروابط.",
  noRole: "❌ أشِر إلى دور (مثال: `@Moderator`).",
  bypassToggle: (id: string, was: boolean) =>
    `✅ ${was ? `تمت **إزالة** <@&${id}> من قائمة الاستثناء` : `تمت **إضافة** <@&${id}> إلى قائمة الاستثناء`}.`,
  noChannel: "❌ أشِر إلى قناة.",
  exemptToggle: (id: string, was: boolean) =>
    `✅ ${was ? `تمت **إزالة** <#${id}> من القنوات المستثناة` : `تمت **إضافة** <#${id}> إلى القنوات المستثناة`}.`,
  optionsHelp:
    "**خيارات ,antilink:**\n" +
    "`on` / `off` — تفعيل مكافحة الروابط\n" +
    "`bypass @دور` — يُسمح للدور بإرسال الروابط\n" +
    "`exempt #قناة` — استثناء قناة من الفلتر\n" +
    "`status` — عرض الإعدادات",
};

export const antilink: Record<Lang, Strings> = { en, de, sv, nl, ar };
