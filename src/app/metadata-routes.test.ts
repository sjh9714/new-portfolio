import { describe, expect, it, vi } from "vitest";

import { metadata as blogMetadata } from "./blog/page";
import robots from "./robots";
import sitemap from "./sitemap";
import { featuredPortfolioCases } from "@/content/portfolio-cases";

describe("metadata routes", () => {
  it("uses NEXT_PUBLIC_SITE_URL for robots and sitemap", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");

    expect(robots().sitemap).toBe("https://portfolio.example/sitemap.xml");
    expect(sitemap().map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        "https://portfolio.example/",
        "https://portfolio.example/case-studies",
        "https://portfolio.example/projects",
        "https://portfolio.example/resume",
        "https://portfolio.example/about",
        ...featuredPortfolioCases.map(
          (portfolioCase) =>
            `https://portfolio.example/case-studies/${portfolioCase.slug}`,
        ),
      ]),
    );
    expect(sitemap().some((entry) => entry.url.endsWith("/blog"))).toBe(false);

    vi.unstubAllEnvs();
  });

  it("keeps unpublished blog pages out of public discovery", () => {
    expect(blogMetadata.robots).toEqual(
      expect.objectContaining({
        index: false,
        follow: false,
      }),
    );
  });
});
