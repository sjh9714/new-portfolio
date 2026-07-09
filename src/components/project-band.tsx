import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { getCaseStudyBySlug } from "@/content/portfolio-cases";
import { getEvidenceById, type ProjectSummary } from "@/content/projects";

export function ProjectBand({
  project,
  index,
}: {
  project: ProjectSummary;
  index: number;
}) {
  const primaryEvidence = project.evidenceIds
    .map(getEvidenceById)
    .filter((evidence) => evidence !== undefined)[0];
  const caseStudies = project.caseStudySlugs
    .map(getCaseStudyBySlug)
    .filter((caseStudy) => caseStudy !== undefined);

  return (
    <article
      id={project.slug}
      className="project-band border-border grid gap-7 border-t py-8 lg:grid-cols-[0.8fr_2.2fr] lg:gap-12 lg:py-10"
    >
      <header className="grid content-start gap-3">
        <p className="text-muted-foreground font-mono text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
          {String(index + 1).padStart(2, "0")} / {project.domain}
        </p>
        <h3 className="text-foreground text-2xl font-bold tracking-[-0.025em] md:text-3xl">
          {project.title}
        </h3>
        <p className="text-primary max-w-sm text-sm leading-6 font-semibold">
          {project.positioning}
        </p>
        <p className="text-muted-foreground text-xs leading-5">
          {[project.role, project.team, project.period]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      <div className="grid gap-7">
        <dl className="grid gap-5 md:grid-cols-3">
          <ProjectFact label="문제" value={project.problem} />
          <ProjectFact label="설계 판단" value={project.decision} />
          <ProjectFact label="결과" value={project.result} />
        </dl>

        {primaryEvidence ? (
          <div className="border-border bg-card grid gap-3 border-y px-0 py-4 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:px-4">
            <StatusBadge status={primaryEvidence.status} />
            <div className="min-w-0">
              <p className="text-foreground text-sm font-semibold">
                {primaryEvidence.label}
              </p>
              <p className="text-muted-foreground mt-1 text-sm leading-6 [overflow-wrap:anywhere]">
                {primaryEvidence.value}
              </p>
            </div>
            <a
              href={primaryEvidence.source.permalink}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-accent-foreground flex min-h-11 items-center text-sm font-semibold hover:underline"
              aria-label={`${project.title} 근거 파일 (새 창)`}
            >
              근거 파일
              <ExternalLink className="ml-1 size-4" aria-hidden="true" />
            </a>
          </div>
        ) : null}

        <footer className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <ul
            aria-label={`${project.title} 기술 스택`}
            className="flex flex-wrap gap-2"
          >
            {project.tech.map((tech) => (
              <li key={tech}>
                <Badge variant="outline">{tech}</Badge>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {caseStudies.map((caseStudy) => (
              <Link
                key={caseStudy.slug}
                href={`/case-studies/${caseStudy.slug}`}
                prefetch={false}
                className="text-primary hover:text-accent-foreground flex min-h-11 items-center text-sm font-semibold hover:underline"
              >
                {caseStudies.length > 1 ? caseStudy.title : "상세 사례 보기"}
                <ArrowRight className="ml-1 size-4" aria-hidden="true" />
              </Link>
            ))}
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground flex min-h-11 items-center text-sm font-semibold hover:underline"
              aria-label={`${project.title} GitHub 저장소 (새 창)`}
            >
              GitHub
              <ExternalLink className="ml-1 size-4" aria-hidden="true" />
            </a>
          </div>
        </footer>
      </div>
    </article>
  );
}

function ProjectFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-primary font-mono text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
        {label}
      </dt>
      <dd className="text-foreground mt-2 text-sm leading-6">{value}</dd>
    </div>
  );
}
