import type { Lang } from "../../i18n";

const en = {
  noData: "📭 No data yet.",
  usageLine: (cmd: string, count: number) => `\`${cmd}\`: **${count}** uses`,
  title: "📊 Cloud#0836 Statistics",
  totalField: "📈 Total Commands",
  uniqueField: "📈 Unique Commands",
  topField: "🐟 Top Commands",
};

type Strings = typeof en;

const de: Strings = {
  noData: "📭 Noch keine Daten.",
  usageLine: (cmd: string, count: number) => `\`${cmd}\`: **${count}** Nutzungen`,
  title: "📊 Cloud#0836 Statistiken",
  totalField: "📈 Gesamt Commands",
  uniqueField: "📈 Einzigartige Commands",
  topField: "🐟 Top Commands",
};

const sv: Strings = {
  noData: "📭 Ingen data än.",
  usageLine: (cmd: string, count: number) => `\`${cmd}\`: **${count}** användningar`,
  title: "📊 Cloud#0836 Statistik",
  totalField: "📈 Totalt antal kommandon",
  uniqueField: "📈 Unika kommandon",
  topField: "🐟 Toppkommandon",
};

const nl: Strings = {
  noData: "📭 Nog geen gegevens.",
  usageLine: (cmd: string, count: number) => `\`${cmd}\`: **${count}** keer gebruikt`,
  title: "📊 Cloud#0836 Statistieken",
  totalField: "📈 Totaal aantal commando's",
  uniqueField: "📈 Unieke commando's",
  topField: "🐟 Topcommando's",
};

const ar: Strings = {
  noData: "📭 لا توجد بيانات بعد.",
  usageLine: (cmd: string, count: number) => `\`${cmd}\`: **${count}** استخدام`,
  title: "📊 إحصائيات Cloud#0836",
  totalField: "📈 إجمالي الأوامر",
  uniqueField: "📈 الأوامر الفريدة",
  topField: "🐟 أبرز الأوامر",
};

export const botstats: Record<Lang, Strings> = { en, de, sv, nl, ar };
