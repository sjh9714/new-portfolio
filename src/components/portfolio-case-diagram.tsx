import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
          구조와 흐름
        </h2>
        <p className="text-muted-foreground text-sm leading-6">
          {diagram.summary}
        </p>
      </div>

      <div className="border-border bg-background flex flex-col gap-3 rounded-md border p-3">
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
          범례
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.values(markerLabel).map((label) => (
            <Badge key={label} variant="outline" className="rounded-md">
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {diagram.nodes.map((node) => (
          <div
            key={node.id}
            className={cn(
              "border-border bg-background flex min-h-36 flex-col gap-3 rounded-md border p-4",
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
            {node.markers && node.markers.length > 0 ? (
              <div className="mt-auto flex flex-wrap gap-2">
                {node.markers.map((marker) => (
                  <Badge
                    key={marker}
                    variant="outline"
                    className="rounded-md text-[11px]"
                  >
                    {markerLabel[marker]}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <section className="border-border bg-background flex flex-col gap-3 rounded-md border p-4">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
          요청/복구 흐름
        </h3>
        <div className="grid gap-2">
          {diagram.edges.map((edge) => {
            const from = diagram.nodes.find((node) => node.id === edge.from);
            const to = diagram.nodes.find((node) => node.id === edge.to);

            return (
              <div
                key={edge.id}
                className="border-border bg-card flex flex-col gap-2 rounded-md border px-3 py-3 text-sm"
              >
                <div className="text-foreground flex flex-wrap items-center gap-2 font-medium">
                  <span className="[overflow-wrap:anywhere]">
                    {from?.label}
                  </span>
                  <ArrowRight aria-hidden="true" className="size-4" />
                  <span className="[overflow-wrap:anywhere]">{to?.label}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted-foreground [overflow-wrap:anywhere]">
                    {edge.label}
                  </span>
                  {edge.markers?.map((marker) => (
                    <Badge
                      key={marker}
                      variant="outline"
                      className="rounded-md text-[11px]"
                    >
                      {markerLabel[marker]}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
