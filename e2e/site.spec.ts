import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/projects",
  "/projects/borrow-me",
  "/projects/concert-booking",
  "/projects/realtime-chat",
  "/projects/memory-of-year",
  "/cases",
  "/cases/concert-seat-contention",
  "/cases/concert-event-recovery",
  "/cases/realtime-message-lifecycle",
  "/cases/borrowme-return-and-harden",
  "/flows",
  "/flows/concert-seat-contention?variant=designed&step=1",
  "/flows/concert-event-recovery?variant=designed&step=1",
  "/flows/realtime-message-lifecycle?variant=designed&step=1",
  "/resume",
];

for (const route of routes) {
  test(`${route} renders one h1 without serious accessibility violations`, async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    await page.goto(route);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations.filter((item) =>
        ["serious", "critical"].includes(item.impact ?? ""),
      ),
    ).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test("home exposes four selected projects but no competing featured cases", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#selected-work article")).toHaveCount(4);
  await expect(page.getByText("Featured Cases", { exact: true })).toHaveCount(
    0,
  );
  await expect(page.locator("body")).not.toContainText("Running_App");
  await expect(page.locator("body")).not.toContainText("1,010→23ms");
  await expect(page.locator("body")).not.toContainText("201→3");
  const structuredData = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ??
      "{}",
  ) as { "@graph"?: { "@type"?: string }[] };
  expect(structuredData["@graph"]?.map((item) => item["@type"])).toEqual([
    "Person",
    "ItemList",
  ]);
});

test("skip link and current navigation state work", async ({ page }) => {
  await page.goto("/projects");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toHaveText(
    "Work",
  );
  await page.goto("/cases/concert-seat-contention");
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toHaveText(
    "Work",
  );
});

test("multiple project Flow links have distinct accessible names", async ({
  page,
}) => {
  await page.goto("/projects/concert-booking");
  await expect(
    page.getByRole("link", { name: /두 사람이 같은 좌석을 눌렀을 때/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /이벤트 발행과 소비가 실패했을 때/ }),
  ).toBeVisible();
});

test("mobile menu opens, follows route, and closes with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "메뉴 열기" });
  await menu.click();
  await expect(
    page.getByRole("navigation", { name: "모바일 메뉴" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "모바일 메뉴" }),
  ).toHaveCount(0);
});

test("flow controls update the visible step and URL", async ({ page }) => {
  await page.goto("/flows/realtime-message-lifecycle?variant=designed&step=1");
  await expect(
    page
      .getByRole("heading", { name: "클라이언트가 임시 메시지를 표시합니다" })
      .first(),
  ).toBeVisible();
  await page.getByRole("button", { name: "다음 단계" }).click();
  await expect(page).toHaveURL(/step=2/);
  await expect(
    page
      .getByRole("heading", {
        name: "같은 room partition에서 DB에 먼저 저장합니다",
      })
      .first(),
  ).toBeVisible();
  await page.getByText("전체 흐름 텍스트로 읽기").click();
  await expect(page.getByText("재연결 뒤 공백만 보충합니다")).toBeVisible();
});

test("flow keyboard controls and reduced-motion behavior are deterministic", async ({
  page,
}) => {
  await page.goto("/flows/realtime-message-lifecycle?variant=designed&step=2");
  const player = page.getByRole("region", {
    name: /보낸 메시지가 저장되고 다시 이어질 때까지 흐름 재생기/,
  });
  await player.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/step=3/);
  await page.keyboard.press("End");
  await expect(page).toHaveURL(/step=5/);
  await page.keyboard.press("Home");
  await expect(page).toHaveURL(/step=1/);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", {
      name: "동작 줄이기 설정으로 자동 재생 사용 안 함",
    }),
  ).toBeDisabled();
  await player.focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(2_700);
  await expect(page).toHaveURL(/step=1/);
});

