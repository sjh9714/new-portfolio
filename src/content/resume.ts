import { profile } from "@/content/profile";
import {
  featuredProjects,
  getEvidenceByIds,
  type Evidence,
  type ProjectSummary,
} from "@/content/projects";

export type ResumeExperience = {
  organization: string;
  role?: string;
  period?: string;
  contributions?: readonly string[];
};

export type ResumeEducation = {
  institution: string;
  program?: string;
  period?: string;
  details?: readonly string[];
};

export type ResumeProject = Pick<
  ProjectSummary,
  | "slug"
  | "title"
  | "domain"
  | "role"
  | "team"
  | "period"
  | "problem"
  | "decision"
  | "result"
  | "tech"
  | "repoUrl"
> & {
  contribution?: string;
  evidence: ResumeEvidence;
};

export type ResumeEvidence = Pick<
  Evidence,
  "id" | "status" | "scope" | "label" | "value" | "source"
>;

function toResumeProject(project: ProjectSummary): ResumeProject {
  const [evidence] = getEvidenceByIds(project.evidenceIds);

  if (!evidence) {
    throw new Error(
      `Resume project "${project.slug}" requires at least one public evidence item.`,
    );
  }

  return {
    slug: project.slug,
    title: project.title,
    domain: project.domain,
    role: project.role,
    team: project.team,
    period: project.period,
    problem: project.problem,
    decision: project.decision,
    result: project.result,
    tech: project.tech,
    repoUrl: project.repoUrl,
    evidence: {
      id: evidence.id,
      status: evidence.status,
      scope: evidence.scope,
      label: evidence.label,
      value: evidence.value,
      source: evidence.source,
    },
  };
}

const skills = Array.from(
  new Set(featuredProjects.flatMap((project) => project.tech)),
);

const projectContributions: Partial<Record<ProjectSummary["slug"], string>> =
  {};

export const resume = {
  identity: {
    name: profile.name,
    role: "Java / Spring 백엔드 개발자",
    email: profile.email,
    githubUrl: profile.githubUrl,
  },
  summary: profile.headline,
  skills,
  projects: featuredProjects.map((project) => ({
    ...toResumeProject(project),
    contribution: projectContributions[project.slug],
  })),
  experience: [] as ResumeExperience[],
  education: [] as ResumeEducation[],
} as const;
