import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

import { blogTopics } from "./blog";
import { navigationItems, profile } from "./profile";
import {
  additionalProjects,
  archiveProjects,
  featuredProjects,
  getEvidencePreview,
  projectOverallArchitectures,
  projects,
} from "./projects";

const disallowedConceptExamples = [
  "url-shortener",
  "notification-service",
  "file-service",
  "idempotency-library",
  "outbox-starter",
];

const bannedSubmissionPhrases = [
  "README 기준 미표기",
  "제공된 범위",
  "카드로 배치",
  "메인 사례",
  "양보",
  "Email 미설정",
  "PDF 준비 중",
  "Not claimed",
  "보강 필요",
  "실무 준비도를 부풀리지 않습니다",
  "실제 운영 경험처럼 보이지 않게",
  "pending으로",
  "measured로",
];

const sourceFilesWithPublicCopy = [
  "src/content/projects.ts",
  "src/content/profile.ts",
  "README.md",
  "src/app/page.tsx",
  "src/app/case-studies/page.tsx",
  "src/app/projects/page.tsx",
  "src/app/about/page.tsx",
  "src/app/resume/page.tsx",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/sitemap.ts",
  "src/components/architecture-diagram/index.tsx",
  "src/components/case-study-article.tsx",
  "src/components/portfolio-case-card.tsx",
  "src/components/portfolio-case-diagram.tsx",
  "src/components/evidence-matrix.tsx",
  "src/content/portfolio-cases.ts",
  "src/content/architecture-diagrams.ts",
  "src/content/blog.ts",
  "src/content/case-studies/concert-booking.mdx",
  "src/content/case-studies/realtime-chat.mdx",
  "src/content/case-studies/ai-usage-billing-gateway.mdx",
  "src/content/case-studies/msa-shop.mdx",
];

const legacyPublicStrings = [
  ["Hot", " Seat", " Contention"].join(""),
  ["Chat room", " API RPS"].join(""),
  ["Usage", " idempotency"].join(""),
  ["k6 mixed", " usage scenario"].join(""),
  ["SAGA", " compensation flow"].join(""),
  ["RabbitMQ", " event flow"].join(""),
  ["Gateway", " boundary"].join(""),
  ["재처리", " 재처리"].join(""),
  ["보상", " 보상"].join(""),
  ["재시도", " 재시도"].join(""),
  ["source", " of", " truth"].join(""),
  "최종 진실 원천",
  "최종 복구 기준",
];

