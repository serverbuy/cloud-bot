import type { Lang } from "../../i18n";

const en = {
  noText: "\_\_(no text)\_\_",
};

type Strings = typeof en;

const de: Strings = {
  noText: "\_\_(kein Text)\_\_",
};

const sv: Strings = {
  noText: "\_\_(ingen text)\_\_",
};

const nl: Strings = {
  noText: "\_\_(geen tekst)\_\_",
};

const ar: Strings = {
  noText: "\_\_(لا يوجد نص)\_\_",
};

export const starboard: Record<Lang, Strings> = { en, de, sv, nl, ar };
