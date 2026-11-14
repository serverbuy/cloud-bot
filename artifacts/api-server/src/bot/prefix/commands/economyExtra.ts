import { EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLangCode } from "../../lib/i18n";
import { economyextra } from "../../lib/locales/extra/economyextra";
import { wallets } from "./economy";

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]!;

interface Wallet { balance: number; lastDaily: number; totalEarned: number; }
function getWallet(key: string): Wallet {
  return wallets.get(key) ?? { balance: 0, lastDaily: 0, totalEarned: 0 };
}
function saveWallet(key: string, w: Wallet) { wallets.set(key, w); }

const cooldowns = new Map<string, number>();
function onCooldown(key: string, ms: number): number {
  const last = cooldowns.get(key) ?? 0;
  const now = Date.now();
  if (now - last < ms) return Math.ceil((ms - (now - last)) / 1000);
  cooldowns.set(key, now);
  return 0;
}

function embed(title: string, desc: string, color = 0xffd700) {
  return new EmbedBuilder().setTitle(title).setDescription(desc).setColor(color).setTimestamp();
}

export const begCmd: PrefixCommand = {
  name: "beg", aliases: ["betteln"], description: "Um CloudCoins betteln", usage: ",beg",
  async execute(message) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const cd = onCooldown(`beg-${key}`, 30000);
    if (cd) { await message.reply(tr.waitSeconds(cd)); return; }
    const w = getWallet(key);
    if (Math.random() < 0.3) {
      await message.channel.send({ embeds: [embed("🥺 " + tr.begTitle, tr.begNothing, 0xed4245)] });
      return;
    }
    const amount = Math.floor(Math.random() * 50) + 5;
    w.balance += amount; w.totalEarned += amount; saveWallet(key, w);
    await message.channel.send({ embeds: [embed("🥺 " + tr.begTitle, tr.begGave(amount), 0x57f287)] });
  },
};

export const fishCmd: PrefixCommand = {
  name: "fish", aliases: ["angeln"], description: "Angeln gehen", usage: ",fish",
  async execute(message) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const cd = onCooldown(`fish-${key}`, 60000);
    if (cd) { await message.reply(tr.waitSeconds(cd)); return; }
    const w = getWallet(key);
    const catches = ["🐟", "🐠", "🐡", "🦈", "🦐", "🦀", "🐙", "👢"];
    const c = pick(catches);
    const amount = c === "👢" ? 0 : Math.floor(Math.random() * 60) + 10;
    w.balance += amount; w.totalEarned += amount; saveWallet(key, w);
    await message.channel.send({ embeds: [embed("🎣 " + tr.fishTitle, c === "👢" ? tr.fishBoot(c) : tr.fishCaught(c, amount), c === "👢" ? 0xed4245 : 0x57f287)] });
  },
};

export const huntCmd: PrefixCommand = {
  name: "hunt", aliases: ["jagen"], description: "Jagen gehen", usage: ",hunt",
  async execute(message) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const cd = onCooldown(`hunt-${key}`, 60000);
    if (cd) { await message.reply(tr.waitSeconds(cd)); return; }
    const w = getWallet(key);
    const animals = ["🦌", "🐗", "🦆", "🐰", "🦃", "🐻"];
    const a = pick(animals);
    const amount = Math.floor(Math.random() * 70) + 15;
    w.balance += amount; w.totalEarned += amount; saveWallet(key, w);
    await message.channel.send({ embeds: [embed("🏹 " + tr.huntTitle, tr.huntCaught(a, amount), 0x57f287)] });
  },
};

export const digCmd: PrefixCommand = {
  name: "dig", aliases: ["graben"], description: "Nach Schätzen graben", usage: ",dig",
  async execute(message) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const cd = onCooldown(`dig-${key}`, 60000);
    if (cd) { await message.reply(tr.waitSeconds(cd)); return; }
    const w = getWallet(key);
    const finds = ["💎", "🪙", "⛏️", "🦴", "🗿"];
    const f = pick(finds);
    const amount = Math.floor(Math.random() * 90) + 5;
    w.balance += amount; w.totalEarned += amount; saveWallet(key, w);
    await message.channel.send({ embeds: [embed("⛏️ " + tr.digTitle, tr.digFound(f, amount), 0x57f287)] });
  },
};

