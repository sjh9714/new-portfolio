import {
  getAbsoluteUrl,
  siteDescription,
  siteOwnerName,
  siteRole,
} from "@/lib/site";

type PersonStructuredDataOptions = {
  githubUrl?: string;
};

type CaseListItem = {
  slug: string;
  title: string;
};

export function createPersonStructuredData({
  githubUrl,
}: PersonStructuredDataOptions = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteOwnerName,
    jobTitle: siteRole,
    description: siteDescription,
    url: getAbsoluteUrl("/"),
    ...(githubUrl ? { sameAs: [githubUrl] } : {}),
  };
}

export function createCaseStudyItemListStructuredData(cases: CaseListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "대표 백엔드 문제 해결 사례",
    numberOfItems: cases.length,
    itemListElement: cases.map((caseStudy, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: caseStudy.title,
      url: getAbsoluteUrl(`/case-studies/${caseStudy.slug}`),
    })),
  };
}

export function serializeStructuredData(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
