import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { contactSchema, fieldErrors, isPersonalEmail } from "../src/lib/validation/contact.ts";
import { createRateLimiter } from "../src/lib/contact/rate-limit.ts";
import { createReference, deliverInquiry, formatInquiryText, resolveChannel } from "../src/lib/contact/delivery.ts";

const valid = {
  name: "Sara Haddad",
  email: "Sara@Example.com ",
  company: "Example Ltd",
  service: "customer-support",
  requirements: "We need email and chat support for about 2,000 tickets a month.",
  contactMethod: "email",
  consent: true,
};

test("accepts a valid inquiry and normalises email", () => {
  const r = contactSchema.safeParse(valid);
  assert.ok(r.success);
  assert.equal(r.data.email, "sara@example.com");
});

test("reports a message per invalid field", () => {
  const r = contactSchema.safeParse({ ...valid, name: "S", email: "nope", service: "x", requirements: "short", consent: false });
  assert.ok(!r.success);
  const errs = fieldErrors(r.error);
  for (const key of ["name", "email", "service", "requirements", "consent"]) assert.ok(errs[key as keyof typeof errs], key);
});

test("phone is required only when phone contact is chosen", () => {
  assert.ok(!contactSchema.safeParse({ ...valid, contactMethod: "phone" }).success);
  assert.ok(contactSchema.safeParse({ ...valid, contactMethod: "phone", phone: "+962 6 555 0100" }).success);
});

test("rejects a filled honeypot", () => {
  assert.ok(!contactSchema.safeParse({ ...valid, website: "http://spam" }).success);
});

test("flags personal email domains for the soft hint", () => {
  assert.equal(isPersonalEmail("a@gmail.com"), true);
  assert.equal(isPersonalEmail("a@company.io"), false);
});

test("rate limiter allows the limit then blocks within the window", () => {
  const rl = createRateLimiter({ limit: 2, windowMs: 1000 });
  assert.equal(rl.check("ip", 0), true);
  assert.equal(rl.check("ip", 10), true);
  assert.equal(rl.check("ip", 20), false);
  assert.equal(rl.check("ip", 1500), true);
});

test("channel resolution", () => {
  assert.equal(resolveChannel({}), null);
  assert.equal(resolveChannel({ CONTACT_WEBHOOK_URL: "http://insecure" }), null);
  assert.equal(resolveChannel({ CONTACT_WEBHOOK_URL: "https://hooks.example.com/x" }), "webhook");
  assert.equal(resolveChannel({ RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "t@x.com", CONTACT_FROM_EMAIL: "f@x.com" }), "resend");
});

test("reference format", () => {
  assert.match(createReference(), /^JDX-[A-Z2-9]{6}$/);
});

const inquiry = contactSchema.parse(valid);

test("not configured is reported honestly", async () => {
  assert.deepEqual(await deliverInquiry(inquiry, "JDX-TEST01", {}), { ok: false, reason: "not_configured" });
});

test("webhook delivery signs the body", async () => {
  let captured: { url: string; init: RequestInit } | undefined;
  const fake = (async (url: string, init: RequestInit) => {
    captured = { url, init };
    return new Response(null, { status: 200 });
  }) as unknown as typeof fetch;
  const env = { CONTACT_WEBHOOK_URL: "https://hooks.example.com/x", CONTACT_WEBHOOK_SECRET: "s3cret" };
  const res = await deliverInquiry(inquiry, "JDX-TEST01", env, fake);
  assert.deepEqual(res, { ok: true, channel: "webhook" });
  const body = captured!.init.body as string;
  const sig = (captured!.init.headers as Record<string, string>)["X-JoDesx-Signature"];
  assert.equal(sig, createHmac("sha256", "s3cret").update(body).digest("hex"));
  const parsed = JSON.parse(body);
  assert.equal(parsed.reference, "JDX-TEST01");
  assert.equal(parsed.website, undefined);
});

test("resend delivery sets reply-to and reports upstream failure", async () => {
  let payload: Record<string, unknown> = {};
  const fail = (async (_url: string, init: RequestInit) => {
    payload = JSON.parse(init.body as string);
    return new Response("{}", { status: 500 });
  }) as unknown as typeof fetch;
  const env = { RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "team@x.com", CONTACT_FROM_EMAIL: "site@x.com" };
  assert.deepEqual(await deliverInquiry(inquiry, "JDX-TEST01", env, fail), { ok: false, reason: "delivery_failed" });
  assert.equal(payload.reply_to, "sara@example.com");
});

test("formatted text contains readable labels", () => {
  const text = formatInquiryText(inquiry, "JDX-TEST01");
  assert.match(text, /Service: Customer Support/);
  assert.match(text, /Estimated team size: Not specified/);
});
