import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchitectureDiagram } from "@/components/architecture-diagram";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SourceList } from "@/components/source-list";
import { engineeringCases, getCase } from "@/content/cases";
import { getDiagram } from "@/content/diagrams";
import { getProject } from "@/content/projects";

export function generateStaticParams() {
  return engineeringCases.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) return {};
  const path = `/cases/${item.slug}`;
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: path },
    openGraph: {
      title: item.title,
      description: item.summary,
      url: path,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description: item.summary,
    },
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCase(slug);
  if (!item) notFound();
  const project = getProject(item.projectSlug);
  const diagram = getDiagram(item.diagramId);
  if (!project || !diagram) notFound();
  return (
    <article className="case-detail">
      <header className="case-hero page-shell">
        <Breadcrumbs
          items={[
            { label: "Work", href: "/projects" },
            { label: project.title, href: `/projects/${project.slug}` },
            { label: "Case" },
          ]}
        />
        <p className="eyebrow">{project.title} / Engineering case</p>
        <h1>{item.title}</h1>
        <p>{item.summary}</p>
        <a
          className="quiet-link"
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${project.title} GitHub 저장소 (새 창)`}
        >
          GitHub에서 코드 보기 ↗
        </a>
      </header>
      <section className="case-impact">
        <div className="page-shell">
          <span>User impact</span>
          <p>{item.userImpact}</p>
        </div>
      </section>
      <section className="case-content page-shell">
        <div className="case-copy-block">
          <p className="case-number">01</p>
          <div>
            <h2>어떻게 깨지는가</h2>
            <ul>
              {item.failureMode.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="case-copy-block">
          <p className="case-number">02</p>
          <div>
            <h2>지켜야 할 경계</h2>
            <ul>
              {item.constraints.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </div>
        <ArchitectureDiagram spec={diagram} />
        <div className="case-copy-block">
          <p className="case-number">03</p>
          <div>
            <h2>선택한 설계</h2>
            <ul>
              {item.decisions.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="case-copy-block">
          <p className="case-number">04</p>
          <div>
            <h2>감수한 trade-off</h2>
            <ul>
              {item.tradeoffs.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="case-copy-block">
          <p className="case-number">05</p>
          <div>
            <h2>어떻게 확인했는가</h2>
            <ul>
              {item.verification.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {item.flowSlugs.length > 0 ? (
        <section className="case-flow-cta">
          <div className="page-shell">
            <div>
              <p className="eyebrow">Replay the boundary</p>
              <h2>글 대신 단계별로 따라보기</h2>
            </div>
            {item.flowSlugs.map((flowSlug) => (
              <Link
                key={flowSlug}
                className="primary-action"
                href={`/flows/${flowSlug}`}
                prefetch={false}
              >
                <PlayCircle aria-hidden="true" /> Flow 재생
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      <section className="case-proof page-shell">
        <div>
          <p className="eyebrow">Sources</p>
          <h2>코드와 테스트로 돌아가기</h2>
        </div>
        <SourceList sourceIds={item.sourceIds} />
      </section>
      <details className="case-limitations page-shell">
        <summary>한계와 다음 확인</summary>
        <ul>
          {item.limitations.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </details>
      <div className="page-shell back-row">
        <Link
          className="text-link"
          href={`/projects/${project.slug}`}
          prefetch={false}
        >
          <ArrowLeft aria-hidden="true" size={18} /> {project.title}로 돌아가기
        </Link>
        <Link className="quiet-link" href="/cases" prefetch={false}>
          모든 사례 <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
      </div>
    </article>
  );
}