describe("portfolio project content", () => {
  it("keeps only project records with active top-level project weight as featured", () => {
    expect(featuredProjects).toHaveLength(4);
    expect(featuredProjects.map((project) => project.slug)).toEqual([
      "concert-booking",
      "realtime-chat",
      "ai-usage-billing-gateway",
      "borrow-me",
    ]);
  });

  it("groups the remaining real projects as additional or archive", () => {
    expect(additionalProjects.map((project) => project.slug)).toEqual([
      "msa-shop",
      "timedeal-service",
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
        expect(["measured", "verified", "pending"]).toContain(evidence.status);
        expect(evidence.label.length).toBeGreaterThan(0);
        expect(evidence.value.length).toBeGreaterThan(0);
      }
    }
  });

  it("has submission-ready contact and hides blog navigation until a post is published", () => {
    const hasPublishedBlogPost = blogTopics.some(
      (topic) => topic.status === "published",
    );

    expect(profile.name).toBe("성진혁");
    expect(profile.email).toBe("jinhyuk9714@gmail.com");
    expect(
      navigationItems.some((item) => (item.href as string) === "/blog"),
    ).toBe(hasPublishedBlogPost);
  });

  it("routes case study navigation to the index instead of a single project", () => {
    expect(navigationItems).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          href: "/case-studies",
          label: "문제 해결 사례",
        }),
      ]),
    );
    expect(
      navigationItems.some(
        (item) => (item.href as string) === "/case-studies/concert-booking",
      ),
    ).toBe(false);
  });

  it("keeps unpublished writing off the homepage", () => {
    const homeSource = readFileSync(
      join(process.cwd(), "src/app/page.tsx"),
      "utf8",
    );
    const hasPublishedBlogPost = blogTopics.some(
      (topic) => topic.status === "published",
    );

    if (!hasPublishedBlogPost) {
      expect(homeSource).not.toContain("Writing Queue");
      expect(homeSource).not.toContain("blogTopics");
    }
    expect(homeSource).toContain("핵심 검증 근거");
    expect(homeSource).toContain(
      "이 포트폴리오는 이력서에 한 줄로 압축한 문제 해결 경험을 구조도, 문제 원인, 해결 과정, 검증 결과로 확장한 문서입니다.",
    );
    expect(homeSource).toContain('title="대표 프로젝트 4개"');
    expect(homeSource).toContain("featuredProjectGroups");
    expect(homeSource).not.toContain("{featuredPortfolioCases.map(");
    expect(homeSource).toContain('evidenceLabel: "동일 좌석 경합"');
    expect(homeSource).toContain('evidenceLabel: "채팅방 조회 API RPS"');
    expect(homeSource).toContain('evidenceLabel: "사용량 중복 처리"');
  });

  it("ships the Redis article only as a real published article", () => {
    const blogSource = readFileSync(
      join(process.cwd(), "src/content/blog.ts"),
      "utf8",
    );
    const blogPageSource = readFileSync(
      join(process.cwd(), "src/app/blog/page.tsx"),
      "utf8",
    );
    const blogDetailSource = readFileSync(
      join(process.cwd(), "src/app/blog/[slug]/page.tsx"),
      "utf8",
    );
    const redisTopic = blogTopics.find((topic) =>
      topic.title.startsWith("Redis를 캐시로만 쓰지 않기 위해"),
    );

    expect(redisTopic?.slug).toBe("redis-queue-lock-presence-reconciliation");
    expect(redisTopic?.status).toBe("published");
    if (!redisTopic || redisTopic.status !== "published") {
      throw new Error("Redis article must be published before exposure");
    }
    expect(redisTopic.sections.length).toBeGreaterThanOrEqual(4);
    expect(JSON.stringify(redisTopic)).toContain("최종 기준 데이터");
    expect(JSON.stringify(redisTopic)).toContain("Redis distributed lock");
    expect(JSON.stringify(redisTopic)).toContain("50/50");
    for (const requiredConcept of [
      "대기열",
      "분산 락",
      "presence",
      "reconciliation",
      "운영 성능 주장은 별도로 하지 않습니다",
    ]) {
      expect(JSON.stringify(redisTopic)).toContain(requiredConcept);
    }
    expect(JSON.stringify(redisTopic)).not.toContain("추가 기입 예정");
    expect(blogSource).toContain("publishedAt");
    expect(blogPageSource).toContain("publishedBlogTopics");
    expect(blogPageSource).toContain("comingSoonBlogTopics");
    expect(blogPageSource).not.toContain("작성 예정 글");
    expect(blogDetailSource).toContain("getBlogTopicBySlug");
    expect(blogDetailSource).not.toContain("lorem");
    expect(blogSource).toContain('status: "published"');
    expect(blogSource).toContain("sections:");
  });

  it("keeps raw feedback artifacts out of tracked/public files", () => {
    const gitignoreSource = readFileSync(
      join(process.cwd(), ".gitignore"),
      "utf8",
    );
    const trackedFiles = execFileSync("git", ["ls-files"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });

    expect(gitignoreSource).toContain("fb*.txt");
    expect(gitignoreSource).toContain("feedback.md");
    expect(trackedFiles).not.toMatch(/(^|\/)feedback\.md$/m);
    expect(trackedFiles).not.toMatch(/(^|\/)fb[0-9]+\.txt$/m);
    expect(trackedFiles).not.toMatch(/^public\/fb[0-9]+\.txt$/m);
  });

  it("keeps project cards structured for a 30-second technical scan", () => {
    const projectCardSource = readFileSync(
      join(process.cwd(), "src/components/project-card.tsx"),
      "utf8",
    );

    expect(projectCardSource).toContain('LabeledText label="문제"');
    expect(projectCardSource).toContain('LabeledText label="설계"');
    expect(projectCardSource).toContain('LabeledText label="결과"');
    expect(projectCardSource).toContain("근거");
    expect(projectCardSource).toContain("evidence.value");
    expect(projectCardSource).toContain("대표 1순위");
    expect(projectCardSource).toContain("primaryTechStack");
    expect(projectCardSource).not.toContain("!compact");
  });

  it("exposes SVG overall architecture thumbnails only for selected project cards", () => {
    const expectedProjectSlugs = [
      "concert-booking",
      "realtime-chat",
      "ai-usage-billing-gateway",
      "borrow-me",
    ];
    const forbiddenArchitectureExtensions = /\.(png|jpe?g|webp)$/i;

    expect(projectOverallArchitectures.map((item) => item.projectSlug)).toEqual(
      expectedProjectSlugs,
    );

    for (const architecture of projectOverallArchitectures) {
      expect(architecture.imageSrc).toMatch(
        /^\/architecture\/overall\/.+\.svg$/,
      );
      expect(architecture.imageSrc).not.toMatch(
        forbiddenArchitectureExtensions,
      );
      expect(architecture.alt.trim()).toBeTruthy();
      expect(architecture.caption.trim()).toBeTruthy();

      expect(
        existsSync(
          join(
            process.cwd(),
            "public",
            architecture.imageSrc.replace(/^\//, ""),
          ),
        ),
      ).toBe(true);
    }
  });

  it("renders case study detail as article plus sticky evidence sidebar", () => {
    const caseStudySource = readFileSync(
      join(process.cwd(), "src/components/case-study-article.tsx"),
      "utf8",
    );

    expect(caseStudySource).toContain("lg:sticky");
    expect(caseStudySource).toContain("검증 근거 / 측정 정보");
    expect(caseStudySource).toContain("기술 스택");
    expect(caseStudySource).toContain("한계와 다음 검증");
    expect(caseStudySource).toContain("예상 면접 질문");
    expect(caseStudySource).toContain("GitHub 저장소");
    expect(caseStudySource).not.toContain('SidebarSection title="근거"');
    expect(caseStudySource).not.toContain('SidebarSection title="측정 환경"');
    expect(caseStudySource).not.toContain(
      'ContentSection title="한계와 다음 검증"',
    );
    expect(caseStudySource).not.toContain(
      'ContentSection title="예상 면접 질문"',
    );
  });

  it("keeps evidence status enums internal while rendering Korean badge labels", () => {
    const statusBadgeSource = readFileSync(
      join(process.cwd(), "src/components/status-badge.tsx"),
      "utf8",
    );
    const evidenceMatrixSource = readFileSync(
      join(process.cwd(), "src/components/evidence-matrix.tsx"),
      "utf8",
    );

    expect(statusBadgeSource).toContain('measured: "측정 완료"');
    expect(statusBadgeSource).toContain('verified: "시나리오 검증"');
    expect(statusBadgeSource).toContain('pending: "추가 측정 예정"');
    expect(evidenceMatrixSource).toContain("측정 완료");
    expect(evidenceMatrixSource).toContain("시나리오 검증");
    expect(evidenceMatrixSource).toContain("추가 측정 예정");
    expect(evidenceMatrixSource).not.toContain('"status": "measured"');
    expect(evidenceMatrixSource).not.toContain("<code");
  });

  it("uses the final Korean evidence labels for submission-facing project data", () => {
    const evidenceLabels = projects.flatMap((project) =>
      project.evidence.map((evidence) => evidence.label),
    );

    expect(evidenceLabels).toEqual(
      expect.arrayContaining([
        "동일 좌석 경합",
        "혼합 부하 테스트",
        "결제/만료 race·중복 요청·대기열 abuse 검증",
        "Prometheus actuator metric contract",
        "Local monitoring evidence harness",
        "채팅방 조회 API RPS",
        "메시지 전달 지연 시간 로컬 스냅샷",
        "WebSocket 전달 완전성 로컬 스냅샷",
        "Receiver matrix by-room guard",
        "Mixed HTTP probe artifact 분리 검산",
        "Delivery evidence validator",
        "Room-global ordering 로컬 진단",
        "Mixed traffic p95 latency",
        "Production delivery benchmark",
        "Append-only Ledger 불변성",
        "Full mixed smoke readiness guard",
        "Full mixed capture rollup guard",
        "Low-cardinality outcome counters",
        "Audit metadata sanitizer",
        "운영 성능 주장",
        "SAGA 보상 흐름",
        "RabbitMQ 이벤트 흐름",
        "Gateway 접근 경계",
        "Follow lookup query-count guard",
        "Ranking HTTP model assembly guard",
        "Exercise hashtag query-count guard",
        "상품 목록 현재 재측정 snapshot",
        "Flyway baseline validation",
      ]),
    );
  });

  it("hides the resume PDF button unless the submission PDF filename exists", () => {
    const resumeSource = readFileSync(
      join(process.cwd(), "src/app/resume/page.tsx"),
      "utf8",
    );

    expect(resumeSource).toContain("resume-sung-jinhyuk-backend.pdf");
    expect(resumeSource).not.toContain('"public", "resume.pdf"');
  });

  it("keeps README repository topics aligned with backend evidence areas", () => {
    const readmeSource = readFileSync(join(process.cwd(), "README.md"), "utf8");

    expect(readmeSource).toContain("실제 GitHub About topics");

    for (const topic of [
      "redis",
      "kafka",
      "rabbitmq",
      "postgresql",
      "testcontainers",
      "k6",
      "idempotency",
      "outbox-pattern",
      "event-driven",
      "websocket",
    ]) {
      expect(readmeSource).toContain(`\`${topic}\``);
    }
  });

  it("does not expose draft-only or internal strategy phrasing", () => {
    const combinedSource = sourceFilesWithPublicCopy
      .map((file) => readFileSync(join(process.cwd(), file), "utf8"))
      .join("\n");

    for (const phrase of bannedSubmissionPhrases) {
      expect(combinedSource).not.toContain(phrase);
    }
  });

  it("does not expose legacy English labels or duplicated recovery wording", () => {
    const combinedSource = sourceFilesWithPublicCopy
      .map((file) => readFileSync(join(process.cwd(), file), "utf8"))
      .join("\n");

    for (const phrase of legacyPublicStrings) {
      expect(combinedSource).not.toContain(phrase);
    }
  });

  it("does not keep placeholder project periods", () => {
    for (const project of projects) {
      expect(project.period).not.toBe("README 기준 미표기");
    }
  });

  it("requires featured projects to have enough evidence, limits, and interview hooks", () => {
    for (const project of featuredProjects) {
      expect(project.evidence.length).toBeGreaterThanOrEqual(2);
      expect(project.limitations.length).toBeGreaterThanOrEqual(1);
      expect(project.interviewQuestions.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps pending language out of measured evidence", () => {
    const pendingWords = ["pending", "Pending", "예정", "필요", "Not claimed"];

    for (const project of projects) {
      for (const evidence of project.evidence) {
        if (evidence.status !== "measured") {
          continue;
        }

        for (const word of pendingWords) {
          expect(evidence.value).not.toContain(word);
        }
      }
    }
  });

  it("marks known unfinished claims as pending instead of measured", () => {
    const realtime = projects.find(
      (project) => project.slug === "realtime-chat",
    );
    const billing = projects.find(
      (project) => project.slug === "ai-usage-billing-gateway",
    );
    const borrowMe = projects.find((project) => project.slug === "borrow-me");

    expect(billing?.primaryTechStack).not.toContain("Kafka");
    expect(billing?.allTechStack).not.toContain("Kafka");
    expect(billing?.primaryTechStack).toContain("Spring Security");

    expect(realtime?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "메시지 전달 지연 시간 로컬 스냅샷",
          status: "verified",
          value: expect.stringContaining("1,000-user repeat3 p95 45-50ms"),
        }),
        expect.objectContaining({
          label: "WebSocket 전달 완전성 로컬 스냅샷",
          status: "verified",
          value: expect.stringContaining(
            "1,000-user repeat3 expected 99,900 / unique 99,900",
          ),
        }),
        expect.objectContaining({
          label: "Room-global ordering 로컬 진단",
          status: "verified",
          value: expect.stringContaining("out-of-order 0"),
        }),
        expect.objectContaining({
          label: "Receiver matrix by-room guard",
          status: "verified",
          value: expect.stringContaining("summary.byRoom"),
        }),
        expect.objectContaining({
          label: "Mixed HTTP probe artifact 분리 검산",
          status: "verified",
          value: expect.stringContaining("mixedHttp summary"),
        }),
        expect.objectContaining({
          label: "Mixed traffic local scenario",
          status: "verified",
          value: expect.stringContaining("10 rooms x 50 users repeat3"),
        }),
        expect.objectContaining({
          label: "Delivery evidence validator",
          status: "verified",
          value: expect.stringContaining("manifest.json"),
        }),
        expect.objectContaining({
          label: "Mixed traffic p95 latency",
          status: "pending",
          value: expect.stringContaining("production/mixed"),
        }),
        expect.objectContaining({
          label: "Production delivery benchmark",
          status: "pending",
          value: expect.stringContaining("장시간 soak"),
        }),
      ]),
    );

    expect(billing?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "Full mixed smoke readiness guard",
          status: "verified",
          value: expect.stringContaining("K6_REQUIRE_OPTIONAL_PATHS=true"),
        }),
        expect.objectContaining({
          label: "Full mixed capture rollup guard",
          status: "verified",
          value: expect.stringContaining("benchmark aggregate는 만들지 않음"),
        }),
        expect.objectContaining({
          label: "Low-cardinality outcome counters",
          status: "verified",
          value: expect.stringContaining("gateway request/rate-limit"),
        }),
        expect.objectContaining({
          label: "Audit metadata sanitizer",
          status: "verified",
          value: expect.stringContaining("[REDACTED]"),
        }),
        expect.objectContaining({
          label: "혼합 사용량 부하 테스트",
          status: "measured",
          value: expect.stringContaining("local full mixed repeat3"),
        }),
        expect.objectContaining({
          label: "운영 성능 주장",
          status: "pending",
          value: expect.stringContaining("추가 측정 예정"),
        }),
      ]),
    );
    expect(JSON.stringify(billing)).not.toContain("30.38ms");
    expect(JSON.stringify(billing)).not.toContain("측정 완료");

    expect(borrowMe?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "상품 목록 p95 원본 기록",
          status: "pending",
        }),
        expect.objectContaining({
          label: "상품 목록 현재 재측정 snapshot",
          status: "measured",
          value: expect.stringContaining("p95 358.1088ms"),
        }),
        expect.objectContaining({
          label: "상품 목록 쿼리 수 원본 기록 + 현재 guard",
          status: "verified",
        }),
        expect.objectContaining({
          label: "Follow lookup query-count guard",
          status: "verified",
          value: expect.stringContaining("SQL 1회"),
        }),
        expect.objectContaining({
          label: "Authenticated product-list follow-aware guard",
          status: "verified",
          value: expect.stringContaining("SQL 5회 이하"),
        }),
        expect.objectContaining({
          label: "Ranking data path query-count guard",
          status: "verified",
          value: expect.stringContaining("SQL 5회 이하"),
        }),
        expect.objectContaining({
          label: "Ranking HTTP model assembly guard",
          status: "verified",
          value: expect.stringContaining("GET /ranking"),
        }),
        expect.objectContaining({
          label: "Exercise hashtag query-count guard",
          status: "verified",
          value: expect.stringContaining("SQL 1회"),
        }),
        expect.objectContaining({
          label: "Flyway baseline validation",
          status: "verified",
        }),
      ]),
    );
    expect(
      borrowMe?.evidence.filter((evidence) =>
        evidence.label.includes("상품 목록"),
      ),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: expect.stringContaining("현재 재측정 claim 아님"),
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
    const realtime = projects.find(
      (project) => project.slug === "realtime-chat",
    );
    const billing = projects.find(
      (project) => project.slug === "ai-usage-billing-gateway",
    );

    expect(realtime && getEvidencePreview(realtime, 2)).toEqual(
      expect.arrayContaining([expect.objectContaining({ status: "pending" })]),
    );
    expect(billing && getEvidencePreview(billing, 2)).toEqual(
      expect.arrayContaining([expect.objectContaining({ status: "pending" })]),
    );
  });
});
