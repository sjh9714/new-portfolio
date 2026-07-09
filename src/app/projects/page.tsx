import { ExternalLink } from "lucide-react";

import { ProjectBand } from "@/components/project-band";
import { SectionHeader } from "@/components/section-header";
import { additionalProjects, featuredProjects } from "@/content/projects";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "프로젝트",
  description:
    "대표 백엔드 프로젝트 네 개와 확인 가능한 범위만 공개한 추가 프로젝트 목록.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <div className="page-shell py-10 md:py-16">
      <SectionHeader
        as="h1"
        eyebrow="Projects"
        title="네 프로젝트, 다섯 개의 문제 해결 사례"
        description="대표 프로젝트는 문제·설계 판단·결과·근거를 모두 공개합니다. 확인 가능한 맥락이 적은 프로젝트는 제목·역할·저장소만 보조 목록에 둡니다."
      />

      <section aria-labelledby="primary-projects-title" className="mt-14">
        <h2 id="primary-projects-title" className="sr-only">
          대표 프로젝트
        </h2>
        <div className="border-border border-b">
          {featuredProjects.map((project, index) => (
            <ProjectBand key={project.slug} project={project} index={index} />
          ))}
        </div>
      </section>

      {additionalProjects.length > 0 ? (
        <section className="border-border mt-14 border-t pt-8">
          <details className="group">
            <summary className="text-foreground flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:hidden">
              <span>
                추가 프로젝트
                <span className="text-muted-foreground ml-2 font-mono text-xs">
                  {String(additionalProjects.length).padStart(2, "0")}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="text-primary font-mono text-xl transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="border-border border-t">
              {additionalProjects.map((project) => (
                <article
                  key={project.slug}
                  className="border-border grid gap-3 border-b py-5 sm:grid-cols-[1fr_1fr_auto] sm:items-center sm:gap-6"
                >
                  <div>
                    <h3 className="text-foreground font-semibold">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {project.domain}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {[project.role, project.team, project.period]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} GitHub 저장소 (새 창)`}
                    className="text-primary flex min-h-11 items-center text-sm font-semibold hover:underline"
                  >
                    저장소
                    <ExternalLink className="ml-1 size-4" aria-hidden="true" />
                  </a>
                </article>
              ))}
            </div>
          </details>
        </section>
      ) : null}
    </div>
  );
}
