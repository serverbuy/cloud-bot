import type { Lang } from "../../i18n";

const en = {
  dailyCooldown: (h: number, m: number) => `⏰ Next daily reward in **${h}h ${m}m**!`,
  dailyTitle: "💰 Daily Reward!",
  dailyDesc: (reward: number, balance: number) => `You received **${reward}** CloudCoins!\nTotal: **${balance}** ☆`,
  jobs: [
    "You baked a cake", "You fed a puppy", "You repaired a PC",
    "You moderated a stream", "You cleaned up a server", "You mixed a song",
    "You served a customer", "You gave a presentation", "You fixed a bug",
  ],
  workTitle: "💼 Work",
  workDesc: (job: string, earned: number, balance: number) => `${job} and earn **${earned}** CloudCoins!\nNew balance: **${balance}** ☆`,
  payNoUser: "❌ Please mention a user.",
  payInvalidAmount: "❌ Invalid amount.",
  payNotEnough: "❌ You don't have enough CloudCoins!",
  paySuccess: (amount: number, id: string, balance: number) => `✅ You sent **${amount}** CloudCoins to <@${id}>!\nYour balance: **${balance}** ☆`,
  noCoinData: "📭 No CloudCoins data yet.",
  crimeWinTitle: "🎰 Crime succeeded!",
  crimeWinDesc: (earned: number, balance: number) => `You earned **${earned}** CloudCoins!\nNew balance: **${balance}** ☆`,
  crimeLossTitle: "👮 Caught!",
  crimeLossDesc: (lost: number, balance: number) => `You got caught and lose **${lost}** CloudCoins!\nNew balance: **${balance}** ☆`,
};

type Strings = typeof en;

const de: Strings = {
  dailyCooldown: (h: number, m: number) => `⏰ Nächste tägliche Belohnung in **${h}h ${m}m**!`,
  dailyTitle: "💰 Tägliche Belohnung!",
  dailyDesc: (reward: number, balance: number) => `Du hast **${reward}** CloudCoins erhalten!\nGesamt: **${balance}** ☆`,
  jobs: [
    "Du hast einen Kuchen gebacken", "Du hast einen Welpen gefüttert", "Du hast einen PC repariert",
    "Du hast einen Stream moderiert", "Du hast einen Server aufgeräumt", "Du hast einen Song gemixt",
    "Du hast einen Kunden bedient", "Du hast einen Vortrag gehalten", "Du hast einen Bug gefixt",
  ],
  workTitle: "💼 Arbeit",
  workDesc: (job: string, earned: number, balance: number) => `${job} und verdienst **${earned}** CloudCoins!\nNeuer Stand: **${balance}** ☆`,
  payNoUser: "❌ Bitte markiere einen Nutzer.",
  payInvalidAmount: "❌ Ungültiger Betrag.",
  payNotEnough: "❌ Du hast nicht genug CloudCoins!",
  paySuccess: (amount: number, id: string, balance: number) => `✅ Du hast **${amount}** CloudCoins an <@${id}> gesendet!\nDein Stand: **${balance}** ☆`,
  noCoinData: "📭 Noch keine CloudCoins-Daten.",
  crimeWinTitle: "🎰 Crime gelungen!",
  crimeWinDesc: (earned: number, balance: number) => `Du hast **${earned}** CloudCoins verdient!\nNeuer Stand: **${balance}** ☆`,
  crimeLossTitle: "👮 Erwischt!",
  crimeLossDesc: (lost: number, balance: number) => `Du wurdest erwischt und verlierst **${lost}** CloudCoins!\nNeuer Stand: **${balance}** ☆`,
};

const sv: Strings = {
  dailyCooldown: (h: number, m: number) => `⏰ Nästa dagliga belöning om **${h}h ${m}m**!`,
  dailyTitle: "💰 Daglig belöning!",
  dailyDesc: (reward: number, balance: number) => `Du fick **${reward}** CloudCoins!\nTotalt: **${balance}** ☆`,
  jobs: [
    "Du bakade en tårta", "Du matade en valp", "Du reparerade en dator",
    "Du modererade en stream", "Du städade en server", "Du mixade en låt",
    "Du betjänade en kund", "Du höll ett föredrag", "Du fixade en bugg",
  ],
  workTitle: "💼 Arbete",
  workDesc: (job: string, earned: number, balance: number) => `${job} och tjänar **${earned}** CloudCoins!\nNytt saldo: **${balance}** ☆`,
  payNoUser: "❌ Vänligen nämn en användare.",
  payInvalidAmount: "❌ Ogiltigt belopp.",
  payNotEnough: "❌ Du har inte tillräckligt med CloudCoins!",
  paySuccess: (amount: number, id: string, balance: number) => `✅ Du skickade **${amount}** CloudCoins till <@${id}>!\nDitt saldo: **${balance}** ☆`,
  noCoinData: "📭 Inga CloudCoins-data än.",
  crimeWinTitle: "🎰 Brottet lyckades!",
  crimeWinDesc: (earned: number, balance: number) => `Du tjänade **${earned}** CloudCoins!\nNytt saldo: **${balance}** ☆`,
  crimeLossTitle: "👮 Ertappad!",
  crimeLossDesc: (lost: number, balance: number) => `Du blev ertappad och förlorar **${lost}** CloudCoins!\nNytt saldo: **${balance}** ☆`,
};

