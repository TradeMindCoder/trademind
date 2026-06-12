import { useState } from "react";

const SUPABASE_URL = "https://qghbdzmefvcgmwacswuy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnaGJkem1lZnZjZ213YWNzd3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2ODMxNjgsImV4cCI6MjA5NjI1OTE2OH0.5ktqPt98j9sH6YLBlYHu6pJPbLui8Ygxu95As1ph7RA";

export default function Landing() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [traderType, setTraderType] = useState("forex");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div style={styles.page}>
      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚖</span>
            <span style={styles.logoText}>TraderPoise</span>
          </div>
          <div style={styles.navLinks}>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#pricing" style={styles.navLink}>Pricing</a>
            <a href="#prop" style={styles.navLink}>Prop Firms</a>
            <a href="#waitlist" style={styles.navCta}>Join Waitlist</a>
          </div>
          <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>
        {menuOpen && (
          <div style={styles.mobileMenu}>
            <a href="#features" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#pricing" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#prop" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Prop Firms</a>
            <a href="#waitlist" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Join Waitlist</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBadge}>🧠 AI-Powered Trading Psychology Platform</div>
        <h1 style={styles.heroTitle}>
          Trade With <span style={styles.accent}>Poise.</span>
          <br />Win With Discipline.
        </h1>
        <p style={styles.heroSub}>
          Most traders lose not because of bad strategy — but because of unmanaged psychology.
          TraderPoise is the AI platform that fixes the 80% of trading nobody talks about.
        </p>
        <div style={styles.heroButtons}>
          <a href="#waitlist" style={styles.btnPrimary}>Join the Waitlist — Free</a>
          <a href="#features" style={styles.btnSecondary}>See Features</a>
        </div>
        <div style={styles.heroStats}>
          {[["80%", "of losses are psychological"], ["14+", "years of trading insight built in"], ["All", "asset classes supported"]].map(([num, label]) => (
            <div key={num} style={styles.heroStat}>
              <span style={styles.statNum}>{num}</span>
              <span style={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEM */}
      <section style={styles.problem}>
        <div style={styles.container}>
          <div style={styles.sectionLabel}>THE REAL PROBLEM</div>
          <h2 style={styles.sectionTitle}>You know what to do.<br />You just don't do it.</h2>
          <div style={styles.problemGrid}>
            {[
              { icon: "😤", title: "Revenge Trading", desc: "One loss becomes five because emotion takes over. You know it's wrong — you do it anyway." },
              { icon: "😨", title: "Early Exits", desc: "You cut winners short because fear overrides your plan. Then watch the trade hit your target without you." },
              { icon: "📈", title: "Overleveraging", desc: "Confidence after a win turns into overexposure. One trade wipes a week of gains." },
              { icon: "🔄", title: "Breaking Rules", desc: "You write rules. You break rules. The cycle repeats because nothing holds you accountable." },
            ].map((item) => (
              <div key={item.title} style={styles.problemCard}>
                <div style={styles.problemIcon}>{item.icon}</div>
                <h3 style={styles.problemTitle}>{item.title}</h3>
                <p style={styles.problemDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.features}>
        <div style={styles.container}>
          <div style={styles.sectionLabel}>WHAT TRADERPOISE DOES</div>
          <h2 style={styles.sectionTitle}>Every tool your trading mind needs</h2>

          {/* Feature blocks */}
          {[
            {
              icon: "🧘",
              title: "Pre-Trade Readiness Check",
              desc: "Before you place a single trade, TraderPoise AI evaluates your mental state. Answer 7 questions — get a readiness score. Trade only when you're truly ready.",
              pro: false,
              tag: "Psychology",
            },
            {
              icon: "🔍",
              title: "AI Post-Session Review",
              desc: "After every session, AI analyses your trades, emotions, and decisions. Not just P&L — it tells you exactly why you made the decisions you made and what to fix.",
              pro: false,
              tag: "AI Analysis",
            },
            {
              icon: "⚠️",
              title: "Revenge Trade Detection",
              desc: "TraderPoise automatically flags any re-entry within 10 minutes of a loss. See your revenge trade history. Break the pattern with data, not willpower alone.",
              pro: false,
              tag: "Discipline",
            },
            {
              icon: "📊",
              title: "Discipline Score",
              desc: "A single weekly score (0–100) built from rule adherence, emotional control, and consistency. Your trading credit score — improve it every week.",
              pro: false,
              tag: "Performance",
            },
            {
              icon: "📅",
              title: "P&L Calendar with Mood Overlay",
              desc: "See every trading day colour-coded by profit and emotional state. Spot the days you trade best — and worst. Time your sessions around your peak psychology.",
              pro: false,
              tag: "Analytics",
            },
            {
              icon: "💡",
              title: "Why I Lost — AI Diagnosis",
              desc: "Describe a losing session in plain English. AI diagnoses the root psychological cause and gives you a specific, actionable fix. Not generic advice — your diagnosis.",
              pro: true,
              tag: "Pro Feature",
            },
            {
              icon: "🌐",
              title: "DXY Morning Briefing",
              desc: "Every morning, AI reads the Dollar Index and gives you EURUSD and GBPUSD directional bias. Start every session anchored to macro reality, not guesswork.",
              pro: true,
              tag: "Pro Feature",
            },
            {
              icon: "🏆",
              title: "Prop Firm Challenge Mode",
              desc: "Dedicated dashboard for E8, FTMO, Apex, and MyFundedFX challenges. Real-time drawdown tracking with psychological warnings before you breach rules.",
              pro: true,
              tag: "Pro Feature",
            },
            {
              icon: "🔢",
              title: "Risk & Lot Size Calculator",
              desc: "Calculate exact lot sizes, risk amounts, pip values, and R:R ratios instantly. Built for forex, stocks, and indices. Save your calculations to your trade log.",
              pro: false,
              tag: "Tools",
            },
            {
              icon: "🔥",
              title: "Discipline Streak Tracker",
              desc: "Track consecutive days of rule adherence. Build streaks. Break records. Gamified discipline that makes consistency feel rewarding, not restrictive.",
              pro: false,
              tag: "Motivation",
            },
          ].map((f) => (
            <div key={f.title} style={styles.featureRow}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <div style={styles.featureContent}>
                <div style={styles.featureMeta}>
                  <span style={{ ...styles.featureTag, ...(f.pro ? styles.featureTagPro : {}) }}>{f.tag}</span>
                  {f.pro && <span style={styles.proBadge}>PRO</span>}
                </div>
                <h3 style={styles.featureTitle}>{f.title}</h3>
                <p style={styles.featureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROP FIRM SECTION */}
      <section id="prop" style={styles.propSection}>
        <div style={styles.container}>
          <div style={styles.sectionLabel}>PROP FIRM TRADERS</div>
          <h2 style={styles.sectionTitle}>Built for funded traders<br />who want to stay funded</h2>
          <p style={styles.propDesc}>
            The biggest reason traders fail prop firm challenges isn't strategy. It's psychology under pressure.
            TraderPoise Challenge Mode keeps you mentally accountable from Day 1 to funded.
          </p>
          <div style={styles.firmGrid}>
            {["E8 Funding", "FTMO", "Apex Trader", "MyFundedFX", "The Funded Trader", "True Forex Funds"].map((firm) => (
              <div key={firm} style={styles.firmBadge}>{firm}</div>
            ))}
          </div>
          <div style={styles.propFeatures}>
            {[
              "Real-time daily drawdown monitoring",
              "Psychological warning at 70% of max loss",
              "Challenge phase progression tracker",
              "Discipline score tied to challenge rules",
              "Session limits with AI override warnings",
              "Post-challenge funded account mode",
            ].map((f) => (
              <div key={f} style={styles.propFeature}>
                <span style={styles.checkIcon}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={styles.pricing}>
        <div style={styles.container}>
          <div style={styles.sectionLabel}>SIMPLE PRICING</div>
          <h2 style={styles.sectionTitle}>Start free. Go pro when ready.</h2>
          <div style={styles.pricingGrid}>
            {/* Free */}
            <div style={styles.pricingCard}>
              <div style={styles.planName}>Free</div>
              <div style={styles.planPrice}>$0<span style={styles.planPer}>/month</span></div>
              <p style={styles.planDesc}>Everything you need to start building trading discipline</p>
              <div style={styles.planDivider} />
              {[
                "Trading Journal (unlimited entries)",
                "Emotion Tagging",
                "Pre-Trade Readiness Check",
                "AI Post-Session Review (5/month)",
                "Revenge Trade Detection",
                "Discipline Score",
                "Risk & Lot Size Calculator",
                "P&L Calendar",
                "Prop Firm Tracker (1 challenge)",
                "Streak Tracker",
                "MT4/MT5 CSV Import",
              ].map((f) => (
                <div key={f} style={styles.planFeature}><span style={styles.checkGreen}>✓</span> {f}</div>
              ))}
              <a href="#waitlist" style={styles.btnPlanFree}>Join Waitlist Free</a>
            </div>

            {/* Pro */}
            <div style={{ ...styles.pricingCard, ...styles.pricingCardPro }}>
              <div style={styles.popularBadge}>MOST POPULAR</div>
              <div style={{ ...styles.planName, color: "#fff" }}>Pro</div>
              <div style={{ ...styles.planPrice, color: "#f0c040" }}>$24<span style={{ ...styles.planPer, color: "#ccc" }}>/month</span></div>
              <p style={{ ...styles.planDesc, color: "#ccc" }}>For serious traders and prop firm challengers</p>
              <div style={{ ...styles.planDivider, background: "#333" }} />
              {[
                "Everything in Free",
                "Unlimited AI Post-Session Reviews",
                "Why I Lost — AI Diagnosis",
                "DXY Morning Briefing (daily)",
                "EURUSD & GBPUSD Bias Reports",
                "Prop Firm Challenge Mode (unlimited)",
                "AI Weekly Report Card",
                "Plan Adherence Score",
                "Advanced Pattern Recognition",
                "Priority Support",
                "Early access to new features",
              ].map((f) => (
                <div key={f} style={{ ...styles.planFeature, color: "#eee" }}><span style={styles.checkGold}>✓</span> {f}</div>
              ))}
              <a href="#waitlist" style={styles.btnPlanPro}>Join Waitlist — Pro Early Access</a>
            </div>
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" style={styles.waitlist}>
        <div style={styles.waitlistInner}>
          <div style={styles.sectionLabel}>JOIN THE WAITLIST</div>
          <h2 style={styles.waitlistTitle}>Be first when TraderPoise launches</h2>
          <p style={styles.waitlistDesc}>
            Join traders already on the waitlist. Pro early access members get 40% off their first 3 months.
          </p>
          {submitted ? (
            <div style={styles.successBox}>
              <div style={styles.successIcon}>🎉</div>
              <h3 style={styles.successTitle}>You're on the list!</h3>
              <p style={styles.successDesc}>We'll notify you the moment TraderPoise launches. Trade with poise until then.</p>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} style={styles.form}>
              <input
                style={styles.input}
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                style={styles.input}
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <select
                style={styles.input}
                value={traderType}
                onChange={(e) => setTraderType(e.target.value)}
              >
                <option value="forex">Forex Trader</option>
                <option value="stocks">Stocks Trader</option>
                <option value="crypto">Crypto Trader</option>
                <option value="prop_firm">Prop Firm Trader</option>
                <option value="all">All of the above</option>
              </select>
              {error && <div style={styles.errorBox}>{error}</div>}
              <button type="submit" style={styles.btnSubmit} disabled={loading}>
                {loading ? "Joining..." : "Join Waitlist — It's Free"}
              </button>
              <p style={styles.formNote}>No credit card required. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>⚖</span>
            <span style={{ ...styles.logoText, color: "#fff" }}>TraderPoise</span>
          </div>
          <p style={styles.footerTagline}>Trade with discipline. Win with composure.</p>
          <p style={styles.footerCopy}>© 2025 TraderPoise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'Inter', -apple-system, sans-serif", background: "#0a0a0f", color: "#e0e0e0", minHeight: "100vh" },
  nav: { position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1e1e2e", padding: "0 24px" },
  navInner: { maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: { fontSize: 22, color: "#f0c040" },
  logoText: { fontSize: 20, fontWeight: 700, color: "#f0c040", letterSpacing: "-0.5px" },
  navLinks: { display: "flex", alignItems: "center", gap: 32 },
  navLink: { color: "#aaa", textDecoration: "none", fontSize: 14, transition: "color 0.2s" },
  navCta: { background: "#f0c040", color: "#0a0a0f", padding: "8px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" },
  menuBtn: { display: "none", background: "none", border: "none", color: "#f0c040", fontSize: 22, cursor: "pointer" },
  mobileMenu: { display: "flex", flexDirection: "column", padding: "12px 0", borderTop: "1px solid #1e1e2e" },
  mobileLink: { color: "#aaa", textDecoration: "none", padding: "10px 0", fontSize: 15 },
  hero: { textAlign: "center", padding: "100px 24px 80px", maxWidth: 800, margin: "0 auto" },
  heroBadge: { display: "inline-block", background: "#1a1a2e", border: "1px solid #2e2e4e", color: "#f0c040", padding: "6px 16px", borderRadius: 20, fontSize: 13, marginBottom: 24 },
  heroTitle: { fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, lineHeight: 1.1, color: "#fff", marginBottom: 20, letterSpacing: "-1px" },
  accent: { color: "#f0c040" },
  heroSub: { fontSize: 18, color: "#888", lineHeight: 1.6, marginBottom: 36, maxWidth: 600, margin: "0 auto 36px" },
  heroButtons: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 },
  btnPrimary: { background: "#f0c040", color: "#0a0a0f", padding: "14px 32px", borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: "none", display: "inline-block" },
  btnSecondary: { background: "transparent", color: "#f0c040", padding: "14px 32px", borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: "none", border: "1px solid #f0c040", display: "inline-block" },
  heroStats: { display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" },
  heroStat: { display: "flex", flexDirection: "column", alignItems: "center" },
  statNum: { fontSize: 32, fontWeight: 800, color: "#f0c040" },
  statLabel: { fontSize: 13, color: "#666", marginTop: 4 },
  problem: { background: "#0d0d18", padding: "80px 24px" },
  container: { maxWidth: 1100, margin: "0 auto" },
  sectionLabel: { fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#f0c040", textTransform: "uppercase", marginBottom: 12 },
  sectionTitle: { fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 48, letterSpacing: "-0.5px" },
  problemGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 },
  problemCard: { background: "#12121e", border: "1px solid #1e1e2e", borderRadius: 16, padding: 28 },
  problemIcon: { fontSize: 32, marginBottom: 12 },
  problemTitle: { fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 },
  problemDesc: { fontSize: 14, color: "#777", lineHeight: 1.6 },
  features: { padding: "80px 24px", background: "#0a0a0f" },
  featureRow: { display: "flex", gap: 24, alignItems: "flex-start", padding: "28px 0", borderBottom: "1px solid #1a1a2e" },
  featureIcon: { fontSize: 36, minWidth: 56, textAlign: "center" },
  featureContent: { flex: 1 },
  featureMeta: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 },
  featureTag: { fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#888", background: "#1a1a2e", padding: "3px 10px", borderRadius: 20, textTransform: "uppercase" },
  featureTagPro: { background: "#2a1a00", color: "#f0c040" },
  proBadge: { fontSize: 10, fontWeight: 800, color: "#0a0a0f", background: "#f0c040", padding: "2px 8px", borderRadius: 20 },
  featureTitle: { fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 },
  featureDesc: { fontSize: 15, color: "#777", lineHeight: 1.6 },
  propSection: { background: "#0d0d18", padding: "80px 24px" },
  propDesc: { fontSize: 18, color: "#777", maxWidth: 600, lineHeight: 1.6, marginBottom: 40 },
  firmGrid: { display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 40 },
  firmBadge: { background: "#12121e", border: "1px solid #2e2e4e", color: "#f0c040", padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600 },
  propFeatures: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 },
  propFeature: { fontSize: 15, color: "#bbb", display: "flex", alignItems: "center", gap: 10 },
  checkIcon: { color: "#f0c040", fontWeight: 700, fontSize: 16 },
  pricing: { padding: "80px 24px", background: "#0a0a0f" },
  pricingGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32, maxWidth: 800, margin: "0 auto" },
  pricingCard: { background: "#12121e", border: "1px solid #1e1e2e", borderRadius: 20, padding: 36, position: "relative" },
  pricingCardPro: { background: "#12100a", border: "2px solid #f0c040" },
  popularBadge: { position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#f0c040", color: "#0a0a0f", fontSize: 11, fontWeight: 800, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap" },
  planName: { fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 8 },
  planPrice: { fontSize: 44, fontWeight: 800, color: "#fff", marginBottom: 8 },
  planPer: { fontSize: 16, fontWeight: 400, color: "#666" },
  planDesc: { fontSize: 14, color: "#666", marginBottom: 24, lineHeight: 1.5 },
  planDivider: { height: 1, background: "#1e1e2e", marginBottom: 24 },
  planFeature: { fontSize: 14, color: "#bbb", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 8 },
  checkGreen: { color: "#4ade80", fontWeight: 700, marginTop: 1 },
  checkGold: { color: "#f0c040", fontWeight: 700, marginTop: 1 },
  btnPlanFree: { display: "block", textAlign: "center", marginTop: 28, padding: "14px", borderRadius: 10, border: "1px solid #2e2e4e", color: "#fff", textDecoration: "none", fontWeight: 600, fontSize: 15 },
  btnPlanPro: { display: "block", textAlign: "center", marginTop: 28, padding: "14px", borderRadius: 10, background: "#f0c040", color: "#0a0a0f", textDecoration: "none", fontWeight: 700, fontSize: 15 },
  waitlist: { padding: "80px 24px", background: "#0d0d18" },
  waitlistInner: { maxWidth: 520, margin: "0 auto", textAlign: "center" },
  waitlistTitle: { fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#fff", marginBottom: 16 },
  waitlistDesc: { fontSize: 16, color: "#777", marginBottom: 40, lineHeight: 1.6 },
  form: { display: "flex", flexDirection: "column", gap: 14 },
  input: { padding: "14px 16px", borderRadius: 10, border: "1px solid #2e2e4e", background: "#12121e", color: "#fff", fontSize: 15, outline: "none" },
  errorBox: { background: "#2a0a0a", border: "1px solid #5a1a1a", color: "#ff6b6b", padding: "10px 16px", borderRadius: 8, fontSize: 14 },
  btnSubmit: { padding: "16px", borderRadius: 10, background: "#f0c040", color: "#0a0a0f", fontWeight: 700, fontSize: 16, border: "none", cursor: "pointer" },
  formNote: { fontSize: 12, color: "#555" },
  successBox: { background: "#0a1a0a", border: "1px solid #1a4a1a", borderRadius: 16, padding: 40 },
  successIcon: { fontSize: 48, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: 700, color: "#4ade80", marginBottom: 8 },
  successDesc: { fontSize: 15, color: "#777", lineHeight: 1.6 },
  footer: { background: "#070710", padding: "48px 24px", textAlign: "center", borderTop: "1px solid #1a1a2e" },
  footerInner: { maxWidth: 400, margin: "0 auto" },
  footerTagline: { color: "#555", fontSize: 14, marginTop: 12, marginBottom: 8 },
  footerCopy: { color: "#333", fontSize: 12 },
};
