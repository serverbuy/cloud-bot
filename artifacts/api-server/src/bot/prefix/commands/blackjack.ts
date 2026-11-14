import {
  Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ButtonInteraction, MessageFlags,
} from "discord.js";
import type { PrefixCommand } from "../types";
import { getLang } from "../../lib/i18n";
import { logger } from "../../../lib/logger";

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

interface Card { rank: string; suit: string; }

function drawCard(): Card {
  return { rank: RANKS[Math.floor(Math.random() * RANKS.length)]!, suit: SUITS[Math.floor(Math.random() * SUITS.length)]! };
}

function handValue(hand: Card[]): number {
  let val = 0, aces = 0;
  for (const card of hand) {
    if (card.rank === "A") { aces++; val += 11; }
    else if (["J", "Q", "K"].includes(card.rank)) val += 10;
    else val += parseInt(card.rank);
  }
  while (val > 21 && aces > 0) { val -= 10; aces--; }
  return val;
}

function handStr(hand: Card[]) {
  return hand.map((c) => `${c.rank}${c.suit}`).join(" ");
}

interface BjGame {
  playerHand: Card[]; dealerHand: Card[]; playerId: string; channelId: string;
  guildId: string; messageId: string;
}
const bjGames = new Map<string, BjGame>();

export const blackjackCmd: PrefixCommand = {
  name: "blackjack",
  aliases: ["bj", "21"],
  description: "Play Blackjack / Blackjack spielen",
  usage: ",blackjack",
  async execute(message) {
    const L = getLang(message.guildId!);
    const playerId = message.author.id;
    const key = `${playerId}-${message.channelId}`;
    if (bjGames.has(key)) {
      await message.reply("❌ Du hast bereits ein laufendes Blackjack-Spiel!");
      return;
    }

    const playerHand: Card[] = [drawCard(), drawCard()];
    const dealerHand: Card[] = [drawCard(), drawCard()];
    const pVal = handValue(playerHand);
    const dVal = handValue(dealerHand);

    // Blackjack check
    if (pVal === 21) {
      const embed = new EmbedBuilder()
        .setTitle("🃏 Blackjack")
        .setDescription(`🎉 **BLACKJACK!**\n\nDu: ${handStr(playerHand)} = **${pVal}**\nDealer: ${handStr(dealerHand)} = **${dVal}**`)
        .setColor(pVal > dVal ? 0x57f287 : pVal === dVal ? 0xfee75c : 0xed4245)
        .setTimestamp();
      await message.channel.send({ embeds: [embed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle("🃏 Blackjack")
      .setDescription(
        `Deine Hand: ${handStr(playerHand)} = **${pVal}**\n` +
        `Dealer: ${dealerHand[0]!.rank}${dealerHand[0]!.suit} + ?`
      )
      .setColor(0x5865f2).setFooter({ text: "60s Zeit" }).setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId(`bj_hit_${playerId}_${message.channelId}`).setLabel("Hit 👇").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId(`bj_stand_${playerId}_${message.channelId}`).setLabel("Stand ✊").setStyle(ButtonStyle.Secondary)
    );

    const msg = await message.channel.send({ embeds: [embed], components: [row] });
    bjGames.set(key, { playerHand, dealerHand, playerId, channelId: message.channelId, guildId: message.guildId!, messageId: msg.id });

    setTimeout(() => {
      if (bjGames.has(key)) {
        bjGames.delete(key);
        msg.edit({ components: [] }).catch(() => {});
      }
    }, 60000);
  },
};

export async function handleBlackjackButton(interaction: ButtonInteraction) {
  const parts = interaction.customId.split("_");
  const action = parts[1] as "hit" | "stand";
  const playerId = parts[2]!;
  const channelId = parts[3]!;
  const guildId = interaction.guildId ?? "";
  const L = getLang(guildId);

  if (interaction.user.id !== playerId) {
    await interaction.reply({ content: "❌ Das ist nicht dein Spiel.", flags: MessageFlags.Ephemeral });
    return;
  }

  const key = `${playerId}-${channelId}`;
  const game = bjGames.get(key);
  if (!game) {
    await interaction.reply({ content: "❌ Spiel nicht mehr aktiv.", flags: MessageFlags.Ephemeral });
    return;
  }

  let pVal = handValue(game.playerHand);
  let dVal = handValue(game.dealerHand);
  let bust = false;
  let win = false;
  let tie = false;

  if (action === "hit") {
    game.playerHand.push(drawCard());
    pVal = handValue(game.playerHand);
    if (pVal > 21) {
      bust = true;
    } else {
      const embed = new EmbedBuilder()
        .setTitle("🃏 Blackjack")
        .setDescription(
          `Deine Hand: ${handStr(game.playerHand)} = **${pVal}**\n` +
          `Dealer: ${game.dealerHand[0]!.rank}${game.dealerHand[0]!.suit} + ?`
        )
        .setColor(0x5865f2).setFooter({ text: "60s Zeit" }).setTimestamp();
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId(`bj_hit_${playerId}_${channelId}`).setLabel("Hit 👇").setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId(`bj_stand_${playerId}_${channelId}`).setLabel("Stand ✊").setStyle(ButtonStyle.Secondary)
      );
      await interaction.update({ embeds: [embed], components: [row] });
      return;
    }
  }

  // Stand or bust: dealer plays
  bjGames.delete(key);
  while (!bust && dVal < 17) {
    game.dealerHand.push(drawCard());
    dVal = handValue(game.dealerHand);
  }

  if (!bust) {
    if (dVal > 21) win = true;
    else if (pVal > dVal) win = true;
    else if (pVal === dVal) tie = true;
  }

  const resultStr = bust ? "💀 **Du bist drüber!** (Bust)" :
    tie ? "🤝 **Unentschieden!**" :
    win ? "🎉 **Du gewinnst!**" : "🎰 **Dealer gewinnt!**";
  const color = bust ? 0xed4245 : tie ? 0xfee75c : win ? 0x57f287 : 0xed4245;

  const embed = new EmbedBuilder()
    .setTitle("🃏 Blackjack — Ergebnis")
    .setDescription(
      `Deine Hand: ${handStr(game.playerHand)} = **${pVal}**\n` +
      `Dealer: ${handStr(game.dealerHand)} = **${dVal}**\n\n${resultStr}`
    )
    .setColor(color).setTimestamp();

  await interaction.update({ embeds: [embed], components: [] });
}
