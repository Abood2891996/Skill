import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDocument, parseFrontMatter, parseInline } from "../src/lib/careers/markdown.ts";
import { jobFrontMatter } from "../src/lib/careers/job-schema.ts";
import { applicationSchema, checkCvBasics, safeFileName, verifyCvSignature } from "../src/lib/validation/application.ts";
import { resolveChannel } from "../src/lib/contact/delivery.ts";

test("front matter parses values, quotes and trailing comments", () => {
  const { data, body } = parseFrontMatter('---\ntitle: "Agent: Tier 1"\nteam: Customer Support   # comment\n---\nHello');
  assert.equal(data.title, "Agent: Tier 1");
  assert.equal(data.team, "Customer Support");
  assert.equal(body, "Hello");
});

test("body parses headings, lists, paragraphs and bold", () => {
  const { blocks } = parseDocument("---\na: b\n---\nIntro line one\nline two\n\n## Do\n\n- **One** thing\n- Two\nAfter");
  assert.deepEqual(blocks.map((b) => b.type), ["paragraph", "heading", "list", "paragraph"]);
  assert.deepEqual(parseInline("a **b** c"), [
    { text: "a ", bold: false },
    { text: "b", bold: true },
    { text: " c", bold: false },
  ]);
});

test("HTML in a post stays plain text", () => {
  const { blocks } = parseDocument("<script>alert(1)</script>");
  assert.equal(blocks[0]?.type, "paragraph");
  assert.equal(blocks[0]?.type === "paragraph" && blocks[0].content[0]?.text, "<script>alert(1)</script>");
});

test("every published job file (if any) has valid front matter", () => {
  const dir = join(import.meta.dirname, "../src/content/jobs");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  for (const f of files) {
    const { data } = parseDocument(readFileSync(join(dir, f), "utf8"));
    const r = jobFrontMatter.safeParse(data);
    assert.ok(r.success, `${f}: ${r.success ? "" : r.error.issues.map((i) => i.message).join(", ")}`);
  }
});

test("the template's example values are valid once copied", () => {
  const { data } = parseDocument(readFileSync(join(import.meta.dirname, "../src/content/jobs/_TEMPLATE.md"), "utf8"));
  assert.ok(jobFrontMatter.safeParse(data).success);
});

const validApp = {
  job: "content-moderator",
  fullName: "Lina Odeh",
  email: "lina@example.com",
  phone: "+962 7 9123 4567",
  location: "Amman, Jordan",
  languages: "English (fluent), Arabic (native)",
  availability: "2-weeks",
  message: "I have two years of experience reviewing marketplace listings against detailed policies and enjoy careful work.",
  consent: true,
};

test("application schema accepts a valid application and rejects bad links", () => {
  assert.ok(applicationSchema.safeParse(validApp).success);
  assert.ok(applicationSchema.safeParse({ ...validApp, profileUrl: "https://linkedin.com/in/x" }).success);
  assert.ok(!applicationSchema.safeParse({ ...validApp, profileUrl: "javascript:alert(1)" }).success);
  assert.ok(!applicationSchema.safeParse({ ...validApp, job: "../etc/passwd" }).success);
  assert.ok(!applicationSchema.safeParse({ ...validApp, message: "too short" }).success);
});

test("CV checks: extension, size and real file signature", () => {
  assert.match(checkCvBasics(null) ?? "", /Attach/);
  assert.match(checkCvBasics({ name: "cv.exe", size: 10 }) ?? "", /PDF/);
  assert.match(checkCvBasics({ name: "cv.pdf", size: 5 * 1024 * 1024 }) ?? "", /4 MB/);
  assert.equal(checkCvBasics({ name: "cv.pdf", size: 1000 }), null);
  assert.ok(verifyCvSignature("cv.pdf", new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])).ok);
  assert.ok(!verifyCvSignature("cv.pdf", new Uint8Array([0x4d, 0x5a, 0x90, 0x00])).ok); // renamed .exe
  assert.ok(verifyCvSignature("cv.docx", new Uint8Array([0x50, 0x4b, 0x03, 0x04])).ok);
});

test("uploaded file names are sanitised", () => {
  assert.equal(safeFileName("../../evil/My CV (final).pdf"), "My-CV-final.pdf");
  assert.equal(safeFileName("C:\\Users\\x\\cv.docx"), "cv.docx");
});

test("applications fall back to the inquiry channel", () => {
  assert.equal(resolveChannel({ CONTACT_WEBHOOK_URL: "https://h.example/x" }, "application"), "webhook");
  assert.equal(resolveChannel({ CAREERS_WEBHOOK_URL: "https://h.example/c" }, "inquiry"), null);
  assert.equal(resolveChannel({ RESEND_API_KEY: "k", CONTACT_FROM_EMAIL: "f@x.com", CAREERS_TO_EMAIL: "hr@x.com" }, "application"), "resend");
});

test("optional job fields: country code and CV requirement", () => {
  const base = { title: "Role", team: "AI Data Operations", type: "Contract", workplace: "On-site", location: "Saudi Arabia", status: "open", posted: "2026-11-23", summary: "A summary that is long enough to pass." };
  assert.equal(jobFrontMatter.safeParse({ ...base, country: "SA", cv: "no" }).success, true);
  assert.equal(jobFrontMatter.safeParse({ ...base, country: "Saudi" }).success, false);
  assert.equal(jobFrontMatter.safeParse({ ...base, cv: "maybe" }).success, false);
  assert.equal(jobFrontMatter.safeParse(base).success, true);
});

test("translated postings point to an existing original with the same status", () => {
  const dir = join(process.cwd(), "src/content/jobs");
  const files = readdirSync(dir).filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const all = new Map(files.map((f) => [f.replace(/\.md$/, ""), jobFrontMatter.parse(parseDocument(readFileSync(join(dir, f), "utf8")).data)]));
  for (const [slug, job] of all) {
    if (!job.translationOf) continue;
    const original = all.get(job.translationOf);
    assert.ok(original, `${slug}: translationOf points to a missing job`);
    assert.equal(original.status, job.status, `${slug}: status differs from the original`);
    assert.equal(original.translationOf, undefined, `${slug}: original must not itself be a translation`);
  }
});

test("the good-fit note can be optional for some roles", async () => {
  const { applicationSchemaOptionalMessage } = await import("../src/lib/validation/application.ts");
  const base = { job: "x", fullName: "Test Person", email: "a@example.com", phone: "+966 50 123 4567", location: "Riyadh", languages: "Arabic", availability: "immediately", consent: true };
  assert.equal(applicationSchema.safeParse({ ...base, message: "" }).success, false);
  assert.equal(applicationSchemaOptionalMessage.safeParse({ ...base, message: "" }).success, true);
  assert.equal(applicationSchemaOptionalMessage.safeParse(base).success, true);
});
