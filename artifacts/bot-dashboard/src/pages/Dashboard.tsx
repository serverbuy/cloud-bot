import { useEffect, useState } from "react";

const COMMANDS = [
  { category: "🪙 Economy", commands: [",daily",",balance",",work",",pay @user amount",",crime",",coinlb",",beg",",fish",",hunt",",dig",",gamble amount",",robuser @user",",lottery",",spin amount",",deposit"] },
  { category: "⚔️ Moderation", commands: [",ban @user",",kick @user",",mute @user",",unban id",",timeout @user min",",warn @user",",warns @user",",warnremove @user id",",clear amount",",lockdown",",unlock",",jail @user",",unjail @user",",slowmode sec",",nick @user name",",lockchannel",",unlockchannel",",hide",",unhide",",announce text",",dm @user text",",addemoji",",nuke"] },
  { category: "🎭 Roles", commands: [",r add @user @role",",r remove @user @role",",r list @user",",create-roles",",create-team",",autorole-set @role",",reactionrole"] },
  { category: "🎮 Fun & Games", commands: [",8ball",",coinflip",",dice",",poll",",rps @user",",slots",",blackjack",",joke",",dadjoke",",fact",",quote",",advice",",roast",",compliment",",ship",",rate",",iq",",pp",",simprate",",choose",",mock",",clap",",emojify",",say",",reverse",",hug",",kiss",",slap",",pat",",bonk",",cuddle",",punch",",highfive",",wink",",bite",",lick",",poke",",dance"] },
  { category: "🛠️ Utility", commands: [",calc",",uppercase",",lowercase",",base64encode",",base64decode",",binary",",length",",password",",color",",qr",",random",",flip",",space",",vaporwave",",owoify",",repeat",",timestamp",",percent"] },
  { category: "ℹ️ Info", commands: [",userinfo",",serverinfo",",avatar",",botinfo",",ping",",roleinfo @role",",channelinfo",",membercount",",servericon",",serverbanner",",boosters",",roles",",emojis",",serverage",",inviteinfo",",channelcount"] },
  { category: "⭐ XP & Level", commands: [",rank",",level",",top",",leaderboard"] },
  { category: "💍 Marriage", commands: [",marry @user",",divorce",",partner"] },
  { category: "🎉 Giveaway", commands: [",gw duration winners prize",",giveaway-end id",",giveaway-reroll id",",giveaway-list"] },
  { category: "🎫 Tickets & Voice", commands: [",ticket-setup",",ticket-close",",vc-setup id",",vc-remove",",vc-status",",drag @user"] },
  { category: "🎂 Birthday", commands: [",birthday-set DD.MM",",birthday-list"] },
  { category: "📝 Mod Notes & Report", commands: [",note-add @user text",",notes @user",",note-remove @user id",",report @user reason",",report-ban"] },
  { category: "🤖 Custom & Setup", commands: [",customcommand-add name response",",server-setup",",logsetup #channel",",embed",",automod",",afk",",remind"] },
  { category: "⚙️ Settings & Help", commands: [",language en/de",",help",",stats"] },
];

export default function Dashboard() {
  const [online, setOnline] = useState<boolean | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(true);

  useEffect(() => {
    fetch("/api/healthz")
      .then((r) => r.ok ? setOnline(true) : setOnline(false))
      .catch(() => setOnline(false));
  }, []);

  useEffect(() => {
    let active = true;

    const loadInvite = () => {
      fetch("/api/discord/invite")
        .then(async (response) => {
          if (!response.ok) return;
          const data = (await response.json()) as { url?: string };
          if (active && data.url) setInviteUrl(data.url);
        })
        .catch(() => {})
        .finally(() => {
          if (active) setInviteLoading(false);
        });
    };

    loadInvite();
    const retryTimer = window.setInterval(loadInvite, 5000);
    return () => {
      active = false;
      window.clearInterval(retryTimer);
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#23272a", color: "#fff", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#2c2f33", padding: "0 24px", display: "flex", alignItems: "center", gap: 16, height: 64, boxShadow: "0 2px 8px #0006" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#7289da,#5b73c9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>☁️</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>Cloud<span style={{ color: "#7289da" }}>#0836</span></div>
          <div style={{ fontSize: 12, color: "#99aab5" }}>Discord App & Bot</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: online === null ? "#faa61a" : online ? "#43b581" : "#f04747", display: "inline-block" }} />
          <span style={{ fontSize: 13, color: "#99aab5" }}>{online === null ? "Connecting..." : online ? "Online" : "Offline"}</span>
          {inviteUrl && (
            <a
              href={inviteUrl}
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: 12, background: "#5865f2", color: "#fff", padding: "9px 14px", borderRadius: 7, textDecoration: "none", fontSize: 13, fontWeight: 700 }}
            >
              Zu Discord hinzufügen ↗
            </a>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 16px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Prefix", value: "," },
            { label: "Commands", value: "150+" },
            { label: "Slash-Commands", value: "17" },
            { label: "Status", value: online ? "🟢 Online" : "🔴 Offline" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#2c2f33", borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#7289da" }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#99aab5", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "linear-gradient(135deg, #2c2f33, #30354a)", borderRadius: 12, padding: "20px 22px", marginBottom: 32, border: "1px solid #5865f244" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: "#7289da", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Discord-App</div>
              <div style={{ fontSize: 19, fontWeight: 700, marginTop: 5 }}>Cloud direkt zu deinem Server hinzufügen</div>
              <div style={{ color: "#b9bbbe", fontSize: 13, marginTop: 6 }}>Installiere die App und nutze Slash-Commands wie /ping, /ticket und /ban.</div>
            </div>
            {inviteUrl ? (
              <a
                href={inviteUrl}
                target="_blank"
                rel="noreferrer"
                style={{ background: "#43b581", color: "#fff", padding: "12px 18px", borderRadius: 8, textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}
              >
                App installieren
              </a>
            ) : (
              <span style={{ color: "#99aab5", fontSize: 13 }}>
                {inviteLoading ? "Installationslink wird geladen..." : "Bot wird noch verbunden..."}
              </span>
            )}
          </div>
        </div>

        {/* Commands */}
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#7289da" }}>Commands</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {COMMANDS.map((cat, i) => (
            <div key={cat.category} style={{ background: "#2c2f33", borderRadius: 10, overflow: "hidden" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", background: "none", border: "none", color: "#fff", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", fontSize: 15, fontWeight: 600 }}
              >
                <span>{cat.category}</span>
                <span style={{ color: "#7289da", fontSize: 18 }}>{open === i ? "▲" : "▼"}</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 18px 14px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {cat.commands.map((cmd) => (
                    <span key={cmd} style={{ background: "#36393f", color: "#a3b2c6", padding: "4px 10px", borderRadius: 6, fontSize: 13, fontFamily: "monospace" }}>{cmd}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, textAlign: "center", color: "#4f545c", fontSize: 13 }}>
          Cloud#0836 — Built with discord.js v14 on Replit
        </div>
      </div>
    </div>
  );
}
