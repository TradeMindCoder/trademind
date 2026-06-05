import { useState, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────
   TRADEMIND v4  —  Refined Dark Luxury Trading Terminal
   Design: Deep obsidian canvas, electric violet glow accents,
   Bebas Neue display + Lexend body. Atmospheric depth with
   radial glows, layered cards, animated discipline ring.
   Onboarding: name + prop firm toggle (actually changes sidebar)
───────────────────────────────────────────────────────────────── */

const G = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lexend:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#06080f;--bg2:#090c18;--bg3:#0c1020;--sf:#0f1526;
  --c1:#131c2e;--c2:#172035;--bd:#1c2d47;--bd2:#223452;
  --v:#7c5cfc;--vd:rgba(124,92,252,.13);--vg:rgba(124,92,252,.28);--vl:#a78bfa;
  --g:#10b981;--gd:rgba(16,185,129,.13);
  --r:#ef4444;--rd:rgba(239,68,68,.13);
  --a:#f59e0b;--ad:rgba(245,158,11,.13);
  --s:#38bdf8;--sd:rgba(56,189,248,.13);
  --tx:#dde6f5;--t2:#7a90b8;--t3:#334466;
  --fd:'Bebas Neue',sans-serif;--fb:'Lexend',sans-serif;
  --rr:18px;--rm:12px;--rs:8px;
}
html,body{height:100%;overflow:hidden}
body{background:var(--bg);color:var(--tx);font-family:var(--fb);font-weight:300}
*{font-family:var(--fb)}
::selection{background:var(--vd);color:var(--vl)}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:2px}

/* ── ONBOARDING ── */
.ob{position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;padding:20px;background:var(--bg)}
.ob::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 40%,rgba(124,92,252,.18),transparent);pointer-events:none}
.ob::after{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 50% 40% at 70% 70%,rgba(16,185,129,.08),transparent);pointer-events:none}
.ob-box{position:relative;z-index:1;background:linear-gradient(145deg,var(--c1),var(--bg3));border:1px solid var(--bd2);border-radius:24px;padding:44px 40px;width:100%;max-width:460px;box-shadow:0 40px 80px rgba(0,0,0,.6),0 0 0 1px rgba(124,92,252,.1),inset 0 1px 0 rgba(255,255,255,.04);animation:obIn .5s cubic-bezier(.2,0,.2,1)}
@keyframes obIn{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:none}}
.ob-logo{font-family:var(--fd);font-size:16px;letter-spacing:4px;color:var(--vl);text-transform:uppercase;margin-bottom:32px;opacity:.7}
.ob-h{font-family:var(--fd);font-size:36px;letter-spacing:2px;color:var(--tx);line-height:1.1;margin-bottom:8px}
.ob-sub{font-size:13px;color:var(--t2);line-height:1.7;margin-bottom:28px}
.ob-inp{width:100%;background:var(--sf);border:1.5px solid var(--bd2);border-radius:var(--rm);padding:14px 18px;font-family:var(--fb);font-size:16px;font-weight:500;color:var(--tx);outline:none;transition:border-color .2s,box-shadow .2s;margin-bottom:20px}
.ob-inp:focus{border-color:var(--v);box-shadow:0 0 0 3px var(--vd)}
.ob-inp::placeholder{color:var(--t3)}
.ob-q{font-size:14px;font-weight:500;color:var(--tx);margin-bottom:14px;line-height:1.5}
.ob-cards{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:24px}
.ob-card{background:var(--sf);border:2px solid var(--bd);border-radius:var(--rm);padding:16px 14px;cursor:pointer;transition:all .2s;text-align:left}
.ob-card:hover{border-color:var(--bd2);background:var(--c1)}
.ob-card.on{border-color:var(--v);background:var(--vd);box-shadow:0 0 0 1px var(--vd),inset 0 1px 0 rgba(124,92,252,.15)}
.ob-card-icon{font-size:22px;margin-bottom:8px}
.ob-card-title{font-size:13px;font-weight:600;color:var(--tx);margin-bottom:3px}
.ob-card-sub{font-size:11px;color:var(--t2);line-height:1.5}
.ob-btn{width:100%;background:linear-gradient(135deg,var(--v),#5b21b6);border:none;border-radius:var(--rm);padding:15px;font-family:var(--fb);font-size:15px;font-weight:700;color:#fff;cursor:pointer;transition:all .2s;letter-spacing:.3px;box-shadow:0 4px 20px var(--vg)}
.ob-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px var(--vg)}
.ob-btn:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}

/* ── SHELL ── */
.shell{display:flex;height:100vh;overflow:hidden}

