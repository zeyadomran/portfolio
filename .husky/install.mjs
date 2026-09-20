import { existsSync } from "node:fs";

const skipInstall =
  process.env.HUSKY === "0" ||
  (process.env.CI && process.env.CI !== "false") ||
  process.env.VERCEL === "1" ||
  process.env.NODE_ENV === "production" ||
  process.env.npm_config_production === "true" ||
  process.env.npm_config_omit?.split(/\s+/).includes("dev");

// Production installs may not contain Husky, so check before importing it.
if (!skipInstall && existsSync(".git")) {
  const { default: install } = await import("husky");
  const error = install();
  if (error) throw new Error(error);
}
