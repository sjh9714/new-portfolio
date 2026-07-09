import type { Metadata } from "next";

export const siteName = "성진혁 백엔드 포트폴리오";
export const siteOwnerName = "성진혁";
export const siteRole = "Java/Spring 백엔드 개발자";

export const siteDescription =
  "동시성, 이벤트 복구, 실시간 메시징, 과금 정합성을 재현 가능한 근거로 설명하는 Java/Spring 백엔드 포트폴리오.";

export const siteOgDescription =
  "문제, 설계 판단, 결과, 검증 근거를 빠르게 확인할 수 있는 Java/Spring 백엔드 포트폴리오.";

export const siteUrlFallback = "https://new-portfolio-smoky-one-41.vercel.app";

const supportedProtocols = new Set(["http:", "https:"]);

function parseSiteUrl(value: string): URL {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an absolute URL. Received: ${value}`,
    );
  }

  if (!supportedProtocols.has(url.protocol)) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must use http or https. Received: ${value}`,
    );
  }

  if (
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.pathname !== "/" && url.pathname !== "")
  ) {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must contain only an origin. Received: ${value}`,
    );
  }

  return url;
}

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const url = parseSiteUrl(configuredUrl || siteUrlFallback);

  return url.origin;
}

export function normalizeRoutePath(path = "/") {
  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;

  if (withLeadingSlash === "/") {
    return withLeadingSlash;
  }

  return withLeadingSlash.replace(/\/+$/, "");
}

export function getAbsoluteUrl(path = "/") {
  const normalizedPath = normalizeRoutePath(path);

  return new URL(normalizedPath, `${getSiteUrl()}/`).toString();
}

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  imagePath?: string;
  noIndex?: boolean;
};

export function getFullPageTitle(title?: string) {
  return title ? `${title} | ${siteName}` : siteName;
}

export function createPageMetadata({
  title,
  description = siteDescription,
  path = "/",
  imagePath,
  noIndex = false,
}: PageMetadataOptions = {}): Metadata {
  const routePath = normalizeRoutePath(path);
  const canonicalUrl = getAbsoluteUrl(routePath);
  const resolvedImagePath = imagePath ?? "/opengraph-image";
  const imageUrl = getAbsoluteUrl(resolvedImagePath);
  const fullTitle = getFullPageTitle(title);

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      locale: "ko_KR",
      siteName,
      url: canonicalUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
  };
}

export function createRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    ...createPageMetadata({
      description: siteDescription,
      path: "/",
    }),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
  };
}
