import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  featuredPortfolioCases,
  featuredPortfolioProjectSlugs,
  getSupportingProjects,
  getPortfolioCaseBySlug,
  legacyCaseStudyAliases,
} from "./portfolio-cases";
import { additionalProjects, getProjectBySlug } from "./projects";

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

  it("exposes featured project slugs so additional lists can avoid duplicates", () => {
    expect(featuredPortfolioProjectSlugs).toEqual([
      "concert-booking",
      "realtime-chat",
      "ai-usage-billing-gateway",
      "borrow-me",
    ]);
    expect(
      getSupportingProjects(additionalProjects).map((project) => project.slug),
    ).toEqual([
      "msa-shop",
      "timedeal-service",
      "running-app",
      "ai-interview-coach",
    ]);
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
      expect("measurementEnvironment" in portfolioCase).toBe(false);

      for (const group of [
        ...(portfolioCase.measurement?.scenarios ?? []),
        ...(portfolioCase.measurement?.executionEnvironment ?? []),
      ]) {
        expect(group.label).not.toBe("");
        expect(group.label).not.toContain("추가 기입 예정");
        expect(group.label).not.toContain("TBD");
        expect(group.value).not.toBe("");
        expect(group.value).not.toContain("추가 기입 예정");
        expect(group.value).not.toContain("TBD");
      }

      for (const item of portfolioCase.measurement?.executionEnvironment ??
        []) {
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

  it("uses duplicate-safe supporting project lists on public project summaries", () => {
    for (const file of [
      "src/app/page.tsx",
      "src/app/projects/page.tsx",
      "src/app/resume/page.tsx",
    ]) {
      const source = readFileSync(join(process.cwd(), file), "utf8");

      expect(source).toContain("getSupportingProjects");
      expect(source).not.toContain("{additionalProjects.map(");
    }
  });

  it("renders portfolio case flow as a readable table instead of edge cards", () => {
    const diagramSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-case-diagram.tsx"),
      "utf8",
    );

    expect(diagramSource).toContain("<table");
    expect(diagramSource).toContain("From");
    expect(diagramSource).toContain("To");
    expect(diagramSource).toContain("설명");
    expect(diagramSource).toContain("표식");
    expect(diagramSource).not.toContain("FlowMobileField");
    expect(diagramSource).not.toContain("md:hidden");
    expect(diagramSource).not.toContain("hidden overflow-x-auto");
  });

  it("adds Outbox state transitions only to the Outbox/DLT portfolio case", () => {
    const outboxCase = getPortfolioCaseBySlug("concert-outbox-dlt-recovery");

    expect(outboxCase?.stateTransitions).toEqual([
      {
        from: "PENDING",
        to: "PUBLISHED",
        description: "Outbox relay가 Kafka 발행에 성공한 상태",
      },
      {
        from: "PUBLISHED",
        to: "CONSUMED",
        description: "consumer idempotency를 통과해 처리 완료된 상태",
      },
      {
        from: "PENDING",
        to: "RETRYING",
        description: "일시적 발행 실패 후 재시도 대상으로 남긴 상태",
      },
      {
        from: "RETRYING",
        to: "DEAD",
        description: "자동 재시도로 복구하지 못해 격리한 상태",
      },
      {
        from: "DEAD",
        to: "MANUAL_REPLAY",
        description: "운영자 확인 후 수동 재처리 대상으로 올린 상태",
      },
      {
        from: "MANUAL_REPLAY",
        to: "PUBLISHED",
        description: "수동 재처리 이벤트가 다시 발행된 상태",
      },
    ]);

    for (const portfolioCase of featuredPortfolioCases.filter(
      (item) => item.slug !== "concert-outbox-dlt-recovery",
    )) {
      expect(portfolioCase.stateTransitions).toBeUndefined();
    }
  });

  it("renders the Outbox state transition section on case study detail pages", () => {
    const articleSource = readFileSync(
      join(process.cwd(), "src/components/case-study-article.tsx"),
      "utf8",
    );

    expect(articleSource).toContain("Outbox 상태 전이");
    expect(articleSource).toContain("stateTransitions");
  });

  it("requires every featured portfolio case to expose a visual diagram", () => {
    const supportedTypes = ["flow", "before-after", "state-machine"];

    for (const portfolioCase of featuredPortfolioCases) {
      expect(portfolioCase.visualDiagram).toBeDefined();
      expect(supportedTypes).toContain(portfolioCase.visualDiagram?.type);
    }
  });

  it("keeps the Outbox visual state machine aligned with state transitions", () => {
    const outboxCase = getPortfolioCaseBySlug("concert-outbox-dlt-recovery");

    expect(outboxCase?.visualDiagram?.type).toBe("state-machine");

    if (
      outboxCase?.visualDiagram?.type !== "state-machine" ||
      !outboxCase.stateTransitions
    ) {
      throw new Error("Outbox case must have a state-machine visual diagram");
    }

    expect(
      outboxCase.visualDiagram.transitions.map(({ from, to }) => ({
        from,
        to,
      })),
    ).toEqual(
      outboxCase.stateTransitions.map(({ from, to }) => ({ from, to })),
    );
  });

  it("renders a TSX visual diagram before the flow detail table", () => {
    const diagramSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-case-diagram.tsx"),
      "utf8",
    );
    const visualSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-case-visual-diagram.tsx"),
      "utf8",
    );

    expect(diagramSource).toContain("흐름 세부");
    expect(diagramSource).toContain("<table");
    expect(diagramSource).toContain("PortfolioCaseVisualDiagram");
    expect(visualSource).toContain("한눈에 보는 구조");
    expect(visualSource).toContain("<figure");
    expect(visualSource).toContain("<figcaption");
    expect(visualSource).toContain("aria-label");

    for (const forbidden of [
      ".png",
      ".jpg",
      "<img",
      "next/image",
      "gradient",
    ]) {
      expect(visualSource).not.toContain(forbidden);
    }
  });

  it("keeps visual diagram numbering decorative and marker groups semantic", () => {
    const visualSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-case-visual-diagram.tsx"),
      "utf8",
    );

    expect(visualSource).toContain('role="list"');
    expect(visualSource).toContain("data-step");
    expect(visualSource).toContain("before:content-[attr(data-step)]");
    expect(visualSource).toContain('aria-hidden="true"');
    expect(visualSource).toContain('aria-label="표식"');
    expect(visualSource).not.toContain("{index + 1}");
  });

  it("keeps diagram legend semantic and moves node cards behind details", () => {
    const diagramSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-case-diagram.tsx"),
      "utf8",
    );

    expect(diagramSource).toContain('aria-label="구조도 범례"');
    expect(diagramSource).toContain("<details");
    expect(diagramSource).toContain("<summary");
    expect(diagramSource).toContain("구성 요소 설명");
    expect(diagramSource).toContain("흐름 세부");
  });

  it("can resolve every published case by slug", () => {
    for (const portfolioCase of featuredPortfolioCases) {
      expect(getPortfolioCaseBySlug(portfolioCase.slug)).toEqual(portfolioCase);
    }
  });
});
