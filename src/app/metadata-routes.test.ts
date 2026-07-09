import { describe, expect, it, vi } from "vitest";

import { metadata as blogMetadata } from "./blog/page";
import { generateMetadata as generateCaseStudyMetadata } from "./case-studies/[slug]/page";
import robots from "./robots";
import sitemap from "./sitemap";
import { publishedBlogTopics } from "@/content/blog";
import { caseStudies, getCaseStudyBySlug } from "@/content/portfolio-cases";

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
        ...caseStudies.map(
          (caseStudy) =>
            `https://portfolio.example/case-studies/${caseStudy.slug}`,
        ),
      ]),
    );
    expect(sitemap().map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        "https://portfolio.example/blog",
        ...publishedBlogTopics.map(
          (topic) => `https://portfolio.example/blog/${topic.slug}`,
        ),
      ]),
    );
    expect(robots().host).toBe("https://portfolio.example");

    const staticEntry = sitemap().find(
      (entry) => entry.url === "https://portfolio.example/projects",
    );
    const publishedBlogEntry = sitemap().find(
      (entry) =>
        entry.url ===
        `https://portfolio.example/blog/${publishedBlogTopics[0]?.slug}`,
    );

    expect(staticEntry).not.toHaveProperty("lastModified");
    expect(publishedBlogEntry?.lastModified).toBe(
      publishedBlogTopics[0]?.publishedAt,
    );

    vi.unstubAllEnvs();
  });

  it("allows the published Redis article to be discovered", () => {
    expect(publishedBlogTopics.map((topic) => topic.slug)).toContain(
      "redis-queue-lock-presence-reconciliation",
    );
    expect(blogMetadata.robots).toEqual({ index: true, follow: true });
  });

  it("uses canonical case titles and summaries for case-study metadata", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");
    const caseStudy = getCaseStudyBySlug(
      "concert-seat-overselling-consistency",
    );

    await expect(
      generateCaseStudyMetadata({
        params: Promise.resolve({
          slug: "concert-seat-overselling-consistency",
        }),
      }),
    ).resolves.toMatchObject({
      title: caseStudy?.title,
      description: caseStudy?.summary,
      alternates: {
        canonical:
          "https://portfolio.example/case-studies/concert-seat-overselling-consistency",
      },
    });

    await expect(
      generateCaseStudyMetadata({
        params: Promise.resolve({ slug: "concert-booking" }),
      }),
    ).resolves.toMatchObject({
      title: caseStudy?.title,
      description: caseStudy?.summary,
      alternates: {
        canonical:
          "https://portfolio.example/case-studies/concert-seat-overselling-consistency",
      },
    });

    await expect(
      generateCaseStudyMetadata({
        params: Promise.resolve({ slug: "unknown-case" }),
      }),
    ).resolves.toMatchObject({
      title: "문제 해결 사례",
      robots: { index: false, follow: false },
    });

    vi.unstubAllEnvs();
  });
});
