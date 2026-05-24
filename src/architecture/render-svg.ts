import type {
  Box,
  DiagramEdge,
  DiagramNode,
  DiagramSpec,
  EdgeKind,
  NodeKind,
  Point,
  Port,
} from "./types.ts";

const nodeStyle: Record<
  NodeKind,
  { fill: string; stroke: string; width: number }
> = {
  external: { fill: "#f8fafc", stroke: "#0f172a", width: 1.5 },
  gateway: { fill: "#f8fafc", stroke: "#0f172a", width: 1.5 },
  service: { fill: "#f8fafc", stroke: "#0f172a", width: 1.5 },
  transaction: { fill: "#eff6ff", stroke: "#1d4ed8", width: 2 },
  broker: { fill: "#f8fafc", stroke: "#0f172a", width: 1.5 },
  database: { fill: "#ecfdf5", stroke: "#047857", width: 2 },
  cache: { fill: "#f8fafc", stroke: "#64748b", width: 1.5 },
  worker: { fill: "#f8fafc", stroke: "#0f172a", width: 1.5 },
  ledger: { fill: "#ecfdf5", stroke: "#047857", width: 2 },
  failure: { fill: "#fff7ed", stroke: "#c2410c", width: 1.7 },
  note: { fill: "#fffbeb", stroke: "#b45309", width: 1.6 },
};

const edgeStyle: Record<EdgeKind, { stroke: string; dash?: string }> = {
  sync: { stroke: "#334155" },
  async: { stroke: "#f97316" },
  failure: { stroke: "#dc2626", dash: "6 5" },
  replay: { stroke: "#7c3aed", dash: "5 4" },
};

const edgeLabel: Record<EdgeKind, string> = {
  sync: "동기 호출",
  async: "비동기 경계",
  failure: "실패/복구 경로",
  replay: "수동 재처리",
};

export function renderDiagram(spec: DiagramSpec): string {
  validateDiagramSpec(spec);

  const nodesById = new Map(spec.nodes.map((node) => [node.id, node]));
  const renderedEdges = spec.edges.map((edge) => {
    const from = nodesById.get(edge.from);
    const to = nodesById.get(edge.to);

    if (!from || !to) {
      throw new Error(`${spec.slug}:${edge.id} references missing nodes`);
    }

    return renderEdge(edge, from, to);
  });

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}" role="img" aria-labelledby="${spec.slug}-title ${spec.slug}-desc">`,
    `  <!-- Generated from ${escapeXml(spec.sourceFile)}. Do not edit this SVG directly. -->`,
    `  <title id="${spec.slug}-title">${escapeXml(spec.title)}</title>`,
    `  <desc id="${spec.slug}-desc">${escapeXml(spec.description)}</desc>`,
    `  <rect width="${spec.width}" height="${spec.height}" fill="#ffffff"/>`,
    renderDefs(),
    `  <g id="background">`,
    `    <text x="40" y="42" text-anchor="start" font-family="Arial, sans-serif" font-size="16" font-weight="700" fill="#0f172a">${escapeXml(spec.title)}</text>`,
    `  </g>`,
    `  <g id="containers">`,
    ...(spec.containers ?? []).map(renderContainer),
    `  </g>`,
    `  <g id="edges">`,
    ...renderedEdges.map((item) => item.path),
    `  </g>`,
    `  <g id="edge-labels">`,
    ...renderedEdges.flatMap((item) => item.label),
    `  </g>`,
    `  <g id="nodes">`,
    ...spec.nodes.map(renderNode),
    `  </g>`,
    renderLegend(spec),
    `</svg>`,
    "",
  ].join("\n");
}

export function renderNode(node: DiagramNode): string {
  const style = nodeStyle[node.kind];
  const titleX = node.x + node.w / 2;
  const titleY = node.y + 31;
  const lineY = titleY + 24;

  return [
    `    <g id="node-${escapeXml(node.id)}">`,
    `      <rect x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" rx="8" fill="${style.fill}" stroke="${style.stroke}" stroke-width="${style.width}"/>`,
    `      <text x="${titleX}" y="${titleY}" text-anchor="middle" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#0f172a">${escapeXml(node.title)}</text>`,
    renderTextLines(titleX, lineY, node.lines, {
      fontSize: 12,
      lineHeight: 18,
      fill: "#475569",
    }),
    `    </g>`,
  ].join("\n");
}

export function renderEdge(
  edge: DiagramEdge,
  fromNode: DiagramNode,
  toNode: DiagramNode,
) {
  const from = getPort(fromNode, edge.fromPort);
  const to = getPort(toNode, edge.toPort);
  const points = [from, ...(edge.via ?? []), to];
  const style = edgeStyle[edge.kind];
  const path = orthogonalPath(points);
  const dash = style.dash ? ` stroke-dasharray="${style.dash}"` : "";
  const labelPosition = edge.label
    ? (edge.labelPosition ?? getPolylineMidpoint(points))
    : undefined;

  return {
    path: `    <path id="edge-${escapeXml(edge.id)}" d="${path}" fill="none" stroke="${style.stroke}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"${dash} marker-end="url(#arrow-${edge.kind})"/>`,
    label:
      labelPosition && edge.label ? [renderEdgeLabel(edge, labelPosition)] : [],
  };
}

