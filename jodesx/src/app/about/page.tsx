import { ClosingCta } from "@/components/sections/ClosingCta";
import { PageHero } from "@/components/sections/PageHero";
import { LogoSymbol } from "@/components/brand/Logo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section, SectionHeader } from "@/components/ui/Section";
import { about } from "@/content/pages";
import { createMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";

export const metadata = createMetadata({
  title: "About JoDesx",
  description:
    "JoDesx is a Jordan-based business operations company helping international businesses extend their operational capacity through structured teams, remote or on-site, and well-defined workflows.",
  path: "/about",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero crumbs={crumbs} title={about.hero.title} lead={about.hero.lead} />

      <Section surface="light" labelledBy="why-exists-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader id="why-exists-title" title={about.why.title} size="md" />
          <div className="grid max-w-[64ch] gap-6 text-[1.125rem] leading-relaxed text-fg-muted">
            {about.why.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section surface="paper" labelledBy="philosophy-title">
        <SectionHeader
          id="philosophy-title"
          title="How we think about people and process"
          lead="Four beliefs shape every engagement we take on."
          size="md"
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line md:grid-cols-2">
          {about.philosophy.map((p) => (
            <li key={p.title} className="bg-surface-raised p-7 sm:p-9">
              <h3 className="type-title">{p.title}</h3>
              <p className="mt-3 text-fg-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section surface="dark" labelledBy="jordan-title">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeader id="jordan-title" title={about.jordan.title} size="md" />
            <div className="mt-6 grid max-w-[60ch] gap-5 text-fg-muted">
              {about.jordan.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
            </div>
          </div>
          <TimeZoneBand />
        </div>
      </Section>

      <Section surface="light" labelledBy="name-title">
        <div className="grid items-center gap-10 md:grid-cols-[auto_1fr]">
          <div className="surface-dark grid size-40 place-items-center rounded-[var(--radius-xl)]">
            <LogoSymbol size={88} />
          </div>
          <div className="max-w-2xl">
            <h2 id="name-title" className="type-display-md">
              The mark
            </h2>
            <p className="mt-4 text-fg-muted">
              The JoDesx symbol joins a J and a D around a single square. The J is the connection to our clients; the D is the structure we
              build around their work; the square held inside is the operation itself — defined, contained and visible.
            </p>
          </div>
        </div>
      </Section>

      <ClosingCta
        title="Let's talk about your operation."
        body="If the way we work sounds like what your business needs, the next step is a conversation."
        secondary={{ label: "How we work", href: "/how-we-work" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}

/** Business-hours overlap, shown as three bands against the Jordan working day (UTC+3). */
function TimeZoneBand() {
  // Hours expressed in Jordan local time (UTC+3), standard working day 09:00–18:00.
  const rows = [
    { label: "Jordan (UTC+3)", from: 9, to: 18, tone: "bg-cyan-400" },
    { label: "Central Europe (UTC+1)", from: 11, to: 20, tone: "bg-mist-300" },
    { label: "Gulf (UTC+4)", from: 8, to: 17, tone: "bg-mist-300" },
    { label: "US Eastern (UTC−5)", from: 17, to: 26, tone: "bg-mist-300" },
  ];
  const start = 6;
  const span = 22; // 06:00 → 04:00 next day
  return (
    <figure className="panel p-6 sm:p-8">
      <figcaption className="text-sm text-fg-muted">Standard working hours (09:00–18:00 local, winter time), shown in Jordan time</figcaption>
      <ul className="mt-6 grid gap-5">
        {rows.map((r) => (
          <li key={r.label}>
            <p className="text-sm font-medium">{r.label}</p>
            <div className="relative mt-2 h-2 rounded-full bg-line">
              <span
                className={`absolute inset-y-0 rounded-full ${r.tone}`}
                style={{ left: `${((r.from - start) / span) * 100}%`, width: `${((r.to - r.from) / span) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="relative mt-3 h-4 text-xs text-fg-subtle" aria-hidden="true">
        {[6, 12, 18, 24].map((h) => (
          <span key={h} className="absolute -translate-x-1/2 first:translate-x-0" style={{ left: `${((h - start) / span) * 100}%` }}>
            {String(h % 24).padStart(2, "0")}:00
          </span>
        ))}
      </div>
    </figure>
  );
}
