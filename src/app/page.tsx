import { ArrowDown, ArrowUpRight, Code2, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ProjectRow } from "@/components/project-row";
import { profile } from "@/content/profile";
import { alsoShipped, featuredProjects } from "@/content/projects";
import { getSiteUrl } from "@/lib/site";

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
        jobTitle: "Java / Spring Backend Developer",
      },
      {
        "@type": "ItemList",
        name: "Selected Work",
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

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-grid page-shell">
          <aside className="hero-profile" aria-label="프로필">
            <div className="hero-avatar">
              <Image
                src={profile.avatarUrl}
                alt="빈티지 타자기가 놓인 성진혁의 GitHub 프로필 이미지"
                fill
                priority
                sizes="176px"
              />
            </div>
            <div className="hero-profile-meta">
              <span>Profile / 01</span>
              <strong>{profile.englishName}</strong>
              <p>{profile.role}</p>
            </div>
            <p className="hero-profile-note">
              코드는 오래 남습니다. 그래서 다시 읽고 확인할 수 있어야 합니다.
            </p>
          </aside>
          <div className="hero-copy">
            <div className="hero-copy-inner">
              <p className="hero-role">{profile.role}</p>
              <h1 id="home-title">
                <span>{profile.name}</span>
                만드는 데서 멈추지 않고,
                <br />
                다시 확인합니다.
              </h1>
              <p className="hero-lead">{profile.headline}</p>
              <p className="hero-summary">{profile.summary}</p>
              <div className="hero-actions">
                <a className="primary-action" href="#selected-work">
                  작업 보기 <ArrowDown aria-hidden="true" size={18} />
                </a>
                <Link
                  className="secondary-action"
                  href="/resume"
                  prefetch={false}
                >
                  <FileText aria-hidden="true" size={18} /> 이력서
                </Link>
                <a
                  className="secondary-action"
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="성진혁 GitHub (새 창)"
                >
                  <Code2 aria-hidden="true" size={18} /> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="selected-work page-shell"
        id="selected-work"
        aria-labelledby="selected-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Selected work / 04</p>
            <h2 id="selected-title">
              서로 다른 <span className="keep-together">네 개의 이야기</span>
            </h2>
          </div>
          <p>
            팀에서 화면까지 연결한 경험과, 혼자 만든 시스템을 실제 사용 흐름으로
            끝낸 경험을 함께 보여줍니다.
          </p>
        </div>
        <div className="project-list">
          {featuredProjects.map((project, index) => (
            <ProjectRow key={project.slug} project={project} index={index} />
          ))}
        </div>
        <div className="section-end-link">
          <Link className="text-link" href="/projects" prefetch={false}>
            전체 작업 보기 <ArrowUpRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>

      <section className="working-pattern">
        <div className="page-shell pattern-grid">
          <div>
            <p className="eyebrow">Working pattern</p>
            <h2>이야기와 근거의 역할을 나눕니다.</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>맥락을 먼저 설명합니다.</strong>
                <p>누구와 왜 만들었고 무엇을 맡았는지부터 시작합니다.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>전환점을 숨기지 않습니다.</strong>
                <p>
                  클라이언트를 붙이며 드러난 결함과 다시 설계한 이유를 남깁니다.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>근거는 마지막에 연결합니다.</strong>
                <p>커밋·PR·테스트가 이야기의 범위를 넘지 않도록 분리합니다.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section
        className="also-shipped page-shell"
        aria-labelledby="shipped-title"
      >
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Also shipped</p>
            <h2 id="shipped-title">다른 방식으로 전달한 작업</h2>
          </div>
        </div>
        <div className="shipped-list">
          {alsoShipped.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${item.title} GitHub (새 창)`}
            >
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
