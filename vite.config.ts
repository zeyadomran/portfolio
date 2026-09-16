import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import {
  crawlerFiles,
  isPreviewDeployment,
  metadataTags,
} from "./scripts/site-metadata.ts";

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
        if (path === "/opengraph-image") {
          response.writeHead(301, { Location: "/opengraph-image.png" });
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

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    portfolioHtml(loadEnv(mode, process.cwd(), "")),
  ],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: { host: "127.0.0.1", port: 3000, strictPort: true },
  preview: { host: "127.0.0.1", port: 4173, strictPort: true },
}));
