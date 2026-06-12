import { useState, useEffect } from "react";

// ============================================
// CONFIG — Replace with your actual values
// ============================================
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
const CLAUDE_API_KEY = "YOUR_CLAUDE_API_KEY"; // via Anthropic

// ============================================
// STRIPE CONFIG
// ============================================
const STRIPE_PRO_LINK = "YOUR_STRIPE_PRO_PAYMENT_LINK"; // e.g. https://buy.stripe.com/xxx

// ============================================
// HELPERS
// ============================================
const sb = async (path, opts = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...opts.headers,
    },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

const askClaude = async (prompt, systemPrompt = "") => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": CLAUDE_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system: systemPrompt || "You are TraderPoise AI — a trading psychology coach with 14+ years of forex and prop firm experience. Be direct, specific, and actionable. No fluff.",
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Unable to generate response.";
};

// ============================================
// COLORS
// ============================================
const C = {
  bg: "#0a0a0f",
  bgCard: "#12121e",
  bgDark: "#0d0d18",
  border: "#1e1e2e",
  gold: "#f0c040",
  goldDim: "#a07820",
  text: "#e0e0e0",
  textMuted: "#666",
  textSub: "#999",
  green: "#4ade80",
  red: "#f87171",
  blue: "#60a5fa",
  purple: "#a78bfa",
};

const s = {
  page: { display: "flex", minHeight: "100vh", background: C.bg, fontFamily: "'Inter', -apple-system, sans-serif", color: C.text },
  sidebar: { width: 220, background: C.bgDark, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", padding: "0 0 24px", position: "sticky", top: 0, height: "100vh", overflowY: "auto" },
  sidebarLogo: { padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 8 },
  logoIcon: { fontSize: 20, color: C.gold },
  logoText: { fontSize: 17, fontWeight: 700, color: C.gold, letterSpacing: "-0.3px" },
  navSection: { padding: "16px 12px 8px", fontSize: 10, fontWeight: 700, color: C.textMuted, letterSpacing: 1.5, textTransform: "uppercase" },
  navItem: { display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", margin: "2px 8px", borderRadius: 8, cursor: "pointer", fontSize: 14, color: C.textSub, transition: "all 0.15s" },
  navItemActive: { background: "#1a1a2e", color: C.gold },
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  proBadgeSide: { marginLeft: "auto", fontSize: 9, fontWeight: 800, background: C.gold, color: C.bg, padding: "2px 6px", borderRadius: 10 },
  main: { flex: 1, overflowY: "auto" },
  topbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", borderBottom: `1px solid ${C.border}`, background: C.bgDark, position: "sticky", top: 0, zIndex: 10 },
  topbarTitle: { fontSize: 18, fontWeight: 700, color: "#fff" },
  planBadge: { padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700 },
  content: { padding: "28px" },
  card: { background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 16 },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 20 },
  statCard: { background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20 },
  statLabel: { fontSize: 12, color: C.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 },
  statValue: { fontSize: 28, fontWeight: 800, color: "#fff" },
  statSub: { fontSize: 12, color: C.textSub, marginTop: 4 },
  btn: { padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600 },
  btnGold: { background: C.gold, color: C.bg },
  btnOutline: { background: "transparent", border: `1px solid ${C.border}`, color: C.text },
  btnGreen: { background: "#166534", color: C.green },
  btnRed: { background: "#7f1d1d", color: C.red },
  input: { padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#0d0d18", color: C.text, fontSize: 14, width: "100%", boxSizing: "border-box", outline: "none" },
  label: { fontSize: 13, color: C.textSub, marginBottom: 6, display: "block" },
  row: { display: "flex", gap: 16, flexWrap: "wrap" },
  formGroup: { flex: 1, minWidth: 160 },
  aiBox: { background: "#0d0d1a", border: `1px solid #2a2a4a`, borderRadius: 12, padding: 20, marginTop: 16 },
  aiLabel: { fontSize: 11, fontWeight: 700, color: C.gold, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 },
  aiText: { fontSize: 14, color: "#bbb", lineHeight: 1.7 },
  tag: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, margin: "2px" },
  scoreRing: { width: 80, height: 80, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800, flexShrink: 0 },
  proGate: { textAlign: "center", padding: 40 },
  proGateIcon: { fontSize: 48, marginBottom: 16 },
  proGateTitle: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 },
  proGateDesc: { fontSize: 14, color: C.textMuted, marginBottom: 24, lineHeight: 1.6 },
  upgradeBtn: { background: C.gold, color: C.bg, padding: "12px 28px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  select: { padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#0d0d18", color: C.text, fontSize: 14, width: "100%", outline: "none" },
  textarea: { padding: "10px 14px", borderRadius: 8, border: `1px solid ${C.border}`, background: "#0d0d18", color: C.text, fontSize: 14, width: "100%", minHeight: 100, resize: "vertical", outline: "none", boxSizing: "border-box" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}` },
  td: { padding: "12px", fontSize: 13, color: C.text, borderBottom: `1px solid #15151f` },
  calDay: { aspectRatio: "1", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 11, cursor: "pointer", border: `1px solid ${C.border}` },
};

