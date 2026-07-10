import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const port = 3099;
const baseUrl = process.env.RESUME_BASE_URL ?? `http://127.0.0.1:${port}`;
const pdfPath =
  process.env.RESUME_OUTPUT_PATH ?? "public/resume-sung-jinhyuk-backend.pdf";
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
  const sourceFingerprint = await page
    .locator("[data-resume-source]")
    .getAttribute("data-resume-source");
  if (!sourceFingerprint?.match(/^[0-9a-f]{64}$/)) {
    throw new Error("Resume page did not expose a valid source fingerprint");
  }
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: { top: "10mm", right: "11mm", bottom: "10mm", left: "11mm" },
  });
  await browser.close();

  const pdf = await readFile(pdfPath);
  const normalized = pdf
    .toString("latin1")
    .replace(/D:\d{14}\+00'00'/g, "D:20260101000000+00'00'");
  const marker = `\n% RESUME_SOURCE_SHA256 ${sourceFingerprint}\n`;
  await writeFile(
    pdfPath,
    Buffer.concat([
      Buffer.from(normalized, "latin1"),
      Buffer.from(marker, "ascii"),
    ]),
  );
} finally {
  if (server) server.kill("SIGTERM");
}
