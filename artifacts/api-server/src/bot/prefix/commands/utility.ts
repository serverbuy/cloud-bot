import { Message, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { utility } from "../../lib/locales/extra/utility";

function embed(title: string, desc: string, color = 0x5865f2) {
  return new EmbedBuilder().setTitle(title).setDescription(desc).setColor(color).setTimestamp();
}

export const calcCmd: PrefixCommand = {
  name: "calc", aliases: ["math", "rechne"], description: "Calculator / Taschenrechner", usage: ",calc 2 + 2 * 3",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = utility[getLangCode(gid)];
    const expr = args.join(" ");
    if (!expr) { await message.reply(tr.calcProvide); return; }
    if (!/^[0-9+\-*/().\s%]+$/.test(expr)) { await message.reply(tr.calcOnlyNumbers); return; }
    try {
      const result = Function(`"use strict"; return (${expr})`)();
      if (typeof result !== "number" || !isFinite(result)) throw new Error("invalid");
      await message.channel.send({ embeds: [embed("🧮 " + tr.calcTitle, `\`${expr}\` = **${result}**`)] });
    } catch {
      await message.reply(tr.calcInvalid);
    }
  },
};

export const uppercaseCmd: PrefixCommand = {
  name: "uppercase", aliases: ["upper", "groß"], description: "UPPERCASE text / GROSSBUCHSTABEN", usage: ",uppercase <text>",
  async execute(message, args) {
    const text = args.join(" ");
    if (!text) { await message.reply("❌"); return; }
    await message.channel.send(text.toUpperCase().slice(0, 2000));
  },
};

export const lowercaseCmd: PrefixCommand = {
  name: "lowercase", aliases: ["lower", "klein"], description: "lowercase text / kleinbuchstaben", usage: ",lowercase <text>",
  async execute(message, args) {
    const text = args.join(" ");
    if (!text) { await message.reply("❌"); return; }
    await message.channel.send(text.toLowerCase().slice(0, 2000));
  },
};

export const base64Cmd: PrefixCommand = {
  name: "base64encode", aliases: ["b64encode", "encode"], description: "Encode to Base64 / Base64 kodieren", usage: ",base64encode <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = utility[getLangCode(gid)];
    const text = args.join(" ");
    if (!text) { await message.reply(tr.provideText); return; }
    await message.channel.send({ embeds: [embed("🔐 Base64", `\`\`\`${Buffer.from(text).toString("base64").slice(0, 1900)}\`\`\``)] });
  },
};

export const base64DecodeCmd: PrefixCommand = {
  name: "base64decode", aliases: ["b64decode", "decode"], description: "Decode Base64 / Base64 dekodieren", usage: ",base64decode <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = utility[getLangCode(gid)];
    const text = args.join(" ");
    if (!text) { await message.reply(tr.provideText); return; }
    try {
      await message.channel.send({ embeds: [embed("🔓 Base64", `\`\`\`${Buffer.from(text, "base64").toString("utf-8").slice(0, 1900)}\`\`\``)] });
    } catch {
      await message.reply(tr.invalidBase64);
    }
  },
};

export const binaryCmd: PrefixCommand = {
  name: "binary", aliases: ["bin"], description: "Text to binary / Text zu Binär", usage: ",binary <text>",
  async execute(message, args) {
    const text = args.join(" ");
    if (!text) { await message.reply("❌"); return; }
    const bin = text.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    await message.channel.send({ embeds: [embed("🤖 Binary", `\`\`\`${bin.slice(0, 1900)}\`\`\``)] });
  },
};

export const reverseTextCmd: PrefixCommand = {
  name: "length", aliases: ["len", "count"], description: "Count characters / Zeichen zählen", usage: ",length <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = utility[getLangCode(gid)];
    const text = args.join(" ");
    if (!text) { await message.reply("❌"); return; }
    const words = text.trim().split(/\s+/).length;
    await message.channel.send({ embeds: [embed("📏 " + tr.countTitle, tr.countResult(text.length, words))] });
  },
};

export const passwordCmd: PrefixCommand = {
  name: "password", aliases: ["pass", "genpass"], description: "Generate password / Passwort generieren", usage: ",password [length]",
  async execute(message, args) {
    const tr = utility[getLangCode(message.guildId!)];
    const len = Math.min(Math.max(parseInt(args[0] ?? "16") || 16, 4), 64);
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*";
    let pw = "";
    for (let i = 0; i < len; i++) pw += chars[Math.floor(Math.random() * chars.length)];
    await message.author.send({ embeds: [embed("🔑 Password", `\`${pw}\``)] }).then(() => message.reply("📬 " + tr.sentToDms)).catch(() => message.reply("❌ " + tr.enableDms));
  },
};

export const colorCmd: PrefixCommand = {
  name: "color", aliases: ["farbe", "hex"], description: "Show a color / Farbe anzeigen", usage: ",color #ff0000",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = utility[getLangCode(gid)];
    let hex = args[0]?.replace("#", "");
    if (!hex) hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) { await message.reply(tr.invalidHex); return; }
    const num = parseInt(hex, 16);
    const e = new EmbedBuilder().setTitle("🎨 #" + hex.toUpperCase()).setColor(num)
      .setThumbnail(`https://singlecolorimage.com/get/${hex}/200x200`).setTimestamp();
    await message.channel.send({ embeds: [e] });
  },
};

