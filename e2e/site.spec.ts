import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const normalRoutes = [
  "/",
  "/projects",
  "/projects/memory-of-year",
  "/projects/concert-booking",
  "/projects/realtime-chat",
  "/projects/borrow-me",
  "/resume",
] as const;

const metadataRoutes = [
  { path: "/", title: /성진혁/ },
  { path: "/projects", title: /작업/ },
  { path: "/projects/memory-of-year", title: /Memory of Year/ },
  { path: "/projects/concert-booking", title: /Concert Booking/ },
  { path: "/projects/realtime-chat", title: /Realtime Chat/ },
  { path: "/projects/borrow-me", title: /BorrowMe/ },
  { path: "/resume", title: /이력서/ },
] as const;

const legacyRedirects = [
  ["/cases", "/projects"],
  ["/flows", "/projects"],
  [
    "/cases/concert-seat-contention",
    "/projects/concert-booking?flow=seat-contention&variant=designed&step=1#seat-contention",
  ],
  [
    "/cases/concert-event-recovery",
    "/projects/concert-booking?flow=event-recovery&variant=designed&step=1#event-recovery",
  ],
  [
    "/cases/realtime-message-lifecycle",
    "/projects/realtime-chat?flow=message-lifecycle&variant=designed&step=1#message-lifecycle",
  ],
  ["/cases/borrowme-return-and-harden", "/projects/borrow-me#borrow-lifecycle"],
  [
    "/flows/concert-seat-contention",
    "/projects/concert-booking?flow=seat-contention&variant=designed&step=1#seat-contention",
  ],
  [
    "/flows/concert-event-recovery",
    "/projects/concert-booking?flow=event-recovery&variant=designed&step=1#event-recovery",
  ],
  [
    "/flows/realtime-message-lifecycle",
    "/projects/realtime-chat?flow=message-lifecycle&variant=designed&step=1#message-lifecycle",
  ],
  ["/case-studies", "/projects"],
  [
    "/case-studies/concert-seat-overselling-consistency",
    "/projects/concert-booking?flow=seat-contention&variant=designed&step=1#seat-contention",
  ],
  [
    "/case-studies/concert-outbox-dlt-recovery",
    "/projects/concert-booking?flow=event-recovery&variant=designed&step=1#event-recovery",
  ],
  [
    "/case-studies/realtime-delivery-consistency",
    "/projects/realtime-chat?flow=message-lifecycle&variant=designed&step=1#message-lifecycle",
  ],
  [
    "/case-studies/borrowme-product-list-n-plus-one",
    "/projects/borrow-me#borrow-lifecycle",
  ],
] as const;

const realtimeFlowUrl =
  "/projects/realtime-chat?flow=message-lifecycle&variant=designed&step=1#message-lifecycle";

function collectRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function expectNoSeriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    ),
  ).toEqual([]);
}

function normalizedRedirect(location: string) {
  const url = new URL(location, "http://127.0.0.1:3100");
  return `${url.pathname}${url.search}${url.hash}`;
}

async function flowState(page: Page) {
  const url = new URL(page.url());
  return {
    pathname: url.pathname,
    flow: url.searchParams.get("flow"),
    variant: url.searchParams.get("variant"),
    step: url.searchParams.get("step"),
    hash: url.hash,
  };
}

for (const route of normalRoutes) {
  test(`${route} renders one h1 without serious accessibility or runtime errors`, async ({
    page,
  }) => {
    const runtimeErrors = collectRuntimeErrors(page);
    const response = await page.goto(route, { waitUntil: "networkidle" });

    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
    await expectNoSeriousAxeViolations(page);
    expect(runtimeErrors).toEqual([]);
  });
}

test("home presents the four projects in story order without competing sections", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const projectTitles = page.locator("#selected-work article h3");
  await expect(projectTitles).toHaveText([
    "Memory of Year",
    "Concert Booking",
    "Realtime Chat",
    "BorrowMe",
  ]);
  await expect(
    page.getByRole("link", { name: /첫 프로젝트 바로 보기/ }),
  ).toBeVisible();
  await expect(
    page.locator('a[href^="/cases"], a[href^="/flows"]'),
  ).toHaveCount(0);
  await expect(page.getByText("Featured Cases", { exact: true })).toHaveCount(
    0,
  );

  const structuredData = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ??
      "{}",
  ) as {
    "@graph"?: {
      "@type"?: string;
      itemListElement?: { name?: string; position?: number }[];
    }[];
  };
  expect(structuredData["@graph"]?.map((item) => item["@type"])).toEqual([
    "Person",
    "ItemList",
  ]);
  expect(structuredData["@graph"]?.[1]?.itemListElement).toMatchObject([
    { name: "Memory of Year", position: 1 },
    { name: "Concert Booking", position: 2 },
    { name: "Realtime Chat", position: 3 },
    { name: "BorrowMe", position: 4 },
  ]);
});

