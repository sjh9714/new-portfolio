import { MDXRemote } from "next-mdx-remote/rsc";

import { ArchitectureDiagram } from "@/components/architecture-diagram";
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
    <article className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 md:px-8 md:py-16">
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
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,780px)_340px] lg:items-start">
        <section className="case-study-mdx min-w-0">
          <MDXRemote
            source={mdxSource}
            components={{
              ArchitectureDiagram: () => (
                <ArchitectureDiagram slug={project.slug} />
              ),
            }}
          />
        </section>

        <CaseStudySidebar project={project} />
      </div>
    </article>
  );
}

function CaseStudySidebar({ project }: { project: Project }) {
  return (
    <aside
      aria-label={`${project.title} evidence summary`}
      className="border-border bg-card flex flex-col gap-6 rounded-md border p-5 lg:sticky lg:top-6"
    >
      <div className="flex flex-col gap-3">
        <p className="text-primary text-sm font-semibold">Evidence</p>
        <div className="flex flex-col gap-3">
          {project.evidence.map((evidence) => (
            <div
              key={evidence.label}
              className="border-border bg-background rounded-md border p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-foreground text-sm leading-6 font-semibold [overflow-wrap:anywhere]">
                  {evidence.label}
                </h2>
                <StatusBadge status={evidence.status} />
              </div>
              <p className="text-muted-foreground mt-2 text-xs leading-5 [overflow-wrap:anywhere]">
                {evidence.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <SidebarSection title="Tech Stack">
        <div className="flex flex-wrap gap-2">
          {project.primaryTechStack.map((tech) => (
            <Badge key={tech} variant="outline" className="rounded-md">
              {tech}
            </Badge>
          ))}
        </div>
      </SidebarSection>

      <SidebarSection title="Limitations">
        <SidebarList items={project.limitations} />
      </SidebarSection>

      <SidebarSection title="Interview Questions">
        <SidebarList items={project.interviewQuestions} />
      </SidebarSection>

      <Button asChild className="w-full">
        <a href={project.repoUrl} target="_blank" rel="noreferrer">
          GitHub Repository
        </a>
      </Button>
    </aside>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-primary text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function SidebarList({ items }: { items: string[] }) {
  return (
    <ul className="text-muted-foreground flex flex-col gap-2 text-xs leading-5">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span
            aria-hidden="true"
            className="bg-primary mt-2 size-1 shrink-0 rounded-full"
          />
          <span className="[overflow-wrap:anywhere]">{item}</span>
        </li>
      ))}
    </ul>
  );
}
