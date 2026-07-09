import { expect, test } from "@playwright/test";

import { caseStudyRoutes, gotoRoute, primaryRoutes } from "./support";

test.describe("route and content contracts", () => {
  test("primary routes render one h1 and normal routes log no errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    for (const route of primaryRoutes) {
      await test.step(route.name, async () => {
        consoleErrors.length = 0;
        pageErrors.length = 0;
        await gotoRoute(page, route.path);

        await expect(page.locator("h1"), `${route.path} h1 count`).toHaveCount(
          1,
        );
        await expect(page.locator("h1")).toBeVisible();
        expect(consoleErrors, `${route.path} console errors`).toEqual([]);
        expect(pageErrors, `${route.path} page errors`).toEqual([]);
      });
    }

    await gotoRoute(page, "/route-that-does-not-exist", 404);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: /페이지를 찾을 수 없습니다/ }),
    ).toBeVisible();
  });

  test("prototype-key case study slugs are ordinary 404s", async ({
    request,
  }) => {
    for (const slug of [
      "toString",
      "constructor",
      "__proto__",
      "valueOf",
      "hasOwnProperty",
    ]) {
      await test.step(slug, async () => {
        const response = await request.get(`/case-studies/${slug}`);

        expect(response.status()).toBe(404);
        expect(await response.text()).toContain("페이지를 찾을 수 없습니다");
      });
    }
  });

  test("the retired realtime slug is a permanent redirect", async ({
    page,
    request,
  }) => {
    const response = await request.get(
      "/case-studies/chat-room-n-plus-one-rps",
      { maxRedirects: 0 },
    );

    expect(response.status()).toBe(308);
    const locations = response
      .headers()
      .location.split(",")
      .map((location) => location.trim());
    expect(locations.length).toBeGreaterThanOrEqual(1);
    expect(new Set(locations)).toEqual(
      new Set(["/case-studies/realtime-delivery-consistency"]),
    );

    await page.goto("/case-studies/chat-room-n-plus-one-rps");
    await expect(page).toHaveURL(
      /\/case-studies\/realtime-delivery-consistency$/,
    );
    await expect(page.locator("h1")).toContainText(/수신|전달|재연결/);
  });

  test("case index uses the curated Outbox and Billing card evidence", async ({
    page,
  }) => {
    await gotoRoute(page, "/case-studies");

    const outbox = page.locator("article").filter({
      has: page.locator('a[href="/case-studies/concert-outbox-dlt-recovery"]'),
    });
    await expect(outbox).toContainText("DLT replay 복구");
    await expect(outbox).toContainText(
      "consumer 실패 이벤트를 DLT로 격리하고 replay 후 좌석·Redis 재고를 1회만 복구",
    );

    const billing = page.locator("article").filter({
      has: page.locator(
        'a[href="/case-studies/billing-idempotency-webhook-ledger"]',
      ),
    });
    await expect(billing).toContainText("사용량 중복 처리");
    await expect(billing).toContainText(
      "동일 key·동일 payload는 duplicate로 반환하고 사용량·quota row 1건 유지, 다른 payload는 conflict",
    );
  });

  test("every featured project exposes its complete hiring summary", async ({
    page,
  }) => {
    await gotoRoute(page, "/projects");

    const projects = page.locator("article.project-band");
    await expect(projects).toHaveCount(4);

    for (let index = 0; index < 4; index += 1) {
      const project = projects.nth(index);

      await expect(project.locator("h3")).not.toBeEmpty();
      await expect(
        project.locator("dt"),
        "problem/design/result labels",
      ).toHaveText(["문제", "설계 판단", "결과"]);
      await expect(project.locator("dd")).toHaveCount(3);
      await expect(project.locator('a[aria-label*="근거 파일"]')).toHaveCount(
        1,
      );
      await expect(
        project.locator('ul[aria-label$="기술 스택"] li'),
      ).toHaveCount(5);
      await expect(
        project.locator('a[href^="/case-studies/"]'),
      ).not.toHaveCount(0);
      await expect(
        project.locator('a[aria-label*="GitHub 저장소"]'),
      ).toHaveCount(1);
    }
  });

  test("unsupported historical metrics and pending proof never reach public HTML", async ({
    page,
  }) => {
    const forbidden = [
      /1[,.]?010\s*(?:ms)?/i,
      /201\s*(?:queries|회)?\s*(?:→|->|에서)\s*3/i,
      /23\s*ms/i,
      /추가 측정 예정/i,
    ];

    for (const path of [
      "/",
      "/projects",
      "/case-studies",
      ...caseStudyRoutes,
    ]) {
      await test.step(path, async () => {
        await gotoRoute(page, path);
        const html = await page.content();

        for (const pattern of forbidden) {
          expect(html, `${path} contains ${String(pattern)}`).not.toMatch(
            pattern,
          );
        }

        await expect(
          page.getByText("추가 측정 예정", { exact: true }),
          `${path} exposes pending evidence`,
        ).toHaveCount(0);
      });
    }
  });
});
