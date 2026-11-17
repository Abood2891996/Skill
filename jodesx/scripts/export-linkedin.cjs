/**
 * LinkedIn company-page assets.
 *   node scripts/export-linkedin.cjs
 * Outputs public/brand/linkedin/: logo (400×400) and cover (1128×191, exported at 2×).
 */
const { chromium } = require("playwright");
const { readFileSync, writeFileSync, unlinkSync } = require("node:fs");
const { tmpdir } = require("node:os");
const { join } = require("node:path");
const { pathToFileURL } = require("node:url");

const root = join(__dirname, "..");
const out = (f) => join(root, "public/brand/linkedin", f);
const brand = (f) => readFileSync(join(root, "public/brand", f), "utf8").replace(/<title[^>]*>.*?<\/title>/, "");
const font = pathToFileURL(join(root, "src/app/fonts/InstrumentSans-Variable.woff2")).href;

const cover = `<!doctype html><html><head><style>
@font-face { font-family: "Instrument Sans"; src: url("${font}"); font-weight: 400 700; font-stretch: 75% 100%; }
html, body { margin: 0; }
.c { width: 1128px; height: 191px; background: #0B1220; position: relative; overflow: hidden; font-family: "Instrument Sans"; color: #F4F7FB; }
.grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(244,247,251,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(244,247,251,.045) 1px, transparent 1px); background-size: 24px 24px; }
.t { position: absolute; left: 290px; top: 52px; width: 560px; }
.h { font-size: 31px; font-weight: 600; font-stretch: 80%; letter-spacing: -0.02em; line-height: 1.05; }
.s { margin-top: 12px; font-size: 13.5px; color: #B4BFD0; letter-spacing: .005em; }
.s b { color: #7FE6F1; font-weight: 600; }
svg.l { position: absolute; right: 20px; top: 0; }
</style></head><body><div class="c"><div class="grid"></div>
<div class="t"><div class="h">Operations, structured around your business.</div>
<div class="s">Content moderation · Customer support · Back-office · AI data operations</div><div class="s"><b>www.jodesx.com</b></div></div>
<svg class="l" width="300" height="191" viewBox="0 0 300 191" fill="none">
  <path d="M0 38H150Q170 38 170 58V75Q170 95 190 95H262" stroke="#F4F7FB" stroke-opacity=".18" stroke-width="1.5"/>
  <path d="M0 95H262" stroke="#35D6E8" stroke-width="2"/>
  <path d="M0 152H150Q170 152 170 132V115Q170 95 190 95H262" stroke="#F4F7FB" stroke-opacity=".18" stroke-width="1.5"/>
  <rect x="62" y="22" width="16" height="147" rx="5" fill="#172438" stroke="#F4F7FB" stroke-opacity=".15"/>
  <rect x="112" y="22" width="16" height="147" rx="5" fill="#172438" stroke="#F4F7FB" stroke-opacity=".15"/>
  <rect x="67" y="91" width="6" height="6" fill="#35D6E8"/><rect x="117" y="91" width="6" height="6" fill="#35D6E8"/>
  <rect x="262" y="85" width="20" height="20" rx="3" fill="#786BFF"/>
</svg></div></body></html>`;


