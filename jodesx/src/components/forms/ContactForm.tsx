"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, Check, Copy, LoaderCircle } from "lucide-react";
import { challenges } from "@/content/pages";
import { teamBrief } from "@/lib/team-builder";
import {
  contactMethodOptions,
  contactSchema,
  fieldErrors,
  isPersonalEmail,
  serviceOptions,
  teamSizeOptions,
  timelineOptions,
  type ContactField,
  type ContactInput,
} from "@/lib/validation/contact";
import { cn } from "@/lib/utils/cn";
import { Field, Select, TextArea, TextInput } from "./fields";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; reference: string | null }
  | { kind: "not_configured"; message: string }
  | { kind: "error"; message: string };

type Values = {
  name: string;
  email: string;
  company: string;
  service: string;
  requirements: string;
  teamSize: string;
  timeline: string;
  contactMethod: string;
  phone: string;
  consent: boolean;
  website: string;
};

const EMPTY: Values = {
  name: "",
  email: "",
  company: "",
  service: "",
  requirements: "",
  teamSize: "",
  timeline: "",
  contactMethod: "email",
  phone: "",
  consent: false,
  website: "",
};

function toInput(v: Values, startedAt: number): ContactInput {
  return {
    name: v.name,
    email: v.email,
    company: v.company,
    service: v.service as ContactInput["service"],
    requirements: v.requirements,
    teamSize: (v.teamSize || undefined) as ContactInput["teamSize"],
    timeline: (v.timeline || undefined) as ContactInput["timeline"],
    contactMethod: v.contactMethod as ContactInput["contactMethod"],
    phone: v.phone || undefined,
    consent: v.consent as true,
    website: v.website || undefined,
    startedAt,
  };
}

