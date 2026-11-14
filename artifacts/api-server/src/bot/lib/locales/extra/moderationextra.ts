import type { Lang } from "../../i18n";

const en = {
  slowmodeDisabled: "✅ Slowmode disabled.",
  slowmodeSet: (seconds: number) => `✅ Slowmode set to **${seconds}s**.`,
  nickChanged: (name: string) => `✅ Nickname changed to **${name}**.`,
  nickReset: "✅ Nickname reset.",
  channelLocked: "🔒 Channel locked.",
  channelUnlocked: "🔓 Channel unlocked.",
  channelHidden: "👁️ Channel hidden.",
  channelRevealed: "👁️ Channel revealed.",
  provideMessage: "❌ Provide a message.",
  announcement: "Announcement",
  messageSent: "✅ Message sent.",
  dmFailed: "❌ Could not DM that user.",
  provideEmoji: "❌ Provide a custom emoji.",
  emojiAdded: (emoji: string) => `✅ Added ${emoji}`,
  channelNuked: "💥 Channel nuked!",
};

type Strings = typeof en;

const de: Strings = {
  slowmodeDisabled: "✅ Slowmode deaktiviert.",
  slowmodeSet: (seconds: number) => `✅ Slowmode auf **${seconds}s** gesetzt.`,
  nickChanged: (name: string) => `✅ Spitzname auf **${name}** geändert.`,
  nickReset: "✅ Spitzname zurückgesetzt.",
  channelLocked: "🔒 Kanal gesperrt.",
  channelUnlocked: "🔓 Kanal entsperrt.",
  channelHidden: "👁️ Kanal versteckt.",
  channelRevealed: "👁️ Kanal sichtbar.",
  provideMessage: "❌ Gib eine Nachricht an.",
  announcement: "Ankündigung",
  messageSent: "✅ Nachricht gesendet.",
  dmFailed: "❌ Konnte den Nutzer nicht anschreiben.",
  provideEmoji: "❌ Gib ein Custom-Emoji an.",
  emojiAdded: (emoji: string) => `✅ Hinzugefügt ${emoji}`,
  channelNuked: "💥 Kanal genuked!",
};

const sv: Strings = {
  slowmodeDisabled: "✅ Långsamt läge inaktiverat.",
  slowmodeSet: (seconds: number) => `✅ Långsamt läge inställt på **${seconds}s**.`,
  nickChanged: (name: string) => `✅ Smeknamn ändrat till **${name}**.`,
  nickReset: "✅ Smeknamn återställt.",
  channelLocked: "🔒 Kanal låst.",
  channelUnlocked: "🔓 Kanal upplåst.",
  channelHidden: "👁️ Kanal dold.",
  channelRevealed: "👁️ Kanal synlig.",
  provideMessage: "❌ Ange ett meddelande.",
  announcement: "Tillkännagivande",
  messageSent: "✅ Meddelande skickat.",
  dmFailed: "❌ Kunde inte skicka DM till den användaren.",
  provideEmoji: "❌ Ange en anpassad emoji.",
  emojiAdded: (emoji: string) => `✅ Tillagd ${emoji}`,
  channelNuked: "💥 Kanal nukad!",
};

const nl: Strings = {
  slowmodeDisabled: "✅ Langzame modus uitgeschakeld.",
  slowmodeSet: (seconds: number) => `✅ Langzame modus ingesteld op **${seconds}s**.`,
  nickChanged: (name: string) => `✅ Bijnaam gewijzigd naar **${name}**.`,
  nickReset: "✅ Bijnaam gereset.",
  channelLocked: "🔒 Kanaal vergrendeld.",
  channelUnlocked: "🔓 Kanaal ontgrendeld.",
  channelHidden: "👁️ Kanaal verborgen.",
  channelRevealed: "👁️ Kanaal zichtbaar gemaakt.",
  provideMessage: "❌ Geef een bericht op.",
  announcement: "Aankondiging",
  messageSent: "✅ Bericht verzonden.",
  dmFailed: "❌ Kon die gebruiker geen DM sturen.",
  provideEmoji: "❌ Geef een aangepaste emoji op.",
  emojiAdded: (emoji: string) => `✅ Toegevoegd ${emoji}`,
  channelNuked: "💥 Kanaal genuked!",
};

const ar: Strings = {
  slowmodeDisabled: "✅ تم تعطيل الوضع البطيء.",
  slowmodeSet: (seconds: number) => `✅ تم ضبط الوضع البطيء على **${seconds}s**.`,
  nickChanged: (name: string) => `✅ تم تغيير الاسم المستعار إلى **${name}**.`,
  nickReset: "✅ تمت إعادة تعيين الاسم المستعار.",
  channelLocked: "🔒 تم قفل القناة.",
  channelUnlocked: "🔓 تم فتح القناة.",
  channelHidden: "👁️ تم إخفاء القناة.",
  channelRevealed: "👁️ تم إظهار القناة.",
  provideMessage: "❌ يرجى تقديم رسالة.",
  announcement: "إعلان",
  messageSent: "✅ تم إرسال الرسالة.",
  dmFailed: "❌ تعذّر إرسال رسالة خاصة إلى هذا المستخدم.",
  provideEmoji: "❌ يرجى تقديم إيموجي مخصص.",
  emojiAdded: (emoji: string) => `✅ تمت الإضافة ${emoji}`,
  channelNuked: "💥 تم تدمير القناة!",
};

export const moderationextra: Record<Lang, Strings> = { en, de, sv, nl, ar };
