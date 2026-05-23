import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortfolioCase } from "@/content/portfolio-cases";
import type { Project } from "@/content/projects";

export function PortfolioCaseCard({
  portfolioCase,
  project,
  rank,
}: {
  portfolioCase: PortfolioCase;
  project: Project;
  rank?: number;
}) {
  const evidencePreview = portfolioCase.evidence.slice(0, 2);

  return (
    <article
      id={portfolioCase.slug}
      className="border-border bg-card hover:border-primary/40 flex h-full flex-col gap-5 border p-5 transition-colors"
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {rank === 1 ? (
            <Badge variant="outline" className="rounded-md">
              대표 1순위
            </Badge>
          ) : null}
          <Badge variant="outline" className="rounded-md">
            {project.title}
          </Badge>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
            {portfolioCase.domain}
          </p>
          <h3 className="text-primary text-xl leading-8 font-semibold tracking-tight [overflow-wrap:anywhere]">
            {portfolioCase.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-6 [overflow-wrap:anywhere]">
            {portfolioCase.resumeLine}
          </p>
        </div>
      </div>

      <div className="grid flex-1 gap-4 text-sm leading-6">
        <LabeledText label="문제" value={portfolioCase.problem[0]} />
        <LabeledText label="설계" value={portfolioCase.solution[0]} />
        <LabeledText label="결과" value={portfolioCase.result[0]} />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
          근거
        </p>
        <div className="flex flex-col gap-2">
          {evidencePreview.map((evidence) => (
            <div
              key={`${portfolioCase.slug}-${evidence.label}`}
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
        <Button asChild className="flex-1">
          <Link href={`/case-studies/${portfolioCase.slug}`}>
            <FileText data-icon="inline-start" aria-hidden="true" />
            사례 보기
          </Link>
        </Button>
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

function LabeledText({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-primary text-xs font-semibold">{label}</p>
      <p className="text-foreground [overflow-wrap:anywhere]">{value}</p>
    </div>
  );
}
