import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "../src/entry-server";

const path = resolve("dist/index.html");
const template = await readFile(path, "utf8");
if (!template.includes("<!--app-html-->"))
  throw new Error("The Vite HTML template is missing its prerender marker.");
const html = template
  .replace('id="root"', 'id="root" data-prerendered')
  .replace("<!--app-html-->", render());
await writeFile(path, html);
console.log(
  "Prerendered portfolio content and structured data into dist/index.html.",
);