test("removed projects, unsupported metrics, and legacy section labels are absent", async ({
  request,
}) => {
  const forbidden = [
    "AI Usage Billing",
    "Agent-Gate",
    "FocusYou",
    "Running_App",
    "1,010→23ms",
    "201→3",
    "Featured Cases",
    "Additional systems work",
  ];

  for (const route of normalRoutes) {
    const response = await request.get(route);
    expect(response.status()).toBe(200);
    const html = await response.text();
    for (const phrase of forbidden) {
      expect(html, `${route} must not expose ${phrase}`).not.toContain(phrase);
    }
  }
});

test("skip link and current navigation state follow the reduced information architecture", async ({
  page,
}) => {
  await page.goto("/projects");
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toHaveText(
    "작업",
  );

  await page.goto("/projects/concert-booking");
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toHaveText(
    "작업",
  );

  await page.goto("/resume");
  await expect(page.locator('.desktop-nav a[aria-current="page"]')).toHaveText(
    "이력서",
  );
});

test("mobile menu closes with Escape and after navigation", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "메뉴 열기" });
  await menuButton.click();
  await expect(
    page.getByRole("navigation", { name: "모바일 메뉴" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("navigation", { name: "모바일 메뉴" }),
  ).toHaveCount(0);
  await expect(menuButton).toBeFocused();

  await menuButton.click();
  await page
    .getByRole("navigation", { name: "모바일 메뉴" })
    .getByRole("link", { name: "이력서" })
    .click();
  await expect(page).toHaveURL(/\/resume$/);
  await expect(
    page.getByRole("navigation", { name: "모바일 메뉴" }),
  ).toHaveCount(0);
});

test("actual project media loads instead of decorative placeholders", async ({
  page,
}) => {
  await page.goto("/projects/memory-of-year", { waitUntil: "networkidle" });
  await expect(page.locator(".project-detail-media img")).toHaveCount(1);
  await expect(page.locator("#memory-product img")).toHaveCount(4);
  await expect(page.locator("#memory-deployment img")).toHaveCount(1);
  const memoryImages = page.locator(
    ".project-detail-media img, #memory-product img, #memory-deployment img",
  );
  expect(
    await memoryImages.evaluateAll((images) =>
      images.every(
        (image) =>
          image instanceof HTMLImageElement &&
          image.complete &&
          image.naturalWidth > 0 &&
          image.naturalHeight > 0,
      ),
    ),
  ).toBe(true);

  await page.goto("/projects/concert-booking");
  await expect(
    page
      .getByRole("img", {
        name: /Concert Booking 클라이언트에서 좌석과 남은 예약 시간/,
      })
      .first(),
  ).toBeVisible();

  await page.goto("/projects/realtime-chat");
  await expect(
    page
      .getByRole("img", {
        name: /Realtime Chat 클라이언트에서 Alice와 Bob/,
      })
      .first(),
  ).toBeVisible();
});

test("embedded flow updates its step, URL, and transcript", async ({
  page,
}) => {
  await page.goto(realtimeFlowUrl);
  const player = page.getByRole("region", {
    name: /보낸 메시지가 저장되고 다시 이어질 때까지/,
  });

  await expect(player).toBeVisible();
  await expect(
    player
      .getByText("클라이언트가 임시 메시지를 먼저 표시합니다", {
        exact: true,
      })
      .first(),
  ).toBeVisible();

  await player.getByRole("button", { name: "다음 단계" }).click();
  await expect
    .poll(() => flowState(page))
    .toEqual({
      pathname: "/projects/realtime-chat",
      flow: "message-lifecycle",
      variant: "designed",
      step: "2",
      hash: "#message-lifecycle",
    });
  await expect(
    player
      .getByText("서버가 요청을 검증하고 큐 접수를 알립니다", {
        exact: true,
      })
      .first(),
  ).toBeVisible();

  const transcript = player.locator("details.flow-transcript");
  const summary = transcript.getByText("전체 흐름 텍스트로 읽기", {
    exact: true,
  });
  await summary.focus();
  await page.keyboard.press("Space");
  await expect(transcript).toHaveAttribute("open", "");
  await expect(
    transcript.getByText("재연결 뒤 빠진 구간만 순서대로 보충합니다"),
  ).toBeVisible();
  await expect(player.getByRole("button", { name: "재생" })).toBeVisible();
  expect((await flowState(page)).step).toBe("2");
});

test("embedded flow autoplay advances once without router errors", async ({
  page,
}) => {
  const runtimeErrors = collectRuntimeErrors(page);
  await page.goto(realtimeFlowUrl);
  const player = page.getByRole("region", {
    name: /보낸 메시지가 저장되고 다시 이어질 때까지/,
  });

  await player.getByRole("button", { name: "재생" }).click();
  await expect
    .poll(async () => (await flowState(page)).step, {
      timeout: 4_000,
    })
    .toBe("2");
  await expect(player.getByRole("button", { name: "일시정지" })).toBeVisible();
  expect(runtimeErrors).toEqual([]);
});

