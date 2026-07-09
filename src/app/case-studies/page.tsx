import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { SectionHeader } from "@/components/section-header";
import { caseStudies } from "@/content/portfolio-cases";
import { getEvidenceById, getProjectBySlug } from "@/content/projects";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "문제 해결 사례",
  description:
    "동시성, 이벤트 복구, 실시간 메시징, 과금 정합성을 문제·판단·결과·근거로 정리한 백엔드 사례.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <div className="page-shell py-10 md:py-16">
      <SectionHeader
        as="h1"
        eyebrow="Case studies / 05"
        title="실패 경계를 좁히고, 근거로 답한 다섯 사례"
        description="각 사례는 하나의 문제만 다룹니다. 목록에서 대표 근거를 확인하고, 상세에서 구조와 재현 경로를 볼 수 있습니다."
      />

      <div className="border-border mt-12 border-t">
        {caseStudies.map((caseStudy, index) => {
          const project = getProjectBySlug(caseStudy.projectSlug);
          const evidence = getEvidenceById(caseStudy.cardEvidenceId);

          if (!project || !evidence) {
            return null;
          }

          return (
            <article
              key={caseStudy.slug}
              className="project-band border-border grid gap-6 border-b py-7 lg:grid-cols-[3rem_minmax(0,1.1fr)_minmax(18rem,0.9fr)_auto] lg:items-center lg:gap-8"
            >
              <p className="text-primary font-mono text-xs font-semibold">
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="min-w-0">
                <p className="text-muted-foreground font-mono text-[0.7rem] font-semibold tracking-[0.11em] uppercase">
                  {project.title} / {project.domain}
                </p>
                <h2 className="text-foreground mt-2 text-xl leading-8 font-bold tracking-tight md:text-2xl">
                  <Link
                    href={`/case-studies/${caseStudy.slug}`}
                    prefetch={false}
                    className="hover:text-primary"
                  >
                    {caseStudy.title}
                  </Link>
                </h2>
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-6">
                  {caseStudy.summary}
                </p>
              </div>
              <div className="border-border grid gap-2 border-l-2 pl-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-foreground text-sm font-semibold">
                    {evidence.label}
                  </p>
                  <StatusBadge status={evidence.status} />
                </div>
                <p className="text-primary font-mono text-sm font-semibold [overflow-wrap:anywhere]">
                  {evidence.value}
                </p>
              </div>
              <div className="flex flex-wrap gap-x-5 lg:flex-col lg:items-end">
                <Link
                  href={`/case-studies/${caseStudy.slug}`}
                  prefetch={false}
                  className="text-primary flex min-h-11 items-center text-sm font-semibold hover:underline"
                >
                  사례 보기
                  <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                </Link>
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${caseStudy.title} GitHub 저장소 (새 창)`}
                  className="text-muted-foreground hover:text-foreground flex min-h-11 items-center text-sm font-semibold hover:underline"
                >
                  GitHub
                  <ExternalLink className="ml-1 size-4" aria-hidden="true" />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
