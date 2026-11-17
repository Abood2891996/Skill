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
  { label: "Why JoDesx", href: "/why-jodesx" },
  { label: "How we work", href: "/how-we-work" },
  { label: "About", href: "/about" },
  { label: "Careers", href: "/careers" },
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
      { label: "Why JoDesx", href: "/why-jodesx" },
      { label: "How we work", href: "/how-we-work" },
      { label: "About JoDesx", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Start an inquiry", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of use", href: "/terms" },
    ],
  },
];
