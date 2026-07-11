import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { projects } from "./projects";
import { sources } from "./sources";
import { visualAssets } from "./visuals";

function expectUnique(values: readonly string[]) {
  expect(new Set(values).size).toBe(values.length);
}

describe("story-first portfolio content", () => {
  const sourceIds = new Set(sources.map((source) => source.id));
  const visualIds = new Set(visualAssets.map((visual) => visual.id));

  it("publishes exactly four projects in the agreed order", () => {
    expect(projects.map((project) => project.slug)).toEqual([
      "memory-of-year",
      "concert-booking",
      "realtime-chat",
      "borrow-me",
    ]);
    expect(projects.map((project) => project.featuredOrder)).toEqual([
      1, 2, 3, 4,
    ]);
    expectUnique(projects.map((project) => project.slug));
  });

  it("keeps every project complete and technology lists short", () => {
    for (const project of projects) {
      expect(project.title.length).toBeGreaterThan(0);
      expect(project.oneLiner.length).toBeGreaterThan(20);
      expect(project.overview.context.length).toBeGreaterThan(0);
      expect(project.overview.role.length).toBeGreaterThan(0);
      expect(project.overview.turningPoint.length).toBeGreaterThan(0);
      expect(project.overview.proof.length).toBeGreaterThan(0);
      expect(project.tech.length).toBeLessThanOrEqual(5);
      expect(project.sourceIds.length).toBeGreaterThan(0);
      expect(project.limitations.length).toBeGreaterThan(0);
      expect(project.repoUrl).toMatch(/^https:\/\/github\.com\//);

      if (project.kind === "team-product") {
        expect(project.team.length).toBeGreaterThan(0);
        expect(project.collaboration.length).toBeGreaterThan(0);
        expect(project.shippedOutcome.length).toBeGreaterThan(0);
        expect(project.chapters.length).toBeGreaterThan(0);
      } else {
        expect(project.acceptanceCriteria.length).toBeGreaterThan(0);
        expect(project.userJourney.length).toBeGreaterThan(0);
        expect(project.milestones.length).toBeGreaterThan(0);
        expect(project.guidedFlows.length).toBeGreaterThan(0);
      }
    }
  });

  it("resolves every source and visual reference", () => {
    expectUnique(sources.map((source) => source.id));
    expectUnique(visualAssets.map((visual) => visual.id));

    for (const project of projects) {
      project.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      project.visualIds.forEach((id) => expect(visualIds.has(id)).toBe(true));
      expect(sourceIds.has(project.overview.primaryProofId)).toBe(true);

      const chapters =
        project.kind === "team-product"
          ? [...project.chapters, ...(project.revisit ?? [])]
          : project.milestones;
      for (const chapter of chapters) {
        chapter.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
        chapter.visualIds?.forEach((id) =>
          expect(visualIds.has(id)).toBe(true),
        );
        if (chapter.proofId) expect(sourceIds.has(chapter.proofId)).toBe(true);
      }

      for (const flow of project.guidedFlows ?? []) {
        expectUnique(flow.variants.map((variant) => variant.id));
        expect(
          flow.variants.some((variant) => variant.id === flow.initialVariant),
        ).toBe(true);
        for (const variant of flow.variants) {
          expectUnique(variant.steps.map((step) => step.id));
          for (const step of variant.steps) {
            expect(step.title.length).toBeGreaterThan(0);
            expect(step.body.length).toBeGreaterThan(0);
            expect(step.state.length).toBeGreaterThan(0);
            step.sourceIds.forEach((id) =>
              expect(sourceIds.has(id)).toBe(true),
            );
            if (step.visualId) expect(visualIds.has(step.visualId)).toBe(true);
          }
        }
      }
    }

    for (const visual of visualAssets) {
      expect(existsSync(join(process.cwd(), "public", visual.src))).toBe(true);
      expect(visual.alt.length).toBeGreaterThan(0);
      expect(visual.transcript.length).toBeGreaterThan(0);
      visual.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
    }
  });

  it("separates owner context from technical proof", () => {
    for (const source of sources) {
      if (source.verification === "owner-confirmed") {
        expect(source.kind).toBe("owner-attestation");
        expect(source.usage).toBe("context");
        expect(source.url).toBeUndefined();
        continue;
      }

      if (source.usage === "technical-proof") {
        expect(source.verification).toBe("public");
        expect(source.url).toMatch(/^https:\/\/github\.com\//);
        expect(source.sha).toMatch(/^[0-9a-f]{40}$/);
        expect(source.url).toContain(source.sha);
      }
    }

    for (const project of projects) {
      const primary = sources.find(
        (source) => source.id === project.overview.primaryProofId,
      );
      expect(primary?.usage).toBe("technical-proof");
      expect(primary?.verification).toBe("public");
    }
  });

  it("keeps the confirmed BorrowMe hackathon schedule distinct from Memory", () => {
    const borrowMe = projects.find((project) => project.slug === "borrow-me");
    const borrowContext = sources.find(
      (source) => source.id === "borrow-team-context",
    );

    expect(borrowMe?.kind).toBe("team-product");
    if (borrowMe?.kind === "team-product") {
      expect(borrowMe.duration).toBe("준비 약 2주 · 본 행사 1박 2일");
      expect(borrowMe.overview.context).not.toContain("2개월");
    }
    expect(borrowContext?.label).toContain("준비 약 2주 · 본 행사 1박 2일");
    expect(borrowContext?.label).not.toContain("2개월");
  });

  it("does not publish removed projects, unsupported metrics, or private links", () => {
    const publicText = JSON.stringify({ projects, sources, visualAssets });
    for (const rejected of [
      "1,010→23ms",
      "201→3",
      "Running_App",
      "Agent-Gate",
      "FocusYou",
      "AI Usage Billing",
      '"pending"',
      "실사용자",
      "운영 트래픽",
    ]) {
      expect(publicText).not.toContain(rejected);
    }
    expect(publicText).not.toMatch(/github\.com\/[^"]+\/pull\/\d+/);
  });

  it("keeps flow data within the client transfer budget", () => {
    for (const project of projects) {
      for (const flow of project.guidedFlows ?? []) {
        expect(Buffer.byteLength(JSON.stringify(flow), "utf8")).toBeLessThan(
          40 * 1024,
        );
      }
    }
  });
});
