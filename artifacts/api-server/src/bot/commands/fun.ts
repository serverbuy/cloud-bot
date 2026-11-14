import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

const COLOR = 0xff2a6d;
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]!;

const ANSWERS = [
  "Ja, ganz sicher.", "Definitiv.", "Ohne Zweifel.", "Sieht gut aus.", "Wahrscheinlich ja.",
  "Frag später nochmal.", "Kann ich gerade nicht sagen.", "Konzentrier dich und frag nochmal.",
  "Eher nicht.", "Meine Quellen sagen nein.", "Sehr zweifelhaft.", "Nein.",
];

const eightball = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Stell der magischen 8-Ball eine Frage")
    .addStringOption((o) => o.setName("frage").setDescription("Deine Frage").setRequired(true)),
  async execute(i: ChatInputCommandInteraction) {
    const q = i.options.getString("frage", true);
    await i.reply({
      embeds: [new EmbedBuilder().setColor(COLOR).setTitle("🎱 8-Ball")
        .addFields({ name: "Frage", value: q.slice(0, 1000) }, { name: "Antwort", value: pick(ANSWERS) })],
    });
  },
};

const coinflip = {
  data: new SlashCommandBuilder().setName("coinflip").setDescription("Wirf eine Münze"),
  async execute(i: ChatInputCommandInteraction) {
    await i.reply(`🪙 **${Math.random() < 0.5 ? "Kopf" : "Zahl"}**`);
  },
};

const dice = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Würfeln")
    .addIntegerOption((o) => o.setName("seiten").setDescription("Anzahl Seiten (Standard 6)").setMinValue(2).setMaxValue(1000)),
  async execute(i: ChatInputCommandInteraction) {
    const n = i.options.getInteger("seiten") ?? 6;
    await i.reply(`🎲 Du würfelst **${1 + Math.floor(Math.random() * n)}** (W${n})`);
  },
};

const ship = {
  data: new SlashCommandBuilder()
    .setName("ship")
    .setDescription("Wie gut passen zwei zusammen?")
    .addUserOption((o) => o.setName("person1").setDescription("Erste Person").setRequired(true))
    .addUserOption((o) => o.setName("person2").setDescription("Zweite Person (leer = du)")),
  async execute(i: ChatInputCommandInteraction) {
    const a = i.options.getUser("person1", true);
    const b = i.options.getUser("person2") ?? i.user;
    const ids = [a.id, b.id].sort().join("");
    let h = 0;
    for (const c of ids) h = (h * 31 + c.charCodeAt(0)) % 101;
    const bar = "█".repeat(Math.round(h / 10)) + "░".repeat(10 - Math.round(h / 10));
    const verdict = h > 80 ? "💞 Seelenverwandte!" : h > 50 ? "💖 Da geht was." : h > 25 ? "💛 Freunde?" : "💔 Eher nicht…";
    await i.reply({
      embeds: [new EmbedBuilder().setColor(COLOR).setTitle("💘 Ship")
        .setDescription(`**${a.username}** × **${b.username}**\n\n\`${bar}\` **${h}%**\n${verdict}`)],
    });
  },
};

const choose = {
  data: new SlashCommandBuilder()
    .setName("choose")
    .setDescription("Lass den Bot entscheiden")
    .addStringOption((o) => o.setName("optionen").setDescription("Mit Komma trennen, z. B. Pizza, Burger, Sushi").setRequired(true)),
  async execute(i: ChatInputCommandInteraction) {
    const opts = i.options.getString("optionen", true).split(",").map((s) => s.trim()).filter(Boolean);
    if (opts.length < 2) {
      await i.reply({ content: "Gib mindestens zwei Optionen mit Komma getrennt an.", ephemeral: true });
      return;
    }
    await i.reply(`🤔 Ich nehme: **${pick(opts).slice(0, 200)}**`);
  },
};

export const funCommands = [eightball, coinflip, dice, ship, choose];
