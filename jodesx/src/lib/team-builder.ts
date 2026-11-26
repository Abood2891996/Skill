/**
 * Options for the "Build your team" tool. Shared by the tool (homepage) and the
 * contact form, which turns the chosen values back into labels. Only these
 * fixed values are ever read from the URL.
 */
export const teamLanguages = [
  { value: "ar-en", label: "Arabic and English" },
  { value: "ar", label: "Arabic" },
  { value: "en", label: "English" },
] as const;

export const teamHours = [
  { value: "business", label: "Business hours" },
  { value: "extended", label: "Extended hours" },
  { value: "discuss", label: "Not sure yet" },
] as const;

export const teamWhere = [
  { value: "remote", label: "Remote" },
  { value: "onsite", label: "On-site in Jordan" },
] as const;

export const teamSizes = [
  { value: "1-5", label: "1–5 people", units: 4 },
  { value: "6-15", label: "6–15 people", units: 10 },
  { value: "16-50", label: "16–50 people", units: 24 },
  { value: "50-plus", label: "More than 50 people", units: 36 },
] as const;

const labelOf = <T extends readonly { value: string; label: string }[]>(list: T, value: string | null) =>
  list.find((o) => o.value === value)?.label;

/** A one-line summary for the contact form, built only from known option labels. */
export function teamBrief(params: { get(name: string): string | null }): string {
  const parts = [labelOf(teamLanguages, params.get("lang")), labelOf(teamHours, params.get("hours")), labelOf(teamWhere, params.get("where"))].filter(Boolean);
  return parts.length ? `Team I have in mind: ${parts.join(" · ")}.\n\n` : "";
}
