import { MDXRemote } from "next-mdx-remote/rsc";

import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Project } from "@/content/projects";

export function CaseStudyArticle({
  project,
  mdxSource,
}: {
  project: Project;
  mdxSource: string;
}) {
  return (
    <article className="mx-auto flex max-w-5xl flex-col gap-12 px-5 py-12 md:px-8 md:py-16">
      <header className="flex flex-col gap-6 border-b border-border pb-10">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Case Study / {project.domain}
          </p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            {project.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            {project.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.primaryTechStack.map((tech) => (
            <Badge key={tech} variant="outline" className="rounded-md">
              {tech}
            </Badge>
          ))}
        </div>
        <div>
          <Button asChild>
            <a href={project.repoUrl} target="_blank" rel="noreferrer">
              GitHub Repository
            </a>
          </Button>
        </div>
      </header>

      <section className="flex flex-col gap-5">
        <SectionHeader
          title="Architecture / Flow"
          description="앱 화면이 아니라 백엔드 흐름, 장애 경계, 정합성 지점을 먼저 보여줍니다."
        />
        <ArchitectureDiagram slug={project.slug} />
      </section>

      <section className="case-study-mdx">
        <MDXRemote source={mdxSource} />
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeader
          title="Evidence"
          description="수치가 있는 항목과 시나리오 검증 항목, 아직 Pending인 항목을 분리합니다."
        />
        <div className="grid gap-3 md:grid-cols-2">
          {project.evidence.map((evidence) => (
            <div
              key={evidence.label}
              className="flex flex-col gap-3 rounded-md border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-foreground">{evidence.label}</h3>
                <StatusBadge status={evidence.status} />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                {evidence.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-md border border-border bg-card p-5">
          <h2 className="text-xl font-semibold text-foreground">Limitations</h2>
          <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
            {project.limitations.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 size-1 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-4 rounded-md border border-border bg-card p-5">
          <h2 className="text-xl font-semibold text-foreground">
            Interview Questions
          </h2>
          <ul className="flex flex-col gap-3 text-sm leading-6 text-muted-foreground">
            {project.interviewQuestions.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 size-1 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
