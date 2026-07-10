import { expect, test } from "@playwright/test";

test("390px home stays inside the first-load request and transfer budget", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await page.goto("/", { waitUntil: "networkidle" });
  const result = await page.evaluate(() => {
    const resources = performance.getEntriesByType(
      "resource",
    ) as PerformanceResourceTiming[];
    const [navigation] = performance.getEntriesByType(
      "navigation",
    ) as PerformanceNavigationTiming[];
    return {
      requestCountIncludingDocument: resources.length + 1,
      transferBytes:
        (navigation?.transferSize ?? 0) +
        resources.reduce((sum, item) => sum + item.transferSize, 0),
    };
  });

  expect(result.requestCountIncludingDocument).toBeLessThanOrEqual(15);
  expect(result.transferBytes).toBeLessThanOrEqual(300 * 1024);
});