export const gambleCmd: PrefixCommand = {
  name: "gamble", aliases: ["bet", "wetten"], description: "CloudCoins wetten", usage: ",gamble <amount>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const w = getWallet(key);
    const amount = parseInt(args[0] ?? "");
    if (isNaN(amount) || amount < 1) { await message.reply(tr.invalidAmount); return; }
    if (w.balance < amount) { await message.reply(tr.notEnough); return; }
    if (Math.random() < 0.45) {
      w.balance += amount; w.totalEarned += amount; saveWallet(key, w);
      await message.channel.send({ embeds: [embed("🎰 " + tr.wonTitle, tr.gambleWon(amount, w.balance), 0x57f287)] });
    } else {
      w.balance -= amount; saveWallet(key, w);
      await message.channel.send({ embeds: [embed("🎰 " + tr.lostTitle, tr.gambleLost(amount, w.balance), 0xed4245)] });
    }
  },
};

export const robCmd: PrefixCommand = {
  name: "robuser", aliases: ["mug"], description: "Anderen Nutzer ausrauben", usage: ",robuser @user",
  async execute(message) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const target = message.mentions.users.first();
    if (!target || target.id === message.author.id) { await message.reply(tr.robNoTarget); return; }
    const key = `${gid}-${message.author.id}`;
    const tKey = `${gid}-${target.id}`;
    const cd = onCooldown(`rob-${key}`, 120000);
    if (cd) { await message.reply(tr.waitSeconds(cd)); return; }
    const w = getWallet(key); const tw = getWallet(tKey);
    if (tw.balance < 20) { await message.reply(tr.robTooPoor); return; }
    if (Math.random() < 0.5) {
      const stolen = Math.floor(tw.balance * (Math.random() * 0.3 + 0.1));
      tw.balance -= stolen; w.balance += stolen;
      saveWallet(key, w); saveWallet(tKey, tw);
      await message.channel.send({ embeds: [embed("🦹 " + tr.robberyTitle, tr.robStole(stolen, target.id), 0x57f287)] });
    } else {
      const fine = Math.floor(w.balance * 0.15);
      w.balance = Math.max(0, w.balance - fine); saveWallet(key, w);
      await message.channel.send({ embeds: [embed("👮 " + tr.caughtTitle, tr.robCaught(fine), 0xed4245)] });
    }
  },
};

export const depositCmd: PrefixCommand = {
  name: "deposit", aliases: ["dep"], description: "Vermögen anzeigen", usage: ",deposit",
  async execute(message) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const w = getWallet(key);
    await message.channel.send({ embeds: [embed("🏦 " + tr.bankTitle, tr.bankBalance(w.balance, w.totalEarned))] });
  },
};

export const lotteryCmd: PrefixCommand = {
  name: "lottery", aliases: ["lotto"], description: "Lotterielos kaufen", usage: ",lottery",
  async execute(message) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const w = getWallet(key);
    const TICKET = 50;
    if (w.balance < TICKET) { await message.reply(tr.lotteryTicketCost(TICKET)); return; }
    w.balance -= TICKET;
    const roll = Math.random();
    let won = 0;
    if (roll < 0.01) won = 5000;
    else if (roll < 0.05) won = 1000;
    else if (roll < 0.2) won = 200;
    w.balance += won; w.totalEarned += won; saveWallet(key, w);
    await message.channel.send({ embeds: [embed("🎟️ " + tr.lotteryTitle, won > 0 ? tr.lotteryWon(won, w.balance) : tr.lotteryNoLuck(w.balance), won > 0 ? 0x57f287 : 0xed4245)] });
  },
};

