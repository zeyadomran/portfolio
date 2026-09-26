import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  crawlerFiles,
  isPreviewDeployment,
  metadataTags,
} from "./scripts/site-metadata.ts";

// Mirrors the permanent redirects in vercel.json for local development.
const redirects: Record<string, string> = {
  "/opengraph-image": "/opengraph-image.png",
  "/Zeyad_Omran_Resume_SWE_AI.pdf": "/Zeyad_Omran_Resume.pdf",
};

function portfolioHtml(environment: Record<string, string>): Plugin {
  const files = crawlerFiles(isPreviewDeployment(environment.VERCEL_ENV));
  return {
    name: "portfolio-html",
    transformIndexHtml: {
      order: "pre",
      async handler(html, context) {
        if (context.server) {
          const { render } = await context.server.ssrLoadModule(
            "/src/entry-server.tsx",
          );
          html = html
            .replace('id="root"', 'id="root" data-prerendered')
            .replace("<!--app-html-->", render());
        }
        return { html, tags: metadataTags(environment) };
      },
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = request.url?.split("?")[0];
        const redirect = redirects[path ?? ""];
        if (redirect) {
          response.writeHead(301, { Location: redirect });
          response.end();
          return;
        }
        if (path !== "/robots.txt" && path !== "/sitemap.xml") return next();
        response.setHeader(
          "Content-Type",
          path.endsWith(".xml")
            ? "application/xml; charset=utf-8"
            : "text/plain; charset=utf-8",
        );
        response.end(files[path.slice(1) as keyof typeof files]);
      });
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(files)) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}

// Preload the faces used above the fold so the headline and introduction
// render in their final typography without waiting for stylesheet discovery.
function preloadFonts(patterns: RegExp[]): Plugin {
  return {
    name: "portfolio-font-preload",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, context) {
        if (!context.bundle) return;
        return Object.keys(context.bundle)
          .filter((fileName) =>
            patterns.some((pattern) => pattern.test(fileName)),
          )
          .map((fileName) => ({
            tag: "link",
            attrs: {
              rel: "preload",
              href: `/${fileName}`,
              as: "font",
              type: "font/otf",
              crossorigin: true,
            },
            injectTo: "head",
          }));
      },
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    portfolioHtml(loadEnv(mode, process.cwd(), "")),
    preloadFonts([
      /PPNeueMontreal-Regular-[\w-]+\.otf$/,
      /PPNeueMontrealText-Book-[\w-]+\.otf$/,
    ]),
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { host: "127.0.0.1", port: 3000, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
}));
