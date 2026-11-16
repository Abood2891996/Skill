/**
 * Generates every JoDesx logo asset from one geometric source of truth.
 *
 *   npm run brand:build
 *
 * Outputs:
 *   public/brand/*.svg               — logo variants (outlined, font-independent)
 *   src/app/icon.svg                 — favicon served by Next.js
 *   src/components/brand/logo-geometry.ts — path data used by the <Logo> component
 *
 * The wordmark is converted to outlines with opentype.js from Instrument Sans
 * SemiBold (OFL-1.1), so the SVGs never depend on a font being installed.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p) => join(root, p);

/* ---------- Symbol geometry (48-unit construction grid) ------------------
 * J stroke : stem x 10–16, from cap line y=5, hooking into baseline bar y 37–43
 * D bowl   : bars start at x=21 (5-unit signal channel after the J stem),
 *            outer radius 19, inner radius 13, centred on y=24
 * Signal   : 6×6 unit inside the counter, left edge on the D bar line (x=21),
 *            vertically centred on the bowl axis (y=24)
 */
const SYMBOL = {
  viewBox: "0 0 48 48",
  j: "M10 5H16V31A12 12 0 0 1 4 43V37A6 6 0 0 0 10 31Z",
  d: "M21 5H26A19 19 0 0 1 26 43H21V37H26A13 13 0 0 0 26 11H21Z",
  signal: { x: 21, y: 21, size: 6 },
};
// Visual bounds of the symbol inside the 48 grid (x 4–45, y 5–43).
const SYMBOL_BOUNDS = { x: 4, y: 5, w: 41, h: 38 };

const COLORS = {
  navy: "#0B1220",
  cyan: "#35D6E8",
  cyanDeep: "#0E8FA0", // cyan tuned for contrast on light backgrounds
  violet: "#786BFF",
  violetDeep: "#5B4FE0",
  white: "#F4F7FB",
};

const palettes = {
  dark: { j: COLORS.cyan, d: COLORS.white, signal: COLORS.violet, word: COLORS.white },
  light: { j: COLORS.cyanDeep, d: COLORS.navy, signal: COLORS.violetDeep, word: COLORS.navy },
  monoWhite: { j: COLORS.white, d: COLORS.white, signal: COLORS.white, word: COLORS.white },
  monoNavy: { j: COLORS.navy, d: COLORS.navy, signal: COLORS.navy, word: COLORS.navy },
};

/* ---------- Wordmark ---------------------------------------------------- */
const font = opentype.parse(
  readFileSync(out("node_modules/@fontsource/instrument-sans/files/instrument-sans-latin-600-normal.woff")).buffer,
);
const FONT_SIZE = 100;
const TRACKING = -1.5; // units at FONT_SIZE 100 (≈ -0.015em)

function wordmark(text) {
  let x = 0;
  const parts = [];
  const glyphs = font.stringToGlyphs(text);
  glyphs.forEach((g, i) => {
    const p = g.getPath(x, 0, FONT_SIZE);
    parts.push(p.toPathData(2));
    const kern = i < glyphs.length - 1 ? font.getKerningValue(g, glyphs[i + 1]) : 0;
    x += ((g.advanceWidth + kern) / font.unitsPerEm) * FONT_SIZE + TRACKING;
  });
  const full = font.getPath(text, 0, 0, FONT_SIZE);
  const bb = full.getBoundingBox();
  const capHeight = (font.tables.os2.sCapHeight / font.unitsPerEm) * FONT_SIZE;
  return { d: parts.join(""), width: x - TRACKING, capHeight, bb };
}

const WORD = wordmark("JoDesx");

/* ---------- Composition helpers ------------------------------------------ */
const symbolGroup = (pal, transform = "") =>
  `<g${transform ? ` transform="${transform}"` : ""}>` +
  `<path fill="${pal.j}" d="${SYMBOL.j}"/>` +
  `<path fill="${pal.d}" d="${SYMBOL.d}"/>` +
  `<rect fill="${pal.signal}" x="${SYMBOL.signal.x}" y="${SYMBOL.signal.y}" width="${SYMBOL.signal.size}" height="${SYMBOL.signal.size}"/>` +
  `</g>`;

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(w)} ${round(h)}" role="img" aria-labelledby="t"><title id="t">${title}</title>${body}</svg>\n`;

const round = (n) => Math.round(n * 100) / 100;

/** Horizontal lockup: symbol height = 1.45 × cap height, gap = 0.5 symbol height. */
function horizontal(pal) {
  const symH = WORD.capHeight * 1.45;
  const scale = symH / SYMBOL_BOUNDS.h;
  const gap = symH * 0.42;
  const symW = SYMBOL_BOUNDS.w * scale;
  const pad = 0;
  const h = symH;
  const wordY = h / 2 + WORD.capHeight / 2; // optically centre caps on symbol
  const w = symW + gap + WORD.width;
  const body =
    symbolGroup(pal, `translate(${round(-SYMBOL_BOUNDS.x * scale + pad)} ${round(-SYMBOL_BOUNDS.y * scale)}) scale(${round(scale * 1000) / 1000})`) +
    `<path fill="${pal.word}" transform="translate(${round(symW + gap)} ${round(wordY)})" d="${WORD.d}"/>`;
  return { markup: svg(w, h, body, "JoDesx"), w, h };
}

