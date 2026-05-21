export const siteName = "성진혁 Backend Portfolio";

export const siteDescription =
  "동시성, 이벤트 정합성, 실시간 메시징, 과금/정산 도메인을 테스트와 수치로 검증하는 Java/Spring 백엔드 포트폴리오.";

export const siteOgDescription =
  "Java/Spring backend portfolio focused on concurrency, event consistency, realtime messaging, and billing.";

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}
