import { OG_SIZE, renderOgImage } from "@/lib/seo/og-image";

export const alt = "JoDesx — Operations, structured around your business.";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ title: "Operations, structured around your business.", eyebrow: "Business operations and outsourcing" });
}
