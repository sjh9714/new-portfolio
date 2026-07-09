import { expect, test } from "@playwright/test";

import { gotoRoute } from "./support";

const visualRoutes = [
  { name: "home", path: "/" },
  { name: "case-list", path: "/case-studies" },
  {
    name: "representative-detail",
    path: "/case-studies/realtime-delivery-consistency",
  },
] as const;

for (const width of [390, 1280] as const) {
  test.describe(`visual regression at ${width}px`, () => {
    test.use({ viewport: { width, height: width === 390 ? 844 : 900 } });

    for (const route of visualRoutes) {
      test(`${route.name} baseline`, async ({ page }) => {
        await gotoRoute(page, route.path);
        await expect(page).toHaveScreenshot(`${route.name}-${width}.png`, {
          fullPage: true,
        });
      });
    }
  });
}
