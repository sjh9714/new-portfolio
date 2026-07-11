import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

import { ProjectCompactRow, ProjectRow } from "@/components/project-row";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import {
  createTopLevelMetadata,
  getSiteUrl,
  siteDescription,
  siteName,
  siteOgDescription,
} from "@/lib/site";

export const metadata: Metadata = {
  description: siteDescription,
  ...createTopLevelMetadata({
    title: siteName,
    description: siteOgDescription,
    path: "/",
  }),
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: profile.name,
        alternateName: profile.englishName,
        url: getSiteUrl(),
        sameAs: [profile.githubUrl],
        jobTitle: "Java/Spring 백엔드 개발자",
      },
      {
        "@type": "ItemList",
        name: "대표 작업",
        itemListElement: featuredProjects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: project.title,
          url: `${getSiteUrl()}/projects/${project.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section className="home-hero page-shell" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">{profile.role}</p>
          <h1 id="home-title">{profile.name}</h1>
          <p className="hero-statement">
            API를 실제 화면과 AWS에 연결하고,
            <br /> 실패 복구를 브라우저 E2E까지 검증했습니다.
          </p>
          <p className="hero-lead">{profile.summary}</p>
          <div className="hero-actions">
            <a className="primary-action" href="#selected-work">
              프로젝트 보기 <ArrowDown aria-hidden="true" size={18} />
            </a>
            <Link className="secondary-action" href="/resume" prefetch={false}>
              <FileText aria-hidden="true" size={18} /> 이력서
            </Link>
            <a
              className="secondary-action"
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="성진혁 GitHub (새 창)"
            >
              GitHub <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
          <a className="hero-email" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>

        <aside className="hero-proof" aria-label="경험 요약">
          <p>한눈에 보기</p>
          <dl>
            <div>
              <dt>팀 제품</dt>
              <dd>화면 연동과 AWS 배포</dd>
            </div>
            <div>
              <dt>개인 시스템</dt>
              <dd>실패 복구와 브라우저 E2E</dd>
            </div>
            <div>
              <dt>대표 작업</dt>
              <dd>Memory · Concert · Realtime · BorrowMe</dd>
            </div>
            <div>
              <dt>근거</dt>
              <dd>공개 커밋과 테스트 permalink</dd>
            </div>
          </dl>
          <Link href="/projects/memory-of-year" prefetch={false}>
            첫 프로젝트 바로 보기 <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </aside>
      </section>

      <section
        className="selected-work page-shell"
        id="selected-work"
        aria-labelledby="selected-title"
      >
        <header className="section-heading">
          <div>
            <p className="eyebrow">대표 작업 · 4개</p>
            <h2 id="selected-title">대표 작업</h2>
          </div>
          <p>
            팀에서 실제 화면과 배포까지 연결한 경험부터, 실패 시나리오를
            클라이언트와 E2E로 재현한 개인 프로젝트까지 이어집니다.
          </p>
        </header>
        <div className="project-list home-project-list">
          <ProjectRow project={featuredProjects[0]} index={0} lead />
          <div className="compact-project-list">
            {featuredProjects.slice(1).map((project, index) => (
              <ProjectCompactRow
                key={project.slug}
                project={project}
                index={index + 1}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