export const slotsBetCmd: PrefixCommand = {
  name: "spin", aliases: ["betslot"], description: "Spielautomat", usage: ",spin <amount>",
  async execute(message, args) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const w = getWallet(key);
    const amount = parseInt(args[0] ?? "");
    if (isNaN(amount) || amount < 1) { await message.reply(tr.invalidAmount); return; }
    if (w.balance < amount) { await message.reply(tr.notEnough); return; }
    const symbols = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣"];
    const r = [pick(symbols), pick(symbols), pick(symbols)];
    let mult = 0;
    if (r[0] === r[1] && r[1] === r[2]) mult = r[0] === "7️⃣" ? 10 : r[0] === "💎" ? 5 : 3;
    else if (r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) mult = 1.5;
    const net = Math.floor(amount * mult) - amount;
    w.balance += net; if (net > 0) w.totalEarned += net; saveWallet(key, w);
    await message.channel.send({ embeds: [embed("🎰 " + tr.slotsTitle, `${r.join(" | ")}\n\n${net >= 0 ? "🟢 +" : "🔴 "}${net} CloudCoins\n${tr.balanceLabel}: **${w.balance}**`, net >= 0 ? 0x57f287 : 0xed4245)] });
  },
};

// --- New: Mine ---
const ORES = [
  { emoji: "🪨", name: "Kohle",    min: 5,   max: 20,  chance: 0.40 },
  { emoji: "⛏️",  name: "Eisen",   min: 20,  max: 50,  chance: 0.30 },
  { emoji: "🥇",  name: "Gold",    min: 50,  max: 120, chance: 0.18 },
  { emoji: "💎",  name: "Diamant", min: 120, max: 300, chance: 0.09 },
  { emoji: "🌟",  name: "Kristall",min: 300, max: 600, chance: 0.03 },
];

export const mineCmd: PrefixCommand = {
  name: "mine", aliases: ["bergwerk", "schuerfen"],
  description: "Im Bergwerk nach Erzen schürfen",
  usage: ",mine",
  async execute(message) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const cd = onCooldown(`mine-${key}`, 120000);
    if (cd) { await message.reply(tr.mineCooldown(cd)); return; }

    const roll = Math.random();
    let cumulative = 0;
    let found = ORES[0]!;
    for (const ore of ORES) {
      cumulative += ore.chance;
      if (roll < cumulative) { found = ore; break; }
    }

    const amount = Math.floor(Math.random() * (found.max - found.min + 1)) + found.min;
    const w = getWallet(key);
    w.balance += amount; w.totalEarned += amount; saveWallet(key, w);

    await message.channel.send({
      embeds: [
        embed(
          `⛏️ ${tr.miningTitle}`,
          tr.mineFound(found.emoji, found.name, amount, w.balance),
          found.name === "Diamant" || found.name === "Kristall" ? 0x00d4ff : 0x57f287,
        ),
      ],
    });
  },
};

// --- New: Weekly ---
const WEEKLY_COOLDOWN = 7 * 24 * 60 * 60 * 1000;
const WEEKLY_AMOUNT = 700;

export const weeklyCmd: PrefixCommand = {
  name: "weekly", aliases: ["woche", "wochenbonus"],
  description: `Wöchentlicher Bonus von ${WEEKLY_AMOUNT} CloudCoins`,
  usage: ",weekly",
  async execute(message) {
    const gid = message.guildId!;
    const tr = economyextra[getLangCode(gid)];
    const key = `${gid}-${message.author.id}`;
    const w = getWallet(key);
    const now = Date.now();
    const lastWeekly = (w as any).lastWeekly ?? 0;
    const remaining = WEEKLY_COOLDOWN - (now - lastWeekly);

    if (remaining > 0) {
      const hours = Math.floor(remaining / 3600000);
      const mins = Math.floor((remaining % 3600000) / 60000);
      await message.reply(tr.weeklyCooldown(hours, mins));
      return;
    }

    w.balance += WEEKLY_AMOUNT;
    w.totalEarned += WEEKLY_AMOUNT;
    (w as any).lastWeekly = now;
    saveWallet(key, w);

    await message.channel.send({
      embeds: [
        embed(
          `🗓️ ${tr.weeklyTitle}`,
          tr.weeklyReceived(WEEKLY_AMOUNT, w.balance),
          0x57f287,
        ),
      ],
    });
  },
};

export const economyExtraCommands: PrefixCommand[] = [
  begCmd, fishCmd, huntCmd, digCmd, gambleCmd, robCmd,
  depositCmd, lotteryCmd, slotsBetCmd, mineCmd, weeklyCmd,
];
