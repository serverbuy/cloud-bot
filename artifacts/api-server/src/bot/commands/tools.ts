import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Routes,
  type Client,
  type TextBasedChannel,
} from "discord.js";
import { store, type Reminder } from "../lib/store";
import { lookupTx, CHAINS, type Chain } from "../lib/txid";
import { logger } from "../../lib/logger";

// All commands here work everywhere (servers, DMs, group chats).

const PINK = 0xff2a6d;
const CYAN = 0x05d9e8;
const GREEN = 0x3ba55d;
const RED = 0xf23f43;
const YELLOW = 0xffc46b;
const ts = (sec: number, s = "R") => `<t:${Math.floor(sec)}:${s}>`;
const short = (a?: string) => (a && a.length > 18 ? `${a.slice(0, 8)}…${a.slice(-6)}` : a ?? "–");
const linkRow = (label: string, url: string) =>
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(label).setURL(url),
  );

type Cmd = {
  data: { name: string; toJSON(): unknown };
  execute(i: ChatInputCommandInteraction): Promise<void>;
};

// ================= notes =================
const note: Cmd = {
  data: new SlashCommandBuilder()
    .setName("note")
    .setDescription("Private Notizen – nur du siehst sie")
    .addSubcommand((s) => s.setName("add").setDescription("Notiz speichern")
      .addStringOption((o) => o.setName("text").setDescription("Was soll gespeichert werden?").setRequired(true).setMaxLength(1000)))
    .addSubcommand((s) => s.setName("list").setDescription("Alle Notizen anzeigen"))
    .addSubcommand((s) => s.setName("delete").setDescription("Notiz löschen")
      .addIntegerOption((o) => o.setName("nr").setDescription("Nummer der Notiz").setRequired(true).setMinValue(1)))
    .addSubcommand((s) => s.setName("clear").setDescription("Alle Notizen löschen")),
  async execute(i) {
    const sub = i.options.getSubcommand();
    const list = (store.data.notes[i.user.id] ??= []);
    const eph = { flags: MessageFlags.Ephemeral } as const;

    if (sub === "add") {
      if (list.length >= 100) {
        await i.reply({ content: "Maximal 100 Notizen. Lösch erst ein paar mit `/note delete`.", ...eph });
        return;
      }
      list.push({ id: store.nextId(), text: i.options.getString("text", true), at: Date.now() });
      store.save();
      await i.reply({ embeds: [new EmbedBuilder().setColor(GREEN).setDescription(`Notiz **#${list.length}** gespeichert.`)], ...eph });
      return;
    }
    if (sub === "list") {
      if (!list.length) {
        await i.reply({ content: "Noch keine Notizen. Speichern mit `/note add`.", ...eph });
        return;
      }
      const lines = list.map((n, k) => `**${k + 1}.** ${n.text}  ·  ${ts(n.at / 1000)}`);
      let desc = "";
      for (const l of lines) {
        if ((desc + l).length > 3900) { desc += "\n…"; break; }
        desc += (desc ? "\n" : "") + l;
      }
      await i.reply({ embeds: [new EmbedBuilder().setColor(PINK).setTitle(`Deine Notizen (${list.length})`).setDescription(desc)], ...eph });
      return;
    }
    if (sub === "delete") {
      const nr = i.options.getInteger("nr", true);
      if (nr > list.length) {
        await i.reply({ content: `Notiz #${nr} gibt es nicht.`, ...eph });
        return;
      }
      const [gone] = list.splice(nr - 1, 1);
      store.save();
      await i.reply({ content: `Gelöscht: ~~${gone!.text.slice(0, 200)}~~`, ...eph });
      return;
    }
    if (sub === "clear") {
      const n = list.length;
      store.data.notes[i.user.id] = [];
      store.save();
      await i.reply({ content: `${n} Notizen gelöscht.`, ...eph });
    }
  },
};

// ================= reminders =================
function parseDuration(s: string): number | null {
  const re = /(\d+)\s*(s|sek|m|min|h|std|d|t|w)/gi;
  let ms = 0;
  let m: RegExpExecArray | null;
  let matched = "";
  while ((m = re.exec(s))) {
    const n = Number(m[1]);
    const u = m[2]!.toLowerCase();
    ms += n * (u.startsWith("s") ? 1e3 : u.startsWith("m") ? 6e4 : u === "h" || u === "std" ? 36e5 : u === "w" ? 6048e5 : 864e5);
    matched += m[0];
  }
  if (!ms || matched.replace(/\s/g, "").length !== s.replace(/\s/g, "").length) return null;
  return ms;
}

