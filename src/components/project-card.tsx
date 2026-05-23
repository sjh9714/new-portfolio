import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEvidencePreview, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  compact = false,
  showCaseStudy = true,
  emphasis = false,
}: {
  project: Project;
  compact?: boolean;
  showCaseStudy?: boolean;
  emphasis?: boolean;
}) {
  const evidencePreview = getEvidencePreview(project, compact ? 2 : 3);

  return (
    <article
      id={project.slug}
      className="border-border bg-card hover:border-primary/40 flex h-full flex-col gap-5 border p-5 transition-colors"
    >
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
          {project.domain}
        </p>
        <div className="flex flex-col gap-1">
          {project.slug === "concert-booking" ? (
            <Badge variant="outline" className="w-fit rounded-md">
              대표 1순위
            </Badge>
          ) : null}
          <h3
            className={cn(
              "text-primary font-semibold tracking-tight",
              emphasis ? "text-2xl md:text-3xl" : "text-xl",
            )}
          >
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-6">
            {project.subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 text-sm leading-6">
        <LabeledText label="문제" value={project.problem} />
        <LabeledText label="설계" value={project.solution} />
        <LabeledText label="결과" value={project.result} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
          근거
        </p>
        <div className="flex flex-col gap-2">
          {evidencePreview.map((evidence) => (
            <div
              key={`${project.slug}-${evidence.label}`}
              className="border-border bg-background flex flex-col gap-2 rounded-md border px-3 py-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-foreground text-sm leading-5 [overflow-wrap:anywhere]">
                  {evidence.label}
                </span>
                <span className="text-muted-foreground line-clamp-2 text-xs leading-5 [overflow-wrap:anywhere]">
                  {evidence.value}
                </span>
              </span>
              <StatusBadge status={evidence.status} className="shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.primaryTechStack.map((tech) => (
          <Badge key={tech} variant="outline" className="rounded-md">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        {showCaseStudy && project.category === "featured" ? (
          <Button asChild className="flex-1">
            <Link href={`/case-studies/${project.slug}`}>
              <FileText data-icon="inline-start" aria-hidden="true" />
              사례 보기
            </Link>
          </Button>
        ) : (
          <Button disabled variant="outline" className="flex-1">
            <FileText data-icon="inline-start" aria-hidden="true" />
            사례 보기
          </Button>
        )}
        <Button asChild variant="outline" className="flex-1">
          <a href={project.repoUrl} target="_blank" rel="noreferrer">
            <ExternalLink data-icon="inline-start" aria-hidden="true" />
            GitHub
          </a>
        </Button>
      </div>
    </article>
  );
}

export function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="border-border grid gap-4 border-b py-5 last:border-b-0 lg:grid-cols-[1.1fr_2fr_1.2fr_auto] lg:items-center">
      <div>
        <h3 className="text-foreground font-semibold">{project.title}</h3>
        <p className="text-muted-foreground text-sm">{project.domain}</p>
      </div>
      <p className="text-foreground text-sm leading-6 [overflow-wrap:anywhere]">
        {project.result}
      </p>
      <div className="flex flex-wrap gap-2">
        {project.primaryTechStack.map((tech) => (
          <Badge key={tech} variant="outline" className="rounded-md">
            {tech}
          </Badge>
        ))}
      </div>
      <Button asChild variant="ghost" size="sm">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} GitHub`}
        >
          <ExternalLink data-icon="inline-end" aria-hidden="true" />
          저장소
        </a>
      </Button>
    </article>
  );
}

function LabeledText({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-primary text-xs font-semibold">{label}</p>
      <p className="text-foreground [overflow-wrap:anywhere]">{value}</p>
    </div>
  );
}
