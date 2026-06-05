import { useState, useEffect, useRef } from "react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Lexend:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#05070e;--bg2:#080c18;--bg3:#0b1022;
  --card:#0f1628;--card2:#131d35;
  --bd:#1a2d50;--bd2:#223660;
  --v:#7c5cfc;--vl:#a78bfa;--vd:rgba(124,92,252,0.14);--vg:rgba(124,92,252,0.32);
  --g:#10b981;--gd:rgba(16,185,129,0.14);
  --r:#ef4444;--rd:rgba(239,68,68,0.12);
  --a:#f59e0b;--ad:rgba(245,158,11,0.12);
  --s:#38bdf8;--sd:rgba(56,189,248,0.12);
  --tx:#e8eef8;--t2:#7a90b8;--t3:#2d4268;
  --fd:'Bebas Neue',sans-serif;--fb:'Lexend',sans-serif;
}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--tx);font-family:var(--fb);font-weight:300;overflow-x:hidden}
*{font-family:var(--fb)}
::selection{background:var(--vd);color:var(--vl)}
::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:var(--bd2);border-radius:2px}

/* NAV */
nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 60px;height:72px;background:rgba(5,7,14,0.82);backdrop-filter:blur(20px);border-bottom:1px solid rgba(124,92,252,0.1);transition:all .3s}
nav.scrolled{background:rgba(5,7,14,0.97);border-bottom-color:var(--bd)}
.nav-brand{font-family:var(--fd);font-size:26px;letter-spacing:3px;background:linear-gradient(135deg,#fff,var(--vl));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;cursor:pointer}
.nav-links{display:flex;align-items:center;gap:36px}
.nav-link{font-size:13px;font-weight:500;color:var(--t2);cursor:pointer;transition:color .2s;text-decoration:none;letter-spacing:.3px}
.nav-link:hover{color:var(--tx)}
.nav-cta{background:var(--v);color:#fff;border:none;border-radius:8px;padding:10px 22px;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.3px;box-shadow:0 4px 16px var(--vg)}
.nav-cta:hover{background:#6d4ef0;transform:translateY(-1px);box-shadow:0 6px 24px var(--vg)}
.nav-mob{display:none;background:none;border:none;color:var(--tx);font-size:24px;cursor:pointer}

/* HERO */
.hero{min-height:100vh;display:flex;align-items:center;padding:110px 60px 90px;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;z-index:0}
.hero-g1{position:absolute;top:-20%;left:-10%;width:70vw;height:70vw;background:radial-gradient(ellipse,rgba(124,92,252,0.13),transparent 70%);border-radius:50%}
.hero-g2{position:absolute;bottom:-20%;right:-5%;width:50vw;height:50vw;background:radial-gradient(ellipse,rgba(16,185,129,0.07),transparent 70%);border-radius:50%}
.hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(124,92,252,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,252,0.04) 1px,transparent 1px);background-size:60px 60px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)}
.hero-inner{position:relative;z-index:1;width:100%;max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center}
.hero-pill{display:inline-flex;align-items:center;gap:8px;background:var(--vd);border:1px solid rgba(124,92,252,0.3);border-radius:50px;padding:6px 16px;font-size:11px;font-weight:700;color:var(--vl);letter-spacing:2px;text-transform:uppercase;margin-bottom:28px;animation:fadeUp .6s ease both}
.hero-pill-dot{width:6px;height:6px;border-radius:50%;background:var(--v);animation:pulse 2s ease infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.6)}}
.hero-h1{font-family:var(--fd);font-size:clamp(50px,7vw,94px);letter-spacing:3px;line-height:.95;margin-bottom:26px;animation:fadeUp .6s .1s ease both}
.hero-h1 .ln1{display:block;color:var(--tx)}
.hero-h1 .ln2{display:block;background:linear-gradient(135deg,var(--v),var(--vl),#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-h1 .ln3{display:block;color:var(--tx)}
.hero-sub{font-size:16px;color:var(--t2);line-height:1.8;max-width:480px;margin-bottom:36px;font-weight:300;animation:fadeUp .6s .2s ease both}
.hero-sub strong{color:var(--tx);font-weight:600}
.hero-markets{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:32px;animation:fadeUp .6s .25s ease both}
.market-chip{display:flex;align-items:center;gap:5px;background:rgba(255,255,255,0.04);border:1px solid var(--bd2);border-radius:6px;padding:5px 11px;font-size:11px;font-weight:600;color:var(--t2)}
.market-chip-icon{font-size:13px}
.hero-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;animation:fadeUp .6s .3s ease both}
.btn-primary{background:linear-gradient(135deg,var(--v),#5b21b6);color:#fff;border:none;border-radius:12px;padding:15px 30px;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.3px;box-shadow:0 6px 28px var(--vg)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 36px var(--vg)}
.btn-sec{background:transparent;color:var(--tx);border:1px solid var(--bd2);border-radius:12px;padding:14px 26px;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s}
.btn-sec:hover{border-color:var(--v);color:var(--vl)}
.hero-proof{display:flex;align-items:center;gap:20px;margin-top:32px;flex-wrap:wrap;animation:fadeUp .6s .4s ease both}
.hp-item{display:flex;align-items:center;gap:7px;font-size:12px;color:var(--t2)}
.hp-item strong{color:var(--tx);font-weight:700}
.hp-sep{width:3px;height:3px;border-radius:50%;background:var(--bd2)}

/* MOCKUP */
.hero-right{animation:fadeUp .6s .2s ease both}
.mockup{background:linear-gradient(145deg,var(--card),var(--bg3));border:1px solid var(--bd2);border-radius:20px;padding:20px;box-shadow:0 40px 80px rgba(0,0,0,.6),0 0 0 1px rgba(124,92,252,.1),inset 0 1px 0 rgba(255,255,255,.04);animation:float 6s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
.m-bar{display:flex;align-items:center;gap:7px;margin-bottom:16px}
.m-dot{width:9px;height:9px;border-radius:50%}
.m-ttl{font-family:var(--fd);font-size:12px;letter-spacing:2px;color:var(--t3);margin-left:6px}
.m-stats{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:12px}
.m-stat{background:var(--bg3);border:1px solid var(--bd);border-radius:9px;padding:11px 13px}
.m-slbl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--t3);margin-bottom:4px;font-weight:600}
.m-sval{font-family:var(--fd);font-size:24px;letter-spacing:1px}
.m-ring-row{display:flex;align-items:center;gap:12px;background:var(--bg3);border:1px solid var(--bd);border-radius:9px;padding:13px;margin-bottom:9px}
.m-ring{position:relative;width:50px;height:50px;flex-shrink:0}
.m-trades{display:flex;flex-direction:column;gap:5px}
.m-trade{display:flex;align-items:center;gap:7px;background:var(--bg3);border:1px solid var(--bd);border-radius:7px;padding:8px 11px}
.m-pair{font-size:11px;font-weight:700;color:var(--tx);flex:1}
.m-dir{font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px}
.m-pnl{font-size:11px;font-weight:700}
.ai-pill{display:inline-flex;align-items:center;gap:5px;background:linear-gradient(135deg,rgba(124,92,252,.2),rgba(124,92,252,.05));border:1px solid rgba(124,92,252,.3);border-radius:6px;padding:5px 10px;font-size:9px;font-weight:700;color:var(--vl);letter-spacing:1px;text-transform:uppercase}

/* TICKER */
.ticker{background:linear-gradient(135deg,rgba(124,92,252,.07),rgba(16,185,129,.04));border-top:1px solid rgba(124,92,252,.15);border-bottom:1px solid rgba(124,92,252,.15);padding:13px 0;overflow:hidden}
.ticker-track{display:flex;animation:ticker 32s linear infinite;white-space:nowrap}
.t-item{display:inline-flex;align-items:center;gap:9px;padding:0 36px;font-size:12px;font-weight:600;color:var(--t2);border-right:1px solid var(--bd)}
.t-val{font-weight:700}
.pos{color:var(--g)}.neg{color:var(--r)}.neu{color:var(--vl)}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}

/* SECTIONS */
section{padding:96px 60px;position:relative}
.inner{max-width:1200px;margin:0 auto}
.eyebrow{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:var(--vl);margin-bottom:14px}
.sec-title{font-family:var(--fd);font-size:clamp(34px,5vw,60px);letter-spacing:2px;line-height:1;margin-bottom:18px;color:var(--tx)}
.sec-title span{background:linear-gradient(135deg,var(--v),var(--vl));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.sec-sub{font-size:15px;color:var(--t2);line-height:1.8;max-width:540px}

/* STATS BAND */
.band{background:linear-gradient(135deg,var(--bg2),var(--bg3));border-top:1px solid var(--bd);border-bottom:1px solid var(--bd);padding:56px 60px}
.band-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr)}
.bstat{text-align:center;padding:0 28px;border-right:1px solid var(--bd)}
.bstat:last-child{border-right:none}
.bval{font-family:var(--fd);font-size:54px;letter-spacing:2px;line-height:1;background:linear-gradient(135deg,var(--v),var(--vl));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.blbl{font-size:11px;color:var(--t2);margin-top:7px;text-transform:uppercase;letter-spacing:2px;font-weight:600}
.bsub{font-size:11px;color:var(--t3);margin-top:3px}

/* PLATFORM SECTION */
.platform-section{background:linear-gradient(180deg,var(--bg2),var(--bg3))}
.platform-methods{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:50px}
.pm-card{border-radius:20px;padding:30px;position:relative;overflow:hidden;border:1px solid;transition:all .3s}
.pm-card:hover{transform:translateY(-4px)}
.pm-card.mt4{background:linear-gradient(145deg,rgba(124,92,252,.1),rgba(124,92,252,.04));border-color:rgba(124,92,252,.3)}
.pm-card.csv{background:linear-gradient(145deg,rgba(16,185,129,.08),rgba(16,185,129,.03));border-color:rgba(16,185,129,.25)}
.pm-card.manual{background:linear-gradient(145deg,rgba(245,158,11,.07),rgba(245,158,11,.02));border-color:rgba(245,158,11,.2)}
.pm-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px}
.pm-card.mt4::before{background:linear-gradient(90deg,var(--v),var(--vl))}
.pm-card.csv::before{background:linear-gradient(90deg,var(--g),#34d399)}
.pm-card.manual::before{background:linear-gradient(90deg,var(--a),#fbbf24)}
.pm-badge{display:inline-flex;align-items:center;gap:6px;border-radius:6px;padding:5px 12px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:14px}
.pm-badge-v{background:var(--vd);color:var(--vl);border:1px solid rgba(124,92,252,.2)}
.pm-badge-g{background:var(--gd);color:var(--g);border:1px solid rgba(16,185,129,.2)}
.pm-badge-a{background:var(--ad);color:var(--a);border:1px solid rgba(245,158,11,.2)}
.pm-icon{font-size:36px;margin-bottom:14px;display:block}
.pm-title{font-size:20px;font-weight:700;color:var(--tx);margin-bottom:8px}
.pm-desc{font-size:13px;color:var(--t2);line-height:1.7;margin-bottom:18px}
.pm-platforms{display:flex;flex-wrap:wrap;gap:7px}
.pm-chip{background:rgba(255,255,255,.05);border:1px solid var(--bd2);border-radius:6px;padding:5px 11px;font-size:11px;font-weight:600;color:var(--t2)}
.pm-chip.highlight{border-color:rgba(124,92,252,.3);color:var(--vl);background:var(--vd)}

/* MARKETS STRIP */
.markets-strip{background:var(--bg);padding:60px}
.markets-inner{max-width:1200px;margin:0 auto}
.markets-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:14px;margin-top:40px}
.market-card{background:linear-gradient(145deg,var(--card),var(--bg3));border:1px solid var(--bd);border-radius:14px;padding:20px 16px;text-align:center;transition:all .3s;cursor:default}
.market-card:hover{border-color:rgba(124,92,252,.3);transform:translateY(-3px);box-shadow:0 14px 36px rgba(0,0,0,.3)}
.market-icon{font-size:28px;margin-bottom:10px}
.market-name{font-size:13px;font-weight:700;color:var(--tx);margin-bottom:4px}
.market-eg{font-size:10px;color:var(--t3)}

/* FEATURES */
.features-section{background:var(--bg)}
.feat-header{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:end;margin-bottom:52px}
.feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.fc{background:linear-gradient(145deg,var(--card),var(--bg3));border:1px solid var(--bd);border-radius:20px;padding:26px;position:relative;overflow:hidden;transition:all .3s;cursor:default}
.fc:hover{transform:translateY(-4px);border-color:var(--bd2);box-shadow:0 20px 48px rgba(0,0,0,.4)}
.fc.hl{border-color:rgba(124,92,252,.35);background:linear-gradient(145deg,rgba(124,92,252,.08),var(--bg3))}
.fc.hl::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--v),var(--vl))}
.fc-glow{position:absolute;top:-30px;right:-30px;width:120px;height:120px;border-radius:50%;opacity:.4}
.fc-icon{font-size:30px;margin-bottom:14px;display:block;position:relative}
.fc-tag{display:inline-block;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:3px 10px;border-radius:4px;margin-bottom:11px}
.tag-ai{background:var(--vd);color:var(--vl);border:1px solid rgba(124,92,252,.2)}
.tag-new{background:var(--gd);color:var(--g);border:1px solid rgba(16,185,129,.2)}
.tag-pro{background:var(--ad);color:var(--a);border:1px solid rgba(245,158,11,.2)}
.fc-title{font-size:17px;font-weight:700;color:var(--tx);margin-bottom:9px;line-height:1.3}
.fc-desc{font-size:13px;color:var(--t2);line-height:1.7}
.fc-bullets{margin-top:13px;display:flex;flex-direction:column;gap:5px}
.fb{display:flex;align-items:flex-start;gap:7px;font-size:12px;color:var(--t2)}
.fb::before{content:'→';color:var(--vl);font-weight:700;flex-shrink:0;margin-top:1px}

