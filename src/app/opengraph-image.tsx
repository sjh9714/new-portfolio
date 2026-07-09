import { ImageResponse } from "next/og";

export const alt = "Sung Jinhyuk Java Spring backend portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f8fafc",
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
        <span>JAVA / SPRING BACKEND</span>
        <span>PORTFOLIO</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            display: "flex",
            fontSize: 74,
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: -3,
          }}
        >
          SUNG JINHYUK
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 980,
            color: "#5f6b7a",
            fontSize: 32,
            lineHeight: 1.35,
          }}
        >
          Problem, decision, result, and reproducible evidence.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          borderTop: "1px solid #d9e0ea",
          paddingTop: 28,
          color: "#2f5682",
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        <span>CONCURRENCY</span>
        <span style={{ color: "#8b98aa" }}>/</span>
        <span>EVENT RECOVERY</span>
        <span style={{ color: "#8b98aa" }}>/</span>
        <span>REALTIME</span>
        <span style={{ color: "#8b98aa" }}>/</span>
        <span>BILLING</span>
      </div>
    </div>,
    size,
  );
}
