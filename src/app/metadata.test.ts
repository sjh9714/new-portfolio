import type { Metadata } from "next";
import { describe, expect, it } from "vitest";

import { metadata as casesMetadata } from "./cases/page";
import CaseOpenGraphImage, {
  alt as caseImageAlt,
} from "./cases/[slug]/opengraph-image";
import { metadata as flowsMetadata } from "./flows/page";
import FlowOpenGraphImage, {
  alt as flowImageAlt,
} from "./flows/[slug]/opengraph-image";
import { metadata as rootMetadata } from "./layout";
import { metadata as notFoundMetadata } from "./not-found";
import { metadata as homeMetadata } from "./page";
import { metadata as projectsMetadata } from "./projects/page";
import ProjectOpenGraphImage, {
  alt as projectImageAlt,
} from "./projects/[slug]/opengraph-image";
import { metadata as resumeMetadata } from "./resume/page";

function expectSocialImage(metadata: Metadata) {
  expect(metadata.openGraph).toHaveProperty("images");
  expect(metadata.twitter).toHaveProperty("images");
}

describe("page metadata", () => {
  it("publishes social images for every top-level page", () => {
    [
      homeMetadata,
      projectsMetadata,
      casesMetadata,
      flowsMetadata,
      resumeMetadata,
    ].forEach(expectSocialImage);
  });

  it("keeps home-only directives out of the root layout and noindexes 404s", () => {
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

describe("dynamic Open Graph images", () => {
  it("exports accessible alt metadata", () => {
    expect(projectImageAlt).toBeTruthy();
    expect(caseImageAlt).toBeTruthy();
    expect(flowImageAlt).toBeTruthy();
  });

  it.each([
    [ProjectOpenGraphImage, "__proto__"],
    [CaseOpenGraphImage, "constructor"],
    [FlowOpenGraphImage, "toString"],
  ])("returns 404 for an unknown or prototype slug", async (image, slug) => {
    await expect(
      image({ params: Promise.resolve({ slug }) }),
    ).rejects.toMatchObject({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" });
  });
});
