import { readFileSync } from "node:fs";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  featuredProjectGroups,
  featuredPortfolioCases,
  featuredPortfolioProjectSlugs,
  getFeaturedPortfolioProjectGroups,
  getPortfolioCaseProjectBadge,
  getSupportingProjects,
  getPortfolioCasesByProjectSlug,
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

  it("keeps four representative projects expanded into five deep-dive cases", () => {
    const firstConcertCase = getPortfolioCaseBySlug(
      "concert-seat-overselling-consistency",
    );
    const secondConcertCase = getPortfolioCaseBySlug(
      "concert-outbox-dlt-recovery",
    );
    const projectGroups = getFeaturedPortfolioProjectGroups();

    expect(featuredPortfolioProjectSlugs).toHaveLength(4);
    expect(featuredPortfolioCases).toHaveLength(5);
    expect(getPortfolioCasesByProjectSlug("concert-booking")).toHaveLength(2);
    expect(firstConcertCase?.title).toContain("Queue Token");
    expect(firstConcertCase?.title).not.toContain("Outbox");
    expect(firstConcertCase?.resumeLine).not.toContain("Outbox");
    expect(secondConcertCase?.title).toContain("Outbox");
    expect(secondConcertCase?.title).toContain("DLT");
    expect(getPortfolioCaseProjectBadge(firstConcertCase!)).toBe(
      "Concert Booking · Deep Dive 1/2",
    );
    expect(getPortfolioCaseProjectBadge(secondConcertCase!)).toBe(
      "Concert Booking · Deep Dive 2/2",
    );
    expect(projectGroups).toHaveLength(4);
    expect(featuredProjectGroups).toHaveLength(4);
    expect(
      projectGroups.find((group) => group.project.slug === "concert-booking")
        ?.cases,
    ).toEqual([firstConcertCase, secondConcertCase]);
    expect(
      projectGroups.find((group) => group.projectSlug === "concert-booking")
        ?.caseSlugs,
    ).toEqual([
      "concert-seat-overselling-consistency",
      "concert-outbox-dlt-recovery",
    ]);
    for (const group of projectGroups.filter(
      (item) => item.projectSlug !== "concert-booking",
    )) {
      expect(group.caseSlugs).toHaveLength(1);
    }
    for (const group of projectGroups) {
      expect(group.primaryEvidence.length).toBeGreaterThan(0);
      expect(group.techStack).toEqual(group.project.primaryTechStack);
      expect(group.repoUrl).toBe(group.project.repoUrl);
    }
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
      expect(portfolioCase.architectureSummary).toBeDefined();
      expect(
        portfolioCase.architectureSummary.sourceOfTruth ??
          portfolioCase.architectureSummary.designReason,
      ).toBeTruthy();
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
        expect(group.label).not.toContain("추가 측정 예정");
        expect(group.label.toLowerCase()).not.toContain("pending");
        expect(group.value).not.toBe("");
        expect(group.value).not.toContain("추가 기입 예정");
        expect(group.value).not.toContain("TBD");
        expect(group.value).not.toContain("추가 측정 예정");
        expect(group.value.toLowerCase()).not.toContain("pending");
      }

      for (const item of portfolioCase.measurement?.executionEnvironment ??
        []) {
        expect(item.value).not.toBe("");
        expect(item.value).not.toContain("추가 기입 예정");
        expect(item.value).not.toContain("TBD");
      }
    }
  });

  it("keeps final data-source terminology consistent across public case content", () => {
    const publicCaseSources = [
      "src/content/portfolio-cases.ts",
      "src/content/architecture-diagrams.ts",
      "src/content/case-studies/concert-booking.mdx",
      "src/content/case-studies/realtime-chat.mdx",
      "src/content/case-studies/ai-usage-billing-gateway.mdx",
      "src/content/case-studies/msa-shop.mdx",
    ]
      .map((file) => readFileSync(join(process.cwd(), file), "utf8"))
      .join("\n");

    for (const legacyTerm of [
      ["source", " of", " truth"].join(""),
      "최종 진실 원천",
      "최종 복구 기준",
      "최종 기준으로",
      "producer timestamp",
    ]) {
      expect(publicCaseSources).not.toContain(legacyTerm);
    }
    expect(publicCaseSources).toContain("최종 기준 데이터");
  });

  it("connects the Outbox/DLT case to the measured mixed-load scenario without inventing execution environment", () => {
    const outboxCase = getPortfolioCaseBySlug("concert-outbox-dlt-recovery");

    expect(outboxCase?.measurement?.scenarios).toEqual(
      expect.arrayContaining([
        {
          label: "혼합 부하 시나리오",
          value: "200 VU, 45초 기준 총 RPS 약 969~1,005",
        },
        {
          label: "결제/만료 race·중복 요청·대기열 abuse 검증 조건",
          value:
            "pessimistic/optimistic/distributed 전략 x scenario-d/e/f x 3회 local repeat",
        },
      ]),
    );
    expect(outboxCase?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "결제/만료 race·중복 요청·대기열 abuse 검증",
          status: "verified",
          value:
            "D/E/F local repeat: 결제/만료 race, idempotency replay/conflict, 대기열 token abuse checks passed",
        }),
      ]),
    );
    expect(outboxCase?.measurement?.executionEnvironment).toBeUndefined();
  });

  it("keeps the BorrowMe resume line compact while preserving detailed guards in the case body", () => {
    const borrowMeCase = getPortfolioCaseBySlug(
      "borrowme-product-list-n-plus-one",
    );

    expect(borrowMeCase?.resumeLine).toBe(
      "BorrowMe 상품 목록 조회 N+1 개선 원본 기록과 현재 clean repeat3 snapshot을 분리하고, query-count guard와 예약 정합성 테스트로 회귀를 검증했습니다.",
    );
    expect(borrowMeCase?.resumeLine).not.toContain("Flyway baseline");
    expect(borrowMeCase?.result.join(" ")).toContain(
      "Flyway baseline schema validation",
    );
  });

  it("keeps measured scenario labels explicit without adding execution environment guesses", () => {
    expect(
      getPortfolioCaseBySlug("concert-seat-overselling-consistency")
        ?.measurement?.scenarios,
    ).toEqual(
      expect.arrayContaining([
        {
          label: "동일 좌석 경합 측정 조건",
          value:
            "동일 좌석 100 concurrent requests -> success 1, fail 99, overselling 0",
        },
        {
          label: "분산 좌석 예약 측정 조건",
          value:
            "서로 다른 좌석 50명 동시 예약 -> pessimistic 50/50, Redis distributed lock 50/50",
        },
      ]),
    );
    expect(
      getPortfolioCaseBySlug("chat-room-n-plus-one-rps")?.measurement
        ?.scenarios,
    ).toEqual(
      expect.arrayContaining([
        {
          label: "채팅방 조회 API RPS/p95 개선 조건",
          value: "RPS 937 -> 1,598, p95 212.85ms -> 149.22ms",
        },
        {
          label: "채팅방 조회 N+1 제거 쿼리 수 변화",
          value: "2N+1 queries -> 1 query",
        },
        {
          label: "메시지 전달 로컬 스냅샷",
          value:
            "50-user repeat3 p95 23-38ms, 500-user repeat3 p95 37-47ms, 1,000-user repeat3 p95 45-50ms",
        },
        {
          label: "WebSocket 전달 완전성 로컬 스냅샷",
          value:
            "50-user repeat3 expected 4,900 / unique 4,900, 500-user repeat3 expected 49,900 / unique 49,900, 1,000-user repeat3 expected 99,900 / unique 99,900, missing 0 / duplicate 0 / completeness 100%",
        },
        {
          label: "Room-global ordering 로컬 진단",
          value:
            "1,000-user repeat3 persisted message id 기준 room-global out-of-order 0",
        },
        {
          label: "Mixed traffic local scenario",
          value:
            "10 rooms x 50 users repeat3 + mixed HTTP probes: unique 4,900/4,900, missing 0, duplicate 0, receiver p95 18-20ms, mixed HTTP failed 0/30/run",
        },
        {
          label: "Room별 delivery matrix guard",
          value:
            "summary.byRoom denominator + cross-room unexpected delivery deterministic fixture",
        },
      ]),
    );
    for (const slug of [
      "concert-seat-overselling-consistency",
      "chat-room-n-plus-one-rps",
    ]) {
      expect(
        getPortfolioCaseBySlug(slug)?.measurement?.executionEnvironment,
      ).toBeUndefined();
    }

    expect(
      getPortfolioCaseBySlug("billing-idempotency-webhook-ledger")?.measurement,
    ).toBeUndefined();
    expect(
      getPortfolioCaseBySlug("borrowme-product-list-n-plus-one")?.measurement
        ?.scenarios,
    ).toEqual(
      expect.arrayContaining([
        {
          label: "상품 목록 p95 원본 기록",
          value: "참고 기록 · raw artifact 없음 · 현재 재측정 claim 아님",
        },
        {
          label: "상품 목록 현재 재측정 snapshot",
          value:
            "p95 358.1088ms · HTTP failure 0 · checks 10,683/10,683 (local)",
        },
        {
          label: "상품 목록 쿼리 수 원본 기록 + 현재 guard",
          value:
            "원본 README 기록 201 queries + 현재 repository guard 3 queries 이하",
        },
        {
          label: "Follow lookup query-count guard",
          value:
            "FollowService.getFollowedUserIds 후보 사용자 팔로우 조회 SQL 1회",
        },
        {
          label: "Authenticated product-list follow-aware guard",
          value:
            "인증 GET /api/products 응답에서 팔로우 여부 true/false와 SQL 5회 이하",
        },
        {
          label: "Ranking data path query-count guard",
          value: "상위 사용자, 최근 상품, 팔로우 여부 조회 조합 SQL 5회 이하",
        },
        {
          label: "Exercise hashtag query-count guard",
          value: "운동 추천/검색 응답의 exercise hashtag DTO 변환 SQL 1회",
        },
        {
          label: "Flyway baseline validation",
          value:
            "V1 baseline schema migration + MySQL Testcontainers + Hibernate validate",
        },
      ]),
    );
    expect(
      getPortfolioCaseBySlug("borrowme-product-list-n-plus-one")?.evidence,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Flyway baseline validation",
          status: "verified",
        }),
        expect.objectContaining({
          label: "Follow lookup query-count guard",
          status: "verified",
        }),
        expect.objectContaining({
          label: "Authenticated product-list follow-aware guard",
          status: "verified",
        }),
        expect.objectContaining({
          label: "Ranking data path query-count guard",
          status: "verified",
        }),
        expect.objectContaining({
          label: "Exercise hashtag query-count guard",
          status: "verified",
        }),
      ]),
    );
    expect(
      getPortfolioCaseBySlug("borrowme-product-list-n-plus-one")?.measurement
        ?.executionEnvironment,
    ).toBeUndefined();
  });

  it("keeps BorrowMe original performance records clearly caveated", () => {
    const borrowMeCase = getPortfolioCaseBySlug(
      "borrowme-product-list-n-plus-one",
    );

    expect(borrowMeCase?.title).toContain("원본 기록");
    expect(borrowMeCase?.resumeLine).toContain("원본 기록");
    expect(borrowMeCase?.resumeLine).toContain("현재 clean repeat3 snapshot");
    expect(JSON.stringify(borrowMeCase)).toContain("현재 query-count guard");
    expect(JSON.stringify(borrowMeCase)).toContain("현재 guard");
    expect(JSON.stringify(borrowMeCase)).toContain("원본 기록");
    expect(JSON.stringify(borrowMeCase)).toContain(
      "참고 기록 · raw artifact 없음",
    );
    expect(JSON.stringify(borrowMeCase)).not.toContain(
      "상품 목록 p95 응답 시간을 1,010ms에서 23ms로 개선했습니다.",
    );
  });

  it("preserves legacy case study URLs as aliases", () => {
    expect(legacyCaseStudyAliases).toMatchObject({
      "concert-booking": "concert-seat-overselling-consistency",
      "realtime-chat": "chat-room-n-plus-one-rps",
      "ai-usage-billing-gateway": "billing-idempotency-webhook-ledger",
      "msa-shop": "/projects#msa-shop",
    });
  });

  it("uses home for four project summaries and case index for five deep-dive choices", () => {
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
    expect(homeSource).toContain('title="대표 프로젝트 4개"');
    expect(homeSource).toContain("featuredProjectGroups");
    expect(homeSource).not.toContain("{featuredPortfolioCases.map(");
    expect(homeSource).not.toContain("priority={index === 0}");
    expect(homeSource).toContain("validationMethodText");
    expect(homeSource).toContain("검증 기준 보기");
    expect(homeSource).toContain("publishedBlogTopics");
    expect(homeSource).toContain("redis-queue-lock-presence-reconciliation");
    expect(homeSource).not.toContain("FocusCard");
    expect(homeSource).not.toContain("proofItems");
    expect(homeSource).not.toContain("<ProjectRow");
    expect(caseIndexSource).toContain('title="문제 해결 Deep Dive 5개"');
    expect(caseIndexSource).toContain("featuredPortfolioCases.map");
    expect(caseIndexSource).not.toContain("PortfolioProjectGroupCard");
    expect(caseIndexSource).not.toContain("featuredProjectGroups");
    expect(caseIndexSource).not.toContain("priority={index === 0}");
    expect(caseIndexSource).toContain("portfolioCase.evidence.find");
    expect(caseIndexSource).toContain('status === "measured"');
    expect(caseIndexSource).toContain(
      "5개 문제 해결 deep dive를 고르는 목록입니다.",
    );
    expect(sitemapSource).toContain("featuredPortfolioCases");
  });

  it("shows deep-dive badges and grouped project/resume views for duplicate project cases", () => {
    const groupCardSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-project-group-card.tsx"),
      "utf8",
    );
    const portfolioCaseSource = readFileSync(
      join(process.cwd(), "src/content/portfolio-cases.ts"),
      "utf8",
    );
    const projectSource = readFileSync(
      join(process.cwd(), "src/app/projects/page.tsx"),
      "utf8",
    );
    const resumeSource = readFileSync(
      join(process.cwd(), "src/app/resume/page.tsx"),
      "utf8",
    );

    expect(groupCardSource).toContain("Deep Dive");
    expect(groupCardSource).toContain("group.primaryEvidence");
    expect(groupCardSource).toContain("getHomeEvidencePreview");
    expect(groupCardSource).toContain("group.primaryEvidence.slice(0, 1)");
    expect(groupCardSource).toContain('"상품 목록 현재 재측정 snapshot"');
    expect(groupCardSource).not.toContain("group.description");
    expect(groupCardSource).not.toContain("caseLink.summary");
    expect(groupCardSource).toContain("caseLink.actionLabel");
    expect(groupCardSource).not.toContain("priority");
    expect(groupCardSource).not.toContain("md:col-span-2");
    expect(portfolioCaseSource).toContain("Deep Dive");
    expect(portfolioCaseSource).toContain("featuredProjectGroups");
    expect(portfolioCaseSource).toContain("좌석 오버셀링 0건 검증");
    expect(portfolioCaseSource).toContain("Outbox/DLT 이벤트 복구");
    expect(projectSource).toContain("featuredProjectGroups");
    expect(projectSource).toContain("caseLinks.map");
    expect(projectSource).toContain("caseLink.label");
    expect(resumeSource).toContain("getFeaturedPortfolioProjectGroups");
    expect(resumeSource).toContain("<ul");
    expect(resumeSource).toContain("resumeLine");
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
    expect(diagramSource).toContain("<details");
    expect(diagramSource).toContain("<summary");
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

  it("requires every featured portfolio case to expose SVG problem architecture metadata", () => {
    const forbiddenArchitectureExtensions = /\.(png|jpe?g|webp)$/i;

    for (const portfolioCase of featuredPortfolioCases) {
      expect(portfolioCase.problemArchitecture).toBeDefined();
      expect(portfolioCase.problemArchitecture?.imageSrc).toMatch(
        /^\/architecture\/cases\/.+\.svg$/,
      );
      expect(portfolioCase.problemArchitecture?.imageSrc).not.toMatch(
        forbiddenArchitectureExtensions,
      );
      expect(portfolioCase.problemArchitecture?.alt.trim()).toBeTruthy();
      expect(portfolioCase.problemArchitecture?.caption.trim()).toBeTruthy();
      expect(
        portfolioCase.problemArchitecture?.readingGuide.length,
      ).toBeGreaterThan(0);

      const publicPath = portfolioCase.problemArchitecture?.imageSrc.replace(
        /^\//,
        "",
      );

      expect(existsSync(join(process.cwd(), "public", publicPath ?? ""))).toBe(
        true,
      );
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

  it("keeps TSX visual diagram data while case details render the SVG architecture first", () => {
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
    expect(diagramSource).toContain("ArchitectureFigure");
    expect(diagramSource).not.toContain("PortfolioCaseVisualDiagram");
    expect(visualSource).toContain("한눈에 보는 아키텍처");
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

  it("renders SVG architecture figure before the reading guide and flow detail table", () => {
    const diagramSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-case-diagram.tsx"),
      "utf8",
    );
    const figureSource = readFileSync(
      join(
        process.cwd(),
        "src/components/architecture/architecture-figure.tsx",
      ),
      "utf8",
    );

    expect(diagramSource).toContain("문제 구간 아키텍처");
    expect(diagramSource).toContain("ArchitectureFigure");
    expect(diagramSource.indexOf("ArchitectureFigure")).toBeLessThan(
      diagramSource.indexOf("그림 읽는 법"),
    );
    expect(diagramSource.indexOf("그림 읽는 법")).toBeLessThan(
      diagramSource.indexOf("아키텍처 판단 요약"),
    );
    expect(diagramSource.indexOf("<ArchitectureSummary")).toBeLessThan(
      diagramSource.indexOf("흐름 세부"),
    );
    expect(diagramSource.indexOf("흐름 세부")).toBeLessThan(
      diagramSource.indexOf("구성 요소 설명"),
    );
    expect(figureSource).toContain("<img");
    expect(figureSource).toContain("overflow-x-auto");
    expect(figureSource).toContain("min-w");
    expect(figureSource).toContain("<figcaption");
    expect(figureSource).not.toContain("next/image");
  });

  it("keeps detail pages focused before exposing deeper implementation sections", () => {
    const articleSource = readFileSync(
      join(process.cwd(), "src/components/case-study-article.tsx"),
      "utf8",
    );
    const diagramSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-case-diagram.tsx"),
      "utf8",
    );

    expect(articleSource.indexOf('SummaryBlock title="문제"')).toBeLessThan(
      articleSource.indexOf("<EvidenceSection"),
    );
    expect(articleSource).toContain('<ContentSection title="검증 근거">');
    expect(articleSource).toContain(
      '<FoldedContentSection title="측정 시나리오" nested>',
    );
    expect(articleSource).toContain('<FoldedContentSection title="상세 구현">');
    expect(articleSource).toContain(
      '<FoldedSidebarSection title="예상 면접 질문">',
    );
    expect(articleSource).toContain(
      '<FoldedContentSection title="Outbox 상태 전이">',
    );
    expect(articleSource.indexOf("<EvidenceSection")).toBeLessThan(
      articleSource.indexOf("<PortfolioCaseDiagramDetails"),
    );
    expect(articleSource.indexOf('SummaryBlock title="결과"')).toBeLessThan(
      articleSource.indexOf("<PortfolioCaseDiagramDetails"),
    );
    expect(diagramSource.indexOf("<ArchitectureSummary")).toBeLessThan(
      diagramSource.indexOf("흐름 세부"),
    );
    expect(diagramSource).toContain("<details");
    expect(diagramSource).toContain("흐름 세부");
    expect(diagramSource).toContain("구성 요소 설명");
  });

  it("documents the portfolio overall architecture SVG in README", () => {
    const readmeSource = readFileSync(join(process.cwd(), "README.md"), "utf8");

    expect(readmeSource).toContain(
      "![new-portfolio 콘텐츠 아키텍처](public/architecture/overall/new-portfolio.svg)",
    );
    expect(
      existsSync(
        join(process.cwd(), "public/architecture/overall/new-portfolio.svg"),
      ),
    ).toBe(true);
  });

  it("keeps visual diagram numbering decorative and marker groups semantic", () => {
    const visualSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-case-visual-diagram.tsx"),
      "utf8",
    );

    expect(visualSource).toContain('role="list"');
    expect(visualSource).toContain("list-none");
    expect(visualSource).toContain("·");
    expect(visualSource).toContain('aria-label="표식"');
    expect(visualSource).not.toContain("data-step");
    expect(visualSource).not.toContain("before:content-[attr(data-step)]");
    expect(visualSource).not.toContain("getStep");
  });

  it("keeps diagram legend semantic and moves node cards behind details", () => {
    const diagramSource = readFileSync(
      join(process.cwd(), "src/components/portfolio-case-diagram.tsx"),
      "utf8",
    );

    expect(diagramSource).toContain("문제 구간 아키텍처");
    expect(diagramSource).toContain("아키텍처 판단 요약");
    expect(diagramSource).toContain('aria-label="구조도 범례"');
    expect(diagramSource).toContain("·");
    expect(diagramSource).toContain("<details");
    expect(diagramSource).toContain("<summary");
    expect(diagramSource).toContain("구성 요소 설명");
    expect(diagramSource).toContain("흐름 세부");
  });

  it("shows compact project-level architecture summaries on projects page", () => {
    const projectSource = readFileSync(
      join(process.cwd(), "src/app/projects/page.tsx"),
      "utf8",
    );

    expect(projectSource).toContain("전체 아키텍처 요약");
    for (const slug of [
      "concert-booking",
      "realtime-chat",
      "ai-usage-billing-gateway",
      "borrow-me",
    ]) {
      expect(projectSource).toContain(slug);
    }
    expect(projectSource).not.toContain('"msa-shop"');
  });

  it("can resolve every published case by slug", () => {
    for (const portfolioCase of featuredPortfolioCases) {
      expect(getPortfolioCaseBySlug(portfolioCase.slug)).toEqual(portfolioCase);
    }
  });
});