/** Primary (stacked) lockup: symbol centred above the wordmark. */
function stacked(pal) {
  const symH = WORD.capHeight * 2.6;
  const scale = symH / SYMBOL_BOUNDS.h;
  const symW = SYMBOL_BOUNDS.w * scale;
  const gap = WORD.capHeight * 0.9;
  const w = Math.max(WORD.width, symW);
  const h = symH + gap + WORD.capHeight;
  const body =
    symbolGroup(pal, `translate(${round((w - symW) / 2 - SYMBOL_BOUNDS.x * scale)} ${round(-SYMBOL_BOUNDS.y * scale)}) scale(${round(scale * 1000) / 1000})`) +
    `<path fill="${pal.word}" transform="translate(${round((w - WORD.width) / 2)} ${round(h)})" d="${WORD.d}"/>`;
  return svg(w, h, body, "JoDesx");
}

const symbolOnly = (pal) => svg(48, 48, symbolGroup(pal), "JoDesx symbol");

/** Tile versions (favicon / avatar): symbol on a midnight-navy field. */
function tile(size, radius, symbolRatio) {
  const symH = size * symbolRatio;
  const scale = symH / SYMBOL_BOUNDS.h;
  const tx = (size - SYMBOL_BOUNDS.w * scale) / 2 - SYMBOL_BOUNDS.x * scale;
  const ty = (size - symH) / 2 - SYMBOL_BOUNDS.y * scale;
  const body =
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${COLORS.navy}"/>` +
    symbolGroup(palettes.dark, `translate(${round(tx)} ${round(ty)}) scale(${round(scale * 1000) / 1000})`);
  return svg(size, size, body, "JoDesx");
}

/* ---------- Write files ------------------------------------------------- */
const files = {
  "public/brand/jodesx-logo-primary-dark.svg": stacked(palettes.dark),
  "public/brand/jodesx-logo-primary-light.svg": stacked(palettes.light),
  "public/brand/jodesx-logo-horizontal-dark.svg": horizontal(palettes.dark).markup,
  "public/brand/jodesx-logo-horizontal-light.svg": horizontal(palettes.light).markup,
  "public/brand/jodesx-logo-mono-white.svg": horizontal(palettes.monoWhite).markup,
  "public/brand/jodesx-logo-mono-navy.svg": horizontal(palettes.monoNavy).markup,
  "public/brand/jodesx-symbol-dark.svg": symbolOnly(palettes.dark),
  "public/brand/jodesx-symbol-light.svg": symbolOnly(palettes.light),
  "public/brand/jodesx-symbol-mono-navy.svg": symbolOnly(palettes.monoNavy),
  "public/brand/jodesx-favicon.svg": tile(48, 11, 0.62),
  "public/brand/jodesx-social-avatar.svg": tile(400, 0, 0.5),
  "src/app/icon.svg": tile(48, 11, 0.62),
};

for (const [path, content] of Object.entries(files)) {
  mkdirSync(dirname(out(path)), { recursive: true });
  writeFileSync(out(path), content);
}

const h = horizontal(palettes.dark);
const geometry = `// Generated by scripts/build-brand.mjs — do not edit by hand.
export const SYMBOL_PATHS = {
  j: "${SYMBOL.j}",
  d: "${SYMBOL.d}",
  signal: { x: ${SYMBOL.signal.x}, y: ${SYMBOL.signal.y}, size: ${SYMBOL.signal.size} },
} as const;

export const SYMBOL_BOUNDS = { x: ${SYMBOL_BOUNDS.x}, y: ${SYMBOL_BOUNDS.y}, w: ${SYMBOL_BOUNDS.w}, h: ${SYMBOL_BOUNDS.h} } as const;

/** Horizontal lockup: symbol scale/offset and outlined wordmark. */
export const HORIZONTAL_LOCKUP = {
  width: ${round(h.w)},
  height: ${round(h.h)},
  symbolTransform: "translate(${round(-SYMBOL_BOUNDS.x * (h.h / SYMBOL_BOUNDS.h))} ${round(-SYMBOL_BOUNDS.y * (h.h / SYMBOL_BOUNDS.h))}) scale(${round((h.h / SYMBOL_BOUNDS.h) * 1000) / 1000})",
  wordTransform: "translate(${round(SYMBOL_BOUNDS.w * (h.h / SYMBOL_BOUNDS.h) + h.h * 0.42)} ${round(h.h / 2 + WORD.capHeight / 2)})",
  wordPath: "${WORD.d}",
} as const;
`;
mkdirSync(out("src/components/brand"), { recursive: true });
writeFileSync(out("src/components/brand/logo-geometry.ts"), geometry);

console.log(`Brand assets written (${Object.keys(files).length} SVGs + logo-geometry.ts). Cap height ${round(WORD.capHeight)}, word width ${round(WORD.width)}.`);
