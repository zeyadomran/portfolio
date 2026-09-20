import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

// Deleted files still trigger validation, but cannot be formatted.
const files = process.argv.slice(2).filter((file) => existsSync(file));
if (files.length) {
  const result = spawnSync(
    process.execPath,
    [
      ".yarn/releases/yarn-1.22.22.cjs",
      "prettier",
      "--ignore-unknown",
      "--write",
      ...files,
    ],
    { stdio: "inherit" },
  );
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}
