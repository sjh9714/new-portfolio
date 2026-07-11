import type { Metadata } from "next";

export const siteName = "성진혁 — Java/Spring Backend";

export const siteDescription =
  "팀 프로젝트에서 API를 실제 화면과 AWS에 연결하고, 개인 프로젝트에서는 실패 복구를 브라우저 E2E까지 검증한 Java/Spring 백엔드 개발자 성진혁의 포트폴리오.";

export const siteOgDescription =
  "팀 제품의 화면·배포 경험과 동시성·실시간 메시징의 실패 복구를 실제 코드와 테스트로 읽습니다.";

export const siteSocialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "성진혁 — 화면에 연결하고 실패 뒤까지 확인합니다",
  type: "image/png",
} as const;

export function createTopLevelMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: `/${string}` | "/";
}): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  return {
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      type: "website",
      url: path,
      locale: "ko_KR",
      siteName,
      images: [siteSocialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteSocialImage],
    },
  };
}

export function getSiteUrl() {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://new-portfolio-smoky-one-41.vercel.app";
  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute http(s) URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an http(s) URL");
  }

  const isOriginOnly =
    !parsed.username &&
    !parsed.password &&
    parsed.pathname === "/" &&
    !parsed.search &&
    !parsed.hash &&
    parsed.href === `${parsed.origin}/`;
  if (!isOriginOnly) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be origin-only without credentials, path, query, or hash",
    );
  }

  if (process.env.NODE_ENV === "production" && parsed.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production");
  }

  return parsed.origin;
}
