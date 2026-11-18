import { ServicePageTemplate } from "@/components/services/ServicePageTemplate";
import { getService } from "@/content/services";
import { createMetadata } from "@/lib/seo/metadata";

const service = getService("call-center");

export const metadata = createMetadata({
  title: service.meta.title,
  description: service.meta.description,
  path: service.href,
});

export default function Page() {
  return <ServicePageTemplate service={service} />;
}
