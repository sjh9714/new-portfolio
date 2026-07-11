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
    "팀 프로젝트에서 Spring API를 실제 프론트엔드와 AWS 배포 환경까지 연결했습니다.",
    "동시성·메시징 실험을 사용자 흐름과 브라우저 E2E가 있는 제품 형태로 완성했습니다.",
    "팀 기여와 개인 후속 개선을 분리하고, 기술 주장은 공개 커밋과 테스트로 연결합니다.",
  ],
  skills: [
    "Java",
    "Spring Boot",
    "JPA",
    "MySQL / PostgreSQL",
    "Redis",
    "Kafka",
    "Testcontainers",
    "React / TypeScript",
  ],
  projects: projects.map((project) => {
    const firstChapter =
      project.kind === "team-product"
        ? project.chapters[0]
        : project.milestones[0];
    const outcome =
      project.kind === "team-product"
        ? project.shippedOutcome[0]
        : project.acceptanceCriteria[0];

    return {
      slug: project.slug,
      title: project.title,
      setting: project.overview.context,
      role: project.overview.role,
      summary: project.oneLiner,
      contribution: firstChapter.summary,
      outcome,
      tech: project.tech,
      repoUrl: project.repoUrl,
    };
  }),
} as const;
