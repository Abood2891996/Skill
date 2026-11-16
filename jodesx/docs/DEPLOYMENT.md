# Deployment

## 1. Requirements

- Node.js **20.9+** (developed on 22.x)
- A host that runs Next.js with a Node.js server runtime (the contact API needs it). Static-only hosting is **not** sufficient unless the form is pointed at an external endpoint.

## 2. Environment variables

| Variable | Scope | Required | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | **Yes, in production** | Canonical domain, e.g. `https://www.jodesx.com`. Used for canonical URLs, sitemap, OG and JSON-LD. Defaults to `https://www.jodesx.com` — **confirm the real domain**. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public | Optional | Business email shown on the contact page, footer and privacy policy, and offered as fallback if delivery fails. Hidden when empty. |
| `CONTACT_WEBHOOK_URL` | Server | One delivery option | HTTPS endpoint that receives each inquiry as JSON (Zapier, Make, n8n, a CRM, a Slack workflow…). |
| `CONTACT_WEBHOOK_SECRET` | Server | Optional | If set, each request carries `X-JoDesx-Signature: hex(HMAC-SHA256(secret, rawBody))`. Verify it on the receiving side. |
| `RESEND_API_KEY` | Server | Other delivery option | Resend API key for email delivery. |
| `CONTACT_TO_EMAIL` | Server | With Resend | Inbox that receives inquiries. |
| `CONTACT_FROM_EMAIL` | Server | With Resend | Verified sender, e.g. `JoDesx Website <website@jodesx.com>`. |

If both delivery options are configured, the webhook is used. **If neither is configured, the form tells visitors honestly that online inquiries are not connected yet** and helps them preserve their message — it never pretends to send.

### Webhook payload

```json
{
  "reference": "JDX-7K2Q9P",
  "submittedAt": "2026-11-16T12:00:00.000Z",
  "name": "…", "email": "…", "company": "…",
  "service": "customer-support",
  "teamSize": "6-15" | null,
  "timeline": "1-3-months" | null,
  "contactMethod": "email" | "video-call" | "phone",
  "phone": "…" | null,
  "requirements": "…",
  "text": "Human-readable summary"
}
```

Any non-2xx response is treated as a failed delivery (the visitor sees a retry message).

## 3. Vercel (recommended)

1. Import the repository; set **Root Directory** to `jodesx`.
2. Framework preset: Next.js (auto). Build command `npm run build`, install `npm ci`.
3. Add the environment variables above for Production (and Preview if desired).
4. Add the custom domain; set `NEXT_PUBLIC_SITE_URL` to it and redeploy.

## 4. Any Node.js host / container

```bash
cd jodesx
npm ci
npm run build
NODE_ENV=production PORT=3000 npm start
```

Run behind a reverse proxy (nginx, Caddy, a load balancer) that terminates TLS and **sets `X-Forwarded-For` itself** (overwriting any client-supplied value) — the rate limiter keys on it.

## 5. Production checklist

- [ ] Real domain confirmed and `NEXT_PUBLIC_SITE_URL` set
- [ ] A delivery channel configured and a test inquiry received end-to-end
- [ ] `NEXT_PUBLIC_CONTACT_EMAIL` set (recommended)
- [ ] Privacy policy reviewed by counsel (see PROJECT-STATUS.md)
- [ ] `https://<domain>/sitemap.xml` submitted in Google Search Console / Bing Webmaster Tools
- [ ] OG preview checked (e.g. LinkedIn Post Inspector)
- [ ] HSTS `preload` only kept if every subdomain serves HTTPS (it is set in `next.config.ts`)

## 6. Rate limiting at scale

The built-in limiter is in-memory, per process. On serverless or multi-instance hosting, each instance has its own window. For stronger protection add a shared store (e.g. Upstash Redis) in `src/lib/contact/rate-limit.ts` — the `RateLimiter` interface is the only contract — or a WAF rate rule on `POST /api/contact`. A CAPTCHA (e.g. Cloudflare Turnstile) can be added later if spam appears; it would require loosening the CSP for its origin.

## 7. Verifying a deployment

```bash
npm run check                     # typecheck, lint, unit tests, build
npm start &                       # then, with Playwright available:
BASE_URL=https://your-preview-url node qa/interactions.cjs
```
