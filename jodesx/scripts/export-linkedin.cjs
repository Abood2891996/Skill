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
  await b.close();
  console.log("LinkedIn assets written to public/brand/linkedin/");
})();
