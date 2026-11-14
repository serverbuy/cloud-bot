import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { funextra } from "../lib/locales/extra/funextra";
import { fetchGif } from "../prefix/commands/funExtra";

// Commands in this file work everywhere: servers, DMs and group chats
// (registered as user-installable in register.ts). No guild access needed.

const PINK = 0xff2a6d;
const CYAN = 0x05d9e8;
const tr = funextra.de;
const pick = <T,>(a: readonly T[]) => a[Math.floor(Math.random() * a.length)]!;
const strip = (s: string) =>
  s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu, "").trim();
const card = (title: string, desc: string, color = PINK) =>
  new EmbedBuilder().setColor(color).setTitle(title).setDescription(desc);

/** Deterministic 0–100 score so the same input always gives the same result. */
function score(...parts: string[]) {
  let h = 7;
  for (const c of parts.join("|")) h = (h * 31 + c.charCodeAt(0)) % 1_000_003;
  return h % 101;
}
const bar = (p: number) => "█".repeat(Math.round(p / 10)) + "░".repeat(10 - Math.round(p / 10));

type Cmd = {
  data: { name: string; toJSON(): unknown };
  execute(i: ChatInputCommandInteraction): Promise<void>;
};

// ---------- talk ----------
const ANSWERS = [
  "Ja, ganz sicher.", "Definitiv.", "Ohne Zweifel.", "Sieht gut aus.", "Wahrscheinlich ja.",
  "Frag später nochmal.", "Kann ich gerade nicht sagen.", "Konzentrier dich und frag nochmal.",
  "Eher nicht.", "Meine Quellen sagen nein.", "Sehr zweifelhaft.", "Nein.",
];

const eightball: Cmd = {
  data: new SlashCommandBuilder().setName("8ball").setDescription("Frag den magischen 8-Ball")
    .addStringOption((o) => o.setName("frage").setDescription("Deine Frage").setRequired(true)),
  async execute(i) {
    const q = i.options.getString("frage", true).slice(0, 900);
    await i.reply({ embeds: [card("8-Ball", `> ${q}\n\n**${pick(ANSWERS)}**`)] });
  },
};

const simpleText = (name: string, desc: string, title: string, list: readonly string[], color = PINK): Cmd => ({
  data: new SlashCommandBuilder().setName(name).setDescription(desc),
  async execute(i) {
    await i.reply({ embeds: [card(title, pick(list), color)] });
  },
});

const joke = simpleText("joke", "Zufälliger Witz", strip(tr.jokeTitle), tr.jokes);
const fact = simpleText("fact", "Wusstest du schon?", strip(tr.didYouKnow), tr.facts, CYAN);
const quote = simpleText("quote", "Ein Zitat", strip(tr.quoteTitle), tr.quotes, CYAN);
const advice = simpleText("advice", "Ein Rat für dich", strip(tr.adviceTitle), tr.advice, CYAN);

const targeted = (name: string, desc: string, title: string, list: readonly string[]): Cmd => ({
  data: new SlashCommandBuilder().setName(name).setDescription(desc)
    .addUserOption((o) => o.setName("user").setDescription("Wen? (leer = du)")),
  async execute(i) {
    const u = i.options.getUser("user") ?? i.user;
    await i.reply({ embeds: [card(title, `<@${u.id}>, ${pick(list)}`)] });
  },
});

const roast = targeted("roast", "Jemanden roasten", "Roast", tr.roasts);
const compliment = targeted("compliment", "Jemandem ein Kompliment machen", "Kompliment", tr.compliments);

// ---------- ratings ----------
const ship: Cmd = {
  data: new SlashCommandBuilder().setName("ship").setDescription("Wie gut passen zwei zusammen?")
    .addUserOption((o) => o.setName("person1").setDescription("Erste Person").setRequired(true))
    .addUserOption((o) => o.setName("person2").setDescription("Zweite Person (leer = du)")),
  async execute(i) {
    const a = i.options.getUser("person1", true);
    const b = i.options.getUser("person2") ?? i.user;
    const p = score("ship", ...[a.id, b.id].sort());
    const verdict = p > 80 ? "Seelenverwandte." : p > 50 ? "Da geht was." : p > 25 ? "Eher Freunde." : "Lieber nicht.";
    const name = a.username.slice(0, Math.ceil(a.username.length / 2)) + b.username.slice(Math.floor(b.username.length / 2));
    await i.reply({ embeds: [card(`Ship · ${name}`, `**${a.username}** × **${b.username}**\n\n\`${bar(p)}\` **${p}%**\n${verdict}`)] });
  },
};

