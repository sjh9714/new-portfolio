import type { Metadata } from "next";
import { ArrowUpRight, Download } from "lucide-react";

import { resume } from "@/content/resume";
import { createTopLevelMetadata } from "@/lib/site";

const description = "성진혁 Java/Spring 백엔드 개발자 웹 이력서.";
const socialDescription = "Java/Spring 백엔드 개발자 성진혁의 이력서.";

export const metadata: Metadata = {
  title: "Resume",
  description,
  ...createTopLevelMetadata({
    title: "Resume — 성진혁",
    description: socialDescription,
    path: "/resume",
  }),
};

export default function ResumePage() {
  return (
    <article className="resume-page page-shell">
      <header className="resume-header">
        <div>
          <p className="eyebrow">Resume</p>
          <h1>{resume.identity.name}</h1>
          <p>{resume.identity.role}</p>
        </div>
        <div className="resume-contact">
          <a href={`mailto:${resume.identity.email}`}>
            {resume.identity.email}
          </a>
          <a
            href={resume.identity.githubUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="성진혁 GitHub (새 창)"
          >
            github.com/sjh9714 <ArrowUpRight aria-hidden="true" size={14} />
          </a>
          <a
            className="resume-download"
            href="/resume-sung-jinhyuk-backend.pdf"
            target="_blank"
            rel="noreferrer"
            aria-label="PDF 이력서 (새 창)"
          >
            <Download aria-hidden="true" size={16} /> PDF
          </a>
        </div>
      </header>
      <section
        className="resume-summary"
        aria-labelledby="resume-summary-title"
      >
        <h2 id="resume-summary-title">Profile</h2>
        <div>
          <p>{resume.summary}</p>
          <ul>
            {resume.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
      <section className="resume-skills" aria-labelledby="skills-title">
        <h2 id="skills-title">Skills</h2>
        <div>
          {resume.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>
      <section
        className="resume-projects"
        aria-labelledby="resume-projects-title"
      >
        <h2 id="resume-projects-title">Selected work</h2>
        <div>
          {resume.projects.map((project) => (
            <article key={project.slug}>
              <div className="resume-project-heading">
                <h3>{project.title}</h3>
                <span>{project.setting}</span>
              </div>
              <p className="resume-role">{project.role}</p>
              <ul>
                <li>{project.summary}</li>
                <li>{project.contribution}</li>
                <li>{project.outcome}</li>
              </ul>
              <div className="resume-project-bottom">
                <span>{project.tech.join(" · ")}</span>
                <a href={project.repoUrl}>
                  {project.repoUrl.replace("https://", "")}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}
