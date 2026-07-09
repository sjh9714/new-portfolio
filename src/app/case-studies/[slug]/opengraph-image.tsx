import { ImageResponse } from "next/og";

import { getPortfolioCaseBySlug } from "@/content/portfolio-cases";
import { getProjectBySlug } from "@/content/projects";

export const alt = "Backend case study by Sung Jinhyuk";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type OpenGraphImageProps = {
  params: Promise<{ slug: string }>;
};

function formatSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" / ");
}

export default async function CaseStudyOpenGraphImage({
  params,
}: OpenGraphImageProps) {
  const { slug } = await params;
  const caseStudy = getPortfolioCaseBySlug(slug);
  const project = caseStudy
    ? getProjectBySlug(caseStudy.projectSlug)
    : undefined;
  const projectLabel = project?.title ?? "Backend Case Study";
  const caseLabel = formatSlug(caseStudy?.slug ?? slug);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        color: "#111827",
        padding: "64px 72px",
        border: "1px solid #d9e0ea",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#416fa6",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        <span>BACKEND CASE STUDY</span>
        <span>SUNG JINHYUK</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            display: "flex",
            color: "#5f6b7a",
            fontSize: 27,
            fontWeight: 600,
          }}
        >
          {projectLabel}
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 1040,
            fontSize: caseLabel.length > 52 ? 46 : 56,
            lineHeight: 1.18,
            fontWeight: 800,
            letterSpacing: -1.5,
          }}
        >
          {caseLabel}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #d9e0ea",
          paddingTop: 28,
          color: "#5f6b7a",
          fontSize: 23,
        }}
      >
        <span>JAVA / SPRING</span>
        <span style={{ color: "#2f5682", fontWeight: 700 }}>
          REPRODUCIBLE EVIDENCE
        </span>
      </div>
    </div>,
    size,
  );
}
