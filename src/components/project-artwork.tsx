import Image from "next/image";
import { Fragment } from "react";

import type { ProjectMedia } from "@/content/types";

type ProjectArtworkProps = {
  media: ProjectMedia;
  priority?: boolean;
};

function assertNever(media: never): never {
  throw new Error(`Unsupported project media: ${String(media)}`);
}

export function ProjectArtwork({ media, priority }: ProjectArtworkProps) {
  const artClassName = `project-art project-art-${media.accent}`;

  switch (media.kind) {
    case "product-preview":
      return (
        <div className={`${artClassName} project-art-product-preview`}>
          <Image
            src={media.imageSrc}
            alt={media.imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 900px) calc(100vw - 36px), 48vw"
          />
        </div>
      );
    case "story-timeline":
      return (
        <div
          className={`${artClassName} timeline-art`}
          role="img"
          aria-label={`${media.title}. ${media.description}`}
        >
          <p className="art-label">{media.eyebrow}</p>
          <div className="timeline-line" aria-hidden="true">
            {media.milestones.map((milestone, index) => (
              <Fragment key={milestone.label}>
                <span className="timeline-dot" />
                {index < media.milestones.length - 1 ? <i /> : null}
              </Fragment>
            ))}
          </div>
          <div className="timeline-copy">
            {media.milestones.map((milestone) => (
              <strong key={milestone.label}>{milestone.label}</strong>
            ))}
          </div>
          <div className="timeline-panels">
            {media.milestones.map((milestone) => (
              <div key={milestone.label}>
                <b>{milestone.title}</b>
                <span>{milestone.detail}</span>
              </div>
            ))}
          </div>
        </div>
      );
    case "scope-map":
      return (
        <div
          className={`${artClassName} scope-art`}
          role="img"
          aria-label={`${media.title}. ${media.description}`}
        >
          <p className="art-label">{media.eyebrow}</p>
          <div className="scope-path" aria-hidden="true">
            {media.stages.map((stage, index) => (
              <Fragment key={stage.index}>
                <div>
                  <span>{stage.index}</span>
                  <strong>{stage.label}</strong>
                </div>
                {index < media.stages.length - 1 ? <i /> : null}
              </Fragment>
            ))}
          </div>
          <p className="scope-note">{media.note}</p>
        </div>
      );
    default:
      return assertNever(media);
  }
}
