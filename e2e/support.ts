import { expect, type Page } from "@playwright/test";

export const canonicalOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://new-portfolio-smoky-one-41.vercel.app";

export const caseStudyRoutes = [
  "/case-studies/concert-seat-overselling-consistency",
  "/case-studies/concert-outbox-dlt-recovery",
  "/case-studies/realtime-delivery-consistency",
  "/case-studies/billing-idempotency-webhook-ledger",
  "/case-studies/borrowme-product-list-n-plus-one",
] as const;

export const primaryRoutes = [
  { name: "home", path: "/" },
  { name: "projects", path: "/projects" },
  { name: "case studies", path: "/case-studies" },
  ...caseStudyRoutes.map((path) => ({ name: path.split("/").at(-1)!, path })),
  { name: "resume", path: "/resume" },
  { name: "blog", path: "/blog" },
  { name: "contact", path: "/about" },
] as const;

export async function gotoRoute(page: Page, path: string, status = 200) {
  const response = await page.goto(path, { waitUntil: "load" });

  expect(response, `No document response for ${path}`).not.toBeNull();
  expect(response?.status(), `Unexpected status for ${path}`).toBe(status);
  await page.evaluate(() => document.fonts.ready);

  return response;
}

export function absoluteCanonical(path: string) {
  return new URL(path, `${canonicalOrigin}/`).toString();
}
