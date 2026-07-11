import { ImageResponse } from "next/og";

export const alt = "성진혁 — 화면에 연결하고 실패 뒤까지 확인합니다";
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
        background: "#f7f5f0",
        color: "#191c22",
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
        <div style={{ color: "#2455d6", fontSize: 20, letterSpacing: 2 }}>
          신입 JAVA / SPRING 백엔드 개발자
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
          <span>화면에 연결하고,</span>
          <span>실패 뒤까지 확인합니다.</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          color: "#5f6570",
        }}
      >
        <span>팀 화면·AWS 배포 · 실패 복구·브라우저 E2E</span>
        <span>sjh9714</span>
      </div>
    </div>,
    size,
  );
}
