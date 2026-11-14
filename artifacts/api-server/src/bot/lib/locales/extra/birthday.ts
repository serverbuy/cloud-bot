import type { Lang } from "../../i18n";

const en = {
  formatError: "❌ Format: `,birthday MM-DD` (e.g. `,birthday 12-31`)",
  invalidDate: "❌ Invalid date.",
  birthdaySet: (input: string) => `🎉 Birthday set: **${input}**!\nWe'll celebrate on that day! 🎂`,
  noBirthdays: "📭 No birthdays added yet.",
  todayLabel: " 🎉 TODAY!",
  listTitle: "🎂 Birthday List",
  congratsTitle: "🎉 Happy Birthday!",
  congratsDesc: (uid: string) => `🎂 <@${uid}> has a birthday today!\n\nCongratulations! 🎉🎂💌`,
};

type Strings = typeof en;

const de: Strings = {
  formatError: "❌ Format: `,birthday MM-DD` (z.B. `,birthday 12-31`)",
  invalidDate: "❌ Ungültiges Datum.",
  birthdaySet: (input: string) => `🎉 Geburtstag gesetzt: **${input}**!\nWir gratulieren an diesem Tag! 🎂`,
  noBirthdays: "📭 Noch keine Geburtstage eingetragen.",
  todayLabel: " 🎉 HEUTE!",
  listTitle: "🎂 Geburtstags-Liste",
  congratsTitle: "🎉 Alles Gute zum Geburtstag!",
  congratsDesc: (uid: string) => `🎂 <@${uid}> hat heute Geburtstag!\n\nHerzlichen Glückwunsch! 🎉🎂💌`,
};

const sv: Strings = {
  formatError: "❌ Format: `,birthday MM-DD` (t.ex. `,birthday 12-31`)",
  invalidDate: "❌ Ogiltigt datum.",
  birthdaySet: (input: string) => `🎉 Födelsedag inställd: **${input}**!\nVi gratulerar den dagen! 🎂`,
  noBirthdays: "📭 Inga födelsedagar tillagda än.",
  todayLabel: " 🎉 IDAG!",
  listTitle: "🎂 Födelsedagslista",
  congratsTitle: "🎉 Grattis på födelsedagen!",
  congratsDesc: (uid: string) => `🎂 <@${uid}> fyller år idag!\n\nGrattis! 🎉🎂💌`,
};

const nl: Strings = {
  formatError: "❌ Formaat: `,birthday MM-DD` (bijv. `,birthday 12-31`)",
  invalidDate: "❌ Ongeldige datum.",
  birthdaySet: (input: string) => `🎉 Verjaardag ingesteld: **${input}**!\nWe feliciteren je op die dag! 🎂`,
  noBirthdays: "📭 Nog geen verjaardagen toegevoegd.",
  todayLabel: " 🎉 VANDAAG!",
  listTitle: "🎂 Verjaardagslijst",
  congratsTitle: "🎉 Gefeliciteerd met je verjaardag!",
  congratsDesc: (uid: string) => `🎂 <@${uid}> is vandaag jarig!\n\nGefeliciteerd! 🎉🎂💌`,
};

const ar: Strings = {
  formatError: "❌ الصيغة: `,birthday MM-DD` (مثال: `,birthday 12-31`)",
  invalidDate: "❌ تاريخ غير صالح.",
  birthdaySet: (input: string) => `🎉 تم تعيين عيد الميلاد: **${input}**!\nسنهنئك في ذلك اليوم! 🎂`,
  noBirthdays: "📭 لم تُضَف أعياد ميلاد بعد.",
  todayLabel: " 🎉 اليوم!",
  listTitle: "🎂 قائمة أعياد الميلاد",
  congratsTitle: "🎉 عيد ميلاد سعيد!",
  congratsDesc: (uid: string) => `🎂 <@${uid}> عيد ميلاده اليوم!\n\nتهانينا! 🎉🎂💌`,
};

export const birthday: Record<Lang, Strings> = { en, de, sv, nl, ar };