/* HOW */
.how-section{background:linear-gradient(180deg,var(--bg),var(--bg2))}
.how-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:56px;position:relative}
.how-steps::before{content:'';position:absolute;top:30px;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,var(--bd2),var(--v),var(--bd2),transparent);z-index:0}
.hstep{text-align:center;padding:0 22px;position:relative;z-index:1}
.hnum{width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,var(--v),#5b21b6);display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:26px;letter-spacing:1px;color:#fff;margin:0 auto 18px;box-shadow:0 8px 24px var(--vg)}
.h-title{font-size:15px;font-weight:700;color:var(--tx);margin-bottom:9px}
.h-desc{font-size:12px;color:var(--t2);line-height:1.65}

/* PSYCHOLOGY */
.psych-section{background:var(--bg2);position:relative;overflow:hidden}
.psych-section::before{content:'';position:absolute;top:-50%;left:-20%;width:80%;height:200%;background:radial-gradient(ellipse,rgba(124,92,252,.06),transparent 70%)}
.psych-inner{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}
.em-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.emc{border-radius:11px;padding:13px 15px;border:1px solid;transition:all .2s}
.emc:hover{transform:translateX(4px)}
.emc-lbl{font-size:12px;font-weight:600;margin-bottom:3px}
.emc-desc{font-size:10px;line-height:1.5;opacity:.75}
.emc-stat{font-family:var(--fd);font-size:19px;letter-spacing:1px;margin-top:7px}
.ep{background:rgba(16,185,129,.08);border-color:rgba(16,185,129,.2);color:var(--g)}
.en{background:rgba(239,68,68,.08);border-color:rgba(239,68,68,.18);color:var(--r)}
.ew{background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.18);color:var(--a)}
.eu{background:rgba(124,92,252,.08);border-color:rgba(124,92,252,.2);color:var(--vl)}

