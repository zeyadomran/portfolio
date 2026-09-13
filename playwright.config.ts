import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 3,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    // Use installed Chrome by default; PLAYWRIGHT_CHANNEL=chromium uses a downloaded browser.
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "node .yarn/releases/yarn-1.22.22.cjs start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
