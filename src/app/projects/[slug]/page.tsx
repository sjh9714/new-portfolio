import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProjectArtwork } from "@/components/project-artwork";
import { SourceList } from "@/components/source-list";
import { getCasesForProject } from "@/content/cases";
import { getDiagram } from "@/content/diagrams";
import { getFlow } from "@/content/flows";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const path = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.oneLiner,
    alternates: { canonical: path },
    openGraph: {
      title: project.title,
      description: project.oneLiner,
      url: path,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.oneLiner,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const cases = getCasesForProject(project.slug);
  const diagram = getDiagram(`project-${project.slug}`);

  return (
    <article>
      <header className="project-detail-hero page-shell">
        <Breadcrumbs
          items={[
            { label: "Work", href: "/projects" },
            { label: project.title },
          ]}
        />
        <div className="project-detail-headline project-detail-headline-single">
          <div>
            <p className="eyebrow">{project.setting}</p>
            <h1>{project.title}</h1>
            <p>{project.oneLiner}</p>
            <div className="project-detail-actions">
              <a
                className="primary-action"
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.title} GitHub 저장소 (새 창)`}
              >
                GitHub 보기 <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              {project.demoUrl ? (
                <a
                  className="secondary-action"
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.title} Demo (새 창)`}
                >
                  Demo 열기
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="project-detail-media page-shell">
        <ProjectArtwork
          projectSlug={project.slug}
          title={project.title}
          media={project.media[0]}
          priority
        />
      </div>

      <section
        className="story-section page-shell"
        aria-labelledby="origin-title"
      >
        <div className="story-section-label">
          <span>01</span>
          <h2 id="origin-title">왜 시작됐는가</h2>
        </div>
        <div className="story-prose lead-prose">
          <p>{project.origin}</p>
        </div>
      </section>

      <section
        className="story-section page-shell"
        aria-labelledby="context-title"
      >
        <div className="story-section-label">
          <span>02</span>
          <h2 id="context-title">누구와 어떤 상황에서 만들었는가</h2>
        </div>
        <dl className="story-context">
          <div>
            <dt>Setting</dt>
            <dd>{project.setting}</dd>
          </div>
          <div>
            <dt>Audience</dt>
            <dd>{project.audience}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
        </dl>
      </section>

      <section
        className="story-section page-shell"
        aria-labelledby="owned-title"
      >
        <div className="story-section-label">
          <span>03</span>
          <h2 id="owned-title">내가 맡은 범위</h2>
        </div>
        <div className="story-prose">
          <ul>
            {project.contributions.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="story-section page-shell"
        aria-labelledby="journey-title"
      >
        <div className="story-section-label">
          <span>04</span>
          <h2 id="journey-title">실제 사용자 흐름</h2>
        </div>
        <div className="story-prose wide">
          <ol className="project-journey">
            {project.userJourney.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
          {diagram ? <ArchitectureDiagram spec={diagram} /> : null}
        </div>
      </section>

      <section
        className="story-section timeline-section page-shell"
        aria-labelledby="turning-title"
      >
        <div className="story-section-label">
          <span>05</span>
          <h2 id="turning-title">전환점과 발견한 문제</h2>
        </div>
        <div className="story-prose wide turning-story">
          <blockquote>{project.turningPoint}</blockquote>
          <div className="story-timeline">
            {project.timeline.map((item) => (
              <div key={`${item.label}-${item.title}`}>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="story-section turning-section page-shell"
        aria-labelledby="outcome-title"
      >
        <div className="story-section-label">
          <span>06</span>
          <h2 id="outcome-title">현재 결과</h2>
        </div>
        <div className="story-prose">
          <p className="current-state">{project.currentState}</p>
          <ul>
            {project.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {cases.length > 0 ? (
        <section className="project-deep-dives" aria-labelledby="deep-title">
          <div className="page-shell">
            <div className="section-heading compact">
              <div>
                <p className="eyebrow">Engineering cases</p>
                <h2 id="deep-title">한 번에 한 경계만 깊게</h2>
              </div>
            </div>
            <div className="deep-dive-list">
              {cases.map((item, index) => (
                <Link
                  key={item.slug}
                  href={`/cases/${item.slug}`}
                  prefetch={false}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                  </div>
                  <ArrowUpRight aria-hidden="true" />
                </Link>
              ))}
            </div>
            {project.flowSlugs.length > 0 ? (
              <div className="flow-project-links">
                <p>이 프로젝트의 흐름을 단계별로 재생할 수 있습니다.</p>
                {project.flowSlugs.map((flowSlug) => (
                  <Link
                    key={flowSlug}
                    href={`/flows/${flowSlug}`}
                    prefetch={false}
                    aria-label={`${getFlow(flowSlug)?.title ?? project.title} Flow 재생하기`}
                  >
                    <PlayCircle aria-hidden="true" /> Flow 재생하기
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section
        className="story-section page-shell"
        aria-labelledby="proof-title"
      >
        <div className="story-section-label">
          <span>07</span>
          <h2 id="proof-title">공개 근거</h2>
        </div>
        <div className="story-prose wide">
          <SourceList sourceIds={project.sourceIds} />
        </div>
      </section>

      <section
        className="story-section page-shell"
        aria-labelledby="limits-title"
      >
        <div className="story-section-label">
          <span>08</span>
          <h2 id="limits-title">말하지 않는 것</h2>
        </div>
        <div className="story-prose">
          <ul className="limitations">
            {project.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="tech-list" aria-label="기술 스택">
            {project.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
      </section>
      <div className="page-shell back-row">
        <Link className="text-link" href="/projects" prefetch={false}>
          <ArrowLeft aria-hidden="true" size={18} /> Work로 돌아가기
        </Link>
      </div>
    </article>
  );
}
