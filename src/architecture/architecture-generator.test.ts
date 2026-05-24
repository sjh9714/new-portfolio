import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { featuredPortfolioCases } from "@/content/portfolio-cases";

import { renderDiagram } from "./render-svg.ts";
import { architectureSpecs } from "./specs/index.ts";

describe("architecture SVG generator", () => {
  it("renders deterministic SVG artifacts for every featured case diagram", () => {
    for (const spec of architectureSpecs) {
      const generated = renderDiagram(spec);
      const current = readFileSync(
        join(process.cwd(), spec.outputFile),
        "utf8",
      );

      expect(current).toBe(generated);
    }
  });

  it("keeps spec output files aligned with portfolio problemArchitecture metadata", () => {
    const outputFiles = architectureSpecs.map((spec) => spec.outputFile);

    expect(outputFiles).toEqual(
      featuredPortfolioCases.map(
        (portfolioCase) => portfolioCase.problemArchitecture.sourceFile,
      ),
    );

    expect(
      architectureSpecs.map((spec) => `/architecture/cases/${spec.slug}.svg`),
    ).toEqual(
      featuredPortfolioCases.map(
        (portfolioCase) => portfolioCase.problemArchitecture.imageSrc,
      ),
    );
  });

  it("validates spec structure through the renderer", () => {
    for (const spec of architectureSpecs) {
      const nodeIds = new Set(spec.nodes.map((node) => node.id));

      expect(nodeIds.size).toBe(spec.nodes.length);

      for (const node of spec.nodes) {
        expect(node.x % 20).toBe(0);
        expect(node.y % 20).toBe(0);
        expect(node.w % 20).toBe(0);
        expect(node.h % 20).toBe(0);
        expect(node.h).toBeGreaterThanOrEqual(38 + node.lines.length * 18);
      }

      for (const edge of spec.edges) {
        expect(nodeIds.has(edge.from)).toBe(true);
        expect(nodeIds.has(edge.to)).toBe(true);
      }

      expect(() => renderDiagram(spec)).not.toThrow();
    }
  });

  it("emits SVGs with common marker, viewBox, text, and tspan primitives only", () => {
    for (const spec of architectureSpecs) {
      const svg = renderDiagram(spec);

      expect(svg).toContain("Generated from");
      expect(svg).toContain("Do not edit this SVG directly");
      expect(svg).toContain("<marker");
      expect(svg).toContain("viewBox");
      expect(svg).toContain("<text");
      expect(svg).toContain("<tspan");

      for (const forbidden of [
        "<foreignObject",
        ".png",
        ".jpg",
        ".jpeg",
        ".webp",
        "next/image",
        "linearGradient",
        "radialGradient",
      ]) {
        expect(svg).not.toContain(forbidden);
      }
    }
  });

  it("uses orthogonal edge paths and never emits curve commands for generated edges", () => {
    for (const spec of architectureSpecs) {
      const edgePaths = Array.from(
        renderDiagram(spec).matchAll(/<path id="edge-[^"]+" d="([^"]+)"/g),
      ).map((match) => match[1]);

      expect(edgePaths.length).toBe(spec.edges.length);

      for (const path of edgePaths) {
        expect(path).toMatch(/^M \d+ \d+(?: [HV] \d+)+$/);
        expect(path).not.toMatch(/[CQSA]/);
      }
    }
  });

  it("documents the generator workflow and raw SVG edit boundary", () => {
    const readmeSource = readFileSync(join(process.cwd(), "README.md"), "utf8");
    const rulesSource = readFileSync(
      join(process.cwd(), "docs/ARCHITECTURE_SVG_RULES.md"),
      "utf8",
    );

    expect(readmeSource).toContain("npm run generate:architecture");
    expect(readmeSource).toContain("npm run check:architecture");
    expect(readmeSource).toContain("전체 아키텍처 SVG");
    expect(readmeSource).toContain("generator output");
    expect(rulesSource).toContain("raw SVG를 직접 편집하지 않습니다");
    expect(rulesSource).toContain("fromPort");
    expect(rulesSource).toContain("toPort");
    expect(rulesSource).toContain("직각 routing");
  });
});
