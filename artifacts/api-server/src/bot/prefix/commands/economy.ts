import { Message, EmbedBuilder } from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang, getLangCode } from "../../lib/i18n";
import { economy } from "../../lib/locales/extra/economy";

interface Wallet { balance: number; lastDaily: number; totalEarned: number; }
export const wallets = new Map<string, Wallet>();
const DAILY_REWARD = 100;
const COOLDOWN = 24 * 60 * 60 * 1000;

function getWallet(key: string): Wallet {
  return wallets.get(key) ?? { balance: 0, lastDaily: 0, totalEarned: 0 };
}

function saveWallet(key: string, w: Wallet) { wallets.set(key, w); }

export const dailyCmd: PrefixCommand = {
  name: "daily",
  aliases: ["täglich", "claim"],
  description: "Get your daily CloudCoins / Tägliche Belohnung abholen",
  usage: ",daily",
  async execute(message) {
    const tr = economy[getLangCode(message.guildId ?? "")];
    const key = `${message.guildId}-${message.author.id}`;
    const w = getWallet(key);
    const now = Date.now();
    if (now - w.lastDaily < COOLDOWN) {
      const remaining = Math.ceil((COOLDOWN - (now - w.lastDaily)) / 60000);
      const h = Math.floor(remaining / 60);
      const m = remaining % 60;
      await message.reply(tr.dailyCooldown(h, m));
      return;
    }
    w.balance += DAILY_REWARD;
    w.lastDaily = now;
    w.totalEarned += DAILY_REWARD;
    saveWallet(key, w);
    const embed = new EmbedBuilder()
      .setTitle(tr.dailyTitle)
      .setDescription(tr.dailyDesc(DAILY_REWARD, w.balance))
      .setColor(0xffd700).setThumbnail(message.author.displayAvatarURL());
    await message.channel.send({ embeds: [embed] });
  },
};

export const balanceCmd: PrefixCommand = {
  name: "balance",
  aliases: ["bal", "coins", "cloudcoins", "cc"],
  description: "Show your CloudCoins / CloudCoins anzeigen",
  usage: ",balance [@user]",
  async execute(message) {
    const target = message.mentions.users.first() ?? message.author;
    const key = `${message.guildId}-${target.id}`;
    const w = getWallet(key);
    const embed = new EmbedBuilder()
      .setTitle(`☆ CloudCoins — ${target.username}`)
      .setDescription(`💰 **Balance:** ${w.balance}\n📈 **Total earned:** ${w.totalEarned}`)
      .setColor(0xffd700).setThumbnail(target.displayAvatarURL()).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const workCmd: PrefixCommand = {
  name: "work",
  aliases: ["arbeit"],
  description: "Work for CloudCoins / Arbeiten für CloudCoins",
  usage: ",work",
  async execute(message) {
    const tr = economy[getLangCode(message.guildId ?? "")];
    const key = `${message.guildId}-${message.author.id}`;
    const w = getWallet(key);
    const earned = Math.floor(Math.random() * 50) + 20; // 20-70
    const jobs = tr.jobs;
    w.balance += earned;
    w.totalEarned += earned;
    saveWallet(key, w);
    const embed = new EmbedBuilder()
      .setTitle(tr.workTitle)
      .setDescription(tr.workDesc(jobs[Math.floor(Math.random() * jobs.length)]!, earned, w.balance))
      .setColor(0x57f287).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const payCmd: PrefixCommand = {
  name: "pay",
  aliases: ["transfer", "send"],
  description: "Send CloudCoins to someone / CloudCoins senden",
  usage: ",pay @user <amount>",
  async execute(message, args) {
    const tr = economy[getLangCode(message.guildId ?? "")];
    const target = message.mentions.users.first();
    if (!target || target.id === message.author.id) {
      await message.reply(tr.payNoUser); return;
    }
    const amount = parseInt(args[args.length - 1] ?? "");
    if (isNaN(amount) || amount < 1) { await message.reply(tr.payInvalidAmount); return; }
    const myKey = `${message.guildId}-${message.author.id}`;
    const theirKey = `${message.guildId}-${target.id}`;
    const myWallet = getWallet(myKey);
    if (myWallet.balance < amount) { await message.reply(tr.payNotEnough); return; }
    const theirWallet = getWallet(theirKey);
    myWallet.balance -= amount;
    theirWallet.balance += amount;
    saveWallet(myKey, myWallet);
    saveWallet(theirKey, theirWallet);
    await message.reply(tr.paySuccess(amount, target.id, myWallet.balance));
  },
};

export const coinLeaderboardCmd: PrefixCommand = {
  name: "coinlb",
  aliases: ["richlist", "coinleaderboard", "topcoins"],
  description: "CloudCoins Leaderboard / CloudCoins Rangliste",
  usage: ",coinlb",
  async execute(message) {
    const guildPrefix = `${message.guildId}-`;
    const sorted = Array.from(wallets.entries())
      .filter(([k]) => k.startsWith(guildPrefix))
      .sort(([, a], [, b]) => b.balance - a.balance)
      .slice(0, 10);
    if (sorted.length === 0) { await message.reply(economy[getLangCode(message.guildId ?? "")].noCoinData); return; }
    const medals = ["🥇", "🥈", "🥉"];
    const lines = sorted.map(([key, w], i) => {
      const uid = key.replace(guildPrefix, "");
      return `${medals[i] ?? `**${i + 1}.**`} <@${uid}> — **${w.balance}** ☆`;
    });
    const embed = new EmbedBuilder()
      .setTitle(`☆ CloudCoins Leaderboard — ${message.guild!.name}`)
      .setDescription(lines.join("\n"))
      .setColor(0xffd700).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const crimeCmd: PrefixCommand = {
  name: "crime",
  aliases: ["steal", "rob"],
  description: "Risk it for CloudCoins / Verbrechen begehen",
  usage: ",crime",
  async execute(message) {
    const tr = economy[getLangCode(message.guildId ?? "")];
    const key = `${message.guildId}-${message.author.id}`;
    const w = getWallet(key);
    const roll = Math.random();
    if (roll > 0.4) {
      const earned = Math.floor(Math.random() * 80) + 30;
      w.balance += earned;
      w.totalEarned += earned;
      saveWallet(key, w);
      const embed = new EmbedBuilder()
        .setTitle(tr.crimeWinTitle)
        .setDescription(tr.crimeWinDesc(earned, w.balance))
        .setColor(0x57f287);
      await message.channel.send({ embeds: [embed] });
    } else {
      const lost = Math.floor(Math.random() * 30) + 10;
      w.balance = Math.max(0, w.balance - lost);
      saveWallet(key, w);
      const embed = new EmbedBuilder()
        .setTitle(tr.crimeLossTitle)
        .setDescription(tr.crimeLossDesc(lost, w.balance))
        .setColor(0xed4245);
      await message.channel.send({ embeds: [embed] });
    }
  },
};
