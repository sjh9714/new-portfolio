import { PortfolioCaseDiagram } from "@/components/portfolio-case-diagram";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPortfolioCaseProjectBadge,
  type PortfolioCase,
} from "@/content/portfolio-cases";
import type { Project, ProjectEvidence } from "@/content/projects";

export function CaseStudyArticle({
  portfolioCase,
  project,
}: {
  portfolioCase: PortfolioCase;
  project: Project;
}) {
  const heroEvidence = portfolioCase.primaryEvidenceLabels
    ? selectEvidenceByLabels(portfolioCase, portfolioCase.primaryEvidenceLabels)
    : portfolioCase.evidence;
  const heroStatus = heroEvidence[0]?.status;

  return (
    <article className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-12 md:px-8 md:py-16">
      <header className="border-border flex flex-col gap-5 border-b pb-8">
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.18em] uppercase">
            문제 해결 포트폴리오 / {portfolioCase.domain}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {heroStatus ? <StatusBadge status={heroStatus} /> : null}
            <Badge variant="outline" className="rounded-md">
              {getPortfolioCaseProjectBadge(portfolioCase)}
            </Badge>
          </div>
          <h1 className="text-foreground max-w-4xl text-4xl leading-tight font-bold tracking-tight [text-wrap:balance] [word-break:keep-all] md:text-5xl">
            {portfolioCase.displayTitle}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg leading-8 [word-break:keep-all]">
            {portfolioCase.resumeLine}
          </p>
        </div>
        <HeroMetricStrip metrics={portfolioCase.heroMetrics} />
        <MethodTagList tags={portfolioCase.methodTags} />
        <CompactMetaRow portfolioCase={portfolioCase} project={project} />
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

          <ImplementationPointSection portfolioCase={portfolioCase} />

          {portfolioCase.stateTransitions?.length ? (
            <StateTransitionTable
              transitions={portfolioCase.stateTransitions}
            />
          ) : null}

          <GitHubEvidenceLink project={project} />
        </section>

        <CaseStudySidebar portfolioCase={portfolioCase} project={project} />
      </div>
    </article>
  );
}

