import { BookOpen, ExternalLink, Mail } from "lucide-react";
import Link from "next/link";

import { EvidenceMatrix } from "@/components/evidence-matrix";
import { PortfolioProjectGroupCard } from "@/components/portfolio-project-group-card";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { publishedBlogTopics } from "@/content/blog";
import {
  featuredProjectGroups,
  getSupportingProjects,
} from "@/content/portfolio-cases";
import { additionalProjects, getProjectBySlug } from "@/content/projects";
import { profile } from "@/content/profile";

const snapshotItems = [
  {
    projectSlug: "concert-booking",
    projectName: "Concert Booking",
    evidenceLabel: "동일 좌석 경합",
  },
  {
    projectSlug: "realtime-chat",
    projectName: "Realtime Chat",
    evidenceLabel: "채팅방 조회 API RPS",
  },
  {
    projectSlug: "ai-usage-billing-gateway",
    projectName: "AI Billing",
    evidenceLabel: "사용량 중복 처리",
  },
].map((item) => {
  const project = getProjectBySlug(item.projectSlug);
  const evidence = project?.evidence.find(
    (entry) => entry.label === item.evidenceLabel,
  );

  return {
    ...item,
    evidence,
  };
});

const portfolioPurpose =
  "이 포트폴리오는 이력서에 한 줄로 압축한 문제 해결 경험을 구조도, 문제 원인, 해결 과정, 검증 결과로 확장한 문서입니다.";
const supportingAdditionalProjects = getSupportingProjects(additionalProjects);
const redisArticle = publishedBlogTopics.find(
  (topic) => topic.slug === "redis-queue-lock-presence-reconciliation",
);
const validationMethodText =
  "k6 · Testcontainers · Redis/Kafka/PostgreSQL 정합성 · Outbox/DLT/Idempotency";

export default function Home() {
  return (
    <div className="bg-background">
      <section className="border-border border-b">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:px-8 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="flex max-w-4xl flex-col gap-7">
            <div className="flex flex-col gap-4">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase">
                Java/Spring 백엔드 포트폴리오
              </p>
              <h1 className="text-foreground text-5xl leading-tight font-bold tracking-tight md:text-7xl">
                Java/Spring 백엔드 개발자 성진혁
              </h1>
              <p className="text-muted-foreground max-w-3xl text-xl leading-9">
                {profile.headline}
              </p>
              <p className="text-muted-foreground max-w-3xl text-base leading-7">
                {portfolioPurpose}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/resume">
                  <BookOpen data-icon="inline-start" aria-hidden="true" />웹
                  이력서
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/case-studies">문제 해결 사례</Link>
              </Button>
              <Button asChild variant="outline">
                <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                  <ExternalLink data-icon="inline-start" aria-hidden="true" />
                  GitHub
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`mailto:${profile.email}`}>
                  <Mail data-icon="inline-start" aria-hidden="true" />
                  이메일
                </a>
              </Button>
            </div>
          </div>

          <aside className="border-border bg-card flex flex-col gap-5 border p-5">
            <div className="flex flex-col gap-1">
              <p className="text-primary text-sm font-semibold">
                핵심 검증 근거
              </p>
              <h2 className="text-foreground text-2xl font-semibold tracking-tight">
                대표 사례는 수치와 검증 상태로 먼저 읽힙니다.
              </h2>
            </div>
            <div className="flex flex-col gap-3">
              {snapshotItems.map((item) =>
                item.evidence ? (
                  <div
                    key={`${item.projectSlug}-${item.evidenceLabel}`}
                    className="border-border bg-background flex flex-col gap-2 rounded-md border p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
                          {item.projectName}
                        </p>
                        <h3 className="text-foreground mt-1 font-semibold [overflow-wrap:anywhere]">
                          {item.evidence.label}
                        </h3>
                      </div>
                      <StatusBadge status={item.evidence.status} />
                    </div>
                    <p className="text-muted-foreground text-sm leading-6 [overflow-wrap:anywhere]">
                      {item.evidence.value}
                    </p>
                  </div>
                ) : null,
              )}
            </div>
          </aside>
        </div>

        <div className="mx-auto max-w-7xl px-5 pb-12 md:px-8 md:pb-16">
          <div className="border-border bg-card flex flex-col gap-2 border p-4 md:flex-row md:items-center md:justify-between">
            <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
              검증 방식
            </p>
            <p className="text-foreground text-sm leading-6 [overflow-wrap:anywhere]">
              {validationMethodText}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-5 py-12 md:px-8 md:py-16">
        <section className="flex flex-col gap-6">
          <SectionHeader
            title="대표 프로젝트 4개"
            description="이력서에 압축한 문제 해결 경험을 프로젝트 단위로 묶고, 필요한 경우 별도 deep dive로 확장했습니다. Concert Booking은 동시성 정합성과 이벤트 복구를 각각 별도 문제 구간으로 나눠 설명합니다."
            action={
              <Button asChild variant="ghost">
                <Link href="/case-studies">전체 사례 보기</Link>
              </Button>
            }
          />
          <div className="grid gap-4 md:grid-cols-2">
            {featuredProjectGroups.map((group) => (
              <PortfolioProjectGroupCard
                key={group.projectSlug}
                group={group}
              />
            ))}
          </div>
        </section>

        {redisArticle ? (
          <section className="flex flex-col gap-5">
            <SectionHeader
              title="Redis 글"
              description="대표 사례에서 반복되는 Redis의 역할과 최종 기준 데이터 경계를 한 글로 정리했습니다."
              action={
                <Button asChild variant="ghost">
                  <Link href="/blog">글 목록 보기</Link>
                </Button>
              }
            />
            <article className="border-border bg-card flex flex-col gap-4 border p-5 md:flex-row md:items-start md:justify-between">
              <div className="flex max-w-3xl flex-col gap-2">
                <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
                  {redisArticle.readingTime}
                </p>
                <h2 className="text-foreground text-xl leading-7 font-semibold [overflow-wrap:anywhere]">
                  {redisArticle.title}
                </h2>
                <p className="text-muted-foreground line-clamp-2 text-sm leading-7 [overflow-wrap:anywhere]">
                  {redisArticle.summary}
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <Link href={`/blog/${redisArticle.slug}`}>글 읽기</Link>
              </Button>
            </article>
          </section>
        ) : null}

        <section className="flex flex-col gap-6">
          <details className="border-border bg-card rounded-md border p-5">
            <summary className="text-foreground cursor-pointer text-lg font-semibold">
              검증 기준 보기
            </summary>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              측정한 수치, 재현 가능한 검증, 아직 채워야 하는 항목을 같은 색으로
              뭉개지 않습니다.
            </p>
            <div className="mt-5">
              <EvidenceMatrix />
            </div>
          </details>
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeader
            title="추가 프로젝트"
            description="대표 사례를 보완하는 팀 협업, 제품 구현, 캐싱, AI 서비스 경험을 짧게 정리합니다."
          />
          <div className="border-border bg-card flex flex-col gap-3 border p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {supportingAdditionalProjects.map((project) => (
                <span
                  key={project.slug}
                  className="text-foreground text-sm font-semibold"
                >
                  {project.title}
                </span>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="shrink-0">
              <Link href="/projects">모든 프로젝트 보기</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
