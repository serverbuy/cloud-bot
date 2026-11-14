import {
  Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ButtonInteraction, MessageFlags,
} from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";

export const eightballCmd: PrefixCommand = {
  name: "8ball",
  aliases: ["8b"],
  description: "Magic 8-Ball / Magische 8-Ball",
  usage: ",8ball <question>",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    const question = args.join(" ");
    if (!question) { await message.reply(L.fun.eightball.noQuestion); return; }
    const responses = L.fun.eightball.responses;
    const response = responses[Math.floor(Math.random() * responses.length)]!;
    const embed = new EmbedBuilder()
      .setTitle(L.fun.eightball.title)
      .addFields(
        { name: L.fun.eightball.questionField, value: question },
        { name: L.fun.eightball.answerField, value: response }
      ).setColor(0x2f3136).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const coinflipCmd: PrefixCommand = {
  name: "coinflip",
  aliases: ["cf", "münze"],
  description: "Flip a coin / Münze werfen",
  usage: ",coinflip",
  async execute(message) {
    const L = getLang(message.guildId!);
    const result = Math.random() < 0.5 ? L.fun.coinflip.heads : L.fun.coinflip.tails;
    const embed = new EmbedBuilder()
      .setTitle(L.fun.coinflip.title)
      .setDescription(L.fun.coinflip.result(result))
      .setColor(0xffd700).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const diceCmd: PrefixCommand = {
  name: "dice",
  aliases: ["würfel", "roll"],
  description: "Roll dice / Würfel werfen",
  usage: ",dice [sides] or ,dice 2d6",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    let count = 1, sides = 6;
    if (args[0]) {
      const diceNotation = args[0].match(/^(\d+)d(\d+)$/i);
      if (diceNotation) {
        count = Math.min(parseInt(diceNotation[1]!), 10);
        sides = Math.min(parseInt(diceNotation[2]!), 1000);
      } else {
        sides = Math.min(parseInt(args[0]) || 6, 1000);
      }
    }
    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);
    const embed = new EmbedBuilder()
      .setTitle(L.fun.dice.title)
      .addFields(
        { name: L.fun.dice.diceField, value: `${count}d${sides}`, inline: true },
        { name: count > 1 ? L.fun.dice.resultsField : L.fun.dice.resultField, value: count > 1 ? `[${rolls.join(", ")}] = **${total}**` : `**${rolls[0]}**`, inline: true }
      ).setColor(0x5865f2).setTimestamp();
    await message.channel.send({ embeds: [embed] });
  },
};

export const pollCmd: PrefixCommand = {
  name: "poll",
  aliases: ["umfrage"],
  description: "Create a poll / Abstimmung erstellen",
  usage: ",poll <question> | option1 | option2 | ...",
  async execute(message, args) {
    const L = getLang(message.guildId!);
    const text = args.join(" ");
    if (!text) { await message.reply(L.fun.poll.noText); return; }
    const parts = text.split("|").map((s) => s.trim()).filter(Boolean);
    const question = parts[0]!;
    const options = parts.slice(1);

    if (options.length === 0) {
      const embed = new EmbedBuilder()
        .setTitle(L.fun.poll.title)
        .setDescription(`**${question}**\n\n${L.fun.poll.yesNo}`)
        .setColor(0x5865f2).setFooter({ text: L.fun.poll.by(message.author.username) }).setTimestamp();
      const msg = await message.channel.send({ embeds: [embed] });
      await msg.react("👍");
      await msg.react("👎");
    } else {
      if (options.length > 9) { await message.reply(L.fun.poll.tooMany); return; }
      const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
      const description = options.map((o, i) => `${numberEmojis[i]} ${o}`).join("\n");
      const embed = new EmbedBuilder()
        .setTitle(L.fun.poll.title)
        .addFields({ name: question, value: description })
        .setColor(0x5865f2).setFooter({ text: L.fun.poll.by(message.author.username) }).setTimestamp();
      const msg = await message.channel.send({ embeds: [embed] });
      for (let i = 0; i < options.length; i++) await msg.react(numberEmojis[i]!);
    }
    await message.delete().catch(() => {});
  },
};

const pendingRps = new Map<string, { challengerId: string; guildId: string }>();

export const rpsCmd: PrefixCommand = {
  name: "rps",
  aliases: ["scherensteinpapier"],
  description: "Rock-Paper-Scissors / Stein-Schere-Papier",
  usage: ",rps @user",
  async execute(message) {
    const L = getLang(message.guildId!);
    const target = message.mentions.members?.first();
    if (!target) { await message.reply(L.fun.rps.noTarget); return; }
    if (target.id === message.author.id) { await message.reply(L.fun.rps.selfPlay); return; }
    if (target.user.bot) { await message.reply(L.common.botTarget); return; }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`rps_rock_${message.author.id}_${target.id}`).setLabel(L.fun.rps.stone).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`rps_paper_${message.author.id}_${target.id}`).setLabel(L.fun.rps.paper).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`rps_scissors_${message.author.id}_${target.id}`).setLabel(L.fun.rps.scissors).setStyle(ButtonStyle.Secondary)
    );

    const embed = new EmbedBuilder()
      .setTitle(L.fun.rps.title)
      .setDescription(L.fun.rps.challenge(`${message.author}`, `${target}`))
      .setColor(0x5865f2).setFooter({ text: L.fun.rps.footer }).setTimestamp();

    const msg = await message.channel.send({ embeds: [embed], components: [row] });
    pendingRps.set(`${message.author.id}-${target.id}`, { challengerId: message.author.id, guildId: message.guildId! });

    setTimeout(() => {
      pendingRps.delete(`${message.author.id}-${target.id}`);
      msg.edit({ components: [] }).catch(() => {});
    }, 60000);
  },
};