// ============================================
// NAVIGATION CONFIG
// ============================================
const NAV = [
  { section: "Overview" },
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "journal", label: "Trade Journal", icon: "📓" },
  { id: "session", label: "Session Log", icon: "🗓" },
  { section: "Psychology" },
  { id: "readiness", label: "Readiness Check", icon: "🧘" },
  { id: "discipline", label: "Discipline Score", icon: "🏅" },
  { id: "whylost", label: "Why I Lost", icon: "💡" },
  { section: "Tools" },
  { id: "calculator", label: "Risk Calculator", icon: "🔢" },
  { id: "calendar", label: "P&L Calendar", icon: "📅" },
  { id: "propfirm", label: "Prop Firm Mode", icon: "🏆", pro: true },
  { section: "Intelligence" },
  { id: "dxy", label: "DXY Briefing", icon: "🌐", pro: true },
  { id: "aireport", label: "AI Report Card", icon: "🤖", pro: true },
  { section: "Settings" },
  { id: "rules", label: "My Rules", icon: "📋" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

// ============================================
// MAIN APP
// ============================================
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [plan] = useState("free"); // "free" | "pro" — connect to Supabase profile
  const [trades, setTrades] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [rules, setRules] = useState([]);

  const isPro = plan === "pro";

  const ProGate = ({ feature }) => (
    <div style={s.proGate}>
      <div style={s.proGateIcon}>🔒</div>
      <h3 style={s.proGateTitle}>{feature} is a Pro Feature</h3>
      <p style={s.proGateDesc}>Upgrade to TraderPoise Pro to unlock unlimited AI coaching, DXY briefings, prop firm challenge mode, and more.</p>
      <button style={s.upgradeBtn} onClick={() => window.open(STRIPE_PRO_LINK, "_blank")}>
        Upgrade to Pro — $24/month
      </button>
    </div>
  );

  const pages = {
    dashboard: <Dashboard trades={trades} sessions={sessions} setPage={setPage} />,
    journal: <Journal trades={trades} setTrades={setTrades} />,
    session: <SessionLog sessions={sessions} setSessions={setSessions} trades={trades} isPro={isPro} />,
    readiness: <ReadinessCheck isPro={isPro} />,
    discipline: <DisciplineScore trades={trades} sessions={sessions} rules={rules} />,
    whylost: <WhyILost trades={trades} isPro={isPro} ProGate={ProGate} />,
    calculator: <RiskCalculator />,
    calendar: <PnLCalendar trades={trades} />,
    propfirm: isPro ? <PropFirmMode /> : <div style={s.card}><ProGate feature="Prop Firm Challenge Mode" /></div>,
    dxy: isPro ? <DXYBriefing /> : <div style={s.card}><ProGate feature="DXY Morning Briefing" /></div>,
    aireport: isPro ? <AIReportCard trades={trades} sessions={sessions} /> : <div style={s.card}><ProGate feature="AI Weekly Report Card" /></div>,
    rules: <MyRules rules={rules} setRules={setRules} />,
    settings: <Settings plan={plan} />,
  };

  return (
    <div style={s.page}>
      {/* SIDEBAR */}
      <div style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <span style={s.logoIcon}>⚖</span>
          <span style={s.logoText}>TraderPoise</span>
        </div>
        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} style={s.navSection}>{item.section}</div>
          ) : (
            <div
              key={item.id}
              style={{ ...s.navItem, ...(page === item.id ? s.navItemActive : {}) }}
              onClick={() => setPage(item.id)}
            >
              <span style={s.navIcon}>{item.icon}</span>
              {item.label}
              {item.pro && !isPro && <span style={s.proBadgeSide}>PRO</span>}
            </div>
          )
        )}
        {!isPro && (
          <div style={{ margin: "auto 12px 0", background: "#1a1400", border: `1px solid ${C.goldDim}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.gold, marginBottom: 6 }}>Upgrade to Pro</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 12, lineHeight: 1.5 }}>Unlock AI coaching, DXY briefings & prop firm mode</div>
            <button style={{ ...s.btn, ...s.btnGold, width: "100%", fontSize: 12 }} onClick={() => window.open(STRIPE_PRO_LINK, "_blank")}>
              Upgrade — $24/mo
            </button>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={s.main}>
        <div style={s.topbar}>
          <div style={s.topbarTitle}>{NAV.find(n => n.id === page)?.label || "Dashboard"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: C.textMuted }}>Trader ID: TP-FX-4829</span>
            <span style={{ ...s.planBadge, background: isPro ? "#1a1400" : "#1a1a2e", color: isPro ? C.gold : "#888", border: `1px solid ${isPro ? C.goldDim : C.border}` }}>
              {isPro ? "⭐ PRO" : "FREE"}
            </span>
          </div>
        </div>
        <div style={s.content}>{pages[page]}</div>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD
// ============================================
function Dashboard({ trades, sessions, setPage }) {
  const totalPnl = trades.reduce((a, t) => a + (t.pnl || 0), 0);
  const winners = trades.filter(t => t.pnl > 0).length;
  const winRate = trades.length ? ((winners / trades.length) * 100).toFixed(0) : 0;
  const avgDiscipline = sessions.length ? Math.round(sessions.reduce((a, s) => a + (s.discipline_score || 0), 0) / sessions.length) : 0;
  const revengeCount = trades.filter(t => t.is_revenge_trade).length;

  const quickActions = [
    { label: "Pre-Trade Check", icon: "🧘", page: "readiness", desc: "Are you ready to trade?" },
    { label: "Log a Trade", icon: "📓", page: "journal", desc: "Record your latest trade" },
    { label: "Risk Calculator", icon: "🔢", page: "calculator", desc: "Calculate your lot size" },
    { label: "Why I Lost", icon: "💡", page: "whylost", desc: "AI loss diagnosis" },
  ];

  return (
    <div>
      {/* Stats */}
      <div style={s.grid2}>
        {[
          { label: "Total P&L", value: `${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`, sub: `${trades.length} trades`, color: totalPnl >= 0 ? C.green : C.red },
          { label: "Win Rate", value: `${winRate}%`, sub: `${winners} winners`, color: C.blue },
          { label: "Discipline Score", value: `${avgDiscipline}/100`, sub: "Weekly average", color: C.gold },
          { label: "Revenge Trades", value: revengeCount, sub: "Flagged this month", color: revengeCount > 0 ? C.red : C.green },
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={s.statLabel}>{stat.label}</div>
            <div style={{ ...s.statValue, color: stat.color }}>{stat.value}</div>
            <div style={s.statSub}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={s.card}>
        <div style={s.cardTitle}>Quick Actions</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {quickActions.map(a => (
            <div key={a.label} onClick={() => setPage(a.page)}
              style={{ background: C.bgDark, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, cursor: "pointer", transition: "border-color 0.2s" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{a.label}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Trades */}
      <div style={s.card}>
        <div style={s.cardTitle}>Recent Trades</div>
        {trades.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: C.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📓</div>
            <div style={{ fontSize: 15, color: "#555" }}>No trades logged yet. Go to Trade Journal to add your first trade.</div>
          </div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {["Date", "Pair", "Direction", "P&L", "Emotion", "Revenge"].map(h => <th key={h} style={s.th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {trades.slice(-10).reverse().map((t, i) => (
                <tr key={i}>
                  <td style={s.td}>{t.trade_date}</td>
                  <td style={s.td}><strong>{t.pair}</strong></td>
                  <td style={s.td}><span style={{ color: t.direction === "buy" ? C.green : C.red, fontWeight: 600, textTransform: "uppercase" }}>{t.direction}</span></td>
                  <td style={s.td}><span style={{ color: t.pnl >= 0 ? C.green : C.red, fontWeight: 700 }}>{t.pnl >= 0 ? "+" : ""}${t.pnl?.toFixed(2)}</span></td>
                  <td style={s.td}><span style={{ ...s.tag, background: "#1a1a2e", color: "#aaa" }}>{t.emotion_entry || "—"}</span></td>
                  <td style={s.td}>{t.is_revenge_trade ? <span style={{ color: C.red, fontWeight: 700 }}>⚠ Yes</span> : <span style={{ color: C.green }}>✓ No</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============================================
// TRADE JOURNAL
// ============================================
function Journal({ trades, setTrades }) {
  const empty = { pair: "EURUSD", direction: "buy", lot_size: "", entry_price: "", exit_price: "", stop_loss: "", take_profit: "", pnl: "", pips: "", emotion_entry: "neutral", emotion_exit: "calm", is_revenge_trade: false, followed_plan: true, moved_stop_loss: false, exited_early: false, notes: "", trade_date: new Date().toISOString().split("T")[0], setup_type: "", timeframe: "H1" };
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const pairs = ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD", "XAUUSD", "GBPJPY", "EURJPY", "SPX500", "NAS100", "US30"];
  const emotions_entry = ["confident", "fearful", "greedy", "neutral", "anxious", "fomo", "revenge", "disciplined"];
  const emotions_exit = ["satisfied", "regretful", "relieved", "frustrated", "calm", "excited"];
  const timeframes = ["M1", "M5", "M15", "M30", "H1", "H4", "D1", "W1"];

  const handleSubmit = async () => {
    if (!form.pair || !form.pnl) { setMsg("Please fill in at least pair and P&L"); return; }
    setLoading(true);
    // Check revenge trade: re-entry within 10 min of a loss (simplified — flag if emotion is revenge)
    const isRevenge = form.emotion_entry === "revenge" || form.is_revenge_trade;
    const trade = { ...form, pnl: parseFloat(form.pnl) || 0, lot_size: parseFloat(form.lot_size) || 0, is_revenge_trade: isRevenge };
    setTrades(prev => [...prev, trade]);
    setMsg(isRevenge ? "⚠️ Revenge trade flagged and logged." : "✓ Trade logged successfully.");
    setForm(empty);
    setLoading(false);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div>
      {/* Log Trade Form */}
      <div style={s.card}>
        <div style={s.cardTitle}>Log a Trade</div>
        <div style={{ ...s.row, marginBottom: 14 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Date</label>
            <input type="date" style={s.input} value={form.trade_date} onChange={e => setForm({ ...form, trade_date: e.target.value })} />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Pair</label>
            <select style={s.select} value={form.pair} onChange={e => setForm({ ...form, pair: e.target.value })}>
              {pairs.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Direction</label>
            <select style={s.select} value={form.direction} onChange={e => setForm({ ...form, direction: e.target.value })}>
              <option value="buy">Buy / Long</option>
              <option value="sell">Sell / Short</option>
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Timeframe</label>
            <select style={s.select} value={form.timeframe} onChange={e => setForm({ ...form, timeframe: e.target.value })}>
              {timeframes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{ ...s.row, marginBottom: 14 }}>
          {[["Entry Price", "entry_price"], ["Exit Price", "exit_price"], ["Stop Loss", "stop_loss"], ["Take Profit", "take_profit"]].map(([label, key]) => (
            <div key={key} style={s.formGroup}>
              <label style={s.label}>{label}</label>
              <input type="number" step="0.00001" style={s.input} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder="0.00000" />
            </div>
          ))}
        </div>
        <div style={{ ...s.row, marginBottom: 14 }}>
          {[["Lot Size", "lot_size"], ["P&L ($)", "pnl"], ["Pips", "pips"]].map(([label, key]) => (
            <div key={key} style={s.formGroup}>
              <label style={s.label}>{label}</label>
              <input type="number" step="0.01" style={s.input} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder="0.00" />
            </div>
          ))}
          <div style={s.formGroup}>
            <label style={s.label}>Setup Type</label>
            <input type="text" style={s.input} value={form.setup_type} onChange={e => setForm({ ...form, setup_type: e.target.value })} placeholder="e.g. Breakout, Trend Follow" />
          </div>
        </div>
        <div style={{ ...s.row, marginBottom: 14 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Entry Emotion</label>
            <select style={s.select} value={form.emotion_entry} onChange={e => setForm({ ...form, emotion_entry: e.target.value })}>
              {emotions_entry.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Exit Emotion</label>
            <select style={s.select} value={form.emotion_exit} onChange={e => setForm({ ...form, emotion_exit: e.target.value })}>
              {emotions_exit.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
        {/* Psychology flags */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 16 }}>
          {[["Followed Plan", "followed_plan"], ["Moved Stop Loss", "moved_stop_loss"], ["Exited Early", "exited_early"], ["Revenge Trade", "is_revenge_trade"]].map(([label, key]) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.textSub, cursor: "pointer" }}>
              <input type="checkbox" checked={form[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} style={{ accentColor: C.gold }} />
              {label}
            </label>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Trade Notes</label>
          <textarea style={s.textarea} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="What happened? What did you learn?" />
        </div>
        {msg && <div style={{ padding: "10px 14px", borderRadius: 8, background: msg.includes("⚠") ? "#2a1a00" : "#0a1a0a", color: msg.includes("⚠") ? C.gold : C.green, marginBottom: 12, fontSize: 14 }}>{msg}</div>}
        <button style={{ ...s.btn, ...s.btnGold }} onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Log Trade"}</button>
      </div>

      {/* Trade History */}
      <div style={s.card}>
        <div style={s.cardTitle}>Trade History ({trades.length} trades)</div>
        {trades.length === 0 ? (
          <div style={{ textAlign: "center", padding: 32, color: C.textMuted, fontSize: 14 }}>No trades logged yet.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>{["Date", "Pair", "Dir", "Lots", "Entry", "Exit", "SL", "TP", "P&L", "Pips", "Emotion", "Flags"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[...trades].reverse().map((t, i) => (
                  <tr key={i}>
                    <td style={s.td}>{t.trade_date}</td>
                    <td style={s.td}><strong style={{ color: "#fff" }}>{t.pair}</strong></td>
                    <td style={s.td}><span style={{ color: t.direction === "buy" ? C.green : C.red, fontWeight: 700, textTransform: "uppercase", fontSize: 11 }}>{t.direction}</span></td>
                    <td style={s.td}>{t.lot_size || "—"}</td>
                    <td style={s.td}>{t.entry_price || "—"}</td>
                    <td style={s.td}>{t.exit_price || "—"}</td>
                    <td style={s.td}>{t.stop_loss || "—"}</td>
                    <td style={s.td}>{t.take_profit || "—"}</td>
                    <td style={s.td}><strong style={{ color: t.pnl >= 0 ? C.green : C.red }}>{t.pnl >= 0 ? "+" : ""}${t.pnl?.toFixed(2)}</strong></td>
                    <td style={s.td}>{t.pips || "—"}</td>
                    <td style={s.td}><span style={{ ...s.tag, background: "#1a1a2e", color: "#aaa", fontSize: 10 }}>{t.emotion_entry}</span></td>
                    <td style={s.td}>
                      {t.is_revenge_trade && <span style={{ ...s.tag, background: "#2a0a0a", color: C.red, fontSize: 10 }}>⚠ Revenge</span>}
                      {t.moved_stop_loss && <span style={{ ...s.tag, background: "#1a0a2a", color: C.purple, fontSize: 10 }}>Moved SL</span>}
                      {t.exited_early && <span style={{ ...s.tag, background: "#0a1a2a", color: C.blue, fontSize: 10 }}>Early Exit</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// SESSION LOG
// ============================================
function SessionLog({ sessions, setSessions, trades, isPro }) {
  const [form, setForm] = useState({ session_date: new Date().toISOString().split("T")[0], pre_readiness_score: 7, pre_emotional_state: "neutral", pre_dxy_bias: "neutral", pre_trade_plan: "", post_emotional_state: "calm", post_session_notes: "", discipline_score: 75, plan_adherence_score: 75 });
  const [aiReview, setAiReview] = useState("");
  const [loading, setLoading] = useState(false);

  const generateReview = async () => {
    setLoading(true);
    const todayTrades = trades.filter(t => t.trade_date === form.session_date);
    const revengeCount = todayTrades.filter(t => t.is_revenge_trade).length;
    const totalPnl = todayTrades.reduce((a, t) => a + (t.pnl || 0), 0);
    const prompt = `Trading session review for ${form.session_date}:
- Readiness score before trading: ${form.pre_readiness_score}/10
- Emotional state at start: ${form.pre_emotional_state}
- Emotional state at end: ${form.post_emotional_state}
- DXY bias: ${form.pre_dxy_bias}
- Trades taken: ${todayTrades.length}
- Net P&L: $${totalPnl.toFixed(2)}
- Revenge trades: ${revengeCount}
- Discipline score: ${form.discipline_score}/100
- Plan adherence: ${form.plan_adherence_score}/100
- Trader notes: ${form.post_session_notes}

Give a detailed trading psychology review. Identify patterns, highlight what went well, and give 2-3 specific actionable improvements for the next session.`;
    const review = await askClaude(prompt);
    setAiReview(review);
    setLoading(false);
  };

  const saveSession = () => {
    setSessions(prev => [...prev, { ...form, ai_session_review: aiReview }]);
    setAiReview("");
    setForm({ ...form, post_session_notes: "", pre_trade_plan: "" });
  };

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>Pre-Session Setup</div>
        <div style={{ ...s.row, marginBottom: 14 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Session Date</label>
            <input type="date" style={s.input} value={form.session_date} onChange={e => setForm({ ...form, session_date: e.target.value })} />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Readiness Score (1-10)</label>
            <input type="range" min="1" max="10" value={form.pre_readiness_score} onChange={e => setForm({ ...form, pre_readiness_score: parseInt(e.target.value) })} style={{ width: "100%", accentColor: C.gold }} />
            <div style={{ textAlign: "center", color: C.gold, fontWeight: 700, fontSize: 18 }}>{form.pre_readiness_score}/10</div>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>DXY Bias Today</label>
            <select style={s.select} value={form.pre_dxy_bias} onChange={e => setForm({ ...form, pre_dxy_bias: e.target.value })}>
              <option value="bullish">Bullish Dollar</option>
              <option value="bearish">Bearish Dollar</option>
              <option value="neutral">Neutral</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>Trade Plan for Today</label>
          <textarea style={s.textarea} value={form.pre_trade_plan} onChange={e => setForm({ ...form, pre_trade_plan: e.target.value })} placeholder="What pairs are you watching? Key levels? Your plan..." />
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Post-Session Review</div>
        <div style={{ ...s.row, marginBottom: 14 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Discipline Score (0-100)</label>
            <input type="range" min="0" max="100" value={form.discipline_score} onChange={e => setForm({ ...form, discipline_score: parseInt(e.target.value) })} style={{ width: "100%", accentColor: C.gold }} />
            <div style={{ textAlign: "center", color: C.gold, fontWeight: 700, fontSize: 18 }}>{form.discipline_score}/100</div>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Plan Adherence (0-100)</label>
            <input type="range" min="0" max="100" value={form.plan_adherence_score} onChange={e => setForm({ ...form, plan_adherence_score: parseInt(e.target.value) })} style={{ width: "100%", accentColor: C.gold }} />
            <div style={{ textAlign: "center", color: C.blue, fontWeight: 700, fontSize: 18 }}>{form.plan_adherence_score}/100</div>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Post-Session Notes</label>
          <textarea style={s.textarea} value={form.post_session_notes} onChange={e => setForm({ ...form, post_session_notes: e.target.value })} placeholder="How did the session go? What happened emotionally? What would you do differently?" />
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button style={{ ...s.btn, ...s.btnGold }} onClick={generateReview} disabled={loading}>{loading ? "Generating..." : "🤖 Generate AI Review"}</button>
          <button style={{ ...s.btn, ...s.btnOutline }} onClick={saveSession}>Save Session</button>
        </div>
        {aiReview && (
          <div style={s.aiBox}>
            <div style={s.aiLabel}>🤖 TraderPoise AI — Session Review</div>
            <div style={s.aiText}>{aiReview}</div>
          </div>
        )}
      </div>

      {/* Session History */}
      <div style={s.card}>
        <div style={s.cardTitle}>Session History</div>
        {sessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: 32, color: C.textMuted, fontSize: 14 }}>No sessions logged yet.</div>
        ) : (
          [...sessions].reverse().map((session, i) => (
            <div key={i} style={{ background: C.bgDark, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <strong style={{ color: "#fff" }}>{session.session_date}</strong>
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ ...s.tag, background: "#1a1400", color: C.gold }}>Discipline: {session.discipline_score}</span>
                  <span style={{ ...s.tag, background: "#0a1a2a", color: C.blue }}>Adherence: {session.plan_adherence_score}</span>
                </div>
              </div>
              {session.post_session_notes && <p style={{ fontSize: 13, color: "#888", lineHeight: 1.5, marginBottom: 8 }}>{session.post_session_notes}</p>}
              {session.ai_session_review && (
                <div style={{ ...s.aiBox, marginTop: 8 }}>
                  <div style={s.aiLabel}>AI Review</div>
                  <div style={{ ...s.aiText, fontSize: 13 }}>{session.ai_session_review}</div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// READINESS CHECK
// ============================================
function ReadinessCheck() {
  const questions = [
    { key: "mental_state", label: "How is your mental state right now?", type: "scale" },
    { key: "followed_routine", label: "Did you follow your morning trading routine?", type: "bool" },
    { key: "has_clear_plan", label: "Do you have a clear trade plan for today?", type: "bool" },
    { key: "risk_defined", label: "Is your risk per trade clearly defined?", type: "bool" },
    { key: "emotionally_stable", label: "Are you emotionally stable? (No anger, fear, or overexcitement)", type: "bool" },
    { key: "not_revenge_trading", label: "Are you free from the urge to recover yesterday's losses?", type: "bool" },
    { key: "market_analyzed", label: "Have you analyzed the market and DXY before opening any charts?", type: "bool" },
  ];

  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calcScore = () => {
    let score = 0;
    if (answers.mental_state) score += (answers.mental_state / 10) * 30;
    const bools = ["followed_routine", "has_clear_plan", "risk_defined", "emotionally_stable", "not_revenge_trading", "market_analyzed"];
    bools.forEach(k => { if (answers[k]) score += 70 / bools.length; });
    return Math.round(score);
  };

  const runCheck = async () => {
    setLoading(true);
    const score = calcScore();
    const prompt = `Pre-trade readiness check results:
- Mental state: ${answers.mental_state || 5}/10
- Followed morning routine: ${answers.followed_routine ? "Yes" : "No"}
- Has clear trade plan: ${answers.has_clear_plan ? "Yes" : "No"}
- Risk defined: ${answers.risk_defined ? "Yes" : "No"}
- Emotionally stable: ${answers.emotionally_stable ? "Yes" : "No"}
- Free from revenge urge: ${answers.not_revenge_trading ? "Yes" : "No"}
- Market analyzed: ${answers.market_analyzed ? "Yes" : "No"}
- Overall readiness score: ${score}/100

Should this trader trade today? Give a direct recommendation (YES/CAUTION/NO) and explain why in 3-4 sentences. Be specific and direct.`;
    const recommendation = await askClaude(prompt);
    const cleared = score >= 70;
    setResult({ score, recommendation, cleared });
    setLoading(false);
  };

  const scoreColor = result ? (result.score >= 70 ? C.green : result.score >= 50 ? C.gold : C.red) : C.gold;

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>Pre-Trade Readiness Check</div>
        <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 24 }}>Answer honestly. This check protects your account and your discipline streak.</p>
        {questions.map(q => (
          <div key={q.key} style={{ marginBottom: 20 }}>
            <label style={{ ...s.label, fontSize: 14, color: "#ccc", marginBottom: 10 }}>{q.label}</label>
            {q.type === "scale" ? (
              <div>
                <input type="range" min="1" max="10" value={answers[q.key] || 5} onChange={e => setAnswers({ ...answers, [q.key]: parseInt(e.target.value) })} style={{ width: "100%", accentColor: C.gold }} />
                <div style={{ textAlign: "center", color: C.gold, fontWeight: 700, fontSize: 20 }}>{answers[q.key] || 5}/10</div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 12 }}>
                <button style={{ ...s.btn, ...(answers[q.key] === true ? s.btnGreen : s.btnOutline), flex: 1 }} onClick={() => setAnswers({ ...answers, [q.key]: true })}>✓ Yes</button>
                <button style={{ ...s.btn, ...(answers[q.key] === false ? s.btnRed : s.btnOutline), flex: 1 }} onClick={() => setAnswers({ ...answers, [q.key]: false })}>✗ No</button>
              </div>
            )}
          </div>
        ))}
        <button style={{ ...s.btn, ...s.btnGold, marginTop: 8 }} onClick={runCheck} disabled={loading}>{loading ? "Checking..." : "Get AI Readiness Score"}</button>
      </div>

      {result && (
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 20 }}>
            <div style={{ ...s.scoreRing, background: `${scoreColor}22`, border: `3px solid ${scoreColor}`, color: scoreColor }}>{result.score}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: result.cleared ? C.green : C.red }}>
                {result.cleared ? "✓ Cleared to Trade" : "⚠ Not Recommended"}
              </div>
              <div style={{ fontSize: 14, color: C.textMuted }}>Readiness score: {result.score}/100</div>
            </div>
          </div>
          <div style={s.aiBox}>
            <div style={s.aiLabel}>🤖 AI Recommendation</div>
            <div style={s.aiText}>{result.recommendation}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// DISCIPLINE SCORE
// ============================================
function DisciplineScore({ trades, sessions, rules }) {
  const avgDiscipline = sessions.length ? Math.round(sessions.reduce((a, s) => a + (s.discipline_score || 0), 0) / sessions.length) : 0;
  const avgAdherence = sessions.length ? Math.round(sessions.reduce((a, s) => a + (s.plan_adherence_score || 0), 0) / sessions.length) : 0;
  const revengeRate = trades.length ? ((trades.filter(t => t.is_revenge_trade).length / trades.length) * 100).toFixed(0) : 0;
  const movedSlRate = trades.length ? ((trades.filter(t => t.moved_stop_loss).length / trades.length) * 100).toFixed(0) : 0;
  const streak = sessions.filter(s => s.discipline_score >= 70).length;
  const overall = Math.round((avgDiscipline * 0.4) + (avgAdherence * 0.3) + ((100 - parseInt(revengeRate)) * 0.3));
  const scoreColor = overall >= 70 ? C.green : overall >= 50 ? C.gold : C.red;

  return (
    <div>
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
          <div style={{ ...s.scoreRing, width: 120, height: 120, fontSize: 36, background: `${scoreColor}15`, border: `4px solid ${scoreColor}`, color: scoreColor }}>{overall || "—"}</div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Discipline Score</div>
            <div style={{ fontSize: 15, color: C.textMuted, marginBottom: 12 }}>Your weekly trading psychology grade</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <span style={{ ...s.tag, background: "#1a1a2e", color: C.blue, fontSize: 13 }}>🔥 {streak} Day Streak</span>
              <span style={{ ...s.tag, background: sessions.length > 0 ? "#0a1a0a" : "#1a1a2e", color: sessions.length > 0 ? C.green : "#888", fontSize: 13 }}>📊 {sessions.length} Sessions</span>
            </div>
          </div>
        </div>
      </div>

      <div style={s.grid2}>
        {[
          { label: "Avg Discipline", value: `${avgDiscipline}/100`, color: C.gold, icon: "🏅" },
          { label: "Plan Adherence", value: `${avgAdherence}/100`, color: C.blue, icon: "📋" },
          { label: "Revenge Trade Rate", value: `${revengeRate}%`, color: parseInt(revengeRate) > 10 ? C.red : C.green, icon: "⚠️" },
          { label: "Moved Stop Loss Rate", value: `${movedSlRate}%`, color: parseInt(movedSlRate) > 10 ? C.red : C.green, icon: "🛑" },
        ].map(stat => (
          <div key={stat.label} style={s.statCard}>
            <div style={s.statLabel}>{stat.icon} {stat.label}</div>
            <div style={{ ...s.statValue, color: stat.color, fontSize: 24 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>Discipline Breakdown</div>
        {[
          { label: "Emotional Control", score: avgDiscipline, desc: "How well you managed emotions during sessions" },
          { label: "Rule Adherence", score: avgAdherence, desc: "How closely you followed your trading rules" },
          { label: "Revenge Trade Control", score: 100 - parseInt(revengeRate), desc: "Avoiding impulsive re-entries after losses" },
        ].map(item => (
          <div key={item.label} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: "#ccc" }}>{item.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: item.score >= 70 ? C.green : item.score >= 50 ? C.gold : C.red }}>{item.score}/100</span>
            </div>
            <div style={{ background: C.bgDark, borderRadius: 8, height: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${item.score}%`, background: item.score >= 70 ? C.green : item.score >= 50 ? C.gold : C.red, borderRadius: 8, transition: "width 0.5s" }} />
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// WHY I LOST
// ============================================
function WhyILost({ trades, isPro, ProGate }) {
  const [description, setDescription] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const losingTrades = trades.filter(t => t.pnl < 0);

  const diagnose = async () => {
    if (!description) return;
    setLoading(true);
    const trade = losingTrades.find(t => t.trade_date === selectedTrade);
    const prompt = `A trader is describing a losing trade for diagnosis:

"${description}"

${trade ? `Trade data: ${trade.pair} ${trade.direction}, P&L: $${trade.pnl}, Entry emotion: ${trade.emotion_entry}, Moved stop loss: ${trade.moved_stop_loss}, Exited early: ${trade.exited_early}, Revenge trade: ${trade.is_revenge_trade}` : ""}

Provide a detailed psychological root cause analysis. Identify:
1. The PRIMARY psychological cause of this loss
2. The specific behavioral pattern that led to it
3. Three concrete actions to prevent this exact scenario next time
4. One mindset shift that would make the biggest difference

Be direct and specific — not generic trading advice.`;
    const result = await askClaude(prompt);
    setDiagnosis(result);
    setLoading(false);
  };

  if (!isPro) return <div style={s.card}><ProGate feature="Why I Lost — AI Diagnosis" /></div>;

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>Why I Lost — AI Diagnosis</div>
        <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Describe a losing trade or session in plain English. AI diagnoses the psychological root cause.</p>
        {losingTrades.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>Link to a Losing Trade (Optional)</label>
            <select style={s.select} value={selectedTrade} onChange={e => setSelectedTrade(e.target.value)}>
              <option value="">Select a trade...</option>
              {losingTrades.map((t, i) => <option key={i} value={t.trade_date}>{t.trade_date} — {t.pair} — ${t.pnl?.toFixed(2)}</option>)}
            </select>
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Describe what happened</label>
          <textarea style={{ ...s.textarea, minHeight: 140 }} value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell me exactly what happened. How were you feeling? What made you enter? Why did you exit when you did? Don't filter — the more honest, the better the diagnosis." />
        </div>
        <button style={{ ...s.btn, ...s.btnGold }} onClick={diagnose} disabled={loading || !description}>{loading ? "Diagnosing..." : "🔍 Get AI Diagnosis"}</button>
      </div>
      {diagnosis && (
        <div style={s.card}>
          <div style={s.aiBox}>
            <div style={s.aiLabel}>🤖 TraderPoise AI — Loss Diagnosis</div>
            <div style={s.aiText}>{diagnosis}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// RISK CALCULATOR
// ============================================
function RiskCalculator() {
  const [form, setForm] = useState({ account: "", risk_pct: "1", sl_pips: "", pair: "EURUSD", tp_pips: "" });
  const [result, setResult] = useState(null);

  const pipValues = { EURUSD: 10, GBPUSD: 10, USDJPY: 9.09, USDCHF: 10.92, AUDUSD: 10, NZDUSD: 10, USDCAD: 7.69, XAUUSD: 1, GBPJPY: 9.09, EURJPY: 9.09, SPX500: 1, NAS100: 1, US30: 1 };

  const calculate = () => {
    const account = parseFloat(form.account);
    const riskPct = parseFloat(form.risk_pct);
    const slPips = parseFloat(form.sl_pips);
    const tpPips = parseFloat(form.tp_pips);
    if (!account || !riskPct || !slPips) return;
    const riskAmount = (account * riskPct) / 100;
    const pipValue = pipValues[form.pair] || 10;
    const lotSize = riskAmount / (slPips * pipValue);
    const rr = tpPips ? (tpPips / slPips).toFixed(2) : null;
    const potentialProfit = tpPips ? (lotSize * tpPips * pipValue).toFixed(2) : null;
    setResult({ riskAmount: riskAmount.toFixed(2), lotSize: lotSize.toFixed(2), pipValue, rr, potentialProfit });
  };

  const pairs = ["EURUSD", "GBPUSD", "USDJPY", "USDCHF", "AUDUSD", "NZDUSD", "USDCAD", "XAUUSD", "GBPJPY", "EURJPY", "SPX500", "NAS100", "US30"];

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>Risk & Lot Size Calculator</div>
        <div style={{ ...s.row, marginBottom: 14 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Account Size ($)</label>
            <input type="number" style={s.input} value={form.account} onChange={e => setForm({ ...form, account: e.target.value })} placeholder="e.g. 10000" />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Risk % Per Trade</label>
            <input type="number" step="0.1" style={s.input} value={form.risk_pct} onChange={e => setForm({ ...form, risk_pct: e.target.value })} placeholder="e.g. 1" />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Pair</label>
            <select style={s.select} value={form.pair} onChange={e => setForm({ ...form, pair: e.target.value })}>
              {pairs.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div style={{ ...s.row, marginBottom: 20 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Stop Loss (Pips)</label>
            <input type="number" style={s.input} value={form.sl_pips} onChange={e => setForm({ ...form, sl_pips: e.target.value })} placeholder="e.g. 20" />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Take Profit (Pips) — Optional</label>
            <input type="number" style={s.input} value={form.tp_pips} onChange={e => setForm({ ...form, tp_pips: e.target.value })} placeholder="e.g. 40" />
          </div>
        </div>
        <button style={{ ...s.btn, ...s.btnGold }} onClick={calculate}>Calculate</button>
      </div>

      {result && (
        <div style={s.card}>
          <div style={s.cardTitle}>Calculation Result</div>
          <div style={s.grid2}>
            {[
              { label: "Risk Amount", value: `$${result.riskAmount}`, color: C.red },
              { label: "Lot Size", value: result.lotSize, color: C.gold },
              { label: "Pip Value", value: `$${result.pipValue}`, color: C.blue },
              result.rr ? { label: "Risk : Reward", value: `1 : ${result.rr}`, color: result.rr >= 2 ? C.green : C.gold } : null,
              result.potentialProfit ? { label: "Potential Profit", value: `$${result.potentialProfit}`, color: C.green } : null,
            ].filter(Boolean).map(stat => (
              <div key={stat.label} style={s.statCard}>
                <div style={s.statLabel}>{stat.label}</div>
                <div style={{ ...s.statValue, color: stat.color, fontSize: 28 }}>{stat.value}</div>
              </div>
            ))}
          </div>
          {result.rr && result.rr < 1.5 && (
            <div style={{ background: "#2a1a00", border: `1px solid #5a3a00`, borderRadius: 10, padding: 14, marginTop: 12, fontSize: 13, color: C.gold }}>
              ⚠ Risk/Reward below 1.5:1 — consider whether this trade meets your criteria before entering.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// P&L CALENDAR
// ============================================
function PnLCalendar({ trades }) {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (m, y) => new Date(y, m, 1).getDay();
  const days = getDaysInMonth(month, year);
  const firstDay = getFirstDay(month, year);

  const tradesByDate = {};
  trades.forEach(t => {
    const date = t.trade_date;
    if (!tradesByDate[date]) tradesByDate[date] = [];
    tradesByDate[date].push(t);
  });

  const getDayColor = (dateStr) => {
    const dayTrades = tradesByDate[dateStr];
    if (!dayTrades) return C.bgDark;
    const pnl = dayTrades.reduce((a, t) => a + (t.pnl || 0), 0);
    if (pnl > 0) return "#0a2a0a";
    if (pnl < 0) return "#2a0a0a";
    return "#1a1a2e";
  };

  const getDayPnl = (dateStr) => {
    const dayTrades = tradesByDate[dateStr];
    if (!dayTrades) return null;
    return dayTrades.reduce((a, t) => a + (t.pnl || 0), 0);
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div>
      <div style={s.card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={s.cardTitle}>P&L Calendar</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ ...s.btn, ...s.btnOutline, padding: "6px 12px" }} onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}>←</button>
            <span style={{ color: "#fff", fontWeight: 600 }}>{months[month]} {year}</span>
            <button style={{ ...s.btn, ...s.btnOutline, padding: "6px 12px" }} onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}>→</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 8 }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, color: C.textMuted, fontWeight: 700, padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
          {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {Array(days).fill(null).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const pnl = getDayPnl(dateStr);
            const bgColor = getDayColor(dateStr);
            const isToday = dateStr === new Date().toISOString().split("T")[0];
            return (
              <div key={day} style={{ ...s.calDay, background: bgColor, border: isToday ? `2px solid ${C.gold}` : `1px solid ${C.border}` }}>
                <span style={{ color: isToday ? C.gold : C.textMuted, fontWeight: isToday ? 700 : 400 }}>{day}</span>
                {pnl !== null && (
                  <span style={{ fontSize: 9, color: pnl >= 0 ? C.green : C.red, fontWeight: 700 }}>{pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(0)}</span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 20, marginTop: 16, flexWrap: "wrap" }}>
          {[["Profitable Day", "#0a2a0a", C.green], ["Loss Day", "#2a0a0a", C.red], ["No Trades", C.bgDark, C.textMuted]].map(([label, bg, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: bg, border: `1px solid ${C.border}` }} />
              <span style={{ fontSize: 12, color }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PROP FIRM MODE
// ============================================
function PropFirmMode() {
  const firms = [
    { name: "E8 Funding", profitTarget: 8, maxDaily: 5, maxTotal: 10 },
    { name: "FTMO", profitTarget: 10, maxDaily: 5, maxTotal: 10 },
    { name: "Apex Trader", profitTarget: 6, maxDaily: 3, maxTotal: 6 },
    { name: "MyFundedFX", profitTarget: 8, maxDaily: 5, maxTotal: 10 },
    { name: "The Funded Trader", profitTarget: 10, maxDaily: 5, maxTotal: 10 },
  ];
  const [selected, setSelected] = useState(firms[0]);
  const [account, setAccount] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [phase, setPhase] = useState("Challenge");

  const calc = () => {
    if (!account || !currentBalance) return null;
    const acc = parseFloat(account);
    const curr = parseFloat(currentBalance);
    const pnl = curr - acc;
    const pnlPct = (pnl / acc) * 100;
    const dailyDrawdown = 0;
    const totalDrawdown = Math.max(0, -pnlPct);
    const profitProgress = Math.max(0, pnlPct);
    const targetRemaining = selected.profitTarget - profitProgress;
    const maxLossRemaining = selected.maxTotal - totalDrawdown;
    const riskLevel = totalDrawdown >= selected.maxTotal * 0.8 ? "danger" : totalDrawdown >= selected.maxTotal * 0.5 ? "warning" : "safe";
    return { pnl, pnlPct, profitProgress, targetRemaining, maxLossRemaining, riskLevel, totalDrawdown };
  };

  const data = calc();
  const riskColors = { safe: C.green, warning: C.gold, danger: C.red };

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>Prop Firm Challenge Mode</div>
        <div style={{ ...s.row, marginBottom: 14 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Firm</label>
            <select style={s.select} onChange={e => setSelected(firms.find(f => f.name === e.target.value) || firms[0])}>
              {firms.map(f => <option key={f.name}>{f.name}</option>)}
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Phase</label>
            <select style={s.select} value={phase} onChange={e => setPhase(e.target.value)}>
              <option>Challenge</option>
              <option>Verification</option>
              <option>Funded</option>
            </select>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Account Size ($)</label>
            <input type="number" style={s.input} value={account} onChange={e => setAccount(e.target.value)} placeholder="e.g. 25000" />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Current Balance ($)</label>
            <input type="number" style={s.input} value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} placeholder="e.g. 25500" />
          </div>
        </div>
      </div>

      {data && (
        <div>
          <div style={s.grid2}>
            {[
              { label: "Current P&L", value: `${data.pnl >= 0 ? "+" : ""}$${data.pnl.toFixed(2)}`, color: data.pnl >= 0 ? C.green : C.red },
              { label: "Profit Progress", value: `${data.profitProgress.toFixed(2)}% / ${selected.profitTarget}%`, color: C.gold },
              { label: "Max Loss Remaining", value: `${data.maxLossRemaining.toFixed(2)}%`, color: riskColors[data.riskLevel] },
              { label: "Risk Level", value: data.riskLevel.toUpperCase(), color: riskColors[data.riskLevel] },
            ].map(stat => (
              <div key={stat.label} style={s.statCard}>
                <div style={s.statLabel}>{stat.label}</div>
                <div style={{ ...s.statValue, color: stat.color, fontSize: 22 }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {data.riskLevel !== "safe" && (
            <div style={{ background: data.riskLevel === "danger" ? "#2a0a0a" : "#2a1a00", border: `1px solid ${riskColors[data.riskLevel]}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: riskColors[data.riskLevel], marginBottom: 8 }}>
                {data.riskLevel === "danger" ? "🚨 DANGER — Stop Trading Now" : "⚠️ WARNING — Reduce Risk"}
              </div>
              <div style={{ fontSize: 14, color: "#bbb", lineHeight: 1.6 }}>
                {data.riskLevel === "danger"
                  ? `You are at ${(data.totalDrawdown / selected.maxTotal * 100).toFixed(0)}% of your maximum drawdown limit. One more loss could breach your account. Stop trading and review your psychology before your next session.`
                  : `You are approaching your maximum drawdown limit. Reduce position sizes by 50% and take only A+ setups until you recover buffer.`}
              </div>
            </div>
          )}

          <div style={s.card}>
            <div style={s.cardTitle}>{selected.name} — Challenge Rules</div>
            {[
              { label: "Profit Target", value: `${selected.profitTarget}%`, progress: (data.profitProgress / selected.profitTarget) * 100, color: C.green },
              { label: "Max Daily Loss", value: `${selected.maxDaily}%`, progress: 0, color: C.gold },
              { label: "Max Total Drawdown", value: `${selected.maxTotal}%`, progress: (data.totalDrawdown / selected.maxTotal) * 100, color: C.red },
            ].map(rule => (
              <div key={rule.label} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 14, color: "#ccc" }}>{rule.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: rule.color }}>{rule.value}</span>
                </div>
                <div style={{ background: C.bgDark, borderRadius: 8, height: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, rule.progress)}%`, background: rule.color, borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// DXY BRIEFING
// ============================================
function DXYBriefing() {
  const [dxyLevel, setDxyLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const prompt = `Generate a forex morning briefing based on this Dollar Index data:
DXY Level: ${dxyLevel || "unknown — analyze generally"}
Additional context: ${notes || "None"}
Today's date: ${new Date().toLocaleDateString()}

Provide:
1. DXY bias assessment (bullish/bearish/neutral) with reasoning
2. EURUSD directional bias and key levels to watch
3. GBPUSD directional bias and key levels to watch
4. Top 2 trading opportunities today with the DXY framework
5. Key risk events to be aware of

Keep it concise, actionable, and specific. No generic advice.`;
    const result = await askClaude(prompt);
    setBriefing(result);
    setLoading(false);
  };

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>🌐 DXY Morning Briefing</div>
        <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Enter the current DXY level for a personalized EURUSD/GBPUSD bias briefing.</p>
        <div style={{ ...s.row, marginBottom: 14 }}>
          <div style={s.formGroup}>
            <label style={s.label}>Current DXY Level</label>
            <input type="number" step="0.001" style={s.input} value={dxyLevel} onChange={e => setDxyLevel(e.target.value)} placeholder="e.g. 104.500" />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Additional Context (Optional)</label>
          <textarea style={s.textarea} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any news events, central bank announcements, or market observations..." />
        </div>
        <button style={{ ...s.btn, ...s.btnGold }} onClick={generate} disabled={loading}>{loading ? "Generating briefing..." : "Generate Morning Briefing"}</button>
      </div>
      {briefing && (
        <div style={s.card}>
          <div style={s.aiBox}>
            <div style={s.aiLabel}>🤖 TraderPoise AI — DXY Morning Briefing — {new Date().toLocaleDateString()}</div>
            <div style={s.aiText}>{briefing}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// AI REPORT CARD
// ============================================
function AIReportCard({ trades, sessions }) {
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    const totalPnl = trades.reduce((a, t) => a + (t.pnl || 0), 0);
    const winners = trades.filter(t => t.pnl > 0).length;
    const revengeCount = trades.filter(t => t.is_revenge_trade).length;
    const movedSL = trades.filter(t => t.moved_stop_loss).length;
    const earlyExits = trades.filter(t => t.exited_early).length;
    const avgDiscipline = sessions.length ? Math.round(sessions.reduce((a, s) => a + (s.discipline_score || 0), 0) / sessions.length) : 0;
    const prompt = `Generate a comprehensive weekly trading psychology report card:

Trading Performance:
- Total trades: ${trades.length}
- Winners: ${winners}, Losers: ${trades.length - winners}
- Win rate: ${trades.length ? ((winners / trades.length) * 100).toFixed(0) : 0}%
- Net P&L: $${totalPnl.toFixed(2)}

Psychology Metrics:
- Revenge trades: ${revengeCount} (${trades.length ? ((revengeCount / trades.length) * 100).toFixed(0) : 0}% of trades)
- Stop loss moved: ${movedSL} times
- Early exits: ${earlyExits} times
- Average discipline score: ${avgDiscipline}/100
- Sessions logged: ${sessions.length}

Create a structured report card with:
1. OVERALL GRADE (A/B/C/D/F) with justification
2. STRENGTHS — what they did well this week
3. WEAKNESSES — top 3 psychology issues to address
4. PATTERNS — recurring behavioral patterns identified
5. NEXT WEEK FOCUS — one specific goal to improve
6. MOTIVATIONAL CLOSE — genuine encouragement based on their data

Be specific, honest, and constructive.`;
    const result = await askClaude(prompt);
    setReport(result);
    setLoading(false);
  };

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>🤖 AI Weekly Report Card</div>
        <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 20 }}>Get a comprehensive AI analysis of your trading psychology for the week.</p>
        <div style={s.grid2}>
          {[
            { label: "Trades This Week", value: trades.length },
            { label: "Sessions Logged", value: sessions.length },
            { label: "Revenge Trades", value: trades.filter(t => t.is_revenge_trade).length },
            { label: "Net P&L", value: `$${trades.reduce((a, t) => a + (t.pnl || 0), 0).toFixed(2)}` },
          ].map(s2 => (
            <div key={s2.label} style={s.statCard}>
              <div style={s.statLabel}>{s2.label}</div>
              <div style={{ ...s.statValue, fontSize: 22 }}>{s2.value}</div>
            </div>
          ))}
        </div>
        <button style={{ ...s.btn, ...s.btnGold, marginTop: 8 }} onClick={generate} disabled={loading}>{loading ? "Generating report..." : "Generate Weekly Report Card"}</button>
      </div>
      {report && (
        <div style={s.card}>
          <div style={s.aiBox}>
            <div style={s.aiLabel}>🤖 TraderPoise AI — Weekly Report Card</div>
            <div style={s.aiText}>{report}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// MY RULES
// ============================================
function MyRules({ rules, setRules }) {
  const [newRule, setNewRule] = useState("");
  const [category, setCategory] = useState("psychology");
  const categories = ["risk", "psychology", "strategy", "routine", "prop_firm"];

  const addRule = () => {
    if (!newRule) return;
    setRules(prev => [...prev, { rule_text: newRule, category, is_active: true, id: Date.now() }]);
    setNewRule("");
  };

  const defaultRules = [
    { category: "risk", text: "Never risk more than 1% per trade" },
    { category: "psychology", text: "No trading within 10 minutes of a loss" },
    { category: "psychology", text: "Stop trading after 2 consecutive losses" },
    { category: "strategy", text: "Only trade setups with minimum 1:2 R:R" },
    { category: "routine", text: "Analyze DXY before opening any chart" },
    { category: "prop_firm", text: "Never exceed 3% daily drawdown" },
  ];

  const catColors = { risk: C.red, psychology: C.purple, strategy: C.blue, routine: C.green, prop_firm: C.gold };

  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>My Trading Rules</div>
        <div style={{ ...s.row, marginBottom: 12 }}>
          <div style={{ flex: 3 }}>
            <input type="text" style={s.input} value={newRule} onChange={e => setNewRule(e.target.value)} placeholder="Add a trading rule..." onKeyDown={e => e.key === "Enter" && addRule()} />
          </div>
          <div style={{ flex: 1 }}>
            <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <button style={{ ...s.btn, ...s.btnGold }} onClick={addRule}>Add Rule</button>
        </div>
        {rules.length === 0 && (
          <div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 12 }}>No rules added yet. Start with these proven rules:</div>
            {defaultRules.map((r, i) => (
              <div key={i} onClick={() => { setRules(prev => [...prev, { rule_text: r.text, category: r.category, is_active: true, id: Date.now() + i }]); }} style={{ background: C.bgDark, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ ...s.tag, background: `${catColors[r.category]}22`, color: catColors[r.category] }}>{r.category}</span>
                <span style={{ fontSize: 13, color: "#ccc" }}>{r.text}</span>
                <span style={{ marginLeft: "auto", color: C.textMuted, fontSize: 18 }}>+</span>
              </div>
            ))}
          </div>
        )}
        {rules.map((rule, i) => (
          <div key={i} style={{ background: C.bgDark, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ ...s.tag, background: `${catColors[rule.category]}22`, color: catColors[rule.category] }}>{rule.category}</span>
            <span style={{ fontSize: 14, color: "#ccc", flex: 1 }}>{rule.rule_text}</span>
            <button style={{ ...s.btn, background: "transparent", color: C.red, padding: "4px 10px", fontSize: 12 }} onClick={() => setRules(prev => prev.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// SETTINGS
// ============================================
function Settings({ plan }) {
  return (
    <div>
      <div style={s.card}>
        <div style={s.cardTitle}>Account Settings</div>
        <div style={{ marginBottom: 20 }}>
          <label style={s.label}>Trader ID</label>
          <input style={{ ...s.input, color: C.gold }} value="TP-FX-4829-KXPL" readOnly />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={s.label}>Current Plan</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ ...s.tag, background: plan === "pro" ? "#1a1400" : "#1a1a2e", color: plan === "pro" ? C.gold : "#888", fontSize: 14, padding: "6px 16px" }}>{plan === "pro" ? "⭐ Pro" : "Free"}</span>
            {plan !== "pro" && <button style={{ ...s.btn, ...s.btnGold }} onClick={() => window.open(STRIPE_PRO_LINK, "_blank")}>Upgrade to Pro</button>}
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={s.label}>MT4/MT5 EA Sync ID</label>
          <input style={{ ...s.input, color: C.blue }} value="TM-FX-4829-KXPL" readOnly />
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>Use this ID in your MT4/MT5 EA to auto-sync trades to TraderPoise</div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
          <div style={s.cardTitle}>Preferences</div>
          {[["Default Risk %", "1"], ["Account Currency", "USD"], ["Default Pair", "EURUSD"]].map(([label, val]) => (
            <div key={label} style={{ ...s.row, marginBottom: 12, alignItems: "center" }}>
              <label style={{ ...s.label, minWidth: 160, marginBottom: 0 }}>{label}</label>
              <input style={{ ...s.input, maxWidth: 200 }} defaultValue={val} />
            </div>
          ))}
        </div>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>About TraderPoise</div>
        <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7 }}>TraderPoise is a trading psychology platform built by a 14-year forex trader who learned the hard way that discipline — not strategy — is the real edge. Trade with poise. Win with composure.</p>
        <div style={{ marginTop: 16, fontSize: 12, color: "#444" }}>Version 1.0.0 — © 2025 TraderPoise</div>
      </div>
    </div>
  );
}
