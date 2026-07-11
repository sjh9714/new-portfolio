import Image from "next/image";

import type { VisualAsset } from "@/content/types";
import { getVisuals } from "@/content/visuals";

type ProjectArtworkProps = {
  visualIds: readonly string[];
  priority?: boolean;
  compact?: boolean;
  showTranscript?: boolean;
};

function VisualFigure({
  visual,
  priority,
}: {
  visual: VisualAsset;
  priority?: boolean;
}) {
  return (
    <figure className="project-visual">
      <div className="project-visual-image">
        <Image
          src={visual.src}
          alt={visual.alt}
          width={visual.width}
          height={visual.height}
          priority={priority}
          unoptimized={visual.src.endsWith(".gif")}
          sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1100px) 46vw, 560px"
        />
      </div>
      <figcaption>{visual.caption}</figcaption>
    </figure>
  );
}

export function ProjectArtwork({
  visualIds,
  priority,
  compact = false,
  showTranscript = false,
}: ProjectArtworkProps) {
  const visuals = getVisuals(visualIds);
  if (visuals.length === 0) return null;

  return (
    <div className="project-visual-block">
      <div
        className={`project-visuals ${visuals.length > 1 ? "project-visuals-gallery" : "project-visuals-single"} ${compact ? "is-compact" : ""}`}
      >
        {visuals.map((visual, index) => (
          <VisualFigure
            key={visual.id}
            visual={visual}
            priority={priority && index === 0}
          />
        ))}
      </div>
      {showTranscript ? (
        <details className="visual-transcript">
          <summary>이미지 설명 읽기</summary>
          {visuals.map((visual) => (
            <div key={visual.id}>
              <strong>{visual.caption}</strong>
              <ol>
                {visual.transcript.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </div>
          ))}
        </details>
      ) : null}
    </div>
  );
}
