"use client";

import { Maximize2, X } from "lucide-react";
import { useRef } from "react";

import type { DiagramSpec } from "@/content/types";

function DiagramSvg({ spec }: { spec: DiagramSpec }) {
  const nodeMap = new Map(spec.nodes.map((node) => [node.id, node]));
  const nodeHeight = 82;

  return (
    <svg
      className="diagram-svg"
      viewBox="0 0 1000 420"
      role="img"
      aria-labelledby={`${spec.id}-title ${spec.id}-desc`}
    >
      <title id={`${spec.id}-title`}>{spec.title}</title>
      <desc id={`${spec.id}-desc`}>{spec.caption}</desc>
      <defs>
        <marker
          id={`${spec.id}-arrow`}
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
          const startX = (from.x + from.width) * 10;
          const startY = from.y * 4.2;
          const endX = to.x * 10;
          const endY = to.y * 4.2;
          const curve = Math.max(28, (endX - startX) * 0.44);
          const path = `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`;
          return (
            <g key={edge.id}>
              <path d={path} markerEnd={`url(#${spec.id}-arrow)`} />
              <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 9}>
                {edge.label}
              </text>
            </g>
          );
        })}
      </g>
      <g className="diagram-nodes">
        {spec.nodes.map((node) => {
          const x = node.x * 10;
          const y = node.y * 4.2 - nodeHeight / 2;
          const width = node.width * 10;
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
        <DiagramSvg spec={spec} />
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
          <DiagramSvg spec={spec} />
        </div>
      </dialog>
    </figure>
  );
}
