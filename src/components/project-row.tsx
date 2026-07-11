import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type { ProjectStory } from "@/content/types";

import { ProjectArtwork } from "./project-artwork";

const kindLabel: Record<ProjectStory["kind"], string> = {
  "team-product": "팀 프로젝트",
  "productized-system": "개인 시스템 프로젝트",
};

export function ProjectRow({
  project,
  index,
  lead = false,
}: {
  project: ProjectStory;
  index: number;
  lead?: boolean;
}) {
  return (
    <article className={`project-row ${lead ? "project-row-lead" : ""}`}>
      {project.visualIds.length > 0 ? (
        <Link
          className="project-media-link"
          href={`/projects/${project.slug}`}
          prefetch={false}
          aria-label={`${project.title} 프로젝트 이야기 보기`}
        >
          <ProjectArtwork
            visualIds={lead ? project.visualIds : project.visualIds.slice(0, 1)}
            priority={lead}
            compact={!lead}
          />
        </Link>
      ) : (
        <div
          className="project-text-visual"
          aria-label="BorrowMe 대여 상태 요약"
        >
          <span>대여 생명주기</span>
          <strong>요청 → 승인 → 인도 → 반납</strong>
          <p>역할·재고·알림·전이 이력이 한 요청에서 함께 바뀝니다.</p>
        </div>
      )}

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
            <dt>맥락</dt>
            <dd>{project.overview.context}</dd>
          </div>
          <div>
            <dt>역할</dt>
            <dd>{project.overview.role}</dd>
          </div>
          <div>
            <dt>전환점</dt>
            <dd>{project.overview.turningPoint}</dd>
          </div>
        </dl>
        <div className="project-row-actions">
          <Link
            className="text-link"
            href={`/projects/${project.slug}`}
            prefetch={false}
          >
            프로젝트 읽기 <ArrowUpRight size={17} aria-hidden="true" />
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

export function ProjectCompactRow({
  project,
  index,
}: {
  project: ProjectStory;
  index: number;
}) {
  return (
    <article className="project-compact-row">
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>
          <Link href={`/projects/${project.slug}`} prefetch={false}>
            {project.title}
          </Link>
        </h3>
        <p>{project.oneLiner}</p>
      </div>
      <span className="compact-kind">{kindLabel[project.kind]}</span>
      <Link
        className="compact-arrow"
        href={`/projects/${project.slug}`}
        prefetch={false}
        aria-label={`${project.title} 프로젝트 이야기 보기`}
      >
        <ArrowUpRight aria-hidden="true" />
      </Link>
    </article>
  );
}
