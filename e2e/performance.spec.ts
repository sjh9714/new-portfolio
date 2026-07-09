import { expect, test } from "@playwright/test";

test("390px home first load stays within request and encoded-transfer budgets", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: "light",
    locale: "ko-KR",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const requestUrls: string[] = [];

  page.on("request", (request) => {
    if (request.url().startsWith(baseURL!)) {
      requestUrls.push(request.url());
    }
  });

  const response = await page.goto("/", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(200);

  const encodedBodyBytes = await page.evaluate(() => {
    const navigation = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    const resources = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[];

    return [...navigation, ...resources].reduce(
      (total, entry) => total + entry.encodedBodySize,
      0,
    );
  });

  expect(requestUrls.length, requestUrls.join("\n")).toBeLessThanOrEqual(15);
  expect(encodedBodyBytes, `${encodedBodyBytes} encoded bytes`).toBeGreaterThan(
    0,
  );
  expect(
    encodedBodyBytes,
    `${encodedBodyBytes} encoded bytes`,
  ).toBeLessThanOrEqual(300 * 1024);

  await context.close();
});