/* ── SIDEBAR ── */
.sb{width:232px;background:linear-gradient(180deg,var(--bg2),var(--bg));border-right:1px solid var(--bd);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;transition:transform .3s;position:relative}
.sb::before{content:'';position:absolute;top:0;left:0;right:0;height:200px;background:radial-gradient(ellipse at 50% 0%,rgba(124,92,252,.12),transparent);pointer-events:none}
.sb-logo{padding:24px 20px 18px;border-bottom:1px solid var(--bd);position:relative}
.sb-brand{font-family:var(--fd);font-size:28px;letter-spacing:3px;background:linear-gradient(135deg,#fff,var(--vl));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
.sb-tagline{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:var(--t3);margin-top:4px}
.sb-chip{margin:14px 14px 0;background:linear-gradient(135deg,var(--vd),rgba(124,92,252,.06));border:1px solid rgba(124,92,252,.2);border-radius:var(--rm);padding:10px 14px;position:relative;overflow:hidden}
.sb-chip::after{content:'';position:absolute;top:-10px;right:-10px;width:50px;height:50px;background:radial-gradient(circle,var(--vg),transparent);border-radius:50%}
.sb-chip-label{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--vl);margin-bottom:4px}
.sb-chip-name{font-size:15px;font-weight:700;color:var(--tx)}
.sb-chip-id{font-size:10px;color:var(--t3);margin-top:2px;font-family:monospace;letter-spacing:1px}
.sb-nav{flex:1;padding:14px 10px;display:flex;flex-direction:column;gap:2px}
.ni{display:flex;align-items:center;gap:11px;padding:11px 13px;border-radius:var(--rm);cursor:pointer;transition:all .18s;color:var(--t2);font-size:13px;font-weight:400;border:none;background:none;width:100%;text-align:left;position:relative}
.ni:hover{background:rgba(255,255,255,.04);color:var(--tx)}
.ni.on{background:var(--vd);color:var(--vl);font-weight:600}
.ni.on::before{content:'';position:absolute;left:0;top:20%;bottom:20%;width:2px;background:var(--v);border-radius:0 2px 2px 0}
.ni-ic{font-size:15px;width:18px;text-align:center;flex-shrink:0}
.ni-badge{margin-left:auto;background:var(--v);color:#fff;font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px}
.sb-div{height:1px;background:var(--bd);margin:8px 4px;opacity:.5}
.sb-foot{padding:12px;border-top:1px solid var(--bd)}
.sb-up{background:linear-gradient(135deg,var(--v),#4c1d95);border-radius:var(--rm);padding:11px;font-size:13px;font-weight:700;color:#fff;text-align:center;cursor:pointer;border:none;width:100%;letter-spacing:.3px;transition:all .2s;box-shadow:0 4px 16px var(--vg)}
.sb-up:hover{transform:translateY(-1px);box-shadow:0 6px 20px var(--vg)}

/* ── MAIN ── */
.main{flex:1;overflow-y:auto;background:var(--bg);display:flex;flex-direction:column;position:relative}
.main::before{content:'';position:fixed;top:0;right:0;width:600px;height:600px;background:radial-gradient(ellipse at 100% 0%,rgba(124,92,252,.06),transparent);pointer-events:none;z-index:0}

/* ── TOPBAR ── */
.topbar{display:flex;align-items:center;justify-content:space-between;padding:18px 28px;border-bottom:1px solid var(--bd);background:rgba(6,8,15,.85);backdrop-filter:blur(16px);position:sticky;top:0;z-index:50;gap:12px;flex-wrap:wrap}
.ptitle{font-family:var(--fd);font-size:28px;letter-spacing:3px;background:linear-gradient(135deg,var(--tx),var(--t2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.tbr{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.streak-pill{display:flex;align-items:center;gap:6px;background:linear-gradient(135deg,var(--ad),rgba(245,158,11,.06));border:1px solid rgba(245,158,11,.3);border-radius:50px;padding:7px 16px;font-size:12px;font-weight:700;color:var(--a);letter-spacing:.3px}
.burger{display:none;background:none;border:none;color:var(--tx);font-size:24px;cursor:pointer;padding:4px;line-height:1}

/* ── CONTENT ── */
.content{padding:26px 28px;flex:1;position:relative;z-index:1}

/* ── STAT CARDS ── */
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
.stat{border-radius:var(--rr);padding:22px;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;cursor:default}
.stat:hover{transform:translateY(-2px)}
.stat-glow{position:absolute;top:-20px;right:-20px;width:100px;height:100px;border-radius:50%;opacity:.6}
.stat-line{position:absolute;top:0;left:0;right:0;height:2px;border-radius:2px 2px 0 0}
.stat-bg-g{background:linear-gradient(145deg,rgba(16,185,129,.1),rgba(16,185,129,.04));border:1px solid rgba(16,185,129,.2);box-shadow:0 8px 32px rgba(16,185,129,.06)}
.stat-bg-v{background:linear-gradient(145deg,rgba(124,92,252,.1),rgba(124,92,252,.04));border:1px solid rgba(124,92,252,.2);box-shadow:0 8px 32px rgba(124,92,252,.08)}
.stat-bg-a{background:linear-gradient(145deg,rgba(245,158,11,.08),rgba(245,158,11,.03));border:1px solid rgba(245,158,11,.18);box-shadow:0 8px 32px rgba(245,158,11,.05)}
.stat-bg-r{background:linear-gradient(145deg,rgba(239,68,68,.08),rgba(239,68,68,.03));border:1px solid rgba(239,68,68,.18);box-shadow:0 8px 32px rgba(239,68,68,.05)}
.stat-bg-s{background:linear-gradient(145deg,rgba(56,189,248,.08),rgba(56,189,248,.03));border:1px solid rgba(56,189,248,.18);box-shadow:0 8px 32px rgba(56,189,248,.05)}
.slbl{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--t2);margin-bottom:10px;font-weight:500}
.sval{font-family:var(--fd);font-size:38px;letter-spacing:1px;line-height:1;margin-bottom:5px}
.ssub{font-size:11px;color:var(--t3);letter-spacing:.2px}
.col-g{color:var(--g)}.col-v{color:var(--vl)}.col-a{color:var(--a)}.col-r{color:var(--r)}.col-s{color:var(--s)}

/* ── CARDS ── */
.card{background:linear-gradient(145deg,var(--c1),var(--bg3));border:1px solid var(--bd);border-radius:var(--rr);padding:22px;position:relative;overflow:hidden}
.card-shine{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.06),transparent)}
.ct{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:var(--t2);margin-bottom:18px;display:flex;align-items:center;gap:8px;font-weight:600}
.ct-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px}

/* ── DISCIPLINE RING ── */
.ring-outer{position:relative;width:130px;height:130px;flex-shrink:0}
.ring-svg{transform:rotate(-90deg);filter:drop-shadow(0 0 8px currentColor)}
.ring-bg{fill:none;stroke:var(--bd2);stroke-width:9}
.ring-fill{fill:none;stroke-width:9;stroke-linecap:round;transition:stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)}
.ring-lbl{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.ring-score{font-family:var(--fd);font-size:36px;letter-spacing:1px;line-height:1}
.ring-tag{font-size:8px;text-transform:uppercase;letter-spacing:2px;color:var(--t3);margin-top:3px}
.disc-wrap{display:flex;align-items:center;gap:26px}
.disc-items{flex:1;display:flex;flex-direction:column;gap:10px}
.disc-row{display:flex;align-items:center;gap:10px}
.disc-lbl{font-size:11px;color:var(--t2);width:130px;flex-shrink:0}
.disc-bar{flex:1;height:4px;background:var(--bd);border-radius:2px;overflow:hidden}
.disc-fill{height:100%;border-radius:2px;transition:width .9s ease}
.disc-val{font-size:11px;font-weight:700;width:28px;text-align:right}

/* ── TABLE ── */
.twrap{overflow-x:auto}
.tbl{width:100%;border-collapse:collapse;font-size:12px}
.tbl th{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--t3);padding:0 10px 12px 0;text-align:left;border-bottom:1px solid var(--bd);white-space:nowrap;font-weight:600}
.tbl td{padding:12px 10px 12px 0;border-bottom:1px solid rgba(28,45,71,.5);vertical-align:middle}
.tbl tr:last-child td{border-bottom:none}
.tbl tr:hover td{background:rgba(124,92,252,.04)}
.tpair{font-weight:700;font-size:13px;color:var(--tx)}
.dir-badge{display:inline-block;padding:3px 9px;border-radius:5px;font-size:10px;font-weight:700;letter-spacing:.5px}
.dir-buy{background:var(--gd);color:var(--g);border:1px solid rgba(16,185,129,.2)}
.dir-sell{background:var(--rd);color:var(--r);border:1px solid rgba(239,68,68,.2)}
.pnl{font-weight:700;font-size:13px}
.pnl-p{color:var(--g)}.pnl-n{color:var(--r)}
.etag{display:inline-flex;align-items:center;gap:3px;padding:3px 9px;border-radius:50px;font-size:10px;font-weight:600}
.em-confident{background:var(--sd);color:var(--s)}
.em-fearful{background:var(--rd);color:var(--r)}
.em-impatient{background:var(--ad);color:var(--a)}
.em-disciplined{background:var(--gd);color:var(--g)}
.em-revenge{background:rgba(239,68,68,.2);color:#f87171}
.em-calm{background:var(--vd);color:var(--vl)}
.em-greedy{background:rgba(245,158,11,.2);color:#fbbf24}
.em-neutral{background:var(--bd);color:var(--t2)}
.grade{font-family:var(--fd);font-size:20px;letter-spacing:1px}

/* ── BUTTONS ── */
.btn{background:linear-gradient(135deg,var(--v),#5b21b6);color:#fff;border:none;border-radius:var(--rm);padding:11px 22px;font-family:var(--fb);font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.2px;box-shadow:0 4px 16px var(--vg)}
.btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px var(--vg)}
.btn:disabled{opacity:.35;cursor:not-allowed;transform:none;box-shadow:none}
.btn-sm{padding:7px 14px;font-size:12px}
.btn-g{background:transparent;border:1px solid var(--bd2);color:var(--t2);border-radius:var(--rm);padding:9px 18px;font-family:var(--fb);font-size:12px;cursor:pointer;transition:all .2s}
.btn-g:hover{border-color:var(--v);color:var(--tx)}
.btn-active{background:var(--vd);border:1px solid rgba(124,92,252,.3);color:var(--vl)}

/* ── FORMS ── */
.frow{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-bottom:14px}
.field{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.lbl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--t3);font-weight:600}
.inp{background:var(--sf);border:1.5px solid var(--bd2);border-radius:var(--rm);padding:11px 14px;font-family:var(--fb);font-size:13px;color:var(--tx);outline:none;transition:border-color .2s,box-shadow .2s;width:100%}
.inp:focus{border-color:var(--v);box-shadow:0 0 0 3px var(--vd)}
.inp::placeholder{color:var(--t3)}
.sel{background:var(--sf);border:1.5px solid var(--bd2);border-radius:var(--rm);padding:11px 14px;font-family:var(--fb);font-size:13px;color:var(--tx);outline:none;width:100%;cursor:pointer}
.sel:focus{border-color:var(--v)}
.ta{background:var(--sf);border:1.5px solid var(--bd2);border-radius:var(--rm);padding:11px 14px;font-family:var(--fb);font-size:13px;color:var(--tx);outline:none;width:100%;resize:vertical;min-height:72px;transition:border-color .2s}
.ta:focus{border-color:var(--v)}
.em-grid{display:flex;flex-wrap:wrap;gap:7px}
.em-btn{padding:6px 13px;border-radius:50px;font-size:11px;font-weight:600;cursor:pointer;border:1.5px solid transparent;transition:all .15s;background:var(--sf);color:var(--t2)}
.em-btn.esel{transform:scale(1.06);border-color:currentColor}

/* ── INSIGHT ── */
.insight{background:linear-gradient(135deg,rgba(124,92,252,.1),rgba(124,92,252,.04));border:1px solid rgba(124,92,252,.18);border-radius:var(--rr);padding:18px 20px;position:relative;overflow:hidden;margin-bottom:13px}
.insight::before{content:'';position:absolute;top:-20px;right:-20px;width:80px;height:80px;background:radial-gradient(circle,var(--vg),transparent);border-radius:50%;opacity:.5}
.i-lbl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--vl);margin-bottom:6px;font-weight:700}
.i-txt{font-size:13px;color:var(--t2);line-height:1.75;position:relative}
.i-txt strong{color:var(--tx);font-weight:600}

/* ── CHECK-IN ── */
.ci{background:linear-gradient(135deg,rgba(124,92,252,.12),rgba(16,185,129,.06));border:1px solid rgba(124,92,252,.2);border-radius:var(--rr);padding:22px;margin-bottom:20px;position:relative;overflow:hidden}
.ci::before{content:'';position:absolute;bottom:-30px;right:-30px;width:120px;height:120px;background:radial-gradient(circle,rgba(124,92,252,.15),transparent);border-radius:50%}
.ci-step{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--vl);margin-bottom:7px;font-weight:700}
.ci-q{font-size:14px;font-weight:500;color:var(--tx);margin-bottom:14px;line-height:1.55;position:relative}
.ci-opts{display:flex;gap:9px;flex-wrap:wrap;position:relative}
.ci-opt{padding:8px 18px;border-radius:50px;font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid var(--bd2);background:rgba(255,255,255,.03);color:var(--t2);transition:all .2s;letter-spacing:.2px}
.ci-opt:hover{border-color:var(--v);color:var(--tx);background:var(--vd)}
.ci-done{display:flex;align-items:center;gap:10px;padding:12px 18px;background:var(--gd);border:1px solid rgba(16,185,129,.25);border-radius:var(--rr);margin-bottom:20px;font-size:13px;color:var(--g);font-weight:500}

/* ── PATTERN CARDS ── */
.pat-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pat{background:linear-gradient(145deg,var(--c2),var(--bg3));border:1px solid var(--bd);border-radius:var(--rm);padding:16px;border-left:3px solid}
.pat-p{border-left-color:var(--g)}.pat-n{border-left-color:var(--r)}.pat-u{border-left-color:var(--a)}
.pat-title{font-size:13px;font-weight:600;color:var(--tx);margin-bottom:5px}
.pat-desc{font-size:11px;color:var(--t2);line-height:1.65}
.pat-stat{font-family:var(--fd);font-size:22px;letter-spacing:1px;margin-top:9px}

/* ── PROP FIRM ── */
.ps{padding:5px 14px;border-radius:50px;font-size:10px;font-weight:700;letter-spacing:.8px}
.ps-ok{background:var(--gd);color:var(--g);border:1px solid rgba(16,185,129,.25)}
.ps-w{background:var(--ad);color:var(--a);border:1px solid rgba(245,158,11,.25)}
.ps-f{background:var(--rd);color:var(--r);border:1px solid rgba(239,68,68,.25)}
.rule-row{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(28,45,71,.5)}
.rule-row:last-child{border-bottom:none}
.rule-name{font-size:11px;color:var(--t2);width:155px;flex-shrink:0}
.rule-track{flex:1}
.rule-bg{height:6px;background:var(--bd);border-radius:3px;overflow:hidden}
.rule-fill{height:100%;border-radius:3px;transition:width 1.1s ease}
.rule-nums{display:flex;justify-content:space-between;margin-top:4px;font-size:9px;color:var(--t3)}
.rule-st{width:68px;text-align:right;font-size:10px;font-weight:700}
.wbox{background:linear-gradient(135deg,var(--ad),rgba(245,158,11,.04));border:1px solid rgba(245,158,11,.25);border-radius:var(--rm);padding:12px 16px;font-size:12px;color:var(--a);display:flex;gap:8px;margin-top:14px;line-height:1.6}

/* ── RISK CALC ── */
.rtabs{display:flex;gap:2px;background:var(--sf);border-radius:var(--rm);padding:3px;margin-bottom:22px;flex-wrap:wrap}
.rtab{flex:1;padding:8px 6px;text-align:center;font-size:11px;font-weight:600;color:var(--t3);border-radius:8px;cursor:pointer;transition:all .2s;border:none;background:none;white-space:nowrap;letter-spacing:.2px}
.rtab.on{background:var(--c1);color:var(--tx);box-shadow:0 2px 10px rgba(0,0,0,.4)}
.rresult{background:linear-gradient(145deg,rgba(124,92,252,.12),rgba(124,92,252,.04));border:1px solid rgba(124,92,252,.2);border-radius:var(--rr);padding:22px;margin-top:18px;text-align:center;box-shadow:inset 0 1px 0 rgba(124,92,252,.1)}
.rr-val{font-family:var(--fd);font-size:44px;letter-spacing:2px;color:var(--vl);text-shadow:0 0 20px var(--vg)}
.rr-lbl{font-size:10px;color:var(--t3);margin-top:4px;text-transform:uppercase;letter-spacing:2px;font-weight:600}
.rr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}
.rr-item{background:var(--sf);border-radius:var(--rm);padding:12px;text-align:center;border:1px solid var(--bd)}
.rr-iv{font-family:var(--fd);font-size:22px;letter-spacing:1px}
.rr-il{font-size:9px;color:var(--t3);margin-top:3px;text-transform:uppercase;letter-spacing:1.5px}

/* ── COMMUNITY ── */
.lb-row{display:flex;align-items:center;gap:13px;padding:11px 14px;border-radius:var(--rm);transition:background .2s;cursor:default}
.lb-row:hover{background:rgba(124,92,252,.05)}
.lb-rank{font-family:var(--fd);font-size:20px;letter-spacing:1px;width:26px;color:var(--t3)}
.lb-rank.gold{color:var(--a)}.lb-rank.silver{color:#94a3b8}.lb-rank.bronze{color:#cd7c54}
.lb-av{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.4)}
.lb-name{flex:1;font-size:13px;font-weight:500;color:var(--tx)}
.lb-score{font-family:var(--fd);font-size:20px;letter-spacing:1px;color:var(--vl)}
.lb-badge{font-size:10px;color:var(--t3);margin-top:1px}
.cstats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
.cstat{background:linear-gradient(145deg,var(--c1),var(--bg3));border:1px solid var(--bd);border-radius:var(--rm);padding:18px;text-align:center}
.cstat-val{font-family:var(--fd);font-size:26px;letter-spacing:1px}
.cstat-lbl{font-size:10px;color:var(--t3);margin-top:4px;letter-spacing:.5px}

/* ── REPORT ── */
.rh{background:linear-gradient(135deg,#130d2e,#0a1020);border:1px solid rgba(124,92,252,.25);border-radius:var(--rr);padding:28px;margin-bottom:18px;position:relative;overflow:hidden}
.rh::before{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;background:radial-gradient(circle,rgba(124,92,252,.2),transparent);border-radius:50%}
.rh::after{content:'';position:absolute;bottom:-40px;left:-40px;width:160px;height:160px;background:radial-gradient(circle,rgba(16,185,129,.08),transparent);border-radius:50%}
.rh-week{font-size:9px;text-transform:uppercase;letter-spacing:3px;color:var(--vl);margin-bottom:6px;font-weight:700}
.rh-title{font-family:var(--fd);font-size:30px;letter-spacing:3px;color:var(--tx);margin-bottom:18px;position:relative}
.rh-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;position:relative}
.rh-val{font-family:var(--fd);font-size:26px;letter-spacing:1px}
.rh-lbl{font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:2px;margin-top:3px;font-weight:600}

/* ── SETTINGS ── */
.set-sec{margin-bottom:26px}
.set-title{font-family:var(--fd);font-size:18px;letter-spacing:2px;color:var(--tx);margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid var(--bd)}
.set-row{display:flex;justify-content:space-between;align-items:center;padding:13px 0;border-bottom:1px solid rgba(28,45,71,.5)}
.set-row:last-child{border-bottom:none}
.set-lbl{font-size:13px;color:var(--tx);font-weight:500}
.set-sub{font-size:11px;color:var(--t3);margin-top:2px}
.toggle{width:44px;height:24px;background:var(--bd2);border-radius:12px;cursor:pointer;position:relative;transition:background .2s;border:none;flex-shrink:0}
.toggle.on{background:var(--v)}
.toggle::after{content:'';position:absolute;width:18px;height:18px;background:#fff;border-radius:50%;top:3px;left:3px;transition:transform .2s;box-shadow:0 1px 4px rgba(0,0,0,.4)}
.toggle.on::after{transform:translateX(20px)}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.8);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:center;justify-content:center;padding:14px}
.modal{background:linear-gradient(145deg,var(--c1),var(--bg3));border:1px solid var(--bd2);border-radius:24px;padding:28px;width:100%;max-width:540px;max-height:90vh;overflow-y:auto;animation:obIn .3s ease;box-shadow:0 40px 80px rgba(0,0,0,.6)}
.modal-title{font-family:var(--fd);font-size:22px;letter-spacing:2px;margin-bottom:20px;background:linear-gradient(135deg,var(--tx),var(--t2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.modal-foot{display:flex;gap:10px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid var(--bd)}

/* ── UPLOAD ── */
.upload-zone{border:2px dashed var(--bd2);border-radius:var(--rr);padding:36px;text-align:center;cursor:pointer;transition:all .2s;background:var(--sf)}
.upload-zone:hover{border-color:var(--v);background:var(--vd)}
.ss-zone{border:1.5px dashed var(--bd2);border-radius:var(--rm);padding:18px;text-align:center;cursor:pointer;transition:all .2s;font-size:13px;color:var(--t3)}
.ss-zone:hover{border-color:var(--v);color:var(--vl)}
.ss-prev{width:100%;border-radius:var(--rm);margin-top:10px;max-height:170px;object-fit:cover}

/* ── IMPORT TABS ── */
.tabs{display:flex;gap:2px;background:var(--sf);border-radius:var(--rm);padding:3px;margin-bottom:20px}
.tab{flex:1;padding:8px;text-align:center;font-size:12px;font-weight:600;color:var(--t3);border-radius:8px;cursor:pointer;transition:all .2s;border:none;background:none;letter-spacing:.2px}
.tab.on{background:var(--c1);color:var(--tx);box-shadow:0 2px 8px rgba(0,0,0,.4)}

/* ── EMPTY ── */
.empty{text-align:center;padding:50px 20px;color:var(--t3)}
.empty-ico{font-size:40px;margin-bottom:14px;opacity:.25}
.empty-txt{font-size:13px;margin-bottom:18px;color:var(--t2)}

/* ── ANIM ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes shimmer{0%,100%{opacity:.4}50%{opacity:1}}
.fade{animation:fadeUp .3s ease forwards}
.shim{animation:shimmer 1.5s ease infinite}

/* ── MOBILE ── */
@media(max-width:880px){
  .sb{position:fixed;left:0;top:0;bottom:0;z-index:150;transform:translateX(-100%)}
  .sb.open{transform:translateX(0)}
  .burger{display:block}
  .stats-row{grid-template-columns:1fr 1fr}
  .g2{grid-template-columns:1fr}
  .rh-grid{grid-template-columns:1fr 1fr}
  .cstats{grid-template-columns:1fr}
  .pat-grid{grid-template-columns:1fr}
  .rr-grid{grid-template-columns:1fr 1fr}
  .content{padding:16px}
  .topbar{padding:14px 16px}
  .frow{grid-template-columns:1fr}
  .rtabs{gap:1px}
  .rtab{font-size:10px;padding:7px 4px}
}
`;

/* ── DATA ── */
const TRADES = [
  {id:1,pair:"EUR/USD",dir:"buy",entry:1.0812,exit:1.0878,lots:0.5,pnl:330,dur:"2h 14m",emotion:"confident",date:"Jun 02",session:"London",platform:"MT4",note:"Clean breakout above resistance.",flag:false},
  {id:2,pair:"GBP/JPY",dir:"sell",entry:197.45,exit:198.12,lots:0.3,pnl:-201,dur:"45m",emotion:"impatient",date:"Jun 02",session:"London/NY Overlap",platform:"NinjaTrader",note:"Exited too early on noise.",flag:false},
  {id:3,pair:"XAU/USD",dir:"buy",entry:2318.4,exit:2341.2,lots:0.2,pnl:456,dur:"4h 30m",emotion:"disciplined",date:"Jun 01",session:"New York",platform:"MT5",note:"Perfect setup. Followed plan exactly.",flag:false},
  {id:4,pair:"NAS100",dir:"sell",entry:18842,exit:18791,lots:0.1,pnl:510,dur:"1h 05m",emotion:"calm",date:"Jun 01",session:"New York",platform:"Rithmic",note:"News-driven. Was ready.",flag:false},
  {id:5,pair:"USD/CAD",dir:"buy",entry:1.3601,exit:1.3572,lots:0.4,pnl:-116,dur:"3h 20m",emotion:"revenge",date:"May 31",session:"New York",platform:"cTrader",note:"Revenge trade. Knew it was wrong.",flag:true},
  {id:6,pair:"EUR/GBP",dir:"sell",entry:0.8521,exit:0.8494,lots:0.6,pnl:162,dur:"2h 50m",emotion:"confident",date:"May 31",session:"London",platform:"MT4",note:"",flag:false},
  {id:7,pair:"AUD/USD",dir:"buy",entry:0.6518,exit:0.6542,lots:0.5,pnl:120,dur:"1h 40m",emotion:"calm",date:"May 30",session:"Tokyo/Asia",platform:"MT5",note:"Asia momentum trade.",flag:false},
  {id:8,pair:"USD/JPY",dir:"sell",entry:157.34,exit:156.98,lots:0.3,pnl:108,dur:"5h 10m",emotion:"fearful",date:"May 30",session:"Tokyo/Asia",platform:"NinjaTrader",note:"Was nervous. Lucky it worked.",flag:false},
];
const EMOTIONS=[
  {key:"confident",label:"😤 Confident",cls:"em-confident"},
  {key:"calm",label:"😌 Calm",cls:"em-calm"},
  {key:"disciplined",label:"🎯 Disciplined",cls:"em-disciplined"},
  {key:"fearful",label:"😰 Fearful",cls:"em-fearful"},
  {key:"impatient",label:"⚡ Impatient",cls:"em-impatient"},
  {key:"greedy",label:"💰 Greedy",cls:"em-greedy"},
  {key:"revenge",label:"🔥 Revenge",cls:"em-revenge"},
  {key:"neutral",label:"😐 Neutral",cls:"em-neutral"},
];
const PLATFORMS=["MT4","MT5","NinjaTrader","cTrader","DXtrade","Rithmic","Tradovate","Webull","thinkorswim","Other"];
const SESSIONS=["London","New York","Tokyo/Asia","London/NY Overlap","Off-hours"];
const PAIRS=["EUR/USD","GBP/USD","USD/JPY","GBP/JPY","AUD/USD","USD/CAD","EUR/GBP","NZD/USD","XAU/USD","NAS100","US30","SP500","BTC/USD","Other"];
const PROP_FIRMS=[
  {name:"FTMO Challenge",account:"$100,000",status:"passing",daysLeft:21,rules:[
    {name:"Max Daily Loss",limit:5,used:1.8,unit:"%"},
    {name:"Max Total Drawdown",limit:10,used:4.2,unit:"%"},
    {name:"Profit Target",limit:10,used:6.7,unit:"%"},
    {name:"Min Trading Days",limit:4,used:3,unit:" days"},
  ],warning:null},
  {name:"Apex Trader — NQ",account:"$50,000",status:"warning",daysLeft:14,rules:[
    {name:"Daily Loss Limit",limit:2500,used:1980,unit:"$"},
    {name:"Max Trailing Draw",limit:2500,used:1740,unit:"$"},
    {name:"Profit Target",limit:3000,used:1420,unit:"$"},
    {name:"Min Active Days",limit:10,used:7,unit:" days"},
  ],warning:"You are $520 away from your daily loss limit. Consider stopping for today."},
];
const LB=[
  {rank:1,init:"TK",name:"TraderKev_88",score:94,streak:12,col:"#7c5cfc"},
  {rank:2,init:"SA",name:"SilentAlpha",score:91,streak:9,col:"#10b981"},
  {rank:3,init:"PM",name:"PipMaster",score:87,streak:7,col:"#3b82f6"},
  {rank:4,init:"ZR",name:"ZeroRisk_FX",score:83,streak:5,col:"#f59e0b"},
  {rank:5,init:"ME",name:"You",score:76,streak:4,col:"#a78bfa",me:true},
  {rank:6,init:"FX",name:"ForexFlo",score:71,streak:3,col:"#38bdf8"},
  {rank:7,init:"DT",name:"DisciplinedT",score:68,streak:2,col:"#ec4899"},
];

function eLabel(k){return EMOTIONS.find(e=>e.key===k)?.label||k}
function eCls(k){return `em-${k}`}
function grade(t){
  if(t.pnl>300&&["disciplined","calm"].includes(t.emotion))return{g:"A+",c:"var(--g)"};
  if(t.pnl>0&&["confident","calm","disciplined"].includes(t.emotion))return{g:"A",c:"var(--g)"};
  if(t.pnl>0)return{g:"B",c:"var(--vl)"};
  if(t.emotion==="revenge")return{g:"D",c:"var(--r)"};
  return{g:"C",c:"var(--a)"};
}

/* ── RING ── */
function Ring({score}){
  const r=52,circ=2*Math.PI*r,off=circ-(score/100)*circ;
  const col=score>=75?"var(--g)":score>=50?"var(--a)":"var(--r)";
  return(
    <div className="ring-outer">
      <svg className="ring-svg" width="130" height="130" viewBox="0 0 130 130" style={{color:col}}>
        <circle className="ring-bg" cx="65" cy="65" r={r}/>
        <circle className="ring-fill" cx="65" cy="65" r={r} stroke={col} strokeDasharray={circ} strokeDashoffset={off}/>
      </svg>
      <div className="ring-lbl">
        <div className="ring-score" style={{color:col}}>{score}</div>
        <div className="ring-tag">Discipline</div>
      </div>
    </div>
  );
}

/* ── ONBOARDING ── */
function Onboarding({onDone}){
  const [step,setStep]=useState(0); // 0=name, 1=prop firm
  const [name,setName]=useState("");
  const [hasProp,setHasProp]=useState(null);

  function finish(){
    if(step===0){if(!name.trim())return;setStep(1);}
    else{if(hasProp===null)return;onDone({name:name.trim(),hasProp});}
  }

  return(
    <div className="ob">
      <div className="ob-box">
        <div className="ob-logo">TradeMind</div>
        {step===0?(
          <>
            <div className="ob-h">What should<br/>we call you?</div>
            <div className="ob-sub">We'll personalise your dashboard and insights. Your journal stays private — always.</div>
            <input
              className="ob-inp"
              placeholder="Your name or trading alias"
              value={name}
              onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&finish()}
              autoFocus
            />
            <button className="ob-btn" onClick={finish} disabled={!name.trim()}>Continue →</button>
          </>
        ):(
          <>
            <div className="ob-h">Are you doing<br/>a prop challenge?</div>
            <div className="ob-sub">This adds the <strong style={{color:"var(--vl)"}}>Prop Firm Tracker</strong> to your sidebar — FTMO, Apex, MyFundedFX and more.</div>
            <div className="ob-cards" style={{marginBottom:24}}>
              {[
                {val:true,icon:"🏆",title:"Yes — I'm in a challenge",sub:"FTMO, Apex, MyFundedFX, etc."},
                {val:false,icon:"📈",title:"No — retail trading",sub:"Personal or funded account"},
              ].map(o=>(
                <div
                  key={String(o.val)}
                  className={`ob-card ${hasProp===o.val?"on":""}`}
                  onClick={()=>setHasProp(o.val)}
                >
                  <div className="ob-card-icon">{o.icon}</div>
                  <div className="ob-card-title">{o.title}</div>
                  <div className="ob-card-sub">{o.sub}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button className="btn-g" style={{flex:"0 0 auto"}} onClick={()=>setStep(0)}>← Back</button>
              <button className="ob-btn" onClick={finish} disabled={hasProp===null} style={{flex:1}}>
                🚀 Launch TradeMind
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── DASHBOARD ── */
function Dashboard({trades,name,hasProp,onNav,ci,setCi}){
  const wins=trades.filter(t=>t.pnl>0);
  const losses=trades.filter(t=>t.pnl<0);
  const pnl=trades.reduce((s,t)=>s+t.pnl,0);
  const wr=Math.round((wins.length/trades.length)*100);
  const aw=wins.length?Math.round(wins.reduce((s,t)=>s+t.pnl,0)/wins.length):0;
  const al=losses.length?Math.round(Math.abs(losses.reduce((s,t)=>s+t.pnl,0)/losses.length)):0;
  const rr=al?(aw/al).toFixed(2):"—";
  const rev=trades.filter(t=>t.emotion==="revenge").length;
  const disc=Math.max(0,Math.min(100,76-rev*10));
  const CQ=["Did you follow your trading plan today?","Did you respect your daily loss limit?","Did you stay emotionally in control?","Did you avoid revenge trading?","Did you journal every trade?"];
  const [qi,setQi]=useState(0);

  return(
    <div className="fade">
      {!ci.done?(
        <div className="ci">
          <div className="ci-step">🌅 Daily Check-In · {qi+1} of {CQ.length}</div>
          <div className="ci-q">{CQ[qi]}</div>
          <div className="ci-opts">
            {["Yes ✅","Mostly 🟡","No ❌","Skip →"].map(o=>(
              <button key={o} className="ci-opt" onClick={()=>{
                if(qi+1>=CQ.length||o==="Skip →")setCi({done:true,t:new Date().toLocaleTimeString()});
                else setQi(q=>q+1);
              }}>{o}</button>
            ))}
          </div>
        </div>
      ):(
        <div className="ci-done">✅ Check-in done · {ci.t} — Stay disciplined, {name}.</div>
      )}

      <div className="stats-row">
        <div className={`stat ${pnl>=0?"stat-bg-g":"stat-bg-r"}`}>
          <div style={{position:"absolute",top:-20,right:-20,width:90,height:90,borderRadius:"50%",background:`radial-gradient(circle,${pnl>=0?"rgba(16,185,129,.15)":"rgba(239,68,68,.15)"},transparent)`}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,borderRadius:"2px 2px 0 0",background:pnl>=0?"var(--g)":"var(--r)"}}/>
          <div className="slbl">Total P&L</div>
          <div className={`sval ${pnl>=0?"col-g":"col-r"}`}>{pnl>=0?"+":""}{pnl}</div>
          <div className="ssub">Last 30 days · USD</div>
        </div>
        <div className="stat stat-bg-v">
          <div style={{position:"absolute",top:-20,right:-20,width:90,height:90,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,92,252,.15),transparent)"}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,borderRadius:"2px 2px 0 0",background:"var(--v)"}}/>
          <div className="slbl">Win Rate</div>
          <div className="sval col-v">{wr}%</div>
          <div className="ssub">{wins.length}W · {losses.length}L · {trades.length} trades</div>
        </div>
        <div className="stat stat-bg-a">
          <div style={{position:"absolute",top:-20,right:-20,width:90,height:90,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,.12),transparent)"}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,borderRadius:"2px 2px 0 0",background:"var(--a)"}}/>
          <div className="slbl">Risk : Reward</div>
          <div className="sval col-a">{rr}</div>
          <div className="ssub">Avg win ${aw} · loss ${al}</div>
        </div>
        <div className="stat stat-bg-v">
          <div style={{position:"absolute",top:-20,right:-20,width:90,height:90,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,92,252,.15),transparent)"}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,height:2,borderRadius:"2px 2px 0 0",background:"var(--v)"}}/>
          <div className="slbl">Discipline</div>
          <div className="sval col-v">{disc}</div>
          <div className="ssub">This week · out of 100</div>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--v)"}}/>Weekly Discipline Score</div>
          <div className="disc-wrap">
            <Ring score={disc}/>
            <div className="disc-items">
              {[["Followed trading plan",82,"var(--g)"],["Respected loss limits",91,"var(--g)"],["No revenge trading",Math.max(0,100-rev*25),rev>0?"var(--r)":"var(--g)"],["Position sizing",78,"var(--a)"],["Emotion awareness",85,"var(--g)"]].map(([l,v,c])=>(
                <div key={l} className="disc-row">
                  <div className="disc-lbl">{l}</div>
                  <div className="disc-bar"><div className="disc-fill" style={{width:`${v}%`,background:c}}/></div>
                  <div className="disc-val" style={{color:c}}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--vl)"}}/>AI Quick Insights</div>
          <div className="insight"><div className="i-lbl">🎯 Edge Detected</div><div className="i-txt">Your <strong>London session win rate is 78%</strong> vs 41% in NY/London overlap. Stack your sessions where your edge lives.</div></div>
          <div className="insight"><div className="i-lbl">⚠️ Cost Centre</div><div className="i-txt">You have <strong>{rev} revenge trade{rev!==1?"s":""}</strong> averaging <strong>−$160 each</strong>. Removing them adds +${rev*160} to your net P&L immediately.</div></div>
          <div className="insight" style={{marginBottom:0}}><div className="i-lbl">💡 Next Move</div><div className="i-txt">Winners average <strong>${aw}</strong> — that's {(aw/(al||1)).toFixed(1)}x your losers. Your entries are solid. <strong>Hold winners longer.</strong></div></div>
        </div>
      </div>

      <div className="card">
        <div className="card-shine"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18,flexWrap:"wrap",gap:9}}>
          <div className="ct" style={{margin:0}}><span className="ct-dot" style={{background:"var(--v)"}}/>Recent Trades</div>
          <button className="btn btn-sm" onClick={()=>onNav("journal")}>View All</button>
        </div>
        <div className="twrap">
          <table className="tbl">
            <thead><tr><th>Pair</th><th>Dir</th><th>P&L</th><th>Duration</th><th>Emotion</th><th>Session</th><th>Platform</th><th>Grade</th></tr></thead>
            <tbody>{trades.slice(0,5).map(t=>{const gd=grade(t);return(
              <tr key={t.id}>
                <td><span className="tpair">{t.pair}</span>{t.flag&&<span style={{marginLeft:5,fontSize:11}}>🚩</span>}</td>
                <td><span className={`dir-badge dir-${t.dir}`}>{t.dir.toUpperCase()}</span></td>
                <td><span className={`pnl pnl-${t.pnl>=0?"p":"n"}`}>{t.pnl>=0?"+":""}{t.pnl}</span></td>
                <td style={{color:"var(--t2)",fontSize:11}}>{t.dur}</td>
                <td><span className={`etag ${eCls(t.emotion)}`}>{eLabel(t.emotion)}</span></td>
                <td style={{fontSize:11,color:"var(--t3)"}}>{t.session}</td>
                <td style={{fontSize:11,color:"var(--t3)"}}>{t.platform}</td>
                <td><span className="grade" style={{color:gd.c}}>{gd.g}</span></td>
              </tr>
            )})}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── JOURNAL ── */
function Journal({trades,onAdd}){
  const [ef,setEf]=useState("all");
  const [pf,setPf]=useState("all");
  const [sf,setSf]=useState("all");
  const [df,setDf]=useState("all");
  const [ff,setFf]=useState(false);
  const uPairs=[...new Set(trades.map(t=>t.pair))];
  const filtered=trades.filter(t=>{
    if(ef!=="all"&&t.emotion!==ef)return false;
    if(pf!=="all"&&t.pair!==pf)return false;
    if(sf!=="all"&&t.session!==sf)return false;
    if(df!=="all"&&t.dir!==df)return false;
    if(ff&&!t.flag)return false;
    return true;
  });
  const fPnl=filtered.reduce((s,t)=>s+t.pnl,0);
  return(
    <div className="fade">
      <div className="card" style={{marginBottom:14,padding:"14px 18px"}}>
        <div className="card-shine"/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          <select className="sel" style={{width:"auto",fontSize:11,padding:"7px 11px"}} value={ef} onChange={e=>setEf(e.target.value)}>
            <option value="all">All Emotions</option>{EMOTIONS.map(e=><option key={e.key} value={e.key}>{e.label}</option>)}
          </select>
          <select className="sel" style={{width:"auto",fontSize:11,padding:"7px 11px"}} value={pf} onChange={e=>setPf(e.target.value)}>
            <option value="all">All Pairs</option>{uPairs.map(p=><option key={p}>{p}</option>)}
          </select>
          <select className="sel" style={{width:"auto",fontSize:11,padding:"7px 11px"}} value={sf} onChange={e=>setSf(e.target.value)}>
            <option value="all">All Sessions</option>{SESSIONS.map(s=><option key={s}>{s}</option>)}
          </select>
          <select className="sel" style={{width:"auto",fontSize:11,padding:"7px 11px"}} value={df} onChange={e=>setDf(e.target.value)}>
            <option value="all">Both Directions</option><option value="buy">Buy Only</option><option value="sell">Sell Only</option>
          </select>
          <button className={ff?"btn btn-sm":"btn-g"} onClick={()=>setFf(f=>!f)}>🚩 Flagged</button>
          <button className="btn-g" onClick={()=>{setEf("all");setPf("all");setSf("all");setDf("all");setFf(false);}}>Reset</button>
          <button className="btn btn-sm" style={{marginLeft:"auto"}} onClick={onAdd}>+ Log Trade</button>
        </div>
        <div style={{marginTop:10,display:"flex",gap:18,fontSize:11,color:"var(--t3)"}}>
          <span style={{color:"var(--t2)"}}>{filtered.length} trades</span>
          <span style={{color:fPnl>=0?"var(--g)":"var(--r)",fontWeight:700}}>P&L: {fPnl>=0?"+":""}{fPnl}</span>
          <span>Wins: {filtered.filter(t=>t.pnl>0).length}/{filtered.length}</span>
        </div>
      </div>
      <div className="card">
        <div className="card-shine"/>
        <div className="twrap">
          <table className="tbl">
            <thead><tr><th>Pair</th><th>Dir</th><th>Entry</th><th>Exit</th><th>Lots</th><th>P&L</th><th>Dur</th><th>Session</th><th>Emotion</th><th>Platform</th><th>Date</th><th>Grade</th></tr></thead>
            <tbody>{filtered.map(t=>{const gd=grade(t);return(
              <tr key={t.id}>
                <td><div style={{display:"flex",alignItems:"center",gap:4}}><span className="tpair">{t.pair}</span>{t.flag&&<span>🚩</span>}</div>{t.note&&<div style={{fontSize:10,color:"var(--t3)",marginTop:2,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.note}</div>}</td>
                <td><span className={`dir-badge dir-${t.dir}`}>{t.dir.toUpperCase()}</span></td>
                <td style={{fontSize:11}}>{t.entry}</td>
                <td style={{fontSize:11}}>{t.exit}</td>
                <td style={{fontSize:11,color:"var(--t2)"}}>{t.lots}</td>
                <td><span className={`pnl pnl-${t.pnl>=0?"p":"n"}`}>{t.pnl>=0?"+":""}{t.pnl}</span></td>
                <td style={{fontSize:10,color:"var(--t2)"}}>{t.dur}</td>
                <td style={{fontSize:10,color:"var(--t3)"}}>{t.session}</td>
                <td><span className={`etag ${eCls(t.emotion)}`}>{eLabel(t.emotion)}</span></td>
                <td style={{fontSize:10,color:"var(--t3)"}}>{t.platform}</td>
                <td style={{fontSize:10,color:"var(--t3)"}}>{t.date}</td>
                <td><span className="grade" style={{color:gd.c}}>{gd.g}</span></td>
              </tr>
            )})}</tbody>
          </table>
          {filtered.length===0&&<div className="empty"><div className="empty-ico">📋</div><div className="empty-txt">No trades match these filters</div></div>}
        </div>
      </div>
    </div>
  );
}

/* ── LOG MODAL ── */
function LogModal({onClose,onSave}){
  const [f,setF]=useState({pair:"EUR/USD",dir:"buy",entry:"",exit:"",sl:"",tp:"",lots:"0.10",session:"London",platform:"MT4",emotion:"calm",note:"",flag:false});
  const [ss,setSs]=useState(null);
  const [aiA,setAiA]=useState("");
  const [anl,setAnl]=useState(false);
  const ref=useRef();
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const pips=f.entry&&f.sl?Math.round(Math.abs(parseFloat(f.entry)-parseFloat(f.sl))*10000):null;
  const riskUSD=pips&&f.lots?((pips/10)*parseFloat(f.lots)*1).toFixed(2):null;

  async function analyze(file){
    setAnl(true);
    const rd=new FileReader();
    rd.onload=async e=>{
      const b64=e.target.result.split(",")[1];
      try{
        const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:file.type,data:b64}},{type:"text",text:`Forex trading coach reviewing a chart screenshot. Trader: ${f.dir.toUpperCase()} on ${f.pair}, entry:${f.entry}, exit:${f.exit}, emotion:${f.emotion}. Give 3 sentences: 1) setup quality 2) does emotion match chart 3) one specific improvement. Direct, no markdown.`}]}]})});
        const d=await res.json();setAiA(d.content?.[0]?.text||"");
      }catch{setAiA("Chart saved. AI analysis unavailable — your screenshot is logged to this trade.");}
      setAnl(false);
    };
    rd.readAsDataURL(file);
  }
  function handleFile(e){const file=e.target.files[0];if(!file)return;setSs(URL.createObjectURL(file));analyze(file);}
  function save(){
    const raw=f.exit&&f.entry?((parseFloat(f.exit)-parseFloat(f.entry))*(f.dir==="buy"?1:-1)*parseFloat(f.lots)*100000/100).toFixed(0):0;
    const t={...f,id:Date.now(),pnl:parseFloat(raw)||0,dur:"—",date:"Jun 03"};
    onSave(t);onClose();
  }
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">Log New Trade</div>
        <div className="frow">
          <div className="field"><label className="lbl">Pair</label><select className="sel" value={f.pair} onChange={e=>u("pair",e.target.value)}>{PAIRS.map(p=><option key={p}>{p}</option>)}</select></div>
          <div className="field"><label className="lbl">Direction</label><select className="sel" value={f.dir} onChange={e=>u("dir",e.target.value)}><option value="buy">BUY (Long)</option><option value="sell">SELL (Short)</option></select></div>
        </div>
        <div className="frow">
          <div className="field"><label className="lbl">Entry Price</label><input className="inp" placeholder="1.0812" value={f.entry} onChange={e=>u("entry",e.target.value)}/></div>
          <div className="field"><label className="lbl">Exit Price</label><input className="inp" placeholder="1.0878" value={f.exit} onChange={e=>u("exit",e.target.value)}/></div>
        </div>
        <div className="frow">
          <div className="field"><label className="lbl">Stop Loss</label><input className="inp" placeholder="1.0785" value={f.sl} onChange={e=>u("sl",e.target.value)}/></div>
          <div className="field"><label className="lbl">Take Profit</label><input className="inp" placeholder="1.0950" value={f.tp} onChange={e=>u("tp",e.target.value)}/></div>
        </div>
        {pips&&<div style={{background:"rgba(124,92,252,.08)",border:"1px solid rgba(124,92,252,.15)",borderRadius:"var(--rm)",padding:"9px 14px",marginBottom:14,fontSize:12,color:"var(--t2)",display:"flex",gap:20}}>SL Distance: <strong style={{color:"var(--tx)"}}>{pips} pips</strong> · Risk: <strong style={{color:"var(--r)"}}>~${riskUSD}</strong></div>}
        <div className="frow">
          <div className="field"><label className="lbl">Lot Size</label><input className="inp" value={f.lots} onChange={e=>u("lots",e.target.value)}/></div>
          <div className="field"><label className="lbl">Platform</label><select className="sel" value={f.platform} onChange={e=>u("platform",e.target.value)}>{PLATFORMS.map(p=><option key={p}>{p}</option>)}</select></div>
        </div>
        <div className="frow">
          <div className="field"><label className="lbl">Session</label><select className="sel" value={f.session} onChange={e=>u("session",e.target.value)}>{SESSIONS.map(s=><option key={s}>{s}</option>)}</select></div>
          <div className="field"><label className="lbl">Flag as bad trade</label><div style={{display:"flex",alignItems:"center",gap:9,padding:"11px 0"}}><input type="checkbox" checked={f.flag} onChange={e=>u("flag",e.target.checked)} style={{width:16,height:16,accentColor:"var(--v)"}}/><span style={{fontSize:13,color:"var(--t2)"}}>🚩 Flag this trade</span></div></div>
        </div>
        <div className="field"><label className="lbl">Emotion at Entry</label><div className="em-grid">{EMOTIONS.map(o=><button key={o.key} className={`em-btn ${o.cls} ${f.emotion===o.key?"esel":""}`} style={f.emotion===o.key?{borderColor:"currentColor"}:{}} onClick={()=>u("emotion",o.key)}>{o.label}</button>)}</div></div>
        <div className="field"><label className="lbl">Trade Notes</label><textarea className="ta" placeholder="What was your reasoning? Did you follow your plan?" value={f.note} onChange={e=>u("note",e.target.value)}/></div>
        <div className="field">
          <label className="lbl">Chart Screenshot — AI will analyse it</label>
          <div className="ss-zone" onClick={()=>ref.current.click()}>
            {ss?<img src={ss} className="ss-prev" alt="chart"/>:<><div style={{fontSize:26,marginBottom:7}}>📸</div><div>Click to upload chart screenshot</div></>}
          </div>
          <input ref={ref} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
          {anl&&<div style={{fontSize:12,color:"var(--vl)",marginTop:8}} className="shim">🤖 Analysing your chart...</div>}
          {aiA&&<div className="insight" style={{marginTop:11}}><div className="i-lbl">🤖 AI Chart Feedback</div><div className="i-txt">{aiA}</div></div>}
        </div>
        <div className="modal-foot"><button className="btn-g" onClick={onClose}>Cancel</button><button className="btn" onClick={save}>Save Trade</button></div>
      </div>
    </div>
  );
}

/* ── IMPORT MODAL ── */
function ImportModal({onClose}){
  const [tab,setTab]=useState("csv");
  const [done,setDone]=useState(false);
  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="modal-title">Import Trades</div>
        <div className="tabs">{[["csv","📄 CSV / Excel"],["mt4","⚡ MT4/MT5 EA"],["manual","✍️ Manual"]].map(([id,lbl])=><button key={id} className={`tab ${tab===id?"on":""}`} onClick={()=>setTab(id)}>{lbl}</button>)}</div>
        {tab==="csv"&&<div>
          <p style={{fontSize:13,color:"var(--t2)",marginBottom:14,lineHeight:1.7}}>Export your trade history from <strong style={{color:"var(--tx)"}}>any platform</strong> as a CSV or Excel file and upload it here.</p>
          <div className="upload-zone" onClick={()=>!done&&setDone(true)}>
            {done?<div style={{color:"var(--g)"}}><div style={{fontSize:30,marginBottom:9}}>✅</div><div style={{fontWeight:700}}>8 trades imported</div></div>:<><div style={{fontSize:32,marginBottom:10,opacity:.5}}>📄</div><div style={{fontSize:13,color:"var(--t2)",marginBottom:5}}>Drop CSV here or click to browse</div><div style={{fontSize:11,color:"var(--t3)"}}>NinjaTrader · cTrader · DXtrade · Rithmic · MT4/MT5 · Tradovate · thinkorswim</div></>}
          </div>
        </div>}
        {tab==="mt4"&&<div>
          <p style={{fontSize:13,color:"var(--t2)",marginBottom:14,lineHeight:1.7}}>Install the TradeMind EA. It syncs every trade in real time — no manual exports.</p>
          <div style={{background:"var(--sf)",borderRadius:"var(--rm)",padding:16,marginBottom:14}}>
            <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"2px",color:"var(--t3)",marginBottom:8}}>Your Trader ID</div>
            <div style={{fontFamily:"monospace",fontSize:17,color:"var(--vl)",background:"var(--bg3)",borderRadius:8,padding:"11px 14px",letterSpacing:"2px"}}>TM-FX-4829-KXPL</div>
          </div>
          {["Download TradeMind EA (.ex4 / .ex5)","Copy to your MT4/MT5 Experts folder","Attach EA to any chart","Enter Trader ID in EA settings","Trades sync automatically"].map((s,i)=><div key={i} style={{display:"flex",gap:9,fontSize:13,color:"var(--t2)",marginBottom:10}}><span style={{color:"var(--vl)",fontWeight:700,flexShrink:0}}>{i+1}.</span><span>{s}</span></div>)}
        </div>}
        {tab==="manual"&&<div>
          <p style={{fontSize:13,color:"var(--t2)",marginBottom:14,lineHeight:1.7}}>Log each trade manually. Works for any platform, any broker, any prop firm.</p>
          <div style={{background:"var(--vd)",border:"1px solid rgba(124,92,252,.2)",borderRadius:"var(--rm)",padding:16,fontSize:13,color:"var(--vl)",lineHeight:2}}>
            ✅ Any platform, any broker<br/>✅ Upload chart screenshots for AI review<br/>✅ Tag emotions and notes<br/>✅ Flag revenge trades for pattern analysis
          </div>
        </div>}
        <div className="modal-foot"><button className="btn-g" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}

/* ── RISK CALCULATOR ── */
function RiskCalc(){
  const [tool,setTool]=useState("pos");
  const [acc,setAcc]=useState("10000");const [rp,setRp]=useState("1");const [sl,setSl]=useState("20");
  const [re,setRe]=useState("");const [rs,setRs]=useState("");const [rt,setRt]=useState("");
  const [da,setDa]=useState("10000");const [dl,setDl]=useState("2");const [dlost,setDlost]=useState("0");
  const [pvl,setPvl]=useState("0.10");
  const [pa,setPa]=useState("100000");const [pd,setPd]=useState("5");const [pr,setPr]=useState("0.5");

  const pos=()=>{const a=parseFloat(acc),r=parseFloat(rp)/100,s=parseFloat(sl);if(!a||!r||!s)return null;const ra=a*r;return{lots:(ra/(s*10)).toFixed(2),ra:ra.toFixed(0),s};};
  const rrr=()=>{if(!re||!rs||!rt)return null;const e=parseFloat(re),s=parseFloat(rs),t=parseFloat(rt);const risk=Math.abs(e-s),rew=Math.abs(t-e);const ratio=(rew/risk).toFixed(2);return{risk:risk.toFixed(5),rew:rew.toFixed(5),ratio,minWR:Math.round((1/(1+parseFloat(ratio)))*100)};};
  const daily=()=>{const a=parseFloat(da),lim=parseFloat(dl)/100,lost=parseFloat(dlost)||0;const limit=a*lim,rem=Math.max(0,limit-lost),pct=Math.min(100,Math.round((lost/limit)*100));return{limit:limit.toFixed(0),rem:rem.toFixed(0),pct,danger:pct>=80};};
  const pv=()=>{const l=parseFloat(pvl)||0;const v=(l*10).toFixed(2);return{v,v10:(l*100).toFixed(2),v20:(l*200).toFixed(2)};};
  const prop=()=>{const a=parseFloat(pa),dd=parseFloat(pd)/100,r=parseFloat(pr)/100;const maxR=a*dd*0.1;return{maxR:maxR.toFixed(0),lots:(maxR/(20*10)).toFixed(2),rpt:(a*r).toFixed(0)};};

  const P=pos(),R=rrr(),D=daily(),PV=pv(),PR=prop();
  const TOOLS=[["pos","📐 Position Size"],["rr","⚖️ R:R Planner"],["daily","🛡️ Daily Loss"],["pv","💱 Pip Value"],["prop","🏆 Prop Safe Size"]];

  return(
    <div className="fade">
      <div className="rtabs">{TOOLS.map(([id,lbl])=><button key={id} className={`rtab ${tool===id?"on":""}`} onClick={()=>setTool(id)}>{lbl}</button>)}</div>
      <div className="g2">
        <div className="card">
          <div className="card-shine"/>
          {tool==="pos"&&<>
            <div className="ct"><span className="ct-dot" style={{background:"var(--v)"}}/>Position Size Calculator</div>
            <div className="field"><label className="lbl">Account Balance (USD)</label><input className="inp" value={acc} onChange={e=>setAcc(e.target.value)} placeholder="10000"/></div>
            <div className="field"><label className="lbl">Risk Per Trade (%)</label><input className="inp" value={rp} onChange={e=>setRp(e.target.value)} placeholder="1"/></div>
            <div className="field"><label className="lbl">Stop Loss (pips)</label><input className="inp" value={sl} onChange={e=>setSl(e.target.value)} placeholder="20"/></div>
            {P&&<div className="rresult"><div className="rr-val">{P.lots}</div><div className="rr-lbl">Recommended Lot Size</div><div className="rr-grid"><div className="rr-item"><div className="rr-iv col-r">${P.ra}</div><div className="rr-il">Max Risk</div></div><div className="rr-item"><div className="rr-iv">{P.s}</div><div className="rr-il">SL Pips</div></div><div className="rr-item"><div className="rr-iv col-g">{rp}%</div><div className="rr-il">Risk %</div></div></div></div>}
          </>}
          {tool==="rr"&&<>
            <div className="ct"><span className="ct-dot" style={{background:"var(--a)"}}/>Risk:Reward Planner</div>
            <div className="field"><label className="lbl">Entry Price</label><input className="inp" value={re} onChange={e=>setRe(e.target.value)} placeholder="1.0850"/></div>
            <div className="field"><label className="lbl">Stop Loss Price</label><input className="inp" value={rs} onChange={e=>setRs(e.target.value)} placeholder="1.0820"/></div>
            <div className="field"><label className="lbl">Take Profit Price</label><input className="inp" value={rt} onChange={e=>setRt(e.target.value)} placeholder="1.0940"/></div>
            {R&&<div className="rresult"><div className="rr-val">{R.ratio}R</div><div className="rr-lbl">Risk : Reward Ratio</div><div className="rr-grid"><div className="rr-item"><div className="rr-iv col-r">{R.risk}</div><div className="rr-il">Risk</div></div><div className="rr-item"><div className="rr-iv col-g">{R.rew}</div><div className="rr-il">Reward</div></div><div className="rr-item"><div className="rr-iv col-a">{R.minWR}%</div><div className="rr-il">Min Win Rate</div></div></div></div>}
          </>}
          {tool==="daily"&&<>
            <div className="ct"><span className="ct-dot" style={{background:"var(--g)"}}/>Daily Loss Limit Tracker</div>
            <div className="field"><label className="lbl">Account Balance (USD)</label><input className="inp" value={da} onChange={e=>setDa(e.target.value)} placeholder="10000"/></div>
            <div className="field"><label className="lbl">Max Daily Loss (%)</label><input className="inp" value={dl} onChange={e=>setDl(e.target.value)} placeholder="2"/></div>
            <div className="field"><label className="lbl">Already Lost Today ($)</label><input className="inp" value={dlost} onChange={e=>setDlost(e.target.value)} placeholder="0"/></div>
            {D&&<><div className="rresult" style={D.danger?{background:"rgba(239,68,68,.1)",borderColor:"rgba(239,68,68,.25)"}:{}}><div className="rr-val" style={{color:D.danger?"var(--r)":"var(--g)"}}>${D.rem}</div><div className="rr-lbl">Remaining Today</div><div style={{marginTop:14}}><div style={{height:8,background:"var(--bd)",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${D.pct}%`,background:D.danger?"var(--r)":"var(--g)",borderRadius:4,transition:"width .8s"}}/></div><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"var(--t3)",marginTop:5}}><span>{D.pct}% used</span><span>Limit: ${D.limit}</span></div></div></div>{D.danger&&<div className="wbox">⚠️ Approaching daily loss limit. Strongly consider stopping trading for today.</div>}</>}
          </>}
          {tool==="pv"&&<>
            <div className="ct"><span className="ct-dot" style={{background:"var(--s)"}}/>Pip Value Calculator</div>
            <div className="field"><label className="lbl">Lot Size</label><input className="inp" value={pvl} onChange={e=>setPvl(e.target.value)} placeholder="0.10"/></div>
            <div className="field"><label className="lbl">Pair (USD quoted)</label><select className="sel">{PAIRS.map(p=><option key={p}>{p}</option>)}</select></div>
            <div className="rresult"><div className="rr-val col-s">${PV.v}</div><div className="rr-lbl">Per Pip (USD)</div><div className="rr-grid"><div className="rr-item"><div className="rr-iv">${PV.v}</div><div className="rr-il">1 pip</div></div><div className="rr-item"><div className="rr-iv">${PV.v10}</div><div className="rr-il">10 pips</div></div><div className="rr-item"><div className="rr-iv">${PV.v20}</div><div className="rr-il">20 pips</div></div></div></div>
          </>}
          {tool==="prop"&&<>
            <div className="ct"><span className="ct-dot" style={{background:"var(--a)"}}/>Prop Firm Safe Lot Size</div>
            <div className="field"><label className="lbl">Account Size ($)</label><input className="inp" value={pa} onChange={e=>setPa(e.target.value)} placeholder="100000"/></div>
            <div className="field"><label className="lbl">Max Drawdown Rule (%)</label><input className="inp" value={pd} onChange={e=>setPd(e.target.value)} placeholder="5"/></div>
            <div className="field"><label className="lbl">Your Risk Per Trade (%)</label><input className="inp" value={pr} onChange={e=>setPr(e.target.value)} placeholder="0.5"/></div>
            <div className="rresult"><div className="rr-val">{PR.lots}</div><div className="rr-lbl">Safe Max Lot Size</div><div className="rr-grid"><div className="rr-item"><div className="rr-iv col-r">${PR.maxR}</div><div className="rr-il">Max Daily Risk</div></div><div className="rr-item"><div className="rr-iv col-a">${PR.rpt}</div><div className="rr-il">Risk/Trade</div></div><div className="rr-item"><div className="rr-iv col-g">{pd}%</div><div className="rr-il">DD Rule</div></div></div></div>
          </>}
        </div>
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--vl)"}}/>Risk Management Rules</div>
          <div className="insight"><div className="i-lbl">📐 Sizing Rule</div><div className="i-txt">Risk <strong>0.5–2% maximum</strong> per trade. For prop firm challenges, stay at <strong>0.5% or below</strong> to protect your drawdown headroom throughout.</div></div>
          <div className="insight"><div className="i-lbl">⚖️ R:R Standard</div><div className="i-txt">Never enter a trade below <strong>1:1.5 R:R</strong>. A 2:1 ratio means you stay profitable at just a <strong>34% win rate</strong>.</div></div>
          <div className="insight"><div className="i-lbl">🛡️ Daily Stop Rule</div><div className="i-txt">Set a hard <strong>daily loss limit of 2–3%</strong>. When hit — stop, full stop. No exceptions. This one rule alone ends most account blow-ups.</div></div>
          <div className="insight" style={{marginBottom:0}}><div className="i-lbl">🏆 Prop Challenge Mode</div><div className="i-txt"><strong>Consistency beats home runs.</strong> 0.3–0.5% per trade. A blown account costs real money to restart. Protect the account first, always.</div></div>
        </div>
      </div>
    </div>
  );
}

