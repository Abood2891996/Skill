/**
 * Minimal, safe Markdown for job postings.
 *
 * Supports exactly what a job post needs — `## headings`, `- bullet lists`,
 * `1. numbered lists`,
 * paragraphs and `**bold**` — and returns plain data that React renders as
 * elements. No HTML is ever injected, so posts cannot break the page or run
 * scripts.
 */

export type InlineSegment = { text: string; bold: boolean };
export type Block =
  | { type: "heading"; text: string }
  | { type: "paragraph"; content: InlineSegment[] }
  | { type: "list"; items: InlineSegment[][]; ordered?: boolean };

export interface ParsedDocument {
  data: Record<string, string>;
  blocks: Block[];
}

/** Splits `---` front matter (simple `key: value` lines) from the body. */
export function parseFrontMatter(source: string): { data: Record<string, string>; body: string } {
  const normalized = source.replace(/\r\n?/g, "\n").replace(/^﻿/, "");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(normalized);
  if (!match) return { data: {}, body: normalized };
  const data: Record<string, string> = {};
  for (const line of (match[1] ?? "").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf(":");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    else value = value.replace(/\s+#.*$/, ""); // allow trailing "# comment"
    data[key] = value;
  }
  return { data, body: match[2] ?? "" };
}

export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) segments.push({ text: text.slice(last, m.index), bold: false });
    segments.push({ text: m[1] ?? "", bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ text: text.slice(last), bold: false });
  return segments;
}

export function parseBlocks(body: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let list: InlineSegment[][] | null = null;
  let ordered = false;

  const pushList = () => {
    if (list) blocks.push(ordered ? { type: "list", items: list, ordered: true } : { type: "list", items: list });
    list = null;
  };
  const flush = () => {
    if (paragraph.length) blocks.push({ type: "paragraph", content: parseInline(paragraph.join(" ")) });
    pushList();
    paragraph = [];
  };

  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flush();
    } else if (line.startsWith("#")) {
      flush();
      blocks.push({ type: "heading", text: line.replace(/^#+\s*/, "") });
    } else if (/^([-*]|\d+[.)])\s+/.test(line)) {
      if (paragraph.length) {
        blocks.push({ type: "paragraph", content: parseInline(paragraph.join(" ")) });
        paragraph = [];
      }
      const isOrdered = /^\d+[.)]\s+/.test(line);
      if (list && isOrdered !== ordered) pushList();
      ordered = isOrdered;
      list ??= [];
      list.push(parseInline(line.replace(/^([-*]|\d+[.)])\s+/, "")));
    } else {
      pushList();
      paragraph.push(line);
    }
  }
  flush();
  return blocks;
}

export function parseDocument(source: string): ParsedDocument {
  const { data, body } = parseFrontMatter(source);
  return { data, blocks: parseBlocks(body) };
}
