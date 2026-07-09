import { describe, expect, it } from "vitest";

import {
  additionalProjects,
  evidenceCatalog,
  featuredProjects,
  getEvidenceById,
  getEvidenceByIds,
  getProjectBySlug,
  getProjectEvidence,
  projects,
  validateProjectContent,
} from "./projects";

describe("portfolio project content", () => {
  it("passes the semantic content validator", () => {
    expect(validateProjectContent()).toEqual([]);
  });

  it("keeps the four featured projects in interview scan order", () => {
    expect(featuredProjects.map((project) => project.slug)).toEqual([
      "concert-booking",
      "realtime-chat",
      "ai-usage-billing-gateway",
      "borrow-me",
    ]);

    expect(additionalProjects.map((project) => project.slug)).toEqual([
      "msa-shop",
      "timedeal-service",
      "running-app",
      "ai-interview-coach",
      "memory-of-year",
    ]);
  });

  it("requires complete problem, decision, result, link, and compact tech data", () => {
    for (const project of projects) {
      expect(project.title.trim()).not.toBe("");
      expect(project.positioning.trim()).not.toBe("");
      expect(project.problem.trim()).not.toBe("");
      expect(project.decision.trim()).not.toBe("");
      expect(project.result.trim()).not.toBe("");
      expect(project.repoUrl).toMatch(/^https:\/\/github\.com\//);
      expect(project.tech.length).toBeGreaterThan(0);
      expect(project.tech.length).toBeLessThanOrEqual(5);
    }

    for (const project of featuredProjects) {
      expect(project.evidenceIds.length).toBeGreaterThan(0);
      expect(project.caseStudySlugs.length).toBeGreaterThan(0);
    }
  });

  it("uses unique IDs and commit-pinned GitHub proof sources", () => {
    expect(new Set(projects.map((project) => project.slug)).size).toBe(
      projects.length,
    );
    expect(new Set(evidenceCatalog.map((evidence) => evidence.id)).size).toBe(
      evidenceCatalog.length,
    );

    for (const evidence of evidenceCatalog) {
      expect(evidence.source.permalink).toMatch(
        /^https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/[0-9a-f]{40}\//,
      );
      expect(
        evidence.source.permalink.startsWith(evidence.source.repoUrl),
      ).toBe(true);
    }
  });

  it("enforces status-specific provenance without pending evidence", () => {
    for (const evidence of evidenceCatalog) {
      expect(evidence.status).not.toBe("pending");

      if (evidence.status === "measured") {
        expect(evidence.measuredAt).toMatch(/^\d{4}-\d{2}-\d{2}/);
        expect(evidence.scenario.trim()).not.toBe("");
        expect(evidence.environment.trim()).not.toBe("");
      } else {
        expect(evidence.method.trim()).not.toBe("");
      }
    }
  });

  it("resolves evidence only from catalog IDs", () => {
    for (const project of projects) {
      expect(getProjectBySlug(project.slug)).toBe(project);
      expect(
        getProjectEvidence(project).map((evidence) => evidence.id),
      ).toEqual(project.evidenceIds);
    }

    const ids = [
      "concert-seat-single-winner",
      "realtime-delivery-completeness",
    ];
    expect(getEvidenceByIds(ids).map((evidence) => evidence.id)).toEqual(ids);
    expect(getEvidenceById("missing-evidence")).toBeUndefined();
    expect(() => getEvidenceByIds(["missing-evidence"])).toThrow(
      "Missing evidence",
    );
  });

  it("keeps claims inside the verified scope", () => {
    const billing = getProjectBySlug("ai-usage-billing-gateway");
    const realtime = getProjectBySlug("realtime-chat");
    const borrowMe = getProjectBySlug("borrow-me");

    expect(billing?.positioning).toContain("API Key");
    expect(JSON.stringify(billing)).not.toContain("멀티테넌트 격리");
    expect(realtime?.positioning).toContain("receiver completeness");
    expect(realtime?.positioning).not.toContain("N+1");
    expect(borrowMe?.result).toContain("p95 358.1088ms");
  });

  it("does not publish unsupported historical metrics", () => {
    const publicPayload = JSON.stringify({ evidenceCatalog, projects });

    for (const unsupported of [
      "1,010",
      "1010",
      "201회",
      "201 queries",
      "201→3",
      "201 → 3",
      "23ms",
      '"status":"pending"',
    ]) {
      expect(publicPayload).not.toContain(unsupported);
    }
  });
});
