import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";

import { ProjectRow } from "@/components/project-row";
import {
  additionalSystemsWork,
  alsoShipped,
  featuredProjects,
} from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "팀 제품, 실제 클라이언트, 다시 검증한 코드로 구성한 성진혁의 대표 작업.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Work",
    description: "성진혁의 대표 프로젝트와 전달한 작업.",
    url: "/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work",
    description: "성진혁의 대표 프로젝트와 전달한 작업.",
  },
};

export default function ProjectsPage() {
  return (
    <>
      <header className="inner-hero page-shell">
        <p className="eyebrow">Work</p>
        <h1>
          프로젝트보다
          <br />그 안의 변화를 봅니다.
        </h1>
        <p>
          누구와 왜 시작했고, 실제 화면을 연결하며 무엇이 드러났고, 지금 어떤
          근거를 남겼는지 순서대로 정리했습니다.
        </p>
      </header>
      <section
        className="page-shell inner-projects"
        aria-labelledby="selected-work-heading"
      >
        <div className="mini-section-heading">
          <h2 id="selected-work-heading">Selected work</h2>
          <span>04 projects</span>
        </div>
        {featuredProjects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </section>
      <section
        className="page-shell work-secondary"
        aria-labelledby="also-heading"
      >
        <div className="mini-section-heading">
          <h2 id="also-heading">Also shipped</h2>
          <span>Public delivery</span>
        </div>
        <div className="secondary-work-grid">
          {alsoShipped.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${item.title} GitHub (새 창)`}
            >
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </div>
        <details className="additional-work">
          <summary>Additional systems work</summary>
          {additionalSystemsWork.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${item.title} GitHub (새 창)`}
            >
              <strong>{item.title}</strong>
              <span>{item.description}</span>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </details>
      </section>
    </>
  );
}
