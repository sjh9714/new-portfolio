export const siteName = "성진혁 — Java/Spring Backend";

export const siteDescription =
  "팀에서 만든 기능을 실제 화면에 연결하고, 시간이 지나도 깨지지 않도록 다시 검증하는 Java/Spring 백엔드 개발자 성진혁의 작업 기록.";

export const siteOgDescription =
  "팀 프로젝트, 실제 클라이언트, 실패 복구 흐름으로 읽는 성진혁의 작업 기록.";

export function getSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://new-portfolio-smoky-one-41.vercel.app";
  const parsed = new URL(candidate);

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an http(s) URL");
  }

  return parsed.toString().replace(/\/$/, "");
}
