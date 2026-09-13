import type { MetadataRoute } from "next";
import { isPreviewDeployment, site } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  // Sections are anchors within one page, not independently indexable URLs.
  // Omit lastModified rather than report build time as a content update.
  return isPreviewDeployment ? [] : [{ url: site.url }];
}
