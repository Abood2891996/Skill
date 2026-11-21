"use client";

import { ArrowUp, RotateCcw, Square } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { MODES, type Mode } from "@/config/catalog";
import { dictionaries, type ChatErrorCode, type Locale } from "@/lib/i18n/dictionaries";
import { detectLanguage } from "@/lib/tutor/language";
import { STATUS_MARK } from "@/lib/tutor/protocol";
import { Markdown } from "./Markdown";

type Msg = { role: "user" | "assistant"; content: string };

/** Quick-action messages, in the language the student is using. */
const QUICK_TEXT = {
  ar: { simpler: "اشرح أبسط", example: "أعطني مثال", quizMe: "اختبرني على هذا الدرس", notClear: "ما فهمت، اشرح بطريقة ثانية" },
  en: { simpler: "Explain it more simply", example: "Give me an example", quizMe: "Quiz me on this lesson", notClear: "I didn't get it, explain it another way" },
} as const;
type QuickKey = keyof (typeof QUICK_TEXT)["ar"];

const ERROR_CODES: ChatErrorCode[] = ["rate_limited", "too_fast", "too_long", "busy", "network", "refused", "generic"];
const asErrorCode = (v: unknown): ChatErrorCode => (ERROR_CODES.includes(v as ChatErrorCode) ? (v as ChatErrorCode) : "generic");

