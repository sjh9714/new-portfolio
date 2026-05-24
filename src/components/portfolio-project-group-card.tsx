import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FeaturedProjectGroup } from "@/content/portfolio-cases";

export function PortfolioProjectGroupCard({
  group,
  priority = false,
}: {
  group: FeaturedProjectGroup;
  priority?: boolean;
}) {
  return (
    <article
      className={`border-border bg-card flex h-full flex-col gap-5 border p-5 ${
        priority ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-md">
            대표 프로젝트
          </Badge>
          {group.caseLinks.length > 1 ? (
            <Badge variant="outline" className="rounded-md">
              Deep Dive {group.caseLinks.length}개
            </Badge>
          ) : null}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-foreground text-2xl font-semibold tracking-tight">
            {group.title}
          </h3>
          <p className="text-primary text-sm font-semibold">{group.subtitle}</p>
          <p className="text-muted-foreground text-sm leading-6">
            {group.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
          문제 해결 Deep Dive
        </p>
        <div className="grid gap-3">
          {group.caseLinks.map((caseLink, index) => (
            <div
              key={caseLink.caseSlug}
              className="border-border bg-background flex flex-col gap-3 rounded-md border p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-md">
                  Deep Dive {index + 1}/{group.caseLinks.length}
                </Badge>
                <h4 className="text-foreground text-sm font-semibold [overflow-wrap:anywhere]">
                  {caseLink.label}
                </h4>
              </div>
              <p className="text-muted-foreground text-sm leading-6 [overflow-wrap:anywhere]">
                {caseLink.summary}
              </p>
              <Button asChild variant="ghost" size="sm" className="self-start">
                <Link href={`/case-studies/${caseLink.caseSlug}`}>
                  <FileText data-icon="inline-start" aria-hidden="true" />
                  {caseLink.actionLabel}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
          대표 근거
        </p>
        <div className="grid gap-2">
          {group.primaryEvidence.map((evidence) => (
            <div
              key={`${group.projectSlug}-${evidence.label}`}
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

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {group.techStack.map((tech) => (
            <Badge key={tech} variant="outline" className="rounded-md">
              {tech}
            </Badge>
          ))}
        </div>
        <Button asChild variant="outline" className="self-start">
          <a href={group.repoUrl} target="_blank" rel="noreferrer">
            <ExternalLink data-icon="inline-start" aria-hidden="true" />
            GitHub
          </a>
        </Button>
      </div>
    </article>
  );
}
