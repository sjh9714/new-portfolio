import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { featuredProjects } from "./projects";
import { architectureDiagrams } from "./architecture-diagrams";

describe("architecture diagram content", () => {
  it("defines a diagram for every featured project", () => {
    expect(Object.keys(architectureDiagrams).sort()).toEqual(
      featuredProjects.map((project) => project.slug).sort(),
    );
  });

  it("only references existing nodes from edges and boundaries", () => {
    for (const diagram of Object.values(architectureDiagrams)) {
      const nodeIds = new Set(diagram.nodes.map((node) => node.id));

      for (const edge of diagram.edges) {
        expect(nodeIds.has(edge.from), `${diagram.slug}:${edge.id}:from`).toBe(
          true,
        );
        expect(nodeIds.has(edge.to), `${diagram.slug}:${edge.id}:to`).toBe(
          true,
        );
      }

      for (const boundary of diagram.boundaries) {
        for (const nodeId of boundary.nodeIds) {
          expect(
            nodeIds.has(nodeId),
            `${diagram.slug}:${boundary.id}:${nodeId}`,
          ).toBe(true);
        }
      }
    }
  });

  it("maps diagram evidence labels to project evidence and keeps pending markers honest", () => {
    for (const project of featuredProjects) {
      const diagram = architectureDiagrams[project.slug];
      const evidenceByLabel = new Map(
        project.evidence.map((evidence) => [evidence.label, evidence.status]),
      );
      const evidenceLabels = [
        ...diagram.nodes.flatMap((node) =>
          node.evidenceLabel ? [node.evidenceLabel] : [],
        ),
        ...diagram.edges.flatMap((edge) =>
          edge.evidenceLabel ? [edge.evidenceLabel] : [],
        ),
        ...diagram.callouts.flatMap((callout) =>
          callout.evidenceLabel ? [callout.evidenceLabel] : [],
        ),
      ];

      for (const label of evidenceLabels) {
        expect(evidenceByLabel.has(label), `${project.slug}:${label}`).toBe(
          true,
        );
      }

      for (const node of diagram.nodes) {
        if (node.status === "pending" && node.evidenceLabel) {
          expect(evidenceByLabel.get(node.evidenceLabel)).toBe("pending");
        }
        expect(node.kind === "cache" && node.sourceOfTruth).toBe(false);
      }
    }
  });

  it("renders design-review markers for technical editorial diagrams", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/architecture-diagram/index.tsx"),
      "utf8",
    );

    expect(source).toContain("최종 기준 데이터");
    expect(source).toContain("실패/복구 경로");
    expect(source).toContain("비동기 경계");
    expect(source).toContain("추가 검증 예정");
  });
});