const rateUser = (name: string, desc: string, title: string, fmt: (p: number) => string): Cmd => ({
  data: new SlashCommandBuilder().setName(name).setDescription(desc)
    .addUserOption((o) => o.setName("user").setDescription("Wen? (leer = du)")),
  async execute(i) {
    const u = i.options.getUser("user") ?? i.user;
    const p = score(name, u.id);
    await i.reply({ embeds: [card(title, `<@${u.id}>\n\n\`${bar(p)}\` ${fmt(p)}`)] });
  },
});

const iq = rateUser("iq", "IQ-Test", "IQ-Test", (p) => `IQ **${40 + Math.round(p * 1.4)}**`);
const simprate = rateUser("simprate", "Wie sehr simpst du?", "Simp-Rate", (p) => `**${p}%** simp`);
const vibe = rateUser("vibe", "Vibe-Check", "Vibe-Check", (p) =>
  `**${p}%** · ${p > 75 ? "immaculate" : p > 50 ? "solide" : p > 25 ? "fragwürdig" : "keine vibes"}`);

const rate: Cmd = {
  data: new SlashCommandBuilder().setName("rate").setDescription("Bewerte irgendwas")
    .addStringOption((o) => o.setName("was").setDescription("Was soll bewertet werden?").setRequired(true)),
  async execute(i) {
    const thing = i.options.getString("was", true).slice(0, 200);
    const s = Math.round(score("rate", thing.toLowerCase()) / 10);
    await i.reply({ embeds: [card("Bewertung", `**${thing}** bekommt **${s}/10**`)] });
  },
};

// ---------- games ----------
const coinflip: Cmd = {
  data: new SlashCommandBuilder().setName("coinflip").setDescription("Münze werfen"),
  async execute(i) {
    await i.reply({ embeds: [card("Münzwurf", `**${Math.random() < 0.5 ? "Kopf" : "Zahl"}**`, CYAN)] });
  },
};

const dice: Cmd = {
  data: new SlashCommandBuilder().setName("dice").setDescription("Würfeln")
    .addIntegerOption((o) => o.setName("seiten").setDescription("Seiten (Standard 6)").setMinValue(2).setMaxValue(1000)),
  async execute(i) {
    const n = i.options.getInteger("seiten") ?? 6;
    await i.reply({ embeds: [card(`W${n}`, `Du würfelst **${1 + Math.floor(Math.random() * n)}**`, CYAN)] });
  },
};

const choose: Cmd = {
  data: new SlashCommandBuilder().setName("choose").setDescription("Lass den Bot entscheiden")
    .addStringOption((o) => o.setName("optionen").setDescription("Mit Komma trennen: Pizza, Burger, Sushi").setRequired(true)),
  async execute(i) {
    const opts = i.options.getString("optionen", true).split(/[,|]/).map((s) => s.trim()).filter(Boolean);
    if (opts.length < 2) {
      await i.reply({ content: "Gib mindestens zwei Optionen mit Komma getrennt an.", flags: MessageFlags.Ephemeral });
      return;
    }
    await i.reply({ embeds: [card("Entscheidung", `Ich nehme **${pick(opts).slice(0, 200)}**`, CYAN)] });
  },
};

const RPS = { schere: "papier", stein: "schere", papier: "stein" } as const;
const rps: Cmd = {
  data: new SlashCommandBuilder().setName("rps").setDescription("Schere, Stein, Papier gegen den Bot")
    .addStringOption((o) => o.setName("wahl").setDescription("Deine Wahl").setRequired(true)
      .addChoices({ name: "Schere", value: "schere" }, { name: "Stein", value: "stein" }, { name: "Papier", value: "papier" })),
  async execute(i) {
    const me = i.options.getString("wahl", true) as keyof typeof RPS;
    const bot = pick(Object.keys(RPS) as (keyof typeof RPS)[]);
    const res = me === bot ? "Unentschieden." : RPS[me] === bot ? "Du gewinnst." : "Ich gewinne.";
    await i.reply({ embeds: [card("Schere · Stein · Papier", `Du: **${me}**\nBot: **${bot}**\n\n**${res}**`)] });
  },
};

// ---------- actions with gif ----------
const action = (name: string, desc: string, verb: string, needsTarget = true): Cmd => {
  const b = new SlashCommandBuilder().setName(name).setDescription(desc);
  if (needsTarget) b.addUserOption((o) => o.setName("user").setDescription("Wen?").setRequired(true));
  return {
    data: b,
    async execute(i) {
      await i.deferReply();
      const u = needsTarget ? i.options.getUser("user", true) : null;
      const gif = await fetchGif(name);
      const e = new EmbedBuilder().setColor(PINK)
        .setDescription(u ? `**${i.user.username}** ${verb} <@${u.id}>` : `**${i.user.username}** ${verb}`);
      if (gif) e.setImage(gif);
      await i.editReply({ embeds: [e] });
    },
  };
};

