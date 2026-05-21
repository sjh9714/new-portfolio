import {
  AlertTriangle,
  ArrowRight,
  Database,
  GitBranch,
  RefreshCw,
  Repeat2,
} from "lucide-react";

import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  architectureDiagrams,
  type ArchitectureBoundaryKind,
  type ArchitectureDiagramSpec,
  type ArchitectureEdge,
  type ArchitectureEdgeKind,
  type ArchitectureNodeKind,
} from "@/content/architecture-diagrams";
import { cn } from "@/lib/utils";

const nodeKindLabel: Record<ArchitectureNodeKind, string> = {
  client: "Client",
  gateway: "Gateway",
  service: "Service",
  worker: "Worker",
  broker: "Broker",
  database: "DB",
  cache: "Cache",
  ledger: "Ledger",
  external: "External",
};

const edgeKindLabel: Record<ArchitectureEdgeKind, string> = {
  sync: "동기 호출",
  async: "비동기 경계",
  transaction: "트랜잭션 경계",
  failure: "실패/복구 경로",
  retry: "재시도",
  replay: "재처리",
  compensation: "보상 처리",
};

const boundaryKindLabel: Record<ArchitectureBoundaryKind, string> = {
  transaction: "트랜잭션 경계",
  async: "비동기 경계",
  failure: "실패/복구 경로",
  source: "최종 기준 데이터",
  service: "서비스 경계",
};

const edgeIcons: Record<ArchitectureEdgeKind, typeof ArrowRight> = {
  sync: ArrowRight,
  async: GitBranch,
  transaction: Database,
  failure: AlertTriangle,
  retry: RefreshCw,
  replay: Repeat2,
  compensation: RefreshCw,
};

export function ArchitectureDiagram({ slug }: { slug: string }) {
  const diagram = architectureDiagrams[slug];

  if (!diagram) {
    return null;
  }

  return <ArchitectureDiagramView diagram={diagram} />;
}

function ArchitectureDiagramView({
  diagram,
}: {
  diagram: ArchitectureDiagramSpec;
}) {
  const primaryEdges = diagram.edges.filter(
    (edge) =>
      edge.kind === "sync" ||
      edge.kind === "transaction" ||
      edge.kind === "async",
  );
  const recoveryEdges = diagram.edges.filter(
    (edge) =>
      edge.kind === "failure" ||
      edge.kind === "retry" ||
      edge.kind === "replay" ||
      edge.kind === "compensation",
  );

  return (
    <div className="border-border bg-card flex flex-col gap-5 rounded-md border p-4 md:p-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground text-lg font-semibold">
          {diagram.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-6">
          {diagram.summary}
        </p>
      </div>

      <div
        className="border-border bg-background flex flex-col gap-3 rounded-md border p-3"
        aria-label="구조도 범례"
      >
        <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
          범례
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-2" role="list">
          {[
            "트랜잭션 경계",
            "비동기 경계",
            "실패/복구 경로",
            "최종 기준 데이터",
            "추가 검증 예정",
          ].map((label) => (
            <Badge
              key={label}
              variant="outline"
              className="rounded-md"
              role="listitem"
            >
              {label}
            </Badge>
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h4 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
          시스템 흐름
        </h4>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {diagram.nodes.map((node) => (
            <div
              key={node.id}
              className={cn(
                "bg-background flex min-h-32 flex-col gap-3 rounded-md border p-4",
                node.sourceOfTruth
                  ? "border-primary/45 bg-primary/5"
                  : "border-border",
                node.status === "pending" ? "border-dashed" : null,
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <Badge variant="outline" className="w-fit rounded-md">
                    {nodeKindLabel[node.kind]}
                  </Badge>
                  <h5 className="text-foreground leading-6 font-semibold [overflow-wrap:anywhere]">
                    {node.label}
                  </h5>
                </div>
                {node.status ? <StatusBadge status={node.status} /> : null}
              </div>
              <p className="text-muted-foreground text-sm leading-6 [overflow-wrap:anywhere]">
                {node.description}
              </p>
              {node.sourceOfTruth ? (
                <span className="text-primary mt-auto text-xs font-semibold tracking-[0.16em] uppercase">
                  최종 기준 데이터
                </span>
              ) : null}
              {node.status === "pending" ? (
                <span className="text-muted-foreground mt-auto text-xs font-semibold tracking-[0.16em] uppercase">
                  추가 검증 예정
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <EdgePanel title="주요 흐름" diagram={diagram} edges={primaryEdges} />
        <EdgePanel
          title="실패/복구 경로"
          diagram={diagram}
          edges={recoveryEdges}
          emptyText="장애 복구 경로는 경계와 검토 포인트에서 별도로 설명합니다."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="border-border bg-background flex flex-col gap-3 rounded-md border p-4">
          <h4 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
            경계
          </h4>
          <div className="flex flex-col gap-2">
            {diagram.boundaries.map((boundary) => (
              <div
                key={boundary.id}
                className="border-border bg-card rounded-md border p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-foreground font-medium">
                    {boundary.label}
                  </p>
                  <Badge variant="outline" className="rounded-md">
                    {boundaryKindLabel[boundary.kind]}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 text-xs leading-5 [overflow-wrap:anywhere]">
                  {boundary.nodeIds.join(" / ")}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-border bg-background flex flex-col gap-3 rounded-md border p-4">
          <h4 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
            검토 포인트
          </h4>
          {diagram.callouts.map((callout) => (
            <div key={callout.label} className="flex flex-col gap-1">
              <p className="text-foreground font-medium">{callout.label}</p>
              <p className="text-muted-foreground text-sm leading-6 [overflow-wrap:anywhere]">
                {callout.description}
              </p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

function EdgePanel({
  title,
  diagram,
  edges,
  emptyText,
}: {
  title: string;
  diagram: ArchitectureDiagramSpec;
  edges: ArchitectureEdge[];
  emptyText?: string;
}) {
  return (
    <section className="border-border bg-background flex flex-col gap-3 rounded-md border p-4">
      <h4 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
        {title}
      </h4>
      <div className="flex flex-col gap-2">
        {edges.length > 0 ? (
          edges.map((edge) => {
            const from = diagram.nodes.find((node) => node.id === edge.from);
            const to = diagram.nodes.find((node) => node.id === edge.to);
            const Icon = edgeIcons[edge.kind];

            return (
              <div
                key={edge.id}
                className="border-border bg-card flex flex-col gap-2 rounded-md border px-3 py-2 text-sm"
              >
                <div className="text-foreground flex flex-wrap items-center gap-2 font-medium">
                  <span className="[overflow-wrap:anywhere]">
                    {from?.label}
                  </span>
                  <ArrowRight aria-hidden="true" className="size-4" />
                  <span className="[overflow-wrap:anywhere]">{to?.label}</span>
                </div>
                <div className="text-muted-foreground flex flex-wrap items-center gap-2">
                  <Icon aria-hidden="true" className="size-4" />
                  <span className="[overflow-wrap:anywhere]">{edge.label}</span>
                  <Badge variant="outline" className="rounded-md">
                    {edgeKindLabel[edge.kind]}
                  </Badge>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm leading-6">{emptyText}</p>
        )}
      </div>
    </section>
  );
}
