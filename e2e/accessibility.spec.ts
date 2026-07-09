import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { gotoRoute, primaryRoutes } from "./support";

test.describe("accessibility", () => {
  test("primary routes have no serious or critical axe violations", async ({
    page,
  }) => {
    for (const route of primaryRoutes) {
      await test.step(route.name, async () => {
        await gotoRoute(page, route.path);

        const results = await new AxeBuilder({ page }).analyze();
        const blocking = results.violations.filter(
          (violation) =>
            violation.impact === "serious" || violation.impact === "critical",
        );

        expect(
          blocking,
          blocking
            .map(
              (violation) =>
                `${violation.id}: ${violation.help}\n${violation.nodes
                  .map(
                    (node) =>
                      `  ${node.target.join(" ")}: ${node.failureSummary}`,
                  )
                  .join("\n")}`,
            )
            .join("\n\n"),
        ).toEqual([]);
      });
    }
  });

  test("skip link is the first keyboard stop and moves focus to main", async ({
    page,
  }) => {
    await gotoRoute(page, "/");

    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "본문 바로가기" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page.locator("main#main-content")).toBeFocused();
  });

  test("desktop navigation exposes the current route", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });

    for (const [path, name] of [
      ["/case-studies/concert-outbox-dlt-recovery", "사례"],
      ["/projects", "프로젝트"],
      ["/resume", "이력서"],
      ["/blog", "글"],
      ["/about", "연락처"],
    ] as const) {
      await gotoRoute(page, path);
      const current = page
        .getByRole("navigation", { name: "주요 메뉴", exact: true })
        .locator('a[aria-current="page"]');

      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(name);
    }
  });

  test("mobile drawer works from the keyboard and keeps 44px targets", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, "/projects");

    const trigger = page.getByRole("button", { name: "메뉴 열기" });
    await trigger.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "모바일 메뉴" });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('a[aria-current="page"]')).toHaveText(
      "프로젝트",
    );

    const targetSizes = await dialog.getByRole("link").evaluateAll((links) =>
      links.map((link) => {
        const { width, height } = link.getBoundingClientRect();
        return { width, height };
      }),
    );
    expect(
      targetSizes.every(({ width, height }) => width >= 44 && height >= 44),
    ).toBe(true);

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("diagram modal and folded review content work from the keyboard", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoRoute(page, "/case-studies/realtime-delivery-consistency");

    const openDiagram = page.getByRole("button", {
      name: "전체 구조도 보기",
    });
    await openDiagram.focus();
    await page.keyboard.press("Enter");

    const dialog = page.getByRole("dialog", { name: "전체 구조도" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(openDiagram).toBeFocused();

    const summary = page
      .locator("summary")
      .filter({ hasText: "한계와 다음 확인" });
    const details = summary.locator("xpath=..");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    await page.keyboard.press("Enter");
    await expect(details).not.toHaveAttribute("open", "");
  });
});
