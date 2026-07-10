import type { Metadata } from "next";

export const siteName = "성진혁 — Java/Spring Backend";

export const siteDescription =
  "팀에서 만든 기능을 실제 화면에 연결하고, 시간이 지나도 깨지지 않도록 다시 검증하는 Java/Spring 백엔드 개발자 성진혁의 작업 기록.";

export const siteOgDescription =
  "팀 프로젝트, 실제 클라이언트, 실패 복구 흐름으로 읽는 성진혁의 작업 기록.";

export const siteSocialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "성진혁 — 만드는 데서 멈추지 않고 다시 확인합니다",
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
