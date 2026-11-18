/**
 * Builds the JoDesx security documents (PDF) from docs/security/src/*.html.
 *
 *   node scripts/build-security-docs.cjs
 *
 * Each source file starts with an HTML comment holding JSON metadata:
 *   <!-- {"title": "...", "subtitle": "...", "audience": "...", "output": "File-Name.pdf"} -->
 * Requires Playwright with Chromium (see README → Quality checks).
 */
const { chromium } = require("playwright");
const { readFileSync, readdirSync, writeFileSync, unlinkSync } = require("node:fs");
const { join } = require("node:path");
const { pathToFileURL } = require("node:url");

const root = join(__dirname, "..");
const srcDir = join(root, "docs/security/src");
const outDir = join(root, "docs/security");
const font = pathToFileURL(join(root, "src/app/fonts/InstrumentSans-Variable.woff2")).href;
const logo = readFileSync(join(root, "public/brand/jodesx-logo-horizontal-dark.svg"), "utf8").replace(/<title[^>]*>.*?<\/title>/, "");

const cssFor = (footer) => `
@font-face { font-family: "Instrument Sans"; src: url("${font}"); font-weight: 400 700; font-stretch: 75% 100%; }
@page { size: A4; margin: 18mm 18mm 20mm; @bottom-left { content: "${footer}"; font: 500 7.5pt "Instrument Sans"; color: #8C9AB0; } @bottom-right { content: counter(page) " / " counter(pages); font: 600 7.5pt "Instrument Sans"; color: #4A5970; } }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: "Instrument Sans", sans-serif; font-size: 9.7pt; line-height: 1.55; color: #0B1220; }
.band { background: #0B1220; color: #F4F7FB; margin: 0 0 8mm; padding: 11mm 11mm 9mm; border-radius: 4mm; position: relative; overflow: hidden; }
.band::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(rgba(244,247,251,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(244,247,251,.05) 1px, transparent 1px); background-size: 9mm 9mm; }
.band > * { position: relative; z-index: 1; }
.band svg { height: 9mm; width: auto; display: block; }
.band h1 { font-size: 25pt; font-weight: 600; font-stretch: 80%; letter-spacing: -0.02em; line-height: 1.02; margin: 9mm 0 0; }
.band .sub { color: #B4BFD0; font-size: 11pt; margin-top: 3mm; max-width: 140mm; }
.band .meta { display: flex; flex-wrap: wrap; gap: 4mm 9mm; margin-top: 7mm; font-size: 8.5pt; color: #8C9AB0; }
.band .meta b { color: #7FE6F1; font-weight: 600; }
h2 { font-size: 13.5pt; font-weight: 600; font-stretch: 85%; letter-spacing: -0.01em; margin: 7mm 0 2.5mm; break-after: avoid; }
h2 .n { display: inline-block; min-width: 7mm; color: #5B4FE0; }
h3 { font-size: 10.5pt; margin: 4mm 0 1.5mm; break-after: avoid; }
p { margin: 0 0 2.5mm; }
ul, ol { margin: 0 0 3mm; padding-left: 5mm; } li { margin: 1mm 0; }
ul.sq { list-style: none; padding-left: 0; } ul.sq li { position: relative; padding-left: 5mm; }
ul.sq li::before { content: ""; position: absolute; left: 0; top: 1.6mm; width: 1.8mm; height: 1.8mm; background: #5B4FE0; }
ul.check { list-style: none; padding-left: 0; } ul.check li { position: relative; padding-left: 7mm; break-inside: avoid; }
ul.check li::before { content: ""; position: absolute; left: 0; top: 0.6mm; width: 3.4mm; height: 3.4mm; border: 1.3px solid #0B1220; border-radius: 0.8mm; }
.summary { background: #F4F7FB; border: 1px solid #DCE3EE; border-radius: 3mm; padding: 4.5mm 5.5mm 2mm; margin: 0 0 4mm; break-inside: avoid; }
.summary h2 { margin-top: 0; }
.note { border-left: 1mm solid #E0A030; background: #FFF6E8; border-radius: 1.5mm; padding: 3mm 4.5mm 1mm; margin: 3mm 0 4mm; break-inside: avoid; font-size: 9pt; }
.draft { border-left: 1mm solid #C2334A; background: #FDEEF0; border-radius: 1.5mm; padding: 3mm 4.5mm 1mm; margin: 0 0 4mm; font-size: 9pt; }
table { width: 100%; border-collapse: collapse; margin: 1.5mm 0 4mm; font-size: 8.8pt; }
th { text-align: left; background: #0B1220; color: #F4F7FB; padding: 2mm 2.5mm; font-weight: 600; }
td { padding: 2mm 2.5mm; border-bottom: 1px solid #DCE3EE; vertical-align: top; } tr { break-inside: avoid; }
.legal { text-align: right; font-weight: 600; font-size: 10pt; padding: 2.5mm 4mm; background: #F4F7FB; border-right: 1mm solid #5B4FE0; border-radius: 1mm; margin: 2mm 0 3mm; }
.sign { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 8mm; break-inside: avoid; }
.sign div { border-top: 1px solid #0B1220; padding-top: 2mm; font-size: 8.5pt; color: #4A5970; min-height: 14mm; }
.section { break-inside: auto; }
`;

const files = readdirSync(srcDir).filter((f) => f.endsWith(".html")).sort();

(async () => {
  const browser = await chromium.launch();
  for (const file of files) {
    const raw = readFileSync(join(srcDir, file), "utf8");
    const meta = JSON.parse(/<!--\s*(\{[\s\S]*?\})\s*-->/.exec(raw)[1]);
    const body = raw.replace(/<!--[\s\S]*?-->/, "");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${meta.title}</title><style>${cssFor(`JoDesx · ${meta.title}${meta.draft ? " · DRAFT" : ""}`)}</style></head><body>
<div class="band">${logo}<h1>${meta.title}</h1>${meta.subtitle ? `<div class="sub">${meta.subtitle}</div>` : ""}
<div class="meta"><span><b>Audience</b>&nbsp; ${meta.audience}</span><span><b>Version</b>&nbsp; ${meta.version}</span><span><b>Effective</b>&nbsp; ${meta.date}</span><span><b>Owner</b>&nbsp; JoDesx management</span></div></div>
${body}</body></html>`;
    const tmp = join(outDir, `.tmp-${file}`);
    writeFileSync(tmp, html);
    const page = await browser.newPage();
    await page.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({ path: join(outDir, meta.output), format: "A4", printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
    await page.close();
    unlinkSync(tmp);
    console.log("Wrote docs/security/" + meta.output);
  }
  await browser.close();
})();