export const choosePctCmd: PrefixCommand = {
  name: "percent", aliases: ["chance", "howmuch"], description: "Random percentage / Zufällige Prozent", usage: ",percent <thing>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = utility[getLangCode(gid)];
    const thing = args.join(" ") || tr.thisWord;
    await message.channel.send({ embeds: [embed("📊 " + tr.chanceTitle, tr.chanceResult(thing, Math.floor(Math.random() * 101)))] });
  },
};

export const timestampCmd: PrefixCommand = {
  name: "timestamp", aliases: ["time", "unix"], description: "Current timestamp / Aktueller Zeitstempel", usage: ",timestamp",
  async execute(message) {
    const now = Math.floor(Date.now() / 1000);
    await message.channel.send({ embeds: [embed("🕐 Timestamp", `Unix: \`${now}\`\nDiscord: <t:${now}:F>\nRelative: <t:${now}:R>`)] });
  },
};

export const flipTextCmd: PrefixCommand = {
  name: "flip", aliases: ["upsidedown"], description: "Flip text upside down / Text umdrehen", usage: ",flip <text>",
  async execute(message, args) {
    const text = args.join(" ");
    if (!text) { await message.reply("❌"); return; }
    const normal = "abcdefghijklmnopqrstuvwxyz_,;.?!/\\'()[]{}<>";
    const flipped = "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz‾'؛˙¿¡/\\,)(][}{><";
    const out = text.toLowerCase().split("").map((c) => { const i = normal.indexOf(c); return i >= 0 ? flipped[i] : c; }).reverse().join("");
    await message.channel.send(out.slice(0, 2000));
  },
};

export const spaceCmd: PrefixCommand = {
  name: "space", aliases: ["spread"], description: "S p a c e   t e x t", usage: ",space <text>",
  async execute(message, args) {
    const text = args.join(" ");
    if (!text) { await message.reply("❌"); return; }
    await message.channel.send(text.split("").join(" ").slice(0, 2000));
  },
};

export const vaporwaveCmd: PrefixCommand = {
  name: "vaporwave", aliases: ["aesthetic"], description: "Ｖａｐｏｒｗａｖｅ text", usage: ",vaporwave <text>",
  async execute(message, args) {
    const text = args.join(" ");
    if (!text) { await message.reply("❌"); return; }
    const out = text.split("").map((c) => { const code = c.charCodeAt(0); return code >= 33 && code <= 126 ? String.fromCharCode(code + 65248) : c === " " ? "　" : c; }).join("");
    await message.channel.send(out.slice(0, 2000));
  },
};

export const owoCmd: PrefixCommand = {
  name: "owoify", aliases: ["owo", "uwu"], description: "OwO-ify text / Text owoifizieren", usage: ",owoify <text>",
  async execute(message, args) {
    const text = args.join(" ");
    if (!text) { await message.reply("❌"); return; }
    const out = text.replace(/[rl]/g, "w").replace(/[RL]/g, "W").replace(/n([aeiou])/g, "ny$1") + " owo";
    await message.channel.send(out.slice(0, 2000));
  },
};

export const repeatCmd: PrefixCommand = {
  name: "repeat", aliases: ["spam"], description: "Repeat text / Text wiederholen", usage: ",repeat <count> <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = utility[getLangCode(gid)];
    const count = Math.min(Math.max(parseInt(args[0] ?? "") || 0, 1), 10);
    const text = args.slice(1).join(" ");
    if (!text) { await message.reply(tr.repeatUsage); return; }
    await message.channel.send((text + " ").repeat(count).slice(0, 2000));
  },
};

export const rollNumberCmd: PrefixCommand = {
  name: "random", aliases: ["rng", "number"], description: "Random number / Zufallszahl", usage: ",random <min> <max>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = utility[getLangCode(gid)];
    const min = parseInt(args[0] ?? "1") || 1;
    const max = parseInt(args[1] ?? "100") || 100;
    const lo = Math.min(min, max), hi = Math.max(min, max);
    const result = Math.floor(Math.random() * (hi - lo + 1)) + lo;
    await message.channel.send({ embeds: [embed("🎲 " + tr.randomTitle, tr.randomResult(lo, hi, result))] });
  },
};

export const qrCmd: PrefixCommand = {
  name: "qr", aliases: ["qrcode"], description: "Generate QR code / QR-Code erstellen", usage: ",qr <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = utility[getLangCode(gid)];
    const text = args.join(" ");
    if (!text) { await message.reply(tr.provideText); return; }
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`;
    await message.channel.send({ embeds: [new EmbedBuilder().setTitle("📱 QR Code").setImage(url).setColor(0x5865f2)] });
  },
};

export const utilityCommands: PrefixCommand[] = [
  calcCmd, uppercaseCmd, lowercaseCmd, base64Cmd, base64DecodeCmd, binaryCmd,
  reverseTextCmd, passwordCmd, colorCmd, choosePctCmd, timestampCmd, flipTextCmd,
  spaceCmd, vaporwaveCmd, owoCmd, repeatCmd, rollNumberCmd, qrCmd,
];
