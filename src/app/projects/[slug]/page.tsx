import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { GuidedFlow } from "@/components/guided-flow";
import { ProjectArtwork } from "@/components/project-artwork";
import { SourceList } from "@/components/source-list";
import { getProject, projects } from "@/content/projects";
import type { StoryChapter } from "@/content/types";

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

function Chapter({ chapter, index }: { chapter: StoryChapter; index: number }) {
  return (
    <section className="story-section page-shell" id={chapter.id}>
      <div className="story-section-label">
        <span>{String(index).padStart(2, "0")}</span>
        <div>
          <p className="eyebrow">{chapter.eyebrow}</p>
          <h2>{chapter.title}</h2>
        </div>
      </div>
      <div className="story-prose">
        <p className="story-summary">{chapter.summary}</p>
        <ul>
          {chapter.body.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {chapter.visualIds?.length ? (
          <ProjectArtwork visualIds={chapter.visualIds} showTranscript />
        ) : null}
        {chapter.proofId ? <SourceList sourceIds={[chapter.proofId]} /> : null}
      </div>
    </section>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <article>
      <header className="project-detail-hero page-shell">
        <Breadcrumbs
          items={[
            { label: "작업", href: "/projects" },
            { label: project.title },
          ]}
        />
        <div className="project-detail-headline">
          <div>
            <p className="eyebrow">{project.period}</p>
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
                GitHub에서 코드 보기
                <ArrowUpRight aria-hidden="true" size={18} />
              </a>
              <a className="secondary-action" href="#project-story">
                이야기부터 읽기
              </a>
            </div>
          </div>
          <aside className="project-summary-card" aria-label="프로젝트 요약">
            <p>한눈에 보기</p>
            <dl>
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
              <div>
                <dt>대표 근거</dt>
                <dd>{project.overview.proof}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </header>

      {project.visualIds.length > 0 ? (
        <section
          className="project-detail-media page-shell"
          aria-label="실제 화면"
        >
          <ProjectArtwork
            visualIds={project.visualIds}
            priority
            showTranscript
          />
        </section>
      ) : null}

      <div id="project-story">
        {project.kind === "team-product" ? (
          <>
            <section className="story-section page-shell">
              <div className="story-section-label">
                <span>01</span>
                <div>
                  <p className="eyebrow">팀 상황과 역할</p>
                  <h2>함께 만든 범위와 내가 맡은 범위</h2>
                </div>
              </div>
              <div className="story-prose">
                <p className="story-summary">{project.context}</p>
                <dl className="story-context">
                  <div>
                    <dt>기간</dt>
                    <dd>{project.duration}</dd>
                  </div>
                  <div>
                    <dt>팀</dt>
                    <dd>{project.team}</dd>
                  </div>
                  <div>
                    <dt>내 역할</dt>
                    <dd>{project.role}</dd>
                  </div>
                </dl>
                <h3>함께 연결한 순간</h3>
                <ul>
                  {project.collaboration.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
            {project.chapters.map((chapter, index) => (
              <Chapter key={chapter.id} chapter={chapter} index={index + 2} />
            ))}
            <section className="story-section page-shell">
              <div className="story-section-label">
                <span>
                  {String(project.chapters.length + 2).padStart(2, "0")}
                </span>
                <div>
                  <p className="eyebrow">당시 결과</p>
                  <h2>팀이 실제로 끝낸 범위</h2>
                </div>
              </div>
              <div className="story-prose">
                <ul>
                  {project.shippedOutcome.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
            {project.revisit?.map((chapter, index) => (
              <Chapter
                key={chapter.id}
                chapter={chapter}
                index={project.chapters.length + index + 3}
              />
            ))}
          </>
        ) : (
          <>
            <section className="story-section page-shell">
              <div className="story-section-label">
                <span>01</span>
                <div>
                  <p className="eyebrow">완성 기준</p>
                  <h2>사용자 여정을 완성 기준으로 삼았습니다</h2>
                </div>
              </div>
              <div className="story-prose">
                <p className="story-summary">{project.hypothesis}</p>
                <ol className="journey-list">
                  {project.userJourney.map((item, index) => (
                    <li key={item}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <p>{item}</p>
                    </li>
                  ))}
                </ol>
                <h3>먼저 정한 실패 시나리오</h3>
                <ul>
                  {project.acceptanceCriteria.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </section>
            {project.milestones.map((chapter, index) => (
              <Chapter key={chapter.id} chapter={chapter} index={index + 2} />
            ))}
          </>
        )}
      </div>

      {project.guidedFlows?.map((flow) => (
        <div className="flow-section page-shell" key={flow.id}>
          <Suspense fallback={<p>흐름을 준비하고 있습니다.</p>}>
            <GuidedFlow flow={flow} />
          </Suspense>
        </div>
      ))}

      <section className="story-section page-shell" id="proof">
        <div className="story-section-label">
          <span>✓</span>
          <div>
            <p className="eyebrow">공개 근거</p>
            <h2>문장의 범위를 확인할 수 있는 코드와 테스트</h2>
          </div>
        </div>
        <div className="story-prose">
          <SourceList sourceIds={project.sourceIds} />
        </div>
      </section>

      <section className="story-section page-shell" id="limitations">
        <div className="story-section-label">
          <span>—</span>
          <div>
            <p className="eyebrow">한계</p>
            <h2>이 프로젝트로 주장하지 않는 것</h2>
          </div>
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
          <ArrowLeft aria-hidden="true" size={18} /> 작업 목록으로 돌아가기
        </Link>
      </div>
    </article>
  );
}
