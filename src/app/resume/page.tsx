import { resume } from "@/content/resume";
import { createPageMetadata, getSiteUrl } from "@/lib/site";

import styles from "./resume.module.css";

const resumeFileName = "resume-sung-jinhyuk-backend.pdf";
const resumeDescription =
  "성진혁 Java/Spring 백엔드 개발자의 대표 문제 해결 사례와 검증 근거를 정리한 이력서.";

export const metadata = createPageMetadata({
  title: "이력서",
  description: resumeDescription,
  path: "/resume",
});

const evidenceStatusLabel = {
  measured: "측정 완료",
  verified: "시나리오 검증",
} as const;

export default function ResumePage() {
  const portfolioUrl = `${getSiteUrl()}/case-studies`;

  return (
    <article id="resume-document" className={styles.page}>
      <div className={styles.toolbar}>
        <a
          className={styles.download}
          href={`/${resumeFileName}`}
          download="sung-jinhyuk-backend-resume.pdf"
        >
          PDF 이력서
        </a>
      </div>

      <div className={styles.sheet}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Backend Engineer</p>
            <h1 className={styles.name}>{resume.identity.name}</h1>
            <p className={styles.role}>{resume.identity.role}</p>
          </div>

          <address className={styles.contact} aria-label="연락처">
            <a className={styles.link} href={`mailto:${resume.identity.email}`}>
              {resume.identity.email}
            </a>
            <a
              className={styles.link}
              href={resume.identity.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="성진혁 GitHub (새 창)"
            >
              github.com/sjh9714
            </a>
            <a
              className={styles.link}
              href={portfolioUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="성진혁 문제 해결 사례 (새 창)"
            >
              Portfolio / Case Studies
            </a>
          </address>
        </header>

        <ResumeSection title="Profile">
          <p className={styles.summary}>{resume.summary}</p>
        </ResumeSection>

        <ResumeSection title="Core Stack">
          <ul className={styles.skillList} aria-label="핵심 기술">
            {resume.skills.map((skill) => (
              <li key={skill} className={styles.skill}>
                {skill}
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection title="Selected Work">
          <ol className={styles.projectList}>
            {resume.projects.map((project) => (
              <li key={project.slug} className={styles.project}>
                <div className={styles.projectHeader}>
                  <div>
                    <h3 className={styles.projectTitle}>{project.title}</h3>
                    <p className={styles.projectMeta}>
                      {[
                        project.domain,
                        project.team ?? project.role,
                        project.period,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <a
                    className={`${styles.link} ${styles.projectLink}`}
                    href={project.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title} GitHub 저장소 (새 창)`}
                  >
                    GitHub
                  </a>
                </div>

                <dl className={styles.facts}>
                  <div className={styles.fact}>
                    <dt>문제</dt>
                    <dd>{project.problem}</dd>
                  </div>
                  {project.contribution ? (
                    <div className={styles.fact}>
                      <dt>기여</dt>
                      <dd>{project.contribution}</dd>
                    </div>
                  ) : null}
                  <div className={styles.fact}>
                    <dt>판단</dt>
                    <dd>{project.decision}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>결과</dt>
                    <dd>{project.result}</dd>
                  </div>
                  <div className={styles.fact}>
                    <dt>근거</dt>
                    <dd className={styles.evidenceRow}>
                      <span
                        className={`${styles.evidenceBadge} ${
                          project.evidence.status === "measured"
                            ? styles.evidenceBadgeMeasured
                            : ""
                        }`}
                      >
                        {evidenceStatusLabel[project.evidence.status]}
                      </span>
                      <span>
                        <span className={styles.evidenceLabel}>
                          {project.evidence.label}
                        </span>{" "}
                        <span className={styles.evidenceValue}>
                          {project.evidence.value}
                        </span>
                      </span>
                      <a
                        className={styles.link}
                        href={project.evidence.source.permalink}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} 검증 근거 (새 창)`}
                      >
                        근거 보기
                      </a>
                    </dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </ResumeSection>

        {resume.experience.length > 0 ? (
          <ResumeSection title="Experience">
            <ul className={styles.compactList}>
              {resume.experience.map((item) => (
                <li
                  key={`${item.organization}-${item.role ?? "role"}`}
                  className={styles.compactItem}
                >
                  <h3 className={styles.compactItemTitle}>
                    {item.organization}
                  </h3>
                  {[item.role, item.period].filter(Boolean).length > 0 ? (
                    <p className={styles.compactItemMeta}>
                      {[item.role, item.period].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                  {item.contributions?.map((contribution) => (
                    <p key={contribution} className={styles.compactItemText}>
                      {contribution}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </ResumeSection>
        ) : null}

        {resume.education.length > 0 ? (
          <ResumeSection title="Education">
            <ul className={styles.compactList}>
              {resume.education.map((item) => (
                <li
                  key={`${item.institution}-${item.program ?? "program"}`}
                  className={styles.compactItem}
                >
                  <h3 className={styles.compactItemTitle}>
                    {item.institution}
                  </h3>
                  {[item.program, item.period].filter(Boolean).length > 0 ? (
                    <p className={styles.compactItemMeta}>
                      {[item.program, item.period].filter(Boolean).join(" · ")}
                    </p>
                  ) : null}
                  {item.details?.map((detail) => (
                    <p key={detail} className={styles.compactItemText}>
                      {detail}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </ResumeSection>
        ) : null}

        <footer className={styles.footer}>
          <span>대표 4개 프로젝트 · 공개 근거가 연결된 사실만 수록</span>
          <a
            className={styles.link}
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="성진혁 포트폴리오 상세 사례 (새 창)"
          >
            상세 사례와 구조도 보기
          </a>
        </footer>
      </div>
    </article>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