/* ── PATTERNS ── */
function Patterns({trades}){
  const [ai,setAi]=useState("");const [load,setLoad]=useState(false);
  const sw={London:{w:7,t:9},"New York":{w:4,t:10},Tokyo:{w:5,t:7},"London/NY":{w:2,t:6}};
  const ep={disciplined:456,confident:492,calm:228,fearful:108,impatient:-201,greedy:-89,revenge:-116,neutral:0};
  async function gen(){
    setLoad(true);
    const ctx=trades.map(t=>`${t.pair} ${t.dir} ${t.pnl>=0?"+":""}${t.pnl} (${t.emotion},${t.session})`).join("; ");
    try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:`Trading psychology coach analysing a forex trader's journal. Data: ${ctx}. Give 4 sentences: 1) strongest winning pattern with specific data 2) most destructive losing pattern with specific data 3) emotion most correlated with losses 4) one highly specific actionable recommendation for next week. Direct, reference actual trade data, no markdown.`}]})});const d=await res.json();setAi(d.content?.[0]?.text||"");}
    catch{setAi("Your London session trades show consistently stronger results than NY/London overlap, suggesting a clear time-based edge worth exploiting. Disciplined and calm emotion tags correlate with your most profitable setups, while the single revenge trade on USD/CAD alone cost $116 in fully preventable losses. Impatient exits are cutting into would-be winners — the GBP/JPY trade is a clear example. Next week: trade London open exclusively, and add a rule that you cannot close a trade before it reaches 1R.");}
    setLoad(false);
  }
  return(
    <div className="fade">
      <div className="card" style={{marginBottom:16}}>
        <div className="card-shine"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:9}}>
          <div className="ct" style={{margin:0}}><span className="ct-dot" style={{background:"var(--vl)"}}/>AI Pattern Recognition</div>
          <button className="btn" onClick={gen} disabled={load}>{load?"🤖 Analysing...":ai?"🔄 Regenerate":"🤖 Generate Analysis"}</button>
        </div>
        {ai?<div className="insight" style={{marginBottom:0}}><div className="i-lbl">🧠 Your Personal Pattern Analysis</div><div className="i-txt">{ai}</div></div>:<div className="empty"><div className="empty-ico">🧠</div><div className="empty-txt">Generate your personalised AI pattern analysis</div><button className="btn" onClick={gen}>🤖 Generate Now</button></div>}
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--g)"}}/>Win Rate by Session</div>
          {Object.entries(sw).map(([s,{w,t}])=>{const p=Math.round((w/t)*100);const c=p>=70?"var(--g)":p>=50?"var(--a)":"var(--r)";return(<div key={s} className="disc-row" style={{marginBottom:12}}><div className="disc-lbl" style={{width:110}}>{s}</div><div className="disc-bar"><div className="disc-fill" style={{width:`${p}%`,background:c}}/></div><div className="disc-val" style={{color:c}}>{p}%</div></div>);})}
        </div>
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--a)"}}/>P&L by Emotion State</div>
          {Object.entries(ep).sort((a,b)=>b[1]-a[1]).map(([em,pnl])=>(
            <div key={em} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:"1px solid rgba(28,45,71,.4)"}}>
              <span className={`etag ${eCls(em)}`}>{eLabel(em)}</span>
              <span style={{fontWeight:700,color:pnl>=0?"var(--g)":"var(--r)",fontSize:13}}>{pnl>=0?"+":""}{pnl}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-shine"/>
        <div className="ct"><span className="ct-dot" style={{background:"var(--v)"}}/>Detected Patterns</div>
        <div className="pat-grid">
          <div className="pat pat-p"><div className="pat-title">🟢 London Session Edge</div><div className="pat-desc">Win rate in the first 2 hours of London open is significantly above your overall average.</div><div className="pat-stat col-g">78% WR</div></div>
          <div className="pat pat-n"><div className="pat-title">🔴 Revenge Trade Cost</div><div className="pat-desc">Trades placed within 30 minutes of a loss have strongly negative expected value.</div><div className="pat-stat col-r">−$160 avg</div></div>
          <div className="pat pat-u"><div className="pat-title">🟡 Winners Cut Early</div><div className="pat-desc">Your average winner is 1.4R — setup quality analysis suggests 2R+ targets are achievable.</div><div className="pat-stat col-a">1.4R avg</div></div>
          <div className="pat pat-p"><div className="pat-title">🟢 Gold & Index Strength</div><div className="pat-desc">XAU/USD and NAS100 show your highest average P&L across all instruments traded.</div><div className="pat-stat col-g">$483 avg</div></div>
        </div>
      </div>
    </div>
  );
}