export function TutorChat(props: {
  locale: Locale;
  gradeId: string;
  subjectId: string;
  gradeLabel: string;
  subjectLabel: string;
  course?: string;
}) {
  const t = dictionaries[props.locale].chat;
  const storageKey = `sanad:chat:${props.gradeId}:${props.subjectId}`;

  const [messages, setMessages] = useState<Msg[]>([]);
  const [mode, setMode] = useState<Mode>("lesson");
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<ChatErrorCode | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [demo, setDemo] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const loaded = useRef(false);

  // Restore this grade+subject's conversation from the browser (phase 3 moves this to the account).
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? "null") as { messages?: Msg[]; mode?: Mode } | null;
      // Browser storage can only be read after hydration, so state is set in an effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved?.messages?.length) setMessages(saved.messages);
      if (saved?.mode && MODES.includes(saved.mode)) setMode(saved.mode);
    } catch {
      /* ignore */
    }
    loaded.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (!loaded.current || streaming) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ messages: messages.slice(-60), mode }));
    } catch {
      /* storage full or blocked */
    }
  }, [messages, mode, streaming, storageKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, error]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || streaming) return;
      setError(null);
      const history: Msg[] = [...messages, { role: "user", content }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setInput("");
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      let reply = "";
      let failure: ChatErrorCode | null = null;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grade: props.gradeId,
            subject: props.subjectId,
            mode,
            uiLocale: props.locale,
            course: props.course,
            messages: history,
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          failure = asErrorCode(data.error);
        } else {
          const left = Number(res.headers.get("X-Remaining"));
          if (Number.isFinite(left)) setRemaining(left);
          setDemo(res.headers.get("X-Demo") === "1");

          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            reply += decoder.decode(value, { stream: true });
            const shown = reply.split(STATUS_MARK)[0] ?? "";
            setMessages([...history, { role: "assistant", content: shown }]);
          }
          const [body, status] = reply.split(STATUS_MARK);
          reply = body ?? "";
          if (status) {
            try {
              failure = asErrorCode((JSON.parse(status) as { error?: string }).error);
            } catch {
              failure = "generic";
            }
          }
        }
      } catch (err) {
        if (!(err instanceof DOMException && err.name === "AbortError")) failure = "network";
      }

      setStreaming(false);
      abortRef.current = null;

      if (reply.trim()) {
        setMessages([...history, { role: "assistant", content: reply }]);
        if (failure) setError(failure);
      } else {
        // Nothing arrived: undo the turn and give the text back so the student can resend.
        setMessages(messages);
        setInput(content);
        setError(failure ?? "generic");
      }
    },
    [messages, mode, props.course, props.gradeId, props.locale, props.subjectId, streaming],
  );

  const stop = () => abortRef.current?.abort();

  const newChat = () => {
    stop();
    setMessages([]);
    setError(null);
    inputRef.current?.focus();
  };

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const convLang = detectLanguage(lastUser?.content ?? "", props.locale);
  const showQuick = !streaming && messages.length > 0 && messages[messages.length - 1]?.role === "assistant";

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends on devices with a keyboard; Shift+Enter makes a new line.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && window.matchMedia("(pointer: fine)").matches) {
      e.preventDefault();
      void send(input);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
      {/* Current level and subject */}
      <div className="flex flex-wrap items-center gap-2 border-b border-rule py-3">
        <span className="rounded-full bg-pen-tint px-3 py-1 text-sm font-semibold text-pen-strong">{props.subjectLabel}</span>
        <span className="rounded-full border border-rule px-3 py-1 text-sm">{props.gradeLabel}</span>
        {props.course && (
          <span dir="auto" className="max-w-[14rem] truncate rounded-full border border-rule px-3 py-1 text-sm">
            {props.course}
          </span>
        )}
        <Link href={`/learn?grade=${props.gradeId}&subject=${props.subjectId}`} className="text-sm text-pen underline underline-offset-4">
          {t.change}
        </Link>
        <button type="button" onClick={newChat} className="ms-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-soft hover:bg-pen-tint hover:text-ink">
          <RotateCcw aria-hidden className="size-4" />
          {t.newChat}
        </button>
      </div>

      {/* Kind of help */}
      <div role="radiogroup" aria-label={t.modeLabel} className="-mx-4 flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              mode === m ? "border-pen bg-pen text-on-pen" : "border-rule text-ink-soft hover:border-pen hover:text-ink"
            }`}
          >
            {t.modes[m]}
          </button>
        ))}
      </div>

      {/* The notebook page */}
      <section aria-live="polite" aria-busy={streaming} className="ruled flex-1 rounded-2xl border border-rule py-6 pe-4 ps-11 sm:ps-16">
        <div className="text-ink">
          <Markdown>{t.welcome(props.gradeLabel, props.subjectLabel)}</Markdown>
        </div>

        {messages.map((m, i) =>
          m.role === "user" ? (
            <p
              key={i}
              dir={detectLanguage(m.content, props.locale) === "ar" ? "rtl" : "ltr"}
              className="mt-7 whitespace-pre-wrap text-[1.05rem] font-medium"
            >
              <span className="sr-only">{props.locale === "ar" ? "أنت: " : "You: "}</span>
              <span className="marker">{m.content}</span>
            </p>
          ) : (
            <div key={i} className="mt-4">
              <span className="sr-only">{props.locale === "ar" ? "المدرّس: " : "Tutor: "}</span>
              {m.content ? (
                <div className={streaming && i === messages.length - 1 ? "caret" : undefined}>
                  <Markdown>{m.content}</Markdown>
                </div>
              ) : (
                <p className="caret text-ink-soft">{t.thinking}</p>
              )}
            </div>
          ),
        )}

        {showQuick && (
          <div className="mt-5 flex flex-wrap gap-2">
            {(Object.keys(QUICK_TEXT.ar) as QuickKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => void send(QUICK_TEXT[convLang][k])}
                className="rounded-full border border-pen/40 bg-sheet px-3 py-1.5 text-sm text-pen-strong hover:bg-pen-tint"
              >
                {t.quick[k]}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p role="alert" className="mt-5 rounded-lg border border-danger/40 bg-sheet px-4 py-3 text-danger">
            {t.errors[error]}
          </p>
        )}
        <div ref={endRef} />
      </section>

      {/* Composer */}
      <div className="sticky bottom-0 -mx-4 bg-paper/95 px-4 pb-4 pt-3 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 rounded-2xl border border-rule bg-sheet p-2 focus-within:border-pen"
        >
          <label htmlFor="question" className="sr-only">
            {t.placeholder}
          </label>
          <textarea
            id="question"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={t.placeholder}
            rows={1}
            maxLength={2000}
            dir="auto"
            className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-2 py-2 text-base text-ink placeholder:text-ink-soft/70 focus:outline-none [field-sizing:content]"
          />
          {streaming ? (
            <button type="button" onClick={stop} aria-label={t.stop} className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-rule text-ink hover:bg-pen-tint">
              <Square aria-hidden className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label={t.send}
              disabled={!input.trim()}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-pen text-on-pen hover:bg-pen-strong disabled:opacity-40"
            >
              <ArrowUp aria-hidden className="size-5" />
            </button>
          )}
        </form>
        <p className="mt-2 text-center text-xs text-ink-soft">{t.disclaimer}</p>
        {remaining !== null && <p className="text-center text-xs text-ink-soft">{t.remaining(remaining)}</p>}
        {demo && <p className="mt-1 text-center text-xs font-medium text-pen-strong">{t.demoBadge}</p>}
      </div>
    </main>
  );
}
