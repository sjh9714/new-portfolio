import { describe, expect, it } from "vitest";

import { engineeringCases } from "./cases";
import { diagrams } from "./diagrams";
import { flows } from "./flows";
import { additionalSystemsWork, alsoShipped, projects } from "./projects";
import { sources } from "./sources";

function expectUnique<T>(values: readonly T[]) {
  expect(new Set(values).size).toBe(values.length);
}

describe("story content graph", () => {
  it("keeps public identifiers unique", () => {
    expectUnique(projects.map((item) => item.slug));
    expectUnique(engineeringCases.map((item) => item.slug));
    expectUnique(flows.map((item) => item.slug));
    expectUnique(sources.map((item) => item.id));
    expectUnique(diagrams.map((item) => item.id));
  });

  it("shows exactly four selected projects in the intended order", () => {
    expect(
      projects.filter((project) => project.featured).map((item) => item.slug),
    ).toEqual([
      "borrow-me",
      "concert-booking",
      "realtime-chat",
      "memory-of-year",
    ]);
  });

  it("limits stack labels and resolves every reference", () => {
    const sourceIds = new Set(sources.map((source) => source.id));
    const caseSlugs = new Set<string>(
      engineeringCases.map((item) => item.slug),
    );
    const flowSlugs = new Set<string>(flows.map((item) => item.slug));
    const diagramIds = new Set<string>(diagrams.map((item) => item.id));

    for (const project of projects) {
      expect(project.tech.length).toBeLessThanOrEqual(5);
      expect(project.userJourney.length).toBeGreaterThanOrEqual(2);
      project.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      project.timeline
        .flatMap((item) => item.sourceIds)
        .forEach((id) => expect(sourceIds.has(id)).toBe(true));
      project.caseSlugs.forEach((slug) =>
        expect(caseSlugs.has(slug)).toBe(true),
      );
      project.flowSlugs.forEach((slug) =>
        expect(flowSlugs.has(slug)).toBe(true),
      );
    }

    for (const item of engineeringCases) {
      item.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      expect(diagramIds.has(item.diagramId)).toBe(true);
      expect(
        projects.some((project) => project.slug === item.projectSlug),
      ).toBe(true);
    }

    for (const flow of flows) {
      const flowSourceIds = new Set(flow.sourceIds);
      flow.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      expect(
        flow.variants.some((variant) => variant.id === flow.initialVariant),
      ).toBe(true);
      for (const variant of flow.variants) {
        const actorIds = new Set(variant.actors.map((actor) => actor.id));
        const edgeIds = new Set(variant.edges.map((edge) => edge.id));
        expectUnique(variant.actors.map((actor) => actor.id));
        expectUnique(variant.edges.map((edge) => edge.id));
        expectUnique(variant.steps.map((step) => step.id));
        for (const actor of variant.actors) {
          expect(actor.sourceIds.length).toBeGreaterThan(0);
          actor.sourceIds.forEach((id) => {
            expect(sourceIds.has(id)).toBe(true);
            expect(flowSourceIds.has(id)).toBe(true);
          });
        }
        for (const edge of variant.edges) {
          expect(actorIds.has(edge.from)).toBe(true);
          expect(actorIds.has(edge.to)).toBe(true);
          expect(edge.sourceIds.length).toBeGreaterThan(0);
          edge.sourceIds.forEach((id) => {
            expect(sourceIds.has(id)).toBe(true);
            expect(flowSourceIds.has(id)).toBe(true);
          });
        }
        for (const step of variant.steps) {
          expect(step.sourceIds.length).toBeGreaterThan(0);
          step.sourceIds.forEach((id) => {
            expect(sourceIds.has(id)).toBe(true);
            expect(flowSourceIds.has(id)).toBe(true);
          });
          step.activeNodeIds.forEach((id) =>
            expect(actorIds.has(id)).toBe(true),
          );
          step.activeEdgeIds.forEach((id) =>
            expect(edgeIds.has(id)).toBe(true),
          );
          Object.keys(step.visibleState).forEach((id) =>
            expect(actorIds.has(id)).toBe(true),
          );
        }
      }
    }

    for (const diagram of diagrams) {
      const diagramSourceIds = new Set(diagram.sourceIds);
      const nodeIds = new Set(diagram.nodes.map((node) => node.id));
      diagram.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
      expectUnique(diagram.nodes.map((node) => node.id));
      expectUnique(diagram.edges.map((edge) => edge.id));
      for (const node of diagram.nodes) {
        expect(node.sourceIds.length).toBeGreaterThan(0);
        node.sourceIds.forEach((id) => {
          expect(sourceIds.has(id)).toBe(true);
          expect(diagramSourceIds.has(id)).toBe(true);
        });
        expect(node.compact.x).toBeGreaterThanOrEqual(0);
        expect(node.compact.y).toBeGreaterThanOrEqual(0);
        expect(node.compact.width).toBeGreaterThan(0);
      }
      for (const edge of diagram.edges) {
        expect(nodeIds.has(edge.from)).toBe(true);
        expect(nodeIds.has(edge.to)).toBe(true);
        expect(edge.sourceIds.length).toBeGreaterThan(0);
        edge.sourceIds.forEach((id) => {
          expect(sourceIds.has(id)).toBe(true);
          expect(diagramSourceIds.has(id)).toBe(true);
        });
      }
      for (const step of diagram.mobileSteps) {
        expect(step.text.length).toBeGreaterThan(0);
        expect(step.sourceIds.length).toBeGreaterThan(0);
        step.sourceIds.forEach((id) => {
          expect(sourceIds.has(id)).toBe(true);
          expect(diagramSourceIds.has(id)).toBe(true);
        });
      }
    }

    for (const item of [...alsoShipped, ...additionalSystemsWork]) {
      item.sourceIds.forEach((id) => expect(sourceIds.has(id)).toBe(true));
    }
  });

  it("keeps graph provenance narrower than each aggregate source list", () => {
    for (const flow of flows) {
      const directRefs = flow.variants.flatMap((variant) => [
        ...variant.actors.map((actor) => actor.sourceIds),
        ...variant.edges.map((edge) => edge.sourceIds),
      ]);
      expect(directRefs.some((ids) => ids.length < flow.sourceIds.length)).toBe(
        true,
      );
    }

    for (const diagram of diagrams) {
      const directRefs = [
        ...diagram.nodes.map((node) => node.sourceIds),
        ...diagram.edges.map((edge) => edge.sourceIds),
        ...diagram.mobileSteps.map((step) => step.sourceIds),
      ];
      expect(
        directRefs.some((ids) => ids.length < diagram.sourceIds.length),
      ).toBe(true);
    }
  });

  it("requires pinned code provenance while keeping owner facts separate", () => {
    for (const source of sources) {
      if (source.verification === "owner-confirmed") {
        expect(source.kind).toBe("owner-attestation");
        expect(source.url).toBeUndefined();
      }

      if (
        source.verification === "public" &&
        ["commit", "test"].includes(source.kind)
      ) {
        expect(source.url).toMatch(/^https:\/\/github\.com\//);
        expect(source.sha).toMatch(/^[0-9a-f]{40}$/);
        expect(source.url).toContain(source.sha);
      }
    }
  });

  it("does not publish rejected claims", () => {
    const publicText = JSON.stringify({
      projects,
      engineeringCases,
      flows,
      sources,
    });
    expect(publicText).not.toContain("1,010→23ms");
    expect(publicText).not.toContain("201→3");
    expect(publicText).not.toContain("Running_App");
    expect(publicText).not.toContain('"pending"');
    expect(publicText).not.toContain("App Store 출시");
    expect(publicText).not.toContain("오픈소스 — Agent-Gate");
  });

  it("keeps each interactive flow spec below the transfer budget", () => {
    for (const flow of flows) {
      expect(Buffer.byteLength(JSON.stringify(flow), "utf8")).toBeLessThan(
        40 * 1024,
      );
      for (const variant of flow.variants) {
        const estimatedSvgElements = 4 + variant.edges.length * 3;
        expect(estimatedSvgElements).toBeLessThan(150);
      }
    }
  });
});
