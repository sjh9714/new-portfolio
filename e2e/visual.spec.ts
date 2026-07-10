import { expect, test } from "@playwright/test";

for (const viewport of [
  { label: "mobile", width: 390, height: 844 },
  { label: "desktop", width: 1280, height: 900 },
]) {
  test(`home visual ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto("/");
    await expect(page).toHaveScreenshot(`home-${viewport.label}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });

  test(`flow visual ${viewport.label}`, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await page.goto(
      "/flows/realtime-message-lifecycle?variant=designed&step=3",
    );
    await expect(page).toHaveScreenshot(`flow-${viewport.label}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });
}

for (const viewport of [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
]) {
  test(`project detail visual ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/projects/concert-booking");
    await expect(page.locator("h1")).toHaveText("Concert Booking");
    await expect(page).toHaveScreenshot(`project-${viewport.name}.png`, {
      fullPage: true,
      animations: "disabled",
    });
  });
}
