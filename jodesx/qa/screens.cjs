// QA screenshots: node qa/screens.cjs <outDir> [route,...] [widths]
const { chromium } = require('playwright');
const out = process.argv[2];
const routes = (process.argv[3] || '/').split(',');
const widths = (process.argv[4] || '1440,390').split(',').map(Number);
(async () => {
  const b = await chromium.launch();
  for (const w of widths) {
    const p = await b.newPage({ viewport: { width: w, height: w < 600 ? 844 : 900 } });
    const errors = [];
    p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    p.on('pageerror', e => errors.push(String(e)));
    for (const r of routes) {
      await p.goto('http://localhost:3100' + r, { waitUntil: 'networkidle' });
      await p.waitForTimeout(1800);
      const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const name = (r === '/' ? 'home' : r.replace(/\//g, '_').slice(1)) + '-' + w;
      await p.screenshot({ path: `${out}/${name}.png`, fullPage: true });
      console.log(name, 'overflowX=', overflow, errors.length ? 'ERRORS: ' + errors.join(' | ') : '');
      errors.length = 0;
    }
    await p.close();
  }
  await b.close();
})();
