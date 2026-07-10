import { ImageResponse } from "next/og";

import { getFlow } from "@/content/flows";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function FlowOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const flow = getFlow(slug);
  const steps =
    flow?.variants.find((variant) => variant.id === flow.initialVariant)?.steps
      .length ?? 0;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 66,
        background: "#e7eeff",
        color: "#173f9f",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          letterSpacing: 2,
        }}
      >
        INTERACTIVE FLOW <span>{steps} STEPS</span>
      </div>
      <div
        style={{
          maxWidth: 1050,
          fontSize: 76,
          lineHeight: 1.06,
          letterSpacing: -4,
          fontWeight: 760,
        }}
      >
        {flow?.title ?? "Flow"}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {Array.from({ length: Math.max(steps, 3) }, (_, index) => (
          <span
            key={index}
            style={{
              flex: 1,
              height: 8,
              borderRadius: 8,
              background: index === 0 ? "#2457d6" : "#b9caff",
            }}
          />
        ))}
      </div>
    </div>,
    size,
  );
}
