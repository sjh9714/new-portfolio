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
        resources.reduce((sum, resource) => sum + resource.transferSize, 0),
      largestTransfers: resources
        .map((resource) => ({
          path: new URL(resource.name).pathname,
          bytes: resource.transferSize,
        }))
        .sort((left, right) => right.bytes - left.bytes)
        .slice(0, 5),
    };
  });
  const diagnostic = JSON.stringify(result, null, 2);

  expect(result.requestCountIncludingDocument, diagnostic).toBeLessThanOrEqual(
    15,
  );
  expect(result.transferBytes, diagnostic).toBeLessThanOrEqual(300 * 1024);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBe(0);
});
