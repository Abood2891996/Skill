import { getService } from "@/content/services";
import { OG_SIZE, renderOgImage } from "@/lib/seo/og-image";

const service = getService("content-moderation");

export const alt = `${service.name} — JoDesx`;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ title: service.tagline, eyebrow: service.name });
}
