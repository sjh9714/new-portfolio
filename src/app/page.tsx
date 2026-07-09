import { ArrowRight, FileDown, Mail } from "lucide-react";
import Link from "next/link";

import { EvidenceMatrix } from "@/components/evidence-matrix";
import { ExpertiseMap } from "@/components/expertise-map";
import { ProjectBand } from "@/components/project-band";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/content/portfolio-cases";
import { featuredProjects, getEvidenceByIds } from "@/content/projects";
import { profile } from "@/content/profile";
import {
  createCaseStudyItemListStructuredData,
  createPersonStructuredData,
  serializeStructuredData,
} from "@/lib/structured-data";

const homeProofProjectSlugs = [
  "concert-booking",
  "realtime-chat",
  "ai-usage-billing-gateway",
] as const;

const homeProofEvidence = homeProofProjectSlugs.flatMap((projectSlug) => {
  const caseStudy = caseStudies.find(
    (candidate) => candidate.projectSlug === projectSlug,
  );

  return caseStudy
    ? getEvidenceByIds(caseStudy.heroEvidenceIds).slice(0, 1)
    : [];
});

export default function Home() {
  const personJsonLd = createPersonStructuredData({
    githubUrl: profile.githubUrl,
  });
  const caseListJsonLd = createCaseStudyItemListStructuredData(
    caseStudies.map(({ slug, title }) => ({ slug, title })),
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(personJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeStructuredData(caseListJsonLd),
        }}
      />

      <section className="border-border bg-card border-b">
        <div className="page-shell grid min-h-[calc(100svh-4rem)] content-center gap-10 py-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.6fr)] lg:items-center lg:gap-16 lg:py-14">
          <div className="hero-sequence grid max-w-4xl gap-6">
            <p className="section-kicker">Java / Spring Backend</p>
            <h1 className="heading-wrap text-foreground text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.98] font-bold tracking-[-0.065em]">
              Java/Spring
              <br />
              백엔드 개발자
              <span className="text-primary mt-3 block text-[0.42em] tracking-[-0.035em]">
                성진혁
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg leading-8 md:text-xl">
              {profile.headline}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="#featured-projects">
                  대표 사례 보기
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href="/resume-sung-jinhyuk-backend.pdf"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="PDF 이력서 (새 창)"
                >
                  PDF 이력서
                  <FileDown aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          <aside
            aria-labelledby="home-proof-title"
            className="border-border border-t lg:border-t-0 lg:border-l lg:pl-8"
          >
            <h2 id="home-proof-title" className="sr-only">
              대표 검증 근거
            </h2>
            {homeProofEvidence.map((evidence) => (
              <div
                key={evidence.id}
                className="border-border grid gap-2 border-b py-4 first:pt-5 lg:py-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-foreground text-sm font-semibold">
                    {evidence.label}
                  </p>
                  <StatusBadge status={evidence.status} />
                </div>
                <p className="text-primary font-mono text-base font-bold [overflow-wrap:anywhere]">
                  {evidence.value}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="page-shell py-14 md:py-20">
        <ExpertiseMap />
      </section>

      <section
        id="featured-projects"
        aria-labelledby="featured-projects-title"
        className="border-border bg-card border-y"
      >
        <div className="page-shell py-14 md:py-20">
          <div className="grid gap-4 md:grid-cols-[1fr_1.2fr] md:items-end">
            <div>
              <p className="section-kicker">Featured / 04</p>
              <h2
                id="featured-projects-title"
                className="heading-wrap text-foreground mt-3 text-3xl font-bold tracking-[-0.035em] md:text-5xl"
              >
                문제보다 먼저 기술을 고르지 않았습니다.
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xl text-base leading-7 md:justify-self-end">
              각 프로젝트를 문제·설계 판단·결과·근거 순서로 읽을 수 있게
              정리했습니다. 상세 사례는 하나의 실패 경계만 깊게 다룹니다.
            </p>
          </div>

          <div className="border-border mt-10 border-b">
            {featuredProjects.map((project, index) => (
              <ProjectBand key={project.slug} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-8 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-14 md:py-20">
        <div>
          <p className="section-kicker">Evidence rule</p>
          <h2 className="heading-wrap text-foreground mt-3 text-3xl font-bold tracking-[-0.035em] md:text-4xl">
            공개 근거의 기준을 분리합니다.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md text-base leading-7">
            수치는 환경과 날짜가 있을 때만 측정 근거로, 정합성은 반복 가능한
            테스트가 있을 때만 검증 근거로 표시합니다.
          </p>
        </div>
        <EvidenceMatrix />
      </section>

      <section className="border-border bg-card border-t">
        <div className="page-shell flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
          <div>
            <p className="section-kicker">Contact</p>
            <h2 className="text-foreground mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              구현보다 판단의 근거를 함께 이야기하고 싶습니다.
            </h2>
          </div>
          <Button asChild variant="outline" size="lg">
            <a href={`mailto:${profile.email}`}>
              이메일 보내기
              <Mail aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
