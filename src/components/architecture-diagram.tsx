"use client";

import { Maximize2, X } from "lucide-react";
import { useId, useRef } from "react";

import type { DiagramSpec } from "@/content/types";

type DiagramLayout = "desktop" | "compact";

function DiagramSvg({
  spec,
  layout,
}: {
  spec: DiagramSpec;
  layout: DiagramLayout;
}) {
  const reactId = useId();
  const instanceId = `${spec.id}-${reactId.replace(/:/g, "")}`;
  const titleId = `${instanceId}-title`;
  const descriptionId = `${instanceId}-desc`;
  const markerId = `${instanceId}-arrow`;
  const isCompact = layout === "compact";
  const viewBoxWidth = isCompact ? 300 : 1000;
  const viewBoxHeight = isCompact ? 840 : 420;
  const xScale = viewBoxWidth / 100;
  const yScale = viewBoxHeight / 100;
  const nodeHeight = 82;
  const nodes = spec.nodes.map((node) => ({
    ...node,
    x: isCompact ? node.compact.x : node.x,
    y: isCompact ? node.compact.y : node.y,
    width: isCompact ? node.compact.width : node.width,
  }));
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return (
    <svg
      className={`diagram-svg diagram-svg-${layout}`}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>{spec.title}</title>
      <desc id={descriptionId}>{spec.caption}</desc>
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 z" fill="currentColor" />
        </marker>
      </defs>
      <g className="diagram-edges">
        {spec.edges.map((edge) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          const fromCenterY = from.y * yScale;
          const toCenterY = to.y * yScale;
          const direction = toCenterY >= fromCenterY ? 1 : -1;
          const startX = isCompact
            ? (from.x + from.width / 2) * xScale
            : (from.x + from.width) * xScale;
          const startY = isCompact
            ? fromCenterY + (nodeHeight / 2) * direction
            : fromCenterY;
          const endX = isCompact
            ? (to.x + to.width / 2) * xScale
            : to.x * xScale;
          const endY = isCompact
            ? toCenterY - (nodeHeight / 2) * direction
            : toCenterY;
          const curve = isCompact
            ? Math.max(28, Math.abs(endY - startY) * 0.36)
            : Math.max(28, (endX - startX) * 0.44);
          const path = isCompact
            ? `M ${startX} ${startY} C ${startX} ${startY + curve * direction}, ${endX} ${endY - curve * direction}, ${endX} ${endY}`
            : `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;
          return (
            <g key={edge.id}>
              <path d={path} markerEnd={`url(#${markerId})`} />
              <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 9}>
                {edge.label}
              </text>
            </g>
          );
        })}
      </g>
      <g className="diagram-nodes">
        {nodes.map((node) => {
          const x = node.x * xScale;
          const y = node.y * yScale - nodeHeight / 2;
          const width = node.width * xScale;
          return (
            <g
              key={node.id}
              className={`diagram-node tone-${node.tone ?? "default"}`}
            >
              <rect x={x} y={y} width={width} height={nodeHeight} rx="12" />
              <text className="diagram-node-label" x={x + 17} y={y + 33}>
                {node.label}
              </text>
              <text className="diagram-node-detail" x={x + 17} y={y + 57}>
                {node.detail}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function ArchitectureDiagram({ spec }: { spec: DiagramSpec }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <figure className="architecture-figure">
      <div className="diagram-desktop">
        <DiagramSvg spec={spec} layout="desktop" />
      </div>
      <div className="diagram-mobile">
        <ol>
          {spec.mobileSteps.map((step) => (
            <li key={step.text}>{step.text}</li>
          ))}
        </ol>
        <button type="button" onClick={() => dialogRef.current?.showModal()}>
          <Maximize2 aria-hidden="true" size={17} /> 전체 구조도 보기
        </button>
      </div>
      <figcaption>{spec.caption}</figcaption>
      <dialog
        className="diagram-dialog"
        ref={dialogRef}
        aria-label={`${spec.title} 전체 구조도`}
      >
        <div className="dialog-toolbar">
          <strong>{spec.title}</strong>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="전체 구조도 닫기"
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="dialog-canvas">
          <DiagramSvg spec={spec} layout="compact" />
        </div>
      </dialog>
    </figure>
  );
}
