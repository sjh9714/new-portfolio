import type { Metadata } from "next";

import { ProjectCard } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { featuredProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "문제 해결 사례",
  description:
    "동시성, 실시간 메시징, 과금, SAGA 보상 흐름을 다룬 4개 백엔드 문제 해결 사례.",
};

export default function CaseStudiesPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:px-8 md:py-16">
      <SectionHeader
        title="문제 해결 사례"
        description="면접 질문으로 이어지기 쉬운 4개 백엔드 문제 해결 사례를 모았습니다."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {featuredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
