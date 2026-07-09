import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

import { ArchitectureExplorer } from "@/components/architecture-explorer";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { caseStudies, type CaseStudy } from "@/content/portfolio-cases";
import {
  getEvidenceByIds,
  type Evidence,
  type ProjectSummary,
} from "@/content/projects";

export function CaseStudyArticle({
  caseStudy,
  project,
}: {
  caseStudy: CaseStudy;
  project: ProjectSummary;
}) {
  const heroEvidence = getEvidenceByIds(caseStudy.heroEvidenceIds);
  const evidence = getEvidenceByIds(caseStudy.evidenceIds);
  const currentIndex = caseStudies.findIndex(
    (candidate) => candidate.slug === caseStudy.slug,
  );
  const previous = currentIndex > 0 ? caseStudies[currentIndex - 1] : undefined;
  const next =
    currentIndex < caseStudies.length - 1
      ? caseStudies[currentIndex + 1]
      : undefined;

  return (
    <article className="page-shell py-8 md:py-14">
      <nav aria-label="현재 위치" className="mb-8">
        <ol className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
          <li>
            <Link
              href="/case-studies"
              prefetch={false}
              className="hover:text-foreground flex min-h-11 items-center hover:underline"
            >
              문제 해결 사례
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">
            {caseStudy.title}
          </li>
        </ol>
      </nav>

      <header className="border-border grid gap-8 border-b pb-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end lg:gap-14">
        <div className="hero-sequence grid max-w-4xl gap-5">
          <p className="section-kicker">
            {project.title} / {project.domain}
          </p>
          <h1 className="heading-wrap text-foreground text-[clamp(2.35rem,7vw,4.8rem)] leading-[1.04] font-bold tracking-[-0.055em]">
            {caseStudy.title}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-lg leading-8 md:text-xl">
            {caseStudy.summary}
          </p>
        </div>
        <div className="grid gap-3">
          <p className="text-muted-foreground text-sm leading-6">
            핵심 구현과 검증 파일은 저장소의 고정 permalink로 연결합니다.
          </p>
          <Button asChild variant="outline">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${caseStudy.title} GitHub 저장소 (새 창)`}
            >
              GitHub 저장소
              <ExternalLink aria-hidden="true" />
            </a>
          </Button>
        </div>
      </header>

      {heroEvidence.length > 0 ? (
        <section
          aria-labelledby="hero-evidence-title"
          className="border-border grid border-b md:grid-cols-3"
        >
          <h2 id="hero-evidence-title" className="sr-only">
            핵심 근거
          </h2>
          {heroEvidence.map((item) => (
            <div
              key={item.id}
              className="border-border grid content-start gap-3 border-b py-6 last:border-b-0 md:min-h-44 md:border-r md:border-b-0 md:px-6 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-foreground text-sm font-semibold">
                  {item.label}
                </p>
                <StatusBadge status={item.status} />
              </div>
              <p className="text-primary font-mono text-lg font-bold tracking-tight [overflow-wrap:anywhere]">
                {item.value}
              </p>
              <p className="text-muted-foreground text-xs leading-5">
                {formatEvidenceContext(item)}
              </p>
            </div>
          ))}
        </section>
      ) : null}

      <div className="grid gap-14 py-12 md:gap-20 md:py-16">
        <ArchitectureExplorer architecture={caseStudy.architecture} />

        <div className="grid gap-12 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-8 lg:self-start">
            <p className="section-kicker">Design review</p>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              문제를 좁히고, 실패 경계를 분리한 뒤, 재현 가능한 결과만
              남겼습니다.
            </p>
          </div>
          <div className="grid gap-12">
            <CaseSection title="문제" items={caseStudy.problem} />
            <CaseSection
              title="단순 구현에서의 문제"
              items={caseStudy.naiveApproach}
            />
            <CaseSection title="설계 판단" items={caseStudy.decisions} />
            <CaseSection title="검증 결과" items={caseStudy.results} />
          </div>
        </div>

        <section aria-labelledby="evidence-title" className="grid gap-6">
          <div>
            <p className="section-kicker">Evidence</p>
            <h2
              id="evidence-title"
              className="text-foreground mt-2 text-2xl font-bold tracking-tight md:text-3xl"
            >
              검증 근거
            </h2>
          </div>
          <div className="border-border border-t">
            {evidence.map((item) => (
              <EvidenceRow key={item.id} evidence={item} />
            ))}
          </div>
        </section>

        <section aria-label="추가 검토 항목" className="grid gap-3">
          <FoldedSection title="한계와 다음 확인">
            <GroupedList title="현재 한계" items={caseStudy.limitations} />
            <GroupedList title="다음 확인" items={caseStudy.nextValidation} />
          </FoldedSection>
          <FoldedSection title="예상 면접 질문">
            <ul className="grid gap-3">
              {caseStudy.interviewQuestions.map((question) => (
                <li
                  key={question}
                  className="border-primary text-foreground border-l-2 pl-4 text-sm leading-6"
                >
                  {question}
                </li>
              ))}
            </ul>
          </FoldedSection>
        </section>
      </div>

      <nav
        aria-label="사례 이동"
        className="border-border grid gap-4 border-t pt-8 sm:grid-cols-[1fr_auto_1fr] sm:items-center"
      >
        {previous ? (
          <Link
            href={`/case-studies/${previous.slug}`}
            prefetch={false}
            className="text-muted-foreground hover:text-primary flex min-h-11 items-center gap-2 text-sm font-semibold"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            <span>이전: {previous.title}</span>
          </Link>
        ) : (
          <span />
        )}
        <Link
          href="/case-studies"
          prefetch={false}
          className="text-primary flex min-h-11 items-center justify-center text-sm font-semibold hover:underline"
        >
          사례 목록
        </Link>
        {next ? (
          <Link
            href={`/case-studies/${next.slug}`}
            prefetch={false}
            className="text-muted-foreground hover:text-primary flex min-h-11 items-center justify-end gap-2 text-right text-sm font-semibold"
          >
            <span>다음: {next.title}</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

function CaseSection({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="border-border grid gap-4 border-t pt-6">
      <h2 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">
        {title}
      </h2>
      <ul className="grid gap-3">
        {items.map((item) => (
          <li
            key={item}
            className="text-muted-foreground grid grid-cols-[0.6rem_1fr] gap-3 text-base leading-7"
          >
            <span
              aria-hidden="true"
              className="bg-primary mt-[0.7rem] size-1.5 rounded-full"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EvidenceRow({ evidence }: { evidence: Evidence }) {
  return (
    <article className="border-border grid gap-4 border-b py-5 md:grid-cols-[10rem_minmax(0,1fr)_auto] md:items-start md:gap-6">
      <div className="grid justify-items-start gap-2">
        <StatusBadge status={evidence.status} />
        <span className="text-muted-foreground font-mono text-[0.68rem] font-semibold tracking-[0.1em] uppercase">
          {evidence.scope}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="text-foreground font-semibold">{evidence.label}</h3>
        <p className="text-primary mt-1 font-mono text-sm font-semibold [overflow-wrap:anywhere]">
          {evidence.value}
        </p>
        <p className="text-muted-foreground mt-2 text-sm leading-6">
          {formatEvidenceContext(evidence)}
        </p>
        {evidence.source.command ? (
          <code className="bg-muted text-foreground mt-2 block w-fit max-w-full px-2 py-1 font-mono text-xs [overflow-wrap:anywhere]">
            {evidence.source.command}
          </code>
        ) : null}
      </div>
      <a
        href={evidence.source.permalink}
        target="_blank"
        rel="noreferrer"
        className="text-primary hover:text-accent-foreground flex min-h-11 items-center text-sm font-semibold hover:underline"
        aria-label={`${evidence.label} 근거 파일 (새 창)`}
      >
        근거 파일
        <ExternalLink className="ml-1 size-4" aria-hidden="true" />
      </a>
    </article>
  );
}

function formatEvidenceContext(evidence: Evidence) {
  if (evidence.status === "measured") {
    return [evidence.measuredAt, evidence.scenario, evidence.environment]
      .filter(Boolean)
      .join(" · ");
  }

  return evidence.method;
}

function FoldedSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-border bg-card open:border-primary border-y">
      <summary className="text-foreground flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold marker:hidden">
        {title}
        <span
          aria-hidden="true"
          className="text-primary font-mono text-xl transition-transform group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="border-border grid gap-6 border-t py-5">{children}</div>
    </details>
  );
}

function GroupedList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-muted-foreground font-mono text-xs font-semibold tracking-[0.12em] uppercase">
        {title}
      </h3>
      <ul className="text-foreground mt-3 grid gap-2 text-sm leading-6">
        {items.map((item) => (
          <li key={item}>— {item}</li>
        ))}
      </ul>
    </div>
  );
}
