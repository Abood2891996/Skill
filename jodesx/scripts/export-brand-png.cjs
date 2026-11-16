/**
 * Rasterises selected brand SVGs to PNG using the pre-installed Playwright Chromium.
 *   node scripts/export-brand-png.cjs
 * Run after `npm run brand:build`. Outputs are committed, so this is only needed
 * when the logo changes.
 */
const { chromium } = require("playwright");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const root = join(__dirname, "..");
const jobs = [
  { src: "public/brand/jodesx-social-avatar.svg", out: "public/brand/jodesx-social-avatar.png", size: 800 },
  { src: "public/brand/jodesx-favicon.svg", out: "src/app/apple-icon.png", size: 180, bg: "#0B1220" },
  { src: "public/brand/jodesx-logo-horizontal-dark.svg", out: "public/brand/jodesx-logo-horizontal-dark.png", width: 1200, bg: "#0B1220", pad: 80 },
  { src: "public/brand/jodesx-logo-horizontal-light.svg", out: "public/brand/jodesx-logo-horizontal-light.png", width: 1200, bg: "#F4F7FB", pad: 80 },
];

(async () => {
  const browser = await chromium.launch();
  for (const job of jobs) {
    const svg = readFileSync(join(root, job.src), "utf8");
    const w = job.size ?? job.width;
    const page = await browser.newPage({ viewport: { width: w, height: job.size ?? 400 }, deviceScaleFactor: 1 });
    const pad = job.pad ?? 0;
    await page.setContent(
      `<body style="margin:0;background:${job.bg ?? "transparent"}"><div id="c" style="padding:${pad}px;width:${w - pad * 2}px">${svg.replace("<svg", '<svg style="width:100%;height:auto;display:block"')}</div></body>`,
    );
    const el = await page.$("#c");
    await el.screenshot({ path: join(root, job.out), omitBackground: !job.bg });
    await page.close();
    console.log("wrote", job.out);
  }
  await browser.close();
})();
