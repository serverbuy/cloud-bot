import {
  AttachmentBuilder,
  ChannelType,
  Client,
  PermissionFlagsBits,
  type TextChannel,
} from "discord.js";
import { logger } from "../../lib/logger";

/**
 * Tiny persistent JSON store.
 *
 * Render's free filesystem is wiped on every restart, so the data is kept as a
 * JSON attachment in a hidden channel ("bot-data") on the first server where the
 * bot may manage channels. Falls back to memory only if that is not possible.
 */

export type Note = { id: number; text: string; at: number };
export type Reminder = {
  id: number;
  userId: string;
  text: string;
  due: number;
  created: number;
  channelId: string | null; // guild channel the bot can post in, if any
  appId?: string;
  token?: string; // interaction token (valid 15 min) for follow-ups in DMs
};

type Data = { v: 1; seq: number; notes: Record<string, Note[]>; reminders: Reminder[] };

const CHANNEL_NAME = "bot-data";
const FILE = "data.json";

let data: Data = { v: 1, seq: 1, notes: {}, reminders: [] };
let channel: TextChannel | null = null;
let lastMessageId: string | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
let ready = false;

export const store = {
  get data() {
    return data;
  },
  nextId() {
    return data.seq++;
  },
  get persistent() {
    return channel !== null;
  },
  save,
};

export async function initStore(client: Client) {
  try {
    for (const guild of client.guilds.cache.values()) {
      const me = guild.members.me ?? (await guild.members.fetchMe());
      if (!me.permissions.has(PermissionFlagsBits.ManageChannels)) continue;
      await guild.channels.fetch();
      let ch = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildText && c.name === CHANNEL_NAME,
      ) as TextChannel | undefined;
      if (!ch) {
        ch = await guild.channels.create({
          name: CHANNEL_NAME,
          type: ChannelType.GuildText,
          topic: "Speicher des Bots (Notizen & Erinnerungen). Bitte nicht löschen.",
          permissionOverwrites: [
            { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: me.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory] },
          ],
        });
      }
      channel = ch;
      break;
    }
    if (!channel) {
      logger.warn("Store: no server with Manage Channels permission – data is memory-only");
      ready = true;
      return;
    }
    const msgs = await channel.messages.fetch({ limit: 20 });
    const latest = [...msgs.values()]
      .filter((m) => m.author.id === client.user?.id && m.attachments.some((a) => a.name === FILE))
      .sort((a, b) => b.createdTimestamp - a.createdTimestamp)[0];
    if (latest) {
      const url = latest.attachments.find((a) => a.name === FILE)!.url;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (res.ok) {
        const parsed = (await res.json()) as Data;
        if (parsed && parsed.v === 1) data = { ...data, ...parsed };
      }
      lastMessageId = latest.id;
    }
    logger.info({ notes: Object.keys(data.notes).length, reminders: data.reminders.length }, "Store loaded");
  } catch (err) {
    logger.error({ err }, "Store init failed – data is memory-only");
  }
  ready = true;
}

function save() {
  if (!ready || !channel) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 2000);
}

async function flush() {
  saveTimer = null;
  if (!channel) return;
  try {
    const file = new AttachmentBuilder(Buffer.from(JSON.stringify(data)), { name: FILE });
    const msg = await channel.send({ content: `Stand: <t:${Math.floor(Date.now() / 1000)}:f>`, files: [file] });
    const old = lastMessageId;
    lastMessageId = msg.id;
    if (old) await channel.messages.delete(old).catch(() => {});
  } catch (err) {
    logger.error({ err }, "Store save failed");
  }
}