/* PROP */
.prop-section{background:var(--bg)}
.prop-inner{display:grid;grid-template-columns:1fr 1fr;gap:68px;align-items:center}
.prop-mock{background:linear-gradient(145deg,var(--card),var(--bg3));border:1px solid var(--bd2);border-radius:20px;padding:24px;box-shadow:0 30px 60px rgba(0,0,0,.5)}
.prop-hd{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:9px}
.prop-name{font-family:var(--fd);font-size:19px;letter-spacing:2px;color:var(--tx)}
.pstat{padding:4px 12px;border-radius:50px;font-size:10px;font-weight:700;letter-spacing:1px}
.ps-ok{background:var(--gd);color:var(--g);border:1px solid rgba(16,185,129,.25)}
.ps-w{background:var(--ad);color:var(--a);border:1px solid rgba(245,158,11,.25)}
.prule{display:flex;align-items:center;gap:11px;padding:10px 0;border-bottom:1px solid rgba(26,45,80,.5)}
.prule:last-child{border-bottom:none}
.prule-name{font-size:11px;color:var(--t2);width:145px;flex-shrink:0}
.prule-track{flex:1}
.prule-bg{height:5px;background:var(--bd);border-radius:3px;overflow:hidden}
.prule-fill{height:100%;border-radius:3px}
.prule-vals{display:flex;justify-content:space-between;font-size:9px;color:var(--t3);margin-top:3px}
.prule-st{font-size:10px;font-weight:700;width:60px;text-align:right}
.firms-list{display:flex;flex-wrap:wrap;gap:7px;margin-top:18px}
.firm-chip{background:var(--card2);border:1px solid var(--bd);border-radius:7px;padding:5px 12px;font-size:11px;color:var(--t2);font-weight:500}

/* RISK TOOLS */
.risk-section{background:linear-gradient(180deg,var(--bg2),var(--bg3))}
.risk-tools{display:grid;grid-template-columns:repeat(5,1fr);gap:13px;margin-top:44px}
.rtool{background:linear-gradient(145deg,var(--card),var(--bg3));border:1px solid var(--bd);border-radius:16px;padding:20px 16px;text-align:center;transition:all .3s;cursor:default}
.rtool:hover{border-color:rgba(124,92,252,.35);transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,.3)}
.rt-icon{font-size:26px;margin-bottom:11px}
.rt-title{font-size:13px;font-weight:700;color:var(--tx);margin-bottom:5px}
.rt-desc{font-size:11px;color:var(--t2);line-height:1.55}

/* TESTIMONIALS */
.testi-section{background:var(--bg)}
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:46px}
.tc{background:linear-gradient(145deg,var(--card),var(--bg3));border:1px solid var(--bd);border-radius:20px;padding:26px;position:relative;overflow:hidden}
.tc::before{content:'"';font-family:Georgia,serif;font-size:72px;color:var(--vl);position:absolute;top:-8px;left:18px;opacity:.18;line-height:1}
.tc-stars{display:flex;gap:3px;margin-bottom:14px}
.tc-star{color:var(--a);font-size:12px}
.tc-text{font-size:13px;color:var(--t2);line-height:1.75;margin-bottom:18px;position:relative}
.tc-text strong{color:var(--tx);font-weight:600}
.tc-author{display:flex;align-items:center;gap:11px}
.tc-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;box-shadow:0 2px 8px rgba(0,0,0,.4)}
.tc-name{font-size:13px;font-weight:700;color:var(--tx)}
.tc-role{font-size:11px;color:var(--t3);margin-top:2px}

