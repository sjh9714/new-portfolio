export type Port = "top" | "right" | "bottom" | "left";

export type NodeKind =
  | "external"
  | "gateway"
  | "service"
  | "transaction"
  | "broker"
  | "database"
  | "cache"
  | "worker"
  | "ledger"
  | "failure"
  | "note";

export type EdgeKind = "sync" | "async" | "failure" | "replay";

export type Point = {
  x: number;
  y: number;
};

export type Box = Point & {
  w: number;
  h: number;
};

export type DiagramNode = Box & {
  id: string;
  title: string;
  lines: string[];
  kind: NodeKind;
};

export type DiagramEdge = {
  id: string;
  from: string;
  to: string;
  fromPort: Port;
  toPort: Port;
  label?: string;
  kind: EdgeKind;
  via?: Point[];
  labelPosition?: Point;
};

export type DiagramContainer = Box & {
  id: string;
  title: string;
};

export type DiagramSpec = {
  slug: string;
  outputFile: string;
  sourceFile: string;
  title: string;
  description: string;
  width: number;
  height: number;
  containers?: DiagramContainer[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};
