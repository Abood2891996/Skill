/**
 * Builds docs/JoDesx-Website-Guide.pdf from the HTML parts in docs/guide/.
 *
 *   node scripts/build-guide.cjs
 *
 * Requires Playwright with Chromium (not a project dependency):
 *   npm i -D playwright && npx playwright install chromium
 * Edit the content in docs/guide/*.html, then run this script.
 */
const { chromium } = require("playwright");
const { readFileSync, readdirSync, writeFileSync } = require("node:fs");
const { join } = require("node:path");
const { pathToFileURL } = require("node:url");

const root = join(__dirname, "..");
const guideDir = join(root, "docs/guide");
const out = join(root, "docs/JoDesx-Website-Guide.pdf");
const font = (f) => pathToFileURL(join(root, "src/app/fonts", f)).href;
const svg = (f) => readFileSync(join(root, "public/brand", f), "utf8").replace(/<title[^>]*>.*?<\/title>/, "");

const parts = readdirSync(guideDir)
  .filter((f) => /^\d+-.*\.html$/.test(f))
  .sort()
  .map((f) => readFileSync(join(guideDir, f), "utf8"))
  .join("\n");

// Table of contents from the h1/h2 headings of each section.
const toc = [];
for (const m of parts.matchAll(/<section[^>]*id="([^"]+)"[^>]*>[\s\S]*?<(h1|h2)>([\s\S]*?)<\/\2>/g)) {
  const text = m[3].replace(/<span class="num">([^<]+)<\/span>/, "$1 ·").replace(/<[^>]+>/g, "").trim();
  toc.push({ id: m[1], text, level: m[2] });
}
const tocHtml = toc
  .map((t) => `<li class="${t.level === "h1" ? "toc-part" : ""}"><a href="#${t.id}">${t.text}</a></li>`)
  .join("");

