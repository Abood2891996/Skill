import Link from "next/link";
import { Markdown } from "@/components/Markdown";
import { getDictionary } from "@/lib/i18n/server";

export default async function HomePage() {
  const { t } = await getDictionary();
  const h = t.home;
  return (
    <main>
      {/* Hero: the promise on one side, a real-looking notebook exchange on the other. */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-16">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-[1.3] text-balance text-ink sm:text-5xl md:text-[3.2rem]">{h.title}</h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft">{h.lead}</p>
          <Link
            href="/learn"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-pen px-7 text-base font-semibold text-on-pen transition-colors hover:bg-pen-strong"
          >
            {h.cta}
          </Link>
        </div>

        <figure className="relative">
          <div className="ruled write-in rounded-2xl border border-rule pe-4 pb-6 pt-5 shadow-[0_1px_0_var(--rule),0_18px_40px_-28px_rgba(22,48,42,.45)] ps-11 sm:ps-16">
            <p dir="auto" className="text-lg font-medium">
              <span className="marker">{h.demoQuestion}</span>
            </p>
            <div className="mt-4 text-[0.97rem]">
              <Markdown>{h.demoAnswer}</Markdown>
            </div>
          </div>
          <figcaption className="mt-3 text-sm text-ink-soft">{h.demoCaption}</figcaption>
        </figure>
      </section>

      {/* How to start: a real sequence, so it is numbered. */}
      <section className="border-y border-rule bg-sheet">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold">{h.stepsTitle}</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-3">
            {h.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-pen font-display text-lg font-semibold text-pen"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-ink-soft">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl font-semibold">{h.traitsTitle}</h2>
        <dl className="mt-6 grid gap-x-12 gap-y-7 sm:grid-cols-2">
          {h.traits.map((tr) => (
            <div key={tr.title} className="border-s-2 border-pen ps-4">
              <dt className="font-semibold">{tr.title}</dt>
              <dd className="text-ink-soft">{tr.body}</dd>
            </div>
          ))}
        </dl>

        <aside className="mt-12 rounded-xl bg-pen-tint px-5 py-4">
          <h2 className="font-semibold">{h.noticeTitle}</h2>
          <p className="text-ink-soft">{h.notice}</p>
        </aside>
      </section>
    </main>
  );
}
