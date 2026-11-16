import { Plus } from "lucide-react";
import type { Faq } from "@/content/types";

/** Accessible FAQ built on native <details>/<summary> — keyboard and screen-reader friendly by default. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="border-t border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="faq-item group border-b border-line">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 text-left [&::-webkit-details-marker]:hidden">
            <span className="type-title">{faq.question}</span>
            <span
              aria-hidden="true"
              className="mt-0.5 grid size-8 flex-none place-items-center rounded-full border border-line-strong text-fg-muted transition-transform duration-300 ease-signal group-open:rotate-45 group-open:border-accent-text group-open:text-accent-text"
            >
              <Plus size={16} strokeWidth={2} />
            </span>
          </summary>
          <div className="faq-answer pb-7 pr-12">
            <p className="prose-measure text-fg-muted">{faq.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
