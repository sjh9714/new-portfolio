import type { Metadata } from "next";

import { PortfolioCaseCard } from "@/components/portfolio-case-card";
import { SectionHeader } from "@/components/section-header";
import { featuredPortfolioCases } from "@/content/portfolio-cases";
import { getProjectBySlug } from "@/content/projects";

export const metadata: Metadata = {
  title: "문제 해결 사례",
  description:
    "이력서 한 줄을 구조도, 문제 원인, 해결 과정, 검증 결과로 확장한 백엔드 문제 해결 포트폴리오.",
};

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        title="이력서 한 줄을 확장한 문제 해결 포트폴리오"
        description="프로젝트명이 아니라 문제, 해결, 결과, 도메인이 보이는 이력서 문장을 기준으로 대표 사례를 다시 정리했습니다."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featuredPortfolioCases.map((portfolioCase, index) => {
          const project = getProjectBySlug(portfolioCase.projectSlug);

          if (!project) {
            return null;
          }

          return (
            <PortfolioCaseCard
              key={portfolioCase.slug}
              portfolioCase={portfolioCase}
              project={project}
              rank={index + 1}
            />
          );
        })}
      </div>
    </div>
  );
}