type RpsMove = "rock" | "paper" | "scissors";
function rpsWinner(a: RpsMove, b: RpsMove): "a" | "b" | "tie" {
  if (a === b) return "tie";
  if ((a === "rock" && b === "scissors") || (a === "paper" && b === "rock") || (a === "scissors" && b === "paper")) return "a";
  return "b";
}
const rpsChoices: RpsMove[] = ["rock", "paper", "scissors"];

export async function handleRpsButton(interaction: ButtonInteraction) {
  const parts = interaction.customId.split("_");
  const move = parts[1] as RpsMove;
  const challengerId = parts[2]!;
  const targetId = parts[3]!;
  const guildId = interaction.guildId ?? "";
  const L = getLang(guildId);

  if (interaction.user.id !== targetId) {
    await interaction.reply({ content: L.fun.rps.notForYou, flags: MessageFlags.Ephemeral }); return;
  }

  const key = `${challengerId}-${targetId}`;
  const game = pendingRps.get(key);
  if (!game) { await interaction.reply({ content: L.fun.rps.notActive, flags: MessageFlags.Ephemeral }); return; }

  pendingRps.delete(key);
  const targetMove = move;
  const challengerMove = rpsChoices[Math.floor(Math.random() * rpsChoices.length)]!;
  const result = rpsWinner(challengerMove, targetMove);

  const moveLabel = (m: RpsMove, loc: typeof L) =>
    m === "rock" ? loc.fun.rps.stone : m === "paper" ? loc.fun.rps.paper : loc.fun.rps.scissors;

  let resultText = "";
  if (result === "tie") resultText = L.fun.rps.tie;
  else if (result === "a") resultText = L.fun.rps.win(challengerId);
  else resultText = L.fun.rps.win(targetId);

  const embed = new EmbedBuilder()
    .setTitle(L.fun.rps.resultTitle)
    .addFields(
      { name: `<@${challengerId}>`, value: moveLabel(challengerMove, L), inline: true },
      { name: "VS", value: "⚔️", inline: true },
      { name: `<@${targetId}>`, value: moveLabel(targetMove, L), inline: true },
      { name: "⚡", value: resultText }
    ).setColor(result === "tie" ? 0xfee75c : 0x57f287).setTimestamp();

  await interaction.update({ embeds: [embed], components: [] });
}
