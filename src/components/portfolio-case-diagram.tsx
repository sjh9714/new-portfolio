import { Badge } from "@/components/ui/badge";
import { ArchitectureFigure } from "@/components/architecture/architecture-figure";
import type {
  PortfolioCase,
  PortfolioDiagramMarker,
} from "@/content/portfolio-cases";

const markerLabel: Record<PortfolioDiagramMarker, string> = {
  transaction: "트랜잭션 경계",
  async: "비동기 경계",
  failure: "실패/복구 경로",
  source: "최종 기준 데이터",
  pending: "추가 검증 예정",
};

export function PortfolioCaseDiagram({
  portfolioCase,
}: {
  portfolioCase: PortfolioCase;
}) {
  const diagram = portfolioCase.diagram;

  return (
    <section className="border-border bg-card flex flex-col gap-5 rounded-md border p-4 md:p-5">
      <div className="flex flex-col gap-2">
        <h2 className="text-foreground text-xl font-semibold tracking-tight">
          문제 구간 아키텍처
        </h2>
        <p className="text-muted-foreground text-sm leading-6">
          {diagram.summary}
        </p>
      </div>

      <ArchitectureFigure architecture={portfolioCase.problemArchitecture} />

      <section className="border-border bg-background flex flex-col gap-3 rounded-md border p-4">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
          그림 읽는 법
        </h3>
        <ol className="grid list-decimal gap-2 pl-5 text-sm leading-6">
          {portfolioCase.problemArchitecture.readingGuide.map((guide) => (
            <li
              key={guide}
              className="text-foreground [overflow-wrap:anywhere]"
            >
              {guide}
            </li>
          ))}
        </ol>
      </section>

      <div className="border-border bg-background flex flex-col gap-3 rounded-md border p-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
          범례
        </p>
        <ul
          aria-label="구조도 범례"
          className="flex flex-wrap items-center gap-2"
        >
          {Object.values(markerLabel).map((label, index, labels) => (
            <li key={label} className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-md">
                {label}
              </Badge>
              {index < labels.length - 1 ? (
                <span className="text-muted-foreground text-xs">·</span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <ArchitectureSummary summary={portfolioCase.architectureSummary} />
    </section>
  );
}

function ArchitectureSummary({
  summary,
}: {
  summary: PortfolioCase["architectureSummary"];
}) {
  const items = [
    {
      key: "sourceOfTruth",
      label: "최종 기준 데이터",
      value: summary.sourceOfTruth,
    },
    {
      key: "transactionBoundary",
      label: "트랜잭션 경계",
      value: summary.transactionBoundary,
    },
    {
      key: "asyncBoundary",
      label: "비동기 경계",
      value: summary.asyncBoundary,
    },
    {
      key: "failureRecoveryPath",
      label: "실패/복구 경로",
      value: summary.failureRecoveryPath,
    },
    {
      key: "designReason",
      label: "선택 이유",
      value: summary.designReason,
    },
  ].filter((item) => item.value);

  if (!items.length) {
    return null;
  }

  return (
    <section className="border-border bg-background flex flex-col gap-3 rounded-md border p-4">
      <h3 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
        아키텍처 판단 요약
      </h3>
      <dl className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.key}
            className="border-border bg-card rounded-md border p-3"
          >
            <dt className="text-primary text-xs font-semibold">{item.label}</dt>
            <dd className="text-foreground mt-1 text-sm leading-6 [overflow-wrap:anywhere]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
