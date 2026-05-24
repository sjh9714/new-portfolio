import type { Metadata } from "next";

import { PortfolioProjectGroupCard } from "@/components/portfolio-project-group-card";
import { SectionHeader } from "@/components/section-header";
import { featuredProjectGroups } from "@/content/portfolio-cases";

export const metadata: Metadata = {
  title: "문제 해결 사례",
  description:
    "이력서 한 줄을 구조도, 문제 원인, 해결 과정, 검증 결과로 확장한 백엔드 문제 해결 포트폴리오.",
};

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        title="대표 프로젝트 4개"
        description="4개 대표 백엔드 레포에서 뽑은 문제 해결 경험입니다. 같은 프로젝트에서 나온 사례라도 문제 구간과 면접 질문이 다르면 별도 deep dive로 분리했습니다."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {featuredProjectGroups.map((group, index) => (
          <PortfolioProjectGroupCard
            key={group.projectSlug}
            group={group}
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
