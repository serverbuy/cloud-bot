import type { Lang } from "../../i18n";

const en = {
  noPermission: "❌ You don't have permission to do this.",
  noCommands: "❌ No custom commands set.",
  listTitle: "📝 Custom Commands",
  addExample: "❌ Example: `,cmd add hello Hello World!`",
  added: (trigger: string) => `✅ Custom command \`${trigger}\` added!`,
  notFound: "❌ Command not found.",
  removed: (trigger: string) => `✅ Custom command \`${trigger}\` removed.`,
  usageHint: "❌ Use: `,cmd add <trigger> <response>`, `,cmd remove <trigger>`, `,cmd list`",
};

type Strings = typeof en;

const de: Strings = {
  noPermission: "❌ Du hast keine Berechtigung dafür.",
  noCommands: "❌ Keine Custom Commands gesetzt.",
  listTitle: "📝 Custom Commands",
  addExample: "❌ Beispiel: `,cmd add hallo Hallo Welt!`",
  added: (trigger: string) => `✅ Custom Command \`${trigger}\` hinzugefügt!`,
  notFound: "❌ Command nicht gefunden.",
  removed: (trigger: string) => `✅ Custom Command \`${trigger}\` entfernt.`,
  usageHint: "❌ Nutze: `,cmd add <trigger> <response>`, `,cmd remove <trigger>`, `,cmd list`",
};

const sv: Strings = {
  noPermission: "❌ Du har inte behörighet för detta.",
  noCommands: "❌ Inga anpassade kommandon angivna.",
  listTitle: "📝 Anpassade kommandon",
  addExample: "❌ Exempel: `,cmd add hej Hej världen!`",
  added: (trigger: string) => `✅ Anpassat kommando \`${trigger}\` tillagt!`,
  notFound: "❌ Kommandot hittades inte.",
  removed: (trigger: string) => `✅ Anpassat kommando \`${trigger}\` borttaget.`,
  usageHint: "❌ Använd: `,cmd add <trigger> <response>`, `,cmd remove <trigger>`, `,cmd list`",
};

const nl: Strings = {
  noPermission: "❌ Je hebt hier geen toestemming voor.",
  noCommands: "❌ Geen aangepaste commando's ingesteld.",
  listTitle: "📝 Aangepaste commando's",
  addExample: "❌ Voorbeeld: `,cmd add hallo Hallo Wereld!`",
  added: (trigger: string) => `✅ Aangepast commando \`${trigger}\` toegevoegd!`,
  notFound: "❌ Commando niet gevonden.",
  removed: (trigger: string) => `✅ Aangepast commando \`${trigger}\` verwijderd.`,
  usageHint: "❌ Gebruik: `,cmd add <trigger> <response>`, `,cmd remove <trigger>`, `,cmd list`",
};

const ar: Strings = {
  noPermission: "❌ ليس لديك صلاحية للقيام بذلك.",
  noCommands: "❌ لا توجد أوامر مخصصة معيّنة.",
  listTitle: "📝 الأوامر المخصصة",
  addExample: "❌ مثال: `,cmd add hallo Hallo Welt!`",
  added: (trigger: string) => `✅ تمت إضافة الأمر المخصص \`${trigger}\`!`,
  notFound: "❌ لم يتم العثور على الأمر.",
  removed: (trigger: string) => `✅ تمت إزالة الأمر المخصص \`${trigger}\`.`,
  usageHint: "❌ استخدم: `,cmd add <trigger> <response>`, `,cmd remove <trigger>`, `,cmd list`",
};

export const customcommands: Record<Lang, Strings> = { en, de, sv, nl, ar };
