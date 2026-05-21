import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { blogTopics } from "./blog";
import { navigationItems, profile } from "./profile";
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
  "src/app/sitemap.ts",
  "src/components/architecture-diagram/index.tsx",
  "src/components/case-study-article.tsx",
  "src/components/portfolio-case-card.tsx",
  "src/components/portfolio-case-diagram.tsx",
  "src/components/evidence-matrix.tsx",
  "src/content/portfolio-cases.ts",
  "src/content/architecture-diagrams.ts",
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
];

describe("portfolio project content", () => {
  it("keeps only project records with active top-level project weight as featured", () => {
    expect(featuredProjects.map((project) => project.slug)).toEqual([
      "concert-booking",
      "realtime-chat",
      "ai-usage-billing-gateway",
    ]);
  });

  it("groups the remaining real projects as additional or archive", () => {
    expect(additionalProjects.map((project) => project.slug)).toEqual([
      "msa-shop",
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
    expect(homeSource).toContain("이력서 한 줄을 확장한 문제 해결 포트폴리오");
    expect(homeSource).toContain("featuredPortfolioCases");
    expect(homeSource).toContain('evidenceLabel: "동일 좌석 경합"');
    expect(homeSource).toContain('evidenceLabel: "채팅방 조회 API RPS"');
    expect(homeSource).toContain('evidenceLabel: "사용량 중복 처리"');
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
    expect(projectCardSource).toContain("대표 1순위");
    expect(projectCardSource).toContain("primaryTechStack");
    expect(projectCardSource).not.toContain("!compact");
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
        "채팅방 조회 API RPS",
        "메시지 전달 지연 시간",
        "Append-only Ledger 불변성",
        "운영 성능 주장",
        "SAGA 보상 흐름",
        "RabbitMQ 이벤트 흐름",
        "Gateway 접근 경계",
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

    expect(realtime?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "메시지 전달 지연 시간",
          status: "pending",
        }),
        expect.objectContaining({
          label: "WebSocket 전달 완전성",
          status: "pending",
        }),
      ]),
    );

    expect(billing?.evidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: "혼합 사용량 부하 테스트",
          status: "pending",
        }),
        expect.objectContaining({
          label: "운영 성능 주장",
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
