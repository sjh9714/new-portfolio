import { ImageResponse } from "next/og";

export const alt = "성진혁 — 만드는 데서 멈추지 않고 다시 확인합니다";
export const size = { width: 1200, height: 630 };
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
        padding: 64,
        background: "#f6f8fa",
        color: "#1f2328",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        <span
          style={{
            width: 50,
            height: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 25,
            background: "#1f2328",
            color: "white",
            fontSize: 13,
          }}
        >
          SJH
        </span>
        성진혁
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ color: "#2457d6", fontSize: 20, letterSpacing: 2 }}>
          JAVA / SPRING BACKEND
        </div>
        <div
          style={{
            maxWidth: 1040,
            display: "flex",
            flexDirection: "column",
            fontSize: 76,
            lineHeight: 1.05,
            letterSpacing: -4,
            fontWeight: 760,
          }}
        >
          <span>만드는 데서 멈추지 않고,</span>
          <span>다시 확인합니다.</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          color: "#59636e",
        }}
      >
        <span>Team products · Product clients · Source-backed stories</span>
        <span>sjh9714</span>
      </div>
    </div>,
    size,
  );
}
