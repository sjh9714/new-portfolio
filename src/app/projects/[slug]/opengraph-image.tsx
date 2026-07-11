import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { getProject } from "@/content/projects";

export const alt = "성진혁의 프로젝트 이야기 공유 이미지";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function ProjectOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const title = project.title;
  const summary = project.oneLiner;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: "#fffdf8",
        color: "#191c22",
        fontFamily: "sans-serif",
        border: "28px solid #ebe7df",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "#2455d6",
          fontSize: 20,
        }}
      >
        SELECTED WORK <span>SJH</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div
          style={{
            fontSize: 92,
            letterSpacing: -6,
            lineHeight: 1,
            fontWeight: 760,
          }}
        >
          {title}
        </div>
        <div
          style={{
            maxWidth: 930,
            color: "#5f6570",
            fontSize: 30,
            lineHeight: 1.45,
          }}
        >
          {summary}
        </div>
      </div>
      <div style={{ fontSize: 18, color: "#5f6570" }}>
        {project.overview.context}
      </div>
    </div>,
    size,
  );
}
