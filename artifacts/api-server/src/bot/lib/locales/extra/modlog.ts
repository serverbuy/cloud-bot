import type { Lang } from "../../i18n";

const en = {
  target: "🎯 Target",
  moderator: "👮 Moderator",
  reason: "📝 Reason",
  duration: "⏱️ Duration",
};

type Strings = typeof en;

const de: Strings = {
  target: "🎯 Ziel",
  moderator: "👮 Moderator",
  reason: "📝 Grund",
  duration: "⏱️ Dauer",
};

const sv: Strings = {
  target: "🎯 Mål",
  moderator: "👮 Moderator",
  reason: "📝 Anledning",
  duration: "⏱️ Varaktighet",
};

const nl: Strings = {
  target: "🎯 Doelwit",
  moderator: "👮 Moderator",
  reason: "📝 Reden",
  duration: "⏱️ Duur",
};

const ar: Strings = {
  target: "🎯 الهدف",
  moderator: "👮 المشرف",
  reason: "📝 السبب",
  duration: "⏱️ المدة",
};

export const modlog: Record<Lang, Strings> = { en, de, sv, nl, ar };
