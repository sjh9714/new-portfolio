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
      <header className="border-border flex flex-col gap-6 border-b pb-10">
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.18em] uppercase">
            Case Study / {project.domain}
          </p>
          <h1 className="text-foreground max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
            {project.title}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg leading-8">
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

      <section className="case-study-mdx">
        <MDXRemote
          source={mdxSource}
          components={{
            ArchitectureDiagram: () => (
              <ArchitectureDiagram slug={project.slug} />
            ),
          }}
        />
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
              className="border-border bg-card flex flex-col gap-3 rounded-md border p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-foreground font-semibold">
                  {evidence.label}
                </h3>
                <StatusBadge status={evidence.status} />
              </div>
              <p className="text-muted-foreground text-sm leading-6">
                {evidence.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="border-border bg-card flex flex-col gap-4 rounded-md border p-5">
          <h2 className="text-foreground text-xl font-semibold">Limitations</h2>
          <ul className="text-muted-foreground flex flex-col gap-3 text-sm leading-6">
            {project.limitations.map((item) => (
              <li key={item} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="bg-primary mt-2 size-1 rounded-full"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-border bg-card flex flex-col gap-4 rounded-md border p-5">
          <h2 className="text-foreground text-xl font-semibold">
            Interview Questions
          </h2>
          <ul className="text-muted-foreground flex flex-col gap-3 text-sm leading-6">
            {project.interviewQuestions.map((item) => (
              <li key={item} className="flex gap-2">
                <span
                  aria-hidden="true"
                  className="bg-primary mt-2 size-1 rounded-full"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
