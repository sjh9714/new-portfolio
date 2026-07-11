import { describe, expect, it } from "vitest";

import { projects } from "@/content/projects";

import robots from "./robots";
import sitemap from "./sitemap";

describe("metadata routes", () => {
  it("publishes only current public pages without fake lastModified values", () => {
    const routes = sitemap();
    const urls = routes.map((item) => item.url);
    for (const project of projects) {
      expect(
        urls.some((url) => url.endsWith(`/projects/${project.slug}`)),
      ).toBe(true);
    }
    expect(urls.some((url) => url.endsWith("/cases"))).toBe(false);
    expect(urls.some((url) => url.endsWith("/flows"))).toBe(false);
    expect(routes.every((item) => item.lastModified === undefined)).toBe(true);
  });

  it("points robots at the canonical host", () => {
    const value = robots();
    expect(value.host).toBe("https://new-portfolio-smoky-one-41.vercel.app");
    expect(value.sitemap).toBe(
      "https://new-portfolio-smoky-one-41.vercel.app/sitemap.xml",
    );
  });
});
