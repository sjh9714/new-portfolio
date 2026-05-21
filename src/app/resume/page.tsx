import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";

import { ProjectRow } from "@/components/project-card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { additionalProjects, featuredProjects } from "@/content/projects";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Resume",
  description: "Web resume for 성진혁 backend portfolio.",
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
  const resumeExists = existsSync(
    path.join(process.cwd(), "public", "resume.pdf"),
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-12 md:px-8 md:py-16 print:max-w-none print:px-0 print:py-0">
      <header className="border-border flex flex-col gap-5 border-b pb-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-sm font-semibold tracking-[0.18em] uppercase">
            Web Resume
          </p>
          <h1 className="text-foreground text-4xl font-bold tracking-tight">
            {profile.name} / {profile.role}
          </h1>
          <p className="text-muted-foreground max-w-3xl text-base leading-7">
            {profile.headline}
          </p>
        </div>
        {resumeExists ? (
          <Button asChild>
            <a href="/resume.pdf">PDF 다운로드</a>
          </Button>
        ) : null}
      </header>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Backend Summary" />
        <p className="text-muted-foreground text-sm leading-7">
          고동시성 예매, 실시간 메시징, 멀티테넌트 과금, SAGA/Outbox 보상 흐름을
          문제-해결-결과 구조로 정리했습니다. 측정한 수치와 아직 검증이 필요한
          항목을 구분해 면접에서 검증 가능한 대화를 유도합니다.
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
        <div className="border-border border-y">
          {featuredProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 print:hidden">
        <SectionHeader title="Additional Projects" />
        <div className="border-border border-y">
          {additionalProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="border-border flex flex-col gap-3 border p-5">
          <h2 className="text-foreground text-lg font-semibold">Work Focus</h2>
          <p className="text-muted-foreground text-sm leading-7">
            Java/Spring 백엔드에서 동시성 제어, 이벤트 정합성, 실시간 메시징,
            멀티테넌트 과금 흐름을 테스트와 수치로 설명하는 데 집중합니다.
          </p>
        </div>
        <div className="border-border flex flex-col gap-3 border p-5">
          <h2 className="text-foreground text-lg font-semibold">Links</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/projects">Projects</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={`mailto:${profile.email}`}>Email</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