const nl: Strings = {
  dailyCooldown: (h: number, m: number) => `⏰ Volgende dagelijkse beloning over **${h}h ${m}m**!`,
  dailyTitle: "💰 Dagelijkse beloning!",
  dailyDesc: (reward: number, balance: number) => `Je hebt **${reward}** CloudCoins ontvangen!\nTotaal: **${balance}** ☆`,
  jobs: [
    "Je hebt een taart gebakken", "Je hebt een puppy gevoerd", "Je hebt een pc gerepareerd",
    "Je hebt een stream gemodereerd", "Je hebt een server opgeruimd", "Je hebt een nummer gemixt",
    "Je hebt een klant geholpen", "Je hebt een lezing gegeven", "Je hebt een bug opgelost",
  ],
  workTitle: "💼 Werk",
  workDesc: (job: string, earned: number, balance: number) => `${job} en verdient **${earned}** CloudCoins!\nNieuw saldo: **${balance}** ☆`,
  payNoUser: "❌ Vermeld een gebruiker.",
  payInvalidAmount: "❌ Ongeldig bedrag.",
  payNotEnough: "❌ Je hebt niet genoeg CloudCoins!",
  paySuccess: (amount: number, id: string, balance: number) => `✅ Je hebt **${amount}** CloudCoins naar <@${id}> gestuurd!\nJouw saldo: **${balance}** ☆`,
  noCoinData: "📭 Nog geen CloudCoins-gegevens.",
  crimeWinTitle: "🎰 Misdaad geslaagd!",
  crimeWinDesc: (earned: number, balance: number) => `Je hebt **${earned}** CloudCoins verdiend!\nNieuw saldo: **${balance}** ☆`,
  crimeLossTitle: "👮 Betrapt!",
  crimeLossDesc: (lost: number, balance: number) => `Je bent betrapt en verliest **${lost}** CloudCoins!\nNieuw saldo: **${balance}** ☆`,
};

const ar: Strings = {
  dailyCooldown: (h: number, m: number) => `⏰ المكافأة اليومية التالية خلال **${h}h ${m}m**!`,
  dailyTitle: "💰 المكافأة اليومية!",
  dailyDesc: (reward: number, balance: number) => `لقد حصلت على **${reward}** CloudCoins!\nالإجمالي: **${balance}** ☆`,
  jobs: [
    "خبزت كعكة", "أطعمت جروًا", "أصلحت حاسوبًا",
    "أدرت بثًا مباشرًا", "نظّفت خادمًا", "مزجت أغنية",
    "خدمت عميلًا", "ألقيت محاضرة", "أصلحت خللًا برمجيًا",
  ],
  workTitle: "💼 عمل",
  workDesc: (job: string, earned: number, balance: number) => `${job} وتكسب **${earned}** CloudCoins!\nالرصيد الجديد: **${balance}** ☆`,
  payNoUser: "❌ يرجى الإشارة إلى مستخدم.",
  payInvalidAmount: "❌ مبلغ غير صالح.",
  payNotEnough: "❌ ليس لديك ما يكفي من CloudCoins!",
  paySuccess: (amount: number, id: string, balance: number) => `✅ لقد أرسلت **${amount}** CloudCoins إلى <@${id}>!\nرصيدك: **${balance}** ☆`,
  noCoinData: "📭 لا توجد بيانات CloudCoins بعد.",
  crimeWinTitle: "🎰 نجحت الجريمة!",
  crimeWinDesc: (earned: number, balance: number) => `لقد كسبت **${earned}** CloudCoins!\nالرصيد الجديد: **${balance}** ☆`,
  crimeLossTitle: "👮 أمسكوا بك!",
  crimeLossDesc: (lost: number, balance: number) => `لقد أُمسك بك وتخسر **${lost}** CloudCoins!\nالرصيد الجديد: **${balance}** ☆`,
};

export const economy: Record<Lang, Strings> = { en, de, sv, nl, ar };
