import { profile } from "./profile";
import { projects } from "./projects";

export const resume = {
  identity: {
    name: profile.name,
    role: profile.role,
    email: profile.email,
    githubUrl: profile.githubUrl,
  },
  summary: profile.headline,
  strengths: [
    "팀에서 맡은 범위와 개인 후속 개선을 분리해 설명합니다.",
    "백엔드 경계를 실제 클라이언트 상태와 브라우저 E2E까지 연결합니다.",
    "성능 배수보다 현재 재현되는 불변식과 source permalink를 남깁니다.",
  ],
  skills: [
    "Java",
    "Spring Boot",
    "JPA",
    "PostgreSQL / MySQL",
    "Redis",
    "Kafka",
    "Testcontainers",
    "React / TypeScript",
  ],
  projects: projects.map((project) => ({
    slug: project.slug,
    title: project.title,
    setting: project.setting,
    role: project.role,
    summary: project.oneLiner,
    contribution: project.contributions[0],
    outcome: project.outcomes[0],
    tech: project.tech,
    repoUrl: project.repoUrl,
  })),
} as const;