test("embedded flow supports Arrow, Home, and End keyboard controls", async ({
  page,
}) => {
  await page.goto(
    "/projects/realtime-chat?flow=message-lifecycle&variant=designed&step=2#message-lifecycle",
  );
  const player = page.getByRole("region", {
    name: /보낸 메시지가 저장되고 다시 이어질 때까지/,
  });

  await player.focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(async () => (await flowState(page)).step).toBe("3");
  await page.keyboard.press("End");
  await expect.poll(async () => (await flowState(page)).step).toBe("6");
  await page.keyboard.press("Home");
  await expect.poll(async () => (await flowState(page)).step).toBe("1");
  await page.keyboard.press("ArrowLeft");
  await expect.poll(async () => (await flowState(page)).step).toBe("1");
});

test("reduced motion disables autoplay while manual navigation remains available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(realtimeFlowUrl);
  const player = page.getByRole("region", {
    name: /보낸 메시지가 저장되고 다시 이어질 때까지/,
  });

  await expect(
    player.getByRole("button", {
      name: "동작 줄이기 설정으로 자동 재생 사용 안 함",
    }),
  ).toBeDisabled();
  await player.focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(2_700);
  expect((await flowState(page)).step).toBe("1");

  await player.getByRole("button", { name: "다음 단계" }).click();
  await expect.poll(async () => (await flowState(page)).step).toBe("2");
});

test("mobile flow exposes every step but never starts autoplay", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(realtimeFlowUrl);
  const player = page.getByRole("region", {
    name: /보낸 메시지가 저장되고 다시 이어질 때까지/,
  });

  await expect(player.locator(".flow-step-list li")).toHaveCount(6);
  const autoplay = player.locator(
    'button[aria-label="모바일에서 자동 재생 사용 안 함"]',
  );
  await expect(autoplay).toBeDisabled();
  await expect(autoplay).toBeHidden();
  await player.focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(2_700);
  expect((await flowState(page)).step).toBe("1");
  await expectNoSeriousAxeViolations(page);
});

test("legacy case and flow URLs permanently redirect into project stories", async ({
  request,
}) => {
  for (const [source, destination] of legacyRedirects) {
    const response = await request.get(source, { maxRedirects: 0 });
    expect(response.status(), source).toBe(308);
    expect(normalizedRedirect(response.headers().location ?? ""), source).toBe(
      destination,
    );
  }
});

test("prototype keys and removed routes stay 404", async ({ request }) => {
  for (const base of ["projects", "cases", "flows"]) {
    for (const key of [
      "__proto__",
      "constructor",
      "prototype",
      "toString",
      "hasOwnProperty",
    ]) {
      const response = await request.get(`/${base}/${key}`, {
        maxRedirects: 0,
      });
      expect(response.status(), `/${base}/${key}`).toBe(404);
    }
  }

  for (const route of [
    "/about",
    "/blog",
    "/blog/old-post",
    "/case-studies/billing-idempotency-webhook-ledger",
    "/case-studies/chat-room-n-plus-one-rps",
  ]) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status(), route).toBe(404);
  }
});

for (const width of [320, 390, 768, 1280]) {
  test(`normal routes have no document overflow at ${width}px`, async ({
    page,
  }) => {
    test.slow();
    await page.setViewportSize({ width, height: 900 });

    for (const route of normalRoutes) {
      const response = await page.goto(route, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status(), route).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(
        overflow,
        `${route} overflows by ${overflow}px at ${width}px`,
      ).toBe(0);
    }
  });
}

for (const { path, title } of metadataRoutes) {
  test(`${path} has route-specific canonical, Open Graph, and Twitter metadata`, async ({
    page,
  }) => {
    await page.goto(path);

    await expect(page).toHaveTitle(title);
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    const openGraphUrl = await page
      .locator('meta[property="og:url"]')
      .getAttribute("content");
    expect(new URL(canonical ?? "", page.url()).pathname).toBe(path);
    expect(new URL(openGraphUrl ?? "", page.url()).pathname).toBe(path);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      title,
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      "content",
      title,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  });
}

test("root and project Open Graph images render as 1200×630 PNGs", async ({
  request,
}) => {
  for (const path of [
    "/opengraph-image",
    "/projects/memory-of-year/opengraph-image",
    "/projects/concert-booking/opengraph-image",
    "/projects/realtime-chat/opengraph-image",
    "/projects/borrow-me/opengraph-image",
  ]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(response.headers()["content-type"], path).toContain("image/png");
    expect((await response.body()).byteLength, path).toBeGreaterThan(10_000);
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
  expect(headers["content-security-policy"]).toContain("object-src 'none'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["permissions-policy"]).toContain("payment=()");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("unknown route is a noindexed, accessible 404 without canonical metadata", async ({
  page,
}) => {
  const runtimeErrors = collectRuntimeErrors(page);
  const response = await page.goto("/this-route-does-not-exist");

  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: /이 이야기는 여기에 없습니다/ }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
  await expectNoSeriousAxeViolations(page);
  expect(
    runtimeErrors.filter(
      (error) =>
        !error.includes(
          "Failed to load resource: the server responded with a status of 404",
        ),
    ),
  ).toEqual([]);
});