const actions = [
  action("hug", "Jemanden umarmen", "umarmt"),
  action("kiss", "Jemanden küssen", "küsst"),
  action("cuddle", "Mit jemandem kuscheln", "kuschelt mit"),
  action("pat", "Jemanden streicheln", "streichelt"),
  action("slap", "Jemanden ohrfeigen", "ohrfeigt"),
  action("punch", "Jemanden boxen", "boxt"),
  action("bite", "Jemanden beißen", "beißt"),
  action("poke", "Jemanden anstupsen", "stupst"),
  action("highfive", "High five geben", "klatscht ab mit"),
  action("wink", "Jemandem zuzwinkern", "zwinkert"),
  action("dance", "Tanzen", "tanzt", false),
];

// ---------- tools ----------
const calc: Cmd = {
  data: new SlashCommandBuilder().setName("calc").setDescription("Taschenrechner")
    .addStringOption((o) => o.setName("rechnung").setDescription("z. B. 12 * (3 + 4) / 2").setRequired(true)),
  async execute(i) {
    const expr = i.options.getString("rechnung", true);
    if (!/^[0-9+\-*/().\s%]+$/.test(expr) || expr.length > 200) {
      await i.reply({ content: "Nur Zahlen und + - * / ( ) % erlaubt.", flags: MessageFlags.Ephemeral });
      return;
    }
    try {
      const r = Function(`"use strict"; return (${expr})`)();
      if (typeof r !== "number" || !isFinite(r)) throw new Error();
      await i.reply({ embeds: [card("Rechner", `\`${expr}\` = **${+r.toFixed(10)}**`, CYAN)] });
    } catch {
      await i.reply({ content: "Ungültige Rechnung.", flags: MessageFlags.Ephemeral });
    }
  },
};

const password: Cmd = {
  data: new SlashCommandBuilder().setName("password").setDescription("Sicheres Passwort erstellen (nur du siehst es)")
    .addIntegerOption((o) => o.setName("länge").setDescription("4–64, Standard 16").setMinValue(4).setMaxValue(64)),
  async execute(i) {
    const len = i.options.getInteger("länge") ?? 16;
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
    const { randomInt } = await import("node:crypto");
    let pw = "";
    for (let n = 0; n < len; n++) pw += chars[randomInt(chars.length)];
    await i.reply({ embeds: [card("Passwort", `\`${pw}\``, CYAN)], flags: MessageFlags.Ephemeral });
  },
};

const qr: Cmd = {
  data: new SlashCommandBuilder().setName("qr").setDescription("QR-Code erstellen")
    .addStringOption((o) => o.setName("text").setDescription("Text oder Link").setRequired(true)),
  async execute(i) {
    const t = i.options.getString("text", true).slice(0, 900);
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(t)}`;
    await i.reply({ embeds: [new EmbedBuilder().setColor(CYAN).setTitle("QR-Code").setImage(url)] });
  },
};

const MOCK = (s: string) => [...s].map((c, n) => (n % 2 ? c.toUpperCase() : c.toLowerCase())).join("");
const VAPOR = (s: string) => [...s].map((c) => (c >= "!" && c <= "~" ? String.fromCharCode(c.charCodeAt(0) + 0xfee0) : c === " " ? "　" : c)).join("");
const text: Cmd = {
  data: new SlashCommandBuilder().setName("text").setDescription("Text umstylen")
    .addStringOption((o) => o.setName("stil").setDescription("Stil").setRequired(true).addChoices(
      { name: "mOcK", value: "mock" }, { name: "Ｖａｐｏｒ", value: "vapor" }, { name: "rückwärts", value: "reverse" },
      { name: "G R O S S", value: "space" }, { name: "uwu", value: "owo" }))
    .addStringOption((o) => o.setName("text").setDescription("Dein Text").setRequired(true)),
  async execute(i) {
    const s = i.options.getString("text", true).slice(0, 900);
    const out = {
      mock: () => MOCK(s),
      vapor: () => VAPOR(s),
      reverse: () => [...s].reverse().join(""),
      space: () => [...s.toUpperCase()].join(" "),
      owo: () => s.replace(/[rl]/g, "w").replace(/[RL]/g, "W").replace(/n([aeiou])/g, "ny$1") + " uwu",
    }[i.options.getString("stil", true) as "mock"]();
    await i.reply(out.slice(0, 2000));
  },
};

export const funCommands: Cmd[] = [
  eightball, joke, fact, quote, advice, roast, compliment,
  ship, iq, simprate, vibe, rate,
  coinflip, dice, choose, rps,
  ...actions,
  calc, password, qr, text,
];
