import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const port = 3099;
const baseUrl = process.env.RESUME_BASE_URL ?? `http://127.0.0.1:${port}`;
let server;

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/resume`);
      if (response.ok) return;
    } catch {}
    await delay(500);
  }
  throw new Error(`Resume server did not start at ${baseUrl}`);
}

if (!process.env.RESUME_BASE_URL) {
  server = spawn("npm", ["run", "start", "--", "-p", String(port)], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`${baseUrl}/resume`, { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: "public/resume-sung-jinhyuk-backend.pdf",
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", right: "11mm", bottom: "10mm", left: "11mm" },
  });
  await browser.close();
} finally {
  if (server) server.kill("SIGTERM");
}
