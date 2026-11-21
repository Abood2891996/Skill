import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { detectLanguage } from "@/lib/tutor/language";

/**
 * Renders the tutor's reply: Markdown, tables, math (KaTeX) and code.
 * Raw HTML in replies is NOT rendered (react-markdown escapes it), which
 * protects against injected scripts (XSS).
 *
 * dir="auto" on each block lets every paragraph pick its own direction, so
 * an English sentence inside an Arabic reply still reads correctly.
 */
const components: Components = {
  p: ({ node: _n, ...props }) => <p dir="auto" {...props} />,
  li: ({ node: _n, ...props }) => <li dir="auto" {...props} />,
  h1: ({ node: _n, ...props }) => <h3 dir="auto" {...props} />,
  h2: ({ node: _n, ...props }) => <h3 dir="auto" {...props} />,
  h3: ({ node: _n, ...props }) => <h4 dir="auto" {...props} />,
  td: ({ node: _n, ...props }) => <td dir="auto" {...props} />,
  th: ({ node: _n, ...props }) => <th dir="auto" {...props} />,
  blockquote: ({ node: _n, ...props }) => <blockquote dir="auto" {...props} />,
  table: ({ node: _n, ...props }) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  a: ({ node: _n, href, ...props }) => {
    const safe = typeof href === "string" && /^https?:\/\//.test(href) ? href : undefined;
    return <a href={safe} target="_blank" rel="noopener noreferrer nofollow" {...props} />;
  },
  // Tutor replies never need images; skip them so nothing loads from other sites.
  img: () => null,
};

export function Markdown({ children }: { children: string }) {
  // The reply's main language sets the direction of tables and lists;
  // individual paragraphs still choose their own direction.
  const dir = detectLanguage(children) === "ar" ? "rtl" : "ltr";
  return (
    <div className="prose-tutor" dir={dir}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: true }]]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: "ignore" }], [rehypeHighlight, { detect: false, ignoreMissing: true }]]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
