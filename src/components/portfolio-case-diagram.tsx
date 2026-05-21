import { Badge } from "@/components/ui/badge";
import { PortfolioCaseVisualDiagram } from "@/components/portfolio-case-visual-diagram";
import type {
  PortfolioCase,
  PortfolioDiagramMarker,
  PortfolioDiagramNodeKind,
} from "@/content/portfolio-cases";
import { cn } from "@/lib/utils";

const markerLabel: Record<PortfolioDiagramMarker, string> = {
  transaction: "트랜잭션 경계",
  async: "비동기 경계",
  failure: "실패/복구 경로",
  source: "최종 기준 데이터",
  pending: "추가 검증 예정",
};

const nodeKindLabel: Record<PortfolioDiagramNodeKind, string> = {
  client: "Client",
  gateway: "Gateway",
  service: "Service",
  transaction: "Transaction",
  broker: "Broker",
  database: "DB",
  cache: "Cache",
  worker: "Worker",
  ledger: "Ledger",
  external: "External",
};

const flowCellClass =
  "block py-2 before:mb-1 before:block before:text-xs before:font-semibold before:text-muted-foreground md:table-cell md:px-3 md:py-3 md:before:hidden [overflow-wrap:anywhere]";

export function PortfolioCaseDiagram({
  portfolioCase,
}: {
  portfolioCase: PortfolioCase;
}) {
  const diagram = portfolioCase.diagram;
  const flowRows = diagram.edges.map((edge) => ({
    edge,
    from: diagram.nodes.find((node) => node.id === edge.from),
    to: diagram.nodes.find((node) => node.id === edge.to),
  }));

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

      <PortfolioCaseVisualDiagram diagram={portfolioCase.visualDiagram} />

      <ArchitectureSummary summary={portfolioCase.architectureSummary} />

      <section className="border-border bg-background flex flex-col gap-3 rounded-md border p-4">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
          흐름 세부
        </h3>

        <div className="border-border rounded-md border">
          <table className="block w-full border-collapse text-left text-sm md:table">
            <thead className="bg-card text-muted-foreground sr-only md:not-sr-only md:table-header-group">
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
                <th className="border-border border-b px-3 py-2 font-semibold">
                  표식
                </th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group">
              {flowRows.map(({ edge, from, to }) => (
                <tr
                  key={edge.id}
                  className="border-border bg-card m-3 block rounded-md border p-3 last:mb-3 md:m-0 md:table-row md:rounded-none md:border-0 md:border-b md:bg-transparent md:p-0 md:last:border-b-0"
                >
                  <td
                    data-label="From"
                    className={cn(
                      flowCellClass,
                      "text-foreground font-medium before:content-[attr(data-label)]",
                    )}
                  >
                    {from?.label}
                  </td>
                  <td
                    data-label="To"
                    className={cn(
                      flowCellClass,
                      "text-foreground font-medium before:content-[attr(data-label)]",
                    )}
                  >
                    {to?.label}
                  </td>
                  <td
                    data-label="설명"
                    className={cn(
                      flowCellClass,
                      "text-muted-foreground before:content-[attr(data-label)]",
                    )}
                  >
                    {edge.label}
                  </td>
                  <td
                    data-label="표식"
                    className={cn(
                      flowCellClass,
                      "before:content-[attr(data-label)]",
                    )}
                  >
                    <MarkerBadges markers={edge.markers} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <details className="border-border bg-background rounded-md border p-4">
        <summary className="text-foreground cursor-pointer text-sm font-semibold">
          구성 요소 설명
        </summary>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {diagram.nodes.map((node) => (
            <div
              key={node.id}
              className={cn(
                "border-border bg-card flex min-h-36 flex-col gap-3 rounded-md border p-4",
                node.markers?.includes("source")
                  ? "border-primary/45 bg-primary/5"
                  : null,
                node.markers?.includes("pending") ? "border-dashed" : null,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-2">
                  <Badge variant="outline" className="w-fit rounded-md">
                    {nodeKindLabel[node.kind]}
                  </Badge>
                  <h3 className="text-foreground leading-6 font-semibold [overflow-wrap:anywhere]">
                    {node.label}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-6 [overflow-wrap:anywhere]">
                {node.description}
              </p>
              <MarkerBadges markers={node.markers} />
            </div>
          ))}
        </div>
      </details>
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

function MarkerBadges({ markers }: { markers?: PortfolioDiagramMarker[] }) {
  if (!markers?.length) {
    return <span className="text-muted-foreground text-xs">-</span>;
  }

  return (
    <ul aria-label="표식" className="flex flex-wrap items-center gap-2">
      {markers.map((marker, index) => (
        <li key={marker} className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-md text-[11px]">
            {markerLabel[marker]}
          </Badge>
          {index < markers.length - 1 ? (
            <span className="text-muted-foreground text-xs">·</span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
