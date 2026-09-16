import type { HtmlTagDescriptor } from "vite";
import { site, siteUrl } from "../src/lib/seo.ts";

export function isPreviewDeployment(environment = process.env.VERCEL_ENV) {
  return environment === "preview" || environment === "development";
}

export function metadataTags(
  environment: Record<string, string>,
): HtmlTagDescriptor[] {
  const preview = isPreviewDeployment(environment.VERCEL_ENV);
  const robots = `${preview ? "noindex" : "index"}, follow`;
  const meta = (name: string, content: string): HtmlTagDescriptor => ({
    tag: "meta",
    attrs: { name, content },
    injectTo: "head",
  });
  const og = (property: string, content: string): HtmlTagDescriptor => ({
    tag: "meta",
    attrs: { property, content },
    injectTo: "head",
  });
  const tags: HtmlTagDescriptor[] = [
    { tag: "title", children: site.title, injectTo: "head" },
    meta("description", site.description),
    meta("application-name", site.name),
    meta("author", site.name),
    meta("creator", site.name),
    meta("publisher", site.name),
    meta("robots", robots),
    meta(
      "googlebot",
      `${robots}, max-image-preview:large, max-snippet:-1, max-video-preview:-1`,
    ),
    meta("theme-color", "#f1f3ef"),
    meta("color-scheme", "light"),
    {
      tag: "link",
      attrs: { rel: "canonical", href: site.url },
      injectTo: "head",
    },
    { tag: "link", attrs: { rel: "author", href: site.url }, injectTo: "head" },
    {
      tag: "link",
      attrs: { rel: "icon", type: "image/svg+xml", href: "/icon.svg" },
      injectTo: "head",
    },
    og("og:type", "website"),
    og("og:locale", "en_CA"),
    og("og:site_name", site.name),
    og("og:title", site.title),
    og("og:description", site.description),
    og("og:url", site.url),
    og("og:image", siteUrl("/opengraph-image.png")),
    og("og:image:type", "image/png"),
    og("og:image:width", "1200"),
    og("og:image:height", "630"),
    og("og:image:alt", site.socialImageAlt),
    meta("twitter:card", "summary_large_image"),
    meta("twitter:title", site.title),
    meta("twitter:description", site.description),
    meta("twitter:image", siteUrl("/opengraph-image.png")),
    meta("twitter:image:alt", site.socialImageAlt),
  ];
  if (environment.GOOGLE_SITE_VERIFICATION)
    tags.push(
      meta("google-site-verification", environment.GOOGLE_SITE_VERIFICATION),
    );
  if (environment.BING_SITE_VERIFICATION)
    tags.push(meta("msvalidate.01", environment.BING_SITE_VERIFICATION));
  return tags;
}

export function crawlerFiles(preview: boolean) {
  return {
    "robots.txt": `User-agent: *\nAllow: /\n${preview ? "" : `\nSitemap: ${siteUrl("/sitemap.xml")}\n`}`,
    "sitemap.xml": `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${preview ? "" : `\n  <url><loc>${site.url}</loc></url>\n`}</urlset>\n`,
  };
}