export function getPort(node: Box, port: Port): Point {
  switch (port) {
    case "top":
      return { x: node.x + node.w / 2, y: node.y };
    case "right":
      return { x: node.x + node.w, y: node.y + node.h / 2 };
    case "bottom":
      return { x: node.x + node.w / 2, y: node.y + node.h };
    case "left":
      return { x: node.x, y: node.y + node.h / 2 };
  }
}

export function orthogonalPath(points: Point[]): string {
  if (points.length < 2) {
    throw new Error("orthogonalPath requires at least two points");
  }

  const [start, ...rest] = points;
  const commands = [`M ${start.x} ${start.y}`];
  let previous = start;

  for (const point of rest) {
    if (point.x === previous.x) {
      commands.push(`V ${point.y}`);
    } else if (point.y === previous.y) {
      commands.push(`H ${point.x}`);
    } else {
      throw new Error(
        `Diagonal segment is not allowed: ${previous.x},${previous.y} -> ${point.x},${point.y}`,
      );
    }
    previous = point;
  }

  return commands.join(" ");
}

export function renderTextLines(
  x: number,
  y: number,
  lines: string[],
  options: { fontSize: number; lineHeight: number; fill: string },
): string {
  if (!lines.length) {
    return "";
  }

  return [
    `      <text x="${x}" y="${y}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${options.fontSize}" font-weight="400" fill="${options.fill}">`,
    ...lines.map(
      (line, index) =>
        `        <tspan x="${x}" dy="${index === 0 ? 0 : options.lineHeight}">${escapeXml(line)}</tspan>`,
    ),
    `      </text>`,
  ].join("\n");
}

export function renderLegend(spec: DiagramSpec): string {
  const kinds = Array.from(new Set(spec.edges.map((edge) => edge.kind)));
  const startX = 40;
  const startY = spec.height - 32;
  let x = startX;
  const items = kinds.map((kind) => {
    const style = edgeStyle[kind];
    const label = edgeLabel[kind];
    const width = Math.max(96, label.length * 12 + 38);
    const item = [
      `    <g transform="translate(${x} ${startY - 16})">`,
      `      <line x1="0" y1="10" x2="24" y2="10" stroke="${style.stroke}" stroke-width="1.8"${style.dash ? ` stroke-dasharray="${style.dash}"` : ""} marker-end="url(#arrow-${kind})"/>`,
      `      <text x="34" y="14" font-family="Arial, sans-serif" font-size="12" fill="#475569">${escapeXml(label)}</text>`,
      `    </g>`,
    ].join("\n");
    x += width;
    return item;
  });

  return [`  <g id="legend">`, ...items, `  </g>`].join("\n");
}

export function validateDiagramSpec(spec: DiagramSpec) {
  const nodeIds = new Set<string>();

  for (const node of spec.nodes) {
    if (nodeIds.has(node.id)) {
      throw new Error(`${spec.slug}:${node.id} is duplicated`);
    }
    nodeIds.add(node.id);
    assertGrid(spec.slug, node);
    assertNodeHeight(spec.slug, node);
  }

  for (const edge of spec.edges) {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      throw new Error(`${spec.slug}:${edge.id} references missing node`);
    }
    assertOrthogonalEdge(spec.slug, edge, spec.nodes);
    assertNoUnrelatedNodeIntersection(spec.slug, edge, spec.nodes);
    assertEdgeLabelDoesNotOverlapNodes(spec.slug, edge, spec.nodes);
  }
}

function renderDefs() {
  return [
    `  <defs>`,
    ...Object.entries(edgeStyle).map(
      ([kind, style]) =>
        `    <marker id="arrow-${kind}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${style.stroke}"/></marker>`,
    ),
    `  </defs>`,
  ].join("\n");
}

function renderContainer(container: Box & { id: string; title: string }) {
  return [
    `    <g id="container-${escapeXml(container.id)}">`,
    `      <rect x="${container.x}" y="${container.y}" width="${container.w}" height="${container.h}" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2" stroke-dasharray="4 4"/>`,
    `      <text x="${container.x + 14}" y="${container.y + 24}" text-anchor="start" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#64748b">${escapeXml(container.title)}</text>`,
    `    </g>`,
  ].join("\n");
}

