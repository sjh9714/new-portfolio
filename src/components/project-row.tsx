import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { ProjectStory } from "@/content/types";

import { ProjectArtwork } from "./project-artwork";

const kindLabel: Record<ProjectStory["kind"], string> = {
  "team-product": "Team product",
  "independent-product": "Independent product",
  "systems-product": "Systems product",
  "public-tool": "Public tool",
};

export function ProjectRow({
  project,
  index,
}: {
  project: ProjectStory;
  index: number;
}) {
  return (
    <article className="project-row">
      <Link
        className="project-media-link"
        href={`/projects/${project.slug}`}
        prefetch={false}
        aria-label={`${project.title} 프로젝트 이야기 보기`}
      >
        <ProjectArtwork media={project.media[0]} />
      </Link>
      <div className="project-row-copy">
        <div className="project-meta">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{kindLabel[project.kind]}</span>
        </div>
        <h3>
          <Link href={`/projects/${project.slug}`} prefetch={false}>
            {project.title}
          </Link>
        </h3>
        <p className="project-one-liner">{project.oneLiner}</p>
        <dl className="project-quick-facts">
          <div>
            <dt>Setting</dt>
            <dd>{project.setting}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Now</dt>
            <dd>{project.currentState}</dd>
          </div>
        </dl>
        <div className="project-row-actions">
          <Link
            className="text-link"
            href={`/projects/${project.slug}`}
            prefetch={false}
          >
            이야기 읽기 <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <a
            className="quiet-link"
            href={project.repoUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} GitHub 저장소 (새 창)`}
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </article>
  );
}
