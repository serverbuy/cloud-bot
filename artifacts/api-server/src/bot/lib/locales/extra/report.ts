import type { Lang } from "../../i18n";

const en = {
  noUser: "❌ Please mention a user.",
  noReason: "❌ Please provide a reason.",
  noChannel: "❌ No mod-log or report channel found. Please run `,logsetup` or `,server-setup` first.",
  embedTitle: "⚠️ User Report",
  fieldTarget: "🎯 Reported User",
  fieldReportedBy: "👮 Reported by",
  fieldChannel: "📢 Channel",
  fieldReason: "📝 Reason",
  sent: "✅ Report sent to the mods. Thanks for your help!",
  noPermission: "❌ You don't have permission to do this.",
  noMember: "❌ Please mention a member.",
  defaultReason: "Report Ban",
  banned: (target: string, reason: string) => `✅ ${target} has been banned. Reason: ${reason}`,
};

type Strings = typeof en;

const de: Strings = {
  noUser: "❌ Bitte markiere einen Nutzer.",
  noReason: "❌ Bitte gib einen Grund an.",
  noChannel: "❌ Kein Mod-Log oder Report-Kanal gefunden. Bitte zuerst `,logsetup` oder `,server-setup` ausführen.",
  embedTitle: "⚠️ User Report",
  fieldTarget: "🎯 Gemeldeter Nutzer",
  fieldReportedBy: "👮 Gemeldet von",
  fieldChannel: "📢 Kanal",
  fieldReason: "📝 Grund",
  sent: "✅ Report an die Mods gesendet. Danke für deine Mithilfe!",
  noPermission: "❌ Du hast keine Berechtigung dafür.",
  noMember: "❌ Bitte markiere ein Mitglied.",
  defaultReason: "Report Ban",
  banned: (target: string, reason: string) => `✅ ${target} wurde gebannt. Grund: ${reason}`,
};

const sv: Strings = {
  noUser: "❌ Vänligen nämn en användare.",
  noReason: "❌ Vänligen ange en anledning.",
  noChannel: "❌ Ingen mod-log eller rapportkanal hittades. Kör `,logsetup` eller `,server-setup` först.",
  embedTitle: "⚠️ Användarrapport",
  fieldTarget: "🎯 Rapporterad användare",
  fieldReportedBy: "👮 Rapporterad av",
  fieldChannel: "📢 Kanal",
  fieldReason: "📝 Anledning",
  sent: "✅ Rapporten skickad till moderatorerna. Tack för din hjälp!",
  noPermission: "❌ Du har inte behörighet att göra detta.",
  noMember: "❌ Vänligen nämn en medlem.",
  defaultReason: "Rapportbann",
  banned: (target: string, reason: string) => `✅ ${target} har bannats. Anledning: ${reason}`,
};

const nl: Strings = {
  noUser: "❌ Vermeld alsjeblieft een gebruiker.",
  noReason: "❌ Geef alsjeblieft een reden op.",
  noChannel: "❌ Geen mod-log- of rapportkanaal gevonden. Voer eerst `,logsetup` of `,server-setup` uit.",
  embedTitle: "⚠️ Gebruikersrapport",
  fieldTarget: "🎯 Gerapporteerde gebruiker",
  fieldReportedBy: "👮 Gerapporteerd door",
  fieldChannel: "📢 Kanaal",
  fieldReason: "📝 Reden",
  sent: "✅ Rapport naar de mods gestuurd. Bedankt voor je hulp!",
  noPermission: "❌ Je hebt hier geen toestemming voor.",
  noMember: "❌ Vermeld alsjeblieft een lid.",
  defaultReason: "Rapportban",
  banned: (target: string, reason: string) => `✅ ${target} is verbannen. Reden: ${reason}`,
};

const ar: Strings = {
  noUser: "❌ يرجى الإشارة إلى مستخدم.",
  noReason: "❌ يرجى تقديم سبب.",
  noChannel: "❌ لم يتم العثور على قناة سجل الإشراف أو قناة البلاغات. يرجى تشغيل `,logsetup` أو `,server-setup` أولاً.",
  embedTitle: "⚠️ بلاغ عن مستخدم",
  fieldTarget: "🎯 المستخدم المُبلَّغ عنه",
  fieldReportedBy: "👮 أبلغ عنه",
  fieldChannel: "📢 القناة",
  fieldReason: "📝 السبب",
  sent: "✅ تم إرسال البلاغ إلى المشرفين. شكرًا على مساعدتك!",
  noPermission: "❌ ليس لديك الصلاحية للقيام بذلك.",
  noMember: "❌ يرجى الإشارة إلى عضو.",
  defaultReason: "حظر بلاغ",
  banned: (target: string, reason: string) => `✅ تم حظر ${target}. السبب: ${reason}`,
};

export const report: Record<Lang, Strings> = { en, de, sv, nl, ar };
