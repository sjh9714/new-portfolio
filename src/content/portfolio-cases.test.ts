import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  featuredPortfolioCases,
  getPortfolioCaseBySlug,
  legacyCaseStudyAliases,
} from "./portfolio-cases";
import { getProjectBySlug } from "./projects";

describe("PDF-style portfolio cases", () => {
  it("uses five resume-line problem solving cases in the final order", () => {
    expect(
      featuredPortfolioCases.map((portfolioCase) => portfolioCase.slug),
    ).toEqual([
      "concert-seat-overselling-consistency",
      "concert-outbox-dlt-recovery",
      "chat-room-n-plus-one-rps",
      "billing-idempotency-webhook-ledger",
      "borrowme-product-list-n-plus-one",
    ]);
  });

  it("keeps MSA Shop out of the featured portfolio case list", () => {
    expect(
      featuredPortfolioCases.map((portfolioCase) => portfolioCase.projectSlug),
    ).not.toContain("msa-shop");
  });

  it("structures every case as problem, solution, result, and evidence", () => {
    for (const portfolioCase of featuredPortfolioCases) {
      expect(portfolioCase.title).not.toBe(
        getProjectBySlug(portfolioCase.projectSlug)?.title,
      );
      expect(portfolioCase.resumeLine.length).toBeGreaterThan(20);
      expect(portfolioCase.problem.length).toBeGreaterThanOrEqual(3);
      expect(portfolioCase.solution.length).toBeGreaterThanOrEqual(3);
      expect(portfolioCase.result.length).toBeGreaterThanOrEqual(3);
      expect(portfolioCase.evidence.length).toBeGreaterThan(0);
      expect(portfolioCase.limitations.length).toBeGreaterThan(0);
      expect(portfolioCase.interviewQuestions.length).toBeGreaterThan(0);
    }
  });

  it("only reuses evidence labels from the connected project", () => {
    for (const portfolioCase of featuredPortfolioCases) {
      const project = getProjectBySlug(portfolioCase.projectSlug);
      const projectEvidenceLabels = project?.evidence.map(
        (evidence) => evidence.label,
      );

      expect(project).toBeDefined();
      for (const evidence of portfolioCase.evidence) {
        expect(projectEvidenceLabels).toContain(evidence.label);
      }
    }
  });

  it("does not render placeholder measurement environment rows", () => {
    for (const portfolioCase of featuredPortfolioCases) {
      for (const item of portfolioCase.measurementEnvironment ?? []) {
        expect(item.value).not.toBe("");
        expect(item.value).not.toContain("추가 기입 예정");
        expect(item.value).not.toContain("TBD");
      }
    }
  });

  it("preserves legacy case study URLs as aliases", () => {
    expect(legacyCaseStudyAliases).toMatchObject({
      "concert-booking": "concert-seat-overselling-consistency",
      "realtime-chat": "chat-room-n-plus-one-rps",
      "ai-usage-billing-gateway": "billing-idempotency-webhook-ledger",
      "msa-shop": "/projects#msa-shop",
    });
  });

  it("points the homepage and sitemap at portfolio cases, not featured projects", () => {
    const homeSource = readFileSync(
      join(process.cwd(), "src/app/page.tsx"),
      "utf8",
    );
    const caseIndexSource = readFileSync(
      join(process.cwd(), "src/app/case-studies/page.tsx"),
      "utf8",
    );
    const sitemapSource = readFileSync(
      join(process.cwd(), "src/app/sitemap.ts"),
      "utf8",
    );

    expect(homeSource).toContain(
      "이 포트폴리오는 이력서에 한 줄로 압축한 문제 해결 경험을 구조도, 문제 원인, 해결 과정, 검증 결과로 확장한 문서입니다.",
    );
    expect(homeSource).toContain("이력서 한 줄을 확장한 문제 해결 포트폴리오");
    expect(homeSource).toContain("featuredPortfolioCases");
    expect(caseIndexSource).toContain("featuredPortfolioCases");
    expect(sitemapSource).toContain("featuredPortfolioCases");
  });

  it("can resolve every published case by slug", () => {
    for (const portfolioCase of featuredPortfolioCases) {
      expect(getPortfolioCaseBySlug(portfolioCase.slug)).toEqual(portfolioCase);
    }
  });
});
