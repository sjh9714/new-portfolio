import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";

import { ProjectRow } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getFeaturedPortfolioProjectGroups,
  getSupportingProjects,
} from "@/content/portfolio-cases";
import { additionalProjects } from "@/content/projects";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "이력서",
  description: "성진혁 백엔드 포트폴리오 웹 이력서.",
};

const coreSkillGroups = [
  {
    title: "Backend",
    skills: ["Java", "Spring Boot", "JPA", "REST API"],
  },
  {
    title: "Data / Consistency",
    skills: ["PostgreSQL", "Redis", "트랜잭션 경계", "Idempotency"],
  },
  {
    title: "Messaging / Realtime",
    skills: ["Kafka", "RabbitMQ", "WebSocket", "STOMP", "Outbox", "DLT"],
  },
  {
    title: "Testing / Operations",
    skills: ["Testcontainers", "k6", "Docker", "Prometheus", "Grafana"],
  },
];

const resumePdfFileName = "resume-sung-jinhyuk-backend.pdf";
const supportingAdditionalProjects = getSupportingProjects(additionalProjects);
const featuredPortfolioProjectGroups = getFeaturedPortfolioProjectGroups();

export default function ResumePage() {
  const resumeExists = existsSync(
    path.join(process.cwd(), "public", resumePdfFileName),
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-12 md:px-8 md:py-16 print:max-w-none print:px-0 print:py-0">
      <header className="border-border flex flex-col gap-5 border-b pb-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.18em] uppercase">
            웹 이력서
          </p>
          <h1 className="text-foreground text-4xl font-bold tracking-tight">
            {profile.name} / {profile.role}
          </h1>
          <p className="text-foreground text-sm font-medium">
            지원 구분: 신입 / 주니어 백엔드 개발자 · 관심 포지션: Java/Spring
            백엔드
          </p>
          <p className="text-muted-foreground max-w-3xl text-base leading-7">
            {profile.headline}
          </p>
        </div>
        {resumeExists ? (
          <Button asChild>
            <a
              href={`/${resumePdfFileName}`}
              download="sung-jinhyuk-resume.pdf"
            >
              PDF 다운로드
            </a>
          </Button>
        ) : null}
      </header>

      <section className="flex flex-col gap-4">
        <SectionHeader title="백엔드 요약" />
        <p className="text-muted-foreground text-sm leading-7">
          고동시성 예매, 실시간 메시징, 멀티테넌트 과금, SAGA/Outbox 보상 흐름을
          문제-해결-결과 구조로 정리했습니다. 측정한 수치와 아직 검증이 필요한
          항목을 구분해 면접에서 검증 가능한 대화를 유도합니다.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader title="핵심 기술" />
        <div className="grid gap-4 md:grid-cols-2">
          {coreSkillGroups.map((group) => (
            <div
              key={group.title}
              className="border-border flex flex-col gap-3 border p-4"
            >
              <h2 className="text-foreground text-sm font-semibold">
                {group.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="rounded-md">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeader
          title="대표 문제 해결 문장"
          description="이력서의 한 줄이 포트폴리오 상세 문서로 이어지도록 구성했습니다."
        />
        <div className="border-border border-y">
          {featuredPortfolioProjectGroups.map(({ project, cases }) => (
            <article
              key={project.slug}
              className="border-border grid gap-4 border-b py-5 last:border-b-0 lg:grid-cols-[1fr_2.4fr_1fr] lg:items-start"
            >
              <div>
                <h3 className="text-foreground font-semibold">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {cases
                    .map((portfolioCase) => portfolioCase.domain)
                    .join(" / ")}
                </p>
                <p className="text-muted-foreground mt-2 text-xs">
                  {project.team ?? project.role}
                </p>
              </div>
              <ul className="text-foreground flex list-disc flex-col gap-2 pl-5 text-sm leading-7 [overflow-wrap:anywhere]">
                {cases.map((portfolioCase) => (
                  <li key={portfolioCase.slug}>{portfolioCase.resumeLine}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {project.primaryTechStack.map((tech) => (
                  <Badge key={tech} variant="outline" className="rounded-md">
                    {tech}
                  </Badge>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 print:hidden">
        <SectionHeader title="추가 프로젝트" />
        <div className="border-border border-y">
          {supportingAdditionalProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="border-border flex flex-col gap-3 border p-5">
          <h2 className="text-foreground text-lg font-semibold">관심 문제</h2>
          <p className="text-muted-foreground text-sm leading-7">
            Java/Spring 백엔드에서 동시성 제어, 이벤트 정합성, 실시간 메시징,
            멀티테넌트 과금 흐름을 테스트와 수치로 설명하는 데 집중합니다.
          </p>
        </div>
        <div className="border-border flex flex-col gap-3 border p-5">
          <h2 className="text-foreground text-lg font-semibold">링크</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/projects">프로젝트</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={`mailto:${profile.email}`}>이메일</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
