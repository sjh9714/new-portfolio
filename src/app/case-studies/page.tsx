import { ExternalLink, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  featuredPortfolioCases,
  getPortfolioCaseProjectBadge,
} from "@/content/portfolio-cases";
import { getProjectBySlug } from "@/content/projects";

export const metadata: Metadata = {
  title: "문제 해결 사례",
  description:
    "이력서 한 줄을 구조도, 문제 원인, 해결 과정, 검증 결과로 확장한 백엔드 문제 해결 포트폴리오.",
};

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        title="문제 해결 Deep Dive 5개"
        description="4개 대표 백엔드 레포에서 뽑은 5개 문제 해결 deep dive를 고르는 목록입니다. 같은 프로젝트에서 나온 사례라도 문제 구간과 면접 질문이 다르면 별도 deep dive로 분리했습니다."
      />

      <div className="border-border border-y">
        {featuredPortfolioCases.map((portfolioCase) => {
          const project = getProjectBySlug(portfolioCase.projectSlug);
          const evidence =
            portfolioCase.evidence.find((item) => item.status === "measured") ??
            portfolioCase.evidence[0];

          if (!project) {
            return null;
          }

          return (
            <article
              key={portfolioCase.slug}
              className="border-border grid gap-4 border-b py-5 last:border-b-0 md:grid-cols-[1.1fr_1.4fr_auto] md:items-center"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-md">
                    {getPortfolioCaseProjectBadge(portfolioCase)}
                  </Badge>
                  <Badge variant="outline" className="rounded-md">
                    {portfolioCase.domain}
                  </Badge>
                </div>
                <h2 className="text-foreground text-lg leading-7 font-semibold [overflow-wrap:anywhere]">
                  {portfolioCase.title}
                </h2>
              </div>

              <div className="border-border bg-card flex flex-col gap-2 rounded-md border px-3 py-2">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-foreground text-sm font-semibold [overflow-wrap:anywhere]">
                    {evidence.label}
                  </span>
                  <StatusBadge status={evidence.status} className="shrink-0" />
                </div>
                <p className="text-muted-foreground line-clamp-2 text-sm leading-6 [overflow-wrap:anywhere]">
                  {evidence.value}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                <Button asChild size="sm">
                  <Link href={`/case-studies/${portfolioCase.slug}`}>
                    <FileText data-icon="inline-start" aria-hidden="true" />
                    사례 보기
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={project.repoUrl} target="_blank" rel="noreferrer">
                    <ExternalLink data-icon="inline-start" aria-hidden="true" />
                    GitHub
                  </a>
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