/** "18:30" or "18:30 morgen" style clock time (Europe/Berlin) → ms from now */
function parseClock(s: string): number | null {
  const m = s.trim().match(/^(\d{1,2})[:.](\d{2})(?:\s*(morgen))?$/i);
  if (!m) return null;
  const now = new Date();
  const berlin = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }));
  const target = new Date(berlin);
  target.setHours(Number(m[1]), Number(m[2]), 0, 0);
  if (m[3] || target <= berlin) target.setDate(target.getDate() + 1);
  return target.getTime() - berlin.getTime();
}

const remind: Cmd = {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("Erinnerungen")
    .addSubcommand((s) => s.setName("set").setDescription("Erinnerung setzen")
      .addStringOption((o) => o.setName("wann").setDescription("z. B. 10m, 2h, 1d, 1h30m oder 18:30").setRequired(true))
      .addStringOption((o) => o.setName("was").setDescription("Woran soll ich dich erinnern?").setRequired(true).setMaxLength(500)))
    .addSubcommand((s) => s.setName("list").setDescription("Deine offenen Erinnerungen"))
    .addSubcommand((s) => s.setName("delete").setDescription("Erinnerung löschen")
      .addIntegerOption((o) => o.setName("nr").setDescription("Nummer aus /remind list").setRequired(true).setMinValue(1))),
  async execute(i) {
    const sub = i.options.getSubcommand();
    const mine = () => store.data.reminders.filter((r) => r.userId === i.user.id).sort((a, b) => a.due - b.due);

    if (sub === "set") {
      const when = i.options.getString("wann", true);
      const ms = parseDuration(when) ?? parseClock(when);
      if (!ms || ms < 5000) {
        await i.reply({ content: "Zeit nicht erkannt. Beispiele: `10m`, `2h`, `1d`, `1h30m`, `18:30`, `08:00 morgen`", flags: MessageFlags.Ephemeral });
        return;
      }
      if (ms > 365 * 864e5) {
        await i.reply({ content: "Maximal 1 Jahr im Voraus.", flags: MessageFlags.Ephemeral });
        return;
      }
      if (mine().length >= 25) {
        await i.reply({ content: "Maximal 25 offene Erinnerungen.", flags: MessageFlags.Ephemeral });
        return;
      }
      // Can the bot post in this channel later? Only if it is a member of this server.
      const botInGuild = !!i.guild && i.guild.members.me != null;
      const r: Reminder = {
        id: store.nextId(),
        userId: i.user.id,
        text: i.options.getString("was", true),
        due: Date.now() + ms,
        created: Date.now(),
        channelId: botInGuild ? i.channelId : null,
        appId: i.applicationId,
        token: i.token,
      };
      store.data.reminders.push(r);
      store.save();
      await i.reply({
        embeds: [new EmbedBuilder().setColor(GREEN).setTitle("Erinnerung gesetzt")
          .setDescription(`${ts(r.due / 1000)} · ${ts(r.due / 1000, "f")}\n\n${r.text}`)],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    if (sub === "list") {
      const list = mine();
      if (!list.length) {
        await i.reply({ content: "Keine offenen Erinnerungen.", flags: MessageFlags.Ephemeral });
        return;
      }
      await i.reply({
        embeds: [new EmbedBuilder().setColor(PINK).setTitle(`Erinnerungen (${list.length})`)
          .setDescription(list.map((r, k) => `**${k + 1}.** ${ts(r.due / 1000)} · ${r.text.slice(0, 150)}`).join("\n"))],
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    if (sub === "delete") {
      const r = mine()[i.options.getInteger("nr", true) - 1];
      if (!r) {
        await i.reply({ content: "Diese Nummer gibt es nicht. Schau mit `/remind list`.", flags: MessageFlags.Ephemeral });
        return;
      }
      store.data.reminders = store.data.reminders.filter((x) => x.id !== r.id);
      store.save();
      await i.reply({ content: `Gelöscht: ~~${r.text.slice(0, 200)}~~`, flags: MessageFlags.Ephemeral });
    }
  },
};

export function startReminderLoop(client: Client) {
  setInterval(async () => {
    const now = Date.now();
    const due = store.data.reminders.filter((r) => r.due <= now);
    if (!due.length) return;
    store.data.reminders = store.data.reminders.filter((r) => r.due > now);
    store.save();
    for (const r of due) {
      const embed = new EmbedBuilder().setColor(YELLOW).setTitle("Erinnerung")
        .setDescription(`${r.text}\n\n-# gesetzt ${ts(r.created / 1000)}`);
      const content = `<@${r.userId}>`;
      let sent = false;
      // 1) the server channel where it was set (bot is a member there)
      if (r.channelId) {
        try {
          const ch = (await client.channels.fetch(r.channelId)) as TextBasedChannel | null;
          if (ch && "send" in ch) {
            await ch.send({ content, embeds: [embed], allowedMentions: { users: [r.userId] } });
            sent = true;
          }
        } catch { /* fall through */ }
      }
      // 2) follow-up in the original chat (interaction tokens live 15 minutes)
      if (!sent && r.token && r.appId && now - r.created < 14.5 * 60e3) {
        try {
          await client.rest.post(Routes.webhook(r.appId, r.token), {
            body: { content, embeds: [embed.toJSON()], allowed_mentions: { users: [r.userId] } },
            auth: false,
          });
          sent = true;
        } catch { /* fall through */ }
      }
      // 3) direct message
      if (!sent) {
        try {
          const u = await client.users.fetch(r.userId);
          await u.send({ embeds: [embed] });
          sent = true;
        } catch (err) {
          logger.warn({ err, user: r.userId }, "Reminder could not be delivered");
        }
      }
    }
  }, 15_000);
}

// ================= txid =================
const CHAIN_NAMES: Record<Chain, string> = {
  btc: "Bitcoin", ltc: "Litecoin", doge: "Dogecoin", eth: "Ethereum",
  bsc: "BNB Smart Chain", polygon: "Polygon", trx: "TRON", sol: "Solana",
};

const txid: Cmd = {
  data: new SlashCommandBuilder()
    .setName("txid")
    .setDescription("Krypto-Transaktion prüfen (BTC, ETH, USDT, TRX, LTC, SOL …)")
    .addStringOption((o) => o.setName("hash").setDescription("Transaktions-ID / Hash").setRequired(true))
    .addStringOption((o) => o.setName("chain").setDescription("Blockchain (leer = automatisch erkennen)")
      .addChoices(...CHAINS.map((c) => ({ name: CHAIN_NAMES[c], value: c }))))
    .addBooleanOption((o) => o.setName("privat").setDescription("Nur für dich sichtbar")),
  async execute(i) {
    const hash = i.options.getString("hash", true).trim();
    const chain = (i.options.getString("chain") ?? undefined) as Chain | undefined;
    await i.deferReply(i.options.getBoolean("privat") ? { flags: MessageFlags.Ephemeral } : {});
    const r = await lookupTx(hash, chain);
    if (!r) {
      await i.editReply({
        embeds: [new EmbedBuilder().setColor(RED).setTitle("Nicht gefunden")
          .setDescription(`Keine Transaktion zu \`${short(hash)}\` gefunden${chain ? ` auf ${CHAIN_NAMES[chain]}` : ""}.\nPrüf den Hash oder wähl die Chain manuell.`)],
      });
      return;
    }
    const status = { confirmed: "Bestätigt", pending: "Ausstehend", failed: "Fehlgeschlagen" }[r.status];
    const color = { confirmed: GREEN, pending: YELLOW, failed: RED }[r.status];
    const e = new EmbedBuilder().setColor(color).setTitle(`${r.chain} · ${status}`)
      .setDescription(`\`${short(hash)}\``)
      .addFields(
        ...(r.token ? [{ name: "Token", value: r.token, inline: true }] : []),
        ...(r.amount ? [{ name: "Betrag", value: r.amount, inline: true }] : []),
        ...(r.fee ? [{ name: "Gebühr", value: r.fee, inline: true }] : []),
        { name: "Von", value: `\`${short(r.from)}\``, inline: true },
        { name: "An", value: `\`${short(r.to)}\``, inline: true },
        ...(r.confirmations != null && r.status !== "pending" ? [{ name: "Bestätigungen", value: r.confirmations.toLocaleString("de-DE"), inline: true }] : []),
        ...(r.block ? [{ name: "Block", value: r.block.toLocaleString("de-DE"), inline: true }] : []),
        ...(r.time ? [{ name: "Zeit", value: `${ts(r.time, "f")} (${ts(r.time)})`, inline: false }] : []),
      );
    await i.editReply({ embeds: [e], components: [linkRow("Im Explorer öffnen", r.url)] });
  },
};

// ================= media links =================
async function oembed(url: string) {
  const r = await fetch(url, { signal: AbortSignal.timeout(8000), headers: { "user-agent": "Mozilla/5.0" } });
  if (!r.ok) return null;
  return (await r.json()) as { title?: string; author_name?: string; author_url?: string; thumbnail_url?: string };
}

function ytId(u: string) {
  const m = u.match(/(?:youtu\.be\/|v=|shorts\/|embed\/|live\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

const youtube: Cmd = {
  data: new SlashCommandBuilder()
    .setName("youtube")
    .setDescription("YouTube-Link: Infos, Thumbnail in HD, Kurzlink")
    .addStringOption((o) => o.setName("link").setDescription("YouTube-Link").setRequired(true))
    .addStringOption((o) => o.setName("start").setDescription("Startzeit für den Link, z. B. 1:23")),
  async execute(i) {
    const link = i.options.getString("link", true).trim();
    const id = ytId(link);
    if (!id) {
      await i.reply({ content: "Das ist kein gültiger YouTube-Link.", flags: MessageFlags.Ephemeral });
      return;
    }
    await i.deferReply();
    const info = await oembed(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`).catch(() => null);
    const start = i.options.getString("start");
    let t = "";
    if (start) {
      const p = start.split(":").map(Number);
      const sec = p.reduce((a, n) => a * 60 + (n || 0), 0);
      if (sec > 0) t = `?t=${sec}`;
    }
    const shortUrl = `https://youtu.be/${id}${t}`;
    const thumb = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    const e = new EmbedBuilder().setColor(RED)
      .setTitle(info?.title ?? "YouTube-Video")
      .setURL(`https://www.youtube.com/watch?v=${id}`)
      .setDescription(`${info?.author_name ? `von **${info.author_name}**\n` : ""}Kurzlink: ${shortUrl}`)
      .setImage(thumb);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Öffnen").setURL(shortUrl),
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Thumbnail HD").setURL(thumb),
      ...(info?.author_url ? [new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Kanal").setURL(info.author_url)] : []),
    );
    await i.editReply({ embeds: [e], components: [row] });
  },
};

const tiktok: Cmd = {
  data: new SlashCommandBuilder()
    .setName("tiktok")
    .setDescription("TikTok-Link umwandeln, damit das Video direkt in Discord abspielt")
    .addStringOption((o) => o.setName("link").setDescription("TikTok-Link").setRequired(true)),
  async execute(i) {
    const link = i.options.getString("link", true).trim();
    let u: URL;
    try { u = new URL(link); } catch { u = new URL("https://invalid"); }
    if (!/(^|\.)tiktok\.com$/.test(u.hostname)) {
      await i.reply({ content: "Das ist kein TikTok-Link.", flags: MessageFlags.Ephemeral });
      return;
    }
    await i.deferReply();
    const info = await oembed(`https://www.tiktok.com/oembed?url=${encodeURIComponent(link)}`).catch(() => null);
    const fixed = `https://${u.hostname.replace(/(^|.*\.)tiktok\.com$/, "$1tnktok.com")}${u.pathname}`;
    // Plain message so Discord renders the playable embed from the converted link.
    await i.editReply({
      content: `${info?.author_name ? `**@${info.author_name}**${info.title ? ` · ${info.title.slice(0, 150)}` : ""}\n` : ""}${fixed}`,
      components: [linkRow("Original auf TikTok", link)],
    });
  },
};

const spotify: Cmd = {
  data: new SlashCommandBuilder()
    .setName("spotify")
    .setDescription("Spotify-Link: Infos + Link für Apple Music, YouTube & Co.")
    .addStringOption((o) => o.setName("link").setDescription("Spotify-Link (Song, Album, Playlist)").setRequired(true)),
  async execute(i) {
    const link = i.options.getString("link", true).trim().split("?")[0]!;
    if (!/open\.spotify\.com\/(intl-\w+\/)?(track|album|playlist|artist|episode|show)\//.test(link)) {
      await i.reply({ content: "Das ist kein gültiger Spotify-Link.", flags: MessageFlags.Ephemeral });
      return;
    }
    await i.deferReply();
    const info = await oembed(`https://open.spotify.com/oembed?url=${encodeURIComponent(link)}`).catch(() => null);
    const universal = `https://song.link/${link}`;
    const e = new EmbedBuilder().setColor(0x1db954)
      .setTitle(info?.title ?? "Spotify")
      .setURL(link)
      .setDescription("Auf anderen Plattformen öffnen: Apple Music, YouTube Music, Deezer, Tidal …");
    if (info?.thumbnail_url) e.setThumbnail(info.thumbnail_url);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Spotify").setURL(link),
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("Andere Plattformen").setURL(universal),
    );
    await i.editReply({ embeds: [e], components: [row] });
  },
};

export const toolCommands: Cmd[] = [note, remind, txid, youtube, tiktok, spotify];
