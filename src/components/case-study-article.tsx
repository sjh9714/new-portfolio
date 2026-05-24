import {
  PortfolioCaseDiagram,
  PortfolioCaseDiagramDetails,
} from "@/components/portfolio-case-diagram";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortfolioCase } from "@/content/portfolio-cases";
import type { Project } from "@/content/projects";

export function CaseStudyArticle({
  portfolioCase,
  project,
}: {
  portfolioCase: PortfolioCase;
  project: Project;
}) {
  return (
    <article className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 md:px-8 md:py-16">
      <header className="border-border flex flex-col gap-6 border-b pb-10">
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.18em] uppercase">
            문제 해결 포트폴리오 / {portfolioCase.domain}
          </p>
          <h1 className="text-foreground max-w-5xl text-4xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] md:text-6xl">
            {portfolioCase.title}
          </h1>
          <p className="text-muted-foreground max-w-4xl text-lg leading-8">
            {portfolioCase.resumeLine}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          <MetaItem label="프로젝트" value={project.title} />
          <MetaItem label="참여" value={project.team ?? project.role} />
          {project.period ? (
            <MetaItem label="기간" value={project.period} />
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {project.primaryTechStack.map((tech) => (
            <Badge key={tech} variant="outline" className="rounded-md">
              {tech}
            </Badge>
          ))}
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,800px)_340px] lg:items-start">
        <section className="flex min-w-0 flex-col gap-8">
          <PortfolioCaseDiagram portfolioCase={portfolioCase} />

          <section className="grid gap-4">
            <SummaryBlock title="문제" items={portfolioCase.problem} />
            <SummaryBlock title="해결" items={portfolioCase.solution} />
            <SummaryBlock title="결과" items={portfolioCase.result} />
          </section>

          <EvidenceSection portfolioCase={portfolioCase} />

          <PortfolioCaseDiagramDetails portfolioCase={portfolioCase} />

          <FoldedContentSection title="상세 구현">
            <OrderedList items={portfolioCase.implementationDetails} />
          </FoldedContentSection>

          {portfolioCase.stateTransitions?.length ? (
            <StateTransitionTable
              transitions={portfolioCase.stateTransitions}
            />
          ) : null}
        </section>

        <CaseStudySidebar portfolioCase={portfolioCase} project={project} />
      </div>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border bg-card rounded-md border p-4">
      <p className="text-primary text-xs font-semibold">{label}</p>
      <p className="text-foreground mt-2 text-sm leading-6 [overflow-wrap:anywhere]">
        {value}
      </p>
    </div>
  );
}

function SummaryBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border-border bg-card rounded-md border p-5">
      <h2 className="text-foreground text-xl font-semibold">{title}</h2>
      <OrderedList items={items} />
    </section>
  );
}

function EvidenceSection({ portfolioCase }: { portfolioCase: PortfolioCase }) {
  const scenarios = portfolioCase.measurement?.scenarios ?? [];
  const executionEnvironment =
    portfolioCase.measurement?.executionEnvironment ?? [];

  return (
    <ContentSection title="검증 근거">
      <div className="grid gap-3">
        {portfolioCase.evidence.map((evidence) => (
          <div
            key={evidence.label}
            className="border-border bg-card rounded-md border p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-foreground font-semibold [overflow-wrap:anywhere]">
                {evidence.label}
              </h3>
              <StatusBadge status={evidence.status} />
            </div>
            <p className="text-muted-foreground mt-2 text-sm leading-6 [overflow-wrap:anywhere]">
              {evidence.value}
            </p>
          </div>
        ))}
      </div>

      {scenarios.length ? (
        <FoldedContentSection title="측정 시나리오" nested>
          <MeasurementList items={scenarios} />
        </FoldedContentSection>
      ) : null}

      {executionEnvironment.length ? (
        <FoldedContentSection title="실행 환경" nested>
          <MeasurementList items={executionEnvironment} />
        </FoldedContentSection>
      ) : null}
    </ContentSection>
  );
}

function CaseStudySidebar({
  portfolioCase,
  project,
}: {
  portfolioCase: PortfolioCase;
  project: Project;
}) {
  return (
    <aside
      aria-label={`${portfolioCase.title} 요약`}
      className="border-border bg-card flex flex-col gap-6 rounded-md border p-5 lg:sticky lg:top-6"
    >
      <SidebarSection title="기술 스택">
        <div className="flex flex-wrap gap-2">
          {project.primaryTechStack.map((tech) => (
            <Badge key={tech} variant="outline" className="rounded-md">
              {tech}
            </Badge>
          ))}
        </div>
      </SidebarSection>

      <SidebarSection title="한계와 다음 검증">
        <SidebarList items={portfolioCase.limitations} />
      </SidebarSection>

      <FoldedSidebarSection title="예상 면접 질문">
        <SidebarList items={portfolioCase.interviewQuestions} />
      </FoldedSidebarSection>

      <Button asChild className="w-full">
        <a href={project.repoUrl} target="_blank" rel="noreferrer">
          GitHub 저장소
        </a>
      </Button>
    </aside>
  );
}

function MeasurementList({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <div className="border-border bg-card rounded-md border p-4">
      <dl className="grid gap-3">
        {items.map((item) => (
          <div key={item.label} className="grid gap-1 sm:grid-cols-[160px_1fr]">
            <dt className="text-primary text-sm font-semibold">{item.label}</dt>
            <dd className="text-muted-foreground text-sm leading-6 [overflow-wrap:anywhere]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function StateTransitionTable({
  transitions,
}: {
  transitions: NonNullable<PortfolioCase["stateTransitions"]>;
}) {
  return (
    <FoldedContentSection title="Outbox 상태 전이">
      <div className="border-border overflow-hidden rounded-md border">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-card text-muted-foreground">
            <tr>
              <th className="border-border border-b px-3 py-2 font-semibold">
                From
              </th>
              <th className="border-border border-b px-3 py-2 font-semibold">
                To
              </th>
              <th className="border-border border-b px-3 py-2 font-semibold">
                설명
              </th>
            </tr>
          </thead>
          <tbody>
            {transitions.map((transition) => (
              <tr
                key={`${transition.from}-${transition.to}`}
                className="border-border border-b last:border-0"
              >
                <td className="text-foreground px-3 py-3 font-semibold [overflow-wrap:anywhere]">
                  {transition.from}
                </td>
                <td className="text-foreground px-3 py-3 font-semibold [overflow-wrap:anywhere]">
                  {transition.to}
                </td>
                <td className="text-muted-foreground px-3 py-3 leading-6 [overflow-wrap:anywhere]">
                  {transition.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </FoldedContentSection>
  );
}

function ContentSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-foreground text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function FoldedContentSection({
  title,
  children,
  nested = false,
}: {
  title: string;
  children: React.ReactNode;
  nested?: boolean;
}) {
  return (
    <details
      className={
        nested
          ? "border-border bg-card mt-4 rounded-md border p-4"
          : "border-border bg-card rounded-md border p-5"
      }
    >
      <summary className="text-foreground cursor-pointer font-semibold">
        {title}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
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

function FoldedSidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="flex flex-col gap-3">
      <summary className="text-primary cursor-pointer text-sm font-semibold">
        {title}
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function OrderedList({ items }: { items: string[] }) {
  return (
    <ol className="text-muted-foreground mt-4 flex list-decimal flex-col gap-2 pl-5 text-sm leading-7">
      {items.map((item) => (
        <li key={item} className="[overflow-wrap:anywhere]">
          {item}
        </li>
      ))}
    </ol>
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
