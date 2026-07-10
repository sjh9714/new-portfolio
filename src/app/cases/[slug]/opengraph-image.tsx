import { ImageResponse } from "next/og";

import { getCase } from "@/content/cases";
import { getProject } from "@/content/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function CaseOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getCase(slug);
  const project = item ? getProject(item.projectSlug) : undefined;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 68,
        background: "#1f2328",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#9eb8ff",
          fontSize: 20,
          letterSpacing: 2,
        }}
      >
        ENGINEERING CASE / {project?.title ?? "SJH"}
      </div>
      <div
        style={{
          maxWidth: 1060,
          fontSize: 68,
          lineHeight: 1.08,
          letterSpacing: -3,
          fontWeight: 740,
        }}
      >
        {item?.title ?? "Engineering Case"}
      </div>
      <div
        style={{
          maxWidth: 950,
          color: "#b8c0c9",
          fontSize: 24,
          lineHeight: 1.45,
        }}
      >
        {item?.summary}
      </div>
    </div>,
    size,
  );
}
