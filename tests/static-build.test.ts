import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import { site } from "../src/lib/seo";
import { isPreviewDeployment } from "../scripts/site-metadata";

const html = await readFile(resolve("dist/index.html"), "utf8");

test("the static build contains the complete story before JavaScript runs", () => {
  assert.match(html, /id="root" data-prerendered/);
  assert.equal((html.match(/<article\b/g) || []).length, 3);
  for (const id of [
    "home",
    "work",
    "assistant",
    "systems",
    "optimization",
    "about",
    "links",
  ]) {
    assert.ok(html.includes(`id="${id}"`), `Missing prerendered section ${id}`);
  }
  assert.match(html, /href="mailto:ziomran@gmail.com"/);
  assert.match(html, /Skip to content/);
  assert.doesNotMatch(html, /<!--app-html-->|\/_next\//);

  const structured = html.match(
    /<script[^>]*id="portfolio-structured-data"[^>]*>([\s\S]*?)<\/script>/,
  );
  assert.ok(structured, "Structured data is absent from the static document");
  const graph = JSON.parse(structured[1])["@graph"];
  const profile = graph.find(
    (entry: { "@type": string }) => entry["@type"] === "ProfilePage",
  );
  for (const section of profile.hasPart) {
    assert.ok(html.includes(`id="${new URL(section.url).hash.slice(1)}"`));
  }
});

test("all emitted scripts, styles and local fonts exist", async () => {
  const scripts = [
    ...html.matchAll(/<script[^>]+src="(\/assets\/[^"]+)"/g),
  ].map((match) => match[1]);
  const styles = [
    ...html.matchAll(/<link[^>]+href="(\/assets\/[^"]+\.css)"/g),
  ].map((match) => match[1]);
  assert.ok(scripts.length, "No production JavaScript bundle");
  assert.ok(styles.length, "No production stylesheet");
  for (const path of [...scripts, ...styles])
    assert.ok((await stat(resolve("dist", path.slice(1)))).size > 0);
  const css = (
    await Promise.all(
      styles.map((path) => readFile(resolve("dist", path.slice(1)), "utf8")),
    )
  ).join("\n");
  assert.doesNotMatch(css, /@apply\s|@source\s/);
  const fonts = [
    ...css.matchAll(/url\(["']?(\/assets\/[^\s)"']+\.otf)["']?\)/g),
  ];
  assert.equal(new Set(fonts.map((match) => match[1])).size, 3);
  for (const [, path] of fonts)
    assert.ok((await stat(resolve("dist", path.slice(1)))).size > 0);
});

test("crawler files and social assets match the build environment", async () => {
  const preview = isPreviewDeployment();
  assert.ok(
    html.includes(
      `name="robots" content="${preview ? "noindex" : "index"}, follow"`,
    ),
  );
  const robots = await readFile(resolve("dist/robots.txt"), "utf8");
  const sitemap = await readFile(resolve("dist/sitemap.xml"), "utf8");
  assert.match(robots, /Allow: \//);
  assert.equal((sitemap.match(/<loc>/g) || []).length, preview ? 0 : 1);
  if (preview) assert.doesNotMatch(robots, /Sitemap:/);
  else assert.ok(sitemap.includes(`<loc>${site.url}</loc>`));
  const png = await readFile(resolve("dist/opengraph-image.png"));
  assert.equal(png.subarray(1, 4).toString(), "PNG");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.match(await readFile(resolve("dist/icon.svg"), "utf8"), /<svg/);
});