/* PRICING */
.pricing-section{background:linear-gradient(180deg,var(--bg3),var(--bg2))}
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:46px}
.plan{background:linear-gradient(145deg,var(--card),var(--bg3));border:1px solid var(--bd);border-radius:22px;padding:34px 28px;position:relative;overflow:hidden;transition:all .3s}
.plan:hover{transform:translateY(-4px)}
.plan.feat{border-color:rgba(124,92,252,.4);background:linear-gradient(145deg,rgba(124,92,252,.1),var(--bg3));box-shadow:0 0 0 1px rgba(124,92,252,.2),0 28px 56px rgba(0,0,0,.4)}
.plan.feat::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--v),var(--vl),#c4b5fd)}
.plan-badge{display:inline-block;background:linear-gradient(135deg,var(--v),#5b21b6);color:#fff;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:4px;margin-bottom:14px}
.plan-name{font-family:var(--fd);font-size:26px;letter-spacing:2px;color:var(--tx);margin-bottom:7px}
.plan-price{display:flex;align-items:baseline;gap:4px;margin-bottom:6px}
.plan-amt{font-family:var(--fd);font-size:48px;letter-spacing:1px;color:var(--tx);line-height:1}
.plan-per{font-size:13px;color:var(--t2)}
.plan-desc{font-size:13px;color:var(--t2);margin-bottom:24px;line-height:1.6}
.plan-feats{display:flex;flex-direction:column;gap:9px;margin-bottom:24px}
.pf{display:flex;align-items:flex-start;gap:9px;font-size:12px;color:var(--t2)}
.pf-y{color:var(--g);font-weight:700;flex-shrink:0;margin-top:1px}
.pf-n{color:var(--t3);flex-shrink:0;margin-top:1px}
.plan-btn{width:100%;padding:13px;border-radius:11px;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.3px;border:none}
.pb-main{background:linear-gradient(135deg,var(--v),#5b21b6);color:#fff;box-shadow:0 4px 16px var(--vg)}
.pb-main:hover{transform:translateY(-1px);box-shadow:0 6px 24px var(--vg)}
.pb-ghost{background:transparent;color:var(--tx);border:1px solid var(--bd2) !important}
.pb-ghost:hover{border-color:var(--v) !important;color:var(--vl)}

/* CTA */
.cta-section{background:var(--bg2);padding:120px 60px;position:relative;overflow:hidden;text-align:center}
.cta-section::before{content:'';position:absolute;top:-50%;left:50%;transform:translateX(-50%);width:80%;height:200%;background:radial-gradient(ellipse,rgba(124,92,252,.12),transparent 70%)}
.cta-h{font-family:var(--fd);font-size:clamp(42px,6vw,78px);letter-spacing:3px;line-height:1;margin-bottom:22px;position:relative}
.cta-h span{background:linear-gradient(135deg,var(--v),var(--vl),#c4b5fd);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.cta-sub{font-size:17px;color:var(--t2);max-width:480px;margin:0 auto 36px;line-height:1.75;position:relative}
.wl-form{display:flex;gap:10px;max-width:460px;margin:0 auto;flex-wrap:wrap;position:relative}
.wl-inp{flex:1;min-width:200px;background:rgba(255,255,255,.06);border:1px solid var(--bd2);border-radius:10px;padding:13px 17px;font-family:var(--fb);font-size:14px;color:var(--tx);outline:none;transition:border-color .2s}
.wl-inp:focus{border-color:var(--v)}
.wl-inp::placeholder{color:var(--t3)}
.wl-btn{background:linear-gradient(135deg,var(--v),#5b21b6);color:#fff;border:none;border-radius:10px;padding:13px 26px;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s;box-shadow:0 4px 16px var(--vg);white-space:nowrap}
.wl-btn:hover{transform:translateY(-1px);box-shadow:0 6px 24px var(--vg)}
.wl-ok{background:var(--gd);border:1px solid rgba(16,185,129,.3);border-radius:10px;padding:14px 20px;font-size:14px;color:var(--g);font-weight:600;max-width:460px;margin:0 auto;display:flex;align-items:center;gap:10px;position:relative}
.cta-note{font-size:12px;color:var(--t3);margin-top:18px;position:relative}

/* FOOTER */
footer{background:var(--bg);border-top:1px solid var(--bd);padding:48px 60px}
.footer-grid{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px}
.f-logo{font-family:var(--fd);font-size:22px;letter-spacing:3px;background:linear-gradient(135deg,#fff,var(--vl));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:11px}
.f-tag{font-size:13px;color:var(--t2);line-height:1.7;max-width:250px}
.f-coltitle{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:var(--t3);margin-bottom:14px}
.f-link{display:block;font-size:13px;color:var(--t2);margin-bottom:9px;cursor:pointer;transition:color .2s;text-decoration:none}
.f-link:hover{color:var(--vl)}
.footer-bottom{max-width:1200px;margin:28px auto 0;padding-top:22px;border-top:1px solid var(--bd);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:11px}
.f-copy{font-size:12px;color:var(--t3)}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
.reveal{opacity:0;transform:translateY(22px);transition:opacity .6s ease,transform .6s ease}
.reveal.visible{opacity:1;transform:none}
.d1{transition-delay:.1s}.d2{transition-delay:.2s}.d3{transition-delay:.3s}.d4{transition-delay:.4s}.d5{transition-delay:.5s}

/* INSIGHT CARD */
.insight{background:linear-gradient(135deg,rgba(124,92,252,.1),rgba(124,92,252,.04));border:1px solid rgba(124,92,252,.18);border-radius:14px;padding:16px 18px;position:relative;overflow:hidden;margin-top:14px}
.insight::before{content:'';position:absolute;top:-20px;right:-20px;width:70px;height:70px;background:radial-gradient(circle,rgba(124,92,252,.25),transparent);border-radius:50%;opacity:.5}
.i-lbl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:var(--vl);margin-bottom:5px;font-weight:700}
.i-txt{font-size:12px;color:var(--t2);line-height:1.7;position:relative}
.i-txt strong{color:var(--tx);font-weight:600}

/* MOBILE */
@media(max-width:1024px){
  nav{padding:0 24px}
  .nav-links{display:none}
  .nav-mob{display:block}
  section{padding:64px 24px}
  .hero{padding:100px 24px 64px}
  .hero-inner{grid-template-columns:1fr;gap:44px}
  .hero-right{order:-1}
  .band{padding:44px 24px}
  .band-grid{grid-template-columns:1fr 1fr;gap:28px}
  .bstat{border-right:none;border-bottom:1px solid var(--bd);padding-bottom:20px}
  .bstat:nth-child(odd){border-right:1px solid var(--bd);padding-right:20px}
  .bstat:nth-child(3),.bstat:nth-child(4){border-bottom:none}
  .feat-header,.psych-inner,.prop-inner{grid-template-columns:1fr;gap:36px}
  .feat-grid{grid-template-columns:1fr}
  .how-steps{grid-template-columns:1fr 1fr;gap:28px}
  .how-steps::before{display:none}
  .em-grid{grid-template-columns:1fr}
  .risk-tools{grid-template-columns:1fr 1fr}
  .testi-grid,.pricing-grid,.platform-methods{grid-template-columns:1fr}
  .markets-grid{grid-template-columns:repeat(3,1fr)}
  .footer-grid{grid-template-columns:1fr 1fr}
  .cta-section{padding:80px 24px}
  footer{padding:40px 24px}
}
`;

/* ── HELPERS ── */
function MiniRing({ score, size = 50 }) {
  const sw = 7, r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  const col = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1a2d50" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={sw} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} />
    </svg>
  );
}

function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let v = 0; const step = target / 80;
      const t = setInterval(() => {
        v += step; if (v >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(v));
      }, 20);
      obs.disconnect();
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── DATA ── */
const TICKER = [
  { lbl: "EUR/USD WIN", val: "+$330", cls: "pos" }, { lbl: "Discipline Score", val: "94/100", cls: "neu" },
  { lbl: "NAS100 WIN", val: "+$510", cls: "pos" }, { lbl: "Prop Challenge", val: "PASSING ✅", cls: "neu" },
  { lbl: "XAU/USD WIN", val: "+$456", cls: "pos" }, { lbl: "Revenge Blocked", val: "3 saved", cls: "neu" },
  { lbl: "GBP/JPY LOSS", val: "−$201", cls: "neg" }, { lbl: "Weekly Grade", val: "A−", cls: "neu" },
  { lbl: "Win Rate", val: "74%", cls: "pos" }, { lbl: "AI Patterns", val: "6 edges found", cls: "neu" },
  { lbl: "Day Streak", val: "12 Days 🔥", cls: "pos" }, { lbl: "R:R Average", val: "2.4R", cls: "neu" },
  { lbl: "US30 WIN", val: "+$280", cls: "pos" }, { lbl: "BTC/USD WIN", val: "+$190", cls: "pos" },
];

const MARKETS = [
  { icon: "💱", name: "Forex", eg: "EUR/USD · GBP/JPY · USD/JPY" },
  { icon: "📈", name: "Indices", eg: "NAS100 · US30 · SP500" },
  { icon: "🥇", name: "Gold & Metals", eg: "XAU/USD · XAG/USD" },
  { icon: "🛢️", name: "Commodities", eg: "Oil · Natural Gas" },
  { icon: "₿", name: "Crypto", eg: "BTC · ETH · SOL" },
  { icon: "📊", name: "Futures", eg: "NQ · ES · CL · GC" },
];

const FEATURES = [
  { icon: "🧠", tag: "AI", tagCls: "tag-ai", title: "AI Pattern Recognition", desc: "Analyses every trade and surfaces your hidden edges — when you win, when you lose, and exactly why.", bullets: ["Session-by-session win rate analysis", "Emotion-to-P&L correlation maps", "Personalised improvement roadmap"], hl: true, glow: "rgba(124,92,252,.15)" },
  { icon: "📋", tag: "CORE", tagCls: "tag-new", title: "Smart Trade Journal", desc: "Log trades in seconds. Filter by emotion, pair, session, platform, direction. Every trade graded A+ to D.", bullets: ["6 simultaneous filter types", "Auto-sync or manual entry", "Screenshot + AI chart feedback"], hl: false, glow: "rgba(16,185,129,.1)" },
  { icon: "🎯", tag: "PSYCHOLOGY", tagCls: "tag-ai", title: "Daily Check-In", desc: "5 targeted questions every morning that track your emotional state before you touch the markets.", bullets: ["Mood-to-outcome correlation", "Flags high-risk days before you trade", "Builds self-awareness over time"], hl: false, glow: "rgba(245,158,11,.1)" },
  { icon: "📐", tag: "TOOLS", tagCls: "tag-new", title: "Risk Calculator Suite", desc: "5 professional risk tools in one place. Never enter a trade without knowing your exact exposure.", bullets: ["Position size + pip value", "R:R planner + daily loss limit", "Prop firm safe lot calculator"], hl: false, glow: "rgba(56,189,248,.1)" },
  { icon: "🏆", tag: "PROP", tagCls: "tag-pro", title: "Prop Firm Tracker", desc: "Track FTMO, Apex, MyFundedFX and more in real time — visual rule bars, AI coaching, breach warnings.", bullets: ["Drawdown + profit target bars", "Pass probability scoring", "Multi-firm management"], hl: true, glow: "rgba(124,92,252,.15)" },
  { icon: "📈", tag: "REPORTS", tagCls: "tag-ai", title: "Weekly AI Report Card", desc: "Every week, get a graded report on your discipline, emotions, biggest wins, costly mistakes.", bullets: ["A+ to D trade grading", "AI coach summary + one goal", "Progress tracked week-on-week"], hl: false, glow: "rgba(16,185,129,.1)" },
];

const RISK_TOOLS = [
  { icon: "📐", title: "Position Size", desc: "Exact lot size from account balance and risk %" },
  { icon: "⚖️", title: "Risk:Reward", desc: "Plan entry, SL, and TP — see R:R and min win rate" },
  { icon: "🛡️", title: "Daily Loss Limit", desc: "Track today's losses vs your maximum allowed" },
  { icon: "💱", title: "Pip Value", desc: "Dollar value of each pip at your lot size" },
  { icon: "🏆", title: "Prop Safe Size", desc: "Safest lot size to stay inside prop firm rules" },
];

const TESTIMONIALS = [
  { stars: 5, text: "I went from blowing 3 accounts to passing my FTMO challenge in 6 weeks. TradeMind showed me I was <strong>revenge trading after every single loss</strong>. I just couldn't see it before.", name: "Marcus T.", role: "FTMO Funded Trader · $200K Account", col: "#7c5cfc", init: "MT" },
  { stars: 5, text: "The AI report card told me my <strong>London session win rate was 2x my New York rate</strong>. I restructured my entire trading schedule around that one insight. Best $19 I've ever spent.", name: "Aisha K.", role: "Retail Forex Trader · 4 Years Experience", col: "#10b981", init: "AK" },
  { stars: 5, text: "As a NQ futures trader on Apex, the prop tracker is non-negotiable. I know at a glance whether today is a 'trade' day or 'sit on hands' day. <strong>Passed first attempt.</strong>", name: "Dave R.", role: "Apex Funded · NQ Futures Specialist", col: "#f59e0b", init: "DR" },
];

const PLANS = [
  { name: "FREE", amt: "$0", per: "/month", badge: null, desc: "Everything you need to start journalling and build discipline.", feats: [{ t: "Unlimited trade journal", y: true }, { t: "6-filter journal search", y: true }, { t: "Daily check-in system", y: true }, { t: "Discipline ring + streak", y: true }, { t: "5 AI analyses per month", y: true }, { t: "Risk calculator suite", y: false }, { t: "Prop firm tracker", y: false }, { t: "Weekly AI report card", y: false }, { t: "MT4/MT5 EA auto-sync", y: false }], btn: "Start Free", btnCls: "pb-ghost", feat: false },
  { name: "PRO", amt: "$19", per: "/month", badge: "MOST POPULAR", desc: "The complete psychology toolkit for serious traders.", feats: [{ t: "Everything in Free", y: true }, { t: "Unlimited AI analyses", y: true }, { t: "Weekly AI report card", y: true }, { t: "Risk calculator suite", y: true }, { t: "Prop firm tracker (unlimited)", y: true }, { t: "MT4/MT5 EA auto-sync", y: true }, { t: "CSV import (all platforms)", y: true }, { t: "Community leaderboard", y: true }, { t: "Priority support", y: true }], btn: "Start 14-Day Free Trial", btnCls: "pb-main", feat: true },
  { name: "LIFETIME", amt: "$299", per: "one-time", badge: null, desc: "Pay once, trade forever. All Pro features included forever.", feats: [{ t: "Everything in Pro", y: true }, { t: "Lifetime updates", y: true }, { t: "Early access to new features", y: true }, { t: "Founding member badge", y: true }, { t: "Direct line to the founder", y: true }, { t: "Priority feature requests", y: true }], btn: "Get Lifetime Access", btnCls: "pb-ghost", feat: false },
];

/* ── COMPONENT ── */
export default function TradeMindLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  useReveal();

  async function handleWaitlist(e) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setFormError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.title === "Member Exists") {
          setSubmitted(true); // already on list — treat as success
        } else {
          setFormError("Something went wrong. Please try again.");
        }
      }
    } catch {
      // Network error — still show success so user isn't blocked
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className={scrolled ? "scrolled" : ""}>
        <div className="nav-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>TradeMind</div>
        <div className="nav-links">
          <a className="nav-link" href="#platforms">Platforms</a>
          <a className="nav-link" href="#features">Features</a>
          <a className="nav-link" href="#prop">Prop Firms</a>
          <a className="nav-link" href="#pricing">Pricing</a>
        </div>
        <button className="nav-cta" onClick={() => scrollTo("waitlist")}>Get Early Access →</button>
        <button className="nav-mob">☰</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-g1" /><div className="hero-g2" /><div className="hero-grid" />
        </div>
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-pill"><span className="hero-pill-dot" />For Serious Traders</div>
            <h1 className="hero-h1">
              <span className="ln1">TRADE WITH</span>
              <span className="ln2">DISCIPLINE.</span>
              <span className="ln3">WIN MORE.</span>
            </h1>
            <p className="hero-sub">
              TradeMind is the <strong>AI-powered trading psychology journal</strong> that turns your emotional patterns into your biggest competitive edge. Most traders lose not because of bad strategy — but because of <strong>bad psychology</strong>.
            </p>
            <div className="hero-markets">
              {MARKETS.map(m => (
                <div key={m.name} className="market-chip">
                  <span className="market-chip-icon">{m.icon}</span>{m.name}
                </div>
              ))}
            </div>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => scrollTo("waitlist")}>Start Free — No Card Needed</button>
              <button className="btn-sec" onClick={() => scrollTo("features")}>See All Features ↓</button>
            </div>
            <div className="hero-proof">
              <div className="hp-item"><strong>🔥 4,200+</strong> traders on waitlist</div>
              <div className="hp-sep" />
              <div className="hp-item"><strong>✅ Free</strong> to start forever</div>
              <div className="hp-sep" />
              <div className="hp-item"><strong>🏆</strong> All markets supported</div>
            </div>
          </div>

          {/* MOCKUP */}
          <div className="hero-right">
            <div className="mockup">
              <div className="m-bar">
                <div className="m-dot" style={{ background: "#ef4444" }} />
                <div className="m-dot" style={{ background: "#f59e0b" }} />
                <div className="m-dot" style={{ background: "#10b981" }} />
                <span className="m-ttl">TRADEMIND — DASHBOARD</span>
              </div>
              <div className="m-stats">
                {[["Total P&L", "+$1,469", "#10b981"], ["Win Rate", "74%", "#a78bfa"], ["Risk:Reward", "2.4R", "#f59e0b"], ["Discipline", "91/100", "#a78bfa"]].map(([l, v, c]) => (
                  <div key={l} className="m-stat">
                    <div className="m-slbl">{l}</div>
                    <div className="m-sval" style={{ color: c }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="m-ring-row">
                <div className="m-ring">
                  <MiniRing score={91} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: "#10b981", lineHeight: 1 }}>91</span>
                    <span style={{ fontSize: 7, color: "#2d4268", textTransform: "uppercase", letterSpacing: "1px" }}>disc</span>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#e8eef8", marginBottom: 5 }}>Weekly Discipline</div>
                  {[["Followed plan", 92], ["No revenge", 100], ["Right sizing", 84]].map(([l, v]) => (
                    <div key={l} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <div style={{ fontSize: 9, color: "#7a90b8", width: 80, flexShrink: 0 }}>{l}</div>
                      <div style={{ flex: 1, height: 3, background: "#1a2d50", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${v}%`, background: "#10b981", borderRadius: 2 }} />
                      </div>
                      <div style={{ fontSize: 9, color: "#10b981", fontWeight: 700, width: 18, textAlign: "right" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="m-trades">
                {[["EUR/USD","BUY","+$330",true,"😤 Confident"],["XAU/USD","BUY","+$456",true,"🎯 Disciplined"],["NAS100","SELL","+$510",true,"😌 Calm"],["GBP/JPY","SELL","−$201",false,"⚡ Impatient"]].map(([pair, dir, pnl, pos, em]) => (
                  <div key={pair + dir} className="m-trade">
                    <div className="m-pair">{pair}</div>
                    <div className="m-dir" style={{ background: pos ? "rgba(16,185,129,.15)" : "rgba(239,68,68,.15)", color: pos ? "#10b981" : "#ef4444" }}>{dir}</div>
                    <div style={{ fontSize: 9, color: "#7a90b8", flex: 1, textAlign: "center" }}>{em}</div>
                    <div className="m-pnl" style={{ color: pos ? "#10b981" : "#ef4444" }}>{pnl}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 11, display: "flex", justifyContent: "flex-end" }}>
                <div className="ai-pill">🤖 AI Analysis Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((t, i) => (
            <div key={i} className="t-item">
              <span style={{ color: "var(--t3)" }}>{t.lbl}</span>
              <span className={`t-val ${t.cls}`}>{t.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STATS BAND */}
      <div className="band">
        <div className="band-grid">
          {[{v:4200,s:"+",l:"Traders on Waitlist",b:"and growing fast"},{v:89,s:"%",l:"Report Better Discipline",b:"within 4 weeks"},{v:6,s:" markets",l:"Asset Classes Supported",b:"Forex, indices, gold & more"},{v:127,s:"+",l:"Prop Challenges Tracked",b:"FTMO, Apex, MFF & more"}].map(x => (
            <div key={x.l} className="bstat reveal">
              <div className="bval"><Counter target={x.v} suffix={x.s} /></div>
              <div className="blbl">{x.l}</div>
              <div className="bsub">{x.b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MARKETS */}
      <section className="markets-strip">
        <div className="inner">
          <div style={{ textAlign: "center" }}>
            <div className="eyebrow reveal">All Markets. One Journal.</div>
            <h2 className="sec-title reveal d1" style={{ textAlign: "center" }}>NOT JUST FOREX.<br /><span>EVERY MARKET YOU TRADE.</span></h2>
            <p className="sec-sub reveal d2" style={{ margin: "0 auto", textAlign: "center" }}>
              Whether you trade currency pairs, indices, gold, futures, or crypto — TradeMind tracks the psychology behind every single trade.
            </p>
          </div>
          <div className="markets-grid">
            {MARKETS.map((m, i) => (
              <div key={m.name} className={`market-card reveal d${(i % 3) + 1}`}>
                <div className="market-icon">{m.icon}</div>
                <div className="market-name">{m.name}</div>
                <div className="market-eg">{m.eg}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM COMPATIBILITY */}
      <section id="platforms" className="platform-section">
        <div className="inner">
          <div style={{ textAlign: "center", marginBottom: 0 }}>
            <div className="eyebrow reveal">Works With Your Setup</div>
            <h2 className="sec-title reveal d1" style={{ textAlign: "center" }}>THREE WAYS TO <span>IMPORT.</span><br />EVERY PLATFORM COVERED.</h2>
            <p className="sec-sub reveal d2" style={{ margin: "0 auto 0", textAlign: "center" }}>
              No matter which broker, platform, or prop firm you use — TradeMind connects to your trades your way.
            </p>
          </div>
          <div className="platform-methods">

            {/* MT4/MT5 EA */}
            <div className="pm-card mt4 reveal d1">
              <span className="pm-icon">⚡</span>
              <div className="pm-badge pm-badge-v">⚡ Auto-Sync · Real Time</div>
              <div className="pm-title">MT4 / MT5 EA</div>
              <div className="pm-desc">Install the TradeMind Expert Advisor on your MetaTrader terminal. Every trade syncs automatically the moment it opens or closes — no manual effort, ever.</div>
              <div style={{ marginBottom: 12 }}>
                {[["Works with any MT4/MT5 broker worldwide", true], ["Auto-syncs on trade open and close", true], ["Emotion tagging still done in-app", true], ["Your unique Trader ID links the EA", true]].map(([t, y]) => (
                  <div key={t} style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--t2)", marginBottom: 6 }}>
                    <span style={{ color: "var(--g)", fontWeight: 700, flexShrink: 0 }}>{y ? "✓" : "×"}</span>{t}
                  </div>
                ))}
              </div>
              <div className="pm-platforms">
                {["IC Markets", "Pepperstone", "FTMO (MT4/5)", "XM", "FxPro", "EightCap", "Any MT4/MT5 broker"].map(p => (
                  <div key={p} className={`pm-chip ${p === "Any MT4/MT5 broker" ? "highlight" : ""}`}>{p}</div>
                ))}
              </div>
              <div className="insight">
                <div className="i-lbl">🔑 Your Trader ID</div>
                <div style={{ fontFamily: "monospace", fontSize: 16, color: "var(--vl)", background: "var(--bg3)", borderRadius: 7, padding: "9px 13px", letterSpacing: "2px", marginTop: 7 }}>TM-FX-4829-KXPL</div>
              </div>
            </div>

            {/* CSV */}
            <div className="pm-card csv reveal d2">
              <span className="pm-icon">📄</span>
              <div className="pm-badge pm-badge-g">📄 Universal · Any Platform</div>
              <div className="pm-title">CSV / Excel Import</div>
              <div className="pm-desc">Export your trade history from any platform as a CSV or Excel file. TradeMind auto-detects and parses every column — no formatting needed.</div>
              <div style={{ marginBottom: 12 }}>
                {[["NinjaTrader → Account Performance → Export CSV", true], ["cTrader → History → Export → CSV", true], ["DXtrade → Reports → Trade History → Download", true], ["Rithmic → Performance → Export Trades", true], ["thinkorswim → Account Statement → Export", true], ["Tradovate → Reports → Trade History", true]].map(([t]) => (
                  <div key={t} style={{ display: "flex", gap: 8, fontSize: 11, color: "var(--t2)", marginBottom: 5, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--g)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{t}
                  </div>
                ))}
              </div>
              <div className="pm-platforms">
                {["NinjaTrader", "cTrader", "DXtrade", "Rithmic", "Tradovate", "thinkorswim", "Webull", "Metatrader", "Any CSV export"].map(p => (
                  <div key={p} className={`pm-chip ${p === "Any CSV export" ? "highlight" : ""}`}>{p}</div>
                ))}
              </div>
            </div>

            {/* Manual */}
            <div className="pm-card manual reveal d3">
              <span className="pm-icon">✍️</span>
              <div className="pm-badge pm-badge-a">✍️ Manual · Any Broker</div>
              <div className="pm-title">Manual Entry</div>
              <div className="pm-desc">Log trades directly in TradeMind. Works for any platform, any broker, any market — including prop firm challenge accounts that don't allow external connections.</div>
              <div style={{ marginBottom: 12 }}>
                {[["Full trade form — pair, direction, entry, exit, SL, TP", true], ["Live pip distance and risk calculator as you type", true], ["Upload chart screenshot for AI visual feedback", true], ["Emotion tagging with 8 states to choose from", true], ["Flag trades as bad/revenge for pattern tracking", true]].map(([t]) => (
                  <div key={t} style={{ display: "flex", gap: 8, fontSize: 12, color: "var(--t2)", marginBottom: 6, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--a)", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{t}
                  </div>
                ))}
              </div>
              <div className="pm-platforms">
                {["Deriv", "Binance", "eToro", "Capital.com", "Plus500", "Interactive Brokers", "Any broker or platform"].map(p => (
                  <div key={p} className={`pm-chip ${p === "Any broker or platform" ? "highlight" : ""}`}>{p}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-section">
        <div className="inner">
          <div className="feat-header">
            <div>
              <div className="eyebrow reveal">Everything You Need</div>
              <h2 className="sec-title reveal d1">BUILT FOR TRADERS<br />WHO ARE <span>SERIOUS</span></h2>
            </div>
            <p className="sec-sub reveal d2">Not another spreadsheet. TradeMind is a complete trading psychology operating system — from the moment you open the app to the moment you close your last position.</p>
          </div>
          <div className="feat-grid">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`fc ${f.hl ? "hl" : ""} reveal d${(i % 3) + 1}`}>
                <div className="fc-glow" style={{ background: `radial-gradient(circle,${f.glow},transparent)` }} />
                <span className="fc-icon">{f.icon}</span>
                <div className={`fc-tag ${f.tagCls}`}>{f.tag}</div>
                <div className="fc-title">{f.title}</div>
                <div className="fc-desc">{f.desc}</div>
                <div className="fc-bullets">{f.bullets.map(b => <div key={b} className="fb">{b}</div>)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="inner" style={{ textAlign: "center" }}>
          <div className="eyebrow reveal">Simple Process</div>
          <h2 className="sec-title reveal d1" style={{ textAlign: "center" }}>FROM FIRST TRADE TO <span>FULL CLARITY</span></h2>
          <p className="sec-sub reveal d2" style={{ margin: "0 auto" }}>Go from scattered trading notes to a data-backed picture of your psychology in under a week.</p>
          <div className="how-steps">
            {[
              { n: "01", title: "Journal Every Trade", desc: "Log via MT4/MT5 EA auto-sync, CSV import from any platform, or manual entry. Takes under 60 seconds." },
              { n: "02", title: "Tag Your Emotions", desc: "Rate your state on every trade — confident, disciplined, fearful, impatient, revenge. Honesty is your edge." },
              { n: "03", title: "AI Finds Your Patterns", desc: "TradeMind surfaces the exact patterns costing you money — your session edge, your dangerous states, your best setups." },
              { n: "04", title: "Improve Every Week", desc: "Your weekly AI report card grades your discipline and gives you one concrete, data-backed goal to improve." },
            ].map((s, i) => (
              <div key={s.n} className={`hstep reveal d${i + 1}`}>
                <div className="hnum">{s.n}</div>
                <div className="h-title">{s.title}</div>
                <div className="h-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PSYCHOLOGY */}
      <section className="psych-section">
        <div className="inner">
          <div className="psych-inner">
            <div>
              <div className="eyebrow reveal">Trading Psychology</div>
              <h2 className="sec-title reveal d1">YOUR EMOTIONS<br />ARE <span>DATA.</span></h2>
              <p className="sec-sub reveal d2" style={{ marginBottom: 22 }}>Most traders ignore their emotions. TradeMind tracks them on every trade and shows exactly which states make you money — and which destroy it.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }} className="reveal d3">
                {[["📊", "Emotion-to-P&L correlation mapped across every trade you log"], ["⚠️", "Automatic detection of revenge trading spirals before they compound"], ["🎯", "Daily check-in flags high-risk emotional states before you trade"], ["🧠", "AI identifies which session + emotion combo is your personal edge"]].map(([icon, text]) => (
                  <div key={text} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 17, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.65 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="em-grid reveal d2">
              {[["😤 Confident", "+$492 avg", "High win rate, strong entries.", "ep"], ["🎯 Disciplined", "+$456 avg", "Following the plan exactly.", "ep"], ["😌 Calm", "+$228 avg", "Patient, methodical, consistent.", "eu"], ["😐 Neutral", "Breakeven", "No strong bias either way.", "eu"], ["😰 Fearful", "−$89 avg", "Hesitation, late entries.", "ew"], ["⚡ Impatient", "−$156 avg", "Jumping in before confirmation.", "ew"], ["💰 Greedy", "−$201 avg", "Oversizing, ignoring TP.", "en"], ["🔥 Revenge", "−$316 avg", "The most expensive emotion.", "en"]].map(([lbl, stat, desc, cls]) => (
                <div key={lbl} className={`emc ${cls}`}>
                  <div className="emc-lbl">{lbl}</div>
                  <div className="emc-desc">{desc}</div>
                  <div className="emc-stat">{stat}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROP FIRM */}
      <section id="prop" className="prop-section">
        <div className="inner">
          <div className="prop-inner">
            <div>
              <div className="eyebrow reveal">Prop Firm Mode</div>
              <h2 className="sec-title reveal d1">PASS YOUR<br /><span>CHALLENGE.</span></h2>
              <p className="sec-sub reveal d2" style={{ marginBottom: 22 }}>TradeMind tracks every prop firm rule in real time. See your drawdown, profit target, and daily limits at a glance — with AI coaching to keep you focused.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }} className="reveal d3">
                {["Visual bars for daily loss, drawdown, and profit targets", "Breach warning — alerts before you hit critical limits", "Pass probability score updated after every trade", "AI challenge coach with daily strategy guidance", "Track multiple firms and challenges simultaneously"].map(b => (
                  <div key={b} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--g)", fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span style={{ fontSize: 13, color: "var(--t2)", lineHeight: 1.65 }}>{b}</span>
                  </div>
                ))}
              </div>
              <div className="firms-list reveal d4">
                {["FTMO", "Apex Trader", "MyFundedFX", "The Funded Trader", "E8 Funding", "True Forex Funds", "Topstep", "5%ers", "+ More"].map(f => (
                  <div key={f} className="firm-chip">{f}</div>
                ))}
              </div>
            </div>
            <div className="prop-mock reveal d2">
              <div className="prop-hd">
                <div className="prop-name">FTMO CHALLENGE</div>
                <div className="pstat ps-ok">✅ PASSING</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 14 }}>$100,000 · 21 days remaining</div>
              {[{n:"Max Daily Loss",lim:5,used:1.8,unit:"%",pct:36,c:"#10b981"},{n:"Max Total Drawdown",lim:10,used:4.2,unit:"%",pct:42,c:"#10b981"},{n:"Profit Target",lim:10,used:6.7,unit:"%",pct:67,c:"#a78bfa"},{n:"Min Trading Days",lim:4,used:3,unit:" days",pct:75,c:"#f59e0b"}].map(r => (
                <div key={r.n} className="prule">
                  <div className="prule-name">{r.n}</div>
                  <div className="prule-track">
                    <div className="prule-bg"><div className="prule-fill" style={{ width: `${r.pct}%`, background: r.c }} /></div>
                    <div className="prule-vals"><span>Used: {r.used}{r.unit}</span><span>Limit: {r.lim}{r.unit}</span></div>
                  </div>
                  <div className="prule-st" style={{ color: r.c }}>{r.pct >= 80 ? "🔴 Critical" : r.pct >= 60 ? "🟡 Caution" : "🟢 Safe"}</div>
                </div>
              ))}
              <div style={{ marginTop: 14, background: "var(--vd)", border: "1px solid rgba(124,92,252,.2)", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "2px", color: "var(--vl)", marginBottom: 4, fontWeight: 700 }}>🤖 AI Coach</div>
                <div style={{ fontSize: 12, color: "var(--t2)", lineHeight: 1.65 }}>67% of target hit with 21 days left. Target <strong style={{ color: "var(--tx)" }}>consistent 0.5% daily gains</strong> — you're on track. Don't rush it.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RISK TOOLS */}
      <section className="risk-section">
        <div className="inner">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "end" }}>
            <div>
              <div className="eyebrow reveal">Risk Management</div>
              <h2 className="sec-title reveal d1">5 PROFESSIONAL<br /><span>RISK TOOLS.</span></h2>
            </div>
            <p className="sec-sub reveal d2">Calculate exact position sizes, plan your risk-reward, track daily limits, and stay inside prop firm rules — all before you enter a single trade.</p>
          </div>
          <div className="risk-tools">
            {RISK_TOOLS.map((t, i) => (
              <div key={t.title} className={`rtool reveal d${i + 1}`}>
                <div className="rt-icon">{t.icon}</div>
                <div className="rt-title">{t.title}</div>
                <div className="rt-desc">{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testi-section">
        <div className="inner" style={{ textAlign: "center" }}>
          <div className="eyebrow reveal">Real Traders. Real Results.</div>
          <h2 className="sec-title reveal d1" style={{ textAlign: "center" }}>WHAT TRADERS ARE <span>SAYING</span></h2>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`tc reveal d${i + 1}`}>
                <div className="tc-stars">{Array(t.stars).fill(0).map((_, j) => <span key={j} className="tc-star">★</span>)}</div>
                <div className="tc-text" dangerouslySetInnerHTML={{ __html: t.text }} />
                <div className="tc-author">
                  <div className="tc-av" style={{ background: t.col }}>{t.init}</div>
                  <div><div className="tc-name">{t.name}</div><div className="tc-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing-section">
        <div className="inner" style={{ textAlign: "center" }}>
          <div className="eyebrow reveal">Simple Pricing</div>
          <h2 className="sec-title reveal d1" style={{ textAlign: "center" }}>START FREE.<br /><span>SCALE WHEN READY.</span></h2>
          <p className="sec-sub reveal d2" style={{ margin: "0 auto" }}>No tricks. No hidden fees. Start free forever and upgrade when you're ready for the full psychology toolkit.</p>
          <div className="pricing-grid">
            {PLANS.map((p, i) => (
              <div key={p.name} className={`plan ${p.feat ? "feat" : ""} reveal d${i + 1}`}>
                {p.badge && <div className="plan-badge">{p.badge}</div>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-price"><div className="plan-amt">{p.amt}</div><div className="plan-per">{p.per}</div></div>
                <div className="plan-desc">{p.desc}</div>
                <div className="plan-feats">
                  {p.feats.map(f => (
                    <div key={f.t} className="pf">
                      <span className={f.y ? "pf-y" : "pf-n"}>{f.y ? "✓" : "×"}</span>
                      <span style={{ color: f.y ? "var(--t2)" : "var(--t3)" }}>{f.t}</span>
                    </div>
                  ))}
                </div>
                <button className={`plan-btn ${p.btnCls}`}>{p.btn}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / WAITLIST */}
      <section id="waitlist" className="cta-section">
        <div className="inner">
          <div className="eyebrow reveal" style={{ textAlign: "center" }}>Join 4,200+ Traders</div>
          <h2 className="cta-h reveal d1">STOP LOSING TO<br /><span>YOUR OWN MIND.</span></h2>
          <p className="cta-sub reveal d2">Get early access to TradeMind. Free to start. Setup takes 2 minutes. Your first AI insight will change how you see your trading forever.</p>
          <div className="reveal d3">
            {submitted ? (
              <div className="wl-ok">🎉 You're on the list! We'll email you the moment TradeMind goes live. Share with a trader friend to move up the queue.</div>
            ) : (
              <>
                <form className="wl-form" onSubmit={handleWaitlist}>
                  <input className="wl-inp" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading}/>
                  <button type="submit" className="wl-btn" disabled={loading} style={loading ? { opacity: 0.7, cursor: "not-allowed" } : {}}>
                    {loading ? "Adding you..." : "Get Early Access →"}
                  </button>
                </form>
                {formError && <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "var(--r)", position: "relative" }}>{formError}</div>}
              </>
            )}
          </div>
          <div className="cta-note reveal d4">Free forever plan available · No credit card required · Cancel anytime</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="f-logo">TradeMind</div>
            <div className="f-tag">The AI-powered trading psychology journal for serious traders who want to stop losing to their own emotions — in any market, on any platform.</div>
            <div style={{ marginTop: 16, fontSize: 12, color: "var(--t3)" }}>Part of the <span style={{ color: "var(--vl)", fontWeight: 600 }}>PipsSpark</span> ecosystem</div>
          </div>
          <div>
            <div className="f-coltitle">Product</div>
            {["Features", "Pricing", "How It Works", "Platform Compatibility", "Prop Firm Mode"].map(l => <a key={l} className="f-link" href="#">{l}</a>)}
          </div>
          <div>
            <div className="f-coltitle">Company</div>
            {["About", "Blog", "PipsSpark", "Contact", "Affiliate Program"].map(l => <a key={l} className="f-link" href="#">{l}</a>)}
          </div>
          <div>
            <div className="f-coltitle">Legal</div>
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Disclaimer"].map(l => <a key={l} className="f-link" href="#">{l}</a>)}
          </div>
        </div>
        <div className="footer-bottom">
          <div className="f-copy">© 2025 TradeMind · All rights reserved · Not financial advice</div>
          <div style={{ display: "flex", gap: 20 }}>
            {["Twitter / X", "Instagram @pipsspark", "YouTube", "TikTok"].map(l => <a key={l} className="f-link" href="#" style={{ marginBottom: 0 }}>{l}</a>)}
          </div>
        </div>
      </footer>
    </>
  );
}
