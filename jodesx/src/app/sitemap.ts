import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { getOpenJobs } from "@/lib/careers/jobs";
import { absoluteUrl } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    ...services.map((s) => ({ path: s.href, priority: 0.9 })),
    { path: "/why-jodesx", priority: 0.8 },
    { path: "/how-we-work", priority: 0.7 },
    { path: "/careers", priority: 0.7 },
    { path: "/careers/apply", priority: 0.4 },
    ...getOpenJobs().map((j) => ({ path: `/careers/${j.slug}`, priority: 0.6 })),
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.2 },
    { path: "/terms", priority: 0.2 },
  ];
  return routes.map((r) => ({ url: absoluteUrl(r.path), lastModified: now, changeFrequency: "monthly", priority: r.priority }));
}
