import { Message, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { funextra } from "../../lib/locales/extra/funextra";

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

// nekos.best — reliable CDN, no key needed
const NEKOS_MAP: Record<string, string> = {
  hug: "hug", kiss: "kiss", slap: "slap", pat: "pat",
  cuddle: "cuddle", punch: "punch", highfive: "highfive",
  wink: "wink", bite: "bite", poke: "poke", dance: "dance",
  bonk: "poke", lick: "nom",
};

async function fetchGif(action: string): Promise<string | null> {
  const timeout = AbortSignal.timeout(5000);

  // Primary: nekos.best
  const nekoAction = NEKOS_MAP[action];
  if (nekoAction) {
    try {
      const res = await fetch(`https://nekos.best/api/v2/${nekoAction}`, { signal: timeout });
      if (res.ok) {
        const data = (await res.json()) as { results?: Array<{ url?: string }> };
        const url = data.results?.[0]?.url;
        if (url) return url;
      }
    } catch { /* fall through to backup */ }
  }

  // Fallback: waifu.pics
  try {
    const res = await fetch(`https://api.waifu.pics/sfw/${action}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}

function simpleEmbed(gid: string, title: string, desc: string, color = 0x5865f2) {
  return new EmbedBuilder().setTitle(title).setDescription(desc).setColor(color).setTimestamp();
}

export const jokeCmd: PrefixCommand = {
  name: "joke", aliases: ["witz"], description: "Random joke / Zufälliger Witz", usage: ",joke",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    await message.channel.send({ embeds: [simpleEmbed(gid, tr.jokeTitle, pick(tr.jokes), 0xfee75c)] });
  },
};

export const dadJokeCmd: PrefixCommand = {
  name: "dadjoke", aliases: ["papawitz"], description: "Dad joke / Papa-Witz", usage: ",dadjoke",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    await message.channel.send({ embeds: [simpleEmbed(gid, "👨 Dad Joke", pick(tr.jokes), 0xfee75c)] });
  },
};

export const factCmd: PrefixCommand = {
  name: "fact", aliases: ["fakt", "didyouknow"], description: "Random fact / Zufälliger Fakt", usage: ",fact",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    await message.channel.send({ embeds: [simpleEmbed(gid, tr.didYouKnow, pick(tr.facts), 0x3498db)] });
  },
};

export const quoteCmd: PrefixCommand = {
  name: "quote", aliases: ["zitat"], description: "Inspirational quote / Zitat", usage: ",quote",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    await message.channel.send({ embeds: [simpleEmbed(gid, tr.quoteTitle, pick(tr.quotes), 0x9b59b6)] });
  },
};

export const adviceCmd: PrefixCommand = {
  name: "advice", aliases: ["rat", "tipp"], description: "Random advice / Zufälliger Rat", usage: ",advice",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    await message.channel.send({ embeds: [simpleEmbed(gid, tr.adviceTitle, pick(tr.advice), 0x1abc9c)] });
  },
};

export const roastCmd: PrefixCommand = {
  name: "roast", aliases: ["disrespect"], description: "Roast someone / Jemanden roasten", usage: ",roast [@user]",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const target = message.mentions.users.first() ?? message.author;
    const line = pick(tr.roasts);
    await message.channel.send({ embeds: [simpleEmbed(gid, "🔥 Roast", `<@${target.id}>, ${line}`, 0xe74c3c)] });
  },
};

export const complimentCmd: PrefixCommand = {
  name: "compliment", aliases: ["kompliment"], description: "Compliment someone / Kompliment machen", usage: ",compliment [@user]",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const target = message.mentions.users.first() ?? message.author;
    const line = pick(tr.compliments);
    await message.channel.send({ embeds: [simpleEmbed(gid, "💖 Compliment", `<@${target.id}>, ${line}`, 0xff69b4)] });
  },
};

export const shipCmd: PrefixCommand = {
  name: "ship", aliases: ["love"], description: "Ship two users / Zwei Nutzer verkuppeln", usage: ",ship @user1 @user2",
  async execute(message) {
    const gid = message.guildId!;
    const users = message.mentions.users.map((u) => u);
    const a = users[0] ?? message.author;
    const b = users[1] ?? message.author;
    const percent = Math.floor(Math.random() * 101);
    const bar = "█".repeat(Math.round(percent / 10)) + "░".repeat(10 - Math.round(percent / 10));
    await message.channel.send({ embeds: [simpleEmbed(gid, "💞 Ship", `**${a.username}** 💗 **${b.username}**\n\n\`${bar}\` **${percent}%**`, 0xff69b4)] });
  },
};

