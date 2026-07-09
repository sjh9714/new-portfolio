import { expect, test } from "@playwright/test";

import { gotoRoute, primaryRoutes } from "./support";

for (const viewport of [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
  { width: 768, height: 900 },
  { width: 1280, height: 900 },
]) {
  test(`primary routes do not overflow at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);

    for (const route of primaryRoutes) {
      await test.step(route.name, async () => {
        await gotoRoute(page, route.path);
        const dimensions = await page.evaluate(() => ({
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
        }));

        expect(
          dimensions,
          `${route.path} overflows at ${viewport.width}px`,
        ).toEqual({
          clientWidth: viewport.width,
          scrollWidth: viewport.width,
          viewportWidth: viewport.width,
        });
      });
    }
  });
}
