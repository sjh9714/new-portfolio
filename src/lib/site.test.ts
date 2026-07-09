import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createPageMetadata,
  createRootMetadata,
  getAbsoluteUrl,
  getSiteUrl,
  siteName,
  siteUrlFallback,
} from "@/lib/site";
import {
  createCaseStudyItemListStructuredData,
  createPersonStructuredData,
  serializeStructuredData,
} from "@/lib/structured-data";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("site URL", () => {
  it("uses the deployed portfolio origin when no environment URL exists", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");

    expect(getSiteUrl()).toBe(siteUrlFallback);
    expect(getAbsoluteUrl("/case-studies")).toBe(
      `${siteUrlFallback}/case-studies`,
    );
  });

  it("normalizes a configured origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example/");

    expect(getSiteUrl()).toBe("https://portfolio.example");
  });

  it.each([
    "portfolio.example",
    "javascript:alert(1)",
    "https://portfolio.example/subpath",
    "https://portfolio.example/?preview=1",
  ])("rejects an invalid configured site URL: %s", (value) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", value);

    expect(() => getSiteUrl()).toThrow(/NEXT_PUBLIC_SITE_URL/);
  });
});

describe("page metadata", () => {
  it("builds route-specific canonical, Open Graph, and Twitter metadata", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");

    expect(
      createPageMetadata({
        title: "프로젝트",
        description: "검증 가능한 프로젝트",
        path: "/projects/",
      }),
    ).toMatchObject({
      title: "프로젝트",
      description: "검증 가능한 프로젝트",
      alternates: {
        canonical: "https://portfolio.example/projects",
      },
      openGraph: {
        title: `프로젝트 | ${siteName}`,
        url: "https://portfolio.example/projects",
        images: [
          {
            url: "https://portfolio.example/opengraph-image",
            width: 1200,
            height: 630,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `프로젝트 | ${siteName}`,
        images: ["https://portfolio.example/opengraph-image"],
      },
      robots: {
        index: true,
        follow: true,
      },
    });
  });

  it("creates root metadata with the deployed origin and title template", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");

    expect(createRootMetadata()).toMatchObject({
      metadataBase: new URL("https://portfolio.example"),
      title: {
        default: siteName,
        template: `%s | ${siteName}`,
      },
      alternates: {
        canonical: "https://portfolio.example/",
      },
      openGraph: {
        url: "https://portfolio.example/",
      },
    });
  });

  it("supports a case-specific image and a non-indexable page", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");

    expect(
      createPageMetadata({
        title: "이벤트 복구",
        path: "/case-studies/event-recovery",
        imagePath: "/case-studies/event-recovery/opengraph-image",
        noIndex: true,
      }),
    ).toMatchObject({
      openGraph: {
        url: "https://portfolio.example/case-studies/event-recovery",
        images: [
          {
            url: "https://portfolio.example/case-studies/event-recovery/opengraph-image",
          },
        ],
      },
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});

describe("structured data", () => {
  it("uses only supplied public profile facts", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");

    expect(
      createPersonStructuredData({ githubUrl: "https://github.com/example" }),
    ).toMatchObject({
      "@type": "Person",
      name: "성진혁",
      jobTitle: "Java/Spring 백엔드 개발자",
      url: "https://portfolio.example/",
      sameAs: ["https://github.com/example"],
    });
  });

  it("builds absolute, ordered case-study list items", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");

    expect(
      createCaseStudyItemListStructuredData([
        { slug: "seat-consistency", title: "좌석 정합성" },
        { slug: "event-recovery", title: "이벤트 복구" },
      ]),
    ).toMatchObject({
      "@type": "ItemList",
      numberOfItems: 2,
      itemListElement: [
        {
          position: 1,
          name: "좌석 정합성",
          url: "https://portfolio.example/case-studies/seat-consistency",
        },
        {
          position: 2,
          name: "이벤트 복구",
          url: "https://portfolio.example/case-studies/event-recovery",
        },
      ],
    });
  });

  it("escapes markup when serialized into a JSON-LD script", () => {
    expect(serializeStructuredData({ name: "</script>" })).toBe(
      '{"name":"\\u003c/script>"}',
    );
  });
});