test("mobile diagram and flow dialogs close with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/cases/concert-seat-contention");
  await page.getByRole("button", { name: "전체 구조도 보기" }).click();
  const diagramDialog = page.getByRole("dialog", {
    name: /전체 구조도/,
  });
  await expect(diagramDialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(diagramDialog).not.toBeVisible();

  await page.goto("/flows/concert-seat-contention?variant=designed&step=1");
  await page.getByRole("button", { name: "크게 보기" }).click();
  const flowDialog = page.getByRole("dialog", { name: /전체 흐름/ });
  await expect(flowDialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(flowDialog).not.toBeVisible();
});

test("legacy aliases are permanent redirects and prototype keys stay 404", async ({
  request,
}) => {
  for (const [source, destination] of [
    ["/case-studies", "/cases"],
    [
      "/case-studies/concert-seat-overselling-consistency",
      "/cases/concert-seat-contention",
    ],
    [
      "/case-studies/concert-outbox-dlt-recovery",
      "/cases/concert-event-recovery",
    ],
    [
      "/case-studies/realtime-delivery-consistency",
      "/cases/realtime-message-lifecycle",
    ],
    [
      "/case-studies/borrowme-product-list-n-plus-one",
      "/cases/borrowme-return-and-harden",
    ],
  ]) {
    const legacy = await request.get(source, { maxRedirects: 0 });
    expect(legacy.status()).toBe(308);
    expect(legacy.headers().location).toBe(destination);
  }

  for (const base of ["projects", "cases", "flows"]) {
    for (const key of [
      "__proto__",
      "constructor",
      "prototype",
      "toString",
      "hasOwnProperty",
    ]) {
      const response = await request.get(`/${base}/${key}`);
      expect(response.status()).toBe(404);
    }
  }

  for (const removedRoute of [
    "/about",
    "/blog",
    "/blog/old-post",
    "/case-studies/billing-idempotency-webhook-ledger",
    "/case-studies/chat-room-n-plus-one-rps",
  ]) {
    const response = await request.get(removedRoute, { maxRedirects: 0 });
    expect(response.status()).toBe(404);
  }
});

for (const width of [320, 390, 768, 1280]) {
  test(`no document overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/projects/concert-booking",
      "/flows/realtime-message-lifecycle?variant=designed&step=3",
      "/resume",
    ]) {
      await page.goto(route);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    }
  });
}

for (const metadataRoute of [
  { path: "/projects", title: /Work/ },
  { path: "/projects/borrow-me", title: /BorrowMe/ },
  { path: "/cases", title: /Engineering Cases/ },
  { path: "/cases/concert-seat-contention", title: /같은 좌석/ },
  { path: "/flows", title: /Flows/ },
  {
    path: "/flows/realtime-message-lifecycle",
    title: /보낸 메시지가 저장되고/,
  },
  { path: "/resume", title: /Resume/ },
]) {
  test(`${metadataRoute.path} has route-specific canonical, OG, and Twitter metadata`, async ({
    page,
  }) => {
    await page.goto(metadataRoute.path);
    const escapedPath = metadataRoute.path.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(`${escapedPath}$`),
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      new RegExp(`${escapedPath}$`),
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      metadataRoute.title,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      metadataRoute.title,
    );
  });
}

test("root, project, case, and flow Open Graph images render", async ({
  request,
}) => {
  for (const path of [
    "/opengraph-image",
    "/projects/borrow-me/opengraph-image",
    "/cases/concert-seat-contention/opengraph-image",
    "/flows/realtime-message-lifecycle/opengraph-image",
  ]) {
    const response = await request.get(path);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");
    expect((await response.body()).byteLength).toBeGreaterThan(10_000);
  }
});

test("security headers are present and framework disclosure is disabled", async ({
  request,
}) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("unknown route presents the custom 404", async ({ page }) => {
  const response = await page.goto("/this-route-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /이 이야기는/ }),
  ).toBeVisible();
});
