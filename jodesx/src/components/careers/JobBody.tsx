import type { Block, InlineSegment } from "@/lib/careers/markdown";

function Inline({ segments }: { segments: InlineSegment[] }) {
  return (
    <>
      {segments.map((s, i) => (s.bold ? <strong key={i}>{s.text}</strong> : <span key={i}>{s.text}</span>))}
    </>
  );
}

/** Renders parsed job-post blocks as React elements (never as raw HTML). */
export function JobBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="job-prose">
      {blocks.map((b, i) => {
        if (b.type === "heading") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "list") {
          const items = b.items.map((item, j) => (
            <li key={j}>
              {b.ordered ? (
                <span>
                  <Inline segments={item} />
                </span>
              ) : (
                <Inline segments={item} />
              )}
            </li>
          ));
          return b.ordered ? (
            <ol key={i} className="job-steps">
              {items}
            </ol>
          ) : (
            <ul key={i}>{items}</ul>
          );
        }
        return (
          <p key={i}>
            <Inline segments={b.content} />
          </p>
        );
      })}
    </div>
  );
}

/** Plain-text version of a job post (for structured data). */
export function blocksToText(blocks: Block[]): string {
  const inline = (s: InlineSegment[]) => s.map((x) => x.text).join("");
  return blocks
    .map((b) => (b.type === "heading" ? b.text : b.type === "list" ? b.items.map((i) => `• ${inline(i)}`).join("\n") : inline(b.content)))
    .join("\n\n");
}
