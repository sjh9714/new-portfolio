import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEvidencePreview, type Project } from "@/content/projects";

export function ProjectCard({
  project,
  compact = false,
  showCaseStudy = true,
}: {
  project: Project;
  compact?: boolean;
  showCaseStudy?: boolean;
}) {
  const evidencePreview = getEvidencePreview(project, compact ? 2 : 3);

  return (
    <article
      id={project.slug}
      className="flex h-full flex-col gap-5 border border-border bg-card p-5"
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {project.domain}
        </p>
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold tracking-tight text-primary">
            {project.title}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {project.subtitle}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 text-sm leading-6">
        <LabeledText label="Problem" value={project.problem} />
        <LabeledText label="Solution" value={project.solution} />
        {!compact ? <LabeledText label="Result" value={project.result} /> : null}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Evidence
        </p>
        <div className="flex flex-col gap-2">
          {evidencePreview.map((evidence) => (
            <div
              key={`${project.slug}-${evidence.label}`}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2"
            >
              <span className="min-w-0 text-sm leading-5 text-foreground">
                {evidence.label}
              </span>
              <StatusBadge status={evidence.status} />
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
              Case Study
            </Link>
          </Button>
        ) : (
          <Button disabled variant="outline" className="flex-1">
            <FileText data-icon="inline-start" aria-hidden="true" />
            Case Study
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
    <article className="grid gap-4 border-b border-border py-5 last:border-b-0 md:grid-cols-[1.1fr_2fr_1.2fr_auto] md:items-center">
      <div>
        <h3 className="font-semibold text-foreground">{project.title}</h3>
        <p className="text-sm text-muted-foreground">{project.domain}</p>
      </div>
      <p className="text-sm leading-6 text-foreground">{project.result}</p>
      <div className="flex flex-wrap gap-2">
        {project.primaryTechStack.map((tech) => (
          <Badge key={tech} variant="outline" className="rounded-md">
            {tech}
          </Badge>
        ))}
      </div>
      <Button asChild variant="ghost" size="sm">
        <a href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`${project.title} GitHub`}>
          <ExternalLink data-icon="inline-end" aria-hidden="true" />
          Repo
        </a>
      </Button>
    </article>
  );
}

function LabeledText({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold text-primary">{label}</p>
      <p className="text-foreground">{value}</p>
    </div>
  );
}
