import { defineConfig, devices } from "@playwright/test";

const port = 3417;

export default defineConfig({
  testDir: "./e2e",
  outputDir: ".next/playwright-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["list"]]
    : [
        ["list"],
        ["html", { open: "never", outputFolder: ".next/playwright-report" }],
      ],
  expect: {
    timeout: 8_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      threshold: 0.2,
      maxDiffPixelRatio: 0.04,
    },
  },
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    colorScheme: "light",
    contextOptions: {
      reducedMotion: "reduce",
    },
    locale: "ko-KR",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{testFilePath}/{platform}/{arg}{ext}",
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
