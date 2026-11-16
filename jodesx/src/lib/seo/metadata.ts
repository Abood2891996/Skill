import type { Metadata } from "next";
import { absoluteUrl, site } from "@/content/site";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  /** Use the bare title without the " | JoDesx" suffix (home page). */
  absoluteTitle?: boolean;
}

/** Builds consistent per-page metadata: title, description, canonical, Open Graph, Twitter. */
export function createMetadata({ title, description, path, absoluteTitle = false }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