export const rateCmd: PrefixCommand = {
  name: "rate", aliases: ["bewerten"], description: "Rate anything / Etwas bewerten", usage: ",rate <thing>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const thing = args.join(" ") || tr.defaultThing;
    const score = Math.floor(Math.random() * 11);
    await message.channel.send({ embeds: [simpleEmbed(gid, "⭐ Rating", tr.rateResult(thing, score), 0xf1c40f)] });
  },
};

export const simpRateCmd: PrefixCommand = {
  name: "simprate", aliases: ["simp"], description: "Simp rate / Simp-Rate", usage: ",simprate [@user]",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const target = message.mentions.users.first() ?? message.author;
    const percent = Math.floor(Math.random() * 101);
    await message.channel.send({ embeds: [simpleEmbed(gid, "😍 Simp Rate", `<@${target.id}> ${tr.is} **${percent}%** simp 🤡`, 0xff69b4)] });
  },
};

export const iqCmd: PrefixCommand = {
  name: "iq", aliases: ["iqtest"], description: "IQ test / IQ-Test", usage: ",iq [@user]",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const target = message.mentions.users.first() ?? message.author;
    const iq = Math.floor(Math.random() * 200);
    await message.channel.send({ embeds: [simpleEmbed(gid, "🧠 IQ Test", `<@${target.id}> ${tr.iqHas} **${iq}** 🤓`, 0x3498db)] });
  },
};

export const ppCmd: PrefixCommand = {
  name: "pp", aliases: ["ppsize"], description: "PP size / PP-Größe", usage: ",pp [@user]",
  async execute(message) {
    const gid = message.guildId!;
    const target = message.mentions.users.first() ?? message.author;
    const size = Math.floor(Math.random() * 15);
    await message.channel.send({ embeds: [simpleEmbed(gid, "📏 PP Size", `<@${target.id}>\n8${"=".repeat(size)}D`, 0x9b59b6)] });
  },
};

export const gayRateCmd: PrefixCommand = {
  name: "gayrate", aliases: ["howgay"], description: "Rainbow rate / Regenbogen-Rate", usage: ",gayrate [@user]",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const target = message.mentions.users.first() ?? message.author;
    const percent = Math.floor(Math.random() * 101);
    await message.channel.send({ embeds: [simpleEmbed(gid, "🌈 Rainbow Rate", `<@${target.id}> ${tr.is} **${percent}%** 🌈`, 0xff69b4)] });
  },
};

export const chooseCmd: PrefixCommand = {
  name: "choose", aliases: ["pick", "wähle"], description: "Choose between options / Zwischen Optionen wählen", usage: ",choose a | b | c",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const options = args.join(" ").split("|").map((s) => s.trim()).filter(Boolean);
    if (options.length < 2) { await message.reply(tr.chooseNeedOptions); return; }
    await message.channel.send({ embeds: [simpleEmbed(gid, "🤔 Choose", tr.chooseResult(pick(options)), 0x5865f2)] });
  },
};

export const mockCmd: PrefixCommand = {
  name: "mock", aliases: ["spongebob"], description: "mOcK tExT", usage: ",mock <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const text = args.join(" ");
    if (!text) { await message.reply(tr.provideText); return; }
    const mocked = text.split("").map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("");
    await message.channel.send(mocked);
  },
};

export const clapCmd: PrefixCommand = {
  name: "clap", description: "Clap text / Klatsch-Text", usage: ",clap <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const text = args.join(" ");
    if (!text) { await message.reply(tr.provideText); return; }
    await message.channel.send(text.split(" ").join(" 👏 "));
  },
};

export const emojifyCmd: PrefixCommand = {
  name: "emojify", description: "Turn text into emojis / Text zu Emojis", usage: ",emojify <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const text = args.join(" ").toLowerCase();
    if (!text) { await message.reply(tr.provideText); return; }
    const out = text.split("").map((c) => (/[a-z]/.test(c) ? `:regional_indicator_${c}:` : c === " " ? "   " : c)).join(" ");
    await message.channel.send(out.slice(0, 2000));
  },
};

