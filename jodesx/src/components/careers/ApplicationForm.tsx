"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type DragEvent, type FormEvent } from "react";
import { AlertCircle, Check, FileText, LoaderCircle, Upload, X } from "lucide-react";
import { Field, Select, TextArea, TextInput } from "@/components/forms/fields";
import {
  applicationFieldErrors,
  applicationSchema,
  availabilityOptions,
  checkCvBasics,
  CV_ACCEPT,
  type ApplicationField,
  type ApplicationInput,
} from "@/lib/validation/application";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; reference: string | null }
  | { kind: "error"; message: string; notConfigured?: boolean };

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  profileUrl: "",
  languages: "",
  availability: "",
  message: "",
  consent: false,
  website: "",
};
type Values = typeof EMPTY;

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface ApplicationFormProps {
  /** Job slug, or "general" for an open application. */
  job: string;
  roleTitle: string;
  contactEmail: string;
  /** When false, the CV is optional. */
  cvRequired?: boolean;
}

export function ApplicationForm({ job, roleTitle, contactEmail, cvRequired = true }: ApplicationFormProps) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [cv, setCv] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ApplicationField, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<ApplicationField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [startedAt] = useState(() => Date.now());
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status.kind === "success" || status.kind === "error") resultRef.current?.focus();
  }, [status.kind]);

  const toInput = (v: Values): ApplicationInput => ({
    job,
    fullName: v.fullName,
    email: v.email,
    phone: v.phone,
    location: v.location,
    profileUrl: v.profileUrl || undefined,
    languages: v.languages,
    availability: v.availability,
    message: v.message,
    consent: v.consent as true,
    startedAt,
  });

  const validate = (v: Values, file: File | null) => {
    const parsed = applicationSchema.safeParse(toInput(v));
    const found = parsed.success ? {} : applicationFieldErrors(parsed.error);
    const cvError = !cvRequired && !file ? null : checkCvBasics(file);
    if (cvError) found.cv = cvError;
    return found;
  };

  const update = <K extends keyof Values>(key: K, value: Values[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key as ApplicationField]) setErrors(validate(next, cv));
  };

  const blur = (key: ApplicationField) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(values, cv));
  };

  const chooseFile = (file: File | null) => {
    setCv(file);
    setTouched((t) => ({ ...t, cv: true }));
    setErrors(validate(values, file));
  };

  const errorFor = (key: ApplicationField) => (touched[key] ? errors[key] : undefined);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) chooseFile(file);
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const found = validate(values, cv);
    setTouched(Object.fromEntries([...Object.keys(EMPTY), "cv"].map((k) => [k, true])));
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const body = new FormData();
    const input = toInput(values);
    for (const [k, v] of Object.entries(input)) if (v !== undefined) body.append(k, String(v));
    body.append("website", values.website);
    if (cv) body.append("cv", cv);

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/careers/apply", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        reference?: string | null;
        fields?: Partial<Record<ApplicationField, string>>;
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
      setStatus({
        kind: "error",
        message: data.message ?? "Something went wrong while sending. Please try again.",
        notConfigured: data.code === "not_configured",
      });
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach the server. Check your connection and try again." });
    }
  }

  if (status.kind === "success") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="blueprint-detail rounded-[var(--radius-lg)] border border-line bg-surface-raised p-8 outline-none sm:p-10">
        <span className="grid size-12 place-items-center rounded-full bg-navy-900 text-cyan-400">
          <Check size={22} aria-hidden="true" />
        </span>
        <h3 className="type-display-md mt-6">Application received.</h3>
        <p className="mt-4 text-fg-muted">
          Thank you, {values.fullName.split(" ")[0]}. Your application for <strong className="text-fg">{roleTitle}</strong> has been sent to the
          JoDesx team{status.reference ? <> with reference <strong className="text-fg">{status.reference}</strong></> : null}.
        </p>
        <p className="mt-3 text-fg-muted">A person will read it. If your profile matches the role, we&rsquo;ll contact you about the next step.</p>
        <Link href="/careers#roles" className="link-signal mt-8">
          See other open roles
        </Link>
      </div>
    );
  }

  const submitting = status.kind === "submitting";
  const cvError = errorFor("cv");

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-10">
      <p className="text-sm text-fg-subtle">
        Applying for <strong className="text-fg">{roleTitle}</strong>. Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">required</span> are required.
      </p>

      <fieldset className="grid gap-5">
        <legend className="type-title mb-5">Your details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="fullName" label="Full name" required error={errorFor("fullName")}>
            {(a) => <TextInput {...a} name="fullName" autoComplete="name" value={values.fullName} onChange={(e) => update("fullName", e.target.value)} onBlur={() => blur("fullName")} />}
          </Field>
          <Field id="email" label="Email" required error={errorFor("email")}>
            {(a) => (
              <TextInput {...a} name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} value={values.email} onChange={(e) => update("email", e.target.value)} onBlur={() => blur("email")} />
            )}
          </Field>
          <Field id="phone" label="Phone" required error={errorFor("phone")} hint="Include the country code.">
            {(a) => <TextInput {...a} name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} onBlur={() => blur("phone")} />}
          </Field>
          <Field id="location" label="City and country" required error={errorFor("location")}>
            {(a) => (
              <TextInput {...a} name="location" autoComplete="address-level2" placeholder="e.g. Amman, Jordan" value={values.location} onChange={(e) => update("location", e.target.value)} onBlur={() => blur("location")} />
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="type-title mb-5">Your experience</legend>

        <div className="grid gap-2">
          <span className="font-medium" id="cv-label">
            CV {cvRequired ? <span aria-hidden="true">*</span> : <span className="font-normal text-fg-subtle">(optional)</span>}
          </span>
          <div
            className="dropzone relative rounded-[var(--radius-md)] bg-paper p-5"
            data-dragging={dragging}
            data-invalid={Boolean(cvError)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileRef}
              id="cv"
              name="cv"
              type="file"
              accept={CV_ACCEPT}
              aria-labelledby="cv-label"
              aria-describedby={cvError ? "cv-error cv-hint" : "cv-hint"}
              aria-invalid={Boolean(cvError)}
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => chooseFile(e.target.files?.[0] ?? null)}
            />
            {cv ? (
              <div className="flex items-center gap-4">
                <span className="grid size-11 flex-none place-items-center rounded-[var(--radius-md)] bg-navy-900 text-cyan-400">
                  <FileText size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{cv.name}</span>
                  <span className="block text-sm text-fg-subtle">{formatSize(cv.size)}</span>
                  <span id="cv-hint" className="sr-only">
                    PDF, DOC or DOCX, up to 4 MB
                  </span>
                </span>
                <button
                  type="button"
                  className="relative z-10 grid size-9 place-items-center rounded-full border border-line-strong text-fg-muted hover:text-fg"
                  aria-label="Remove file"
                  onClick={() => {
                    chooseFile(null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="pointer-events-none flex items-center gap-4">
                <span className="grid size-11 flex-none place-items-center rounded-[var(--radius-md)] border border-line-strong text-fg-muted">
                  <Upload size={20} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">Drop your CV here or click to choose a file</span>
                  <span id="cv-hint" className="block text-sm text-fg-subtle">
                    PDF, DOC or DOCX · up to 4 MB
                  </span>
                </span>
              </div>
            )}
          </div>
          {cvError && (
            <p id="cv-error" className="field-error">
              <AlertCircle size={15} aria-hidden="true" />
              {cvError}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="languages" label="Languages you speak" required error={errorFor("languages")} hint="Include your level, e.g. English (fluent), Arabic (native).">
            {(a) => <TextInput {...a} name="languages" value={values.languages} onChange={(e) => update("languages", e.target.value)} onBlur={() => blur("languages")} />}
          </Field>
          <Field id="availability" label="When could you start?" required error={errorFor("availability")}>
            {(a) => (
              <Select {...a} name="availability" value={values.availability} onChange={(e) => update("availability", e.target.value)} onBlur={() => blur("availability")}>
                <option value="" disabled>
                  Choose one
                </option>
                {availabilityOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>

        <Field id="profileUrl" label="LinkedIn or portfolio link" optional error={errorFor("profileUrl")}>
          {(a) => (
            <TextInput {...a} name="profileUrl" type="url" inputMode="url" placeholder="https://" value={values.profileUrl} onChange={(e) => update("profileUrl", e.target.value)} onBlur={() => blur("profileUrl")} />
          )}
        </Field>

        <Field
          id="message"
          label="Why are you a good fit?"
          required
          error={errorFor("message")}
          hint="A few sentences about relevant experience, strengths, or why this work interests you."
          counter={`${values.message.trim().length} / 3000`}
        >
          {(a) => <TextArea {...a} name="message" rows={6} maxLength={3000} value={values.message} onChange={(e) => update("message", e.target.value)} onBlur={() => blur("message")} />}
        </Field>
      </fieldset>

      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="app-website">Website</label>
        <input id="app-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
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
            I agree that JoDesx may use my details and CV to assess my application, as described in the{" "}
            <Link href="/privacy#candidates" className="font-medium text-fg underline underline-offset-4">
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

      {status.kind === "error" && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="rounded-[var(--radius-md)] border border-[color:var(--danger)] bg-[color-mix(in_oklab,var(--danger)_7%,transparent)] p-5 outline-none">
          <p className="flex items-start gap-2 font-semibold">
            <AlertCircle size={18} className="mt-0.5 flex-none text-[color:var(--danger)]" aria-hidden="true" />
            {status.message}
          </p>
          {status.notConfigured && (
            <p className="mt-2 pl-[26px] text-fg-muted">
              {contactEmail ? (
                <>
                  Please email your CV to{" "}
                  <a className="font-medium text-fg underline underline-offset-4" href={`mailto:${contactEmail}?subject=${encodeURIComponent(`Application: ${roleTitle}`)}`}>
                    {contactEmail}
                  </a>{" "}
                  instead. Your details are kept in the form.
                </>
              ) : (
                <>Your details are kept in the form, so you can try again later.</>
              )}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <button type="submit" className="btn btn-primary min-w-52" disabled={submitting} aria-disabled={submitting}>
          {submitting ? (
            <>
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
              Sending application…
            </>
          ) : (
            "Send application"
          )}
        </button>
        <p className="text-sm text-fg-subtle">Your details are used only for recruitment.</p>
      </div>
    </form>
  );
}