const updated = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>JoDesx Website Guide</title>
<style>
@font-face { font-family: "Instrument Sans"; src: url("${font("InstrumentSans-Variable.woff2")}") format("woff2"); font-weight: 400 700; font-stretch: 75% 100%; }
:root { --navy:#0B1220; --slate:#172438; --cyan:#35D6E8; --cyan7:#0B7483; --violet:#786BFF; --violet6:#5B4FE0; --soft:#F4F7FB; --ink:#0B1220; --muted:#4A5970; --line:#DCE3EE; }
@page { size: A4; margin: 18mm 17mm 20mm; @bottom-left { content: "JoDesx website guide"; font: 500 8pt "Instrument Sans"; color: #8C9AB0; } @bottom-right { content: counter(page); font: 600 8pt "Instrument Sans"; color: #4A5970; } }
@page :first { margin: 0; @bottom-left { content: none; } @bottom-right { content: none; } }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: "Instrument Sans", sans-serif; font-size: 9.6pt; line-height: 1.55; color: var(--ink); }
h1, h2, h3 { font-weight: 600; line-height: 1.12; margin: 0; break-after: avoid; }
h1 { font-size: 30pt; font-stretch: 80%; letter-spacing: -0.02em; }
h2 { font-size: 18pt; font-stretch: 82%; letter-spacing: -0.015em; margin: 0 0 9pt; padding-top: 2pt; }
h2 .num { display: inline-block; min-width: 28pt; margin-right: 6pt; padding: 1pt 6pt; border-radius: 5pt; background: var(--navy); color: var(--cyan); font-size: 11pt; font-stretch: 100%; text-align: center; vertical-align: 3pt; }
h3 { font-size: 11.5pt; margin: 14pt 0 6pt; }
p { margin: 0 0 7pt; }
ul, ol { margin: 0 0 8pt; padding-left: 15pt; }
li { margin: 2pt 0; }
code { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 8.3pt; background: #EEF2F8; border-radius: 3pt; padding: 0.5pt 3pt; color: #1B2A44; word-break: break-word; }
pre { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 7.8pt; line-height: 1.5; background: var(--navy); color: #D6DEEA; padding: 9pt 11pt; border-radius: 6pt; white-space: pre-wrap; margin: 4pt 0 10pt; break-inside: avoid; }
pre code { background: none; color: inherit; padding: 0; }
a { color: var(--cyan7); text-decoration: none; }
table { width: 100%; border-collapse: collapse; margin: 4pt 0 11pt; font-size: 8.7pt; break-inside: auto; }
th { text-align: left; font-weight: 600; background: var(--navy); color: #F4F7FB; padding: 5pt 7pt; }
th:first-child { border-top-left-radius: 5pt; } th:last-child { border-top-right-radius: 5pt; }
td { padding: 5pt 7pt; border-bottom: 1px solid var(--line); vertical-align: top; }
tr { break-inside: avoid; }
tbody tr:nth-child(even) td { background: #F7F9FC; }
table.compact td, table.compact th { padding: 4pt 6pt; }
section { margin-bottom: 14pt; }
section { margin-top: 16pt; }
.part-cover { break-before: page; break-after: page; margin-top: 0; }
.lead { font-size: 12pt; color: var(--muted); max-width: 135mm; }
.callout { border-radius: 6pt; padding: 8pt 11pt 3pt; margin: 6pt 0 11pt; break-inside: avoid; border-left: 3pt solid; }
.callout.tip { background: #EEF0FF; border-color: var(--violet6); }
.callout.warn { background: #FFF6E8; border-color: #E0A030; }
.callout ul { margin-bottom: 5pt; }
ol.steps { counter-reset: s; list-style: none; padding-left: 0; }
ol.steps > li { counter-increment: s; position: relative; padding-left: 20pt; margin: 4pt 0; }
ol.steps > li::before { content: counter(s); position: absolute; left: 0; top: 0.5pt; width: 13pt; height: 13pt; border-radius: 3pt; background: var(--navy); color: var(--cyan); font-size: 7.5pt; font-weight: 600; text-align: center; line-height: 13pt; }
ol.steps[start="2"] { counter-reset: s 1; }
ul.checklist { list-style: none; padding-left: 0; }
ul.checklist li { position: relative; padding-left: 17pt; }
ul.checklist li::before { content: ""; position: absolute; left: 0; top: 2.5pt; width: 9pt; height: 9pt; border: 1.5px solid var(--violet6); border-radius: 2pt; }
.flow { display: flex; gap: 0; margin: 6pt 0 11pt; break-inside: avoid; }
.flow > div { flex: 1; background: var(--soft); border: 1px solid var(--line); padding: 7pt 9pt; position: relative; }
.flow > div:first-child { border-radius: 6pt 0 0 6pt; } .flow > div:last-child { border-radius: 0 6pt 6pt 0; }
.flow > div + div { border-left: none; }
.flow > div + div::before { content: ""; position: absolute; left: -4pt; top: 50%; width: 7pt; height: 7pt; background: var(--violet); transform: translateY(-50%); }
.flow strong { display: block; font-size: 9.5pt; } .flow span { font-size: 8.3pt; color: var(--muted); }
dl.glossary { display: grid; grid-template-columns: 34mm 1fr; gap: 5pt 10pt; margin: 0; }
dl.glossary dt { font-weight: 600; } dl.glossary dd { margin: 0; color: #24324A; }
.two-col { display: grid; grid-template-columns: 1fr 1.2fr; gap: 12pt; align-items: start; }
table.trouble td:first-child { font-weight: 600; }
/* Cover */
.cover { height: 297mm; background: var(--navy); color: #F4F7FB; padding: 26mm 22mm; position: relative; overflow: hidden; break-after: page; }
.cover .grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(244,247,251,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,247,251,.05) 1px, transparent 1px); background-size: 12mm 12mm; }
.cover .logo svg { height: 13mm; width: auto; }
.cover h1 { font-size: 46pt; margin-top: 62mm; max-width: 150mm; line-height: 0.98; color: #F4F7FB; }
.cover p { color: #B4BFD0; font-size: 13pt; max-width: 130mm; margin-top: 10mm; }
.cover .meta { position: absolute; left: 22mm; bottom: 24mm; font-size: 9pt; color: #8C9AB0; }
.cover .lanes { position: absolute; right: -10mm; top: 150mm; width: 150mm; }
/* Part covers */
.part-cover { background: var(--soft); border-radius: 10pt; padding: 18mm 14mm; margin-bottom: 0; }
.part-label { display: inline-block; font-weight: 600; color: var(--violet6); margin-bottom: 6mm; }
.part-label::before { content: ""; display: inline-block; width: 7pt; height: 7pt; background: var(--violet6); margin-right: 6pt; }
.part-cover h1 { margin-bottom: 6mm; }
/* TOC */
.toc { break-after: page; }
.toc h1 { font-size: 24pt; margin-bottom: 5mm; }
.toc ol { list-style: none; padding: 0; columns: 1; }
.toc li { padding: 2.1pt 0; border-bottom: 1px solid var(--line); font-size: 9.6pt; }
.toc li a { color: var(--ink); }
.toc li.toc-part { border: none; padding-top: 9pt; font-weight: 600; font-size: 12pt; color: var(--violet6); }
.toc li.toc-part a { color: var(--violet6); }
.toc .hint { color: var(--muted); font-size: 9pt; margin: -2mm 0 2mm; }
</style></head><body>
<div class="cover">
  <div class="grid"></div>
  <div class="logo">${svg("jodesx-logo-horizontal-dark.svg")}</div>
  <h1>Website guide</h1>
  <p>How the JoDesx website, its hosting on Vercel, its email and its code work — and how to edit, extend and fix every part of it.</p>
  <svg class="lanes" viewBox="0 0 600 260" fill="none">
    <path d="M0 40H380Q410 40 410 70V100Q410 130 440 130H560" stroke="#F4F7FB" stroke-opacity=".18" stroke-width="2"/>
    <path d="M0 130H560" stroke="#35D6E8" stroke-width="2.5"/>
    <path d="M0 220H380Q410 220 410 190V160Q410 130 440 130H560" stroke="#F4F7FB" stroke-opacity=".18" stroke-width="2"/>
    <rect x="186" y="10" width="26" height="240" rx="8" fill="#172438" stroke="#F4F7FB" stroke-opacity=".15"/>
    <rect x="296" y="10" width="26" height="240" rx="8" fill="#172438" stroke="#F4F7FB" stroke-opacity=".15"/>
    <rect x="195" y="126" width="8" height="8" fill="#35D6E8"/><rect x="305" y="126" width="8" height="8" fill="#35D6E8"/>
    <rect x="558" y="118" width="24" height="24" rx="3" fill="#786BFF"/>
  </svg>
  <div class="meta">www.jodesx.com · Updated ${updated}<br>Part A: for the owner (no coding) · Part B: for developers</div>
</div>
<div class="toc">
  <h1>Contents</h1>
  <p class="hint">Tap any line to jump to that chapter.</p>
  <ol>${tocHtml}</ol>
</div>
${parts}
</body></html>`;

(async () => {
  const tmp = join(guideDir, ".guide-build.html");
  writeFileSync(tmp, html);
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true, outline: true, tagged: true });
  await browser.close();
  require("node:fs").unlinkSync(tmp);
  console.log("Wrote", out);
})();
