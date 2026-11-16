import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HORIZONTAL_LOCKUP, SYMBOL_PATHS } from "@/components/brand/logo-geometry";

export const OG_SIZE = { width: 1200, height: 630 };

/** Branded social card: logo, title and a fragment of the Signal lanes. */
export async function renderOgImage({ title, eyebrow }: { title: string; eyebrow?: string }) {
  const fontDir = join(process.cwd(), "src/app/fonts");
  const [semibold, regular] = await Promise.all([
    readFile(join(fontDir, "InstrumentSans-SemiBold.woff")),
    readFile(join(fontDir, "InstrumentSans-Regular.woff")),
  ]);
  const { width, height, symbolTransform, wordTransform, wordPath } = HORIZONTAL_LOCKUP;
  const logoH = 44;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0B1220",
          padding: "72px 80px",
          fontFamily: "Instrument Sans",
          position: "relative",
        }}
      >
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          {[150, 250, 410, 510].map((y) => (
            <path
              key={y}
              d={`M640 ${y} H1000 Q1030 ${y} 1030 ${y + (330 - y > 0 ? 30 : -30)} V${330 - (330 - y > 0 ? 30 : -30)} Q1030 330 1060 330 H1120`}
              stroke="#F4F7FB"
              strokeOpacity="0.16"
              strokeWidth="2"
              fill="none"
            />
          ))}
          <rect x="826" y="110" width="28" height="440" rx="8" fill="#172438" fillOpacity="0.6" stroke="#F4F7FB" strokeOpacity="0.14" />
          <rect x="936" y="110" width="28" height="440" rx="8" fill="#172438" fillOpacity="0.6" stroke="#F4F7FB" strokeOpacity="0.14" />
          <path d="M640 250 H900" stroke="#35D6E8" strokeWidth="3" />
          <rect x="1110" y="318" width="24" height="24" rx="3" fill="#786BFF" />
        </svg>
        <svg width={(logoH * width) / height} height={logoH} viewBox={`0 0 ${width} ${height}`}>
          <g transform={symbolTransform}>
            <path fill="#35D6E8" d={SYMBOL_PATHS.j} />
            <path fill="#F4F7FB" d={SYMBOL_PATHS.d} />
            <rect fill="#786BFF" x={SYMBOL_PATHS.signal.x} y={SYMBOL_PATHS.signal.y} width={6} height={6} />
          </g>
          <path fill="#F4F7FB" transform={wordTransform} d={wordPath} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 760 }}>
          {eyebrow ? <div style={{ fontSize: 28, color: "#7FE6F1", marginBottom: 20 }}>{eyebrow}</div> : null}
          <div style={{ fontSize: 64, lineHeight: 1.05, color: "#F4F7FB", fontWeight: 600, letterSpacing: "-0.02em" }}>{title}</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Instrument Sans", data: semibold, weight: 600, style: "normal" },
        { name: "Instrument Sans", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
