import { defineConfig } from "@playwright/test";

const channel = process.env.PLAYWRIGHT_CHANNEL;
if (channel && channel !== "chrome") throw new Error("PLAYWRIGHT_CHANNEL hanya menerima chrome; kosongkan untuk Chromium bawaan Playwright.");
const baseURL = "http://127.0.0.1:3100";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    browserName: "chromium",
    channel: channel || undefined,
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- --port 3100", url: baseURL, reuseExistingServer: false, timeout: 120000,
    env: {
      APP_ENV: "development", DATA_PROVIDER: "mock", AI_PROVIDER: "mock",
      PAYMENT_PROVIDER: "mock", EMAIL_PROVIDER: "mock", ENABLE_TESTER_GRANTS: "false",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  },
});
