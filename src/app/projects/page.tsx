import type { Metadata } from "next";
/* eslint-disable @next/next/no-img-element -- Project architecture thumbnails are static SVG documentation assets. */
import Link from "next/link";

import { ProjectRow } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  featuredProjectGroups,
  featuredPortfolioCases,
  getSupportingProjects,
  projectArchitectureSummaries,
} from "@/content/portfolio-cases";
import {
  additionalProjects,
  archiveProjects,
  getProjectBySlug,
  projectOverallArchitectures,
} from "@/content/projects";

const supportingAdditionalProjects = getSupportingProjects(additionalProjects);
const visibleArchitectureSummaryProjectSlugs = [
  "concert-booking",
  "realtime-chat",
  "ai-usage-billing-gateway",
  "borrow-me",
] as const;
const visibleProjectArchitectureSummaries = projectArchitectureSummaries.filter(
  (summary) =>
    visibleArchitectureSummaryProjectSlugs.includes(
      summary.projectSlug as (typeof visibleArchitectureSummaryProjectSlugs)[number],
    ),
);
export const metadata: Metadata = {
  title: "프로젝트",
  description:
    "대표 사례, 추가 프로젝트, 아카이브 프로젝트를 근거 수준에 따라 정리한 백엔드 포트폴리오.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        title="프로젝트"
        description="대표 문제 해결 사례와 추가 프로젝트를 한 화면에서 빠르게 비교할 수 있게 나눴습니다."
      />
      <section className="flex flex-col gap-5">
        <SectionHeader
          title="대표 프로젝트 4개"
          description="프로젝트 단위로 먼저 보고, 각 레포에서 확장한 문제 해결 deep dive로 바로 이동할 수 있게 묶었습니다."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {featuredProjectGroups.map(({ project, caseLinks }) => (
            <article
              key={project.slug}
              className="border-border bg-card flex h-full flex-col gap-5 border p-5"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-md">
                    대표 프로젝트
                  </Badge>
                  {caseLinks.length > 1 ? (
                    <Badge variant="outline" className="rounded-md">
                      Deep Dive {caseLinks.length}개
                    </Badge>
                  ) : null}
                </div>
                <h2 className="text-foreground text-xl font-semibold">
                  {project.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-6">
                  {project.subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
                  연결된 문제 해결 사례
                </p>
                <ul className="flex flex-col gap-2">
                  {caseLinks.map((caseLink) => (
                    <li key={caseLink.caseSlug}>
                      <Link
                        href={`/case-studies/${caseLink.caseSlug}`}
                        className="text-foreground hover:text-primary inline-flex text-sm leading-6 font-semibold underline-offset-4 hover:underline"
                      >
                        {caseLink.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-muted-foreground text-sm leading-6">
                {project.result}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.primaryTechStack.map((tech) => (
                  <Badge key={tech} variant="outline" className="rounded-md">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto">
                <Button asChild variant="outline" size="sm">
                  <a href={project.repoUrl} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader
          title="전체 아키텍처 요약"
          description="대표 문제 해결 사례가 각 프로젝트 전체 흐름 안에서 어느 구간에 위치하는지 짧게 연결합니다."
        />
        <div className="border-border border-y">
          {visibleProjectArchitectureSummaries.map((summary) => {
            const project = getProjectBySlug(summary.projectSlug);
            const portfolioCase = featuredPortfolioCases.find(
              (item) => item.slug === summary.caseSlug,
            );

            if (!project || !portfolioCase) {
              return null;
            }

            const architecture = projectOverallArchitectures.find(
              (item) => item.projectSlug === summary.projectSlug,
            );

            return (
              <article
                key={summary.projectSlug}
                className="border-border grid gap-3 border-b py-4 last:border-b-0 lg:grid-cols-[240px_1fr_2fr_auto] lg:items-center"
              >
                {architecture ? (
                  <Link
                    href={`/case-studies/${summary.caseSlug}`}
                    className="border-border bg-background block overflow-hidden rounded-md border p-2 sm:overflow-x-auto lg:overflow-hidden"
                    aria-label={`${project.title} 전체 아키텍처 대표 사례 보기`}
                  >
                    <img
                      src={architecture.imageSrc}
                      alt={architecture.alt}
                      className="w-full min-w-0 rounded-sm sm:min-w-[260px] lg:min-w-0"
                      loading="lazy"
                    />
                  </Link>
                ) : null}
                <div className="flex flex-col gap-1">
                  <h3 className="text-foreground font-semibold">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {portfolioCase.domain}
                  </p>
                  {architecture ? (
                    <p className="text-muted-foreground text-xs leading-5">
                      {architecture.caption}
                    </p>
                  ) : null}
                </div>
                <p className="text-foreground text-sm leading-6 [overflow-wrap:anywhere]">
                  {summary.flow}
                </p>
                <Link
                  href={`/case-studies/${summary.caseSlug}`}
                  className="text-primary text-sm font-semibold hover:underline"
                >
                  대표 사례 보기
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <ProjectRowSection
        title="추가 프로젝트"
        description="대표 사례를 보완하는 팀 협업, 제품 구현, 캐싱, AI 서비스 경험입니다."
        projects={supportingAdditionalProjects}
      />

      <ProjectRowSection
        title="아카이브"
        description="초기 팀 프로젝트는 별도 아카이브로 낮은 위계에 둡니다."
        projects={archiveProjects}
      />
    </div>
  );
}

function ProjectRowSection({
  title,
  description,
  projects,
}: {
  title: string;
  description: string;
  projects: typeof supportingAdditionalProjects;
}) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title={title} description={description} />
      <div className="border-border border-y">
        <div className="text-muted-foreground hidden grid-cols-[1.1fr_2fr_1.2fr_auto] gap-4 border-b py-3 text-xs font-semibold tracking-[0.16em] uppercase lg:grid">
          <span>프로젝트</span>
          <span>핵심 결과</span>
          <span>기술</span>
          <span>링크</span>
        </div>
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
