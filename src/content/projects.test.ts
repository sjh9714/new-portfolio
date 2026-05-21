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
  "src/app/page.tsx",
  "src/app/case-studies/page.tsx",
  "src/app/about/page.tsx",
  "src/app/resume/page.tsx",
  "src/app/sitemap.ts",
  "src/content/case-studies/ai-usage-billing-gateway.mdx",
  "src/content/case-studies/msa-shop.mdx",
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
          label: "Case Studies",
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
    expect(homeSource).toContain("Evidence Snapshot");
  });

  it("keeps project cards structured for a 30-second technical scan", () => {
    const projectCardSource = readFileSync(
      join(process.cwd(), "src/components/project-card.tsx"),
      "utf8",
    );

    expect(projectCardSource).toContain('LabeledText label="Problem"');
    expect(projectCardSource).toContain('LabeledText label="Design"');
    expect(projectCardSource).toContain('LabeledText label="Result"');
    expect(projectCardSource).toContain("Evidence");
    expect(projectCardSource).toContain("primaryTechStack");
    expect(projectCardSource).not.toContain("!compact");
  });

  it("renders case study detail as article plus sticky evidence sidebar", () => {
    const caseStudySource = readFileSync(
      join(process.cwd(), "src/components/case-study-article.tsx"),
      "utf8",
    );

    expect(caseStudySource).toContain("lg:sticky");
    expect(caseStudySource).toContain("Evidence");
    expect(caseStudySource).toContain("Tech Stack");
    expect(caseStudySource).toContain("Limitations");
    expect(caseStudySource).toContain("Interview Questions");
  });

  it("does not expose draft-only or internal strategy phrasing", () => {
    const combinedSource = sourceFilesWithPublicCopy
      .map((file) => readFileSync(join(process.cwd(), file), "utf8"))
      .join("\n");

    for (const phrase of bannedSubmissionPhrases) {
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
