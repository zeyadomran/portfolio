import type { MetadataRoute } from "next";
import { isPreviewDeployment, siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Crawling remains allowed so preview crawlers can read the HTML noindex tag.
    rules: { userAgent: "*", allow: "/" },
    sitemap: isPreviewDeployment ? undefined : siteUrl("/sitemap.xml"),
  };
}
