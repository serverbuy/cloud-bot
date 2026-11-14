import type { Lang } from "../../i18n";

const en = {
  noPermission: "❌ You need the **Manage Server** permission.",
  disabled: "✅ Welcome system disabled.",
  notConfigured: "❌ No welcome channel configured. Use `,setwelcome #channel`.",
  statusTitle: "👋 Welcome Settings",
  channelField: "Channel",
  textField: "Text",
  textDefault: "*(Default)*",
  markChannel: "❌ Please mention a text channel: `,setwelcome #channel [text]`",
  activatedTitle: "✅ Welcome system activated",
  activatedDesc: (channel: string) => `New members will be greeted in ${channel}.`,
  customText: (customText: string) =>
    `\n\n**Custom Text:**\n${customText}\n\n*Variables: \`{user}\` \`{username}\` \`{server}\` \`{count}\`*`,
  defaultText:
    "\n\n*Default message active. You can add your own text:*\n`,setwelcome #channel Welcome {user} to {server}!`",
};

type Strings = typeof en;

const de: Strings = {
  noPermission: "❌ Du brauchst die Berechtigung **Server verwalten**.",
  disabled: "✅ Welcome-System deaktiviert.",
  notConfigured: "❌ Kein Welcome-Kanal konfiguriert. Nutze `,setwelcome #kanal`.",
  statusTitle: "👋 Welcome-Einstellungen",
  channelField: "Kanal",
  textField: "Text",
  textDefault: "*(Standard)*",
  markChannel: "❌ Bitte markiere einen Textkanal: `,setwelcome #kanal [text]`",
  activatedTitle: "✅ Welcome-System aktiviert",
  activatedDesc: (channel: string) => `Neue Mitglieder werden in ${channel} begrüßt.`,
  customText: (customText: string) =>
    `\n\n**Eigener Text:**\n${customText}\n\n*Variablen: \`{user}\` \`{username}\` \`{server}\` \`{count}\`*`,
  defaultText:
    "\n\n*Standard-Nachricht aktiv. Du kannst einen eigenen Text hinzufügen:*\n`,setwelcome #kanal Willkommen {user} auf {server}!`",
};

const sv: Strings = {
  noPermission: "❌ Du behöver behörigheten **Hantera servern**.",
  disabled: "✅ Välkomstsystem inaktiverat.",
  notConfigured: "❌ Ingen välkomstkanal konfigurerad. Använd `,setwelcome #kanal`.",
  statusTitle: "👋 Välkomstinställningar",
  channelField: "Kanal",
  textField: "Text",
  textDefault: "*(Standard)*",
  markChannel: "❌ Markera en textkanal: `,setwelcome #kanal [text]`",
  activatedTitle: "✅ Välkomstsystem aktiverat",
  activatedDesc: (channel: string) => `Nya medlemmar välkomnas i ${channel}.`,
  customText: (customText: string) =>
    `\n\n**Egen text:**\n${customText}\n\n*Variabler: \`{user}\` \`{username}\` \`{server}\` \`{count}\`*`,
  defaultText:
    "\n\n*Standardmeddelande aktivt. Du kan lägga till en egen text:*\n`,setwelcome #kanal Välkommen {user} till {server}!`",
};

const nl: Strings = {
  noPermission: "❌ Je hebt de rechten **Server beheren** nodig.",
  disabled: "✅ Welkomstsysteem uitgeschakeld.",
  notConfigured: "❌ Geen welkomstkanaal geconfigureerd. Gebruik `,setwelcome #kanaal`.",
  statusTitle: "👋 Welkomstinstellingen",
  channelField: "Kanaal",
  textField: "Tekst",
  textDefault: "*(Standaard)*",
  markChannel: "❌ Markeer een tekstkanaal: `,setwelcome #kanaal [tekst]`",
  activatedTitle: "✅ Welkomstsysteem geactiveerd",
  activatedDesc: (channel: string) => `Nieuwe leden worden begroet in ${channel}.`,
  customText: (customText: string) =>
    `\n\n**Eigen tekst:**\n${customText}\n\n*Variabelen: \`{user}\` \`{username}\` \`{server}\` \`{count}\`*`,
  defaultText:
    "\n\n*Standaardbericht actief. Je kunt je eigen tekst toevoegen:*\n`,setwelcome #kanaal Welkom {user} op {server}!`",
};

const ar: Strings = {
  noPermission: "❌ تحتاج إلى صلاحية **إدارة الخادم**.",
  disabled: "✅ تم تعطيل نظام الترحيب.",
  notConfigured: "❌ لم يتم تكوين قناة ترحيب. استخدم `,setwelcome #channel`.",
  statusTitle: "👋 إعدادات الترحيب",
  channelField: "القناة",
  textField: "النص",
  textDefault: "*(افتراضي)*",
  markChannel: "❌ يرجى تحديد قناة نصية: `,setwelcome #channel [text]`",
  activatedTitle: "✅ تم تفعيل نظام الترحيب",
  activatedDesc: (channel: string) => `سيتم الترحيب بالأعضاء الجدد في ${channel}.`,
  customText: (customText: string) =>
    `\n\n**نص مخصص:**\n${customText}\n\n*المتغيرات: \`{user}\` \`{username}\` \`{server}\` \`{count}\`*`,
  defaultText:
    "\n\n*الرسالة الافتراضية مفعّلة. يمكنك إضافة نصك الخاص:*\n`,setwelcome #channel مرحبًا {user} في {server}!`",
};

export const setwelcome: Record<Lang, Strings> = { en, de, sv, nl, ar };