export const sayCmd: PrefixCommand = {
  name: "say", aliases: ["echo"], description: "Bot repeats your text / Bot wiederholt Text", usage: ",say <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const text = args.join(" ");
    if (!text) { await message.reply(tr.provideText); return; }
    await message.delete().catch(() => {});
    await message.channel.send(text.slice(0, 2000));
  },
};

export const reverseCmd: PrefixCommand = {
  name: "reverse", aliases: ["umkehren"], description: "Reverse text / Text umkehren", usage: ",reverse <text>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const text = args.join(" ");
    if (!text) { await message.reply(tr.provideText); return; }
    await message.channel.send(text.split("").reverse().join("").slice(0, 2000));
  },
};

function interaction(name: string, aliases: string[], emoji: string, enVerb: string, deVerb: string): PrefixCommand {
  return {
    name, aliases, description: `${enVerb} someone / ${deVerb}`, usage: `,${name} @user`,
    async execute(message) {
      const gid = message.guildId!;
      const tr = funextra[getLangCode(gid)];
      const target = message.mentions.users.first();
      if (!target) { await message.reply(tr.mentionSomeone); return; }
      const desc = tr.interactionDesc(
        message.author.username,
        tr.verbs[name as keyof typeof tr.verbs],
        target.id,
        emoji,
      );
      const gifUrl = await fetchGif(name);
      const embed = new EmbedBuilder().setDescription(desc).setColor(0xff69b4).setTimestamp();
      if (gifUrl) embed.setImage(gifUrl);
      await message.channel.send({ embeds: [embed] });
    },
  };
}

export const hugCmd = interaction("hug", ["umarmen"], "🤗", "hugs", "umarmt");
export const kissCmd = interaction("kiss", ["küssen"], "💋", "kisses", "küsst");
export const slapCmd = interaction("slap", ["ohrfeige"], "👋", "slaps", "ohrfeigt");
export const patCmd = interaction("pat", ["streicheln"], "🫳", "pats", "streichelt");
export const bonkCmd = interaction("bonk", [], "🔨", "bonks", "bonkt");
export const cuddleCmd = interaction("cuddle", ["kuscheln"], "🥰", "cuddles", "kuschelt mit");
export const punchCmd = interaction("punch", ["schlagen"], "👊", "punches", "boxt");
export const highfiveCmd = interaction("highfive", ["hf"], "✋", "high-fives", "klatscht ab mit");
export const winkCmd = interaction("wink", ["zwinkern"], "😉", "winks at", "zwinkert");
export const biteCmd = interaction("bite", ["beißen"], "😬", "bites", "beißt");
export const lickCmd = interaction("lick", ["lecken"], "👅", "licks", "leckt");
export const pokeCmd = interaction("poke", ["anstupsen"], "👉", "pokes", "stupst");

export const danceCmd: PrefixCommand = {
  name: "dance", aliases: ["tanzen"], description: "Dance! / Tanzen!", usage: ",dance",
  async execute(message) {
    const gid = message.guildId!;
    const tr = funextra[getLangCode(gid)];
    const gifUrl = await fetchGif("dance");
    const embed = new EmbedBuilder()
      .setDescription(tr.danceDesc(message.author.username))
      .setColor(0xff69b4).setTimestamp();
    if (gifUrl) embed.setImage(gifUrl);
    await message.channel.send({ embeds: [embed] });
  },
};

export const funExtraCommands: PrefixCommand[] = [
  jokeCmd, dadJokeCmd, factCmd, quoteCmd, adviceCmd, roastCmd, complimentCmd,
  shipCmd, rateCmd, simpRateCmd, iqCmd, ppCmd, gayRateCmd, chooseCmd, mockCmd,
  clapCmd, emojifyCmd, sayCmd, reverseCmd,
  hugCmd, kissCmd, slapCmd, patCmd, bonkCmd, cuddleCmd, punchCmd, highfiveCmd,
  winkCmd, biteCmd, lickCmd, pokeCmd, danceCmd,
];