export function ContactForm({ contactEmail }: { contactEmail: string }) {
  const params = useSearchParams();
  const [values, setValues] = useState<Values>(() => {
    const service = params.get("service") ?? "";
    const challenge = challenges.find((c) => c.id === params.get("challenge"));
    return {
      ...EMPTY,
      service: serviceOptions.some((o) => o.value === service) ? service : "",
      teamSize: teamSizeOptions.some((o) => o.value === params.get("team")) ? (params.get("team") as string) : EMPTY.teamSize,
      requirements: (challenge ? `Main challenge: ${challenge.label}.\n\n` : "") + teamBrief(params),
    };
  });
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [copied, setCopied] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (status.kind === "success" || status.kind === "not_configured" || status.kind === "error") {
      resultRef.current?.focus();
    }
  }, [status.kind]);

  const validate = (v: Values) => {
    const parsed = contactSchema.safeParse(toInput(v, startedAt));
    return parsed.success ? {} : fieldErrors(parsed.error);
  };

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key as ContactField]) setErrors(validate(next));
  };

  const blur = (key: ContactField) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(values));
  };

  const errorFor = (key: ContactField) => (touched[key] ? errors[key] : undefined);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const found = validate(values);
    const allTouched = Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])) as Record<ContactField, boolean>;
    setTouched(allTouched);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toInput(values, startedAt)),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        reference?: string | null;
        fields?: Partial<Record<ContactField, string>>;
      };

      if (res.ok && data.ok) {
        setStatus({ kind: "success", reference: data.reference ?? null });
        return;
      }
      if (data.code === "validation" && data.fields) {
        setErrors(data.fields);
        setStatus({ kind: "idle" });
        return;
      }
      if (data.code === "not_configured") {
        setStatus({ kind: "not_configured", message: data.message ?? "Online inquiries are not connected yet." });
        return;
      }
      setStatus({ kind: "error", message: data.message ?? "Something went wrong while sending. Please try again." });
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the server. Check your connection and try again." });
    }
  }

  const summaryText = () => {
    const label = (opts: readonly { value: string; label: string }[], v: string) => opts.find((o) => o.value === v)?.label ?? "—";
    return [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Company: ${values.company}`,
      `Service: ${label(serviceOptions, values.service)}`,
      `Team size: ${label(teamSizeOptions, values.teamSize)}`,
      `Timeline: ${label(timelineOptions, values.timeline)}`,
      `Preferred contact: ${label(contactMethodOptions, values.contactMethod)}${values.phone ? ` (${values.phone})` : ""}`,
      "",
      values.requirements,
    ].join("\n");
  };

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summaryText());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  if (status.kind === "success") {
    return (
      <div ref={resultRef} tabIndex={-1} className="blueprint-detail rounded-[var(--radius-lg)] border border-line bg-surface-raised p-8 outline-none sm:p-10" role="status">
        <span className="grid size-12 place-items-center rounded-full bg-navy-900 text-cyan-400">
          <Check size={22} aria-hidden="true" />
        </span>
        <h2 className="type-display-md mt-6">Inquiry received.</h2>
        <p className="mt-4 text-fg-muted">
          Thank you, {values.name.split(" ")[0]}. Your inquiry has been delivered to the JoDesx team
          {status.reference ? (
            <>
              {" "}
              with reference <strong className="text-fg">{status.reference}</strong>
            </>
          ) : null}
          .
        </p>
        <ol className="mt-8 grid gap-4 border-t border-line pt-6">
          <li className="flex gap-3">
            <span className="font-semibold text-accent-text">1.</span>
            <span className="text-fg-muted">We read it and note any questions about scope.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-accent-text">2.</span>
            <span className="text-fg-muted">
              We contact you by {contactMethodOptions.find((o) => o.value === values.contactMethod)?.label.toLowerCase()} to arrange a first conversation.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-semibold text-accent-text">3.</span>
            <span className="text-fg-muted">If there is a fit, we follow up with a written outline of scope and structure.</span>
          </li>
        </ol>
        <Link href="/how-we-work" className="link-signal mt-8">
          Read how engagements run
        </Link>
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  const personalEmailHint =
    values.email.includes("@") && isPersonalEmail(values.email) && !errorFor("email")
      ? "A company address helps us understand who we're speaking with — but this one works too."
      : undefined;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="contact-form grid gap-10" aria-describedby="form-required-note">
      <p id="form-required-note" className="text-sm text-fg-subtle">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">required</span> are required.
      </p>

      <fieldset className="grid gap-5">
        <legend className="type-title mb-5">About you</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="name" label="Full name" required error={errorFor("name")}>
            {(a) => (
              <TextInput {...a} name="name" autoComplete="name" value={values.name} onChange={(e) => update("name", e.target.value)} onBlur={() => blur("name")} />
            )}
          </Field>
          <Field id="company" label="Company" required error={errorFor("company")}>
            {(a) => (
              <TextInput
                {...a}
                name="company"
                autoComplete="organization"
                value={values.company}
                onChange={(e) => update("company", e.target.value)}
                onBlur={() => blur("company")}
              />
            )}
          </Field>
        </div>
        <Field id="email" label="Work email" required error={errorFor("email")} hint={personalEmailHint}>
          {(a) => (
            <TextInput
              {...a}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              onBlur={() => blur("email")}
            />
          )}
        </Field>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="type-title mb-5">About the work</legend>
        <Field id="service" label="Service of interest" required error={errorFor("service")}>
          {(a) => (
            <Select {...a} name="service" value={values.service} onChange={(e) => update("service", e.target.value)} onBlur={() => blur("service")}>
              <option value="" disabled>
                Choose a service
              </option>
              {serviceOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field
          id="requirements"
          label="What do you need help with?"
          required
          error={errorFor("requirements")}
          hint="The work involved, rough volumes, tools you use, and anything that makes it tricky."
          counter={`${values.requirements.trim().length} / 4000`}
        >
          {(a) => (
            <TextArea
              {...a}
              name="requirements"
              rows={6}
              maxLength={4000}
              value={values.requirements}
              onChange={(e) => update("requirements", e.target.value)}
              onBlur={() => blur("requirements")}
            />
          )}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="teamSize" label="Estimated team size" optional>
            {(a) => (
              <Select {...a} name="teamSize" value={values.teamSize} onChange={(e) => update("teamSize", e.target.value)}>
                <option value="">Select if known</option>
                {teamSizeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field id="timeline" label="Preferred start" optional>
            {(a) => (
              <Select {...a} name="timeline" value={values.timeline} onChange={(e) => update("timeline", e.target.value)}>
                <option value="">Select if known</option>
                {timelineOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="type-title mb-5">How should we reach you?</legend>
        <div className="grid grid-cols-3 gap-2">
          {contactMethodOptions.map((o) => {
            const checked = values.contactMethod === o.value;
            return (
              <label
                key={o.value}
                className={cn(
                  "flex cursor-pointer items-center justify-center rounded-[var(--radius-md)] border px-3 py-3 text-center text-[0.95rem] font-medium transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus)]",
                  checked ? "border-navy-900 bg-navy-900 text-soft-white" : "border-line-strong bg-paper hover:border-fg-subtle",
                )}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value={o.value}
                  checked={checked}
                  onChange={() => update("contactMethod", o.value)}
                  className="sr-only"
                />
                {o.label}
              </label>
            );
          })}
        </div>
        {values.contactMethod === "phone" && (
          <Field id="phone" label="Phone number" required error={errorFor("phone")} hint="Include the country code.">
            {(a) => (
              <TextInput
                {...a}
                name="phone"
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                onBlur={() => blur("phone")}
              />
            )}
          </Field>
        )}
      </fieldset>

      {/* Honeypot — hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
      </div>

      <div className="grid gap-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            onBlur={() => blur("consent")}
            aria-invalid={Boolean(errorFor("consent"))}
            aria-describedby={errorFor("consent") ? "consent-error" : undefined}
            className="mt-1 size-[18px] flex-none accent-[var(--violet-600)]"
          />
          <span className="text-fg-muted">
            I agree that JoDesx may use these details to respond to my inquiry, as described in the{" "}
            <Link href="/privacy" className="font-medium text-fg underline underline-offset-4">
              privacy policy
            </Link>
            . <span aria-hidden="true">*</span>
          </span>
        </label>
        {errorFor("consent") && (
          <p id="consent-error" className="field-error ml-[30px]">
            <AlertCircle size={15} aria-hidden="true" />
            {errorFor("consent")}
          </p>
        )}
      </div>

      {(status.kind === "error" || status.kind === "not_configured") && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="rounded-[var(--radius-md)] border border-[color:var(--danger)] bg-[color-mix(in_oklab,var(--danger)_7%,transparent)] p-5 outline-none">
          <p className="flex items-start gap-2 font-semibold">
            <AlertCircle size={18} className="mt-0.5 flex-none text-[color:var(--danger)]" aria-hidden="true" />
            {status.message}
          </p>
          {status.kind === "not_configured" && (
            <div className="mt-3 grid gap-3 pl-[26px] text-fg-muted">
              <p>
                {contactEmail ? (
                  <>
                    Please send your inquiry by email to{" "}
                    <a className="font-medium text-fg underline underline-offset-4" href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Inquiry from ${values.company}`)}&body=${encodeURIComponent(summaryText())}`}>
                      {contactEmail}
                    </a>
                    . Your details are kept in the form below.
                  </>
                ) : (
                  <>Your details are kept in the form. Copy them below so nothing is lost.</>
                )}
              </p>
              <button type="button" onClick={copySummary} className="btn btn-secondary btn-sm w-fit">
                {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                {copied ? "Copied" : "Copy my inquiry"}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="btn btn-primary min-w-48" disabled={submitting} aria-disabled={submitting}>
          {submitting ? (
            <>
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
              Sending inquiry…
            </>
          ) : (
            "Send inquiry"
          )}
        </button>
        <p className="text-sm text-fg-subtle">We only use these details to respond to you.</p>
      </div>
    </form>
  );
}
