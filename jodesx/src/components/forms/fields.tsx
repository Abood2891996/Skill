import { AlertCircle } from "lucide-react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

/** Accessibility attributes the Field passes down to its control. */
export interface ControlA11y {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  error?: string;
  counter?: string;
  children: (a11y: ControlA11y) => ReactNode;
}

/** Label + control + hint + error, with ids wired for screen readers. */
export function Field({ id, label, required, optional, hint, error, counter, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-medium">
          {label}
          {required && <span aria-hidden="true"> *</span>}
          {optional && <span className="ml-1.5 text-sm font-normal text-fg-subtle">(optional)</span>}
        </label>
        {counter && (
          <span className="text-xs tabular-nums text-fg-subtle" aria-hidden="true">
            {counter}
          </span>
        )}
      </div>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy, "aria-required": required || undefined })}
      {error && (
        <p id={errorId} className="field-error">
          <AlertCircle size={15} aria-hidden="true" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="text-sm text-fg-subtle">
          {hint}
        </p>
      )}
      {hint && error && (
        <p id={hintId} className="sr-only">
          {hint}
        </p>
      )}
    </div>
  );
}

const controlBase =
  "form-control w-full rounded-[var(--radius-sm)] border bg-paper px-3.5 text-[1rem] text-ink transition-[border-color,box-shadow] duration-150 placeholder:text-fg-subtle";

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlBase, "h-12", className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlBase, "min-h-36 resize-y py-3 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(controlBase, "h-12 appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <svg aria-hidden="true" viewBox="0 0 16 16" className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-fg-subtle" fill="none">
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
