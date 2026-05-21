import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";

import { ProjectRow } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  additionalProjects,
  featuredProjects,
} from "@/content/projects";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: "Web resume for SJH backend portfolio.",
};

const coreSkills = [
  "Java",
  "Spring Boot",
  "JPA",
  "PostgreSQL",
  "Redis",
  "Kafka",
  "RabbitMQ",
  "Testcontainers",
  "k6",
  "Docker",
];

export default function ResumePage() {
  const resumeExists = existsSync(path.join(process.cwd(), "public", "resume.pdf"));

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-12 md:px-8 md:py-16 print:max-w-none print:px-0 print:py-0">
      <header className="flex flex-col gap-5 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Web Resume
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {profile.name} / {profile.role}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            {profile.headline}
          </p>
        </div>
        {resumeExists ? (
          <Button asChild>
            <a href="/resume.pdf">PDF 다운로드</a>
          </Button>
        ) : (
          <Button disabled aria-label="public/resume.pdf가 아직 없습니다">
            PDF 준비 중
          </Button>
        )}
      </header>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Backend Summary" />
        <p className="text-sm leading-7 text-muted-foreground">
          고동시성 예매, 실시간 메시징, 멀티테넌트 과금, SAGA/Outbox 보상 흐름을 문제-해결-결과 구조로 정리했습니다. 측정한 수치와 아직 검증이 필요한 항목을 구분해 면접에서 검증 가능한 대화를 유도합니다.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Core Skills" />
        <div className="flex flex-wrap gap-2">
          {coreSkills.map((skill) => (
            <Badge key={skill} variant="outline" className="rounded-md">
              {skill}
            </Badge>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <SectionHeader title="Featured Projects" />
        <div className="border-y border-border">
          {featuredProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 print:hidden">
        <SectionHeader title="Additional Projects" />
        <div className="border-y border-border">
          {additionalProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-3 border border-border p-5">
          <h2 className="text-lg font-semibold text-foreground">
            Education / Activities
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            프로젝트 중심 포트폴리오입니다. 별도 학력/활동 정보는 제공된 범위에 없어 추가하지 않았습니다.
          </p>
        </div>
        <div className="flex flex-col gap-3 border border-border p-5">
          <h2 className="text-lg font-semibold text-foreground">Links</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/projects">Projects</Link>
            </Button>
            <Button disabled variant="outline">
              Blog 준비 중
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
