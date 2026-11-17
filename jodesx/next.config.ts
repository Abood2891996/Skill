import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/** The site's own origin (matches src/content/site.ts). Used to restrict CORS. */
const siteOrigin = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.jodesx.com").replace(/\/+$/, "");

/**
 * Content Security Policy.
 * The site loads no third-party scripts, fonts or images, so everything is
 * restricted to 'self'. Next.js injects small inline bootstrap scripts, which
 * requires 'unsafe-inline' for scripts unless a per-request nonce is used
 * (that would force dynamic rendering on every page; see docs/ARCHITECTURE.md).
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // Vercel's default is "*". Nothing on this site needs to be read by other origins,
  // so cross-origin reads are limited to the site itself.
  { key: "Access-Control-Allow-Origin", value: siteOrigin },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The applications API reads job files at runtime to confirm a role is open.
  outputFileTracingIncludes: { "/api/careers/apply": ["./src/content/jobs/**/*"] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
