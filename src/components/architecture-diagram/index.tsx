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
  sync: "sync",
  async: "async",
  transaction: "tx",
  failure: "failure",
  retry: "retry",
  replay: "replay",
  compensation: "compensation",
};

const boundaryKindLabel: Record<ArchitectureBoundaryKind, string> = {
  transaction: "transaction",
  async: "async",
  failure: "failure",
  source: "source of truth",
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
  return (
    <div className="border-border bg-background flex flex-col gap-5 rounded-md border p-4 md:p-5">
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground text-lg font-semibold">
          {diagram.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-6">
          {diagram.summary}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {diagram.nodes.map((node) => (
          <div
            key={node.id}
            className={cn(
              "bg-card flex min-h-36 flex-col gap-3 rounded-md border p-4",
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
                <h4 className="text-foreground leading-6 font-semibold">
                  {node.label}
                </h4>
              </div>
              {node.status ? <StatusBadge status={node.status} /> : null}
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              {node.description}
            </p>
            {node.sourceOfTruth ? (
              <span className="text-primary mt-auto text-xs font-semibold tracking-[0.16em] uppercase">
                Source of truth
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <section className="border-border bg-card flex flex-col gap-3 rounded-md border p-4">
          <h4 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
            Edges / Recovery Paths
          </h4>
          <div className="flex flex-col gap-2">
            {diagram.edges.map((edge) => {
              const from = diagram.nodes.find((node) => node.id === edge.from);
              const to = diagram.nodes.find((node) => node.id === edge.to);
              const Icon = edgeIcons[edge.kind];

              return (
                <div
                  key={edge.id}
                  className="border-border bg-background grid gap-2 rounded-md border px-3 py-2 text-sm md:grid-cols-[1fr_auto_1fr] md:items-center"
                >
                  <span className="text-foreground font-medium">
                    {from?.label}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Icon aria-hidden="true" className="size-4" />
                    <span>{edge.label}</span>
                    <Badge variant="outline" className="rounded-md">
                      {edgeKindLabel[edge.kind]}
                    </Badge>
                  </span>
                  <span className="text-foreground font-medium">
                    {to?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="border-border bg-card flex flex-col gap-3 rounded-md border p-4">
            <h4 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
              Boundaries
            </h4>
            <div className="flex flex-col gap-2">
              {diagram.boundaries.map((boundary) => (
                <div
                  key={boundary.id}
                  className="border-border bg-background rounded-md border p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-foreground font-medium">
                      {boundary.label}
                    </p>
                    <Badge variant="outline" className="rounded-md">
                      {boundaryKindLabel[boundary.kind]}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs leading-5">
                    {boundary.nodeIds.join(" / ")}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="border-border bg-card flex flex-col gap-3 rounded-md border p-4">
            <h4 className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
              Review Callouts
            </h4>
            {diagram.callouts.map((callout) => (
              <div key={callout.label} className="flex flex-col gap-1">
                <p className="text-foreground font-medium">{callout.label}</p>
                <p className="text-muted-foreground text-sm leading-6">
                  {callout.description}
                </p>
              </div>
            ))}
          </section>
        </aside>
      </div>
    </div>
  );
}