function renderEdgeLabel(edge: DiagramEdge, position: Point) {
  const label = edge.label ?? "";
  const width = Math.max(82, label.length * 10 + 22);
  const height = 22;
  const x = position.x - width / 2;
  const y = position.y - height / 2;

  return [
    `    <g id="edge-label-${escapeXml(edge.id)}">`,
    `      <rect x="${round(x)}" y="${round(y)}" width="${round(width)}" height="${height}" rx="11" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>`,
    `      <text x="${position.x}" y="${position.y + 4}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#475569">${escapeXml(label)}</text>`,
    `    </g>`,
  ].join("\n");
}

function assertGrid(slug: string, node: DiagramNode) {
  for (const [key, value] of Object.entries({
    x: node.x,
    y: node.y,
    w: node.w,
    h: node.h,
  })) {
    if (value % 20 !== 0) {
      throw new Error(`${slug}:${node.id}.${key} must align to 20px grid`);
    }
  }
}

function assertNodeHeight(slug: string, node: DiagramNode) {
  const required = 38 + node.lines.length * 18;

  if (node.h < required) {
    throw new Error(
      `${slug}:${node.id} height ${node.h} is too small for ${node.lines.length} lines`,
    );
  }
}

function assertOrthogonalEdge(
  slug: string,
  edge: DiagramEdge,
  nodes: DiagramNode[],
) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);

  if (!from || !to) {
    return;
  }

  const points = [
    getPort(from, edge.fromPort),
    ...(edge.via ?? []),
    getPort(to, edge.toPort),
  ];

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (previous.x !== current.x && previous.y !== current.y) {
      throw new Error(`${slug}:${edge.id} has a diagonal segment`);
    }
  }
}

function assertNoUnrelatedNodeIntersection(
  slug: string,
  edge: DiagramEdge,
  nodes: DiagramNode[],
) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);

  if (!from || !to) {
    return;
  }

  const points = [
    getPort(from, edge.fromPort),
    ...(edge.via ?? []),
    getPort(to, edge.toPort),
  ];

  for (let index = 1; index < points.length; index += 1) {
    const segment = { from: points[index - 1], to: points[index] };
    for (const node of nodes) {
      if (node.id === edge.from || node.id === edge.to) {
        continue;
      }
      if (segmentIntersectsBox(segment, node)) {
        throw new Error(`${slug}:${edge.id} crosses unrelated node ${node.id}`);
      }
    }
  }
}

function assertEdgeLabelDoesNotOverlapNodes(
  slug: string,
  edge: DiagramEdge,
  nodes: DiagramNode[],
) {
  if (!edge.label) {
    return;
  }

  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);

  if (!from || !to) {
    return;
  }

  const points = [
    getPort(from, edge.fromPort),
    ...(edge.via ?? []),
    getPort(to, edge.toPort),
  ];
  const labelPosition = edge.labelPosition ?? getPolylineMidpoint(points);
  const labelBox = getEdgeLabelBox(edge.label, labelPosition);

  for (const node of nodes) {
    if (boxesOverlap(labelBox, node)) {
      throw new Error(`${slug}:${edge.id} label overlaps node ${node.id}`);
    }
  }
}

function getEdgeLabelBox(label: string, position: Point): Box {
  const width = Math.max(82, label.length * 10 + 22);
  const height = 22;

  return {
    x: position.x - width / 2,
    y: position.y - height / 2,
    w: width,
    h: height,
  };
}

function boxesOverlap(a: Box, b: Box) {
  return (
    a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
  );
}

function segmentIntersectsBox(segment: { from: Point; to: Point }, box: Box) {
  const left = box.x + 4;
  const right = box.x + box.w - 4;
  const top = box.y + 4;
  const bottom = box.y + box.h - 4;

  if (segment.from.y === segment.to.y) {
    const y = segment.from.y;
    const minX = Math.min(segment.from.x, segment.to.x);
    const maxX = Math.max(segment.from.x, segment.to.x);
    return y > top && y < bottom && maxX > left && minX < right;
  }

  if (segment.from.x === segment.to.x) {
    const x = segment.from.x;
    const minY = Math.min(segment.from.y, segment.to.y);
    const maxY = Math.max(segment.from.y, segment.to.y);
    return x > left && x < right && maxY > top && minY < bottom;
  }

  return false;
}

function getPolylineMidpoint(points: Point[]) {
  const segments = [];
  let total = 0;

  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1];
    const to = points[index];
    const length = Math.abs(to.x - from.x) + Math.abs(to.y - from.y);
    segments.push({ from, to, length });
    total += length;
  }

  let remaining = total / 2;

  for (const segment of segments) {
    if (remaining <= segment.length) {
      if (segment.from.x === segment.to.x) {
        return {
          x: segment.from.x,
          y:
            segment.from.y +
            Math.sign(segment.to.y - segment.from.y) * remaining,
        };
      }

      return {
        x:
          segment.from.x + Math.sign(segment.to.x - segment.from.x) * remaining,
        y: segment.from.y,
      };
    }
    remaining -= segment.length;
  }

  return points[Math.floor(points.length / 2)];
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
