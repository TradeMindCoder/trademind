import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// ============================================================
// HOW TO CHANGE THE BRAND NAME:
// 1. Search this file for "TraderPoise" and replace with your name
// 2. Search for "⚖" logo icon and replace with your preferred emoji or remove
// 3. Update the tagline "Trade with poise. Win with discipline." to match
// 4. In index.html, update the <title> tag too
// ============================================================

// Animated sparkline chart component
function SparkChart({ data, color, height = 60 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 300, h = height;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(" ");
  const fill = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  const fillPath = `M0,${h} L${fill.map(p => `${p}`).join(" L")} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#grad-${color.replace("#","")})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Animated counter
function AnimatedCounter({ target, prefix = "", suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

export default function Landing() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [traderType, setTraderType] = useState("forex");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pnl");

  // Demo chart data
  const chartData = {
    pnl: [120, 95, 140, 110, 180, 155, 210, 195, 240, 220, 280, 310],
    discipline: [45, 52, 48, 61, 58, 70, 65, 74, 72, 80, 85, 88],
    winrate: [42, 45, 44, 48, 50, 52, 49, 54, 56, 58, 60, 62],
  };

  const handleWaitlist = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email, full_name: name, trader_type: traderType }),
      });
      if (!res.ok) throw new Error("Already registered or error occurred.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>

      {/* NAV */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          <div style={S.logo}>
            <div style={S.logoMark}>⚖</div>
            <span style={S.logoText}>TraderPoise</span>
          </div>
          <div style={S.navLinks}>
            <a href="#features" style={S.navLink}>Features</a>
            <a href="#analytics" style={S.navLink}>Analytics</a>
            <a href="#pricing" style={S.navLink}>Pricing</a>
            <a href="#prop" style={S.navLink}>Prop Firms</a>
            <a href="#waitlist" style={S.navCta}>Get Early Access</a>
          </div>
          <button style={S.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
        {menuOpen && (
          <div style={S.mobileMenu}>
            {["features","analytics","pricing","prop","waitlist"].map(id => (
              <a key={id} href={`#${id}`} style={S.mobileLink} onClick={() => setMenuOpen(false)}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={S.hero}>
        <div style={S.heroInner}>
          <div style={S.heroLeft}>
            <div style={S.heroPill}>
              <span style={S.pillDot} />
              The Psychology Layer Trading Was Missing
            </div>
            <h1 style={S.heroTitle}>
              Trade With <span style={S.heroAccent}>Poise.</span><br />
              Win With Discipline.
            </h1>
            <p style={S.heroSub}>
              Most traders lose not because of bad strategy — but because of unmanaged psychology.
              TraderPoise is the AI platform that fixes the 80% of trading nobody talks about.
            </p>
            <div style={S.heroActions}>
              <a href="#waitlist" style={S.btnPrimary}>Join Free — Early Access</a>
              <a href="#features" style={S.btnGhost}>See How It Works →</a>
            </div>
            <div style={S.trustRow}>
              {["Forex", "Stocks", "Crypto", "Prop Firms", "All Markets"].map(t => (
                <span key={t} style={S.trustTag}>{t}</span>
              ))}
            </div>
          </div>

          {/* HERO DASHBOARD PREVIEW */}
          <div style={S.heroRight}>
            <div style={S.dashPreview}>
              <div style={S.dashHeader}>
                <div style={S.dashTitle}>
                  <div style={S.dashDot} />
                  TraderPoise Dashboard
                </div>
                <span style={S.dashBadge}>LIVE</span>
              </div>

              {/* Mini stat row */}
              <div style={S.miniStats}>
                {[
                  { label: "P&L This Week", value: "+$1,240", color: "#4ade80" },
                  { label: "Discipline Score", value: "87/100", color: "#f0c040" },
                  { label: "Win Rate", value: "62%", color: "#60a5fa" },
                  { label: "Revenge Trades", value: "0", color: "#4ade80" },
                ].map(s => (
                  <div key={s.label} style={S.miniStat}>
                    <div style={S.miniStatLabel}>{s.label}</div>
                    <div style={{ ...S.miniStatValue, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Chart tabs */}
              <div style={S.chartTabs}>
                {[["pnl", "P&L Growth"], ["discipline", "Discipline"], ["winrate", "Win Rate"]].map(([id, label]) => (
                  <button key={id} style={{ ...S.chartTab, ...(activeTab === id ? S.chartTabActive : {}) }} onClick={() => setActiveTab(id)}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Animated chart */}
              <div style={S.chartArea}>
                <SparkChart
                  data={chartData[activeTab]}
                  color={activeTab === "pnl" ? "#4ade80" : activeTab === "discipline" ? "#f0c040" : "#60a5fa"}
                  height={80}
                />
                <div style={S.chartLabels}>
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
                    <span key={m} style={S.chartLabel}>{m}</span>
                  ))}
                </div>
              </div>

              {/* AI insight card */}
              <div style={S.aiCard}>
                <div style={S.aiCardIcon}>🤖</div>
                <div>
                  <div style={S.aiCardTitle}>AI Psychology Insight</div>
                  <div style={S.aiCardText}>Your discipline score improved 23pts this month. Revenge trades dropped to zero. Keep this streak going — you're trading at your best.</div>
                </div>
              </div>

              {/* Recent trades mini */}
              <div style={S.miniTrades}>
                {[
                  { pair: "EURUSD", dir: "BUY", pnl: "+$142", emotion: "Disciplined", color: "#4ade80" },
                  { pair: "GBPUSD", dir: "SELL", pnl: "+$89", emotion: "Confident", color: "#4ade80" },
                  { pair: "EURUSD", dir: "BUY", pnl: "-$45", emotion: "Anxious", color: "#f87171" },
                ].map((t, i) => (
                  <div key={i} style={S.miniTrade}>
                    <strong style={{ color: "#fff", fontSize: 12 }}>{t.pair}</strong>
                    <span style={{ fontSize: 10, color: t.dir === "BUY" ? "#4ade80" : "#f87171", fontWeight: 700 }}>{t.dir}</span>
                    <span style={{ fontSize: 11, color: "#777" }}>{t.emotion}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: t.color, marginLeft: "auto" }}>{t.pnl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={S.statsBar}>
        <div style={S.statsInner}>
          {[
            { value: 80, suffix: "%", label: "of trading losses are psychological", prefix: "" },
            { value: 14, suffix: "+", label: "years of real trading experience built in", prefix: "" },
            { value: 3, suffix: "x", label: "better discipline after 30 days", prefix: "" },
            { value: 0, suffix: "", label: "generic advice — everything is data-driven", prefix: "$" },
          ].map((s, i) => (
            <div key={i} style={S.statItem}>
              <div style={S.statValue}>
                {s.prefix}<AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div style={S.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section style={S.problem}>
        <div style={S.container}>
          <div style={S.sectionEyebrow}>THE REAL PROBLEM</div>
          <h2 style={S.sectionTitle}>You know what to do.<br />You just don't do it.</h2>
          <div style={S.problemGrid}>
            {[
              { icon: "😤", title: "Revenge Trading", desc: "One bad trade becomes five because emotion overrides logic. You know it's wrong — and you do it anyway." },
              { icon: "🎯", title: "Exiting Too Early", desc: "Fear cuts your winners short. You watch the trade hit your target without you — every. single. time." },
              { icon: "📈", title: "Overleveraging", desc: "Overconfidence after a win leads to oversized positions. One trade undoes a week of gains." },
              { icon: "🔄", title: "Breaking Your Own Rules", desc: "You write rules. You break them. Nothing holds you accountable between your ears and your broker." },
            ].map(p => (
              <div key={p.title} style={S.problemCard}>
                <div style={S.problemIcon}>{p.icon}</div>
                <h3 style={S.problemCardTitle}>{p.title}</h3>
                <p style={S.problemCardDesc}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANALYTICS SECTION */}
      <section id="analytics" style={S.analytics}>
        <div style={S.container}>
          <div style={S.sectionEyebrow}>REAL ANALYTICS</div>
          <h2 style={S.sectionTitle}>See your psychology<br />in numbers, not feelings.</h2>
          <p style={S.analyticsDesc}>TraderPoise turns your emotional trading patterns into measurable data — so you can fix the right thing, not guess.</p>

          <div style={S.analyticsGrid}>
            {/* Big chart card */}
            <div style={S.analyticsCard}>
              <div style={S.analyticsCardHeader}>
                <div>
                  <div style={S.analyticsCardTitle}>Discipline Score Over Time</div>
                  <div style={S.analyticsCardSub}>Weekly psychology grade — built from real session data</div>
                </div>
                <div style={{ ...S.trendBadge, background: "#0a2a0a", color: "#4ade80" }}>↑ +23 pts this month</div>
              </div>
              <SparkChart data={[45, 52, 48, 61, 58, 70, 65, 74, 72, 80, 85, 88]} color="#f0c040" height={100} />
              <div style={S.analyticsChartLabels}>
                {["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"].map(w => (
                  <span key={w} style={{ fontSize: 10, color: "#444" }}>{w}</span>
                ))}
              </div>
            </div>

            {/* Metric cards */}
            <div style={S.analyticsMetrics}>
              {[
                { icon: "⚡", label: "Revenge Trade Detection", value: "0 this week", change: "↓ from 3 last week", good: true },
                { icon: "🎯", label: "Plan Adherence Score", value: "91%", change: "↑ Best ever", good: true },
                { icon: "😤", label: "Early Exits Flagged", value: "2 trades", change: "Review your exits", good: false },
                { icon: "🔥", label: "Discipline Streak", value: "14 days", change: "Keep going", good: true },
              ].map(m => (
                <div key={m.label} style={S.metricCard}>
                  <div style={S.metricIcon}>{m.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={S.metricLabel}>{m.label}</div>
                    <div style={S.metricValue}>{m.value}</div>
                  </div>
                  <div style={{ ...S.metricChange, color: m.good ? "#4ade80" : "#f0c040" }}>{m.change}</div>
                </div>
              ))}
            </div>

            {/* P&L + emotion chart */}
            <div style={{ ...S.analyticsCard, background: "#0d0d18" }}>
              <div style={S.analyticsCardHeader}>
                <div>
                  <div style={S.analyticsCardTitle}>P&L Growth Trajectory</div>
                  <div style={S.analyticsCardSub}>Cumulative returns as discipline improves</div>
                </div>
                <div style={{ ...S.trendBadge, background: "#0a2a0a", color: "#4ade80" }}>+$3,120 total</div>
              </div>
              <SparkChart data={[120, 95, 180, 140, 260, 220, 340, 300, 420, 390, 510, 580]} color="#4ade80" height={100} />
              <div style={S.analyticsChartLabels}>
                {["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map(m => (
                  <span key={m} style={{ fontSize: 10, color: "#444" }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Emotion breakdown */}
            <div style={S.emotionCard}>
              <div style={S.analyticsCardTitle}>Entry Emotion Breakdown</div>
              <div style={S.analyticsCardSub}>What emotions drive your best trades?</div>
              <div style={{ marginTop: 16 }}>
                {[
                  { emotion: "Disciplined", pct: 42, color: "#4ade80" },
                  { emotion: "Confident", pct: 28, color: "#60a5fa" },
                  { emotion: "Neutral", pct: 18, color: "#888" },
                  { emotion: "FOMO", pct: 8, color: "#f87171" },
                  { emotion: "Revenge", pct: 4, color: "#ef4444" },
                ].map(e => (
                  <div key={e.emotion} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: "#ccc" }}>{e.emotion}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: e.color }}>{e.pct}%</span>
                    </div>
                    <div style={{ background: "#1a1a2e", borderRadius: 6, height: 6 }}>
                      <div style={{ height: "100%", width: `${e.pct}%`, background: e.color, borderRadius: 6 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={S.features}>
        <div style={S.container}>
          <div style={S.sectionEyebrow}>WHAT TRADERPOISE DOES</div>
          <h2 style={S.sectionTitle}>Every tool your trading<br />psychology needs</h2>
          <div style={S.featuresGrid}>
            {[
              { icon: "🧘", title: "Pre-Trade Readiness Check", desc: "7-question AI assessment before every session. Get a readiness score — only trade when you're truly ready.", pro: false },
              { icon: "🔍", title: "AI Post-Session Review", desc: "Deep psychology debrief after every session. Not just P&L — exactly why you made every decision.", pro: false },
              { icon: "⚠️", title: "Revenge Trade Detection", desc: "Auto-flags re-entries after losses. See your revenge trade history and break the pattern with data.", pro: false },
              { icon: "📊", title: "Discipline Score", desc: "A single weekly score (0–100) built from rule adherence, emotional control, and consistency.", pro: false },
              { icon: "📅", title: "P&L Calendar + Mood Overlay", desc: "Every trading day colour-coded by profit and emotional state. Find your peak psychology days.", pro: false },
              { icon: "🔢", title: "Risk & Lot Size Calculator", desc: "Exact lot sizes, risk amounts, pip values, and R:R ratios. Built for forex, stocks, and indices.", pro: false },
              { icon: "💡", title: "Why I Lost — AI Diagnosis", desc: "Describe a loss in plain English. AI diagnoses the psychological root cause with specific fixes.", pro: true },
              { icon: "🌐", title: "DXY Morning Briefing", desc: "Daily AI-powered Dollar Index briefing with EURUSD and GBPUSD directional bias.", pro: true },
              { icon: "🏆", title: "Prop Firm Challenge Mode", desc: "E8, FTMO, Apex, MyFundedFX. Real-time drawdown tracking with psychological guardrails.", pro: true },
              { icon: "📥", title: "MT4/MT5 CSV Import", desc: "Import your full trade history directly from MetaTrader 4 or 5 with one click. All trades auto-tagged and analysed instantly.", pro: true },
              { icon: "🔥", title: "Streak Tracker", desc: "Track consecutive days of rule adherence. Gamified discipline that makes consistency rewarding.", pro: false },
            ].map(f => (
              <div key={f.title} style={S.featureCard}>
                <div style={S.featureCardIcon}>{f.icon}</div>
                {f.pro && <span style={S.proLabel}>PRO</span>}
                <h3 style={S.featureCardTitle}>{f.title}</h3>
                <p style={S.featureCardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROP FIRM */}
      <section id="prop" style={S.prop}>
        <div style={S.container}>
          <div style={S.propInner}>
            <div style={S.propLeft}>
              <div style={S.sectionEyebrow}>PROP FIRM TRADERS</div>
              <h2 style={S.sectionTitle}>Built for funded traders<br />who want to stay funded.</h2>
              <p style={S.propDesc}>The #1 reason traders fail prop firm challenges isn't strategy — it's psychology under pressure. TraderPoise Challenge Mode keeps you mentally accountable from Day 1 to funded.</p>
              <div style={S.propFeatures}>
                {[
                  "Real-time daily drawdown monitoring",
                  "Psychological warning at 70% of max loss",
                  "Challenge phase progression tracker",
                  "Discipline score tied to challenge rules",
                  "AI warnings before you breach limits",
                  "Post-challenge funded account mode",
                ].map(f => (
                  <div key={f} style={S.propFeatureItem}>
                    <span style={S.propCheck}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
            <div style={S.propRight}>
              <div style={S.firmGrid}>
                {["E8 Funding", "FTMO", "Apex Trader", "MyFundedFX", "The Funded Trader", "True Forex Funds"].map(f => (
                  <div key={f} style={S.firmTag}>{f}</div>
                ))}
              </div>
              <div style={S.challengeCard}>
                <div style={S.challengeHeader}>E8 Challenge — Phase 1</div>
                {[
                  { label: "Profit Target", pct: 68, target: "8%", color: "#4ade80" },
                  { label: "Max Daily Loss", pct: 20, target: "5%", color: "#f0c040" },
                  { label: "Max Drawdown", pct: 35, target: "10%", color: "#f87171" },
                ].map(r => (
                  <div key={r.label} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "#aaa" }}>{r.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>Limit: {r.target}</span>
                    </div>
                    <div style={{ background: "#0d0d18", borderRadius: 8, height: 8 }}>
                      <div style={{ height: "100%", width: `${r.pct}%`, background: r.color, borderRadius: 8 }} />
                    </div>
                  </div>
                ))}
                <div style={S.challengeAI}>🤖 You're on track. Discipline score: 84/100. Avoid overtrading today.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={S.pricing}>
        <div style={S.container}>
          <div style={S.sectionEyebrow}>SIMPLE PRICING</div>
          <h2 style={S.sectionTitle}>Start free. Go pro when ready.</h2>
          <div style={S.pricingGrid}>
            {/* FREE */}
            <div style={S.pricingCard}>
              <div style={S.planTier}>Free</div>
              <div style={S.planPrice}>$0<span style={S.planPer}>/month</span></div>
              <p style={S.planTagline}>Everything to start building discipline</p>
              <div style={S.planDivider} />
              {["Unlimited trade journal", "Emotion tagging system", "Pre-trade readiness check", "AI session review (5/month)", "Revenge trade detection", "Discipline score tracker", "Risk & lot size calculator", "P&L Calendar", "1 prop firm tracker", "Streak tracker"].map(f => (
                <div key={f} style={S.planItem}><span style={S.checkGreen}>✓</span> {f}</div>
              ))}
              <a href="#waitlist" style={S.btnPlanFree}>Join Free — No Card Needed</a>
            </div>
            {/* PRO */}
            <div style={S.pricingCardPro}>
              <div style={S.popularBadge}>14-DAY FREE TRIAL</div>
              <div style={{ ...S.planTier, color: "#fff" }}>Pro</div>
              <div style={{ ...S.planPrice, color: "#f0c040" }}>$19.99<span style={{ ...S.planPer, color: "#aaa" }}>/month</span></div>
              <p style={{ ...S.planTagline, color: "#aaa" }}>For serious traders and prop firm challengers</p>
              <div style={{ ...S.planDivider, background: "#2a2a1a" }} />
              {["Everything in Free", "MT4/MT5 CSV Import", "Unlimited AI session reviews", "Why I Lost — AI Diagnosis", "DXY Morning Briefing (daily)", "EURUSD & GBPUSD bias reports", "Prop Firm Challenge Mode (unlimited)", "AI Weekly Report Card", "Plan adherence scoring", "Advanced pattern recognition", "Priority support"].map(f => (
                <div key={f} style={{ ...S.planItem, color: "#ddd" }}><span style={S.checkGold}>✓</span> {f}</div>
              ))}
              <a href="#waitlist" style={S.btnPlanPro}>Start 14-Day Free Trial</a>
              <div style={S.earlyBird}>🎉 No credit card required for trial</div>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" style={S.waitlist}>
        <div style={S.waitlistInner}>
          <div style={S.sectionEyebrow}>JOIN THE WAITLIST</div>
          <h2 style={S.waitlistTitle}>Be first when TraderPoise launches.</h2>
          <p style={S.waitlistSub}>Join traders already on the early access list. Every signup gets a full 14-day Pro trial — no credit card required.</p>
          {submitted ? (
            <div style={S.successBox}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h3 style={S.successTitle}>You're on the list!</h3>
              <p style={S.successSub}>We'll notify you the moment TraderPoise launches. Trade with poise until then.</p>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} style={S.form}>
              <div style={S.formRow}>
                <input style={S.input} type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} required />
                <input style={S.input} type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <select style={S.select} value={traderType} onChange={e => setTraderType(e.target.value)}>
                <option value="forex">Forex Trader</option>
                <option value="stocks">Stocks Trader</option>
                <option value="crypto">Crypto Trader</option>
                <option value="prop_firm">Prop Firm Trader</option>
                <option value="all">All of the above</option>
              </select>
              {error && <div style={S.errorBox}>{error}</div>}
              <button type="submit" style={S.btnSubmit} disabled={loading}>
                {loading ? "Joining..." : "Claim My Early Access Spot"}
              </button>
              <p style={S.formNote}>No credit card. No spam. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={S.footer}>
        <div style={S.footerInner}>
          <div style={S.logo}>
            <div style={S.logoMark}>⚖</div>
            <span style={{ ...S.logoText }}>TraderPoise</span>
          </div>
          <p style={S.footerTagline}>Trade with discipline. Win with composure.</p>
          <p style={S.footerCopy}>© 2025 TraderPoise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================
const G = { gold: "#f0c040", bg: "#0a0a0f", card: "#12121e", dark: "#0d0d18", border: "#1e1e2e", text: "#e0e0e0", muted: "#555", sub: "#888", green: "#4ade80", red: "#f87171", blue: "#60a5fa" };

const S = {
  page: { fontFamily: "'Inter', -apple-system, sans-serif", background: G.bg, color: G.text, minHeight: "100vh" },

  // Nav
  nav: { position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.96)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${G.border}`, padding: "0 32px" },
  navInner: { maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoMark: { width: 34, height: 34, background: `linear-gradient(135deg, ${G.gold}, #c09020)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 },
  logoText: { fontSize: 20, fontWeight: 800, color: G.gold, letterSpacing: "-0.5px" },
  navLinks: { display: "flex", alignItems: "center", gap: 36 },
  navLink: { color: G.sub, textDecoration: "none", fontSize: 14, fontWeight: 500 },
  navCta: { background: G.gold, color: G.bg, padding: "9px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" },
  menuBtn: { display: "none", background: "none", border: "none", color: G.gold, fontSize: 22, cursor: "pointer" },
  mobileMenu: { display: "flex", flexDirection: "column", padding: "12px 0", borderTop: `1px solid ${G.border}` },
  mobileLink: { color: G.sub, textDecoration: "none", padding: "10px 0", fontSize: 15 },

  // Hero
  hero: { padding: "80px 32px 60px", background: `radial-gradient(ellipse at 60% 0%, #1a1400 0%, ${G.bg} 60%)` },
  heroInner: { maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" },
  heroLeft: { maxWidth: 560 },
  heroPill: { display: "inline-flex", alignItems: "center", gap: 8, background: "#1a1400", border: `1px solid #3a2a00`, color: G.gold, padding: "7px 16px", borderRadius: 20, fontSize: 13, marginBottom: 28, fontWeight: 500 },
  pillDot: { width: 7, height: 7, borderRadius: "50%", background: G.green, boxShadow: `0 0 6px ${G.green}`, flexShrink: 0 },
  heroTitle: { fontSize: "clamp(32px, 4.5vw, 54px)", fontWeight: 900, lineHeight: 1.1, color: "#fff", marginBottom: 20, letterSpacing: "-1.5px" },
  heroAccent: { color: G.gold },
  heroSub: { fontSize: 17, color: G.sub, lineHeight: 1.7, marginBottom: 36 },
  heroActions: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 },
  btnPrimary: { background: G.gold, color: G.bg, padding: "14px 30px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" },
  btnGhost: { color: G.gold, padding: "14px 4px", fontWeight: 600, fontSize: 15, textDecoration: "none" },
  trustRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  trustTag: { fontSize: 11, fontWeight: 600, color: G.muted, background: "#111", border: `1px solid #1a1a2e`, padding: "4px 12px", borderRadius: 20 },

  // Dashboard preview
  heroRight: { position: "relative" },
  dashPreview: { background: "#10101a", border: `1px solid #2a2a3a`, borderRadius: 20, padding: 20, boxShadow: "0 40px 80px rgba(0,0,0,0.6)" },
  dashHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  dashTitle: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#fff" },
  dashDot: { width: 8, height: 8, borderRadius: "50%", background: G.green, boxShadow: `0 0 6px ${G.green}` },
  dashBadge: { fontSize: 10, fontWeight: 800, color: G.green, background: "#0a2a0a", border: `1px solid #1a4a1a`, padding: "3px 10px", borderRadius: 20 },
  miniStats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 },
  miniStat: { background: "#0d0d18", borderRadius: 10, padding: "10px 12px" },
  miniStatLabel: { fontSize: 10, color: G.muted, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  miniStatValue: { fontSize: 16, fontWeight: 800 },
  chartTabs: { display: "flex", gap: 6, marginBottom: 12 },
  chartTab: { padding: "5px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: "#1a1a2e", color: G.sub },
  chartTabActive: { background: "#2a2a1a", color: G.gold },
  chartArea: { background: "#0d0d18", borderRadius: 12, padding: "12px 12px 0", marginBottom: 12 },
  chartLabels: { display: "flex", justifyContent: "space-between", padding: "4px 0 8px" },
  chartLabel: { fontSize: 9, color: "#333" },
  aiCard: { display: "flex", gap: 12, alignItems: "flex-start", background: "#0d0a1a", border: `1px solid #2a1a4a`, borderRadius: 12, padding: 12, marginBottom: 12 },
  aiCardIcon: { fontSize: 18, flexShrink: 0 },
  aiCardTitle: { fontSize: 10, fontWeight: 700, color: "#a78bfa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 },
  aiCardText: { fontSize: 11, color: "#aaa", lineHeight: 1.5 },
  miniTrades: { display: "flex", flexDirection: "column", gap: 6 },
  miniTrade: { display: "flex", alignItems: "center", gap: 10, background: "#0d0d18", borderRadius: 8, padding: "8px 10px", fontSize: 12 },

  // Stats bar
  statsBar: { background: "#0d0d18", borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}`, padding: "40px 32px" },
  statsInner: { maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 },
  statItem: { textAlign: "center" },
  statValue: { fontSize: 40, fontWeight: 900, color: G.gold, letterSpacing: "-1px", marginBottom: 8 },
  statLabel: { fontSize: 13, color: G.muted, lineHeight: 1.4 },

  // Shared
  container: { maxWidth: 1200, margin: "0 auto" },
  sectionEyebrow: { fontSize: 11, fontWeight: 800, letterSpacing: 2.5, color: G.gold, textTransform: "uppercase", marginBottom: 12 },
  sectionTitle: { fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 48, letterSpacing: "-1px" },

  // Problem
  problem: { padding: "100px 32px", background: G.bg },
  problemGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 },
  problemCard: { background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 28, transition: "border-color 0.2s" },
  problemIcon: { fontSize: 36, marginBottom: 16 },
  problemCardTitle: { fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 10 },
  problemCardDesc: { fontSize: 14, color: G.sub, lineHeight: 1.65 },

  // Analytics
  analytics: { padding: "100px 32px", background: G.dark },
  analyticsDesc: { fontSize: 17, color: G.sub, maxWidth: 560, lineHeight: 1.7, marginBottom: 48, marginTop: -24 },
  analyticsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  analyticsCard: { background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 24 },
  analyticsCardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 10 },
  analyticsCardTitle: { fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 },
  analyticsCardSub: { fontSize: 12, color: G.muted },
  analyticsChartLabels: { display: "flex", justifyContent: "space-between", marginTop: 8 },
  trendBadge: { padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" },
  analyticsMetrics: { display: "flex", flexDirection: "column", gap: 12 },
  metricCard: { background: G.card, border: `1px solid ${G.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 },
  metricIcon: { fontSize: 22, flexShrink: 0 },
  metricLabel: { fontSize: 11, color: G.muted, marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 },
  metricValue: { fontSize: 16, fontWeight: 700, color: "#fff" },
  metricChange: { fontSize: 11, fontWeight: 600, marginLeft: "auto", textAlign: "right", flexShrink: 0 },
  emotionCard: { background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 24 },

  // Features
  features: { padding: "100px 32px", background: G.bg },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  featureCard: { background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 28, position: "relative" },
  featureCardIcon: { fontSize: 32, marginBottom: 16 },
  featureCardTitle: { fontSize: 16, fontWeight: 700, color: "#fff", marginBottom: 10 },
  featureCardDesc: { fontSize: 14, color: G.sub, lineHeight: 1.65 },
  proLabel: { position: "absolute", top: 16, right: 16, fontSize: 10, fontWeight: 800, color: G.bg, background: G.gold, padding: "2px 8px", borderRadius: 20 },

  // Prop
  prop: { padding: "100px 32px", background: G.dark },
  propInner: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" },
  propLeft: {},
  propDesc: { fontSize: 16, color: G.sub, lineHeight: 1.7, marginBottom: 32, marginTop: -24 },
  propFeatures: { display: "flex", flexDirection: "column", gap: 12 },
  propFeatureItem: { fontSize: 14, color: "#ccc", display: "flex", alignItems: "center", gap: 10 },
  propCheck: { color: G.gold, fontWeight: 700 },
  propRight: {},
  firmGrid: { display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  firmTag: { background: G.card, border: `1px solid #2e2e4e`, color: G.gold, padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600 },
  challengeCard: { background: G.card, border: `1px solid ${G.border}`, borderRadius: 16, padding: 24 },
  challengeHeader: { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 20, paddingBottom: 12, borderBottom: `1px solid ${G.border}` },
  challengeAI: { background: "#0d0a1a", border: `1px solid #2a1a4a`, borderRadius: 10, padding: 12, fontSize: 12, color: "#a78bfa", marginTop: 4 },

  // Pricing
  pricing: { padding: "100px 32px", background: G.bg },
  pricingGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, maxWidth: 820, margin: "0 auto" },
  pricingCard: { background: G.card, border: `1px solid ${G.border}`, borderRadius: 20, padding: 36 },
  pricingCardPro: { background: "#12100a", border: `2px solid ${G.gold}`, borderRadius: 20, padding: 36, position: "relative" },
  popularBadge: { position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: G.gold, color: G.bg, fontSize: 11, fontWeight: 800, padding: "4px 18px", borderRadius: 20, whiteSpace: "nowrap" },
  planTier: { fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 },
  planPrice: { fontSize: 44, fontWeight: 900, color: "#fff", marginBottom: 6 },
  planPer: { fontSize: 16, fontWeight: 400, color: G.muted },
  planTagline: { fontSize: 13, color: G.muted, marginBottom: 24, lineHeight: 1.5 },
  planDivider: { height: 1, background: G.border, marginBottom: 24 },
  planItem: { fontSize: 13, color: "#bbb", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 8 },
  checkGreen: { color: G.green, fontWeight: 700, flexShrink: 0 },
  checkGold: { color: G.gold, fontWeight: 700, flexShrink: 0 },
  btnPlanFree: { display: "block", textAlign: "center", marginTop: 28, padding: "13px", borderRadius: 10, border: `1px solid ${G.border}`, color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 14 },
  btnPlanPro: { display: "block", textAlign: "center", marginTop: 28, padding: "13px", borderRadius: 10, background: G.gold, color: G.bg, textDecoration: "none", fontWeight: 700, fontSize: 14 },
  earlyBird: { textAlign: "center", fontSize: 12, color: G.muted, marginTop: 12 },

  // Waitlist
  waitlist: { padding: "100px 32px", background: G.dark },
  waitlistInner: { maxWidth: 640, margin: "0 auto", textAlign: "center" },
  waitlistTitle: { fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, color: "#fff", marginBottom: 16, letterSpacing: "-1px" },
  waitlistSub: { fontSize: 16, color: G.sub, marginBottom: 40, lineHeight: 1.7 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  formRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  input: { padding: "14px 16px", borderRadius: 10, border: `1px solid #2a2a3a`, background: G.card, color: "#fff", fontSize: 14, outline: "none" },
  select: { padding: "14px 16px", borderRadius: 10, border: `1px solid #2a2a3a`, background: G.card, color: "#fff", fontSize: 14, outline: "none" },
  errorBox: { background: "#2a0a0a", border: `1px solid #5a1a1a`, color: "#ff6b6b", padding: "10px 16px", borderRadius: 8, fontSize: 13 },
  btnSubmit: { padding: "16px", borderRadius: 10, background: G.gold, color: G.bg, fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" },
  formNote: { fontSize: 12, color: "#444" },
  successBox: { background: "#0a1a0a", border: `1px solid #1a4a1a`, borderRadius: 16, padding: 48, textAlign: "center" },
  successTitle: { fontSize: 24, fontWeight: 700, color: G.green, marginBottom: 8 },
  successSub: { fontSize: 14, color: G.sub, lineHeight: 1.6 },

  // Footer
  footer: { background: "#07070f", padding: "48px 32px", textAlign: "center", borderTop: `1px solid ${G.border}` },
  footerInner: { maxWidth: 400, margin: "0 auto" },
  footerTagline: { color: "#444", fontSize: 13, marginTop: 12, marginBottom: 8 },
  footerCopy: { color: "#2a2a2a", fontSize: 12 },

  btnPrimary: { background: G.gold, color: G.bg, padding: "14px 30px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none", display: "inline-block" },
  btnGhost: { color: G.gold, padding: "14px 4px", fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-block" },
};
