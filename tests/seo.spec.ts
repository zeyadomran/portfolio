import { test, expect } from "@playwright/test";
import { isPreviewDeployment, site } from "../src/lib/seo";

test("server HTML exposes canonical metadata and connected profile structured data", async ({
  page,
}) => {
  await page.route("**/*", (route) =>
    route.request().resourceType() === "script"
      ? route.abort()
      : route.continue(),
  );
  await page.goto("/");
  await expect(page).toHaveTitle(site.title);
  await expect(page.locator('head meta[name="description"]')).toHaveAttribute(
    "content",
    site.description,
  );
  await expect(page.locator('head link[rel="canonical"]')).toHaveCount(1);
  // Next.js normalizes the root URL without a trailing slash; both identify the same URL.
  const canonical = await page
    .locator('head link[rel="canonical"]')
    .getAttribute("href");
  const openGraphUrl = await page
    .locator('head meta[property="og:url"]')
    .getAttribute("content");
  expect(new URL(canonical!).href).toBe(site.url);
  expect(new URL(openGraphUrl!).href).toBe(site.url);
  await expect(
    page.locator('head meta[property="og:site_name"]'),
  ).toHaveAttribute("content", site.name);
  await expect(page.locator('head meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('head meta[name="robots"]')).toHaveAttribute(
    "content",
    isPreviewDeployment ? "noindex, follow" : "index, follow",
  );
  const data = JSON.parse(
    (await page.locator("#portfolio-structured-data").textContent()) || "{}",
  );
  expect(data["@context"]).toBe("https://schema.org");
  const person = data["@graph"].find(
    (entity: { "@type": string }) => entity["@type"] === "Person",
  );
  const profile = data["@graph"].find(
    (entity: { "@type": string }) => entity["@type"] === "ProfilePage",
  );
  expect(person.name).toBe(site.name);
  expect(person.sameAs).toEqual(site.profiles);
  expect(profile.mainEntity["@id"]).toBe(person["@id"]);
});

test("crawler endpoints contain only the canonical home page", async ({
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  const rules = await robots.text();
  expect(rules).toContain("Allow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  if (isPreviewDeployment) {
    expect(rules).not.toContain("Sitemap:");
    expect(xml).not.toContain("<loc>");
  } else {
    expect(rules).toContain(`Sitemap: ${site.url}sitemap.xml`);
    expect(xml.match(/<loc>/g)).toHaveLength(1);
    expect(xml).toContain(`<loc>${site.url}</loc>`);
  }
  expect(xml).not.toContain("localhost");
  expect(xml).not.toContain("<lastmod>");
});

test("social sharing image is an actual 1200 by 630 PNG", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const imageUrl = await page
    .locator('head meta[property="og:image"]')
    .getAttribute("content");
  expect(imageUrl).toBeTruthy();
  expect(new URL(imageUrl!).origin).toBe(new URL(site.url).origin);
  const image = await request.get(new URL(imageUrl!).pathname);
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/png");
  const png = await image.body();
  expect(png.subarray(1, 4).toString()).toBe("PNG");
  expect(png.readUInt32BE(16)).toBe(1200);
  expect(png.readUInt32BE(20)).toBe(630);
  await expect(
    page.locator('head meta[property="og:image:alt"]'),
  ).toHaveAttribute("content", site.socialImageAlt);
  await expect(page.locator('head meta[name="twitter:image"]')).toHaveAttribute(
    "content",
    `${site.url}opengraph-image`,
  );
});
