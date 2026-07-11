import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const viewports = [
  { label: "mobile", width: 390, height: 844 },
  { label: "desktop", width: 1280, height: 900 },
] as const;

async function prepareStableVisuals(page: Page) {
  await page.emulateMedia({ reducedMotion: "reduce" });
}

async function waitForImages(page: Page) {
  await page.evaluate(async () => {
    const distance = Math.max(window.innerHeight, 500);

    for (
      let offset = 0;
      offset < document.documentElement.scrollHeight;
      offset += distance
    ) {
      window.scrollTo(0, offset);
      await new Promise((resolve) => window.setTimeout(resolve, 50));
    }

    window.scrollTo(0, 0);
  });

  await expect
    .poll(
      () =>
        page
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (image) =>
                image instanceof HTMLImageElement &&
                image.complete &&
                image.naturalWidth > 0,
            ),
          ),
      { timeout: 15_000 },
    )
    .toBe(true);
}

for (const viewport of viewports) {
  test(`home visual ${viewport.label}`, async ({ page }) => {
    test.slow();
    await page.setViewportSize(viewport);
    await prepareStableVisuals(page);
    await page.goto("/");
    await waitForImages(page);
    await expect(page).toHaveScreenshot(`home-${viewport.label}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
    });
  });

  test(`Memory of Year story visual ${viewport.label}`, async ({ page }) => {
    test.slow();
    await page.setViewportSize(viewport);
    await prepareStableVisuals(page);
    await page.goto("/projects/memory-of-year");
    await waitForImages(page);
    await expect(page.locator("h1")).toHaveText("Memory of Year");
    await expect(page).toHaveScreenshot(
      `memory-project-${viewport.label}.png`,
      {
        fullPage: true,
        animations: "disabled",
        caret: "hide",
      },
    );
  });

  test(`embedded Concert flow visual ${viewport.label}`, async ({ page }) => {
    test.slow();
    await page.setViewportSize(viewport);
    await prepareStableVisuals(page);
    await page.goto(
      "/projects/concert-booking?flow=seat-contention&variant=designed&step=3#seat-contention",
    );
    await waitForImages(page);
    await expect(page.locator("h1")).toHaveText("Concert Booking");
    await expect(
      page
        .getByRole("region", {
          name: /같은 좌석을 눌렀을 때, 패자는 어떻게 다시 예매하는가/,
        })
        .locator(".flow-stage-state strong")
        .getByText("충돌 응답 · 좌석표 갱신", { exact: true }),
    ).toBeVisible();
    await expect(page).toHaveScreenshot(`concert-flow-${viewport.label}.png`, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
    });
  });
}