const launch = `<!doctype html><html><head><style>
@font-face { font-family: "Instrument Sans"; src: url("${font}"); font-weight: 400 700; font-stretch: 75% 100%; }
html, body { margin: 0; }
.c { width: 1080px; height: 1350px; background: #0B1220; position: relative; overflow: hidden; font-family: "Instrument Sans"; color: #F4F7FB; }
.grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(244,247,251,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(244,247,251,.045) 1px, transparent 1px); background-size: 54px 54px; }
.logo { position: absolute; left: 96px; top: 96px; } .logo svg { height: 54px; width: auto; display: block; }
.badge { position: absolute; left: 96px; top: 300px; display: inline-flex; align-items: center; gap: 14px; font-size: 26px; font-weight: 500; color: #B4BFD0; }
.badge i { width: 14px; height: 14px; border-radius: 50%; background: #35D6E8; box-shadow: 0 0 0 8px rgba(53,214,232,.15); }
.h { position: absolute; left: 96px; top: 360px; width: 880px; font-size: 104px; font-weight: 600; font-stretch: 80%; letter-spacing: -0.03em; line-height: 0.98; }
.svc { position: absolute; left: 96px; top: 1010px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px 48px; font-size: 27px; color: #D6DEEA; }
.svc div { display: flex; align-items: center; gap: 16px; } .svc div::before { content: ""; width: 12px; height: 12px; background: #786BFF; flex: none; }
.url { position: absolute; left: 96px; bottom: 96px; font-size: 30px; font-weight: 600; color: #7FE6F1; letter-spacing: .01em; }
.loc { position: absolute; right: 96px; bottom: 98px; font-size: 24px; color: #8C9AB0; }
svg.lanes { position: absolute; left: 0; top: 760px; }
</style></head><body><div class="c"><div class="grid"></div>
<div class="logo">${brand("jodesx-logo-horizontal-dark.svg")}</div>
<div class="badge"><i></i>Now live</div>
<div class="h">Operations, structured around your business.</div>
<svg class="lanes" width="1080" height="200" viewBox="0 0 1080 200" fill="none">
  <path d="M0 40H700Q740 40 740 80V80Q740 100 780 100H930" stroke="#F4F7FB" stroke-opacity=".16" stroke-width="2.5"/>
  <path d="M0 100H930" stroke="#35D6E8" stroke-width="3.5"/>
  <path d="M0 160H700Q740 160 740 120V120Q740 100 780 100H930" stroke="#F4F7FB" stroke-opacity=".16" stroke-width="2.5"/>
  <rect x="430" y="10" width="34" height="180" rx="10" fill="#172438" stroke="#F4F7FB" stroke-opacity=".15"/>
  <rect x="580" y="10" width="34" height="180" rx="10" fill="#172438" stroke="#F4F7FB" stroke-opacity=".15"/>
  <rect x="441" y="94" width="12" height="12" fill="#35D6E8"/><rect x="591" y="94" width="12" height="12" fill="#35D6E8"/>
  <rect x="930" y="80" width="40" height="40" rx="5" fill="#786BFF"/>
</svg>
<div class="svc"><div>Content moderation</div><div>Customer support</div><div>Back-office operations</div><div>AI data operations</div></div>
<div class="url">www.jodesx.com</div><div class="loc">Jordan · Remote or on-site</div>
</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  // Logo: symbol on the navy tile, 400×400 (LinkedIn's recommended size).
  let p = await b.newPage({ viewport: { width: 400, height: 400 } });
  await p.setContent(`<body style="margin:0">${brand("jodesx-social-avatar.svg").replace("<svg", '<svg style="width:400px;height:400px;display:block"')}</body>`);
  await p.screenshot({ path: out("jodesx-linkedin-logo-400.png") });
  await p.close();
  // Cover: 1128×191 layout rendered at 2× for sharpness on high-density screens.
  p = await b.newPage({ viewport: { width: 1128, height: 191 }, deviceScaleFactor: 2 });
  // Load from a real file so the local @font-face URL is allowed.
  const tmp = join(tmpdir(), `jodesx-cover-${process.pid}.html`);
  writeFileSync(tmp, cover);
  await p.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const loaded = await p.evaluate(() => document.fonts.check('600 31px "Instrument Sans"'));
  if (!loaded) throw new Error("Brand font failed to load");
  await p.screenshot({ path: out("jodesx-linkedin-cover-2256x382.png") });
  unlinkSync(tmp);
  // Launch post image: 1080×1350 (4:5 portrait, best use of the mobile feed).
  p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const tmp2 = join(tmpdir(), `jodesx-launch-${process.pid}.html`);
  writeFileSync(tmp2, launch);
  await p.goto(pathToFileURL(tmp2).href, { waitUntil: "networkidle" });
  if (!(await p.evaluate(() => document.fonts.check('600 104px "Instrument Sans"')))) throw new Error("Brand font failed to load");
  await p.screenshot({ path: out("jodesx-linkedin-launch-1080x1350.png") });
  unlinkSync(tmp2);
  await b.close();
  console.log("LinkedIn assets written to public/brand/linkedin/");
})();
