import { expect, test } from "@playwright/test";

import {
  absoluteCanonical,
  canonicalOrigin,
  gotoRoute,
  primaryRoutes,
} from "./support";

test("canonical, Open Graph, and Twitter metadata follow the current route", async ({
  page,
}) => {
  for (const route of primaryRoutes) {
    await test.step(route.name, async () => {
      await gotoRoute(page, route.path);
      const expectedUrl = absoluteCanonical(route.path);
      const metadata = await page.evaluate(() => ({
        title: document.title,
        canonical: document.querySelector<HTMLLinkElement>(
          'link[rel="canonical"]',
        )?.href,
        ogTitle: document.querySelector<HTMLMetaElement>(
          'meta[property="og:title"]',
        )?.content,
        ogUrl: document.querySelector<HTMLMetaElement>(
          'meta[property="og:url"]',
        )?.content,
        ogImage: document.querySelector<HTMLMetaElement>(
          'meta[property="og:image"]',
        )?.content,
        twitterTitle: document.querySelector<HTMLMetaElement>(
          'meta[name="twitter:title"]',
        )?.content,
      }));

      expect(metadata.title).not.toBe("");
      expect(metadata.canonical).toBe(expectedUrl);
      expect(new URL(metadata.ogUrl!).toString()).toBe(expectedUrl);
      expect(metadata.ogTitle).toBe(metadata.title);
      expect(metadata.twitterTitle).toBe(metadata.title);
      expect(metadata.ogImage).toMatch(
        new RegExp(
          `^${canonicalOrigin.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`,
        ),
      );
    });
  }
});
