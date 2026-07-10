import { describe, expect, it } from "vitest";

import { engineeringCases } from "@/content/cases";
import { flows } from "@/content/flows";
import { projects } from "@/content/projects";

import robots from "./robots";
import sitemap from "./sitemap";

describe("metadata routes", () => {
  it("publishes every current route without fake lastModified values", () => {
    const routes = sitemap();
    const urls = routes.map((item) => item.url);
    for (const project of projects)
      expect(
        urls.some((url) => url.endsWith(`/projects/${project.slug}`)),
      ).toBe(true);
    for (const item of engineeringCases)
      expect(urls.some((url) => url.endsWith(`/cases/${item.slug}`))).toBe(
        true,
      );
    for (const flow of flows)
      expect(urls.some((url) => url.endsWith(`/flows/${flow.slug}`))).toBe(
        true,
      );
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
