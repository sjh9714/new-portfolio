import { Badge } from "@/components/ui/badge";
import type {
  PortfolioBeforeAfterColumn,
  PortfolioDiagramMarker,
  PortfolioVisualDiagram,
  PortfolioVisualDiagramEdge,
  PortfolioVisualDiagramNode,
} from "@/content/portfolio-cases";
import { cn } from "@/lib/utils";

const markerLabel: Record<PortfolioDiagramMarker, string> = {
  transaction: "트랜잭션 경계",
  async: "비동기 경계",
  failure: "실패/복구 경로",
  source: "최종 기준 데이터",
  pending: "추가 검증 예정",
};

export function PortfolioCaseVisualDiagram({
  diagram,
}: {
  diagram: PortfolioVisualDiagram;
}) {
  return (
    <figure
      aria-label={`한눈에 보는 구조: ${diagram.title}`}
      className="border-border bg-background flex flex-col gap-4 rounded-md border p-4"
    >
      <figcaption className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm font-semibold tracking-[0.16em] uppercase">
          한눈에 보는 구조
        </span>
        <h3 className="text-foreground text-lg font-semibold tracking-tight">
          {diagram.title}
        </h3>
        {diagram.summary ? (
          <p className="text-muted-foreground text-sm leading-6">
            {diagram.summary}
          </p>
        ) : null}
      </figcaption>

      {diagram.type === "flow" ? <FlowVisual diagram={diagram} /> : null}
      {diagram.type === "before-after" ? (
        <BeforeAfterVisual before={diagram.before} after={diagram.after} />
      ) : null}
      {diagram.type === "state-machine" ? (
        <StateMachineVisual
          states={diagram.states}
          transitions={diagram.transitions}
        />
      ) : null}
    </figure>
  );
}

function FlowVisual({
  diagram,
}: {
  diagram: Extract<PortfolioVisualDiagram, { type: "flow" }>;
}) {
  const edgeByFrom = new Map(diagram.edges.map((edge) => [edge.from, edge]));

  return (
    <ul role="list" className="grid list-none gap-3">
      {diagram.nodes.map((node) => {
        const edge = edgeByFrom.get(node.id);
        const nextNode = edge
          ? diagram.nodes.find((candidate) => candidate.id === edge.to)
          : undefined;

        return (
          <li key={node.id} className="grid gap-2">
            <VisualNodeCard node={node} />
            {edge && nextNode ? <VisualConnector edge={edge} /> : null}
          </li>
        );
      })}
    </ul>
  );
}

function VisualNodeCard({ node }: { node: PortfolioVisualDiagramNode }) {
  return (
    <div
      className={cn(
        "border-border bg-card rounded-md border p-4",
        node.markers?.includes("source")
          ? "border-primary/45 bg-primary/5"
          : null,
        node.markers?.includes("pending") ? "border-dashed" : null,
      )}
    >
      <div className="grid gap-2">
        <h4 className="text-foreground font-semibold [overflow-wrap:anywhere]">
          {node.label}
        </h4>
        {node.description ? (
          <p className="text-muted-foreground text-sm leading-6 [overflow-wrap:anywhere]">
            {node.description}
          </p>
        ) : null}
        <MarkerBadges markers={node.markers} />
      </div>
    </div>
  );
}

function VisualConnector({ edge }: { edge: PortfolioVisualDiagramEdge }) {
  return (
    <div className="grid grid-cols-[28px_1fr] items-center gap-3 pl-4">
      <span aria-hidden="true" className="bg-border mx-auto h-8 w-px" />
      <div className="text-muted-foreground border-border bg-card flex flex-wrap items-center gap-2 rounded-md border px-3 py-2 text-xs">
        <span className="text-foreground font-semibold [overflow-wrap:anywhere]">
          {edge.label}
        </span>
        <MarkerBadges markers={edge.markers} compact />
      </div>
    </div>
  );
}

function BeforeAfterVisual({
  before,
  after,
}: {
  before: PortfolioBeforeAfterColumn;
  after: PortfolioBeforeAfterColumn;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BeforeAfterColumn column={before} tone="before" />
      <BeforeAfterColumn column={after} tone="after" />
    </div>
  );
}

function BeforeAfterColumn({
  column,
  tone,
}: {
  column: PortfolioBeforeAfterColumn;
  tone: "before" | "after";
}) {
  return (
    <section
      className={cn(
        "border-border bg-card rounded-md border p-4",
        tone === "after" ? "border-primary/45 bg-primary/5" : null,
      )}
    >
      <h4 className="text-foreground font-semibold">{column.title}</h4>
      <ul role="list" className="mt-4 grid list-none gap-3">
        {column.items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className="border-border bg-background rounded-md border p-3"
          >
            <div className="grid gap-1">
              <span className="text-foreground text-sm font-semibold [overflow-wrap:anywhere]">
                {item.label}
              </span>
              {item.value ? (
                <span className="text-muted-foreground text-xs [overflow-wrap:anywhere]">
                  {item.value}
                </span>
              ) : null}
              <MarkerBadges markers={item.markers} compact />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StateMachineVisual({
  states,
  transitions,
}: {
  states: string[];
  transitions: PortfolioVisualDiagramEdge[];
}) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        {states.map((state) => (
          <Badge key={state} variant="outline" className="rounded-md">
            {state}
          </Badge>
        ))}
      </div>
      <ul role="list" className="grid list-none gap-3 md:grid-cols-2">
        {transitions.map((transition, index) => (
          <li
            key={`${transition.from}-${transition.to}-${index}`}
            className="border-border bg-card rounded-md border p-4"
          >
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
              <span className="text-foreground [overflow-wrap:anywhere]">
                {transition.from}
              </span>
              <span className="text-muted-foreground" aria-hidden="true">
                →
              </span>
              <span className="text-foreground [overflow-wrap:anywhere]">
                {transition.to}
              </span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm leading-6 [overflow-wrap:anywhere]">
              {transition.label}
            </p>
            <MarkerBadges markers={transition.markers} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MarkerBadges({
  markers,
  compact = false,
}: {
  markers?: PortfolioDiagramMarker[];
  compact?: boolean;
}) {
  if (!markers?.length) {
    return null;
  }

  return (
    <ul aria-label="표식" className="flex flex-wrap items-center gap-2">
      {markers.map((marker, index) => (
        <li key={marker} className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn("rounded-md", compact ? "text-[11px]" : "text-xs")}
          >
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
