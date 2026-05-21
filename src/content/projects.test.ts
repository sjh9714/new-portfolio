import { describe, expect, it } from "vitest";

import {
  additionalProjects,
  archiveProjects,
  featuredProjects,
  getEvidencePreview,
  projects,
} from "./projects";

const disallowedConceptExamples = [
  "url-shortener",
  "notification-service",
  "file-service",
  "idempotency-library",
  "outbox-starter",
];

describe("portfolio project content", () => {
  it("uses the selected four featured backend case studies", () => {
    expect(featuredProjects.map((project) => project.slug)).toEqual([
      "concert-booking",
      "realtime-chat",
      "ai-usage-billing-gateway",
      "msa-shop",
    ]);
  });

  it("groups the remaining real projects as additional or archive", () => {
    expect(additionalProjects.map((project) => project.slug)).toEqual([
      "timedeal-service",
      "borrow-me",
      "running-app",
      "ai-interview-coach",
    ]);
    expect(archiveProjects.map((project) => project.slug)).toEqual([
      "memory-of-year",
    ]);
  });

  it("keeps cards scannable and evidence status explicit", () => {
    for (const project of projects) {
      expect(project.primaryTechStack.length).toBeLessThanOrEqual(5);
      expect(project.evidence.length).toBeGreaterThan(0);

      for (const evidence of project.evidence) {
        expect(["measured", "verified", "pending"]).toContain(
          evidence.status,
        );
        expect(evidence.label.length).toBeGreaterThan(0);
        expect(evidence.value.length).toBeGreaterThan(0);
      }
    }
  });

  it("marks known unfinished claims as pending instead of measured", () => {
    const realtime = projects.find((project) => project.slug === "realtime-chat");
    const billing = projects.find(
      (project) => project.slug === "ai-usage-billing-gateway",
    );

    expect(realtime?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Send-to-receive latency",
          status: "pending",
        }),
        expect.objectContaining({
          label: "WebSocket delivery completeness",
          status: "pending",
        }),
      ]),
    );

    expect(billing?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "k6 mixed usage scenario",
          status: "pending",
        }),
        expect.objectContaining({
          label: "Production performance claim",
          status: "pending",
        }),
      ]),
    );
  });

  it("does not include invented concept placeholder projects or unsafe MSA claims", () => {
    expect(projects.map((project) => project.slug)).not.toEqual(
      expect.arrayContaining(disallowedConceptExamples),
    );
    expect(JSON.stringify(projects)).not.toContain("운영 가능한 대규모 MSA");
  });

  it("surfaces pending evidence in compact featured previews when pending claims exist", () => {
    const realtime = projects.find((project) => project.slug === "realtime-chat");
    const billing = projects.find(
      (project) => project.slug === "ai-usage-billing-gateway",
    );

    expect(realtime && getEvidencePreview(realtime, 2)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: "pending" }),
      ]),
    );
    expect(billing && getEvidencePreview(billing, 2)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ status: "pending" }),
      ]),
    );
  });
});
