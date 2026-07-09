import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const outputPath = path.join(
  repoRoot,
  "public",
  "resume-sung-jinhyuk-backend.pdf",
);
const temporaryOutputPath = `${outputPath}.tmp`;
const externalBaseUrl = process.env.RESUME_BASE_URL?.replace(/\/$/, "");
const port = process.env.RESUME_PORT ?? "4173";
const baseUrl = externalBaseUrl ?? `http://127.0.0.1:${port}`;
const resumeUrl = new URL("/resume", `${baseUrl}/`).toString();

let server;
let serverLog = "";

try {
  const { chromium } = await loadPlaywright();

  if (!externalBaseUrl) {
    server = startProductionServer();
    await waitForPage(resumeUrl);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await rm(temporaryOutputPath, { force: true });

  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: { width: 1280, height: 1600 },
      deviceScaleFactor: 1,
    });

    await page.goto(resumeUrl, {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    await page.locator("#resume-document").waitFor({ state: "visible" });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    await page.emulateMedia({ media: "print" });

    await page.pdf({
      path: temporaryOutputPath,
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      tagged: true,
      outline: true,
    });
  } finally {
    await browser.close();
  }

  const generated = await stat(temporaryOutputPath);

  if (generated.size < 10_000) {
    throw new Error(
      `Generated PDF is unexpectedly small (${generated.size} bytes).`,
    );
  }

  const pdfSource = (await readFile(temporaryOutputPath)).toString("latin1");
  const pageCount = pdfSource.match(/\/Type\s*\/Page\b/g)?.length ?? 0;

  if (pageCount !== 1) {
    throw new Error(
      `Resume PDF must fit on one A4 page; generated ${pageCount || "an unknown number of"} pages.`,
    );
  }

  await rename(temporaryOutputPath, outputPath);
  process.stdout.write(`Resume PDF generated: ${outputPath}\n`);
} finally {
  await rm(temporaryOutputPath, { force: true });
  stopProductionServer();
}

async function loadPlaywright() {
  try {
    return await import("@playwright/test");
  } catch (error) {
    throw new Error(
      "@playwright/test is required. Install it and run `npx playwright install chromium` before generating the resume PDF.",
      { cause: error },
    );
  }
}

function startProductionServer() {
  const nextBin = path.join(
    repoRoot,
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );

  if (!existsSync(path.join(repoRoot, ".next", "BUILD_ID"))) {
    throw new Error(
      "A production build is required. Run `npm run build` before `npm run resume:pdf`.",
    );
  }

  const child = spawn(
    process.execPath,
    [nextBin, "start", "--hostname", "127.0.0.1", "--port", port],
    {
      cwd: repoRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  const capture = (chunk) => {
    serverLog = `${serverLog}${chunk.toString()}`.slice(-20_000);
  };

  child.stdout.on("data", capture);
  child.stderr.on("data", capture);

  return child;
}

async function waitForPage(url) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    if (server?.exitCode !== null) {
      throw new Error(
        `Next.js exited before the resume page was ready.\n${serverLog}`,
      );
    }

    try {
      const response = await fetch(url, { redirect: "manual" });

      if (response.ok) {
        return;
      }
    } catch {
      // The server may still be starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${url}.\n${serverLog}`);
}

function stopProductionServer() {
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
  }
}
