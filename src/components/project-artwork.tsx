import Image from "next/image";

import type { ProjectMedia } from "@/content/types";

type ProjectArtworkProps = {
  projectSlug: string;
  title: string;
  media: ProjectMedia;
  priority?: boolean;
};

export function ProjectArtwork({
  projectSlug,
  title,
  media,
  priority,
}: ProjectArtworkProps) {
  if (media.imageSrc && media.imageAlt) {
    return (
      <div className={`project-art project-art-${media.accent}`}>
        <Image
          src={media.imageSrc}
          alt={media.imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 800px) 100vw, 48vw"
        />
      </div>
    );
  }

  if (projectSlug === "borrow-me") {
    return (
      <div
        className="project-art project-art-green timeline-art"
        role="img"
        aria-label={`${title} 두 시기 작업을 요약한 그래픽`}
      >
        <p className="art-label">TWO CHAPTERS</p>
        <div className="timeline-line" aria-hidden="true">
          <span className="timeline-dot" />
          <i />
          <span className="timeline-dot" />
        </div>
        <div className="timeline-copy">
          <strong>2024</strong>
          <strong>2026</strong>
        </div>
        <div className="timeline-panels">
          <div>
            <b>Team demo</b>
            <span>댓글 알림 → REST → Client</span>
          </div>
          <div>
            <b>Return & verify</b>
            <span>Query guard → Stock invariant</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="project-art project-art-amber scope-art"
      role="img"
      aria-label={`${title} 담당 범위를 요약한 그래픽`}
    >
      <p className="art-label">OWNED BACKEND SCOPE</p>
      <div className="scope-path" aria-hidden="true">
        <div>
          <span>01</span>
          <strong>Auth</strong>
        </div>
        <i />
        <div>
          <span>02</span>
          <strong>Album</strong>
        </div>
        <i />
        <div>
          <span>03</span>
          <strong>Letter</strong>
        </div>
        <i />
        <div>
          <span>04</span>
          <strong>Photo</strong>
        </div>
      </div>
      <p className="scope-note">Team client integration & demo</p>
    </div>
  );
}
