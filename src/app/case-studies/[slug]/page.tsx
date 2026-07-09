import { notFound, permanentRedirect } from "next/navigation";

import { CaseStudyArticle } from "@/components/case-study-article";
import {
  caseStudies,
  getCaseStudyBySlug,
  legacyCaseStudyAliases,
} from "@/content/portfolio-cases";
import { getProjectBySlug } from "@/content/projects";
import { createPageMetadata } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const alias = legacyCaseStudyAliases.get(slug);
  const resolvedSlug = alias && !alias.startsWith("/") ? alias : slug;
  const caseStudy = getCaseStudyBySlug(resolvedSlug);

  if (!caseStudy) {
    return createPageMetadata({
      title: "문제 해결 사례",
      path: `/case-studies/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: caseStudy.title,
    description: caseStudy.summary,
    path: `/case-studies/${caseStudy.slug}`,
    imagePath: `/case-studies/${caseStudy.slug}/opengraph-image`,
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const alias = legacyCaseStudyAliases.get(slug);

  if (alias) {
    permanentRedirect(alias.startsWith("/") ? alias : `/case-studies/${alias}`);
  }

  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const project = getProjectBySlug(caseStudy.projectSlug);

  if (!project) {
    notFound();
  }

  return <CaseStudyArticle caseStudy={caseStudy} project={project} />;
}