/* ── PROP FIRM ── */
function PropFirm(){
  const [sel,setSel]=useState(0);
  const firm=PROP_FIRMS[sel];
  return(
    <div className="fade">
      <div style={{display:"flex",gap:9,marginBottom:18,flexWrap:"wrap"}}>
        {PROP_FIRMS.map((f,i)=><button key={i} className={i===sel?"btn":"btn-g"} onClick={()=>setSel(i)}>{f.name}</button>)}
        <button className="btn-g">+ Add Challenge</button>
      </div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-shine"/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:9}}>
          <div>
            <div style={{fontFamily:"var(--fd)",fontSize:24,letterSpacing:2,color:"var(--tx)"}}>{firm.name}</div>
            <div style={{fontSize:11,color:"var(--t3)",marginTop:3}}>{firm.account} · {firm.daysLeft} days remaining</div>
          </div>
          <div className={`ps ${firm.status==="passing"?"ps-ok":firm.status==="warning"?"ps-w":"ps-f"}`}>{firm.status==="passing"?"✅ PASSING":firm.status==="warning"?"⚠️ AT RISK":"❌ FAILING"}</div>
        </div>
        {firm.rules.map((r,i)=>{const pct=Math.min(100,(r.used/r.limit)*100);const c=pct>=80?"var(--r)":pct>=60?"var(--a)":"var(--g)";return(
          <div key={i} className="rule-row">
            <div className="rule-name">{r.name}</div>
            <div className="rule-track"><div className="rule-bg"><div className="rule-fill" style={{width:`${pct}%`,background:c}}/></div><div className="rule-nums"><span>Used: {r.used}{r.unit}</span><span>Limit: {r.limit}{r.unit}</span></div></div>
            <div className="rule-st" style={{color:c}}>{pct>=80?"🔴 Critical":pct>=60?"🟡 Warning":"🟢 Safe"}</div>
          </div>
        );})}
        {firm.warning&&<div className="wbox">⚠️ {firm.warning}</div>}
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--v)"}}/>Challenge Progress</div>
          {[["Days Completed",`${30-firm.daysLeft}/30`,"var(--vl)"],["Profit Target",firm.name.includes("FTMO")?"67%":"47%","var(--g)"],["Winning Days","8/12","var(--g)"],["Pass Probability",firm.name.includes("FTMO")?"74%":"41%","var(--a)"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(28,45,71,.4)"}}>
              <span style={{fontSize:12,color:"var(--t2)"}}>{l}</span>
              <span style={{fontFamily:"var(--fd)",fontSize:18,letterSpacing:1,color:c}}>{v}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--g)"}}/>AI Challenge Coach</div>
          <div className="insight"><div className="i-lbl">📊 Strategy</div><div className="i-txt">With {firm.daysLeft} days left, target <strong>consistent 0.5–1% daily gains</strong>. Consistency wins challenges — not big days.</div></div>
          <div className="insight" style={{marginBottom:0}}><div className="i-lbl">🛡️ Protection Rule</div><div className="i-txt">Never risk more than <strong>0.5% per trade</strong> in the final week. Drawdown headroom is worth more than P&L right now.</div></div>
        </div>
      </div>
    </div>
  );
}

/* ── REPORT CARD ── */
function ReportCard({trades,name}){
  const [ai,setAi]=useState("");const [load,setLoad]=useState(false);
  const wins=trades.filter(t=>t.pnl>0);
  const pnl=trades.reduce((s,t)=>s+t.pnl,0);
  const wr=Math.round((wins.length/trades.length)*100);
  const aw=wins.length?Math.round(wins.reduce((s,t)=>s+t.pnl,0)/wins.length):0;
  async function gen(){
    setLoad(true);
    const ctx=trades.map(t=>`${t.pair} ${t.dir} ${t.pnl>=0?"+":""}$${t.pnl} emotion:${t.emotion} session:${t.session}`).join("; ");
    try{const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:900,messages:[{role:"user",content:`TradeMind AI writing a weekly report card for "${name||"Trader"}". Data: ${ctx}. P&L: $${pnl}. Win rate: ${wr}%. Format: 1) ONE sentence overall grade (A/B/C/D) and why 2) TWO sentences on what they did well with specific trade references 3) TWO sentences on what cost money with specific trade references 4) ONE specific goal for next week. Trusted coach tone, plain text only, no markdown.`}]})});const d=await res.json();setAi(d.content?.[0]?.text||"");}
    catch{setAi(`This week earns a solid B+ — the fundamentals are strong with one costly emotional breakdown. Your XAU/USD and NAS100 trades showed excellent patience and execution, and the EUR/USD long was textbook discipline. The USD/CAD revenge trade cost $116 that was entirely avoidable, and the GBP/JPY impatient exit likely left another $150+ on the table. Next week's goal: no trading within 45 minutes of closing a losing position, zero exceptions.`);}
    setLoad(false);
  }
  return(
    <div className="fade">
      <div className="rh">
        <div className="rh-week">Week of June 3, 2025</div>
        <div className="rh-title">WEEKLY REPORT CARD</div>
        <div className="rh-grid">
          {[{l:"Total P&L",v:`${pnl>=0?"+":""}$${pnl}`,c:pnl>=0?"var(--g)":"var(--r)"},{l:"Win Rate",v:`${wr}%`,c:"var(--vl)"},{l:"Avg Winner",v:`$${aw}`,c:"var(--g)"},{l:"Discipline",v:"76/100",c:"var(--a)"}].map(m=>(
            <div key={m.l}><div className="rh-val" style={{color:m.c}}>{m.v}</div><div className="rh-lbl">{m.l}</div></div>
          ))}
        </div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-shine"/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:9}}>
            <div className="ct" style={{margin:0}}><span className="ct-dot" style={{background:"var(--vl)"}}/>AI Coach Report</div>
            <button className="btn btn-sm" onClick={gen} disabled={load}>{load?"Generating...":"Generate"}</button>
          </div>
          {ai?<div className="insight" style={{marginBottom:0}}><div className="i-lbl">🤖 Weekly Report — {name}</div><div className="i-txt">{ai}</div></div>:<div className="empty" style={{padding:"28px 0"}}><div className="empty-ico">📊</div><div className="empty-txt">Click Generate for your personalised weekly report</div></div>}
        </div>
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--a)"}}/>This Week at a Glance</div>
          {[
            {icon:"💰",label:"Best Trade",val:"NAS100 +$510",c:"var(--g)"},
            {icon:"📉",label:"Worst Trade",val:"GBP/JPY −$201",c:"var(--r)"},
            {icon:"🎯",label:"Best Emotion",val:"Disciplined",c:"var(--g)"},
            {icon:"⚠️",label:"Worst Emotion",val:"Revenge",c:"var(--r)"},
            {icon:"⏰",label:"Best Session",val:"London 78% WR",c:"var(--g)"},
            {icon:"🔥",label:"Current Streak",val:"4 Days",c:"var(--a)"},
            {icon:"📊",label:"Total Trades",val:trades.length+" trades",c:"var(--vl)"},
            {icon:"🏅",label:"Weekly Grade",val:"B+",c:"var(--vl)"},
          ].map(r=>(
            <div key={r.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid rgba(28,45,71,.4)"}}>
              <span style={{fontSize:12,color:"var(--t2)"}}>{r.icon} {r.label}</span>
              <span style={{fontWeight:700,color:r.c,fontSize:13}}>{r.val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="card-shine"/>
        <div className="ct"><span className="ct-dot" style={{background:"var(--v)"}}/>Trade Grades This Week</div>
        <div className="twrap"><table className="tbl">
          <thead><tr><th>Pair</th><th>Dir</th><th>P&L</th><th>Emotion</th><th>Session</th><th>Grade</th></tr></thead>
          <tbody>{trades.map(t=>{const gd=grade(t);return(<tr key={t.id}><td><span className="tpair">{t.pair}</span></td><td><span className={`dir-badge dir-${t.dir}`}>{t.dir.toUpperCase()}</span></td><td><span className={`pnl pnl-${t.pnl>=0?"p":"n"}`}>{t.pnl>=0?"+":""}{t.pnl}</span></td><td><span className={`etag ${eCls(t.emotion)}`}>{eLabel(t.emotion)}</span></td><td style={{fontSize:11,color:"var(--t3)"}}>{t.session}</td><td><span className="grade" style={{color:gd.c}}>{gd.g}</span></td></tr>);})}</tbody>
        </table></div>
      </div>
    </div>
  );
}

/* ── COMMUNITY ── */
function Community(){
  return(
    <div className="fade">
      <div className="cstats">
        <div className="cstat"><div className="cstat-val col-g">68%</div><div className="cstat-lbl">Traders profitable this week</div></div>
        <div className="cstat"><div className="cstat-val col-a">61</div><div className="cstat-lbl">Avg discipline score</div></div>
        <div className="cstat"><div className="cstat-val col-r" style={{fontSize:18}}>Impatient</div><div className="cstat-lbl">Most common loss emotion</div></div>
      </div>
      <div className="g2">
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--a)"}}/>Discipline Leaderboard</div>
          <div style={{fontSize:10,color:"var(--t3)",marginBottom:14,letterSpacing:"1px"}}>Anonymous · resets every Monday</div>
          {LB.map(lb=>(
            <div key={lb.rank} className="lb-row" style={lb.me?{background:"rgba(124,92,252,.07)",border:"1px solid rgba(124,92,252,.15)",borderRadius:"var(--rm)"}:{}}>
              <div className={`lb-rank ${lb.rank===1?"gold":lb.rank===2?"silver":lb.rank===3?"bronze":""}`}>#{lb.rank}</div>
              <div className="lb-av" style={{background:lb.col}}>{lb.init}</div>
              <div><div className="lb-name">{lb.name}{lb.me?" (You)":""}</div><div className="lb-badge">🔥 {lb.streak} day streak</div></div>
              <div className="lb-score">{lb.score}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div className="card-shine"/>
          <div className="ct"><span className="ct-dot" style={{background:"var(--g)"}}/>Community This Week</div>
          {[["📊","Most traded pair","EUR/USD","var(--s)"],["⏰","Best win rate session","London Open","var(--g)"],["😤","Most profitable emotion","Disciplined","var(--g)"],["🔥","Traders on 5+ day streak","23%","var(--a)"],["🚩","Revenge trades flagged","147","var(--r)"],["💰","Avg trader P&L","+$284","var(--g)"],["🏆","Prop challenges passed","34","var(--vl)"]].map(([ic,l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:"1px solid rgba(28,45,71,.4)"}}>
              <span style={{fontSize:12,color:"var(--t2)"}}>{ic} {l}</span>
              <span style={{fontWeight:700,color:c,fontSize:12}}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SETTINGS ── */
function Settings({name,setName,hasProp,setHasProp}){
  const [email,setEmail]=useState("");
  const [saved,setSaved]=useState(false);
  const [togs,setTogs]=useState({weeklyReport:true,propWarnings:true,streakReminders:false,communityDigest:false,emailNotifs:true});
  const tog=k=>setTogs(p=>({...p,[k]:!p[k]}));
  function save(){setSaved(true);setTimeout(()=>setSaved(false),2200);}
  return(
    <div className="fade">
      <div className="g2">
        <div>
          <div className="set-sec">
            <div className="set-title">Account</div>
            <div className="field"><label className="lbl">Display Name</label><input className="inp" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name or alias"/></div>
            <div className="field"><label className="lbl">Email Address</label><input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com"/></div>
            <div className="field"><label className="lbl">Trader ID</label><input className="inp" value="TM-FX-4829-KXPL" readOnly style={{opacity:.5,cursor:"not-allowed",fontFamily:"monospace",letterSpacing:"1px"}}/></div>
            <button className="btn" onClick={save}>{saved?"✅ Saved!":"Save Changes"}</button>
          </div>
          <div className="set-sec">
            <div className="set-title">Trading Profile</div>
            <div className="field"><label className="lbl">Primary Platform</label><select className="sel">{PLATFORMS.map(p=><option key={p}>{p}</option>)}</select></div>
            <div className="field"><label className="lbl">Default Session</label><select className="sel">{SESSIONS.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="field"><label className="lbl">Default Risk Per Trade (%)</label><input className="inp" defaultValue="1" type="number" min="0.1" max="5" step="0.1"/></div>
            <div className="set-row">
              <div><div className="set-lbl">Prop Firm Mode</div><div className="set-sub">Shows Prop Firm Tracker in sidebar</div></div>
              <button className={`toggle ${hasProp?"on":""}`} onClick={()=>setHasProp(h=>!h)}/>
            </div>
          </div>
        </div>
        <div>
          <div className="set-sec">
            <div className="set-title">Notifications</div>
            {[{k:"weeklyReport",l:"Weekly Report Card",s:"AI-generated report every Sunday"},{k:"propWarnings",l:"Prop Firm Alerts",s:"Warning when near rule limits"},{k:"streakReminders",l:"Daily Streak Reminder",s:"Nudge to journal each day"},{k:"communityDigest",l:"Community Digest",s:"Weekly leaderboard highlights"},{k:"emailNotifs",l:"Email Notifications",s:"Deliver reports to your inbox"}].map(n=>(
              <div key={n.k} className="set-row">
                <div><div className="set-lbl">{n.l}</div><div className="set-sub">{n.s}</div></div>
                <button className={`toggle ${togs[n.k]?"on":""}`} onClick={()=>tog(n.k)}/>
              </div>
            ))}
          </div>
          <div className="set-sec">
            <div className="set-title">Subscription</div>
            <div style={{background:"linear-gradient(135deg,#130d2e,#0a1020)",border:"1px solid rgba(124,92,252,.25)",borderRadius:"var(--rr)",padding:20}}>
              <div style={{fontSize:9,textTransform:"uppercase",letterSpacing:"2.5px",color:"var(--vl)",marginBottom:6,fontWeight:700}}>Current Plan</div>
              <div style={{fontFamily:"var(--fd)",fontSize:24,letterSpacing:2,marginBottom:4}}>FREE</div>
              <div style={{fontSize:12,color:"var(--t3)",marginBottom:18}}>5 AI analyses/month · Basic features</div>
              <button className="btn" style={{width:"100%"}}>Upgrade to Pro — $19/mo</button>
              <div style={{textAlign:"center",marginTop:10,fontSize:11,color:"var(--t3)"}}>Lifetime Access — $299 one-time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN APP ── */
export default function TradeMind(){
  const [obDone,setObDone]=useState(false);
  const [userName,setUserName]=useState("Trader");
  const [hasProp,setHasProp]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [trades,setTrades]=useState(TRADES);
  const [showLog,setShowLog]=useState(false);
  const [showImport,setShowImport]=useState(false);
  const [sbOpen,setSbOpen]=useState(false);
  const [ci,setCi]=useState({done:false,t:""});

  function handleOB({name,hasProp:hp}){setUserName(name);setHasProp(hp);setObDone(true);}
  function addTrade(t){setTrades(p=>[t,...p]);}
  function nav(p){setPage(p);setSbOpen(false);}

  const NAV=[
    {id:"dashboard",icon:"📊",label:"Dashboard"},
    {id:"journal",icon:"📋",label:"Trade Journal"},
    {id:"patterns",icon:"🧠",label:"AI Patterns",badge:"AI"},
    {id:"risk",icon:"📐",label:"Risk Calculator"},
    ...(hasProp?[{id:"propfirm",icon:"🏆",label:"Prop Firm Tracker"}]:[]),
    {id:"report",icon:"📈",label:"Report Card"},
    {id:"community",icon:"👥",label:"Community"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];

  const TITLES={dashboard:"DASHBOARD",journal:"TRADE JOURNAL",patterns:"AI PATTERNS",risk:"RISK CALCULATOR",propfirm:"PROP FIRM TRACKER",report:"REPORT CARD",community:"COMMUNITY",settings:"SETTINGS"};

  if(!obDone)return(<><style>{G}</style><Onboarding onDone={handleOB}/></>);

  return(
    <>
      <style>{G}</style>
      <div className="shell">
        {sbOpen&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:140,backdropFilter:"blur(2px)"}} onClick={()=>setSbOpen(false)}/>}

        <aside className={`sb ${sbOpen?"open":""}`}>
          <div className="sb-logo">
            <div className="sb-brand">TradeMind</div>
            <div className="sb-tagline">Psychology · Performance</div>
          </div>
          <div className="sb-chip">
            <div className="sb-chip-label">Trader</div>
            <div className="sb-chip-name">{userName}</div>
            <div className="sb-chip-id">TM-FX-4829-KXPL</div>
          </div>
          <nav className="sb-nav">
            {NAV.map(n=>(
              <button key={n.id} className={`ni ${page===n.id?"on":""}`} onClick={()=>nav(n.id)}>
                <span className="ni-ic">{n.icon}</span>{n.label}
                {n.badge&&<span className="ni-badge">{n.badge}</span>}
              </button>
            ))}
            <div className="sb-div"/>
            <button className="ni" onClick={()=>setShowImport(true)}><span className="ni-ic">⬆️</span>Import Trades</button>
            <button className="ni" onClick={()=>{nav("journal");setShowLog(true);}}><span className="ni-ic">✍️</span>Log Trade</button>
          </nav>
          <div className="sb-foot">
            <button className="sb-up" onClick={()=>nav("settings")}>⚡ Upgrade to Pro</button>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <button className="burger" onClick={()=>setSbOpen(o=>!o)}>☰</button>
              <div className="ptitle">{TITLES[page]}</div>
            </div>
            <div className="tbr">
              <div className="streak-pill">🔥 4 Day Streak</div>
              <button className="btn-g" onClick={()=>setShowImport(true)}>Import</button>
              <button className="btn btn-sm" onClick={()=>{nav("journal");setShowLog(true);}}>+ Log Trade</button>
            </div>
          </div>

          <div className="content">
            {page==="dashboard"&&<Dashboard trades={trades} name={userName} hasProp={hasProp} onNav={nav} ci={ci} setCi={setCi}/>}
            {page==="journal"&&<Journal trades={trades} onAdd={()=>setShowLog(true)}/>}
            {page==="patterns"&&<Patterns trades={trades}/>}
            {page==="risk"&&<RiskCalc/>}
            {page==="propfirm"&&hasProp&&<PropFirm/>}
            {page==="report"&&<ReportCard trades={trades} name={userName}/>}
            {page==="community"&&<Community/>}
            {page==="settings"&&<Settings name={userName} setName={setUserName} hasProp={hasProp} setHasProp={setHasProp}/>}
          </div>
        </div>
      </div>

      {showLog&&<LogModal onClose={()=>setShowLog(false)} onSave={addTrade}/>}
      {showImport&&<ImportModal onClose={()=>setShowImport(false)}/>}
    </>
  );
}
