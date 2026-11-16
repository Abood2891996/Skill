import { services } from "./services";

export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export const serviceNav: NavLink[] = services.map((s) => ({
  label: s.name,
  href: s.href,
  description: s.summary,
}));

export const primaryNav: NavLink[] = [
  { label: "How we work", href: "/how-we-work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: [{ label: "All services", href: "/services" }, ...serviceNav.map(({ label, href }) => ({ label, href }))],
  },
  {
    title: "Company",
    links: [
      { label: "How we work", href: "/how-we-work" },
      { label: "About JoDesx", href: "/about" },
      { label: "Start an inquiry", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [{ label: "Privacy policy", href: "/privacy" }],
  },
];