function HeroMetricStrip({
  metrics,
}: {
  metrics?: PortfolioCase["heroMetrics"];
}) {
  if (!metrics?.length) {
    return null;
  }

  return (
    <div
      aria-label="핵심 결과"
      className="grid gap-2 sm:grid-cols-3 lg:max-w-3xl"
    >
      {metrics.map((metric) => (
        <div
          key={`${metric.label}-${metric.value}`}
          className="border-border bg-card rounded-md border px-4 py-3"
        >
          <p className="text-primary text-xs font-semibold">{metric.label}</p>
          <p className="text-foreground mt-1 text-sm leading-6 font-semibold [overflow-wrap:anywhere]">
            {metric.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function MethodTagList({ tags }: { tags: string[] }) {
  if (!tags.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-primary text-xs font-semibold">해결 키워드</span>
      {tags.map((tag) => (
        <Badge key={tag} variant="outline" className="rounded-md">
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function CompactMetaRow({
  portfolioCase,
  project,
}: {
  portfolioCase: PortfolioCase;
  project: Project;
}) {
  const visibleTechStack = project.primaryTechStack.slice(0, 5);
  const metaItems = [
    ["프로젝트", project.title],
    ["참여", project.team ?? project.role],
    ...(project.period ? [["기간", project.period]] : []),
    ["기술", visibleTechStack.join(" · ")],
  ];

  return (
    <dl
      aria-label={`${portfolioCase.displayTitle} 메타 정보`}
      className="border-border bg-card text-muted-foreground flex flex-wrap gap-x-4 gap-y-2 rounded-md border px-4 py-3 text-sm leading-6"
    >
      {metaItems.map(([label, value]) => (
        <div key={label} className="flex min-w-0 gap-1">
          <dt className="text-primary shrink-0 font-semibold">{label}</dt>
          <dd className="text-foreground min-w-0 [overflow-wrap:anywhere]">
            {value}
          </dd>
        </div>
      ))}
    </dl>
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
  const primaryEvidence = portfolioCase.primaryEvidenceLabels
    ? selectEvidenceByLabels(portfolioCase, portfolioCase.primaryEvidenceLabels)
    : portfolioCase.evidence;
  const referenceEvidence = selectEvidenceByLabels(
    portfolioCase,
    portfolioCase.referenceEvidenceLabels ?? [],
  );

  return (
    <ContentSection title="검증 근거">
      <div className="grid gap-3">
        {primaryEvidence.map((evidence) => renderEvidenceCard(evidence))}
      </div>

      {referenceEvidence.length ? (
        <div className="grid gap-3">
          {referenceEvidence.map((evidence) =>
            renderReferenceEvidence(
              evidence,
              portfolioCase.referenceEvidenceTitle ?? "참고 기록",
            ),
          )}
        </div>
      ) : null}
    </ContentSection>
  );
}

function selectEvidenceByLabels(
  portfolioCase: PortfolioCase,
  labels: string[],
) {
  return labels.map((label) => {
    const evidence = portfolioCase.evidence.find(
      (item) => item.label === label,
    );

    if (!evidence) {
      throw new Error(
        `Missing evidence "${label}" on portfolio case "${portfolioCase.slug}"`,
      );
    }

    return evidence;
  });
}

function renderEvidenceCard(
  evidence: ProjectEvidence,
  options?: { badgeLabel?: string },
) {
  return (
    <div
      key={evidence.label}
      className="border-border bg-card rounded-md border p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-foreground font-semibold [overflow-wrap:anywhere]">
          {evidence.label}
        </h3>
        {options?.badgeLabel ? (
          <Badge variant="outline" className="shrink-0 rounded-md">
            {options.badgeLabel}
          </Badge>
        ) : (
          <StatusBadge status={evidence.status} />
        )}
      </div>
      <p className="text-muted-foreground mt-2 text-sm leading-6 [overflow-wrap:anywhere]">
        {evidence.value}
      </p>
    </div>
  );
}

function renderReferenceEvidence(evidence: ProjectEvidence, title: string) {
  return renderEvidenceCard(evidence, { badgeLabel: title });
}

function ImplementationPointSection({
  portfolioCase,
}: {
  portfolioCase: PortfolioCase;
}) {
  if (!portfolioCase.implementationDetails.length) {
    return null;
  }

  return (
    <ContentSection title="구현 포인트">
      <div className="border-border bg-card rounded-md border p-5">
        <OrderedList items={portfolioCase.implementationDetails.slice(0, 3)} />
      </div>
    </ContentSection>
  );
}

function GitHubEvidenceLink({ project }: { project: Project }) {
  return (
    <section className="border-border bg-card flex flex-col gap-3 rounded-md border p-5">
      <p className="text-muted-foreground text-sm leading-6">
        세부 테스트, guard, raw artifact는 GitHub README와 docs에 정리했습니다.
      </p>
      <Button asChild className="w-fit">
        <a href={project.repoUrl} target="_blank" rel="noreferrer">
          GitHub 근거 보기
        </a>
      </Button>
    </section>
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
      aria-label={`${portfolioCase.displayTitle} 요약`}
      className="border-border bg-card flex flex-col gap-6 rounded-md border p-5 lg:sticky lg:top-6"
    >
      <SidebarSection title="한계와 다음 검증">
        <SidebarList items={portfolioCase.limitations} />
      </SidebarSection>

      <FoldedSidebarSection title="예상 면접 질문">
        <SidebarList items={portfolioCase.interviewQuestions} />
      </FoldedSidebarSection>

      <Button asChild className="w-full">
        <a href={project.repoUrl} target="_blank" rel="noreferrer">
          GitHub 근거 보기
        </a>
      </Button>
    </aside>
  );
}

function StateTransitionTable({
  transitions,
}: {
  transitions: NonNullable<PortfolioCase["stateTransitions"]>;
}) {
  return (
    <ContentSection title="Outbox 상태 전이">
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
    </ContentSection>
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
