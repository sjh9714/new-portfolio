import { describe, expect, it } from "vitest";

import { featuredProjects } from "@/content/projects";
import { resume } from "@/content/resume";

describe("resume content", () => {
  it("uses the four featured projects in the curated order", () => {
    expect(resume.projects.map((project) => project.slug)).toEqual(
      featuredProjects.map((project) => project.slug),
    );
    expect(resume.projects).toHaveLength(4);
  });

  it("links every resume project to commit-pinned public evidence", () => {
    for (const project of resume.projects) {
      expect(project.evidence.source.permalink).toMatch(
        /^https:\/\/github\.com\/[^/]+\/[^/]+\/blob\/[0-9a-f]{40}\//,
      );
      expect(project.evidence.label.trim()).not.toBe("");
      expect(project.evidence.value.trim()).not.toBe("");
    }
  });

  it("does not expose the unsupported historical BorrowMe metrics", () => {
    const publicProjectCopy = resume.projects.flatMap((project) => [
      project.problem,
      project.decision,
      project.result,
      project.evidence.label,
      project.evidence.value,
    ]);

    expect(publicProjectCopy.some((value) => value.includes("1,010"))).toBe(
      false,
    );
    expect(publicProjectCopy.some((value) => value.includes("201회"))).toBe(
      false,
    );
    expect(publicProjectCopy.some((value) => value.includes("→ 23ms"))).toBe(
      false,
    );
  });

  it("keeps unknown experience and education sections empty", () => {
    expect(resume.experience).toHaveLength(0);
    expect(resume.education).toHaveLength(0);
  });
});
