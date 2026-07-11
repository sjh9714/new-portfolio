import type { Metadata } from "next";

import { ProjectRow } from "@/components/project-row";
import { featuredProjects } from "@/content/projects";
import { createTopLevelMetadata } from "@/lib/site";

const description =
  "팀 화면과 AWS 배포, 좌석 경합 복구, 메시지 재연결, 대여 생명주기로 이어지는 성진혁의 대표 작업 4개.";

export const metadata: Metadata = {
  title: "작업",
  description,
  ...createTopLevelMetadata({
    title: "작업 — 성진혁",
    description,
    path: "/projects",
  }),
};

export default function ProjectsPage() {
  return (
    <>
      <header className="inner-hero page-shell">
        <p className="eyebrow">대표 작업 · 4개</p>
        <h1>제품의 맥락에서 시작한 백엔드 작업</h1>
        <p>
          무엇을 함께 만들었고, 실제 화면을 연결하며 어떤 문제가 드러났고, 지금
          어떤 테스트로 확인할 수 있는지 순서대로 정리했습니다.
        </p>
      </header>
      <section
        className="page-shell inner-projects"
        aria-labelledby="project-list-title"
      >
        <div className="mini-section-heading">
          <h2 id="project-list-title">프로젝트</h2>
          <span>Memory → Concert → Realtime → BorrowMe</span>
        </div>
        <div className="project-list">
          {featuredProjects.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              index={index}
              lead={index === 0}
            />
          ))}
        </div>
      </section>
    </>
  );
}
