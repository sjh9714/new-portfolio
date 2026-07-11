import type { Metadata } from "next";
import { describe, expect, it } from "vitest";

import { metadata as rootMetadata } from "./layout";
import { metadata as notFoundMetadata } from "./not-found";
import ProjectOpenGraphImage, {
  alt as projectImageAlt,
} from "./projects/[slug]/opengraph-image";
import { metadata as homeMetadata } from "./page";
import { metadata as projectsMetadata } from "./projects/page";
import { metadata as resumeMetadata } from "./resume/page";

function expectSocialImage(metadata: Metadata) {
  expect(metadata.openGraph).toHaveProperty("images");
  expect(metadata.twitter).toHaveProperty("images");
}

describe("page metadata", () => {
  it("publishes social images for every top-level public page", () => {
    [homeMetadata, projectsMetadata, resumeMetadata].forEach(expectSocialImage);
  });

  it("keeps home-only directives out of root metadata and noindex ownership in Next", () => {
    expect(rootMetadata.alternates).toBeUndefined();
    expect(rootMetadata.openGraph).not.toHaveProperty("url");
    expect(rootMetadata.robots).toBeUndefined();
    expect(homeMetadata.alternates).toEqual({ canonical: "/" });
    expect(homeMetadata.openGraph).toHaveProperty("url", "/");
    expect(notFoundMetadata.robots).toBeUndefined();
    expect(notFoundMetadata.alternates).toBeUndefined();
    expect(notFoundMetadata.openGraph).toBeUndefined();
  });
});

describe("dynamic Open Graph image", () => {
  it("exports accessible alt metadata", () => {
    expect(projectImageAlt).toBeTruthy();
  });

  it.each(["__proto__", "constructor", "toString"])(
    "returns 404 for prototype-like slug %s",
    async (slug) => {
      await expect(
        ProjectOpenGraphImage({ params: Promise.resolve({ slug }) }),
      ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
    },
  );
});
