// Real-browser interaction tests against a running server (default http://localhost:3100).
// Usage: node qa/interactions.cjs   (requires Playwright; see README "Quality checks")
const { chromium } = require("playwright");
const BASE = process.env.BASE_URL || "http://localhost:3100";
let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`); if (!cond) failures++; };

(async () => {
  const browser = await chromium.launch();

  // ---------- Desktop navigation ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    ok((await page.evaluate(() => document.activeElement?.textContent)) === "Skip to content", "first Tab focuses skip link");
    const btn = page.getByRole("button", { name: "Services" });
    await btn.click();
    ok(await page.locator(".services-panel").isVisible(), "services dropdown opens on click");
    ok((await btn.getAttribute("aria-expanded")) === "true", "aria-expanded=true when open");
    await page.keyboard.press("Escape");
    ok(!(await page.locator(".services-panel").isVisible()), "Escape closes dropdown");
    ok(await btn.evaluate((el) => el === document.activeElement), "focus returns to Services button");
    await btn.click();
    await page.mouse.click(20, 600);
    ok(!(await page.locator(".services-panel").isVisible()), "outside click closes dropdown");
    await btn.hover();
    await page.waitForTimeout(100);
    ok(await page.locator(".services-panel").isVisible(), "hover opens dropdown for mouse users");
    await page.locator(".services-panel a", { hasText: "Back-Office Operations" }).click();
    await page.waitForURL("**/services/back-office");
    ok(true, "dropdown link navigates to service page");
    ok(!(await page.locator(".services-panel").isVisible()), "dropdown closes after navigation");
    ok((await page.locator('nav[aria-label="Main"] .nav-link.is-active').textContent())?.includes("Services"), "Services marked active on service page");

    // Header hides on scroll down, returns on scroll up
    await page.mouse.wheel(0, 1600); await page.waitForTimeout(500);
    const hidden = await page.locator("header.site-header").evaluate((el) => el.className.includes("-translate-y-full"));
    await page.mouse.wheel(0, -300); await page.waitForTimeout(500);
    const shown = await page.locator("header.site-header").evaluate((el) => el.className.includes("translate-y-0"));
    ok(hidden && shown, "sticky header hides on scroll down and returns on scroll up");

    // FAQ
    const faq = page.locator("details.faq-item").first();
    await faq.locator("summary").click();
    ok(await faq.evaluate((d) => d.open), "FAQ item opens on click");
    await page.close();
  }

  // ---------- Operations Blueprint ----------
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    const tablist = page.getByRole("tablist");
    await tablist.scrollIntoViewIfNeeded();
    const detail = page.locator(".blueprint-detail h3").first();
    ok((await detail.textContent()) === "Incoming inquiry", "blueprint starts on Customer Support stage 1");
    await page.waitForTimeout(3600);
    ok((await detail.textContent()) === "Classification", "walkthrough auto-advances while visible");
    await page.getByRole("tab", { name: "Content Moderation" }).click();
    ok((await detail.textContent()) === "Content intake", "selecting a tab swaps the workflow");
    await page.keyboard.press("ArrowRight");
    ok(await page.getByRole("tab", { name: "Customer Support" }).evaluate((el) => el === document.activeElement && el.getAttribute("aria-selected") === "true"), "ArrowRight moves selection + focus");
    await page.keyboard.press("End");
    ok((await page.getByRole("tab", { name: "AI Data Operations" }).getAttribute("aria-selected")) === "true", "End selects last tab");
    await page.locator(".blueprint-stages button", { hasText: "Validation" }).click();
    ok((await detail.textContent()) === "Validation", "clicking a stage shows its detail");
    ok(await page.getByRole("button", { name: "Play walkthrough" }).isVisible(), "manual stage choice pauses the walkthrough");
    await page.locator(".blueprint-stages button", { hasText: "Annotation" }).click();
    ok(await page.getByText("Guideline clarification").first().isVisible(), "branch path details are shown for branching stages");
    await page.close();
  }

  // ---------- Challenge selector ----------
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.getByText("Admin and data entry are crowding out real work").click();
    await page.waitForTimeout(700);
    const card = page.locator("article", { hasText: "Recommended service" });
    ok((await card.locator("h3").textContent()) === "Back-Office Operations", "challenge maps to the right service");
    ok(await card.isVisible() && (await card.boundingBox()).y < 844, "recommendation scrolled into view on mobile");
    const href = await card.getByRole("link", { name: "Discuss this challenge" }).getAttribute("href");
    ok(href === "/contact?service=back-office&challenge=admin-load", "contextual CTA carries service + challenge");
    await card.getByRole("link", { name: "Discuss this challenge" }).click();
    await page.waitForURL("**/contact?**");
    await page.waitForLoadState("networkidle");
    ok((await page.locator("#service").inputValue()) === "back-office", "contact form pre-selects the service");
    ok((await page.locator("#requirements").inputValue()).startsWith("Main challenge: Admin"), "contact form pre-fills the challenge");
    await page.close();
  }

  // ---------- Mobile menu ----------
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(BASE + "/how-we-work", { waitUntil: "networkidle" });
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    ok(await page.locator("#mobile-menu").isVisible(), "mobile menu opens");
    ok((await page.evaluate(() => document.body.style.overflow)) === "hidden", "page scroll locked while open");
    ok((await page.evaluate(() => document.activeElement?.closest("#mobile-menu") !== null)), "focus moves into the menu");
    for (let i = 0; i < 15; i++) await page.keyboard.press("Tab");
    ok((await page.evaluate(() => !!document.activeElement?.closest("#mobile-menu, header"))), "focus stays trapped in menu");
    await page.keyboard.press("Escape");
    ok(!(await page.locator("#mobile-menu").isVisible()), "Escape closes mobile menu");
    ok((await page.evaluate(() => document.body.style.overflow)) === "", "scroll lock released");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.locator("#mobile-menu a", { hasText: "AI Data Operations" }).click();
    await page.waitForURL("**/services/ai-data-operations");
    ok(!(await page.locator("#mobile-menu").isVisible()), "menu closes after navigation");
    await page.close();
  }

  // ---------- Contact form ----------
  {
    // A distinct client address keeps repeated runs clear of the rate limiter.
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
      extraHTTPHeaders: { "X-Forwarded-For": `10.99.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` },
    });
    await page.goto(BASE + "/contact", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Send inquiry" }).click();
    ok((await page.locator(".field-error").count()) >= 5, "empty submit shows field errors");
    ok(await page.locator("#name").evaluate((el) => el === document.activeElement), "focus moves to first invalid field");
    ok((await page.locator("#name").getAttribute("aria-invalid")) === "true", "aria-invalid set on invalid field");
    ok((await page.locator("#name").getAttribute("aria-describedby"))?.includes("name-error"), "error linked via aria-describedby");
    await page.fill("#name", "Test Person");
    await page.fill("#company", "Acme Logistics");
    await page.fill("#email", "test@gmail.com");
    await page.locator("#email").blur();
    ok(await page.getByText("A company address helps").isVisible(), "personal-email hint is shown (non-blocking)");
    await page.selectOption("#service", "customer-support");
    await page.fill("#requirements", "Email support for roughly 1,500 tickets per month across two brands.");
    await page.getByText("Phone", { exact: true }).click();
    ok(await page.locator("#phone").isVisible(), "phone field appears when Phone is chosen");
    await page.getByText("Email", { exact: true }).click();
    await page.locator('input[name="consent"]').check();
    await page.waitForTimeout(3100); // respect the minimum fill time
    const [resp] = await Promise.all([
      page.waitForResponse("**/api/contact"),
      page.getByRole("button", { name: "Send inquiry" }).click(),
    ]);
    const status = resp.status();
    if (status === 503) {
      ok(await page.getByText("Online inquiries are not connected yet").isVisible(), "unconfigured delivery is reported honestly (503)");
      ok(await page.getByRole("button", { name: "Copy my inquiry" }).isVisible(), "visitor can copy their inquiry");
      ok((await page.locator("#name").inputValue()) === "Test Person", "form data is preserved");
    } else {
      ok(status === 200 && (await page.getByText("Inquiry received.").isVisible()), "configured delivery shows success state");
    }
    await page.close();
  }

  // ---------- Reduced motion ----------
  {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    ok((await page.getByRole("button", { name: /walkthrough/ }).count()) === 0, "no autoplay control under reduced motion");
    const anim = await page.locator(".signal-pulse").first().evaluate((el) => getComputedStyle(el).animationName);
    ok(anim === "none", "signal pulses are static under reduced motion");
    await ctx.close();
  }

  // ---------- API hardening ----------
  {
    const req = (await browser.newContext()).request;
    const body = { name: "A B", email: "a@b.co", company: "Co", service: "back-office", requirements: "x".repeat(30), contactMethod: "email", consent: true };
    const ip = () => ({ "X-Forwarded-For": `10.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` });
    let r = await req.post(BASE + "/api/contact", { data: body, headers: { Origin: "https://evil.example", ...ip() } });
    ok(r.status() === 403, "cross-origin POST rejected (403)");
    r = await req.post(BASE + "/api/contact", { data: { ...body, startedAt: Date.now() }, headers: ip() });
    ok(r.status() === 400, "instant submission rejected as automated (400)");
    r = await req.post(BASE + "/api/contact", { data: { ...body, email: "bad" }, headers: ip() });
    ok(r.status() === 422 && (await r.json()).fields.email, "server-side validation returns field errors (422)");
    r = await req.post(BASE + "/api/contact", { data: { ...body, website: "spam" }, headers: ip() });
    ok(r.status() === 200, "honeypot submissions silently dropped");
    const same = ip();
    const codes = [];
    for (let i = 0; i < 6; i++) codes.push((await req.post(BASE + "/api/contact", { data: { ...body, email: "bad" }, headers: same })).status());
    ok(codes[5] === 429 && codes.slice(0, 5).every((c) => c === 422), "6th request in the window is rate limited (429)");
    r = await req.fetch(BASE + "/", { method: "HEAD" });
    const h = r.headers();
    ok(h["content-security-policy"]?.includes("frame-ancestors 'none'") && h["x-content-type-options"] === "nosniff", "security headers present");
  }

  // ---------- Link integrity ----------
  {
    const page = await browser.newPage();
    const pages = ["/", "/services", "/services/content-moderation", "/services/customer-support", "/services/back-office", "/services/ai-data-operations", "/how-we-work", "/about", "/contact", "/privacy"];
    const hrefs = new Set();
    let hashOnly = 0;
    for (const p of pages) {
      await page.goto(BASE + p);
      for (const href of await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))) {
        if (href === "#") hashOnly++;
        else if (href.startsWith("/")) hrefs.add(href.split("#")[0]);
      }
    }
    ok(hashOnly === 0, 'no href="#" placeholders');
    const bad = [];
    for (const h of hrefs) { const r = await page.request.get(BASE + h); if (r.status() !== 200) bad.push(`${h} ${r.status()}`); }
    for (const extra of ["/sitemap.xml", "/robots.txt", "/opengraph-image", "/icon.svg", "/apple-icon.png", "/brand/jodesx-social-avatar.png"]) {
      const r = await page.request.get(BASE + extra); if (r.status() !== 200) bad.push(`${extra} ${r.status()}`);
    }
    ok(bad.length === 0, `all ${hrefs.size} internal links + assets return 200 ${bad.join(", ")}`);
  }

  await browser.close();
  console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
  process.exit(failures ? 1 : 0);
})();
